import React, { useState, useRef } from 'react';
import { audioSynth } from '../utils/audio';

interface GiftBoxProps {
  onOpen: () => void;
  triggerSparkle: () => void;
}

export const GiftBox: React.FC<GiftBoxProps> = ({ onOpen, triggerSparkle }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const boxRef = useRef<HTMLDivElement | null>(null);

  // Mouse move handler for premium 3D hover reactivity
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!boxRef.current || isOpened) return;

    const rect = boxRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Calculate angles based on mouse location inside box boundaries
    const rotateX = -(y / (rect.height / 2)) * 12; // tilt max 12 deg
    const rotateY = (x / (rect.width / 2)) * 12;

    setTiltStyle({
      transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
      transition: 'transform 0.1s ease-out',
    });

    if (Math.random() < 0.1) {
      triggerSparkle();
    }
  };

  const handleMouseLeave = () => {
    if (isOpened) return;
    setTiltStyle({
      transform: 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)',
      transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    });
  };

  const handleBoxClick = () => {
    if (isOpened) return;
    setIsOpened(true);
    audioSynth.playPopSound();
    audioSynth.playBirthdayChime();
    
    // Trigger transition callback after animations play out
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center py-6">
      {/* Interactive Gift Container */}
      <div
        ref={boxRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleBoxClick}
        className="relative cursor-pointer select-none group w-64 h-64 flex items-center justify-center"
        style={tiltStyle}
      >
        {/* Soft magical circular glow aura in background */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-pink-300 via-yellow-200 to-rose-300 blur-3xl opacity-60 group-hover:opacity-85 transition-opacity duration-700 animate-pulse-slow" />

        {/* Floating Sparks */}
        <div className="absolute -top-8 left-12 animate-bounce text-2xl text-gold-400 opacity-80 group-hover:opacity-100 transition-opacity duration-300">★</div>
        <div className="absolute top-1/2 -left-8 animate-bounce text-xl text-yellow-300">★</div>

        {/* Realistic SVG Box Wrap with golden ribbon bows and gift top */}
        <div className="relative z-10 w-48 h-48 flex flex-col justify-end">
          
          {/* LATEST SHADED GIFT BOX LID */}
          <div
            className={`absolute left-0 right-0 h-16 bg-gradient-to-r from-pink-400 via-pink-300 to-pink-400 rounded-t-lg border-b-2 border-pink-500/10 shadow-lg z-20 transition-all duration-700 ${
              isOpened
                ? '-translate-y-24 rotate-12 scale-90 opacity-0'
                : 'group-hover:-translate-y-2 group-hover:rotate-1'
            }`}
            style={{ bottom: '110px' }}
          >
            {/* Elegant Golden Ribbon Ribbon Center (Lid) */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 bg-gradient-to-r from-gold-500 via-gold-300 to-gold-600 border-x border-gold-600/30 shadow-inner" />
            
            {/* Fluffy Ribbon Bow (Tie) */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex justify-center items-center w-12 h-12">
              {/* Left loop */}
              <div className="absolute right-1/2 w-10 h-7 rounded-full border-2 border-gold-500 bg-gradient-to-bl from-gold-300 via-gold-400 to-gold-600 origin-right -rotate-12 transform group-hover:-translate-x-1 shadow-md" />
              {/* Right loop */}
              <div className="absolute left-1/2 w-10 h-7 rounded-full border-2 border-gold-500 bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 origin-left rotate-12 transform group-hover:translate-x-1 shadow-md" />
              {/* Small Gold Center Knot */}
              <div className="absolute w-5 h-5 bg-gradient-to-tr from-gold-600 to-gold-300 rounded-full border border-gold-600 shadow-sm z-30" />
            </div>
          </div>

          {/* GIFT BOX BODY container */}
          <div
            className={`relative w-48 h-28 bg-gradient-to-b from-pink-300 via-pink-400 to-pink-500 rounded-b-xl border-t border-pink-200 shadow-inner overflow-hidden transition-transform duration-500 ${
              isOpened ? 'scale-95 border-rose-400/30' : ''
            }`}
          >
            {/* Golden Vertical Ribbon on Box Front */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 bg-gradient-to-r from-gold-500 via-gold-300 to-gold-600 border-x border-gold-600/30 shadow-md" />
            
            {/* Golden Horizontal Ribbon Wrap */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-5 bg-gradient-to-b from-gold-400 to-gold-600 border-y border-gold-600/30 opacity-90" />

            {/* Subtle Inner Highlight Sheet */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 pointer-events-none" />

            {/* Glowing 17 Badge */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gradient-to-r from-white to-pink-50 text-pink-500 font-bold px-4 py-1.5 rounded-full text-base font-sans shadow-md border border-pink-100 z-10 scale-100 group-hover:scale-110 transition-transform duration-300 flex items-center gap-1">
                <span>17</span>
              </div>
            </div>
          </div>

        </div>

        {/* Click Prompt below Box */}
        <div className="absolute -bottom-6 left-0 right-0 text-center">
          <span className="text-sm font-semibold tracking-widest text-pink-500 uppercase bg-white/70 backdrop-blur-sm shadow-sm py-1.5 px-4 rounded-full border border-pink-100 animate-pulse">
            {isOpened ? "Revealing Magic..." : "Tap to Unbox"}
          </span>
        </div>
      </div>
    </div>
  );
};
