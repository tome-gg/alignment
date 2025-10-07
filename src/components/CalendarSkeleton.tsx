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
      <Box sx={{ mb: 4 }}>
        {/* Header description skeleton */}
        <Skeleton variant="text" width="90%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="85%" height={24} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width={150} height={36} sx={{ borderRadius: 3, mb: 3 }} />
        <Skeleton variant="text" width="60%" height={20} />
      </Box>

      <Paper elevation={2} sx={{ 
        p: 3, 
        borderRadius: 1,
        minHeight: { xs: '400px', md: '600px' },
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ mb: 3 }}>
          {/* Title skeleton */}
          <Skeleton variant="text" width={300} height={40} sx={{ mb: 2 }} />
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
          <Box sx={{ 
            width: '100%', 
            height: '400px', 
            minHeight: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            overflow: 'auto',
            position: 'relative'
          }}>
            <Box sx={{ width: '100%', maxWidth: '900px' }}>
              {/* Calendar grid skeleton */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {Array.from({ length: 8 }).map((_, row) => (
                  <Box key={row} sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
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
          </Box>
        )}

        {/* Detail section skeleton - flexible height */}
        <Box sx={{ 
          minHeight: '120px', 
          mt: 3,
          flex: '1 1 auto'
        }}>
          <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="75%" height={16} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="60%" height={16} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="85%" height={16} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" height={16} />
        </Box>
      </Paper>
    </Container>
  );
}
