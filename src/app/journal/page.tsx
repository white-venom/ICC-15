'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, User, ArrowRight, X, BookOpen, Tag } from 'lucide-react';
import JournalBackground from '@/components/JournalBackground';
import { useAppContext } from '@/context/AppContext';
import { TRANSLATIONS } from '@/utils/translations';

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

export default function JournalPage() {
  const { country } = useAppContext();
  const isArabic = country === 'DUBAI';
  const t = isArabic ? TRANSLATIONS.ar : TRANSLATIONS.en;

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const categories = isArabic
    ? ['الكل', 'فن الخياطة', 'علوم المنسوجات', 'الأسلوب القيادي']
    : ['All', 'Sartorial Art', 'Textile Science', 'Executive Style'];

  useEffect(() => {
    setSelectedCategory(categories[0]);
  }, [isArabic]);

  useEffect(() => {
    let active = true;
    fetch('/api/journals')
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          const mapped = data.map((post: any) => ({
            id: post.id,
            title: isArabic ? post.titleAr : post.title,
            excerpt: isArabic ? post.excerptAr : post.excerpt,
            author: isArabic ? post.authorAr : post.author,
            date: isArabic ? post.dateAr : post.date,
            readTime: isArabic ? post.readTimeAr : post.readTime,
            image: post.image,
            category: isArabic ? post.categoryAr : post.category,
            tags: isArabic ? post.tagsAr : post.tags,
            content: isArabic ? post.contentAr : post.content
          }));
          setBlogPosts(mapped);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch journals:', err);
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isArabic]);

  const filteredPosts = selectedCategory === categories[0]
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = blogPosts[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-ivory flex justify-center items-center">
        <div className="w-10 h-10 border-2 border-gold/10 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-ivory pb-24 font-sans" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Fluid organic ink bleeding backdrop */}
      <JournalBackground />

      {/* Main Content Container */}
      <div className="relative z-10 pt-32 px-6 md:px-16 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.45em] text-gold font-sans mb-3 block animate-pulse-slow">
            {isArabic ? 'المجلة الافتتاحية' : 'The Journal'}
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-light uppercase tracking-tight text-white mb-4">
            {t.journalTitle}
          </h1>
          <p className="text-xs md:text-sm font-light text-ivory/50 leading-relaxed font-sans">
            {t.journalDesc}
          </p>
        </div>

        {/* Featured Post - Editorial Wide Card */}
        {selectedCategory === categories[0] && featuredPost && (
          <div className="mb-16">
            <h2 className={`text-[10px] uppercase tracking-[0.3em] text-gold/60 font-sans mb-4 ${isArabic ? 'text-right' : 'text-left'}`}>
              {isArabic ? 'آخر الإصدارات' : 'Latest Release'}
            </h2>
            <motion.div
              whileHover={{ borderColor: 'rgba(212,175,55,0.25)' }}
              onClick={() => setActivePost(featuredPost)}
              className={`relative grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8 rounded-3xl bg-white/[0.01] border border-white/5 backdrop-blur-md cursor-pointer transition-all duration-500 shadow-2xl hover:shadow-gold/5 group ${isArabic ? 'text-right' : 'text-left'}`}
            >
              {/* Image banner */}
              <div className="lg:col-span-7 relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-matte-black/50 border border-white/5">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <span className={`absolute top-4 ${isArabic ? 'right-4' : 'left-4'} px-3 py-1 bg-black/60 backdrop-blur-md text-[8px] uppercase tracking-[0.25em] font-sans border border-gold/30 text-gold rounded-full`}>
                  {featuredPost.category}
                </span>
              </div>

              {/* Featured details */}
              <div className="lg:col-span-5 flex flex-col justify-between py-2">
                <div className="flex flex-col gap-4">
                  <div className={`flex items-center gap-4 text-[10px] text-ivory/40 font-sans uppercase tracking-widest ${isArabic ? 'flex-row-reverse' : ''}`}>
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

                <div className={`flex items-center gap-2 mt-6 text-[10px] uppercase tracking-[0.25em] font-sans text-gold group-hover:text-white transition-colors duration-300 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  {isArabic ? 'اقرأ المقال كاملاً' : 'Read Article'} <ArrowRight size={12} className={`transition-transform ${isArabic ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Categories Tabs & Spacing */}
        <div className={`flex flex-wrap items-center justify-between border-t border-b border-white/5 py-6 mb-12 gap-6 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <div className={`flex flex-wrap gap-2 md:gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
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
            {isArabic ? `عرض ${filteredPosts.length} مقالات` : `Showing ${filteredPosts.length} Articles`}
          </span>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <motion.div
              key={post.id}
              whileHover={{ borderColor: 'rgba(212,175,55,0.2)' }}
              onClick={() => setActivePost(post)}
              className={`group relative flex flex-col justify-between p-5 rounded-2xl bg-white/[0.01] border border-white/5 backdrop-blur-md cursor-pointer transition-all duration-500 hover:shadow-lg hover:shadow-black ${isArabic ? 'text-right' : 'text-left'}`}
            >
              <div className="flex flex-col gap-4">
                {/* Thumbnail image */}
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-matte-black/50 border border-white/5">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className={`absolute top-3 ${isArabic ? 'right-3' : 'left-3'} px-2.5 py-0.5 bg-black/60 backdrop-blur-md text-[7px] uppercase tracking-[0.2em] font-sans border border-white/10 text-ivory rounded-full`}>
                    {post.category}
                  </span>
                </div>

                <div className={`flex items-center gap-3 text-[9px] text-ivory/40 font-sans uppercase tracking-widest ${isArabic ? 'flex-row-reverse' : ''}`}>
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

              <div className={`flex items-center gap-2 mt-6 pt-4 border-t border-white/5 text-[9px] uppercase tracking-[0.25em] font-sans text-gold group-hover:text-white transition-colors duration-300 ${isArabic ? 'flex-row-reverse' : ''}`}>
                {isArabic ? 'اقرأ المقال' : 'Read Entry'} <ArrowRight size={10} className={`transition-transform ${isArabic ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
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
            className={`fixed inset-0 z-[100] flex bg-black/80 backdrop-blur-sm p-4 md:p-6 ${isArabic ? 'justify-start' : 'justify-end'}`}
          >
            {/* Modal backdrop click closer */}
            <div className="absolute inset-0" onClick={() => setActivePost(null)} />

            {/* Modal Panel content */}
            <motion.div
              initial={{ x: isArabic ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isArabic ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className={`relative w-full max-w-3xl h-full bg-[#070707] border-l border-white/10 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 ${isArabic ? 'text-right border-r border-l-0' : 'text-left'}`}
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              
              {/* Header bar */}
              <div className={`flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/35 backdrop-blur-md shrink-0 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 text-gold ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <BookOpen size={14} />
                  <span className="text-[9px] uppercase tracking-[0.3em] font-sans font-semibold">{isArabic ? 'قراءة مقال' : 'Reading Article'}</span>
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

                  <div className={`flex flex-wrap items-center gap-6 text-[10px] text-ivory/50 uppercase tracking-[0.15em] border-t border-b border-white/5 py-4 font-sans ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <span className="flex items-center gap-1.5"><User size={12} className="text-gold" /> {isArabic ? `كُتب بواسطة ${activePost.author}` : `Written by ${activePost.author}`}</span>
                    <span className="hidden sm:inline">·</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-gold" /> {isArabic ? `قراءة في ${activePost.readTime}` : `${activePost.readTime} read`}</span>
                    <span className="hidden sm:inline">·</span>
                    <span>{isArabic ? `نُشر في ${activePost.date}` : `Released on ${activePost.date}`}</span>
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
                <div className={`pt-8 border-t border-white/5 flex flex-wrap items-center gap-2 font-sans ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <Tag size={12} className={`text-gold/50 ${isArabic ? 'ml-2' : 'mr-2'}`} />
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
