'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { GitHubRepositoryService } from '../services/github-repository.service';
import { RepositoryParams, ProcessedRepositoryData } from '../types/github-repository';
import { useGitHubRepositorySWR } from '../hooks/useGitHubRepositorySWR';

interface TomeContextData {
  // Repository data
  repositoryData: ProcessedRepositoryData | undefined;
  repositoryParams: RepositoryParams;
  loading: boolean;
  validating: boolean;
  error: string | null;
  
  // Helper methods
  getRepositoryUrl: () => string;
  getStudentName: () => string | null;
  refetchData: () => void;
  
  // Additional SWR-specific data
  isReady: boolean;
  sourceUrl: string | null;
}

const TomeContext = createContext<TomeContextData | undefined>(undefined);

interface TomeProviderProps {
  children: ReactNode;
  initialParams?: RepositoryParams;
}

export function TomeProviderSWR({ children, initialParams }: TomeProviderProps) {
  const searchParams = useSearchParams();
  
  // Initialize params immediately to avoid null state
  const getInitialParams = (): RepositoryParams => {
    if (initialParams) {
      return initialParams;
    }

    const params = GitHubRepositoryService.createParamsFromSearchParams(searchParams);
    
    // If no valid parameters are found, use defaults
    return params || {
      source: 'github.com/darrensapalo/founder',
      training: 'dsu-reports-q3-2025.yaml',
      eval: 'eval-self.yaml'
    };
  };

  const [repositoryParams, setRepositoryParams] = useState<RepositoryParams>(getInitialParams());

  // Update repository parameters when search params change
  useEffect(() => {
    if (initialParams) {
      setRepositoryParams(initialParams);
      return;
    }

    let params = GitHubRepositoryService.createParamsFromSearchParams(searchParams);
    
    // If no valid parameters are found, use defaults
    if (!params) {
      params = {
        source: 'github.com/darrensapalo/founder',
        training: 'dsu-reports-q3-2025.yaml',
        eval: 'eval-self.yaml'
      };
    }
    
    setRepositoryParams(params);
  }, [searchParams, initialParams]);

  // Use SWR hook for data fetching
  const {
    processedData: repositoryData,
    loading,
    validating,
    error,
    isReady,
    refetch,
    sourceUrl
  } = useGitHubRepositorySWR(repositoryParams, {
    processData: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    // Cache for longer since repository data doesn't change often
    refreshInterval: 0,
    dedupingInterval: 2000,
  });

  const getRepositoryUrl = (): string => {
    return `https://${repositoryParams.source}`;
  };

  const getStudentName = (): string | null => {
    return repositoryData?.repository?.student?.name || null;
  };

  const refetchData = () => {
    refetch();
  };

  const contextValue: TomeContextData = {
    repositoryData,
    repositoryParams,
    loading,
    validating,
    error,
    isReady,
    sourceUrl,
    getRepositoryUrl,
    getStudentName,
    refetchData,
  };

  return (
    <TomeContext.Provider value={contextValue}>
      {children}
    </TomeContext.Provider>
  );
}

export function useTomeSWR(): TomeContextData {
  const context = useContext(TomeContext);
  if (context === undefined) {
    throw new Error('useTomeSWR must be used within a TomeProviderSWR');
  }
  return context;
}

export default TomeContext;
