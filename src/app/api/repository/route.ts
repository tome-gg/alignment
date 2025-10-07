/**
 * API route for fetching GitHub repository data
 * Example usage: /api/repository?source=github.com/username/repo
 * Automatically crawls all training and evaluation files in the repository
 */

import { NextRequest, NextResponse } from 'next/server';
import { GitHubRepositoryService } from '../../../services/github-repository.service';

// Simple in-memory cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number; etag: string }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Generate ETag for cache validation
function generateETag(data: any): string {
  return Buffer.from(JSON.stringify(data)).toString('base64').slice(0, 16);
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Extract repository parameters
    let params = GitHubRepositoryService.createParamsFromSearchParams(searchParams);
    
    // Use default parameters if none provided
    if (!params) {
      params = {
        source: 'github.com/darrensapalo/founder'
      };
    }

    // Create cache key
    const processData = searchParams.get('process') !== 'false';
    const cacheKey = `${params.source}:${processData}`;
    
    // Check cache first
    const cached = apiCache.get(cacheKey);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      // Check if client has cached version
      const clientETag = request.headers.get('if-none-match');
      if (clientETag === cached.etag) {
        return new NextResponse(null, { status: 304 });
      }
      
      console.log(`Cache hit for ${cacheKey}, served in ${Date.now() - startTime}ms`);
      
      const response = NextResponse.json({
        success: true,
        data: cached.data,
        sourceUrl: GitHubRepositoryService.getSourceUrl(params.source),
        cached: true,
        responseTime: Date.now() - startTime
      });
      
      // Set optimized caching headers
      response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
      response.headers.set('ETag', cached.etag);
      response.headers.set('X-Cache', 'HIT');
      
      return response;
    }
    
    // Fetch fresh data with timeout
    const fetchPromise = processData 
      ? GitHubRepositoryService.fetchProcessedRepositoryData(params)
      : GitHubRepositoryService.fetchRepositoryData(params);
    
    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 10000); // 10 second timeout
    });
    
    const data = await Promise.race([fetchPromise, timeoutPromise]);
    
    // Generate ETag and cache the result
    const etag = generateETag(data);
    apiCache.set(cacheKey, {
      data,
      timestamp: now,
      etag
    });
    
    // Clean up old cache entries (simple cleanup)
    if (apiCache.size > 100) {
      const entries = Array.from(apiCache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      // Remove oldest 20 entries
      for (let i = 0; i < 20; i++) {
        apiCache.delete(entries[i][0]);
      }
    }
    
    const responseTime = Date.now() - startTime;
    console.log(`Fresh data fetched for ${cacheKey} in ${responseTime}ms`);
    
    const response = NextResponse.json({
      success: true,
      data,
      sourceUrl: GitHubRepositoryService.getSourceUrl(params.source),
      cached: false,
      responseTime
    });
    
    // Set optimized caching headers
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    response.headers.set('ETag', etag);
    response.headers.set('X-Cache', 'MISS');
    response.headers.set('Server-Timing', `total;dur=${responseTime}`);
    
    return response;
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('API Error:', error, `(${responseTime}ms)`);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch repository data',
        message: error instanceof Error ? error.message : 'Unknown error',
        responseTime
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate repository parameters
    if (!GitHubRepositoryService.validateParams(body)) {
      return NextResponse.json(
        { 
          error: 'Invalid parameters', 
          message: 'Please provide source parameter' 
        },
        { status: 400 }
      );
    }

    const processData = (body as any).process !== false;
    
    if (processData) {
      const data = await GitHubRepositoryService.fetchProcessedRepositoryData(body);
      const response = NextResponse.json({
        success: true,
        data,
        sourceUrl: GitHubRepositoryService.getSourceUrl(body.source),
      });
      
      // Add caching headers for better performance
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
      response.headers.set('CDN-Cache-Control', 'max-age=300');
      response.headers.set('Vary', 'Accept-Encoding');
      
      return response;
    } else {
      const data = await GitHubRepositoryService.fetchRepositoryData(body);
      const response = NextResponse.json({
        success: true,
        data,
        sourceUrl: GitHubRepositoryService.getSourceUrl(body.source),
      });
      
      // Add caching headers for better performance
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
      response.headers.set('CDN-Cache-Control', 'max-age=300');
      response.headers.set('Vary', 'Accept-Encoding');
      
      return response;
    }
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch repository data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
