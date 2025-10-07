'use client';

import dynamic from 'next/dynamic';

// Dynamic import for Calendar component to reduce initial bundle size
const Calendar = dynamic(() => import('./Calendar'), {
  loading: () => <CalendarSkeleton />,
  ssr: false // Calendar uses D3 DOM manipulation, better to render client-side only
});
import Peers from '../components/Peers';
import CalendarSkeleton from '../components/CalendarSkeleton';
import PeersSkeleton from '../components/PeersSkeleton';
import { Suspense } from 'react';

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
  return <CalendarWithParams />;
}
