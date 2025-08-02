import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  scaleDirection: number;
  trail: { x: number; y: number; opacity: number }[];
}

export default function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const colors = [
        'rgba(124, 109, 242, 0.15)',
        'rgba(242, 116, 31, 0.15)',
        'rgba(217, 70, 239, 0.15)',
        'rgba(34, 197, 94, 0.15)',
        'rgba(59, 130, 246, 0.15)',
        'rgba(245, 158, 11, 0.15)',
      ];

      for (let i = 0; i < 80; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 6 + 2,
          speedX: (Math.random() - 0.5) * 0.8,
          speedY: (Math.random() - 0.5) * 0.8,
          opacity: Math.random() * 0.6 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 2,
          scale: Math.random() * 0.5 + 0.5,
          scaleDirection: Math.random() > 0.5 ? 1 : -1,
          trail: [],
        });
      }
      setParticles(newParticles);
    };

    generateParticles();

    const animateParticles = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => {
          let newX = particle.x + particle.speedX;
          let newY = particle.y + particle.speedY;

          // Bounce off edges with some energy loss
          if (newX <= 0 || newX >= window.innerWidth) {
            particle.speedX *= -0.8;
            newX = particle.x + particle.speedX;
          }
          if (newY <= 0 || newY >= window.innerHeight) {
            particle.speedY *= -0.8;
            newY = particle.y + particle.speedY;
          }

          // Update rotation
          const newRotation = particle.rotation + particle.rotationSpeed;

          // Update scale with breathing effect
          let newScale = particle.scale + (particle.scaleDirection * 0.01);
          let newScaleDirection = particle.scaleDirection;
          if (newScale > 1.2 || newScale < 0.3) {
            newScaleDirection *= -1;
          }

          // Update trail
          const newTrail = [
            { x: particle.x, y: particle.y, opacity: particle.opacity * 0.8 },
            ...particle.trail.slice(0, 4).map(point => ({
              ...point,
              opacity: point.opacity * 0.9
            }))
          ];

          return {
            ...particle,
            x: newX,
            y: newY,
            rotation: newRotation,
            scale: newScale,
            scaleDirection: newScaleDirection,
            trail: newTrail,
          };
        })
      );
    };

    const interval = setInterval(animateParticles, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(particle => (
        <div key={particle.id}>
          {/* Particle trail */}
          {particle.trail.map((trailPoint, index) => (
            <div
              key={`trail-${particle.id}-${index}`}
              className="absolute rounded-full animate-pulse-gentle"
              style={{
                left: trailPoint.x,
                top: trailPoint.y,
                width: particle.size * 0.7,
                height: particle.size * 0.7,
                backgroundColor: particle.color,
                opacity: trailPoint.opacity * 0.3,
                transform: `translate(-50%, -50%) scale(${0.5 + index * 0.1})`,
                transition: 'all 0.3s ease-out',
              }}
            />
          ))}
          
          {/* Main particle */}
          <div
            className="absolute rounded-full animate-pulse-gentle"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              transform: `translate(-50%, -50%) rotate(${particle.rotation}deg) scale(${particle.scale})`,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              transition: 'all 0.1s ease-out',
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function GradientOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Ultra Large Orbs */}
      <div className="absolute -top-20 -left-20 w-[1000px] h-[1000px] bg-gradient-to-br from-primary-400/8 to-secondary-400/8 rounded-full blur-3xl animate-float animate-morph"></div>
      <div className="absolute -bottom-20 -right-20 w-[1200px] h-[1200px] bg-gradient-to-br from-secondary-400/8 to-luxury-400/8 rounded-full blur-3xl animate-float-slow animate-morph" style={{ animationDelay: '2s' }}></div>
      
      {/* Large Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-luxury-400/6 to-primary-400/6 rounded-full blur-2xl animate-pulse-gentle animate-morph" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/3 right-1/3 w-[700px] h-[700px] bg-gradient-to-br from-success-400/6 to-warning-400/6 rounded-full blur-3xl animate-float animate-morph" style={{ animationDelay: '3s' }}></div>
      
      {/* Medium Orbs */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-warning-400/5 to-secondary-400/5 rounded-full blur-2xl animate-float-slow animate-morph" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-gradient-to-br from-primary-400/5 to-luxury-400/5 rounded-full blur-2xl animate-pulse-gentle animate-morph" style={{ animationDelay: '2.5s' }}></div>
      
      {/* Small Accent Orbs */}
      <div className="absolute top-1/2 left-1/6 w-[300px] h-[300px] bg-gradient-to-br from-secondary-400/4 to-success-400/4 rounded-full blur-xl animate-float animate-morph" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-1/6 right-1/6 w-[250px] h-[250px] bg-gradient-to-br from-luxury-400/4 to-warning-400/4 rounded-full blur-xl animate-pulse-gentle animate-morph" style={{ animationDelay: '3.5s' }}></div>
      
      {/* Micro Orbs for Depth */}
      <div className="absolute top-1/6 right-1/3 w-[150px] h-[150px] bg-gradient-to-br from-primary-400/3 to-secondary-400/3 rounded-full blur-lg animate-float-slow animate-morph" style={{ animationDelay: '4s' }}></div>
      <div className="absolute bottom-2/3 left-1/5 w-[120px] h-[120px] bg-gradient-to-br from-success-400/3 to-luxury-400/3 rounded-full blur-lg animate-pulse-gentle animate-morph" style={{ animationDelay: '0.8s' }}></div>
    </div>
  );
}

export function MeshGradient() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-mesh-gradient opacity-25 animate-pulse-slow animate-gradient"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 animate-gradient" style={{ animationDelay: '2s' }}></div>
    </div>
  );
}

export function AnimatedGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-pattern-grid opacity-20 animate-pulse-gentle"></div>
      <div className="absolute inset-0 bg-pattern-diagonal opacity-10 animate-float-slow"></div>
    </div>
  );
}

// New Ultra-Premium Components
export function LuxuryStars() {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number; twinkleSpeed: number }>>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 50; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 3 + 1,
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-pulse-gentle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDuration: `${star.twinkleSpeed}s`,
            boxShadow: `0 0 ${star.size * 4}px rgba(255, 255, 255, 0.8)`,
          }}
        />
      ))}
    </div>
  );
}

export function PremiumRipples() {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number; delay: number }>>([]);

  useEffect(() => {
    const generateRipples = () => {
      const newRipples = [];
      for (let i = 0; i < 8; i++) {
        newRipples.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 400 + 200,
          opacity: Math.random() * 0.1 + 0.05,
          delay: Math.random() * 5,
        });
      }
      setRipples(newRipples);
    };

    generateRipples();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute rounded-full border-2 border-primary-400/20 animate-pulse-gentle"
          style={{
            left: `${ripple.x}%`,
            top: `${ripple.y}%`,
            width: `${ripple.size}px`,
            height: `${ripple.size}px`,
            opacity: ripple.opacity,
            transform: 'translate(-50%, -50%)',
            animationDelay: `${ripple.delay}s`,
            animationDuration: '4s',
          }}
        />
      ))}
    </div>
  );
}

export function EliteBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <MeshGradient />
      <GradientOrbs />
      <AnimatedGrid />
      <LuxuryStars />
      <PremiumRipples />
      <FloatingParticles />
    </div>
  );
}