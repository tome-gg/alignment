# GitHub Repository API Service

A structured TypeScript service for fetching and processing data from public GitHub repositories containing training data, evaluations, and repository metadata.

## Overview

This service extracts the data fetching logic from Angular components into a clean, reusable API that can be used in Next.js/React applications.

## Features

- ✅ Fetch YAML data from public GitHub repositories
- ✅ Process training data with markdown rendering
- ✅ Combine training data with evaluation scores
- ✅ TypeScript interfaces for type safety
- ✅ React hooks for easy integration
- ✅ Comprehensive error handling
- ✅ Parameter validation
- ✅ Plant progress visualization utilities

## Usage

### Basic Service Usage

```typescript
import { GitHubRepositoryService } from './services/github-repository.service';

const params = {
  source: 'github.com/username/repository',
  training: 'training-data.yaml',
  eval: 'evaluation-data.yaml'
};

// Fetch and process data
const data = await GitHubRepositoryService.fetchProcessedRepositoryData(params);

console.log(data.repository.student.name);
console.log(data.processedTraining);
```

### Using React Hooks

```typescript
import { useGitHubRepository } from './hooks/useGitHubRepository';

function MyComponent() {
  const { data, loading, error, isReady } = useGitHubRepository({
    source: 'github.com/username/repository',
    training: 'training-data.yaml',
    eval: 'evaluation-data.yaml'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!isReady) return <div>No data</div>;

  return (
    <div>
      <h1>{data.repository.student.name}</h1>
      {data.processedTraining.map(entry => (
        <div key={entry.id}>
          <h3>{entry.datetimeReadable}</h3>
          <div dangerouslySetInnerHTML={{ __html: entry.doing_today }} />
        </div>
      ))}
    </div>
  );
}
```

### Using with URL Search Params

```typescript
import { useGitHubRepositoryFromSearchParams } from './hooks/useGitHubRepository';

function RepositoryPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const { data, loading, error, validationError, sourceUrl } = 
    useGitHubRepositoryFromSearchParams(searchParams);

  // Handle states...
}
```

### API Route Usage

```bash
# GET request
curl "http://localhost:3000/api/repository?source=github.com/username/repo&training=data.yaml&eval=eval.yaml"

# POST request
curl -X POST http://localhost:3000/api/repository \
  -H "Content-Type: application/json" \
  -d '{"source":"github.com/username/repo","training":"data.yaml","eval":"eval.yaml"}'
```

## Data Structure

### Expected GitHub Repository Structure

```
repository/
├── tome.yaml              # Repository metadata
├── training/
│   ├── training-data.yaml  # Training entries
│   └── other-files.yaml
└── evaluations/
    ├── eval-data.yaml      # Evaluation scores
    └── other-evals.yaml
```

### Repository Metadata (tome.yaml)

```yaml
student:
  name: "Student Name"
```

### Training Data Format

```yaml
meta:
  goal:
    description: "Learning objectives"
  format:
    type: "daily standup format"
content:
  - id: "entry-1"
    datetime: "2024-01-01T10:00:00Z"
    doing_today: "Working on feature X"
    done_yesterday: "Completed task Y"
    blockers: "Waiting for review"
```

### Evaluation Data Format

```yaml
meta:
  evaluator: "Self-evaluation"
  dimensions:
    score: "1-5 scale"
evaluations:
  - id: "entry-1"
    measurements:
      - score: 4
```

## TypeScript Interfaces

The service provides comprehensive TypeScript interfaces:

- `RepositoryParams` - Input parameters
- `GitHubRepositoryData` - Raw fetched data
- `ProcessedRepositoryData` - Processed data with markdown
- `TrainingEntry` / `ProcessedTrainingEntry` - Training data
- `EvaluationEntry` - Evaluation data
- `PlantProgress` - Visualization data

## Error Handling

The service includes comprehensive error handling:

```typescript
try {
  const data = await GitHubRepositoryService.fetchRepositoryData(params);
} catch (error) {
  // Handle specific error types
  if (error.message.includes('HTTP error! status: 404')) {
    // Handle 404 - file not found
  } else if (error.message.includes('Failed to parse YAML')) {
    // Handle YAML parsing errors
  }
}
```

## Plant Progress Utilities

For visualization features:

```typescript
import { 
  getPlantImageSrc, 
  createInitialPlantProgress, 
  updatePlantProgress 
} from './utils/plant-progress';

// Get image source for growth level
const imageSrc = getPlantImageSrc(3, false); // Level 3, not dehydrated

// Create initial progress array
const progress = createInitialPlantProgress(7);

// Update progress based on current training entry
const updatedProgress = updatePlantProgress(currentIndex, trainingData, progress);
```

## Validation

Parameter validation is built-in:

```typescript
// Validate parameters
if (!GitHubRepositoryService.validateParams(params)) {
  throw new Error('Invalid parameters');
}

// Create from URL search params with validation
const params = GitHubRepositoryService.createParamsFromSearchParams(searchParams);
if (!params) {
  // Handle invalid parameters
}
```

## Development

The service is designed to be:
- **Type-safe**: Full TypeScript support
- **Modular**: Separate concerns into focused modules
- **Testable**: Pure functions and clear interfaces
- **Reusable**: Framework-agnostic core service
- **Performant**: Parallel data fetching where possible

## Dependencies

- `js-yaml`: YAML parsing
- `luxon`: Date/time handling
- `marked`: Markdown processing
- React hooks for Next.js integration
