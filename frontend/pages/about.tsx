import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Navbar />
      
      {/* Add top padding to account for fixed navbar */}
      <div className="pt-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-pattern-dots opacity-20"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-24 h-24 mb-8 glass-card rounded-3xl hover-lift">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" fill="none" className="animate-pulse-slow" />
                  <path d="M16 32c0-4 8-4 8-8s-8-4-8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M32 32c0-4-8-4-8-8s8-4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 animate-slide-up">
                About <span className="text-gradient bg-gradient-to-r from-secondary-300 to-secondary-100 bg-clip-text text-transparent">SheBuilds</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-primary-100 max-w-4xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
                Empowering residential communities with AI-driven support and seamless issue management
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20 animate-slide-up">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-6 hover-lift">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-8">Our Mission</h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                SheBuilds is dedicated to creating stronger, more connected residential communities through 
                innovative technology and streamlined communication. We believe every resident deserves a voice 
                and every issue deserves attention.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              <div className="text-center group animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="card hover-lift mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Community First</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We prioritize the needs of residents and building managers, creating a platform that serves everyone.
                  </p>
                </div>
              </div>

              <div className="text-center group animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="card hover-lift mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Fast Resolution</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Streamlined issue tracking and management ensures problems are resolved quickly and efficiently.
                  </p>
                </div>
              </div>

              <div className="text-center group animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="card hover-lift mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-success-500 to-success-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Secure & Private</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Your data and communications are protected with enterprise-grade security and privacy measures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 bg-gradient-to-br from-gray-50 via-white to-primary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20 animate-slide-up">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl mb-6 hover-lift">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-8">Why Choose SheBuilds?</h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Our platform combines cutting-edge technology with user-friendly design to deliver the best 
                community management experience.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-start space-x-6 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Easy Issue Reporting</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Report issues with just a few clicks. Our intuitive interface makes it simple for residents 
                      to submit maintenance requests, security concerns, and other community issues.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Real-time Analytics</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Get comprehensive insights into community performance with detailed analytics, trend analysis, 
                      and reporting tools that help improve community management.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Smart Notifications</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Stay informed with intelligent notifications that keep residents and administrators updated 
                      on important community matters and issue status changes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-start space-x-6 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Mobile Responsive</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Access your community platform from anywhere with our fully responsive design that works 
                      seamlessly on desktop, tablet, and mobile devices.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Event Management</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Organize community events with built-in RSVP functionality, calendar integration, 
                      and automated reminders to boost community engagement.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Community Announcements</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Keep everyone informed with targeted announcements, important updates, and community news 
                      delivered through multiple channels for maximum reach.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack Section */}
        <div className="py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20 animate-slide-up">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 hover-lift">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">Built with Modern Technology</h2>
              <p className="text-xl text-primary-100 max-w-4xl mx-auto leading-relaxed">
                Powered by cutting-edge technologies to ensure reliability, scalability, and exceptional performance.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { name: 'Next.js', icon: '⚡' },
                { name: 'TypeScript', icon: '🔷' },
                { name: 'Tailwind CSS', icon: '🎨' },
                { name: 'Node.js', icon: '🚀' },
                { name: 'MongoDB', icon: '🍃' },
                { name: 'JWT Auth', icon: '🔐' },
                { name: 'AI Integration', icon: '🤖' },
                { name: 'Real-time', icon: '⚡' }
              ].map((tech, index) => (
                <div 
                  key={tech.name} 
                  className="glass-card p-6 rounded-2xl text-center hover-lift animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-3xl mb-4">{tech.icon}</div>
                  <h3 className="text-white font-semibold">{tech.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-24 bg-gradient-to-br from-white via-primary-50 to-secondary-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-slide-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl mb-8 hover-lift shadow-glow">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-8">
              Ready to Transform Your Community?
            </h2>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Join thousands of communities already using SheBuilds to streamline their operations 
              and enhance resident satisfaction.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => window.location.href = '/'}
                className="btn-primary text-xl px-12 py-4 hover-lift group"
              >
                <span className="flex items-center justify-center gap-3">
                  Get Started Today
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              
              <button 
                onClick={() => window.location.href = '/contact'}
                className="btn-ghost text-xl px-12 py-4 hover-lift"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 