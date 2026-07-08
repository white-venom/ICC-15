'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function JournalPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/#journal');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold/10 border-t-gold rounded-full animate-spin" />
    </div>
  );
}
