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
      
      {/* Modern Professional Hero Section */}
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900/40"></div>
        
        {/* Subtle Background Elements */}
        <MeshGradient />
        <GradientOrbs />
        <AnimatedGrid />
        
        {/* Professional Interactive Floating Orbs */}
        <div 
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${-mousePosition.x * 0.015}px, ${-mousePosition.y * 0.015}px)`
          }}
        ></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24">
          <div className="max-w-6xl w-full text-center">
            
            {/* Professional Logo Section */}
            <div className="mb-12 animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-24 h-24 mb-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-500/30 animate-pulse"></div>
                <div className="relative z-10">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up animate-delay-200">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">SheBuilds</span>
              </h1>
              
              <div className="text-xl md:text-2xl font-medium text-gray-300 mb-6 animate-fade-in-up animate-delay-400">
                <span>Community Support Platform</span>
              </div>
              
              <div className="inline-flex items-center gap-3 mb-8 animate-fade-in-up animate-delay-500">
                <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full animate-pulse"></div>
                <div className="w-12 h-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"></div>
              </div>
            </div>

            {/* Professional Main Heading */}
            <div className="mb-16 animate-fade-in-up animate-delay-600">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Empowering Communities with 
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mt-2">Innovation & Excellence</span>
              </h2>
              
              <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animate-delay-800">
                Experience the future of residential community management with our 
                <span className="text-blue-400 font-semibold"> AI-driven platform</span>. 
                Raise issues, track progress, and connect with your community—all in one 
                <span className="text-purple-400 font-semibold"> elegant solution</span>.
              </p>
            </div>

            {/* Professional CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20 animate-fade-in-up animate-delay-1000">
              <button
                onClick={() => setShowModal('login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-3"
              >
                Login
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              
              <button
                onClick={() => setShowModal('signup')}
                className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-3 border border-gray-600 hover:border-gray-500"
              >
                Get Started
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>

            {/* Professional Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto animate-fade-in-up animate-delay-1200">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Lightning Fast</h3>
                <p className="text-gray-300 leading-relaxed">Report and resolve issues in seconds with our streamlined interface and AI-powered assistance that adapts to your community's needs.</p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Secure & Private</h3>
                <p className="text-gray-300 leading-relaxed">Enterprise-grade security with end-to-end encryption ensures your community data and communications stay protected at all times.</p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Community First</h3>
                <p className="text-gray-300 leading-relaxed">Built for residents and administrators with intuitive tools that bring communities together and foster meaningful connections.</p>
              </div>
            </div>

            {/* Professional Stats Section */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto animate-fade-in-up animate-delay-1400">
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">10K+</div>
                <div className="text-gray-400 text-sm">Happy Residents</div>
                <div className="flex items-center mt-2">
                  <span className="text-green-400 text-xs">↗ +12%</span>
                </div>
              </div>

              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">500+</div>
                <div className="text-gray-400 text-sm">Communities</div>
                <div className="flex items-center mt-2">
                  <span className="text-green-400 text-xs">↗ +8%</span>
                </div>
              </div>

              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                <div className="text-gray-400 text-sm">Uptime</div>
                <div className="flex items-center mt-2">
                  <span className="text-green-400 text-xs">↗ +0.1%</span>
                </div>
              </div>

              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-400 text-sm">Support</div>
              </div>
            </div>

            {/* Professional Trust Indicators */}
            <div className="mt-20 animate-fade-in-up animate-delay-1600">
              <div className="text-center mb-12">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Trusted by Leading Communities</h3>
                <p className="text-gray-400">Join thousands of satisfied residents and administrators</p>
              </div>
              
              <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 hover:opacity-60 transition-opacity duration-500">
                <div className="w-24 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg flex items-center justify-center text-gray-400 font-semibold text-sm">Award 1</div>
                <div className="w-24 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg flex items-center justify-center text-gray-400 font-semibold text-sm">Award 2</div>
                <div className="w-24 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg flex items-center justify-center text-gray-400 font-semibold text-sm">Award 3</div>
                <div className="w-24 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg flex items-center justify-center text-gray-400 font-semibold text-sm">Award 4</div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400/50 rounded-full flex justify-center relative">
            <div className="w-1 h-3 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mt-2 animate-pulse"></div>
          </div>
          <div className="text-center mt-2 text-gray-400 text-sm font-medium">Explore</div>
        </div>
      </div>

      {/* Professional Role Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 animate-scale-in">
            <div className="text-center p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-4">Choose Your Role</h2>
                <p className="text-gray-400 mb-8">Select how you'd like to access the platform</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <button 
                    onClick={() => handleRoleSelect('resident')} 
                    className="group p-6 rounded-xl border border-gray-600 hover:border-blue-500 bg-gray-700/50 hover:bg-gray-700 transition-all duration-300 hover:scale-105 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 4h4" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Resident</h3>
                      <p className="text-gray-400">Report issues and track community updates</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleRoleSelect('admin')} 
                    className="group p-6 rounded-xl border border-gray-600 hover:border-purple-500 bg-gray-700/50 hover:bg-gray-700 transition-all duration-300 hover:scale-105 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Administrator</h3>
                      <p className="text-gray-400">Manage community and resolve issues</p>
                    </div>
                  </button>
                </div>
                
                <button 
                  onClick={() => setShowModal(null)} 
                  className="text-gray-400 hover:text-white font-medium transition-colors duration-300 hover:scale-105"
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