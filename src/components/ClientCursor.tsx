'use client';

import dynamic from 'next/dynamic';

const LuxuryCursor = dynamic(() => import('./LuxuryCursor'), { ssr: false });

export default function ClientCursor() {
  return <LuxuryCursor />;
}
