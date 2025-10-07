/**
 * GitHub Repository API Service
 * Fetches and processes data from public GitHub repositories
 */

import * as yaml from 'js-yaml';
import { DateTime } from 'luxon';
import { marked } from 'marked';
import {
  RepositoryParams,
  GitHubRepositoryData,
  ProcessedRepositoryData,
  TrainingData,
  EvaluationData,
  RepositoryMeta,
  ProcessedTrainingEntry,
  ProcessedEvaluationData,
  EvaluationEntry,
  EvaluatorInfo,
  TrainingFile,
  EvaluationFile
} from '../types/github-repository';

// Configure marked options
marked.setOptions({
  pedantic: false,
  gfm: true
});

export class GitHubRepositoryService {
  /**
   * Builds the raw GitHub URL for fetching files
   */
  private static buildRawUrl(repository: string, path: string): string {
    const baseUrl = repository.replace("github.com", "https://raw.githubusercontent.com");
    return `${baseUrl}/main/${path}`;
  }

  /**
   * Fetches and parses YAML content from a URL
   */
  private static async fetchYaml<T = any>(url: string): Promise<T> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} for URL: ${url}`);
      }

      const yamlText = await response.text();
      const data = yaml.load(yamlText) as T;
      
      if (!data) {
        throw new Error(`Failed to parse YAML from URL: ${url}`);
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch YAML:', error);
      throw new Error(`Failed to fetch YAML from ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }


  /**
   * Processes markdown content safely
   */
  private static async processMarkdown(content: string | null | undefined): Promise<string | null> {
    if (!content) return null;
    try {
      const result = await marked(content);
      return typeof result === 'string' ? result : content;
    } catch (error) {
      console.error('Failed to process markdown:', error);
      return content; // Return original content if markdown processing fails
    }
  }

  /**
   * Finds evaluation data for a training entry
   */
  private static findEvaluationData(entryId: string, evaluations: EvaluationEntry[], evaluator?: string | EvaluatorInfo): ProcessedEvaluationData {
    const evaluation = evaluations.find((d) => d.id === entryId);
    if (!evaluation || !evaluation.measurements || evaluation.measurements.length === 0) {
      return { score: undefined };
    }

    // Calculate average score across all measurements for backward compatibility
    const averageScore = evaluation.measurements.reduce((sum, m) => sum + (m.score || 0), 0) / evaluation.measurements.length;
    
    // Combine notes from all measurements
    const allNotes = evaluation.measurements
      .map(m => m.notes || m.comment || m.remarks)
      .filter(Boolean)
      .join(' | ');

    return {
      score: Math.round(averageScore * 100) / 100, // Round to 2 decimal places
      notes: allNotes || undefined,
      evaluator,
      measurements: evaluation.measurements
    };
  }

  /**
   * Processes training data with evaluations and markdown
   * Optimized with batch processing and concurrent markdown rendering
   */
  private static async processTrainingData(
    trainingData: TrainingData,
    evaluationData: EvaluationData
  ): Promise<ProcessedTrainingEntry[]> {
    // Process entries with concurrency control for markdown rendering
    const processedEntries = await this.processBatches(
      trainingData.content,
      async (entry) => {
        // Parse datetime
        const dateTime = entry.datetime ? new Date(entry.datetime) : null;
        const luxonDateTime = dateTime ? DateTime.fromJSDate(dateTime) : null;

        // Process markdown fields in parallel
        const [doing_today, done_yesterday, blockers] = await Promise.all([
          this.processMarkdown(entry.doing_today),
          this.processMarkdown(entry.done_yesterday),
          this.processMarkdown(entry.blockers)
        ]);

        return {
          ...entry,
          datetimeReadable: dateTime ? dateTime.toISOString().substr(0, 10) : '',
          dateTimeRelative: luxonDateTime ? luxonDateTime.toRelative({ unit: 'days' }) : null,
          doing_today,
          done_yesterday,
          blockers,
          eval: this.findEvaluationData(entry.id, evaluationData.evaluations, evaluationData.meta.evaluator),
        };
      },
      5 // Process 5 entries concurrently
    );

    return processedEntries.sort((a, b) => {
      // Sort by datetime descending (newest first)
      const dateA = new Date(a.datetime);
      const dateB = new Date(b.datetime);
      return dateB.getTime() - dateA.getTime();
    });
  }

  /**
   * Gets the source URL for a repository
   */
  static getSourceUrl(repository: string): string {
    return `https://${repository}`;
  }

  /**
   * Validates repository parameters
   */
  static validateParams(params: Partial<RepositoryParams>): params is RepositoryParams {
    const { source } = params;
    
    if (!source) {
      return false;
    }

    // Basic validation for GitHub repository format
    if (!source.includes('github.com/')) {
      return false;
    }

    return true;
  }

  /**
   * Creates repository parameters from URL search params
   */
  static createParamsFromSearchParams(searchParams: URLSearchParams): RepositoryParams | null {
    const source = searchParams.get('source');

    if (!source) {
      return null;
    }

    const params = { source };

    if (!this.validateParams(params)) {
      return null;
    }

    return params;
  }

  /**
   * Fetches directory contents from GitHub API
   */
  private static async fetchGitHubDirectoryContents(repository: string, path: string = ''): Promise<any[]> {
    try {
      // Convert github.com URL to API URL
      const repoPath = repository.replace('github.com/', '');
      const apiUrl = `https://api.github.com/repos/${repoPath}/contents/${path}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`GitHub API error! status: ${response.status} for URL: ${apiUrl}`);
      }
      
      const contents = await response.json();
      return Array.isArray(contents) ? contents : [contents];
    } catch (error) {
      console.error('Failed to fetch GitHub directory contents:', error);
      throw new Error(`Failed to fetch directory contents from ${repository}/${path}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Discovers all training files in the repository
   */
  static async discoverTrainingFiles(repository: string): Promise<string[]> {
    try {
      const contents = await this.fetchGitHubDirectoryContents(repository, 'training');
      
      return contents
        .filter(item => item.type === 'file' && (item.name.endsWith('.yaml') || item.name.endsWith('.yml')))
        .map(item => item.name);
    } catch (error) {
      console.warn('No training directory found or error accessing it:', error);
      return [];
    }
  }

  /**
   * Discovers all evaluation files in the repository
   */
  static async discoverEvaluationFiles(repository: string): Promise<string[]> {
    try {
      const contents = await this.fetchGitHubDirectoryContents(repository, 'evaluations');
      
      return contents
        .filter(item => item.type === 'file' && (item.name.endsWith('.yaml') || item.name.endsWith('.yml')))
        .map(item => item.name);
    } catch (error) {
      console.warn('No evaluations directory found or error accessing it:', error);
      return [];
    }
  }

  /**
   * Request cache for deduplication
   */
  private static requestCache = new Map<string, Promise<any>>();

  /**
   * Fetch with caching and deduplication
   */
  private static async fetchWithCache<T>(url: string, fetcher: () => Promise<T>): Promise<T> {
    if (this.requestCache.has(url)) {
      return this.requestCache.get(url)!;
    }
    
    const promise = fetcher();
    this.requestCache.set(url, promise);
    
    // Clean up cache after 5 minutes
    setTimeout(() => this.requestCache.delete(url), 5 * 60 * 1000);
    
    return promise;
  }

  /**
   * Process array in batches with concurrency limit
   */
  private static async processBatches<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    concurrencyLimit: number = 5
  ): Promise<R[]> {
    const results: R[] = [];
    
    for (let i = 0; i < items.length; i += concurrencyLimit) {
      const batch = items.slice(i, i + concurrencyLimit);
      const batchResults = await Promise.allSettled(
        batch.map(item => processor(item))
      );
      
      // Handle results and errors
      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.warn('Batch processing error:', result.reason);
          // Continue processing other items instead of failing completely
        }
      }
    }
    
    return results;
  }

  /**
   * Fetches all repository data including multiple training and evaluation files
   * Optimized with parallel fetching, concurrency limits, and error resilience
   */
  static async fetchRepositoryData(params: RepositoryParams): Promise<GitHubRepositoryData> {
    try {
      // First, discover all files and repository meta in parallel with better error handling
      const [trainingFilesResult, evaluationFilesResult, repositoryMetaResult] = await Promise.allSettled([
        this.discoverTrainingFiles(params.source),
        this.discoverEvaluationFiles(params.source),
        this.fetchWithCache(
          this.buildRawUrl(params.source, 'tome.yaml'),
          () => this.fetchYaml<RepositoryMeta>(this.buildRawUrl(params.source, 'tome.yaml'))
        )
      ]);

      // Extract results with fallbacks
      const trainingFiles = trainingFilesResult.status === 'fulfilled' ? trainingFilesResult.value : [];
      const evaluationFiles = evaluationFilesResult.status === 'fulfilled' ? evaluationFilesResult.value : [];
      const repositoryMeta = repositoryMetaResult.status === 'fulfilled' 
        ? repositoryMetaResult.value 
        : { student: { name: 'Unknown' } } as RepositoryMeta;

      // Log any discovery errors but continue processing
      if (trainingFilesResult.status === 'rejected') {
        console.warn('Failed to discover training files:', trainingFilesResult.reason);
      }
      if (evaluationFilesResult.status === 'rejected') {
        console.warn('Failed to discover evaluation files:', evaluationFilesResult.reason);
      }
      if (repositoryMetaResult.status === 'rejected') {
        console.warn('Failed to fetch repository meta:', repositoryMetaResult.reason);
      }

      // Fetch training data with concurrency control and caching
      const trainings: TrainingFile[] = await this.processBatches(
        trainingFiles,
        async (filename) => {
          const url = this.buildRawUrl(params.source, `training/${filename}`);
          const data = await this.fetchWithCache(url, () => this.fetchYaml<TrainingData>(url));
          return {
            filename,
            path: `training/${filename}`,
            data
          };
        },
        3 // Limit concurrent training file fetches
      );

      // Fetch evaluation data with concurrency control and caching
      const evaluations: EvaluationFile[] = await this.processBatches(
        evaluationFiles,
        async (filename) => {
          const url = this.buildRawUrl(params.source, `evaluations/${filename}`);
          const data = await this.fetchWithCache(url, () => this.fetchYaml<EvaluationData>(url));
          return {
            filename,
            path: `evaluations/${filename}`,
            data
          };
        },
        3 // Limit concurrent evaluation file fetches
      );

      return {
        repository: repositoryMeta,
        trainings,
        evaluations
      };
    } catch (error) {
      throw new Error(`Failed to fetch repository data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetches and processes repository data
   */
  static async fetchProcessedRepositoryData(params: RepositoryParams): Promise<ProcessedRepositoryData> {
    const data = await this.fetchRepositoryData(params);
    
    // Process each training file with its corresponding evaluations
    const processedTrainings = await Promise.all(
      data.trainings.map(async (training) => {
        // Find matching evaluation file (by similar naming or first available)
        const matchingEval = data.evaluations.find(ev => 
          ev.filename.includes(training.filename.replace('.yaml', '').replace('.yml', '')) ||
          ev.filename.includes('eval')
        ) || data.evaluations[0]; // Fallback to first evaluation if no match

        if (!matchingEval) {
          // Create empty evaluation data if none found
          const emptyEval: EvaluationData = {
            meta: { evaluator: 'unknown', dimensions: [] },
            evaluations: []
          };
          const processedData = await this.processTrainingData(training.data, emptyEval);
          
          return {
            filename: training.filename,
            path: training.path,
            data: processedData
          };
        }

        const processedData = await this.processTrainingData(training.data, matchingEval.data);
        
        return {
          filename: training.filename,
          path: training.path,
          data: processedData
        };
      })
    );

    return {
      ...data,
      processedTrainings
    };
  }
}

// Export default instance for convenience
export default GitHubRepositoryService;
