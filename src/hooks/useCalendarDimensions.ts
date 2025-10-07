import { useMemo } from 'react';
import { useMediaQuery } from '@mui/material';

/**
 * Custom hook to calculate fixed calendar layout dimensions
 * Used to prevent Cumulative Layout Shift (CLS) by reserving consistent space
 * 
 * @returns Layout dimensions for calendar SVG and detail sections
 */
export function useCalendarDimensions() {
  const isMobile = useMediaQuery('(max-width:720px)');
  
  return useMemo(() => {
    const cellSize = isMobile ? 12 : 16;
    // Estimate max years to show (current year + 2 years back/forward)
    const estimatedYears = 3;
    const svgHeight = cellSize * 9 * estimatedYears + 30;
    const detailHeight = 400; // Fixed height for detail section
    
    return {
      cellSize,
      svgHeight,
      detailHeight,
      svgContainerHeight: svgHeight,
      totalHeight: svgHeight + detailHeight + 110 // Total including padding
    };
  }, [isMobile]);
}

