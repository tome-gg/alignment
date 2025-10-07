'use client';

import React from 'react';
import {
  Container,
  Paper,
  Box,
  Skeleton,
  useMediaQuery
} from '@mui/material';

export default function CalendarSkeleton() {
  const isMobile = useMediaQuery('(max-width:720px)');

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          {/* Title skeleton */}
          <Skeleton variant="text" width={300} height={40} sx={{ mb: 2 }} />
          
          {/* Description skeleton */}
          <Skeleton variant="text" width="80%" height={24} />
        </Box>

        {isMobile ? (
          // Mobile skeleton - dropdown style
          <Box sx={{ mb: 3 }}>
            <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Skeleton variant="rectangular" width={120} height={40} />
              <Skeleton variant="rectangular" width={120} height={40} />
            </Box>
            <Skeleton variant="rectangular" width="100%" height={200} />
          </Box>
        ) : (
          // Desktop skeleton - calendar grid
          <Box>
            {/* Calendar header skeleton */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} variant="text" width={30} height={20} />
              ))}
            </Box>
            
            {/* Calendar grid skeleton */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {Array.from({ length: 8 }).map((_, row) => (
                <Box key={row} sx={{ display: 'flex', gap: 1 }}>
                  {Array.from({ length: 53 }).map((_, col) => (
                    <Skeleton
                      key={col}
                      variant="rectangular"
                      width={16}
                      height={16}
                      sx={{ borderRadius: 0.5 }}
                    />
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Legend skeleton */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Skeleton variant="text" width={60} height={20} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" width={16} height={16} />
            ))}
          </Box>
          <Skeleton variant="text" width={60} height={20} />
        </Box>
      </Paper>
    </Container>
  );
}
