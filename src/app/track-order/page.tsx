import React, { Suspense } from 'react';
import TrackOrderClient from '@/components/TrackOrderClient';

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-white">Loading tracker...</div>}>
      <TrackOrderClient />
    </Suspense>
  );
}
