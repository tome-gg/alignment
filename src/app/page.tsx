'use client';

import Calendar from './Calendar';
import Peers from '../components/Peers';
import CalendarSkeleton from '../components/CalendarSkeleton';
import PeersSkeleton from '../components/PeersSkeleton';
import { Suspense } from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';

function CalendarWithParams() {
  // Calendar now uses context data directly, no props needed
  return (
    <>
      <Suspense fallback={<CalendarSkeleton />}>
        <Calendar />
      </Suspense>
      <Suspense fallback={<PeersSkeleton />}>
        <Peers />
      </Suspense>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading...
          </Typography>
        </Box>
      </Container>
    }>
      <CalendarWithParams />
    </Suspense>
  );
}
