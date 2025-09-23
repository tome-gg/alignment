'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
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
  useMediaQuery
} from '@mui/material';
import Link from 'next/link';
import { trackCalendarCellSelection } from './analytics';
import { useTomeSWR } from '../contexts/TomeContextSWR';
import { ProcessedTrainingEntry } from '../types/github-repository';

interface DataPoint {
  date: Date;
  value: number;
  close: number;
  entry?: ProcessedTrainingEntry; // Optional training entry data
}

interface CalendarProps {
  // No props needed - will use context data
  [key: string]: unknown;
}

// Define formatting functions as constants
const formatValue = d3.format("+.2%");
const formatClose = d3.format("$,.2f");
const formatDate = d3.utcFormat("%x");

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

export default function Calendar({}: CalendarProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredCell, setHoveredCell] = useState<DataPoint | null>(null);
  const [selectedCell, setSelectedCell] = useState<DataPoint | null>(null);
  const [allDataPoints, setAllDataPoints] = useState<DataPoint[]>([]);
  
  // Responsive detection
  const isMobile = useMediaQuery('(max-width:720px)');
  
  // Format date for dropdown display (MM/DD/YYYY)
  const formatDateForDropdown = (date: Date): string => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };
  
  // Use context data instead of making duplicate SWR calls
  const { repositoryData, repositoryParams, loading, error, validating } = useTomeSWR();

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Transform repository data - generate full calendar with entries mapped to dates
    const transformRepositoryData = (): DataPoint[] => {
      // Get the date range to cover
      const now = new Date();
      const currentYear = now.getUTCFullYear();
      
      // Always show at least the current year
      let startYear = currentYear;
      let endYear = currentYear;
      
      // If we have repository data, extend the range to cover all entry dates
      if (repositoryData?.processedTraining) {
        const entryDates = repositoryData.processedTraining
          .filter(entry => entry.datetimeReadable)
          .map(entry => new Date(entry.datetimeReadable!));
        
        if (entryDates.length > 0) {
          const minDate = new Date(Math.min(...entryDates.map(d => d.getTime())));
          const maxDate = new Date(Math.max(...entryDates.map(d => d.getTime())));
          startYear = Math.min(startYear, minDate.getUTCFullYear());
          endYear = Math.max(endYear, maxDate.getUTCFullYear());
        }
      }

      // Create a map of date strings to training entries for quick lookup
      const entryMap = new Map<string, ProcessedTrainingEntry>();
      if (repositoryData?.processedTraining) {
        repositoryData.processedTraining
          .filter(entry => entry.datetimeReadable)
          .forEach(entry => {
            const date = new Date(entry.datetimeReadable!);
            const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
            entryMap.set(dateKey, entry);
          });
      }

      const data: DataPoint[] = [];
      let currentValue = 100; // Starting value for cumulative calculation

      // Generate all days for each year in the range
      for (let year = startYear; year <= endYear; year++) {
        const yearStart = new Date(year, 0, 1);
        const yearEnd = new Date(year, 11, 31);
        
        for (let d = new Date(yearStart); d <= yearEnd; d.setDate(d.getDate() + 1)) {
          const dateKey = d.toISOString().split('T')[0];
          const entry = entryMap.get(dateKey);
          
          let change: number = 0;
          
          if (entry) {
            if (entry.eval.score && entry.eval.score > 0) {
              // Map evaluation score (1-5) to percentage change (-10% to +10%)
              change = ((entry.eval.score - 3) / 2) * 0.1;
              currentValue *= (1 + change);
            }
            // For entries without eval scores, change remains 0 and currentValue unchanged
          }
          
          data.push({
            date: new Date(d), // Create new Date object to avoid reference issues
            value: change,
            close: currentValue,
            entry
          });
        }
      }
      
      return data;
    };

    const data = transformRepositoryData();
    
    // Store data points for dropdown use
    setAllDataPoints(data);

    // If no data is available, show empty calendar or message
    if (data.length === 0) {
      const svg = d3.select(svgRef.current)
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

    // Chart configuration
    const cellSize = 16; // height of a day
    const height = cellSize * 9; // height of a week (7 days + padding)
    const width = (cellSize + 1.5) * 53; // width of the chart

    // Define formatting functions for the axes and tooltips
    const formatDay = (i: number) => "SMTWTFS"[i];
    const formatMonth = d3.utcFormat("%b");

    // Helpers to compute a day's position in the week
    const timeWeek = d3.utcMonday;
    const countDay = (i: number) => (i + 6) % 7;

    // Compute the extent of the value, ignore the outliers
    // and define a diverging and symmetric color scale
    const max = d3.quantile(data, 0.9975, d => Math.abs(d.value)) || 0.05;
    const color = d3.scaleSequential(d3.interpolateBlues).domain([-max, +max]);

    // Group data by year, in reverse input order
    const years = d3.groups(data, d => d.date.getUTCFullYear()).reverse();

    // A function that draws a thin white line to the left of each month
    function pathMonth(t: Date) {
      const d = Math.max(0, Math.min(6, countDay(t.getUTCDay())));
      const w = timeWeek.count(d3.utcYear(t), t);
      return `${d === 0 ? `M${w * cellSize},0`
          : d === 6 ? `M${(w + 1) * cellSize},0`
          : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`}V${6 * cellSize}`;
    }

    const svg = d3.select(svgRef.current)
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
      .data(d3.range(0, 7))
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
        .attr("x", d => timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 0.5)
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
            d3.select(this).attr("stroke", "#333").attr("stroke-width", 1);
          }
        })
        .on("mouseout", function(_, d) {
          // Only clear hover state if this cell is not selected
          if (!selectedCell || selectedCell !== d) {
            setHoveredCell(null);
            d3.select(this).attr("stroke", null).attr("stroke-width", null);
          }
        })
        .on("click", function(event, d) {
          event.stopPropagation(); // Prevent SVG background click
          
          if (selectedCell === d) {
            // If clicking the same cell, deselect it
            setSelectedCell(null);
            setHoveredCell(null);
            d3.select(this).attr("stroke", null).attr("stroke-width", null);
          } else {
            // Select the new cell
            setSelectedCell(d);
            setHoveredCell(null);
            
            // Track the calendar cell selection event
            trackCalendarCellSelection(d.date, d.value);
            
            // Remove stroke from all other cells
            svg.selectAll("rect").attr("stroke", null).attr("stroke-width", null);
            // Add stroke to selected cell
            d3.select(this).attr("stroke", "#333").attr("stroke-width", 2);
          }
        })
      .append("title")
        .text(d => {
          let tooltip = `${formatDate(d.date)}`;
          
          if (d.entry) {
            if (d.entry.eval.score && d.entry.eval.score > 0) {
              tooltip += `\n${formatValue(d.value)}`;
              if (d.close !== undefined) {
                tooltip += `\n${formatClose(d.close)}`;
              }
              tooltip += `\nScore: ${d.entry.eval.score}`;
            } else {
              tooltip += `\nDSU Entry (No evaluation score)`;
            }
            
            if (d.entry.doing_today) {
              const plainText = extractTextContent(d.entry.doing_today).trim();
              if (plainText) {
                tooltip += `\nDoing: ${plainText}`;
              }
            }
          } else {
            tooltip += `\nNo entry for this date`;
          }
          
          return tooltip;
        });

    const month = year.append("g")
      .selectAll("g")
      .data(([, values]) => d3.utcMonths(d3.utcMonth(values[0].date), values.at(-1)!.date))
      .join("g");

    month.filter((_, i) => Boolean(i)).append("path")
        .attr("fill", "none")
        .attr("stroke", "#fff")
        .attr("stroke-width", 3)
        .attr("d", pathMonth);

    month.append("text")
        .attr("x", d => timeWeek.count(d3.utcYear(d), timeWeek.ceil(d)) * cellSize + 2)
        .attr("y", -5)
        .text(formatMonth);

  }, [selectedCell, repositoryData, isMobile, repositoryParams]);


  // Show loading state only when there's no data at all (not when revalidating with cached data)
  if (loading && !repositoryData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box 
              sx={{ 
                width: 150, 
                height: 20, 
                borderRadius: 1, 
                backgroundColor: 'action.hover',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} 
            />
          </Box>
		</Box>

        <Paper elevation={2} sx={{ p: 3, borderRadius: 1 }}>
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
          </Box>
          
          {/* Calendar skeleton */}
          <Box sx={{ overflowX: 'hidden', px: 2 }}>
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
          
          {/* Detail section skeleton */}
          <Box sx={{ minHeight: '120px', mt: 3, pt: 2 }}>
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
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load repository data: {error}
        </Alert>
        <Typography variant="body1" color="text.secondary">
          Unable to display calendar without repository data. Please check your repository configuration.
        </Typography>
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
	<Typography variant="body1" color="text.primary" sx={{ mb: 3 }}>
	Each legendary <Link style={{ cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }} href="https://protocol.tome.gg" target="_blank">tome of knowledge</Link>
	{' '} is unique. To build your own, you simply need to get started and build the habit first. Consistency is your first goal.
        </Typography>
        {repositoryData && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Showing data from: <strong>{repositoryData.repository.student.name}</strong>&apos;s repository
          </Typography>
        )}
      </Box>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 1 }}>
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
				{selectedCell && (
					<Button 
						onClick={() => {
							setSelectedCell(null);
							setHoveredCell(null);
							// Remove stroke from all cells
							if (svgRef.current) {
								d3.select(svgRef.current).selectAll("rect").attr("stroke", null).attr("stroke-width", null);
							}
						}}
						variant="outlined"
						size="small"
						sx={{ 
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
				)}
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
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {formatDateForDropdown(option.date)}
                      </Typography>
                      {option.entry?.eval?.score && option.entry.eval.score > 0 ? (
                        <Typography variant="caption" color="text.secondary">
                          Score: {option.entry.eval.score}/5 • Change: {formatValue(option.value)}
                        </Typography>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          DSU Entry (No evaluation score)
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
                noOptionsText="No dates with entries found"
                sx={{ my: 2 }}
              />
            </Box>
          ) : (
            <svg ref={svgRef}></svg>
          )}
		  <Box sx={{ minHeight: '120px', mb: 3 }}>
			{selectedCell ? (
			  <Box>
				<Typography variant="body1" color="text.primary" sx={{ fontWeight: 'bold', mb: 1 }}>
				  {formatDate(selectedCell.date)} (Selected)
				</Typography>
				{selectedCell.entry && selectedCell.entry.eval.score && selectedCell.entry.eval.score > 0 ? (
				  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
					Change: {formatValue(selectedCell.value)} | Close: {formatClose(selectedCell.close)}
				  </Typography>
				) : selectedCell.entry ? (
				  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
					DSU Entry (No evaluation score)
				  </Typography>
				) : (
				  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
					No entry for this date
				  </Typography>
				)}
				{selectedCell.entry ? (
				  <Box sx={{ mt: 2 }}>
					{selectedCell.entry.eval.score && selectedCell.entry.eval.score > 0 ? (
					  <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
						Score: {selectedCell.entry.eval.score}/5
					  </Typography>
					) : (
					  <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
						Training entry without evaluation
					  </Typography>
					)}
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
					  <Typography variant="body2" color="text.secondary">
						<strong>Blockers:</strong>{' '}
						{extractTextContent(selectedCell.entry.blockers)}
					  </Typography>
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
				{hoveredCell.entry && hoveredCell.entry.eval.score && hoveredCell.entry.eval.score > 0 ? (
				  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
					Change: {formatValue(hoveredCell.value)} | Close: {formatClose(hoveredCell.close)}
				  </Typography>
				) : hoveredCell.entry ? (
				  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
					DSU Entry (No evaluation score)
				  </Typography>
				) : (
				  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
					No entry for this date
				  </Typography>
				)}
				{hoveredCell.entry ? (
				  <Box sx={{ mt: 2 }}>
					{hoveredCell.entry.eval.score && hoveredCell.entry.eval.score > 0 ? (
					  <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
						Score: {hoveredCell.entry.eval.score}/5
					  </Typography>
					) : (
					  <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
						Training entry without evaluation
					  </Typography>
					)}
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
					  <Typography variant="body2" color="text.secondary">
						<strong>Blockers:</strong>{' '}
						{extractTextContent(hoveredCell.entry.blockers)}
					  </Typography>
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
