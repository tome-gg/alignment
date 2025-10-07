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
  const key = ['repository', params.source, processData];
  console.debug('SWR cache key generated:', key);
  return key;
};

/**
 * Fetcher function for processed repository data
 */
const fetchProcessedRepositoryData = async ([, source]: [string, string, boolean]) => {
  const params: RepositoryParams = { source };
  return await GitHubRepositoryService.fetchProcessedRepositoryData(params);
};

/**
 * Fetcher function for raw repository data
 */
const fetchRawRepositoryData = async ([, source]: [string, string, boolean]) => {
  const params: RepositoryParams = { source };
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
      // Don't keep previous data when there's an error - show error state immediately
      keepPreviousData: false,
      // Critical: Ensure stale data is shown during revalidation
      revalidateIfStale: true,
      // Reduce retry count to show errors faster
      errorRetryCount: 1,
      errorRetryInterval: 2000,
      // Suspend configuration
      suspense: false,
      // Fallback data configuration
      fallbackData: undefined,
      // Custom error handling
      onError: (error, key) => {
        console.error('SWR Error for key:', key);
        console.error('Error details:', error);
        console.error('Error message:', error?.message);
      },
      // Custom success handling
      onSuccess: (data, key) => {
        console.log('SWR Success for key:', key);
        console.log('Data loaded successfully');
      }
    }
  );

  // Debug logging for error state
  if (error) {
    console.error('SWR returned error:', error);
    console.error('Error type:', typeof error);
    console.error('Error message:', error?.message);
  }

  const errorMessage = error ? (error?.message || String(error)) : null;

  return {
    data: data as ProcessedRepositoryData | GitHubRepositoryData | undefined,
    processedData: processData ? data as ProcessedRepositoryData | undefined : undefined,
    rawData: !processData ? data as GitHubRepositoryData | undefined : undefined,
    error: errorMessage,
    // Only show loading when there's no data AND we're actually loading (not just revalidating)
    loading: isLoading && !data,
    validating: isValidating,
    isReady: !isLoading && !error && !!data,
    refetch: () => mutate(),
    sourceUrl: GitHubRepositoryService.getSourceUrl(params.source),
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
    source: 'github.com/darrensapalo/founder'
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
    sourceUrl: GitHubRepositoryService.getSourceUrl(params.source),
  };
}

