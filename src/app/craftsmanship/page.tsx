'use client';

import React from 'react';
import StoryChapters from '@/components/StoryChapters';
import CraftsmanshipBackground from '@/components/CraftsmanshipBackground';

export default function CraftsmanshipPage() {
  return (
    <div className="relative min-h-screen bg-transparent text-ivory">
      {/* Precision brand logo monogram background with canvas background color */}
      <CraftsmanshipBackground />

      {/* Main Content */}
      <div className="relative z-10 pt-24 min-h-screen">
        <StoryChapters
          onSectionChange={() => {}}
          onFocusAreaChange={() => {}}
        />
      </div>
    </div>
  );
}
