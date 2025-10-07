'use client';

import { SWRConfig } from 'swr';
import { ReactNode } from 'react';

interface SWRProviderProps {
  children: ReactNode;
}

/**
 * Global SWR configuration provider
 * Sets up optimized defaults for the entire application
 */
export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        // Global fetcher - not used since we define custom fetchers
        // but good to have as fallback
        fetcher: (url: string) => fetch(url).then(res => res.json()),
        
        // Cache and revalidation settings
        revalidateOnFocus: false, // Don't revalidate on window focus (can be expensive)
        revalidateOnReconnect: true, // Revalidate when connection is restored
        revalidateIfStale: true, // Revalidate if data is stale
        refreshInterval: 0, // No automatic refresh by default
        
        // Deduplication and performance - optimized values
        dedupingInterval: 5000, // Increased from 2000ms - dedupe identical requests within 5 seconds
        focusThrottleInterval: 10 * 60 * 1000, // Increased to 10 minutes for better performance
        loadingTimeout: 5000, // Increased timeout for slower connections
        
        // Error handling
        errorRetryCount: 3, // Retry failed requests 3 times
        errorRetryInterval: 5000, // Wait 5 seconds between retries
        shouldRetryOnError: (error) => {
          // Don't retry on 4xx errors (client errors)
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          return true;
        },
        
        // Performance optimization
        keepPreviousData: true, // Keep previous data while fetching new data
        
        // Optimize for repository data patterns
        revalidateOnMount: true, // Always check for fresh data on mount
        compare: (a, b) => {
          // Custom comparison for repository data to avoid unnecessary re-renders
          if (a === b) return true;
          if (!a || !b) return false;
          
          // For repository data, compare by source and timestamp if available
          if (a.repository?.source && b.repository?.source) {
            return a.repository.source === b.repository.source;
          }
          
          return false;
        },
        
        // Fallback data and cache persistence
        fallbackData: undefined, // Don't use fallback, rely on cache
        
        // Cache configuration for better persistence across page refreshes
        provider: () => {
          // Use a Map that persists across component unmounts
          const map = new Map();
          
          // Try to restore from sessionStorage on initialization
          if (typeof window !== 'undefined') {
            try {
              const cached = sessionStorage.getItem('swr-cache');
              if (cached) {
                const parsed = JSON.parse(cached);
                let restoredCount = 0;
                
                Object.entries(parsed).forEach(([keyString, value]) => {
                  try {
                    // Parse the key back to its original format (array or string)
                    const key = JSON.parse(keyString);
                    // Extract just the data part (since we store { data, _c: timestamp })
                    const cacheData = (value as any)?.data !== undefined ? (value as any).data : value;
                    
                    // Use the original key format (array or string)
                    // Important: For SWR to recognize the cache, we need to use the exact same key format
                    const cacheKey = Array.isArray(key) ? key : keyString;
                    map.set(cacheKey, cacheData);
                    restoredCount++;
                  } catch {
                    // If key parsing fails, use the string key as-is
                    const cacheData = (value as any)?.data !== undefined ? (value as any).data : value;
                    map.set(keyString, cacheData);
                    restoredCount++;
                  }
                });
                
                if (process.env.NODE_ENV === 'development' && restoredCount > 0) {
                  console.log('Restored SWR cache from sessionStorage:', restoredCount, 'entries');
                }
              }
            } catch (e) {
              console.warn('Failed to restore SWR cache from sessionStorage:', e);
            }
          }
          
          // Cleanup old cache entries periodically (every 30 minutes)
          if (typeof window !== 'undefined') {
            const cleanupInterval = setInterval(() => {
              try {
                const cached = sessionStorage.getItem('swr-cache');
                if (cached) {
                  const parsed = JSON.parse(cached);
                  const now = Date.now();
                  const maxAge = 30 * 60 * 1000; // 30 minutes
                  
                  let cleaned = false;
                  Object.entries(parsed).forEach(([key, value]) => {
                    const cacheEntry = value as any;
                    if (cacheEntry._c && (now - cacheEntry._c) > maxAge) {
                      delete parsed[key];
                      cleaned = true;
                    }
                  });
                  
                  if (cleaned) {
                    sessionStorage.setItem('swr-cache', JSON.stringify(parsed));
                    if (process.env.NODE_ENV === 'development') {
                      console.log('Cleaned up old SWR cache entries');
                    }
                  }
                }
              } catch (e) {
                console.warn('Failed to cleanup SWR cache:', e);
              }
            }, 30 * 60 * 1000); // Run every 30 minutes
            
            // Cleanup on page unload
            const cleanup = () => clearInterval(cleanupInterval);
            window.addEventListener('beforeunload', cleanup);
          }
          
          return map;
        },
        
        // Global error handler
        onError: (error, key) => {
          console.error('SWR Global Error:', { error, key });
          
          // You could integrate with error reporting services here
          // Example: Sentry.captureException(error, { extra: { swrKey: key } });
        },
        
        // Global success handler
        onSuccess: (data, key) => {
          // Removed verbose logging to reduce console noise
          
          // Persist cache to sessionStorage for page refresh scenarios
          if (typeof window !== 'undefined') {
            try {
              // Get existing cache from sessionStorage
              let cacheObject: Record<string, any> = {};
              const existing = sessionStorage.getItem('swr-cache');
              if (existing) {
                cacheObject = JSON.parse(existing);
              }
              
              // Add/update this specific cache entry
              // Always stringify the key to ensure consistent storage format
              const keyString = JSON.stringify(key);
              cacheObject[keyString] = { data, _c: Date.now() };
              
              // Clean old entries (older than 1 hour)
              const cutoff = Date.now() - (60 * 60 * 1000);
              Object.keys(cacheObject).forEach(k => {
                if (cacheObject[k]._c && cacheObject[k]._c < cutoff) {
                  delete cacheObject[k];
                }
              });
              
              // Save to sessionStorage (limit to reasonable size)
              const serialized = JSON.stringify(cacheObject);
              if (serialized.length < 5 * 1024 * 1024) { // 5MB limit
                sessionStorage.setItem('swr-cache', serialized);
              } else {
                console.warn('SWR cache too large for sessionStorage, skipping persistence');
              }
            } catch (e) {
              console.warn('Failed to persist SWR cache to sessionStorage:', e);
            }
          }
        },
        
        // Cache provider - using default Map-based cache
        // Could be replaced with a more sophisticated cache like Redis
        // in a production environment with server-side caching needs
      }}
    >
      {children}
    </SWRConfig>
  );
}
