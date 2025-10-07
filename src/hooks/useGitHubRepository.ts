/**
 * React hook for fetching GitHub repository data
 */

import { useState, useEffect, useCallback } from 'react';
import { GitHubRepositoryService } from '../services/github-repository.service';
import {
  RepositoryParams,
  ProcessedRepositoryData,
  GitHubRepositoryData
} from '../types/github-repository';

interface UseGitHubRepositoryState {
  data: ProcessedRepositoryData | null;
  rawData: GitHubRepositoryData | null;
  loading: boolean;
  error: string | null;
}

interface UseGitHubRepositoryOptions {
  autoFetch?: boolean;
  processData?: boolean;
}

export function useGitHubRepository(
  params: RepositoryParams | null,
  options: UseGitHubRepositoryOptions = {}
) {
  const { autoFetch = true, processData = true } = options;
  
  const [state, setState] = useState<UseGitHubRepositoryState>({
    data: null,
    rawData: null,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(async (repositoryParams: RepositoryParams) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      if (processData) {
        const processedData = await GitHubRepositoryService.fetchProcessedRepositoryData(repositoryParams);
        setState({
          data: processedData,
          rawData: {
            repository: processedData.repository,
            trainings: processedData.trainings,
            evaluations: processedData.evaluations,
          },
          loading: false,
          error: null,
        });
      } else {
        const rawData = await GitHubRepositoryService.fetchRepositoryData(repositoryParams);
        setState({
          data: null,
          rawData,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch repository data';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, [processData]);

  const refetch = useCallback(() => {
    if (params) {
      fetchData(params);
    }
  }, [params, fetchData]);

  const reset = useCallback(() => {
    setState({
      data: null,
      rawData: null,
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    if (autoFetch && params) {
      fetchData(params);
    }
  }, [autoFetch, params, fetchData]);

  return {
    ...state,
    refetch,
    reset,
    isReady: !state.loading && !state.error && (state.data || state.rawData),
    sourceUrl: params ? GitHubRepositoryService.getSourceUrl(params.source) : null,
  };
}

// Hook specifically for URL search params
export function useGitHubRepositoryFromSearchParams(searchParams: URLSearchParams) {
  const [params, setParams] = useState<RepositoryParams | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const repositoryParams = GitHubRepositoryService.createParamsFromSearchParams(searchParams);
    
    if (!repositoryParams) {
      setValidationError('Invalid repository parameters. Please provide source parameter.');
      setParams(null);
    } else {
      setValidationError(null);
      setParams(repositoryParams);
    }
  }, [searchParams]);

  const repositoryState = useGitHubRepository(params);

  return {
    ...repositoryState,
    params,
    validationError,
    sourceUrl: params ? GitHubRepositoryService.getSourceUrl(params.source) : null,
  };
}
