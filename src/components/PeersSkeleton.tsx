'use client';

import React from 'react';
import {
  Container,
  Box,
  Paper,
  Skeleton
} from '@mui/material';

export default function PeersSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        {/* Render 2-3 peer group skeletons */}
        {Array.from({ length: 3 }).map((_, groupIndex) => (
          <Box key={groupIndex} sx={{ mb: 3 }}>
            <Paper
              variant="outlined"
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 1,
                p: 2
              }}
            >
              {/* Group title skeleton */}
              <Skeleton variant="text" width={200} height={32} sx={{ mb: 1 }} />
              
              {/* Peer list skeletons */}
              <Box sx={{ py: 0 }}>
                {Array.from({ length: 4 + Math.floor(Math.random() * 3) }).map((_, peerIndex) => (
                  <Box
                    key={peerIndex}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      py: 1,
                      borderBottom: peerIndex < 3 ? '1px solid' : 'none',
                      borderColor: 'divider'
                    }}
                  >
                    {/* Avatar skeleton */}
                    <Skeleton
                      variant="circular"
                      width={40}
                      height={40}
                      sx={{ mr: 2 }}
                    />
                    
                    <Box sx={{ flex: 1 }}>
                      {/* Name skeleton */}
                      <Skeleton
                        variant="text"
                        width={120 + Math.random() * 80}
                        height={24}
                        sx={{ mb: 0.5 }}
                      />
                      
                      {/* Tags skeleton */}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {Array.from({ length: 2 + Math.floor(Math.random() * 3) }).map((_, tagIndex) => (
                          <Skeleton
                            key={tagIndex}
                            variant="rectangular"
                            width={60 + Math.random() * 40}
                            height={24}
                            sx={{ borderRadius: 12 }}
                          />
                        ))}
                      </Box>
                    </Box>
                    
                    {/* Link skeleton */}
                    <Skeleton
                      variant="rectangular"
                      width={24}
                      height={24}
                      sx={{ borderRadius: 1 }}
                    />
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
