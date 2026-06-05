import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audioSynth } from '../utils/audio';
import { Sparkles, Heart } from 'lucide-react';

interface Balloon {
  id: string;
  color: string;
  size: number;
  x: number;
  delay: number;
}

export const GrandCelebration: React.FC = () => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);

  // Generate continuous rising colored balloons for premium playfulness
  useEffect(() => {
    const defaultBalloons: Balloon[] = [];
    const colors = [
      'bg-red-400', 'bg-pink-400', 'bg-rose-400', 'bg-amber-300', 
      'bg-pink-500', 'bg-amber-400', 'bg-rose-300', 'bg-yellow-100'
    ];

    for (let i = 0; i < 20; i++) {
      defaultBalloons.push({
        id: `balloon-${i}`,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 40 + Math.random() * 25,
        x: 5 + Math.random() * 90,
        delay: Math.random() * 8,
      });
    }
    setBalloons(defaultBalloons);
  }, []);

  const handlePopBalloon = (id: string) => {
    audioSynth.playPopSound();
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    setPoppedCount((prev) => prev + 1);

    // Re-spawn a new balloon after a short delay
    setTimeout(() => {
      const colors = ['bg-red-400', 'bg-pink-400', 'bg-rose-400', 'bg-amber-300', 'bg-pink-500', 'bg-amber-400'];
      setBalloons((prev) => [
        ...prev,
        {
          id: `balloon-respawn-${Date.now()}`,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 40 + Math.random() * 25,
          x: 5 + Math.random() * 90,
          delay: 0,
        }
      ]);
    }, 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center px-4 relative z-10 text-center py-8">
      
      {/* Delicate Sparkle Ornament */}
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: [1, 1.15, 1], rotate: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="mb-4 text-amber-500 select-none pointer-events-none"
      >
        <Sparkles className="w-12 h-12" />
      </motion.div>

      {/* FIREWORKS EMIT HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="relative px-4"
      >
        {/* Glowing aura */}
        <div className="absolute inset-0 bg-yellow-300/10 blur-xl rounded-full" />
        
        {/* HUGE GLOWING GOLD TEXT: HAPPY 17TH BIRTHDAY SONAAAAA DI! */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black tracking-wider leading-tight text-stroke-gold bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent filter drop-shadow-[0_4px_12px_rgba(212,159,43,0.45)] uppercase z-10 relative">
          HAPPY 17TH BIRTHDAY <br /> SONAAAAA DI!
        </h1>
      </motion.div>

      {/* SUB-HEADER: Thank you for being an amazing sister. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="mt-6 z-10"
      >
        <p className="text-xl sm:text-2xl font-sans font-extrabold text-pink-600 tracking-wide inline-block bg-white/70 backdrop-blur-sm shadow-md border border-pink-100 rounded-full px-6 py-2.5">
          Thank you for being an amazing sister.
        </p>
      </motion.div>

      {/* SIGN OFF: With lots of love. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="mt-6 z-10"
      >
        <p className="font-cursive text-3xl sm:text-4xl text-rose-500 font-bold tracking-wider drop-shadow-sm">
          With lots of love.
        </p>
      </motion.div>

      {/* --- POPPABLE BALOONS AREA --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <AnimatePresence>
          {balloons.map((b) => (
            <motion.div
              key={b.id}
              initial={{ y: '100vh', opacity: 0 }}
              animate={{ 
                y: '-20vh', 
                opacity: [0, 0.9, 0.9, 0],
                x: [b.x + '%', (b.x + (Math.random() * 20 - 10)) + '%'] 
              }}
              exit={{ scale: 1.4, opacity: 0, transition: { duration: 0.15 } }}
              transition={{ 
                delay: b.delay,
                duration: 10 + Math.random() * 6, 
                ease: 'linear',
                repeat: Infinity 
              }}
              className="absolute pointer-events-auto cursor-pointer"
              style={{ width: `${b.size}px`, height: `${b.size * 1.3}px` }}
              onClick={() => handlePopBalloon(b.id)}
            >
              {/* Balloon bubble */}
              <div className={`w-full h-[85%] rounded-full relative shadow-md opacity-90 border border-white/20 ${b.color}`}>
                {/* Gloss high light */}
                <div className="absolute top-1.5 left-2 w-[25%] h-[20%] bg-white/40 rounded-full" />
              </div>
              {/* Balloon knot */}
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-black/10 mx-auto mt-[-1px]" />
              {/* Balloon string */}
              <div className="w-0.5 h-12 bg-stone-400/40 mx-auto" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Cute Balloon popping score */}
      {poppedCount > 0 && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-6 font-sans text-xs font-bold text-pink-500 bg-white/80 border border-pink-100 rounded-full px-4 py-1.5 shadow-sm select-none"
        >
          You popped {poppedCount} balloons with love!
        </motion.div>
      )}

      {/* MEMORY CARD / POLAROID ROW */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.5, duration: 1 }}
        className="mt-10 w-full flex justify-center z-10"
      >
        <div className="glass-panel p-4 rounded-2xl border border-white/50 max-w-sm shadow-xl rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
          <div className="w-full bg-pink-50/50 aspect-video rounded-lg overflow-hidden border border-pink-100 relative mb-3 flex flex-col items-center justify-center p-4">
            <Heart className="w-10 h-10 text-rose-500 fill-rose-100 animate-heartbeat mb-2" />
            <h4 className="font-serif text-lg font-bold text-pink-600 text-center">To the Best Sister Ever!</h4>
            <p className="text-xs text-stone-600 text-center mt-1 font-sans">
              No matter what conflicts or jokes, you are the most special and irreplaceable person. Happy 17th birthday.
            </p>
          </div>
          <div className="flex justify-between items-center px-1">
            <span className="font-cursive text-xl font-bold text-stone-700">Sonaaaaa Di, 17</span>
            <span className="font-mono text-2xs text-stone-500">6th June 2026</span>
          </div>
        </div>
      </motion.div>

      {/* Reload/Reset Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.8 }}
        onClick={() => {
          audioSynth.playPageClick();
          setTimeout(() => {
            window.location.reload();
          }, 300);
        }}
        className="mt-12 text-xs font-semibold text-pink-500/80 hover:text-pink-600 underline cursor-pointer select-none"
      >
        Tap to replay the surprise card
      </motion.button>

    </div>
  );
};
