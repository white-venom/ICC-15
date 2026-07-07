'use client';

import React, { useState } from 'react';
import StoryChapters from '@/components/StoryChapters';
import CraftsmanshipBackground from '@/components/CraftsmanshipBackground';


export default function CraftsmanshipPage() {
  const [activeSection, setActiveSection] = useState('cotton');
  const [focusArea, setFocusArea] = useState<'all' | 'collar' | 'sleeve' | 'button'>('all');

  return (
    <div className="relative min-h-screen bg-[#050505] text-ivory">
      {/* Precision brand logo monogram background */}
      <CraftsmanshipBackground />


      {/* Main Content Overlays */}
      <div className="relative z-10 pt-24 min-h-screen">
        <StoryChapters
          onSectionChange={setActiveSection}
          onFocusAreaChange={setFocusArea}
        />
      </div>
    </div>
  );
}
