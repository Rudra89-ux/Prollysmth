/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppScreen } from './types';
import { audioSynth } from './utils/audio';
import { FloatingDecorations } from './components/FloatingDecorations';
import { CelebrationEffects } from './components/CelebrationEffects';
import { GiftBox } from './components/GiftBox';
import { StorybookLetters } from './components/StorybookLetters';
import { BirthdayCake } from './components/BirthdayCake';
import { GrandCelebration } from './components/GrandCelebration';
import { Volume2, VolumeX, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.OPENING);
  const [isMuted, setIsMuted] = useState(true); // Default muted to comply with browser autoplay blocks
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [fireworkTrigger, setFireworkTrigger] = useState(0);
  const [burstTrigger, setBurstTrigger] = useState(0);

  // Auto start music loop once user interacts with ANYTHING on-screen
  useEffect(() => {
    const startAudioOnInteraction = () => {
      if (isMuted) {
        audioSynth.startMusicLoop();
        setIsMuted(false);
      }
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('click', startAudioOnInteraction);
      window.removeEventListener('touchstart', startAudioOnInteraction);
    };

    window.addEventListener('click', startAudioOnInteraction);
    window.addEventListener('touchstart', startAudioOnInteraction);

    return () => cleanup();
  }, [isMuted]);

  // Special sound effect and fireworks burst when opening the Gift box
  const handleGiftBoxOpen = () => {
    setConfettiTrigger((prev) => prev + 1);
    setFireworkTrigger((prev) => prev + 1);
    setBurstTrigger((prev) => prev + 1);
    
    // Shift screen to the interactive story card letters after initial fireworks explode
    setTimeout(() => {
      setScreen(AppScreen.LETTER);
    }, 1400);
  };

  const handleLettersComplete = () => {
    setConfettiTrigger((prev) => prev + 1);
    setScreen(AppScreen.CAKE);
  };

  const handleWishUnlocked = () => {
    // We increment visuals but wait for the user to initiate the finale
    setConfettiTrigger((prev) => prev + 1);
    setFireworkTrigger((prev) => prev + 1);
  };

  const traverseToFinale = () => {
    setConfettiTrigger((prev) => prev + 1);
    setFireworkTrigger((prev) => prev + 1);
    setScreen(AppScreen.FINALE);
  };

  const handleMuteToggle = () => {
    const voiceState = audioSynth.toggleMute();
    setIsMuted(voiceState);
  };

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-tr from-rose-50 via-pink-100 to-amber-50 overflow-x-hidden flex flex-col justify-between py-6">
      
      {/* GLOWING AMBIENT BACKGROUND PARTICLES & CHERRY BLOSSOMS */}
      <FloatingDecorations 
        burstTrigger={burstTrigger} 
        intensity={screen === AppScreen.FINALE ? 'max' : 'normal'} 
      />

      {/* CANVAS FIREWORKS & CONFETTI CHANNELS */}
      <CelebrationEffects 
        confettiTrigger={confettiTrigger} 
        fireworkTrigger={fireworkTrigger} 
        isFinale={screen === AppScreen.FINALE} 
      />

      {/* --- FLOATING AUDIO MUSIC SWITCH CONTROL PANEL --- */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        {/* Helper popup guiding user to play music */}
        <AnimatePresence>
          {isMuted && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="hidden sm:flex items-center gap-1.5 bg-white/80 backdrop-blur-md border border-pink-100 rounded-full py-1.5 px-3.5 shadow-md text-2xs text-stone-600 font-sans"
            >
              <span>🎵 Play Sweet Piano bgm</span>
              <Sparkles className="w-3 h-3 text-gold-400 fill-gold-300" />
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={handleMuteToggle}
          className="bg-white/85 hover:bg-pink-50 text-pink-600 border border-pink-100 p-3 rounded-full shadow-lg transition-transform focus:outline-none hover:scale-110 active:scale-95 flex items-center justify-center relative cursor-pointer"
          title={isMuted ? "Unmute custom piano background loop" : "Mute custom piano background loop"}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-gray-400 animate-pulse" />
          ) : (
            <>
              <Volume2 className="w-5 h-5 text-pink-500 animate-pulse" />
              <div className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
              </div>
            </>
          )}
        </button>
      </div>

      {/* --- CUTE LOGO IN CORNER --- */}
      <div className="absolute top-4 left-4 z-40 flex items-center gap-1.5 bg-white/70 backdrop-blur-md rounded-full py-2 px-4 shadow-sm border border-pink-100/40 font-sans">
        <Heart className="w-4 h-4 fill-pink-500 text-pink-500 animate-heartbeat" />
        <span className="text-xs font-bold text-pink-600 tracking-wider">Sonaaaaa Di • 17</span>
      </div>

      {/* --- MAIN PAGE LAYOUT SECTION WITH ANIMATIONS --- */}
      <main className="flex-grow flex items-center justify-center w-full z-10 px-4 mt-6">
        <AnimatePresence mode="wait">
          {screen === AppScreen.OPENING && (
            <motion.div
              key="opening"
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full flex flex-col items-center justify-center text-center max-w-2xl"
            >
              <div className="space-y-4 px-4 py-8">
                {/* Visual Title */}
                <motion.h1
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-pink-600 leading-tight tracking-tight drop-shadow-[0_2px_10px_rgba(244,63,94,0.1)] uppercase"
                >
                  Yayyy!! It's your birthday today, Sonaaaaa Di!
                </motion.h1>

                {/* Subheading text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-base sm:text-lg md:text-xl font-sans font-medium text-stone-700 leading-relaxed max-w-lg mx-auto bg-white/50 backdrop-blur-xs py-2 px-4 rounded-xl"
                >
                  A huge, enormous, wonderful, spectacular, fantastic, incredible, magnificent, extraordinary, and heartfelt Happy 17th Birthday!
                </motion.p>

                {/* Additional Text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="font-cursive text-2xl sm:text-3xl font-semibold text-rose-500/90 tracking-wide mt-2 animate-bounce"
                >
                  Someone has prepared a special surprise just for you...
                </motion.p>
              </div>

              {/* Gift Box Component */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 90, damping: 15, delay: 1.2 }}
              >
                <GiftBox 
                  onOpen={handleGiftBoxOpen} 
                  triggerSparkle={() => setBurstTrigger((prev) => prev + 1)} 
                />
              </motion.div>
            </motion.div>
          )}

          {screen === AppScreen.LETTER && (
            <motion.div
              key="letters"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <StorybookLetters 
                onLettersComplete={handleLettersComplete} 
                triggerBurst={() => setBurstTrigger((prev) => prev + 1)} 
              />
            </motion.div>
          )}

          {screen === AppScreen.CAKE && (
            <motion.div
              key="cake"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <BirthdayCake 
                onWishUnlocked={handleWishUnlocked} 
                triggerConfetti={() => setConfettiTrigger((prev) => prev + 1)} 
                triggerFirework={() => setFireworkTrigger((prev) => prev + 1)} 
                triggerBurst={traverseToFinale}
              />
            </motion.div>
          )}

          {screen === AppScreen.FINALE && (
            <motion.div
              key="finale"
              initial={{ opacity: 0, scale: 0.92, rotate: 1 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              className="w-full"
            >
              <GrandCelebration />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* --- FOOTER IN OUTER PAGE MARGIN --- */}
      <footer className="w-full text-center py-2 h-7 relative z-40 select-none">
        <span className="text-2xs font-sans tracking-widest text-[#a88292]/70 uppercase">
          Happy 17th Birthday
        </span>
      </footer>

    </div>
  );
}
