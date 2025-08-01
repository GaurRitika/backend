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
}

export default function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const colors = [
        'rgba(124, 109, 242, 0.1)',
        'rgba(242, 116, 31, 0.1)',
        'rgba(217, 70, 239, 0.1)',
        'rgba(34, 197, 94, 0.1)',
        'rgba(59, 130, 246, 0.1)',
      ];

      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 4 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
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

          // Bounce off edges
          if (newX <= 0 || newX >= window.innerWidth) {
            particle.speedX *= -1;
            newX = particle.x + particle.speedX;
          }
          if (newY <= 0 || newY >= window.innerHeight) {
            particle.speedY *= -1;
            newY = particle.y + particle.speedY;
          }

          return {
            ...particle,
            x: newX,
            y: newY,
          };
        })
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-pulse-gentle"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            transform: `translate(-50%, -50%)`,
          }}
        />
      ))}
    </div>
  );
}

export function GradientOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Large gradient orbs */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-primary-400/10 to-secondary-400/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-secondary-400/10 to-luxury-400/10 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-luxury-400/8 to-primary-400/8 rounded-full blur-2xl animate-pulse-gentle"></div>
      
      {/* Medium orbs */}
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-gradient-to-br from-success-400/6 to-primary-400/6 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] bg-gradient-to-br from-warning-400/6 to-secondary-400/6 rounded-full blur-2xl animate-float-slow" style={{ animationDelay: '1s' }}></div>
      
      {/* Small orbs */}
      <div className="absolute top-1/3 left-1/3 w-[150px] h-[150px] bg-gradient-to-br from-primary-400/4 to-luxury-400/4 rounded-full blur-xl animate-pulse-gentle"></div>
      <div className="absolute bottom-1/3 right-1/3 w-[120px] h-[120px] bg-gradient-to-br from-secondary-400/4 to-success-400/4 rounded-full blur-xl animate-float" style={{ animationDelay: '3s' }}></div>
    </div>
  );
}

export function MeshGradient() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-mesh-gradient opacity-20 animate-pulse-slow"></div>
    </div>
  );
}

export function AnimatedGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-pattern-grid opacity-15 animate-pulse-gentle"></div>
    </div>
  );
}