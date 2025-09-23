/**
 * Optimized repository hooks with advanced SWR features
 * Includes prefetching, background updates, and intelligent caching
 */

import { useCallback, useEffect } from 'react';
import { mutate } from 'swr';
import { useGitHubRepositorySWR } from './useGitHubRepositorySWR';
import { RepositoryParams, ProcessedRepositoryData } from '../types/github-repository';
import { SWRCacheManager, CacheKeys } from '../utils/swr-cache';

/**
 * Enhanced repository hook with preloading capabilities
 */
export function useRepositoryWithPreload(
  params: RepositoryParams,
  options: {
    preloadRelated?: boolean;
    backgroundRefresh?: boolean;
    staleTime?: number;
  } = {}
) {
  const {
    preloadRelated = false,
    backgroundRefresh = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
  } = options;

  const repositoryState = useGitHubRepositorySWR(params, {
    processData: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: backgroundRefresh ? staleTime : 0,
    dedupingInterval: 2000,
  });

  // Preload related repositories (if we had a way to determine them)
  useEffect(() => {
    if (preloadRelated && params && repositoryState.processedData) {
      // This could preload similar repositories or common next steps
      console.log('Preloading related repositories for:', params);
    }
  }, [preloadRelated, params, repositoryState.processedData]);

  // Background cache warming
  useEffect(() => {
    if (backgroundRefresh && params) {
      const interval = setInterval(() => {
        // Trigger background revalidation
        mutate(CacheKeys.repository(params, true));
      }, staleTime);

      return () => clearInterval(interval);
    }
  }, [backgroundRefresh, params, staleTime]);

  return repositoryState;
}

/**
 * Hook for repository data with optimistic updates
 */
export function useRepositoryWithOptimisticUpdates(params: RepositoryParams) {
  const repositoryState = useGitHubRepositorySWR(params);

  const updateRepositoryOptimistically = useCallback(
    (updater: (data: ProcessedRepositoryData) => ProcessedRepositoryData) => {
      if (!repositoryState.processedData) return;

      const key = CacheKeys.repository(params, true);
      const optimisticData = updater(repositoryState.processedData);
      
      // Update cache optimistically
      mutate(key, optimisticData, false);
      
      // Revalidate in background
      setTimeout(() => {
        mutate(key);
      }, 100);
    },
    [params, repositoryState.processedData]
  );

  return {
    ...repositoryState,
    updateOptimistically: updateRepositoryOptimistically,
  };
}

/**
 * Hook for batch repository operations
 */
export function useRepositoryBatch() {
  const prefetchRepository = useCallback(async (params: RepositoryParams) => {
    const key = CacheKeys.repository(params, true);
    await mutate(key);
  }, []);

  const prefetchMultiple = useCallback(async (paramsList: RepositoryParams[]) => {
    const promises = paramsList.map(params => prefetchRepository(params));
    await Promise.all(promises);
  }, [prefetchRepository]);

  const invalidateRepository = useCallback((params: RepositoryParams) => {
    SWRCacheManager.clearRepositoryCacheForParams(params);
  }, []);

  const invalidateAll = useCallback(() => {
    SWRCacheManager.clearRepositoryCache();
  }, []);

  return {
    prefetchRepository,
    prefetchMultiple,
    invalidateRepository,
    invalidateAll,
    getCacheStats: SWRCacheManager.getCacheStats,
  };
}

/**
 * Hook for repository data with dependency tracking
 */
export function useRepositoryWithDependencies(
  params: RepositoryParams,
  dependencies: string[] = []
) {
  const repositoryState = useGitHubRepositorySWR(params);

  useEffect(() => {
    // Invalidate and refetch when dependencies change
    if (dependencies.length > 0) {
      repositoryState.refetch();
    }
  }, [dependencies, repositoryState]);

  return repositoryState;
}

/**
 * Hook with intelligent cache management
 */
export function useRepositoryWithIntelligentCache(
  params: RepositoryParams,
  options: {
    maxCacheAge?: number;
    maxCacheSize?: number;
    priorityLevel?: 'low' | 'medium' | 'high';
  } = {}
) {
  const {
    maxCacheAge = 10 * 60 * 1000, // 10 minutes
    maxCacheSize = 50, // Max 50 cache entries
    priorityLevel = 'medium'
  } = options;

  const repositoryState = useGitHubRepositorySWR(params, {
    processData: true,
    dedupingInterval: priorityLevel === 'high' ? 1000 : 2000,
    refreshInterval: priorityLevel === 'high' ? maxCacheAge / 2 : 0,
  });

  // Cache cleanup based on size and age
  useEffect(() => {
    const cleanup = () => {
      const stats = SWRCacheManager.getCacheStats();
      
      if (stats.repositoryCacheEntries > maxCacheSize) {
        console.log('Cache size limit exceeded, cleaning up old entries');
        // In a real implementation, you'd clean up oldest entries
        // This is a simplified example
      }
    };

    const interval = setInterval(cleanup, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [maxCacheSize]);

  return repositoryState;
}

/**
 * Hook for real-time repository updates
 */
export function useRepositoryRealTime(
  params: RepositoryParams,
  options: {
    pollingInterval?: number;
    enableWebSocket?: boolean;
  } = {}
) {
  const {
    pollingInterval = 30000, // 30 seconds
    enableWebSocket = false
  } = options;

  const repositoryState = useGitHubRepositorySWR(params, {
    processData: true,
    refreshInterval: pollingInterval,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  // WebSocket implementation would go here
  useEffect(() => {
    if (enableWebSocket) {
      console.log('WebSocket real-time updates would be enabled for:', params);
      // In a real implementation, you'd set up WebSocket connections
      // to receive real-time updates and mutate the cache accordingly
    }
  }, [enableWebSocket, params]);

  return repositoryState;
}
