import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';

export default function Home() {
  const [showModal, setShowModal] = useState<'login' | 'signup' | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
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
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-pattern-dots opacity-30"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary-400/10 rounded-full blur-2xl animate-pulse-slow"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
          <div className="max-w-5xl w-full text-center">
            
            {/* Logo Section */}
            <div className="mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-32 h-32 mb-6 glass-card rounded-3xl hover-lift">
                <svg className="w-16 h-16 text-primary-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" fill="none" className="animate-pulse-slow" />
                  <path d="M16 32c0-4 8-4 8-8s-8-4-8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-primary-500" />
                  <path d="M32 32c0-4-8-4-8-8s8-4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-secondary-500" />
                </svg>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 animate-slide-up">
                <span className="text-luxury">SheBuilds</span>
              </h1>
              
              <div className="text-2xl md:text-3xl font-display font-semibold text-gray-700 mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                Community Support Platform
              </div>
            </div>

            {/* Main Heading */}
            <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6 leading-tight">
                Empowering Communities with 
                <span className="block text-luxury mt-2">Luxury & Innovation</span>
              </h2>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Experience the future of residential community management with our 
                <span className="text-primary-600 font-semibold"> AI-driven platform</span>. 
                Raise issues, track progress, and connect with your community—all in one elegant solution.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <button 
                onClick={() => setShowModal('login')} 
                className="btn-primary text-xl px-12 py-4 hover-lift group"
              >
                <span className="flex items-center justify-center gap-3">
                  Login
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              
              <button 
                onClick={() => setShowModal('signup')} 
                className="btn-secondary text-xl px-12 py-4 hover-lift group"
              >
                <span className="flex items-center justify-center gap-3">
                  Get Started
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <div className="card hover-lift group">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Lightning Fast</h3>
                <p className="text-gray-600 leading-relaxed">
                  Report and resolve issues in seconds with our streamlined interface and AI-powered assistance.
                </p>
              </div>

              <div className="card hover-lift group">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Secure & Private</h3>
                <p className="text-gray-600 leading-relaxed">
                  Enterprise-grade security ensures your community data and communications stay protected.
                </p>
              </div>

              <div className="card hover-lift group">
                <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Community First</h3>
                <p className="text-gray-600 leading-relaxed">
                  Built for residents and administrators with intuitive tools that bring communities together.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Role Selection Modal */}
      {showModal && (
        <div className="modal-backdrop animate-fade-in">
          <div className="modal-content animate-scale-in">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-3">Choose Your Role</h2>
              <p className="text-gray-600 mb-8">Select how you'd like to access the platform</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <button 
                  onClick={() => handleRoleSelect('resident')} 
                  className="group p-6 rounded-2xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all duration-300 hover-lift"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 4h4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Resident</h3>
                  <p className="text-sm text-gray-600">Report issues and track community updates</p>
                </button>

                <button 
                  onClick={() => handleRoleSelect('admin')} 
                  className="group p-6 rounded-2xl border-2 border-gray-200 hover:border-secondary-500 hover:bg-secondary-50 transition-all duration-300 hover-lift"
                >
                  <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary-200 transition-colors">
                    <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Administrator</h3>
                  <p className="text-sm text-gray-600">Manage community and resolve issues</p>
                </button>
              </div>
              
              <button 
                onClick={() => setShowModal(null)} 
                className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 