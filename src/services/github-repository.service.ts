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
   */
  private static async processTrainingData(
    trainingData: TrainingData,
    evaluationData: EvaluationData
  ): Promise<ProcessedTrainingEntry[]> {
    const processedEntries = await Promise.all(
      trainingData.content.map(async (entry) => {
        // Parse datetime
        const dateTime = entry.datetime ? new Date(entry.datetime) : null;
        const luxonDateTime = dateTime ? DateTime.fromJSDate(dateTime) : null;

        return {
          ...entry,
          datetimeReadable: dateTime ? dateTime.toISOString().substr(0, 10) : '',
          dateTimeRelative: luxonDateTime ? luxonDateTime.toRelative({ unit: 'days' }) : null,
          doing_today: await this.processMarkdown(entry.doing_today),
          done_yesterday: await this.processMarkdown(entry.done_yesterday),
          blockers: await this.processMarkdown(entry.blockers),
          eval: this.findEvaluationData(entry.id, evaluationData.evaluations, evaluationData.meta.evaluator),
        };
      })
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
   * Fetches all repository data including multiple training and evaluation files
   */
  static async fetchRepositoryData(params: RepositoryParams): Promise<GitHubRepositoryData> {
    try {
      // First, discover all training and evaluation files
      const [trainingFiles, evaluationFiles, repositoryMeta] = await Promise.all([
        this.discoverTrainingFiles(params.source),
        this.discoverEvaluationFiles(params.source),
        this.fetchYaml<RepositoryMeta>(this.buildRawUrl(params.source, 'tome.yaml'))
      ]);

      // Fetch all training data in parallel
      const trainings: TrainingFile[] = await Promise.all(
        trainingFiles.map(async (filename) => {
          const data = await this.fetchYaml<TrainingData>(
            this.buildRawUrl(params.source, `training/${filename}`)
          );
          return {
            filename,
            path: `training/${filename}`,
            data
          };
        })
      );

      // Fetch all evaluation data in parallel
      const evaluations: EvaluationFile[] = await Promise.all(
        evaluationFiles.map(async (filename) => {
          const data = await this.fetchYaml<EvaluationData>(
            this.buildRawUrl(params.source, `evaluations/${filename}`)
          );
          return {
            filename,
            path: `evaluations/${filename}`,
            data
          };
        })
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
