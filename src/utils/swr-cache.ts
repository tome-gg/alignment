/**
 * SWR Cache Management Utilities
 * Provides cache invalidation, preloading, and optimization functions
 */

import { mutate } from 'swr';
import { RepositoryParams } from '../types/github-repository';

/**
 * Generate cache keys consistently across the app
 */
export const CacheKeys = {
  repository: (params: RepositoryParams, processData: boolean = true) => 
    ['repository', params.source, params.training, params.eval, processData],
  
  repositoryAPI: (params: RepositoryParams, processData: boolean = true) => {
    const queryString = new URLSearchParams({
      source: params.source,
      training: params.training,
      eval: params.eval,
      process: processData.toString()
    }).toString();
    return `/api/repository?${queryString}`;
  },
} as const;

/**
 * Cache management utilities
 */
export const SWRCacheManager = {
  /**
   * Clear all repository-related cache entries
   */
  clearRepositoryCache: () => {
    // Use mutate to clear all repository-related keys
    mutate(
      (key) => Array.isArray(key) && key[0] === 'repository',
      undefined,
      { revalidate: false }
    );
  },

  /**
   * Clear cache for specific repository
   */
  clearRepositoryCacheForParams: (params: RepositoryParams) => {
    const processedKey = CacheKeys.repository(params, true);
    const rawKey = CacheKeys.repository(params, false);
    
    mutate(processedKey, undefined, { revalidate: false });
    mutate(rawKey, undefined, { revalidate: false });
  },

  /**
   * Get cache statistics (simplified)
   */
  getCacheStats: () => {
    // Check sessionStorage for cached data
    let sessionStorageEntries = 0;
    let sessionStorageKeys: string[] = [];
    let repositoryKeys: string[] = [];
    
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('swr-cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          sessionStorageEntries = Object.keys(parsed).length;
          sessionStorageKeys = Object.keys(parsed);
          
          // Filter for repository-related keys (handle both array and string keys)
          repositoryKeys = sessionStorageKeys.filter(key => {
            try {
              // Try to parse as JSON (for array keys)
              const parsedKey = JSON.parse(key);
              if (Array.isArray(parsedKey)) {
                return parsedKey.some(part => 
                  typeof part === 'string' && part.includes('repository')
                );
              }
            } catch {
              // Not a JSON array, treat as string key
            }
            
            // Check string keys
            return key.includes('repository') || key.includes('/api/repository');
          });
        }
      } catch (e) {
        console.warn('Failed to read SWR cache from sessionStorage:', e);
      }
    }
    
    return {
      totalCacheEntries: sessionStorageEntries,
      repositoryCacheEntries: repositoryKeys.length,
      cacheKeys: sessionStorageKeys,
      repositoryKeys
    };
  },

  /**
   * Preload data for given parameters
   */
  preloadRepositoryData: async (params: RepositoryParams, processData: boolean = true) => {
    const key = CacheKeys.repository(params, processData);
    // Trigger preload via mutate
    await mutate(key);
  },

  /**
   * Clear all cache (useful for logout or major state changes)
   */
  clearAllCache: () => {
    // Clear all SWR cache
    mutate(() => true, undefined, { revalidate: false });
  },

  /**
   * Get memory usage estimate (simplified)
   */
  getMemoryUsage: () => {
    let totalSizeBytes = 0;
    
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('swr-cache');
        if (cached) {
          totalSizeBytes = cached.length * 2; // Rough estimate (UTF-16)
        }
      } catch (e) {
        console.warn('Failed to estimate cache size:', e);
      }
    }
    
    return {
      totalSizeBytes,
      totalSizeKB: totalSizeBytes / 1024,
      totalSizeMB: totalSizeBytes / (1024 * 1024)
    };
  }
};

/**
 * Performance monitoring utilities
 */
export const SWRPerformanceMonitor = {
  /**
   * Track cache hit/miss ratios
   */
  trackCachePerformance: () => {
    // This would integrate with analytics services
    const stats = SWRCacheManager.getCacheStats();
    const memory = SWRCacheManager.getMemoryUsage();
    
    console.log('SWR Cache Performance:', {
      stats,
      memory,
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Monitor fetch durations
   */
  monitorFetchDuration: <T>(
    fetchFn: () => Promise<T>,
    key: string
  ): Promise<T> => {
    const startTime = performance.now();
    
    return fetchFn().then(result => {
      const duration = performance.now() - startTime;
      console.log(`SWR Fetch Duration for ${key}:`, `${duration.toFixed(2)}ms`);
      return result;
    }).catch(error => {
      const duration = performance.now() - startTime;
      console.error(`SWR Fetch Error for ${key} after ${duration.toFixed(2)}ms:`, error);
      throw error;
    });
  }
};

/**
 * Cache warming strategies
 */
export const SWRCacheWarming = {
  /**
   * Preload commonly accessed repository data
   */
  warmCommonRepositories: async (commonParams: RepositoryParams[]) => {
    console.log('Warming cache for repositories:', commonParams);
    // This would be implemented with actual SWR preload calls
  },

  /**
   * Background refresh of stale data
   */
  backgroundRefresh: () => {
    console.log('Background refresh would check for stale data');
    // In a real implementation, this would check cache timestamps
    // and trigger refreshes for stale data
  }
};
