/**
 * API route for fetching GitHub repository data
 * Example usage: /api/repository?source=github.com/username/repo&training=file.yaml&eval=eval.yaml
 */

import { NextRequest, NextResponse } from 'next/server';
import { GitHubRepositoryService } from '../../../services/github-repository.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Extract parameters from search params
    const params = GitHubRepositoryService.createParamsFromSearchParams(searchParams);
    
    if (!params) {
      return NextResponse.json(
        { 
          error: 'Invalid parameters', 
          message: 'Please provide source, training, and eval parameters' 
        },
        { status: 400 }
      );
    }

    // Determine if we should return processed data
    const processData = searchParams.get('process') !== 'false';
    
    if (processData) {
      const data = await GitHubRepositoryService.fetchProcessedRepositoryData(params);
      return NextResponse.json({
        success: true,
        data,
        sourceUrl: GitHubRepositoryService.getSourceUrl(params.source, params.training),
      });
    } else {
      const data = await GitHubRepositoryService.fetchRepositoryData(params);
      return NextResponse.json({
        success: true,
        data,
        sourceUrl: GitHubRepositoryService.getSourceUrl(params.source, params.training),
      });
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!GitHubRepositoryService.validateParams(body)) {
      return NextResponse.json(
        { 
          error: 'Invalid parameters', 
          message: 'Please provide source, training, and eval parameters' 
        },
        { status: 400 }
      );
    }

    const processData = (body as any).process !== false;
    
    if (processData) {
      const data = await GitHubRepositoryService.fetchProcessedRepositoryData(body);
      return NextResponse.json({
        success: true,
        data,
        sourceUrl: GitHubRepositoryService.getSourceUrl(body.source, body.training),
      });
    } else {
      const data = await GitHubRepositoryService.fetchRepositoryData(body);
      return NextResponse.json({
        success: true,
        data,
        sourceUrl: GitHubRepositoryService.getSourceUrl(body.source, body.training),
      });
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
