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

export interface ProcessedEvaluationData {
  score?: number; // Average score across all measurements (undefined if no evaluation available)
  notes?: string; // Combined notes from all measurements
  evaluator?: string | EvaluatorInfo;
  measurements?: EvaluationMeasurement[];
}

export interface ProcessedTrainingEntry extends Omit<TrainingEntry, 'doing_today' | 'done_yesterday' | 'blockers'> {
  datetimeReadable: string;
  dateTimeRelative: string | null;
  doing_today?: string | null;
  done_yesterday?: string | null;
  blockers?: string | null;
  eval: ProcessedEvaluationData;
}

export interface TrainingData {
  meta: TrainingMeta;
  content: TrainingEntry[];
}

export interface DimensionDefinition {
  alias: string;
  name: string;
  label: string;
  version: string;
  definition: string;
}

export interface EvaluatorInfo {
  name: string;
  socials?: {
    email?: string;
    eth?: string;
    [key: string]: string | undefined;
  };
}

export interface EvaluationMeta {
  evaluator: string | EvaluatorInfo;
  dimensions: DimensionDefinition[];
}

// Known dimension types from the Tome.gg protocol
export type KnownDimension = 
  | 'focus'
  | 'simplicity' 
  | 'intentionality_tradeoffs'
  | 'speed_execution'
  | 'small_pull_requests';

// Unknown dimension type for future extensibility
export type UnknownDimension = string & { __brand?: 'unknown-dimension' };

// Combined dimension type for backwards compatibility
export type DimensionType = KnownDimension | UnknownDimension;

// Score scale based on the evaluation guidelines (1-5)
export type EvaluationScore = 1 | 2 | 3 | 4 | 5;

export interface EvaluationMeasurement {
  dimension: DimensionType;
  score: EvaluationScore;
  remarks?: string;
  notes?: string;
  comment?: string;
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

// Helper types for dimension-specific measurements
export interface DimensionMeasurement<T extends DimensionType = DimensionType> {
  dimension: T;
  score: EvaluationScore;
  remarks?: string;
  notes?: string;
  comment?: string;
}

// Specific dimension measurement types for better type safety
export type FocusMeasurement = DimensionMeasurement<'focus'>;
export type SimplicityMeasurement = DimensionMeasurement<'simplicity'>;
export type IntentionalityTradeoffsMeasurement = DimensionMeasurement<'intentionality_tradeoffs'>;
export type SpeedExecutionMeasurement = DimensionMeasurement<'speed_execution'>;
export type SmallPullRequestsMeasurement = DimensionMeasurement<'small_pull_requests'>;

// Union type for all known dimension measurements
export type KnownDimensionMeasurement = 
  | FocusMeasurement
  | SimplicityMeasurement
  | IntentionalityTradeoffsMeasurement
  | SpeedExecutionMeasurement
  | SmallPullRequestsMeasurement;

// Type for unknown dimension measurements
export type UnknownDimensionMeasurement = DimensionMeasurement<UnknownDimension>;

// Combined type for all possible measurements
export type AnyDimensionMeasurement = KnownDimensionMeasurement | UnknownDimensionMeasurement;

// Utility functions for dimension type checking
export const isKnownDimension = (dimension: DimensionType): dimension is KnownDimension => {
  const knownDimensions: KnownDimension[] = [
    'focus',
    'simplicity',
    'intentionality_tradeoffs',
    'speed_execution',
    'small_pull_requests'
  ];
  return knownDimensions.includes(dimension as KnownDimension);
};

export const isUnknownDimension = (dimension: DimensionType): dimension is UnknownDimension => {
  return !isKnownDimension(dimension);
};

// Helper to get dimension display name with fallback
export const getDimensionDisplayName = (dimension: DimensionType, dimensions?: DimensionDefinition[]): string => {
  // First try to find in the dimensions definitions
  const definition = dimensions?.find(d => d.alias === dimension || d.name === dimension);
  if (definition) {
    return definition.label || definition.name || definition.alias;
  }
  
  // Fallback to formatting the dimension string
  return dimension
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export interface PlantProgress {
  imageSource: string;
  dateTime: string;
  score: number;
  index?: number;
}

export interface RepositoryParams {
  source: string;
}

export interface TrainingFile {
  filename: string;
  path: string;
  data: TrainingData;
}

export interface EvaluationFile {
  filename: string;
  path: string;
  data: EvaluationData;
}

export interface GitHubRepositoryData {
  repository: RepositoryMeta;
  trainings: TrainingFile[];
  evaluations: EvaluationFile[];
}

export interface ProcessedRepositoryData extends GitHubRepositoryData {
  processedTrainings: {
    filename: string;
    path: string;
    data: ProcessedTrainingEntry[];
  }[];
}
