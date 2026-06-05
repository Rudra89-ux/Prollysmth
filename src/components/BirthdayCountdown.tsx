import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Clock, Lock, ArrowRight } from 'lucide-react';
import { audioSynth } from '../utils/audio';

interface CountdownProps {
  onBypass: () => void;
  targetDate: Date;
}

export const BirthdayCountdown: React.FC<CountdownProps> = ({ onBypass, targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLoaded: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        // Reload or bypass directly if target date reached
        onBypass();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isLoaded: true
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onBypass]);

  if (!timeLeft.isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-pink-600 font-sans text-sm font-medium">Checking the stardust calendar...</p>
      </div>
    );
  }

  const countdownUnits = [
    { label: 'days', value: timeLeft.days, color: 'from-amber-400 to-yellow-500' },
    { label: 'hours', value: timeLeft.hours, color: 'from-pink-400 to-rose-500' },
    { label: 'minutes', value: timeLeft.minutes, color: 'from-rose-400 to-pink-500' },
    { label: 'seconds', value: timeLeft.seconds, color: 'from-amber-400 to-pink-500' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center px-4 py-8 relative z-10 text-center">
      {/* Decorative Sparkles & Lock Badge */}
      <motion.div
        initial={{ scale: 0, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 bg-pink-300/20 blur-xl rounded-full" />
        <div className="relative bg-white/80 backdrop-blur-md rounded-full p-5 border border-pink-100 shadow-md flex items-center justify-center">
          <Lock className="w-8 h-8 text-pink-500 animate-pulse" />
        </div>
        <div className="absolute -top-2 -left-2 text-yellow-400 animate-bounce text-xl">★</div>
        <div className="absolute -bottom-2 -right-2 text-pink-400 animate-pulse text-xl">★</div>
      </motion.div>

      {/* Main Text Content */}
      <div className="space-y-4 max-w-md mx-auto mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl font-serif font-black text-pink-600 tracking-tight leading-snug"
        >
          Sonaaaaa Di's Birthday Countdown
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm sm:text-base font-sans font-medium text-stone-600 bg-white/60 backdrop-blur-sm py-2 px-4 rounded-xl border border-pink-100/50 inline-block"
        >
          The magic birthday surprise will unfold on <span className="text-pink-600 font-bold">June 6th, 2026</span>!
        </motion.p>
      </div>

      {/* Modern Ticking Clock Bento-style layout */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full max-w-sm mb-10">
        {countdownUnits.map((unit, i) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
            className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-pink-50 shadow-sm relative overflow-hidden"
          >
            {/* Color accent highlight */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-pink-400 to-rose-400/80" />
            
            {/* Value digits with clean spacing */}
            <span className="text-2xl sm:text-3xl font-mono font-bold text-stone-800 tracking-tight">
              {String(unit.value).padStart(2, '0')}
            </span>
            
            {/* Label */}
            <span className="text-3xs sm:text-2xs font-sans text-stone-500 uppercase tracking-widest mt-1 font-semibold">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Subtle Testing / Preview Bypass for standard editor verification */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1.2 }}
        className="mt-4"
      >
        <button
          onClick={() => {
            audioSynth.playPageClick();
            onBypass();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-dashed border-pink-300 text-pink-600 hover:text-pink-700 bg-white/40 hover:bg-white/80 duration-350 transition-colors text-2xs font-semibold rounded-full shadow-sm tracking-wider uppercase cursor-pointer"
        >
          <span>Bypass Countdown (Testing only)</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </motion.div>
    </div>
  );
};
