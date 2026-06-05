import React, { useEffect, useState } from 'react';
import { FloatingElement } from '../types';

interface FloatingDecorationsProps {
  burstTrigger?: number; // increments when a button is clicked to trigger extra bursts
  intensity?: 'normal' | 'max'; // final screen has thousands of sparkles!
}

export const FloatingDecorations: React.FC<FloatingDecorationsProps> = ({
  burstTrigger = 0,
  intensity = 'normal'
}) => {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  // Generate initial gorgeous decorations
  useEffect(() => {
    const initialElements: FloatingElement[] = [];
    const count = intensity === 'max' ? 80 : 35;

    for (let i = 0; i < count; i++) {
      const typeRand = Math.random();
      let type: 'heart' | 'petal' | 'sparkle' | 'particle' = 'petal';
      let size = 12 + Math.random() * 16;
      let color = '';

      if (typeRand < 0.3) {
        type = 'heart';
        size = 14 + Math.random() * 12;
        color = ['text-rose-300/60', 'text-pink-400/50', 'text-rose-400/40'][Math.floor(Math.random() * 3)];
      } else if (typeRand < 0.65) {
        type = 'petal';
        size = 12 + Math.random() * 14;
        color = ['text-pink-200/55', 'text-rose-100/65', 'text-pink-100/60'][Math.floor(Math.random() * 3)];
      } else if (typeRand < 0.85) {
        type = 'particle';
        size = 4 + Math.random() * 6;
        color = ['bg-amber-300/50', 'bg-yellow-200/60', 'bg-gold-300/50'][Math.floor(Math.random() * 3)];
      } else {
        type = 'sparkle';
        size = 12 + Math.random() * 10;
        color = ['text-gold-300/70', 'text-yellow-100/80', 'text-amber-200/70'][Math.floor(Math.random() * 3)];
      }

      initialElements.push({
        id: `init-${i}`,
        type,
        x: Math.random() * 100,
        y: Math.random() * 110, // distribute throughout height
        size,
        speed: 0.5 + Math.random() * 1.2,
        delay: Math.random() * -15, // negative delay so they start immediately at different phases
        rotation: Math.random() * 360,
      });
    }

    setElements(initialElements);
  }, [intensity]);

  // Handle instant burst emissions on clicks or page changes
  useEffect(() => {
    if (burstTrigger === 0) return;

    // Create 12 temporary heart/particle bursts near the center/cursor area
    const burstCount = intensity === 'max' ? 24 : 15;
    const newBursts: FloatingElement[] = [];

    for (let i = 0; i < burstCount; i++) {
      const typeRand = Math.random();
      const type = typeRand < 0.5 ? 'heart' : 'sparkle';
      const size = 16 + Math.random() * 18;
      const color = type === 'heart'
        ? ['text-rose-400/80', 'text-pink-500/80', 'text-pink-300/90'][Math.floor(Math.random() * 3)]
        : ['text-gold-400/90', 'text-yellow-200/90', 'text-amber-300/90'][Math.floor(Math.random() * 3)];

      newBursts.push({
        id: `burst-${burstTrigger}-${i}`,
        type,
        x: 15 + Math.random() * 70, // clustered mainly in the action screen
        y: 40 + Math.random() * 40,
        size,
        speed: 1.5 + Math.random() * 2.0,
        delay: 0,
        rotation: Math.random() * 360,
      });
    }

    // Append and automatically clean up after 4.5 seconds
    setElements((prev) => [...prev, ...newBursts]);
    const timer = setTimeout(() => {
      setElements((prev) => prev.filter((el) => !el.id.startsWith(`burst-${burstTrigger}-`)));
    }, 4500);

    return () => clearTimeout(timer);
  }, [burstTrigger, intensity]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el) => {
        // Animation variables depending on element type
        // Petals sway, particles float straight, hearts swell gently
        const style: React.CSSProperties = {
          left: `${el.x}%`,
          top: `${el.y}%`,
          fontSize: `${el.size}px`,
          animationDelay: `${el.delay}s`,
          transform: `rotate(${el.rotation}deg)`,
          transition: 'transform 0.5s ease-out',
        };

        if (el.type === 'petal') {
          return (
            <div
              key={el.id}
              className="absolute animate-sway select-none"
              style={{
                ...style,
                animationDuration: `${8 + el.speed * 6}s`,
                top: `calc(${el.y}% - 20px)`,
              }}
            >
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" className={el.color}>
                <path d="M12 21.5c-4.5-3.5-7.5-6.5-7.5-10 0-3 2.5-5.5 5.5-5.5.8 0 1.6.4 2 .8.4-.4 1.2-.8 2-.8 3 0 5.5 2.5 5.5 5.5 0 3.5-3 6.5-7.5 10zM12 4.5C10.5 2 7 1.5 5 3.5S2.5 9 5.5 11.5c2 1.5 4.5 3 6.5 5 2-2 4.5-3.5 6.5-5 3-2.5 3.5-6 1.5-8s-5.5-1.5-7 1z" opacity="0.8"/>
                <path d="M12 20C8 17 5 14.5 5 11.5c0-2.5 2-4.5 4.5-4.5.6 0 1.2.3 1.5.6.3-.3.9-.6 1.5-.6 2.5 0 4.5 2 4.5 4.5 0 3-3 5.5-7 8.5z" />
              </svg>
            </div>
          );
        }

        if (el.type === 'heart') {
          return (
            <div
              key={el.id}
              className="absolute animate-float-slow select-none"
              style={{
                ...style,
                animationDuration: `${10 + el.speed * 8}s`,
              }}
            >
              <span className={`${el.color} inline-block filter drop-shadow-[0_2px_4px_rgba(244,63,94,0.15)]`}>
                ❤️
              </span>
            </div>
          );
        }

        if (el.type === 'sparkle') {
          return (
            <div
              key={el.id}
              className="absolute animate-sparkle select-none"
              style={{
                ...style,
                animationDuration: `${1.5 + el.speed}s`,
              }}
            >
              <span className={`${el.color} inline-block`}>
                ✨
              </span>
            </div>
          );
        }

        // Standard golden particles
        return (
          <div
            key={el.id}
            className={`absolute rounded-full animate-float-slow filter blur-[0.5px] ${el.color}`}
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              width: `${el.size}px`,
              height: `${el.size}px`,
              animationDuration: `${14 + el.speed * 12}s`,
              animationDelay: `${el.delay}s`,
            }}
          />
        );
      })}
    </div>
  );
};
