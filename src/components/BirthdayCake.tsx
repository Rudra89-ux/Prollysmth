import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audioSynth } from '../utils/audio';
import { Sparkles, Heart } from 'lucide-react';

interface BirthdayCakeProps {
  onWishUnlocked: () => void;
  triggerConfetti: () => void;
  triggerFirework: () => void;
  triggerBurst: () => void;
}

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({
  onWishUnlocked,
  triggerConfetti,
  triggerFirework,
  triggerBurst
}) => {
  const [candlesLit, setCandlesLit] = useState(true);
  const [wishUnlocked, setWishUnlocked] = useState(false);

  const handleBlowCandles = () => {
    if (!candlesLit) return;
    setCandlesLit(false);
    audioSynth.playPopSound();
    audioSynth.playBirthdayChime();
    triggerConfetti();
    triggerFirework();
    triggerBurst();

    // Reveal final wish shortly after
    setTimeout(() => {
      setWishUnlocked(true);
      onWishUnlocked();
    }, 1800);
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center px-4 relative z-10 text-center py-6">
      
      <div className="mb-6">
        <h2 className="text-3xl font-serif font-extrabold text-pink-600 tracking-tight flex items-center justify-center gap-2">
          One More Surprise...
        </h2>
        <p className="text-sm text-stone-600 mt-1 font-sans">
          {candlesLit 
            ? "Tap the candles to blow them out and unlock your special wish!" 
            : "Your wish has been sent to the stars!"}
        </p>
      </div>

      {/* Birthday Cake Box with floating sparks container */}
      <div 
        onClick={handleBlowCandles}
        className={`relative cursor-pointer select-none group w-72 h-80 flex flex-col items-center justify-end pb-8 transition-transform duration-500 ease-out ${
          candlesLit ? 'hover:scale-105 active:scale-95' : 'scale-100'
        }`}
      >
        {/* Giant glow surrounding the cake */}
        <div className={`absolute bottom-16 w-56 h-56 rounded-full bg-gradient-to-tr from-pink-300 via-rose-300 to-yellow-100 blur-3xl opacity-40 transition-opacity duration-1000 ${
          candlesLit ? 'group-hover:opacity-65 animate-pulse-slow' : 'opacity-10'
        }`} />

        {/* Ambient candle flame lit glow */}
        <AnimatePresence>
          {candlesLit && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute top-12 w-48 h-12 bg-yellow-300/20 rounded-full blur-xl animate-pulse"
            />
          )}
        </AnimatePresence>

        {/* --- CAKE VECTOR GRAPHICS --- */}
        <div className="relative w-64 h-56 flex flex-col items-center justify-end">
          
          {/* CANDLES */}
          <div className="flex gap-4 justify-center items-end h-16 mb-[-2px] relative z-20">
            {[0, 1, 2].map((num) => (
              <div key={num} className="flex flex-col items-center relative">
                {/* Candle Flame */}
                <AnimatePresence>
                  {candlesLit ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.15, 1, 1.05] }}
                      exit={{ scale: 0, y: -10, opacity: 0 }}
                      transition={{ 
                        repeat: Infinity,
                        duration: 0.15 + num * 0.05, 
                        ease: "easeInOut" 
                      }}
                      className="w-4 h-6 bg-gradient-to-t from-amber-500 via-yellow-400 to-orange-300 rounded-b-md rounded-t-full filter drop-shadow-[0_0_8px_rgba(251,191,36,1)] origin-bottom cursor-pointer"
                    />
                  ) : (
                    /* Smoke trails on extinguish */
                    <motion.div
                      initial={{ opacity: 1, y: 0, scale: 0.5 }}
                      animate={{ opacity: 0, y: -25, scale: 1.5 }}
                      transition={{ duration: 0.8 }}
                      className="absolute -top-3 w-5 h-5 bg-stone-300/45 rounded-full filter blur-[2px]"
                    />
                  )}
                </AnimatePresence>
                
                {/* Wick */}
                <div className="w-0.5 h-2 bg-stone-700" />
                
                {/* Cute Stripe Candle Body */}
                <div className={`w-3.5 h-12 rounded-t bg-gradient-to-b ${
                  num === 1 
                    ? 'from-gold-300 via-gold-200 to-gold-400' 
                    : 'from-pink-300 via-amber-200 to-pink-400'
                  } border-x border-stone-800/10 shadow-sm relative overflow-hidden`}
                >
                  {/* Candle stripes */}
                  <div className="absolute top-1 left-0 right-0 h-1 bg-white/35 transform -rotate-12" />
                  <div className="absolute top-4 left-0 right-0 h-1 bg-white/35 transform -rotate-12" />
                  <div className="absolute top-7 left-0 right-0 h-1 bg-white/35 transform -rotate-12" />
                  <div className="absolute top-10 left-0 right-0 h-1 bg-white/35 transform -rotate-12" />
                </div>
              </div>
            ))}
          </div>

          {/* CAKE TIER 2 (Top Tier) */}
          <div className="w-44 h-16 bg-gradient-to-r from-pink-300 via-pink-200 to-pink-300 rounded-t-xl relative border-x border-pink-400/20 shadow-md z-10">
            {/* Elegant Vanilla Cream Drips */}
            <div className="absolute -bottom-1 left-0 right-0 h-4 flex justify-between px-0.5 pointer-events-none">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white h-4 w-4.5 rounded-b-full shadow-sm"
                  style={{ 
                    height: `${8 + (i % 3) * 4}px`, 
                    marginTop: '-2px' 
                  }}
                />
              ))}
            </div>
            
            {/* Sweet Strawberries on Top */}
            <div className="absolute -top-3 left-0 right-0 flex justify-around px-4 pointer-events-none">
              {[0, 1, 2, 3].map((s) => (
                <div 
                  key={s} 
                  className="w-4 h-4 bg-gradient-to-tr from-rose-500 to-pink-600 rounded-full shadow-inner animate-pulse flex items-center justify-center"
                  style={{ animationDelay: `${s * 0.4}s` }}
                >
                  <div className="w-1 h-1 bg-yellow-100 rounded-full absolute top-1 left-1 opacity-70" />
                </div>
              ))}
            </div>

            {/* Cute Gold Frosting Strip */}
            <div className="absolute top-6 left-0 right-0 h-2 bg-gradient-to-r from-gold-400 to-gold-300 shadow-sm opacity-80" />
          </div>

          {/* CAKE TIER 1 (Bottom Tier) */}
          <div className="w-56 h-20 bg-gradient-to-r from-pink-400 via-pink-300 to-pink-400 rounded-t-2xl relative border-x border-pink-500/20 shadow-lg">
            {/* Chocolate/Caramel Frosting Drips */}
            <div className="absolute -bottom-1 left-0 right-0 h-5 flex justify-between px-1 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-b from-white to-pink-100 h-5 w-4.5 rounded-b-full shadow-sm"
                  style={{ 
                    height: `${10 + (i % 4) * 5}px`, 
                    marginTop: '-2px' 
                  }}
                />
              ))}
            </div>

            {/* Cake Face/Letter Displaying "17" with cute hearts */}
            <div className="absolute inset-0 flex items-center justify-center gap-1 mt-2">
              <span className="text-xl text-stone-800 font-extrabold font-serif bg-white/75 backdrop-blur-sm shadow-md border border-pink-100 rounded-full px-4 py-1 flex items-center gap-1">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-heartbeat inline" />
                <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">SONAL</span>
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-heartbeat inline" />
              </span>
            </div>

            {/* Symmetrical Swirls around base */}
            <div className="absolute -bottom-2 left-0 right-0 flex justify-around pointer-events-none">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-5 h-5 bg-amber-100/90 rounded-full border border-pink-200/50 shadow-sm" />
              ))}
            </div>
          </div>

          {/* CAKE BOARD/PLATE (Gold) */}
          <div className="w-64 h-4.5 bg-gradient-to-r from-gold-600 via-gold-200 to-gold-700 rounded-full border-b-2 border-gold-800/20 shadow-xl" />
        </div>

        {/* Tap/Click Instructions overlay */}
        <div className="absolute bottom-[-10px] text-center w-full">
          <span className="text-xs font-semibold tracking-wider text-pink-600 uppercase bg-white/80 py-1 px-4 rounded-full border border-pink-100 shadow-sm animate-bounce inline-block">
            {candlesLit ? "Click Cake to Blow Candles!" : "Magic is happening..."}
          </span>
        </div>
      </div>

      {/* --- REVEALED SPECIAL BIRTHDAY WISH --- */}
      <div className="w-full mt-4 min-h-[140px] flex items-center justify-center">
        <AnimatePresence>
          {wishUnlocked && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-full glass-card rounded-2xl p-6 shadow-xl border border-gold-300 relative overflow-hidden"
            >
              {/* Gold borders */}
              <div className="absolute inset-1.5 border border-gold-400/20 rounded-xl pointer-events-none" />
              
              {/* Sparkles decorations */}
              <div className="absolute -top-3 -left-3 animate-pulse text-gold-400 text-2xl">★</div>
              <div className="absolute -bottom-3 -right-3 animate-pulse text-gold-400 text-2xl">★</div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="bg-gradient-to-r from-gold-500 to-amber-600 text-white font-bold text-sm px-4 py-1 rounded-full shadow-md uppercase tracking-wider mb-3.5 flex items-center gap-1.5 font-sans">
                  <Sparkles className="w-4 h-4 text-emerald-100 fill-emerald-100/50" />
                  <span>Wish Unlocked!</span>
                  <Sparkles className="w-4 h-4 text-emerald-100 fill-emerald-100/50" />
                </div>

                <h3 className="text-lg font-bold text-rose-600 mb-2 font-serif flex items-center gap-1">
                  You unlocked Sonaaaaa Di's Birthday Wish!
                </h3>

                <p className="text-stone-850 text-base sm:text-lg font-medium italic leading-relaxed max-w-sm">
                  "May your life be filled with happiness, success, peace, laughter, amazing opportunities, and beautiful memories. 🌸✨"
                </p>
                
                {/* Proceed button to finale */}
                <button
                  onClick={() => audioSynth.playPageClick()}
                  className="mt-5 bg-gradient-to-r from-gold-400 via-yellow-500 to-amber-500 text-stone-900 border border-gold-300 font-sans text-xs font-extrabold px-6 py-2.5 rounded-full shadow-lg h-9 hover:scale-105 active:scale-95 transition-all duration-300 uppercase tracking-widest flex items-center gap-1.5 group glow-gold hover:shadow-gold-300/60"
                >
                  <span>Begin Grand Finale!</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
