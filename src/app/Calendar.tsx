'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
// Selective D3 imports for better tree-shaking
import { select } from 'd3-selection';
import { utcFormat } from 'd3-time-format';
import { utcMonday, utcYear, utcMonth, utcMonths } from 'd3-time';
import { quantile, groups, range } from 'd3-array';
import { scaleSequential } from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Button,
  Autocomplete,
  TextField,
  useMediaQuery,
  Link
} from '@mui/material';
import { trackCalendarCellSelection } from './analytics';
import { useTomeSWR } from '../contexts/TomeContextSWR';
import { ProcessedTrainingEntry, getDimensionDisplayName } from '../types/github-repository';
import { useCalendarDimensions } from '../hooks/useCalendarDimensions';
import { log } from '../utils/logger';

interface DataPoint {
  date: Date;
  value: number;
  close: number;
  scoreChange?: number; // Score difference from neutral (3)
  entry?: ProcessedTrainingEntry; // Optional training entry data
}

interface CalendarProps {
  // No props needed - will use context data
  [key: string]: unknown;
}

// Define formatting functions as constants
const formatDate = utcFormat("%x");
const formatDay = (i: number) => "SMTWTFS"[i];
const formatMonth = utcFormat("%b");
const timeWeek = utcMonday;
const countDay = (i: number) => (i + 6) % 7;

// Helper function to draw month separators in the calendar
function pathMonth(t: Date, cellSize: number) {
  const d = Math.max(0, Math.min(6, countDay(t.getUTCDay())));
  const w = timeWeek.count(utcYear(t), t);
  return `${d === 0 ? `M${w * cellSize},0`
      : d === 6 ? `M${(w + 1) * cellSize},0`
      : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`}V${6 * cellSize}`;
}

// Helper function to safely extract text content from HTML strings
const extractTextContent = (htmlString: string): string => {
  if (!htmlString) return '';
  
  // Only use DOM parsing on the client side to avoid hydration mismatch
  if (typeof window === 'undefined') {
    // Simple fallback for server-side: strip basic HTML tags
    return htmlString.replace(/<[^>]*>/g, '').trim();
  }
  
  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;
  
  // Extract text content and clean up whitespace
  return tempDiv.textContent || tempDiv.innerText || '';
};

// Helper function to safely extract evaluator information
const getEvaluatorDisplayName = (evaluator: any): string => {
  if (!evaluator) return '';
  
  if (typeof evaluator === 'string') {
    return evaluator;
  }
  
  if (typeof evaluator === 'object') {
    // Try common object properties that might contain the evaluator name
    return evaluator.name || evaluator.username || evaluator.displayName || evaluator.email || JSON.stringify(evaluator);
  }
  
  return String(evaluator);
};

// Helper function to format score change
const formatScoreChange = (scoreChange: number | undefined): string => {
  if (scoreChange === undefined) {
    return 'First entry';
  }
  if (scoreChange === 0) {
    return '±0';
  }
  const rounded = Math.round(scoreChange * 10) / 10; // Round to 1 decimal place
  return rounded > 0 ? `+${rounded}` : `${rounded}`;
};

function Calendar({}: CalendarProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredCell, setHoveredCell] = useState<DataPoint | null>(null);
  const [selectedCell, setSelectedCell] = useState<DataPoint | null>(null);
  const [allDataPoints, setAllDataPoints] = useState<DataPoint[]>([]);
  
  // Responsive detection
  const isMobile = useMediaQuery('(max-width:720px)');
  
  // Memoize date formatting function
  const formatDateForDropdown = useCallback((date: Date): string => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }, []);
  
  // Calculate fixed layout dimensions to prevent CLS
  const layoutDimensions = useCalendarDimensions();
  
  // Use context data instead of making duplicate SWR calls
  const { repositoryData, repositoryParams, loading, error, validating, getRepositoryUrl } = useTomeSWR();
  
  // Debug logging
  log.debug('Calendar render state:', { 
    hasRepositoryData: !!repositoryData, 
    loading, 
    error, 
    validating,
    repositoryParams 
  });

  // Memoize the data transformation to avoid recalculating on every render
  const transformedData = useMemo(() => {
    if (!repositoryData?.processedTrainings?.length) {
      return [];
    }

    // Transform repository data - generate full calendar with entries mapped to dates
    const transformRepositoryData = (): DataPoint[] => {
      // Get the date range to cover
      const now = new Date();
      const currentYear = now.getUTCFullYear();
      
      // Always show at least the current year
      let startYear = currentYear;
      let endYear = currentYear;
      
      // If we have repository data, extend the range to cover all entry dates
      if (repositoryData?.processedTrainings) {
        const allEntries = repositoryData.processedTrainings.flatMap(training => training.data);
        const entryDates = allEntries
          .filter((entry: ProcessedTrainingEntry) => entry.datetimeReadable)
          .map((entry: ProcessedTrainingEntry) => new Date(entry.datetimeReadable!));
        
        if (entryDates.length > 0) {
          const minDate = new Date(Math.min(...entryDates.map(d => d.getTime())));
          const maxDate = new Date(Math.max(...entryDates.map(d => d.getTime())));
          startYear = Math.min(startYear, minDate.getUTCFullYear());
          endYear = Math.max(endYear, maxDate.getUTCFullYear());
        }
      }

      // Create a map of date strings to training entries for quick lookup
      const entryMap = new Map<string, ProcessedTrainingEntry>();
      if (repositoryData?.processedTrainings) {
        repositoryData.processedTrainings.forEach(training => {
          training.data
            .filter((entry: ProcessedTrainingEntry) => entry.datetimeReadable)
            .forEach((entry: ProcessedTrainingEntry) => {
              const date = new Date(entry.datetimeReadable!);
              const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
              entryMap.set(dateKey, entry);
            });
        });
      }

      const data: DataPoint[] = [];
      let currentValue = 100; // Starting value for cumulative calculation
      let previousScore: number | null = null; // Track previous entry score

      // Generate all days for each year in the range
      for (let year = startYear; year <= endYear; year++) {
        const yearStart = new Date(year, 0, 1);
        const yearEnd = new Date(year, 11, 31);
        
        for (let d = new Date(yearStart); d <= yearEnd; d.setDate(d.getDate() + 1)) {
          const dateKey = d.toISOString().split('T')[0];
          const entry = entryMap.get(dateKey);
          
          let change: number = 0;
          let scoreChange: number | undefined = undefined;
          
          if (entry) {
            if (entry.eval.score && entry.eval.score > 0) {
              // Calculate score difference from previous entry
              if (previousScore !== null) {
                scoreChange = entry.eval.score - previousScore;
              }
              // Update previous score for next iteration
              previousScore = entry.eval.score;
              
              // Map evaluation score (1-5) to percentage change (-10% to +10%) for color scaling
              change = ((entry.eval.score - 3) / 2) * 0.1;
              currentValue *= (1 + change);
            }
            // For entries without eval scores, change remains 0 and currentValue unchanged
          }
          
          data.push({
            date: new Date(d), // Create new Date object to avoid reference issues
            value: change,
            close: currentValue,
            scoreChange,
            entry
          });
        }
      }
      
      return data;
    };

    return transformRepositoryData();
  }, [repositoryData]);

  // Update allDataPoints when transformedData changes
  useEffect(() => {
    setAllDataPoints(transformedData);

    // Only render SVG on desktop - mobile uses dropdown
    if (isMobile) return;

    if (!svgRef.current) return;

    // Clear previous content
    select(svgRef.current).selectAll('*').remove();

    // If no data is available, show empty calendar or message
    if (transformedData.length === 0) {
      const svg = select(svgRef.current)
        .attr("width", 400)
        .attr("height", 100)
        .attr("viewBox", [0, 0, 400, 100])
        .attr("style", "max-width: 100%; height: auto; font: 14px sans-serif;");

      svg.append("text")
        .attr("x", 200)
        .attr("y", 50)
        .attr("text-anchor", "middle")
        .attr("fill", "#666")
        .text(repositoryParams ? "No training entries found in repository" : "No repository data available");

      return;
    }

    // Chart configuration - use memoized dimensions
    const cellSize = layoutDimensions.cellSize;
    const height = cellSize * 9; // height of a week (7 days + padding)
    const width = (cellSize + 1.5) * 53; // width of the chart

    // Compute the extent of the value, ignore the outliers
    // and define a diverging and symmetric color scale
    const max = quantile(transformedData, 0.9975, d => Math.abs(d.value)) || 0.05;
    const color = scaleSequential(interpolateBlues).domain([-max, +max]);

    // Group data by year, in reverse input order
    const years = groups(transformedData, d => d.date.getUTCFullYear()).reverse();

    const svg = select(svgRef.current)
        .attr("width", width + 50)
        .attr("height", height * years.length + 30)
        .attr("viewBox", [-10, -10, width + 50, height * years.length + 30])
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")
        .on("click", function(event) {
          // If clicking on the SVG background (not a cell), clear selection
          if (event.target === this) {
            setSelectedCell(null);
          }
        });

    const year = svg.selectAll("g")
      .data(years)
      .join("g")
        .attr("transform", (d, i) => `translate(40.5,${height * i + cellSize * 2 + i * 10})`);

    year.append("text")
        .attr("x", -5)
        .attr("y", -5)
        .attr("font-weight", "bold")
        .attr("text-anchor", "end")
        .text(([key]) => key);

    year.append("g")
        .attr("text-anchor", "end")
      .selectAll("text")
      .data(range(0, 7))
      .join("text")
        .attr("x", -5)
        .attr("y", i => (countDay(i) + 0.5) * cellSize)
        .attr("dy", "0.31em")
        .text(formatDay);

    year.append("g")
      .selectAll("rect")
      .data(([, values]) => values)
      .join("rect")
        .attr("width", cellSize - 1)
        .attr("height", cellSize - 1)
        .attr("x", d => timeWeek.count(utcYear(d.date), d.date) * cellSize + 0.5)
        .attr("y", d => countDay(d.date.getUTCDay()) * cellSize + 0.5)
        .attr("fill", d => {
          if (!d.entry) {
            // Empty day - very light gray
            return "#f5f5f5";
          } else if (!d.entry.eval.score || d.entry.eval.score === 0) {
            // Entry exists but has no eval score - light gray to indicate presence without score
            return "#e0e0e0";
          } else {
            // Entry with eval score - use color scale
            return color(d.value);
          }
        })
        .attr("cursor", "pointer")
        .on("mouseover", function(_, d) {
          // Only update hover state if no cell is selected
          if (!selectedCell) {
            setHoveredCell(d);
            select(this).attr("stroke", "#333").attr("stroke-width", 1);
          }
        })
        .on("mouseout", function(_, d) {
          // Only clear hover state if this cell is not selected
          if (!selectedCell || selectedCell !== d) {
            setHoveredCell(null);
            select(this).attr("stroke", null).attr("stroke-width", null);
          }
        })
        .on("click", function(event, d) {
          event.stopPropagation(); // Prevent SVG background click
          
          if (selectedCell === d) {
            // If clicking the same cell, deselect it
            setSelectedCell(null);
            setHoveredCell(null);
            select(this).attr("stroke", null).attr("stroke-width", null);
          } else {
            // Select the new cell
            setSelectedCell(d);
            setHoveredCell(null);
            
            // Track the calendar cell selection event
            trackCalendarCellSelection(d.date, d.value);
            
            // Remove stroke from all other cells
            svg.selectAll("rect").attr("stroke", null).attr("stroke-width", null);
            // Add stroke to selected cell
            select(this).attr("stroke", "#333").attr("stroke-width", 2);
          }
        });

    const month = year.append("g")
      .selectAll("g")
      .data(([, values]) => utcMonths(utcMonth(values[0].date), values.at(-1)!.date))
      .join("g");

    month.filter((_, i) => Boolean(i)).append("path")
        .attr("fill", "none")
        .attr("stroke", "#fff")
        .attr("stroke-width", 3)
        .attr("d", d => pathMonth(d, cellSize));

    month.append("text")
        .attr("x", d => timeWeek.count(utcYear(d), timeWeek.ceil(d)) * cellSize + 2)
        .attr("y", -5)
        .text(formatMonth);

  }, [transformedData, selectedCell, isMobile, repositoryParams, layoutDimensions]);


  // Show loading state only when there's no data at all (not when revalidating with cached data)
  if (loading && !repositoryData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          {/* Static content - always show */}
          <Typography variant="body1" color="text.primary" sx={{ mb: 3 }}>
            In video games, a tome of knowledge is an item that allows you to learn new spells or abilities, or level up quickly.
            In real life, a tome of knowledge is a collection of your knowledge and experiences.
            You can&apos;t buy a tome of knowledge in real life, but you can build your own.
          </Typography>
          <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
            Each legendary tome of knowledge is unique. You simply need to get started and build the habit first. Consistency is your first goal.
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Button
              href="https://protocol.tome.gg?utm_source=app&utm_medium=direct&utm_campaign=tome.gg"
              target="_blank"
              variant="contained"
              size="small"
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 'medium',
                backgroundColor: '#444',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#333'
                }
              }}
            >
              Build Your Tome
            </Button>
          </Box>
          {/* Only show loading skeleton for dynamic repository owner */}
          <Typography variant="body2" component="div" sx={{ mb: 3, color: 'black', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            Showing data from:{' '}
            <Box 
              sx={{ 
                width: 120, 
                height: 18, 
                borderRadius: 1, 
                backgroundColor: 'action.hover',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} 
            />
            &apos;s repository
          </Typography>
		</Box>

        <Paper elevation={2} sx={{ 
          p: 3, 
          borderRadius: 1,
          minHeight: { 
            xs: '400px', 
            md: `${layoutDimensions.totalHeight}px` 
          },
          contain: 'layout style'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box 
              sx={{ 
                width: 200, 
                height: 32, 
                borderRadius: 1, 
                backgroundColor: 'action.hover',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} 
            />
            {/* Reserved space for Clear button */}
            <Box sx={{ width: '80px', height: '40px' }} />
          </Box>
          
          {/* Calendar skeleton with fixed height */}
          <Box sx={{ 
            height: `${layoutDimensions.svgContainerHeight}px`,
            minHeight: `${layoutDimensions.svgContainerHeight}px`,
            overflowX: 'hidden', 
            px: 2 
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 800 }}>
              
              {/* Calendar grid skeleton */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(53, 1fr)', gap: 0.5 }}>
                {Array.from({ length: 275 }).map((_, i) => (
                  <Box 
                    key={i}
                    sx={{ 
                      width: 14, 
                      height: 14, 
                      borderRadius: 0.5, 
                      backgroundColor: 'action.hover',
                      animation: 'pulse 1.5s ease-in-out infinite',
                      animationDelay: `${(i % 10) * 0.1}s`
                    }} 
                  />
                ))}
              </Box>
            </Box>
          </Box>
          
          {/* Detail section skeleton with fixed height */}
          <Box sx={{ 
            height: `${layoutDimensions.detailHeight}px`,
            minHeight: `${layoutDimensions.detailHeight}px`,
            mt: 3, 
            pt: 2,
            overflow: 'auto'
          }}>
            <Box 
              sx={{ 
                width: '100%', 
                height: 16, 
                borderRadius: 1, 
                backgroundColor: 'action.hover',
                mb: 2,
                animation: 'pulse 1.5s ease-in-out infinite'
              }} 
            />
            <Box 
              sx={{ 
                width: '75%', 
                height: 14, 
                borderRadius: 1, 
                backgroundColor: 'action.hover',
                mb: 1,
                animation: 'pulse 1.5s ease-in-out infinite'
              }} 
            />
          </Box>
        </Paper>
        
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}</style>
      </Container>
    );
  }

  // Show error state
  if (error) {
    const repositoryUrl = getRepositoryUrl();
    
    // Determine if this is an invalid repository error (all data failed to load)
    const isInvalidRepository = error.includes('Invalid or inaccessible repository') || 
                                error.includes('All repository data fetches failed');

    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            p: 3,
            border: '2px solid',
            borderColor: 'error.main',
            '& .MuiAlert-message': {
              width: '100%'
            }
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'error.dark' }}>
            {isInvalidRepository ? 'Invalid Growth Journal' : 'Growth Journal Not Found'}
          </Typography>
          
          {isInvalidRepository ? (
            <>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 'medium' }}>
                The repository you&apos;re trying to access is invalid or inaccessible.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                This happens when all of the following fail to load:
              </Typography>
              <Box component="ul" sx={{ pl: 2, mb: 2, '& li': { mb: 1 } }}>
                <li><strong>tome.yaml</strong> - Repository metadata file</li>
                <li><strong>training/</strong> directory - Training data files</li>
                <li><strong>evaluations/</strong> directory - Evaluation data files</li>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Common causes:
              </Typography>
              <Box component="ul" sx={{ pl: 2, mb: 3, '& li': { mb: 1 } }}>
                <li>The repository doesn&apos;t exist</li>
                <li>The repository is private (tome.gg can only access public repositories)</li>
                <li>The repository exists but has no growth journal files</li>
                <li>Network or connectivity issues</li>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                We couldn&apos;t find your training data at the specified repository location. This might happen if:
              </Typography>
              <Box component="ul" sx={{ pl: 2, mb: 2, '& li': { mb: 1 } }}>
                <li>The repository is private or doesn&apos;t exist</li>
                <li>The training or evaluation files are missing</li>
                <li>The file paths in the URL are incorrect</li>
              </Box>
            </>
          )}
          
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium' }}>
            Repository URL:
          </Typography>
          <Link
            href={repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              wordBreak: 'break-all',
              fontSize: '0.95rem',
              display: 'block',
              mb: 3,
              p: 2,
              bgcolor: 'grey.100',
              borderRadius: 1,
              fontFamily: 'monospace'
            }}
          >
            {repositoryUrl}
          </Link>
          <Typography variant="body1">
            {isInvalidRepository ? (
              <>
                Make sure the repository exists and is public, or{' '}
                <Link
                  href="https://protocol.tome.gg?utm_source=app&utm_medium=error&utm_campaign=tome.gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ fontWeight: 'bold' }}
                >
                  learn how to create your growth journal
                </Link>.
              </>
            ) : (
              <>
                Try checking if your repository exists and contains the required training files, or{' '}
                <Link
                  href="https://protocol.tome.gg?utm_source=app&utm_medium=error&utm_campaign=tome.gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ fontWeight: 'bold' }}
                >
                  learn how to create your growth journal
                </Link>.
              </>
            )}
          </Typography>
        </Alert>
        
        {/* Hide calendar and details when there's an error */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            borderRadius: 1,
            minHeight: '400px',
            display: 'none' // Hide the calendar completely
          }}
        >
          {/* Calendar content is hidden */}
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" color="text.primary" sx={{ mb: 3 }}>
	In video games, a tome of knowledge is an item that allows you to learn new spells or abilities, or level up quickly.
	In real life, a tome of knowledge is a collection of your knowledge and experiences.
	You can&apos;t buy a tome of knowledge in real life, but you can build your own.
	</Typography>
	<Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
	Each legendary tome of knowledge is unique. You simply need to get started and build the habit first. Consistency is your first goal.
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Button
            href="https://protocol.tome.gg?utm_source=app&utm_medium=direct&utm_campaign=tome.gg"
            target="_blank"
            variant="contained"
            size="small"
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 'medium',
              backgroundColor: '#444',
              color: 'white',
              '&:hover': {
                backgroundColor: '#333'
              }
            }}
          >
            Build Your Tome
          </Button>
        </Box>
        {repositoryData && (
          <Typography variant="body2" sx={{ mb: 3, color: 'black' }}>
            Showing data from: <strong>{repositoryData.repository.student.name}</strong>&apos;s repository
          </Typography>
        )}
      </Box>

      <Paper elevation={2} sx={{ 
        p: 3, 
        borderRadius: 1, 
        // Fixed height to prevent CLS - calculated from dimensions
        minHeight: { 
          xs: '400px', 
          md: `${layoutDimensions.totalHeight}px` 
        },
        display: 'flex',
        flexDirection: 'column',
        // Allow content to flow naturally while preventing horizontal overflow
        overflow: 'hidden',
        // CSS containment for performance and CLS prevention
        contain: 'layout style'
      }}>
        <Box sx={{ overflowX: 'auto' }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0 }}>
				<Typography variant="h3" component="h1" sx={{ 
				  display: 'flex', 
				  alignItems: 'center', 
				  gap: 2,
				  mb: 0
				}}>
				  Growth Journal
				  {validating && (
					<CircularProgress size={16} sx={{ ml: 1 }} />
				  )}
				</Typography>
				{/* Clear button with transform animation to prevent CLS */}
				<Button 
					onClick={() => {
						setSelectedCell(null);
						setHoveredCell(null);
						// Remove stroke from all cells
						if (svgRef.current) {
							select(svgRef.current).selectAll("rect").attr("stroke", null).attr("stroke-width", null);
						}
					}}
					variant="outlined"
					size="small"
					sx={{ 
						minWidth: '80px', // Reserve space to prevent shift
						opacity: selectedCell ? 1 : 0,
						transform: selectedCell ? 'scale(1)' : 'scale(0.8)',
						transition: 'opacity 0.2s ease, transform 0.2s ease',
						pointerEvents: selectedCell ? 'auto' : 'none',
						color: 'text.secondary',
						borderColor: 'divider',
						'&:hover': { 
							color: 'text.primary',
							borderColor: 'text.secondary',
							backgroundColor: 'action.hover'
						}
					}}
				>
					Clear
				</Button>
			</Box>
          
          {/* Responsive rendering: dropdown for mobile, calendar for desktop */}
          {isMobile ? (
            <Box sx={{ mb: 3 }}>
              <Autocomplete
                options={allDataPoints
                  .filter(dp => dp.entry) // Only show dates with entries
                  .sort((a, b) => b.date.getTime() - a.date.getTime()) // Sort by date, newest first
                }
                getOptionLabel={(option) => {
                  const dateStr = formatDateForDropdown(option.date);
                  const hasScore = option.entry?.eval?.score && option.entry.eval.score > 0;
                  const scoreText = hasScore ? ` (Score: ${option.entry!.eval.score}/5)` : ' (No score)';
                  return `${dateStr}${scoreText}`;
                }}
                value={selectedCell}
                onChange={(_, newValue) => {
                  setSelectedCell(newValue);
                  setHoveredCell(null);
                  if (newValue) {
                    trackCalendarCellSelection(newValue.date, newValue.value);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select a date"
                    placeholder="Search dates..."
                    variant="outlined"
                    fullWidth
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...otherProps } = props;
                  return (
                    <Box component="li" key={key} {...otherProps}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {formatDateForDropdown(option.date)}
                        </Typography>
                        {option.entry?.eval?.score && option.entry.eval.score > 0 ? (
                          <Typography variant="caption" color="text.secondary">
                            Score: {option.entry.eval.score}/5 • Change: {formatScoreChange(option.scoreChange)}
                          </Typography>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            DSU Entry (No evaluation score)
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  );
                }}
                noOptionsText="No dates with entries found"
                sx={{ my: 2 }}
              />
            </Box>
          ) : (
            <Box sx={{ 
              width: '100%', 
              height: `${layoutDimensions.svgContainerHeight}px`,
              minHeight: `${layoutDimensions.svgContainerHeight}px`,
              maxHeight: `${layoutDimensions.svgContainerHeight}px`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              overflow: 'auto',
              // Reserve space to prevent layout shift during SVG rendering
              position: 'relative',
              // Use container queries for better responsiveness
              containerType: 'inline-size'
            }}>
              <svg 
                ref={svgRef}
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto',
                  opacity: transformedData.length ? 1 : 0,
                  transition: 'opacity 0.4s ease',
                  willChange: 'opacity'
                }}
              ></svg>
            </Box>
          )}
		  <Box sx={{ 
        p: 2,
        height: `${layoutDimensions.detailHeight}px`,
        minHeight: `${layoutDimensions.detailHeight}px`,
        maxHeight: `${layoutDimensions.detailHeight}px`,
        my: 3,
        overflow: 'auto',
        position: 'relative',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        // Smooth transitions for content changes
        '& > *': {
          transition: 'opacity 0.2s ease, transform 0.2s ease'
        }
      }}>
			{selectedCell ? (
			  <Box>
				<Typography variant="body1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>
				  {formatDate(selectedCell.date)} (Selected)
				</Typography>
				{selectedCell.entry ? (
				  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
					{selectedCell.entry.eval.score && selectedCell.entry.eval.score > 0
						? `Daily Standup with Score: ${selectedCell.entry.eval.score}/5`
						: "Daily Standup Entry (No evaluation score)"}
				  </Typography>
				) : (
				  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
					No entry for this date
				  </Typography>
				)}
				{selectedCell.entry ? (
				  <Box sx={{ mt: 2 }}>
					{selectedCell.entry.doing_today && (
					  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
						<strong>Doing today:</strong>{' '}
						{extractTextContent(selectedCell.entry.doing_today)}
					  </Typography>
					)}
					{selectedCell.entry.done_yesterday && (
					  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
						<strong>Done yesterday:</strong>{' '}
						{extractTextContent(selectedCell.entry.done_yesterday)}
					  </Typography>
					)}
					{selectedCell.entry.blockers && (
					  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
						<strong>Blockers:</strong>{' '}
						{extractTextContent(selectedCell.entry.blockers)}
					  </Typography>
					)}
					{(selectedCell.entry.remarks || selectedCell.entry.notes) && (
					  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
						<strong>Notes:</strong>{' '}
						{extractTextContent(selectedCell.entry.remarks || selectedCell.entry.notes)}
					  </Typography>
					)}
					{selectedCell.entry && (
					  <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
						<Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
						  {selectedCell.entry.eval.score !== undefined 
							? `Average Evaluation Score: ${selectedCell.entry.eval.score}/5`
							: "No evaluations"}
						</Typography>
						{selectedCell.entry.eval.evaluator && (
						  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
							<strong>Evaluator:</strong> {getEvaluatorDisplayName(selectedCell.entry.eval.evaluator)}
						  </Typography>
						)}
						
						{/* Display individual dimension scores */}
						{selectedCell.entry.eval.measurements && selectedCell.entry.eval.measurements.length > 0 && (
						  <Box sx={{ mb: 1 }}>
							<Typography variant="body2" sx={{ fontWeight: 'medium', mb: 0.5 }}>
							  Dimension Scores:
							</Typography>
							{selectedCell.entry.eval.measurements.map((measurement, idx) => (
							  <Box key={idx} sx={{ ml: 1, mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
								<Typography variant="body2">
								  <strong>{getDimensionDisplayName(measurement.dimension)}:</strong> {measurement.score}/5
								</Typography>
								{(measurement.remarks || measurement.notes || measurement.comment) && (
								  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
									{extractTextContent(measurement.remarks || measurement.notes || measurement.comment || '')}
								  </Typography>
								)}
							  </Box>
							))}
						  </Box>
						)}
						</Box>
					)}
				  </Box>
				) : (
				  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
					No training entry for this date
				  </Typography>
				)}
			  </Box>
			) : hoveredCell ? (
			  <Box>
				<Typography variant="body1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>
				  {formatDate(hoveredCell.date)}
				</Typography>
				{hoveredCell.entry ? (
				  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
					{hoveredCell.entry.eval.score && hoveredCell.entry.eval.score > 0
						? `Daily Standup with Score: ${hoveredCell.entry.eval.score}/5`
						: "Daily Standup Entry (No evaluation score)"}
				  </Typography>
				) : (
				  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
					No entry for this date
				  </Typography>
				)}
				{hoveredCell.entry ? (
				  <Box sx={{ mt: 2 }}>
					{hoveredCell.entry.doing_today && (
					  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
						<strong>Doing today:</strong>{' '}
						{extractTextContent(hoveredCell.entry.doing_today)}
					  </Typography>
					)}
					{hoveredCell.entry.done_yesterday && (
					  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
						<strong>Done yesterday:</strong>{' '}
						{extractTextContent(hoveredCell.entry.done_yesterday)}
					  </Typography>
					)}
					{hoveredCell.entry.blockers && (
					  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
						<strong>Blockers:</strong>{' '}
						{extractTextContent(hoveredCell.entry.blockers)}
					  </Typography>
					)}
					{(hoveredCell.entry.remarks || hoveredCell.entry.notes) && (
					  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
						<strong>Notes:</strong>{' '}
						{extractTextContent(hoveredCell.entry.remarks || hoveredCell.entry.notes)}
					  </Typography>
					)}
					{hoveredCell.entry && (
					  <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
						<Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
						  {hoveredCell.entry.eval.score !== undefined 
							? `Average Evaluation Score: ${hoveredCell.entry.eval.score}/5`
							: "No evaluations"}
						</Typography>
						{hoveredCell.entry.eval.evaluator && (
						  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
							<strong>Evaluator:</strong> {getEvaluatorDisplayName(hoveredCell.entry.eval.evaluator)}
						  </Typography>
						)}
						
						{/* Display individual dimension scores */}
						{hoveredCell.entry.eval.measurements && hoveredCell.entry.eval.measurements.length > 0 && (
						  <Box sx={{ mb: 1 }}>
							<Typography variant="body2" sx={{ fontWeight: 'medium', mb: 0.5 }}>
							  Dimension Scores:
							</Typography>
							{hoveredCell.entry.eval.measurements.map((measurement, idx) => (
							  <Box key={idx} sx={{ ml: 1, mb: 0.5 }}>
								<Typography variant="body2" color="text.secondary">
								  <strong>{getDimensionDisplayName(measurement.dimension)}:</strong> {measurement.score}/5
								</Typography>
								{(measurement.remarks || measurement.notes || measurement.comment) && (
								  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1 }}>
									{extractTextContent(measurement.remarks || measurement.notes || measurement.comment || '')}
								  </Typography>
								)}
							  </Box>
							))}
						  </Box>
						)}
					  </Box>
					)}
				  </Box>
				) : null}
			  </Box>
			) : (
			  <Typography variant="body1" color="text.secondary">
				{repositoryData 
				  ? "Showing all DSU entries from your repository. Colored cells indicate entries with evaluation scores, gray cells show entries without scores, and light gray cells are empty days. Hover over a cell to see details, or click to pin the selection."
				  : "Showing empty calendar structure. Connect a repository to see your actual training progress."
				}
			  </Typography>
			)}
			</Box>
        </Box>
      </Paper>
    </Container>
  );
}

// Export without memo since component has no props
// Re-renders are controlled by context hooks (useTomeSWR)
export default Calendar;
