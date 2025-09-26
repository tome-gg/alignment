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
  EvaluationEntry
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
   * Generates URLs for different data types
   */
  private static generateUrls(params: RepositoryParams) {
    const { source, training, eval: evalFile } = params;
    
    return {
      training: this.buildRawUrl(source, `training/${training}`),
      evaluation: this.buildRawUrl(source, `evaluations/${evalFile}`),
      repository: this.buildRawUrl(source, 'tome.yaml')
    };
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
  private static findEvaluationData(entryId: string, evaluations: EvaluationEntry[], evaluator?: string): { score: number; notes?: string; evaluator?: string } {
    const evaluation = evaluations.find((d) => d.id === entryId);
    if (!evaluation || !evaluation.measurements || evaluation.measurements.length === 0) {
      return { score: 0 };
    }

    const measurement = evaluation.measurements[0];
    return {
      score: measurement?.score || 0,
      notes: measurement?.notes || measurement?.comment || measurement?.remarks,
      evaluator
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
   * Fetches all repository data from GitHub
   */
  static async fetchRepositoryData(params: RepositoryParams): Promise<GitHubRepositoryData> {
    const urls = this.generateUrls(params);

    try {
      // Fetch all data in parallel
      const [trainingData, evaluationData, repositoryData] = await Promise.all([
        this.fetchYaml<TrainingData>(urls.training),
        this.fetchYaml<EvaluationData>(urls.evaluation),
        this.fetchYaml<RepositoryMeta>(urls.repository),
      ]);

      return {
        repository: repositoryData,
        training: trainingData,
        evaluation: evaluationData,
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
    
    const processedTraining = await this.processTrainingData(data.training, data.evaluation);

    return {
      ...data,
      processedTraining,
    };
  }

  /**
   * Gets the source URL for a training file
   */
  static getSourceUrl(repository: string, trainingFile: string): string {
    return `https://${repository}/blob/main/training/${trainingFile}`;
  }

  /**
   * Validates repository parameters
   */
  static validateParams(params: Partial<RepositoryParams>): params is RepositoryParams {
    const { source, training, eval: evalFile } = params;
    
    if (!source || !training || !evalFile) {
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
    const training = searchParams.get('training');
    const evalFile = searchParams.get('eval');

    if (!source || !training || !evalFile) {
      return null;
    }

    const params = {
      source,
      training,
      eval: evalFile,
    };

    if (!this.validateParams(params)) {
      return null;
    }

    return params;
  }
}

// Export default instance for convenience
export default GitHubRepositoryService;
