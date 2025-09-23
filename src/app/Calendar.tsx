'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { 
  Container, 
  Typography, 
  Paper, 
  Box
} from '@mui/material';
import Link from 'next/link';
import { trackCalendarCellSelection } from './analytics';

interface DataPoint {
  date: Date;
  value: number;
  close: number;
}

// Define formatting functions as constants
const formatValue = d3.format("+.2%");
const formatClose = d3.format("$,.2f");
const formatDate = d3.utcFormat("%x");

export default function Calendar() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredCell, setHoveredCell] = useState<DataPoint | null>(null);
  const [selectedCell, setSelectedCell] = useState<DataPoint | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Generate sample data for the last calendar year
    const generateSampleData = (): DataPoint[] => {
      const data: DataPoint[] = [];
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setFullYear(endDate.getFullYear() - 1);
      
      const currentDate = new Date(startDate);
      let currentValue = 100; // Starting value
      
      while (currentDate <= endDate) {
        // Generate random percentage change (-5% to +5%)
        const change = (Math.random() - 0.5) * 0.1;
        currentValue *= (1 + change);
        
        data.push({
          date: new Date(currentDate),
          value: change,
          close: currentValue
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return data;
    };

    const data = generateSampleData();

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
        .attr("fill", d => color(d.value))
        .attr("cursor", "pointer")
        .on("mouseover", function(event, d) {
          // Only update hover state if no cell is selected
          if (!selectedCell) {
            setHoveredCell(d);
            d3.select(this).attr("stroke", "#333").attr("stroke-width", 2);
          }
        })
        .on("mouseout", function(event, d) {
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
            d3.select(this).attr("stroke", "#333").attr("stroke-width", 3);
          }
        })
      .append("title")
        .text(d => `${formatDate(d.date)}
${formatValue(d.value)}${d.close === undefined ? "" : `
${formatClose(d.close)}`}`);

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

  }, [selectedCell]);


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
      </Box>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 1 }}>
        <Box sx={{ overflowX: 'auto' }}>
			<Typography variant="h3" component="h1" gutterBottom sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
		  mb: 0
        }}>
          Growth Journal entries
        </Typography>
          <svg ref={svgRef}></svg>
		  <Typography variant="body1" color="text.secondary" sx={{ minHeight: '72px', mb: 3 }}>
			{selectedCell ? (
			  <>
				<strong>{formatDate(selectedCell.date)}</strong> (Selected)<br />
				Change: {formatValue(selectedCell.value)}<br />
				Close: {formatClose(selectedCell.close)}
			  </>
			) : hoveredCell ? (
			  <>
				<strong>{formatDate(hoveredCell.date)}</strong><br />
				Change: {formatValue(hoveredCell.value)}<br />
				Close: {formatClose(hoveredCell.close)}
			  </>
			) : (
			  "There are 53 cells in the chart, representing the 53 weeks in the year. Hover over a cell to see its details, or click to pin the selection."
			)}
			</Typography>
        </Box>
      </Paper>
    </Container>
  );
}
