import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Letter } from '../types';
import { audioSynth } from '../utils/audio';
import { Heart, ChevronLeft, ChevronRight, Gift, Sparkles } from 'lucide-react';

interface StorybookLettersProps {
  onLettersComplete: () => void;
  triggerBurst: () => void;
}

const LETTERS_DATA: Letter[] = [
  {
    id: 1,
    message: `Happy Birthday, Sonaaaaa Di! 🎂💖\n\nToday is your special day, and I hope it's filled with laughter, happiness, amazing surprises, and lots of cake. You deserve a day that's as wonderful as you are. 🌸✨`,
    shortDesc: "Warm Wishes"
  },
  {
    id: 2,
    message: `Even though I don't always say it, I truly appreciate having you as my sister. 💗\n\nLife isn't always easy, but knowing you're around somehow makes things feel better. Thank you for being a part of my life. 😃`,
    shortDesc: "A Secret Appreciation"
  },
  {
    id: 3,
    message: `Some days are confusing.\nSome days are stressful.\nSome days are just completely 🥴.\n\nBut having someone like you around makes those days easier to get through. 💖`,
    shortDesc: "Brightening Cloudy Days"
  },
  {
    id: 4,
    message: `Thank you for the emotional support you've given me over the years.\n\nThere have been moments when I felt lost, frustrated, worried, or overwhelmed 😭.\n\nYou may not even realize how much your words, your presence, or even small conversations helped me.\n\nSometimes all it takes is knowing someone cares, and you've always been that person for me. 💗\n\nFor that, I'll always be grateful.`,
    shortDesc: "My Pillar of Support"
  },
  {
    id: 5,
    message: `I hope this year brings you endless happiness, unforgettable memories, success in everything you do, and countless reasons to smile. 😃✨`,
    shortDesc: "Wishing You Endless Joys"
  },
  {
    id: 6,
    message: `No matter how much we tease each other, argue over random things, or act silly 🥴...\n\nYou'll always be my Sonaaaaa Di. 💖`,
    shortDesc: "Sister Teasing & silly fights"
  },
  {
    id: 7,
    message: `And today, I just want to say...\n\nThank you.\nFor everything.\nFor being you.\nFor being my sister. 💗😭✨`,
    shortDesc: "Thanks For Being You"
  }
];

export const StorybookLetters: React.FC<StorybookLettersProps> = ({
  onLettersComplete,
  triggerBurst
}) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for back, 1 for forward

  const currentLetter = LETTERS_DATA[index];

  const handleNext = () => {
    if (index < LETTERS_DATA.length - 1) {
      audioSynth.playPageClick();
      setDirection(1);
      setIndex((prev) => prev + 1);
      triggerBurst();
    } else {
      // Completed last letter
      audioSynth.playPageClick();
      audioSynth.playPopSound();
      onLettersComplete();
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      audioSynth.playPageClick();
      setDirection(-1);
      setIndex((prev) => prev - 1);
      triggerBurst();
    }
  };

  // Fade-slide animation variants derived from swipe actions
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 150 : -150,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 25 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.3 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 150 : -150,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 25 },
        opacity: { duration: 0.25 }
      }
    })
  };

  // Percentage of completion helper
  const progressPercent = ((index + 1) / LETTERS_DATA.length) * 100;

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center px-4 relative z-10">
      
      {/* Tiny progress banner */}
      <div className="mb-4 flex items-center justify-between w-full max-w-md text-xs font-semibold text-pink-500 bg-white/70 backdrop-blur-sm self-center border border-pink-100 rounded-full px-4 py-1.5 shadow-sm">
        <span className="flex items-center gap-1">
          <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400 animate-pulse" />
          <span>Page {index + 1} of {LETTERS_DATA.length}</span>
        </span>
        <span className="text-pink-400 font-sans">{currentLetter.shortDesc}</span>
      </div>

      {/* Interactive Storybook Letter Card Container */}
      <div className="w-full relative min-h-[380px] sm:min-h-[340px] flex items-center justify-center">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full glass-card rounded-2xl md:rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative shadow-xl overflow-hidden"
          >
            {/* Top soft glowing indicator */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-300 via-yellow-200 to-rose-300" />
            
            {/* Soft watermark ribbon behind letter */}
            <div className="absolute -right-12 -top-12 text-pink-100/20 select-none pointer-events-none transform rotate-45">
              <Sparkles className="w-48 h-48" />
            </div>

            {/* Letter content */}
            <div className="prose prose-pink font-sans text-stone-700 leading-relaxed z-10">
              {currentLetter.message.split('\n\n').map((paragraph, pIdx) => (
                <p 
                  key={pIdx} 
                  className={`mb-4 text-base sm:text-lg text-stone-800 ${
                    pIdx === 0 
                      ? 'font-serif text-lg sm:text-xl font-semibold bg-gradient-to-r from-pink-600 to-rose-700 bg-clip-text text-transparent' 
                      : ''
                  }`}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Cute bottom decorative elements */}
            <div className="mt-6 flex items-center justify-between border-t border-pink-100/60 pt-4 z-10">
              <span className="font-cursive text-2xl font-semibold text-rose-500/80">
                Lots of love
              </span>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((dot) => (
                  <div
                    key={dot}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      dot === index % 3 ? 'bg-pink-400 scale-125' : 'bg-pink-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress slider bar */}
      <div className="w-full max-w-md bg-pink-100/50 rounded-full h-1 mt-6 overflow-hidden">
        <div
          className="bg-gradient-to-r from-pink-400 to-rose-400 h-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Cute Navigation Toolbar */}
      <div className="flex justify-between items-center w-full max-w-sm mt-8 gap-4 px-4 relative">
        {/* Cute Previous Arrow Button */}
        <button
          onClick={handlePrev}
          disabled={index === 0}
          className={`flex items-center justify-center gap-1 bg-white border border-pink-200 text-pink-600 rounded-full px-5 py-2.5 shadow-md font-sans text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 group ${
            index === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-pink-50'
          }`}
          aria-label="Previous message"
        >
          <ChevronLeft className="w-4 h-4 text-pink-500 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back</span>
        </button>

        {/* Cute Next Arrow Button */}
        <button
          onClick={handleNext}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-full px-6 py-3 shadow-lg font-sans text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-pink-300/50 hover:shadow-xl group"
          aria-label="Next message"
        >
          <span>
            {index === LETTERS_DATA.length - 1 ? 'Unbox Cake!' : 'Next'}
          </span>
          {index === LETTERS_DATA.length - 1 ? (
            <Gift className="w-4 h-4 text-white animate-bounce" />
          ) : (
            <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
          )}
        </button>
      </div>
    </div>
  );
};
