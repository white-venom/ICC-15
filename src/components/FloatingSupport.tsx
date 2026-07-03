'use client';

import React from 'react';
import { MessageCircle, Bot } from 'lucide-react';

export default function FloatingSupport() {
  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3">
      {/* WhatsApp Button */}
      <button 
        className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
        aria-label="Contact on WhatsApp"
        onClick={() => window.open('https://wa.me/your-number-here', '_blank')}
      >
        <svg 
          viewBox="0 0 24 24" 
          width="24" 
          height="24" 
          stroke="currentColor" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-white fill-white"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      </button>

      {/* Chatbot Button */}
      <button 
        className="w-12 h-12 rounded-full bg-matte-black border border-white/10 text-ivory flex items-center justify-center shadow-lg hover:border-gold/50 hover:text-gold hover:scale-110 transition-all duration-300 backdrop-blur-md"
        aria-label="Open AI Chatbot"
        onClick={() => alert('Chatbot interface opening...')}
      >
        <Bot size={22} />
      </button>
    </div>
  );
}
