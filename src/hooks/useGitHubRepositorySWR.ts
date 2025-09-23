/**
 * SWR-based hooks for fetching GitHub repository data
 * Provides caching, revalidation, and optimistic updates
 */

import useSWR from 'swr';
import { GitHubRepositoryService } from '../services/github-repository.service';
import {
  RepositoryParams,
  ProcessedRepositoryData,
  GitHubRepositoryData
} from '../types/github-repository';

/**
 * SWR key generator for repository data
 */
const getRepositoryKey = (params: RepositoryParams, processData: boolean = true) => {
  return ['repository', params.source, params.training, params.eval, processData];
};

/**
 * Fetcher function for processed repository data
 */
const fetchProcessedRepositoryData = async ([, source, training, evalParam]: [string, string, string, string, boolean]) => {
  const params: RepositoryParams = { source, training, eval: evalParam };
  return await GitHubRepositoryService.fetchProcessedRepositoryData(params);
};

/**
 * Fetcher function for raw repository data
 */
const fetchRawRepositoryData = async ([, source, training, evalParam]: [string, string, string, string, boolean]) => {
  const params: RepositoryParams = { source, training, eval: evalParam };
  return await GitHubRepositoryService.fetchRepositoryData(params);
};

/**
 * SWR hook for processed repository data with caching and revalidation
 */
export function useGitHubRepositorySWR(
  params: RepositoryParams,
  options: {
    processData?: boolean;
    revalidateOnFocus?: boolean;
    revalidateOnReconnect?: boolean;
    refreshInterval?: number;
    dedupingInterval?: number;
  } = {}
) {
  const {
    processData = true,
    revalidateOnFocus = false,
    revalidateOnReconnect = true,
    refreshInterval = 0, // No auto-refresh by default
    dedupingInterval = 2000, // Dedupe requests within 2 seconds
  } = options;

  const key = getRepositoryKey(params, processData);
  
  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate
  } = useSWR(
    key,
    processData ? fetchProcessedRepositoryData : fetchRawRepositoryData,
    {
      revalidateOnFocus,
      revalidateOnReconnect,
      refreshInterval,
      dedupingInterval,
      // Cache for 5 minutes
      focusThrottleInterval: 5 * 60 * 1000,
      // Keep data for 10 minutes when no components are using it
      keepPreviousData: true,
      // Critical: Ensure stale data is shown during revalidation
      revalidateIfStale: true,
      // Error retry configuration
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      // Suspend configuration
      suspense: false,
      // Fallback data configuration
      fallbackData: undefined,
      // Custom error handling
      onError: (error, key) => {
        console.error('SWR Error for key:', key, error);
      },
      // Custom success handling (removed verbose logging)
    }
  );

  // Removed excessive debug logging to reduce console noise

  return {
    data: data as ProcessedRepositoryData | GitHubRepositoryData | undefined,
    processedData: processData ? data as ProcessedRepositoryData | undefined : undefined,
    rawData: !processData ? data as GitHubRepositoryData | undefined : undefined,
    error: error?.message || null,
    // Only show loading when there's no data AND we're actually loading (not just revalidating)
    loading: isLoading && !data,
    validating: isValidating,
    isReady: !isLoading && !error && !!data,
    refetch: () => mutate(),
    sourceUrl: GitHubRepositoryService.getSourceUrl(params.source, params.training),
  };
}

/**
 * Hook for URL search params with SWR
 */
export function useGitHubRepositoryFromSearchParamsSWR(
  searchParams: URLSearchParams,
  options: Parameters<typeof useGitHubRepositorySWR>[1] = {}
) {
  // Create params from search params, use defaults if none found
  const params = GitHubRepositoryService.createParamsFromSearchParams(searchParams) || {
    source: 'github.com/darrensapalo/founder',
    training: 'dsu-reports-q3-2025.yaml',
    eval: 'eval-self.yaml'
  };
  const validationError = GitHubRepositoryService.createParamsFromSearchParams(searchParams) ? null : 'Using default repository parameters.';

  const repositoryState = useGitHubRepositorySWR(params, options);

  return {
    ...repositoryState,
    params,
    validationError,
  };
}

/**
 * Hook specifically for API route data fetching with SWR
 */
export function useRepositoryAPI(
  params: RepositoryParams,
  options: {
    processData?: boolean;
    swrOptions?: Parameters<typeof useSWR>[2];
  } = {}
) {
  const { processData = true, swrOptions = {} } = options;
  
  const queryString = new URLSearchParams({
    source: params.source,
    training: params.training,
    eval: params.eval,
    process: processData.toString()
  }).toString();

  const url = `/api/repository?${queryString}`;

  const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'API request failed');
    }
    return result.data;
  };

  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate
  } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 0,
    dedupingInterval: 2000,
    keepPreviousData: true,
    errorRetryCount: 3,
    errorRetryInterval: 5000,
    ...swrOptions
  });

  return {
    data: data as ProcessedRepositoryData | GitHubRepositoryData | undefined,
    error: error?.message || null,
    // Only show loading when there's no data AND we're actually loading (not just revalidating)
    loading: isLoading && !data,
    validating: isValidating,
    isReady: !isLoading && !error && !!data,
    refetch: () => mutate(),
    sourceUrl: GitHubRepositoryService.getSourceUrl(params.source, params.training),
  };
}
