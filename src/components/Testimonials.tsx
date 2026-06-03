import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Star, Quote, Sparkles } from "lucide-react";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  project: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "test_1",
    quote: "Moon Looks completely redefined what our Noida Sector 150 apartment could feel like. From the fluted wall panelling details in the foyer to the fully customized premium acrylic modular kitchen layouts, their carpentry execution is world-class.",
    author: "Aditya & Shweta Sharma",
    role: "Senior Director, Fintech Solutions",
    project: "Ace Parkway, Greater Noida",
    rating: 5,
  },
  {
    id: "test_2",
    quote: "Absolute precision in spatial planning and layout delivery! The team at Moon Looks constructed beautiful false ceilings with curatorial warm profiles and paired them with a gorgeous Calacatta Viola marble dining table. The entire project was tracked transparently on their client dashboard.",
    author: "Dr. Kavitha Shridhar",
    role: "Senior Consultant Cardiologist",
    project: "Koramangala 4th Block, Bangalore",
    rating: 5,
  },
  {
    id: "test_3",
    quote: "I wanted a home that felt both like a mid-century Indian heritage design and an urban minimalist duplex flat. The hand-selected premium teak veneers, automated warm lighting zones, and pristine glass partitions did exactly that. No budget creeps or material variance.",
    author: "Rohan Malhotra",
    role: "Product Lead & Tech Investor",
    project: "DLF Phase 3, Gurgaon",
    rating: 5,
  },
  {
    id: "test_4",
    quote: "Our villa renovation in Pune was stress-free. The supervising designer managed the local contractor handovers fluently and certified every plywood grade and lacquer coat personally. Truly a luxury service for busy homeowners.",
    author: "Anjali & Nilesh Deshmukh",
    role: "Real Estate Developer & Designer",
    project: "Koregaon Park Villa, Pune",
    rating: 5,
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      handleNext();
    }, 7000);
    return () => clearInterval(interval);
  }, [activeIndex, isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  // Motion variants for slide/fade animations
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 180, damping: 22 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -120 : 120,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { duration: 0.3, ease: "easeInOut" },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    }),
  };

  const current = TESTIMONIALS[activeIndex];

  return (
    <div className="bg-gradient-to-b from-[#FFFAE1]/10 to-[#FFFAE1]/30 border-t border-b border-gray-100 py-20 px-6 overflow-hidden">
      <div className="mx-auto max-w-5xl">
        
        {/* Editorial Title */}
        <div className="mb-12 text-center">
          <span className="font-mono text-xs tracking-[0.4em] text-[#6B2737] uppercase bg-[#6B2737]/5 px-4 py-1.5 rounded-full inline-block mb-3">
            Atelier Chronicles
          </span>
          <h2 className="font-sans text-3xl font-extralight tracking-tight text-gray-900 md:text-4xl">
            PATRON <span className="font-semibold text-[#6B2737]">TESTIMONIALS</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-sans text-xs font-light text-gray-500 uppercase tracking-widest">
            Composing structural poetry for the world’s finest esthetes
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative min-h-[300px] flex items-center justify-center p-2">
          
          {/* Navigation Controls - Left */}
          <button 
            onClick={handlePrev}
            className="absolute left-0 lg:-left-12 z-20 h-11 w-11 rounded-full border border-gray-200 bg-white text-gray-600 flex items-center justify-center hover:border-[#6B2737] hover:text-[#6B2737] hover:shadow-md active:scale-95 transition-all cursor-pointer shadow-sm hidden sm:flex"
            aria-label="Previous Testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Core Animating Content Area */}
          <div className="w-full max-w-3xl bg-white border border-gray-150/80 rounded-3xl p-8 md:p-12 shadow-xl shadow-gray-100/40 relative">
            
            {/* Elegant Floating Quote Mark */}
            <div className="absolute right-8 top-8 opacity-5 text-[#6B2737]">
              <Quote className="h-20 w-20 transform scale-x-[-1]" />
            </div>

            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={current.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col items-center text-center space-y-6"
              >
                {/* Visual Indicators */}
                <div className="flex items-center space-x-1 justify-center text-amber-500 text-xs">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500 stroke-amber-500" />
                  ))}
                </div>

                {/* Main Quote */}
                <blockquote className="font-sans text-base sm:text-lg md:text-xl font-extralight text-gray-800 italic leading-relaxed max-w-2xl px-2">
                  "{current.quote}"
                </blockquote>

                {/* Citation/Author Card */}
                <div className="border-t border-gray-50 w-2/3 pt-5 flex flex-col items-center">
                  <span className="font-sans text-sm font-semibold text-gray-900 tracking-wide">
                    {current.author}
                  </span>
                  <span className="font-mono text-[9px] text-[#6B2737] tracking-widest uppercase mt-0.5 font-bold">
                    {current.role}
                  </span>
                  <span className="inline-flex items-center mt-2 px-3 py-0.5 rounded-full bg-[#6B2737]/5 border border-[#6B2737]/10 font-sans text-[11px] text-gray-600 font-light">
                    <Sparkles className="h-2.5 w-2.5 text-amber-500 fill-amber-500 mr-1 shrink-0" />
                    {current.project}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>

          {/* Navigation Controls - Right */}
          <button 
            onClick={handleNext}
            className="absolute right-0 lg:-right-12 z-20 h-11 w-11 rounded-full border border-gray-200 bg-white text-gray-600 flex items-center justify-center hover:border-[#6B2737] hover:text-[#6B2737] hover:shadow-md active:scale-95 transition-all cursor-pointer shadow-sm hidden sm:flex"
            aria-label="Next Testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

        </div>

        {/* Carousel Custom Dot Controls */}
        <div className="mt-8 flex justify-center items-center space-x-2">
          {TESTIMONIALS.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => handleDotClick(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx 
                  ? "w-8 bg-[#6B2737]" 
                  : "w-2.5 bg-gray-200 hover:bg-gray-300"
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>

        {/* Swipe indicator for mobile */}
        <p className="text-center text-[10px] text-gray-400 font-mono tracking-wider mt-4 sm:hidden uppercase">
          Tap dots to toggle patrons
        </p>

      </div>
    </div>
  );
}
