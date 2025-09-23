# Calendar Integration with GitHub Repository Data

The Calendar component has been successfully integrated with the GitHub Repository API service to display real training data instead of mocked data.

## Features

✅ **Real Data Integration** - Fetches training data and evaluation scores from GitHub repositories
✅ **Smart Data Mapping** - Maps evaluation scores (1-5) to percentage changes for visualization
✅ **Enhanced Tooltips** - Shows training entry details including scores and daily activities
✅ **Loading States** - Proper loading and error handling
✅ **Fallback Support** - Falls back to sample data when repository data is unavailable
✅ **URL Parameters** - Supports repository configuration via URL parameters

## Usage

### Basic Usage (Sample Data)
```
http://localhost:3000/
```
Shows the calendar with sample/mocked data for demonstration purposes.

### With Repository Data
```
http://localhost:3000/?source=github.com/username/repository&training=training-file.yaml&eval=evaluation-file.yaml
```

### Example URLs
```
http://localhost:3000/?source=github.com/darrensapalo/founder&training=dsu-reports.yaml&eval=eval-self.yaml
```

## Data Transformation

The integration transforms GitHub repository training data as follows:

1. **Evaluation Scores to Growth** - Scores (1-5) are mapped to percentage changes:
   - Score 1: -10% change
   - Score 2: -5% change  
   - Score 3: 0% change (neutral)
   - Score 4: +5% change
   - Score 5: +10% change

2. **Date Mapping** - Training entries are mapped to calendar dates based on their `datetimeReadable` field

3. **Missing Data** - Days without training entries show small random changes (-2.5% to +2.5%)

## Enhanced Features

### Tooltips
- **Basic Info**: Date, percentage change, accumulated value
- **Training Data**: Evaluation score, daily activities preview
- **Smart Truncation**: Long text is truncated with ellipsis

### Detail Panel
- **Selected Cell Info**: Full training entry details when a cell is clicked
- **Score Display**: Shows evaluation score out of 5
- **Activity Preview**: Displays truncated "doing today" content with HTML rendering
- **No Data Indication**: Clear messaging when no training entry exists for a date

### Loading States
- **Loading Spinner**: Shows while fetching repository data
- **Error Handling**: Displays error messages and falls back to sample data
- **Repository Info**: Shows student name when data is loaded

## Technical Implementation

### Calendar Component Props
```typescript
interface CalendarProps {
  repositoryParams?: RepositoryParams;
}
```

### Data Structure
```typescript
interface DataPoint {
  date: Date;
  value: number;        // Percentage change
  close: number;        // Accumulated value
  entry?: ProcessedTrainingEntry; // Optional training data
}
```

### Repository Parameters
```typescript
interface RepositoryParams {
  source: string;    // e.g., "github.com/username/repo"
  training: string;  // e.g., "training-data.yaml"  
  eval: string;      // e.g., "evaluation-data.yaml"
}
```

## Development

The calendar now automatically:
1. Checks for URL parameters on page load
2. Fetches repository data if parameters are provided
3. Transforms training data into calendar visualization format
4. Shows loading states during data fetching
5. Handles errors gracefully with fallback to sample data
6. Updates tooltips and detail panels with real training information

This integration provides a seamless way to visualize daily training progress and evaluation scores in an intuitive calendar heat map format.
