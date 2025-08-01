import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';
import { GradientOrbs, MeshGradient, AnimatedGrid } from '../components/FloatingParticles';
import { PrimaryButton, SecondaryButton } from '../components/EnhancedButton';
import { FeatureCard, StatsCard } from '../components/EnhancedCard';

export default function Home() {
  const [showModal, setShowModal] = useState<'login' | 'signup' | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleRoleSelect = (role: 'resident' | 'admin') => {
    if (showModal === 'login') router.push(`/${role}/login`);
    else if (showModal === 'signup') router.push(`/${role}/signup`);
    setShowModal(null);
  };

  if (!mounted) return null;

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Enhanced Background Elements */}
        <MeshGradient />
        <GradientOrbs />
        <AnimatedGrid />
        
        {/* Interactive Floating Orbs */}
        <div 
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl animate-float"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-secondary-400/20 to-luxury-400/20 rounded-full blur-3xl animate-float-slow"
          style={{
            transform: `translate(${-mousePosition.x * 0.02}px, ${-mousePosition.y * 0.02}px)`
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/3 w-80 h-80 bg-gradient-to-br from-luxury-400/15 to-primary-400/15 rounded-full blur-2xl animate-pulse-gentle"
          style={{
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`
          }}
        ></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
          <div className="max-w-7xl w-full text-center">
            
            {/* Enhanced Logo Section */}
            <div className="mb-12 animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-40 h-40 mb-8 glass-card rounded-3xl hover-lift group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 animate-pulse-gentle"></div>
                <div className="relative z-10">
                  <svg className="w-20 h-20 text-gradient-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" fill="none" className="animate-pulse-slow" />
                    <path d="M16 32c0-4 8-4 8-8s-8-4-8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-primary-500" />
                    <path d="M32 32c0-4-8-4-8-8s8-4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-secondary-500" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer"></div>
              </div>
              
              <h1 className="text-7xl md:text-9xl font-display font-black mb-6 animate-fade-in-up animate-delay-200">
                <span className="text-gradient-primary text-shadow-luxury">SheBuilds</span>
              </h1>
              
              <div className="text-3xl md:text-4xl font-display font-semibold text-gray-700 mb-6 animate-fade-in-up animate-delay-400">
                Community Support Platform
              </div>
            </div>

            {/* Enhanced Main Heading */}
            <div className="mb-16 animate-fade-in-up animate-delay-600">
              <h2 className="text-5xl md:text-7xl font-display font-bold text-gray-900 mb-8 leading-tight">
                Empowering Communities with 
                <span className="block text-gradient-primary mt-4 text-shadow-luxury">Luxury & Innovation</span>
              </h2>
              
              <p className="text-2xl md:text-3xl text-gray-600 max-w-5xl mx-auto leading-relaxed animate-fade-in-up animate-delay-800">
                Experience the future of residential community management with our 
                <span className="text-gradient-primary font-bold"> AI-driven platform</span>. 
                Raise issues, track progress, and connect with your community—all in one elegant solution.
              </p>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center mb-20 animate-fade-in-up animate-delay-1000">
              <PrimaryButton
                onClick={() => setShowModal('login')}
                size="xl"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                }
                iconPosition="right"
              >
                Login
              </PrimaryButton>
              
              <SecondaryButton
                onClick={() => setShowModal('signup')}
                size="xl"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                }
                iconPosition="right"
              >
                Get Started
              </SecondaryButton>
            </div>

            {/* Enhanced Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto animate-fade-in-up animate-delay-1200">
              <FeatureCard
                icon={
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
                title="Lightning Fast"
                description="Report and resolve issues in seconds with our streamlined interface and AI-powered assistance."
                variant="primary"
              />

              <FeatureCard
                icon={
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                }
                title="Secure & Private"
                description="Enterprise-grade security ensures your community data and communications stay protected."
                variant="secondary"
              />

              <FeatureCard
                icon={
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
                title="Community First"
                description="Built for residents and administrators with intuitive tools that bring communities together."
                variant="success"
              />
            </div>

            {/* Enhanced Stats Section */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto animate-fade-in-up animate-delay-1400">
              <StatsCard
                value="10K+"
                label="Happy Residents"
                trend={{ value: 12, isPositive: true }}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatsCard
                value="500+"
                label="Communities"
                trend={{ value: 8, isPositive: true }}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                }
              />
              <StatsCard
                value="99.9%"
                label="Uptime"
                trend={{ value: 0.1, isPositive: true }}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatsCard
                value="24/7"
                label="Support"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                  </svg>
                }
              />
            </div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
          <div className="w-8 h-12 border-2 border-gray-400 rounded-full flex justify-center relative">
            <div className="w-2 h-4 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full mt-2 animate-pulse"></div>
            <div className="absolute -bottom-8 text-gray-500 text-sm font-medium">Scroll</div>
          </div>
        </div>
      </div>

      {/* Enhanced Role Selection Modal */}
      {showModal && (
        <div className="modal-backdrop animate-fade-in">
          <div className="modal-content animate-scale-in">
            <div className="text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5"></div>
              <div className="relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg animate-pulse-gentle">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                
                <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">Choose Your Role</h2>
                <p className="text-gray-600 mb-10 text-lg">Select how you'd like to access the platform</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                  <button 
                    onClick={() => handleRoleSelect('resident')} 
                    className="group p-8 rounded-3xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all duration-500 hover-lift relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors duration-300">
                        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 4h4" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Resident</h3>
                      <p className="text-gray-600">Report issues and track community updates</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleRoleSelect('admin')} 
                    className="group p-8 rounded-3xl border-2 border-gray-200 hover:border-secondary-500 hover:bg-secondary-50 transition-all duration-500 hover-lift relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary-200 transition-colors duration-300">
                        <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Administrator</h3>
                      <p className="text-gray-600">Manage community and resolve issues</p>
                    </div>
                  </button>
                </div>
                
                <button 
                  onClick={() => setShowModal(null)} 
                  className="text-gray-500 hover:text-gray-700 font-medium transition-colors duration-300 hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 