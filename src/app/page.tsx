'use client';

import Calendar from './Calendar';
import { Suspense } from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';

function CalendarWithParams() {
  // Calendar now uses context data directly, no props needed
  return <Calendar />;
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
