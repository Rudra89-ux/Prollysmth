import React, { useEffect, useRef } from 'react';

interface CelebrationEffectsProps {
  confettiTrigger?: number;
  fireworkTrigger?: number;
  isFinale?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  alpha: number;
  decay: number;
  gravity: number;
  rotation?: number;
  rotationSpeed?: number;
  shape?: 'circle' | 'square' | 'heart';
}

export const CelebrationEffects: React.FC<CelebrationEffectsProps> = ({
  confettiTrigger = 0,
  fireworkTrigger = 0,
  isFinale = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Setup Canvas resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Helper to generate a random pastel or gold/pink color
  const getRandomColor = () => {
    const colors = [
      '#ff69b4', // Hot pink
      '#ffb6c1', // Light pink
      '#ffc0cb', // Pink
      '#ffd700', // Gold
      '#ffdf00', // Rich gold
      '#ffffff', // White star
      '#f43f5e', // Rose
      '#fda4af', // Rose-300
      '#fef08a', // Yellow-200
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Trigger a heart, square, or round confetti boom
  const createConfettiExplosion = (x: number, y: number, count: number = 80) => {
    const newParticles: Particle[] = [];
    const shapes: ('circle' | 'square' | 'heart')[] = ['circle', 'square', 'heart'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (1 + Math.random() * 3), // lift upwards
        color: getRandomColor(),
        radius: 4 + Math.random() * 5,
        alpha: 1,
        decay: 0.015 + Math.random() * 0.015,
        gravity: 0.15,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        shape: shapes[Math.floor(Math.random() * shapes.length)]
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];
  };

  // Trigger a starburst beautiful firework
  const createFireworkExplosion = (x: number, y: number) => {
    const count = 100;
    const newParticles: Particle[] = [];
    const fireworkColor = getRandomColor();

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 9;
      
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: fireworkColor,
        radius: 2 + Math.random() * 3,
        alpha: 1,
        decay: 0.016 + Math.random() * 0.01,
        gravity: 0.06,
        shape: 'circle'
      });
    }

    // Sparkle trail elements
    for (let j = 0; j < 30; j++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: '#ffffff', // bright sparkles
        radius: 1 + Math.random() * 1.5,
        alpha: 1,
        decay: 0.03 + Math.random() * 0.02,
        gravity: 0.03,
        shape: 'circle'
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];
  };

  // Watch triggers
  useEffect(() => {
    if (confettiTrigger > 0) {
      const canvas = canvasRef.current;
      if (canvas) {
        // Explode from multiple points
        createConfettiExplosion(canvas.width / 2, canvas.height / 2, 90);
        createConfettiExplosion(canvas.width * 0.25, canvas.height * 0.6, 50);
        createConfettiExplosion(canvas.width * 0.75, canvas.height * 0.6, 50);
      }
    }
  }, [confettiTrigger]);

  useEffect(() => {
    if (fireworkTrigger > 0) {
      const canvas = canvasRef.current;
      if (canvas) {
        // Trigger 2 beautiful fireworks
        createFireworkExplosion(canvas.width * 0.3 + Math.random() * canvas.width * 0.1, canvas.height * 0.3 + Math.random() * canvas.height * 0.2);
        setTimeout(() => {
          createFireworkExplosion(canvas.width * 0.6 + Math.random() * canvas.width * 0.1, canvas.height * 0.25 + Math.random() * canvas.height * 0.2);
        }, 300);
      }
    }
  }, [fireworkTrigger]);

  // Keep fireworks firing in Finale mode
  useEffect(() => {
    if (!isFinale) return;

    let intervalId: any;
    const canvas = canvasRef.current;

    const spawnFinaleFirework = () => {
      if (!canvas) return;
      const rx = Math.random() * canvas.width;
      const ry = canvas.height * 0.15 + Math.random() * canvas.height * 0.4;
      createFireworkExplosion(rx, ry);
      if (Math.random() > 0.4) {
        createConfettiExplosion(rx, ry, 30);
      }
    };

    // Initial triggers
    spawnFinaleFirework();
    setTimeout(spawnFinaleFirework, 250);
    setTimeout(spawnFinaleFirework, 600);

    // Dynamic fire interval
    intervalId = setInterval(spawnFinaleFirework, 1200);

    return () => {
      clearInterval(intervalId);
    };
  }, [isFinale]);

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Semi-transparent clearing to give fireworks trailing glows
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const activeParticles = particlesRef.current;
      const nextParticles: Particle[] = [];

      for (let i = 0; i < activeParticles.length; i++) {
        const p = activeParticles[i];

        // Apply physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);

          if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
            p.rotation += p.rotationSpeed;
            ctx.rotate((p.rotation * Math.PI) / 180);
          }

          ctx.fillStyle = p.color;

          // Draw shape
          if (p.shape === 'heart') {
            // Heart shape
            const d = p.radius * 2;
            ctx.beginPath();
            ctx.moveTo(0, d / 4);
            ctx.quadraticCurveTo(0, 0, d / 4, 0);
            ctx.quadraticCurveTo(d / 2, 0, d / 2, d / 4);
            ctx.quadraticCurveTo(d / 2, 0, d * 3/4, 0);
            ctx.quadraticCurveTo(d, 0, d, d / 4);
            ctx.quadraticCurveTo(d, d / 2, d * 3/4, d * 3/4);
            ctx.lineTo(d / 2, d);
            ctx.lineTo(d / 4, d * 3/4);
            ctx.quadraticCurveTo(0, d / 2, 0, d / 4);
            ctx.closePath();
            ctx.fill();
          } else if (p.shape === 'square') {
            ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
          } else {
            // circle standard
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
          }

          ctx.restore();
          nextParticles.push(p);
        }
      }

      particlesRef.current = nextParticles;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-50 overflow-hidden"
    />
  );
};
