/**
 * Utility functions for plant progress visualization
 */

import { PlantProgress, ProcessedTrainingEntry } from '../types/github-repository';

/**
 * Gets the image source for a given growth level
 */
export function getPlantImageSrc(level: number, dehydrated: boolean = false): string {
  const baseType = dehydrated ? 'OrchidCommDehydrated' : 'OrchidComm';
  
  // Clamp level between 1 and 5
  const clampedLevel = Math.max(1, Math.min(5, level));
  
  return `/assets/growth/${baseType}_500__${clampedLevel}.png`;
}

/**
 * Creates initial plant progress array
 */
export function createInitialPlantProgress(count: number = 7): PlantProgress[] {
  return Array.from({ length: count }, () => ({
    imageSource: getPlantImageSrc(1, true),
    dateTime: '          ',
    score: 1,
  }));
}

/**
 * Updates plant progress data based on current visible training entry
 */
export function updatePlantProgress(
  currentIndex: number,
  trainingData: ProcessedTrainingEntry[],
  prevProgress: PlantProgress[]
): PlantProgress[] {
  const newProgress = [...prevProgress];
  
  // Update each position in the plant progress array
  for (let i = 0; i < newProgress.length; i++) {
    const dataIndex = currentIndex + i - 3; // Center the current item at index 3
    updatePlantProgressAtIndex(newProgress, i, dataIndex, trainingData);
  }
  
  return newProgress;
}

/**
 * Updates a single plant progress entry
 */
function updatePlantProgressAtIndex(
  progress: PlantProgress[],
  progressIndex: number,
  dataIndex: number,
  trainingData: ProcessedTrainingEntry[]
): void {
  const training = trainingData[dataIndex];
  
  if (!training) {
    progress[progressIndex] = {
      dateTime: "xxxx-xx-xx",
      imageSource: getPlantImageSrc(1, true),
      score: 0,
      index: dataIndex,
    };
    return;
  }
  
  const score = training.eval.score ?? 0;
  progress[progressIndex] = {
    dateTime: training.datetimeReadable,
    score,
    index: dataIndex,
    imageSource: score > 0 
      ? getPlantImageSrc(score, false)
      : getPlantImageSrc(getAdjustedScore(progressIndex, progress), true),
  };
}

/**
 * Gets an adjusted score for dehydrated plants based on surrounding entries
 */
function getAdjustedScore(index: number, progress: PlantProgress[]): number {
  // Look ahead to get score from future entries for dehydrated visualization
  switch (index) {
    case 0: return progress[1]?.score || 1;
    case 1: return progress[2]?.score || 1;
    case 2: return progress[3]?.score || 1;
    case 3: return progress[4]?.score || 1;
    case 4: return progress[5]?.score || 1;
    case 5: return progress[6]?.score || 1;
    case 6: return 1;
    default: return 1;
  }
}

/**
 * Validates plant progress data
 */
export function validatePlantProgress(progress: PlantProgress[]): boolean {
  return progress.every(item => 
    typeof item.score === 'number' &&
    typeof item.dateTime === 'string' &&
    typeof item.imageSource === 'string'
  );
}
