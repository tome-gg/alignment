'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { GitHubRepositoryService } from '../services/github-repository.service';
import { RepositoryParams, ProcessedRepositoryData } from '../types/github-repository';

interface TomeContextData {
  // Repository data
  repositoryData: ProcessedRepositoryData | null;
  repositoryParams: RepositoryParams | null;
  loading: boolean;
  error: string | null;
  
  // Helper methods
  getRepositoryUrl: () => string | null;
  getStudentName: () => string | null;
  refetchData: () => void;
}

const TomeContext = createContext<TomeContextData | undefined>(undefined);

interface TomeProviderProps {
  children: ReactNode;
  initialParams?: RepositoryParams;
}

export function TomeProvider({ children, initialParams }: TomeProviderProps) {
  const searchParams = useSearchParams();
  const [repositoryData, setRepositoryData] = useState<ProcessedRepositoryData | null>(null);
  const [repositoryParams, setRepositoryParams] = useState<RepositoryParams | null>(initialParams || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract repository parameters from URL search params or use defaults
  useEffect(() => {
    if (initialParams) {
      setRepositoryParams(initialParams);
      return;
    }

    let params = GitHubRepositoryService.createParamsFromSearchParams(searchParams);
    
    // If no valid parameters are found, use defaults
    if (!params) {
      params = {
        source: 'github.com/darrensapalo/founder'
      };
    }
    
    setRepositoryParams(params);
  }, [searchParams, initialParams]);

  // Fetch repository data when params change
  useEffect(() => {
    if (!repositoryParams) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await GitHubRepositoryService.fetchProcessedRepositoryData(repositoryParams);
        setRepositoryData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch repository data';
        setError(errorMessage);
        setRepositoryData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [repositoryParams]);

  const getRepositoryUrl = (): string | null => {
    if (!repositoryParams) return null;
    return `https://${repositoryParams.source}`;
  };

  const getStudentName = (): string | null => {
    return repositoryData?.repository?.student?.name || null;
  };

  const refetchData = () => {
    if (repositoryParams) {
      // Trigger re-fetch by updating the params
      setRepositoryParams({ ...repositoryParams });
    }
  };

  const contextValue: TomeContextData = {
    repositoryData,
    repositoryParams,
    loading,
    error,
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

export function useTome(): TomeContextData {
  const context = useContext(TomeContext);
  if (context === undefined) {
    throw new Error('useTome must be used within a TomeProvider');
  }
  return context;
}

export default TomeContext;
