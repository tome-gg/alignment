'use client';

import React from 'react';
import {
  Container,
  Paper,
  Box,
  Skeleton,
  useMediaQuery,
  Typography,
  Button
} from '@mui/material';
import { useCalendarDimensions } from '../hooks/useCalendarDimensions';

export default function CalendarSkeleton() {
  const isMobile = useMediaQuery('(max-width:720px)');
  
  // Use shared hook for consistent dimensions
  const { svgHeight, detailHeight, totalHeight } = useCalendarDimensions();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        {/* Static content - no skeleton needed */}
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
        {/* Only the repository owner name is dynamic */}
        <Typography variant="body2" sx={{ mb: 3, color: 'black', display: 'flex', alignItems: 'center', gap: 0.5 }}>
          Showing data from:{' '}
          <Skeleton variant="text" width={120} height={18} sx={{ display: 'inline-block' }} />
          &apos;s repository
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ 
        p: 3, 
        borderRadius: 1,
        minHeight: { xs: '400px', md: `${totalHeight}px` },
        display: 'flex',
        flexDirection: 'column',
        contain: 'layout style'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          {/* Title skeleton */}
          <Skeleton variant="text" width={300} height={40} />
          {/* Reserved space for Clear button */}
          <Box sx={{ width: '80px', height: '40px' }} />
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
          // Desktop skeleton - calendar grid with fixed height
          <Box sx={{ 
            width: '100%', 
            height: `${svgHeight}px`, 
            minHeight: `${svgHeight}px`,
            maxHeight: `${svgHeight}px`,
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

        {/* Detail section skeleton - fixed height to match Calendar */}
        <Box sx={{ 
          height: `${detailHeight}px`,
          minHeight: `${detailHeight}px`,
          maxHeight: `${detailHeight}px`,
          mt: 3,
          overflow: 'auto'
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
