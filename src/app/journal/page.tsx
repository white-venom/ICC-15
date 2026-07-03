'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, User, ArrowRight, X, BookOpen, Tag } from 'lucide-react';
import JournalBackground from '@/components/JournalBackground';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
  tags: string[];
  content: string[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'art-of-shirtmaking',
    title: 'The Art of Modern Shirtmaking: Stitches and Soul',
    excerpt: 'Explore how Master Tailors fuse centuries-old techniques with modern engineering to craft shirts that are felt before they are seen.',
    author: 'Kabir Nair',
    date: 'June 28, 2026',
    readTime: '6 min read',
    image: '/assets/blog_shirtmaking.png',
    category: 'Sartorial Art',
    tags: ['Tailoring', 'Craftsmanship', 'Luxury'],
    content: [
      'In a world dominated by mass production, the true bespoke shirt stands as a testament to human touch and architectural patience. At Ink & Cotton Club, we do not view the shirt as a commodity. We view it as a structural extension of one\'s presence.',
      'Every shirt tells a story of decisions. Over two hundred individual decisions are made during the creation of a single garment, beginning with the structure of the collar. The collar must frame the face correctly — structured enough to withstand the weight of formal wear, yet flexible enough to follow the movement of the neck.',
      'Our tailors use a multi-step fusing and stitching process, anchoring interlinings with microscopic precision. When you wear our signature Ivory collar, the roll of the fold is engineered to remain crisp for over two hundred washes.',
      'But the detail is not just structural; it is tactile. The double-ply high-twist cotton creates a micro-ventilation matrix that adapts to your body temperature. Tailoring is the alignment of geometry and comfort, creating a silhouette that commands the room before a single word is spoken.'
    ]
  },
  {
    id: 'giza-cotton-legacy',
    title: 'Giza Cotton: The Golden Standard of Egypt',
    excerpt: 'Delve into the sun-drenched Egyptian delta valleys where Giza long-staple cotton is harvested by hand for ultimate luxury.',
    author: 'Aryan Mehta',
    date: 'June 15, 2026',
    readTime: '4 min read',
    image: '/assets/blog_giza_cotton.png',
    category: 'Textile Science',
    tags: ['Giza Cotton', 'Sustainability', 'Fibers'],
    content: [
      'The journey of luxury begins in the soil. Specifically, in the fertile Nile Delta where Egyptian Giza cotton has been grown under the golden Mediterranean sun for centuries.',
      'What makes Giza cotton the undisputed gold standard? It is the staple length. The fibers of Giza cotton are exceptionally long and remarkably fine. This allows our spinners to twist strands into incredibly thin, double-ply yarns without sacrificing tensile strength.',
      'The result is a thread count of 200s and beyond. Woven on historic Italian looms, these yarns create a fabric that is light as a whisper but structurally resilient. It holds its matte sheen, drapes elegantly, and breathes effortlessly.',
      'We harvest Giza cotton entirely by hand to protect the delicate fibers from machine damage. It is a slow, costly process, but it is the only way to ensure that the fabric touching your skin is completely pure, strong, and soft. True luxury does not seek shortcuts.'
    ]
  },
  {
    id: 'wardrobe-of-leadership',
    title: 'The Wardrobe of Leadership: Aesthetics of Authority',
    excerpt: 'How quiet elegance, structured fits, and selective color palettes form an unspoken presence that commands respect.',
    author: 'Marcus Lhoste',
    date: 'June 02, 2026',
    readTime: '5 min read',
    image: '/assets/blog_leadership.png',
    category: 'Executive Style',
    tags: ['Styling', 'Leadership', 'Presence'],
    content: [
      'Leadership does not scream. It sits quietly, defined by structured angles and subtle details. The modern executive\'s wardrobe is a visual language — a dial of authority that can be adjusted with absolute precision.',
      'The psychology of color plays a pivotal role in visual authority. The Onyx Statement — our double-ply black shirt — offers a matte-sheen texture that absorbs light rather than reflecting it. This creates a dense, solid presence, projecting stability and absolute control.',
      'Equally important is the structural alignment. The taper of the waist, the parallel French seams, and the height of the cuffs all coordinate to align with the posture of leadership. When cuffs are mitered and parallel to 0.1mm tolerance, they present an image of meticulous discipline.',
      'To build a wardrobe of leadership, prioritize structure over labels. Choose fabrics that maintain their integrity throughout a sixteen-hour day. Your shirt is not merely clothing; it is the silent armor of your confidence.'
    ]
  }
];

export default function JournalPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const categories = ['All', 'Sartorial Art', 'Textile Science', 'Executive Style'];

  const filteredPosts = selectedCategory === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter(post => post.category === selectedCategory);

  const featuredPost = BLOG_POSTS[0];

  return (
    <div className="relative min-h-screen bg-[#050505] text-ivory pb-24 font-sans">
      {/* Fluid organic ink bleeding backdrop */}
      <JournalBackground />

      {/* Main Content Container */}
      <div className="relative z-10 pt-32 px-6 md:px-16 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.45em] text-gold font-sans mb-3 block animate-pulse-slow">
            The Journal
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-light uppercase tracking-tight text-white mb-4">
            Sartorial Thoughts
          </h1>
          <p className="text-xs md:text-sm font-light text-ivory/50 leading-relaxed font-sans">
            Our reflections on fabric chemistry, styling geometry, and the slow art of premium Italian tailoring.
          </p>
        </div>

        {/* Featured Post - Editorial Wide Card */}
        {selectedCategory === 'All' && featuredPost && (
          <div className="mb-16">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-gold/60 font-sans mb-4">Latest Release</h2>
            <motion.div
              whileHover={{ borderColor: 'rgba(212,175,55,0.25)' }}
              onClick={() => setActivePost(featuredPost)}
              className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8 rounded-3xl bg-white/[0.01] border border-white/5 backdrop-blur-md cursor-pointer transition-all duration-500 shadow-2xl hover:shadow-gold/5 group"
            >
              {/* Image banner */}
              <div className="lg:col-span-7 relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-matte-black/50 border border-white/5">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <span className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md text-[8px] uppercase tracking-[0.25em] font-sans border border-gold/30 text-gold rounded-full">
                  {featuredPost.category}
                </span>
              </div>

              {/* Featured details */}
              <div className="lg:col-span-5 flex flex-col justify-between py-2">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 text-[10px] text-ivory/40 font-sans uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><User size={10} className="text-gold" /> {featuredPost.author}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5"><Clock size={10} className="text-gold" /> {featuredPost.readTime}</span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-4xl font-light text-white uppercase tracking-wide leading-tight group-hover:text-gold transition-colors duration-300">
                    {featuredPost.title}
                  </h3>
                  <p className="text-sm font-light text-ivory/60 leading-relaxed font-sans">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-6 text-[10px] uppercase tracking-[0.25em] font-sans text-gold group-hover:text-white transition-colors duration-300">
                  Read Article <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Categories Tabs & Spacing */}
        <div className="flex flex-wrap items-center justify-between border-t border-b border-white/5 py-6 mb-12 gap-6">
          <div className="flex flex-wrap gap-2 md:gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-[9px] uppercase tracking-[0.2em] font-sans transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-gold text-black font-semibold'
                    : 'bg-white/5 border border-white/5 hover:border-white/20 text-ivory/60 hover:text-ivory'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-[10px] uppercase tracking-widest text-ivory/30 font-sans">
            Showing {filteredPosts.length} Articles
          </span>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <motion.div
              key={post.id}
              whileHover={{ borderColor: 'rgba(212,175,55,0.2)' }}
              onClick={() => setActivePost(post)}
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white/[0.01] border border-white/5 backdrop-blur-md cursor-pointer transition-all duration-500 hover:shadow-lg hover:shadow-black"
            >
              <div className="flex flex-col gap-4">
                {/* Thumbnail image */}
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-matte-black/50 border border-white/5">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-black/60 backdrop-blur-md text-[7px] uppercase tracking-[0.2em] font-sans border border-white/10 text-ivory rounded-full">
                    {post.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[9px] text-ivory/40 font-sans uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><User size={9} className="text-gold" /> {post.author}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5"><Clock size={9} className="text-gold" /> {post.readTime}</span>
                </div>

                <h3 className="font-serif text-lg md:text-xl font-light text-white uppercase tracking-wide group-hover:text-gold transition-colors duration-300 leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs font-light text-ivory/50 leading-relaxed font-sans line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/5 text-[9px] uppercase tracking-[0.25em] font-sans text-gold group-hover:text-white transition-colors duration-300">
                Read Entry <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Blog Detail Full Screen Overlay / Modal */}
      <AnimatePresence>
        {activePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex justify-end bg-black/80 backdrop-blur-sm p-4 md:p-6"
          >
            {/* Modal backdrop click closer */}
            <div className="absolute inset-0" onClick={() => setActivePost(null)} />

            {/* Modal Panel content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="relative w-full max-w-3xl h-full bg-[#070707] border-l border-white/10 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10"
            >
              
              {/* Header bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/35 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-2 text-gold">
                  <BookOpen size={14} />
                  <span className="text-[9px] uppercase tracking-[0.3em] font-sans font-semibold">Reading Article</span>
                </div>
                <button
                  onClick={() => setActivePost(null)}
                  className="p-2 rounded-full border border-white/10 hover:border-gold hover:text-gold transition-colors duration-300"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable content area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
                
                {/* Meta details */}
                <div className="space-y-4">
                  <span className="px-3 py-1 bg-gold/10 text-gold text-[8px] uppercase tracking-[0.25em] border border-gold/30 rounded-full inline-block font-sans">
                    {activePost.category}
                  </span>
                  
                  <h2 className="font-serif text-3xl md:text-5xl font-light uppercase tracking-wide text-white leading-tight">
                    {activePost.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-6 text-[10px] text-ivory/50 uppercase tracking-[0.15em] border-t border-b border-white/5 py-4 font-sans">
                    <span className="flex items-center gap-1.5"><User size={12} className="text-gold" /> Written by {activePost.author}</span>
                    <span className="hidden sm:inline">·</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-gold" /> {activePost.readTime} read</span>
                    <span className="hidden sm:inline">·</span>
                    <span>Released on {activePost.date}</span>
                  </div>
                </div>

                {/* Cover Image banner */}
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black border border-white/5">
                  <img
                    src={activePost.image}
                    alt={activePost.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Article body blocks */}
                <div className="space-y-6 text-sm md:text-base font-light text-ivory/75 leading-relaxed font-sans">
                  {activePost.content.map((paragraph, index) => (
                    <p key={index}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Subtag footer */}
                <div className="pt-8 border-t border-white/5 flex flex-wrap items-center gap-2 font-sans">
                  <Tag size={12} className="text-gold/50 mr-2" />
                  {activePost.tags.map(t => (
                    <span key={t} className="px-2.5 py-1 bg-white/5 rounded-md text-[9px] uppercase tracking-[0.15em] text-ivory/40">
                      #{t}
                    </span>
                  ))}
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
