/**
 * TypeScript interfaces for GitHub repository data structures
 */

export interface RepositoryStudent {
  name: string;
}

export interface RepositoryMeta {
  student: RepositoryStudent;
}

export interface TrainingGoal {
  [key: string]: any;
}

export interface TrainingFormat {
  [key: string]: any;
}

export interface TrainingMeta {
  goal: TrainingGoal;
  format: TrainingFormat;
}

export interface TrainingEntry {
  id: string;
  datetime: string;
  doing_today?: string;
  done_yesterday?: string;
  blockers?: string;
  [key: string]: any;
}

export interface ProcessedTrainingEntry extends Omit<TrainingEntry, 'doing_today' | 'done_yesterday' | 'blockers'> {
  datetimeReadable: string;
  dateTimeRelative: string | null;
  doing_today?: string | null;
  done_yesterday?: string | null;
  blockers?: string | null;
  eval: {
    score: number;
    notes?: string;
    evaluator?: string;
  };
}

export interface TrainingData {
  meta: TrainingMeta;
  content: TrainingEntry[];
}

export interface EvaluationDimension {
  [key: string]: any;
}

export interface EvaluationMeta {
  evaluator: string;
  dimensions: EvaluationDimension;
}

export interface EvaluationMeasurement {
  score: number;
  [key: string]: any;
}

export interface EvaluationEntry {
  id: string;
  measurements: EvaluationMeasurement[];
}

export interface EvaluationData {
  meta: EvaluationMeta;
  evaluations: EvaluationEntry[];
}

export interface PlantProgress {
  imageSource: string;
  dateTime: string;
  score: number;
  index?: number;
}

export interface RepositoryParams {
  source: string;
  training: string;
  eval: string;
}

export interface GitHubRepositoryData {
  repository: RepositoryMeta;
  training: TrainingData;
  evaluation: EvaluationData;
}

export interface ProcessedRepositoryData extends GitHubRepositoryData {
  processedTraining: ProcessedTrainingEntry[];
}
