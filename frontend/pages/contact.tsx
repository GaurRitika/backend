import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSending(false);
    setSuccess(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    // Reset success message after 5 seconds
    setTimeout(() => setSuccess(false), 5000);
  };

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
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 animate-slide-up">
                Contact <span className="text-gradient bg-gradient-to-r from-secondary-300 to-secondary-100 bg-clip-text text-transparent">Us</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-primary-100 max-w-4xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
                Get in touch with our team. We&apos;re here to help you transform your community.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            
            {/* Contact Form */}
            <div className="animate-slide-up">
              <div className="card p-8 lg:p-12">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-display font-bold text-gray-900">Send us a Message</h2>
                </div>
                
                {success && (
                  <div className="mb-8 p-4 bg-success-50 border border-success-200 text-success-700 rounded-2xl animate-scale-in">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Thank you for your message! We&apos;ll get back to you within 24 hours.
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="input-luxury"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        className="input-luxury"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-3">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                      className="input-luxury"
                      placeholder="What can we help you with?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-3">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                      className="input-luxury resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <span className="flex items-center justify-center gap-3">
                      {sending ? (
                        <>
                          <div className="loading-spinner"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </>
                      )}
                    </span>
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="space-y-8">
                
                {/* Get in Touch */}
                <div className="card p-8 hover-lift">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-display font-bold text-gray-900">Get in Touch</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Ready to revolutionize your community management? Our team is here to help you get started 
                    with SheBuilds and answer any questions you might have.
                  </p>
                </div>

                {/* Contact Methods */}
                <div className="space-y-6">
                  <div className="card p-6 hover-lift group">
                    <div className="flex items-center">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Email Us</h4>
                        <p className="text-primary-600 font-medium">hello@shebuilds.com</p>
                        <p className="text-sm text-gray-500">We&apos;ll respond within 24 hours</p>
                      </div>
                    </div>
                  </div>

                  <div className="card p-6 hover-lift group">
                    <div className="flex items-center">
                      <div className="w-14 h-14 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Call Us</h4>
                        <p className="text-secondary-600 font-medium">+1 (555) 123-4567</p>
                        <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM EST</p>
                      </div>
                    </div>
                  </div>

                  <div className="card p-6 hover-lift group">
                    <div className="flex items-center">
                      <div className="w-14 h-14 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Visit Us</h4>
                        <p className="text-success-600 font-medium">123 Innovation Drive</p>
                        <p className="text-sm text-gray-500">San Francisco, CA 94107</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQ Link */}
                <div className="card p-8 bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200 hover-lift">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-display font-bold text-gray-900 mb-3">Need Quick Answers?</h3>
                    <p className="text-gray-600 mb-6">
                      Check out our comprehensive FAQ section for instant answers to common questions.
                    </p>
                    <button className="btn-ghost">
                      View FAQ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-24 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-6 hover-lift">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">Why Contact Us?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We&apos;re committed to helping you succeed with SheBuilds and building stronger communities together.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="card p-8 hover-lift">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-display font-bold text-gray-900 mb-4">Expert Guidance</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Get personalized advice from our community management experts to optimize your platform usage.
                  </p>
                </div>
              </div>

              <div className="text-center group">
                <div className="card p-8 hover-lift">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-display font-bold text-gray-900 mb-4">Custom Solutions</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Discuss custom features and integrations tailored to your community&apos;s unique needs.
                  </p>
                </div>
              </div>

              <div className="text-center group">
                <div className="card p-8 hover-lift">
                  <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-display font-bold text-gray-900 mb-4">24/7 Support</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Access our dedicated support team whenever you need assistance with your community platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 