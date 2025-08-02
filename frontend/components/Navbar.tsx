import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiUtils } from '../utils/api';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userInfo = apiUtils.getUserFromToken();
    setUser(userInfo);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.dropdown-container')) {
        setShowProfileDropdown(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);



  const handleLogout = () => {
    apiUtils.logout();
    router.push('/');
  };

  const isActive = (path: string) => router.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card backdrop-blur-2xl border-b border-white/30 shadow-luxury-lg">
      <div className="px-6 mx-auto max-w-7xl sm:px-8 lg:px-10">
        <div className="flex justify-between h-24">
          
          {/* Enhanced Logo and Brand */}
          <div className="flex items-center">
            <div 
              onClick={() => router.push('/')}
              className="flex items-center cursor-pointer group"
            >
              <div className="flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-3xl flex items-center justify-center shadow-glow group-hover:shadow-glow-xl transition-all duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                  <svg className="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" fill="none" className="animate-pulse-slow" />
                    <path d="M16 32c0-4 8-4 8-8s-8-4-8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M32 32c0-4-8-4-8-8s8-4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <div className="ml-5">
                <h1 className="text-3xl font-display font-black text-gradient-primary tracking-tight text-shadow-luxury">SheBuilds</h1>
                <p className="text-sm text-gray-600 font-semibold">Community Support</p>
              </div>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden items-center space-x-2 lg:flex">
            {user ? (
              <>
                {/* Resident Navigation */}
                {user.role === 'resident' && (
                  <>
                    <NavLink
                      onClick={() => router.push('/resident/dashboard')}
                      isActive={isActive('/resident/dashboard')}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      }
                      role="resident"
                    >
                      Dashboard
                    </NavLink>
                    
                    <NavLink
                      onClick={() => router.push('/resident/community')}
                      isActive={isActive('/resident/community')}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      }
                      role="resident"
                    >
                      Community
                    </NavLink>

                    <NavLink
                      onClick={() => router.push('/resident/events')}
                      isActive={isActive('/resident/events')}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      }
                      role="resident"
                    >
                      Events
                    </NavLink>

                    <NavLink
                      onClick={() => router.push('/resident/announcements')}
                      isActive={isActive('/resident/announcements')}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                      }
                      role="resident"
                    >
                      Announcements
                    </NavLink>
                  </>
                )}

                {/* Admin Navigation */}
                {user.role === 'admin' && (
                  <>
                    <NavLink
                      onClick={() => router.push('/admin/dashboard')}
                      isActive={isActive('/admin/dashboard')}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      }
                      role="admin"
                    >
                      Dashboard
                    </NavLink>

                    <NavLink
                      onClick={() => router.push('/admin/residents')}
                      isActive={isActive('/admin/residents')}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      }
                      role="admin"
                    >
                      Residents
                    </NavLink>

                    <NavLink
                      onClick={() => router.push('/admin/analytics')}
                      isActive={isActive('/admin/analytics')}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      }
                      role="admin"
                    >
                      Analytics
                    </NavLink>

                    <NavLink
                      onClick={() => router.push('/admin/events')}
                      isActive={isActive('/admin/events')}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      }
                      role="admin"
                    >
                      Events
                    </NavLink>

                    <NavLink
                      onClick={() => router.push('/admin/announcements')}
                      isActive={isActive('/admin/announcements')}
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                      }
                      role="admin"
                    >
                      Announcements
                    </NavLink>
                  </>
                )}

                {/* Notifications */}
                <NotificationBell className="dropdown-container" />

                {/* Profile Dropdown */}
                <div className="relative dropdown-container">
                  <button
                    onClick={() => {
                      setShowProfileDropdown(!showProfileDropdown);
                      setShowNotifications(false);
                    }}
                    className="flex items-center p-2 text-gray-600 hover:text-primary-600 rounded-xl hover:bg-white/20 transition-all duration-300 hover-lift group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-lg group-hover:shadow-glow transition-all duration-300">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="ml-3 text-left hidden xl:block">
                      <p className="text-sm font-semibold text-gray-900">{user.name || 'User'}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <svg className="ml-2 w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-64 card-luxury rounded-2xl shadow-luxury-lg animate-slide-down">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="ml-3">
                            <p className="font-semibold text-gray-900">{user.name || 'User'}</p>
                            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        <button
                          onClick={() => {
                            router.push('/profile');
                            setShowProfileDropdown(false);
                          }}
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile Settings
                        </button>
                        
                        <button
                          onClick={() => {
                            router.push(`/${user.role}/preferences`);
                            setShowProfileDropdown(false);
                          }}
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Preferences
                        </button>
                        
                        <div className="border-t border-gray-200 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-sm text-error-600 hover:bg-error-50 hover:text-error-700 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Auth Buttons for non-authenticated users */
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/about')}
                  className="nav-link text-gray-700 hover:text-primary-600 font-medium"
                >
                  About
                </button>
                <button
                  onClick={() => router.push('/contact')}
                  className="nav-link text-gray-700 hover:text-primary-600 font-medium"
                >
                  Contact
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="btn-ghost"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-white/20 rounded-xl transition-all duration-300"
              aria-label="Toggle mobile menu"
            >
              <svg className={`w-6 h-6 transition-transform ${showMobileMenu ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-white/20 mt-4 pt-4 pb-4 animate-slide-down">
            <div className="space-y-2">
              {user ? (
                <>
                  {user.role === 'resident' && (
                    <>
                      <MobileNavLink onClick={() => { router.push('/resident/dashboard'); setShowMobileMenu(false); }} isActive={isActive('/resident/dashboard')}>
                        Dashboard
                      </MobileNavLink>
                      <MobileNavLink onClick={() => { router.push('/resident/community'); setShowMobileMenu(false); }} isActive={isActive('/resident/community')}>
                        Community
                      </MobileNavLink>
                      <MobileNavLink onClick={() => { router.push('/resident/events'); setShowMobileMenu(false); }} isActive={isActive('/resident/events')}>
                        Events
                      </MobileNavLink>
                      <MobileNavLink onClick={() => { router.push('/resident/announcements'); setShowMobileMenu(false); }} isActive={isActive('/resident/announcements')}>
                        Announcements
                      </MobileNavLink>
                      <MobileNavLink onClick={() => { router.push('/resident/notifications'); setShowMobileMenu(false); }} isActive={isActive('/resident/notifications')}>
                        Notifications
                      </MobileNavLink>
                    </>
                  )}
                  
                  {user.role === 'admin' && (
                    <>
                      <MobileNavLink onClick={() => { router.push('/admin/dashboard'); setShowMobileMenu(false); }} isActive={isActive('/admin/dashboard')}>
                        Dashboard
                      </MobileNavLink>
                      <MobileNavLink onClick={() => { router.push('/admin/residents'); setShowMobileMenu(false); }} isActive={isActive('/admin/residents')}>
                        Residents
                      </MobileNavLink>
                      <MobileNavLink onClick={() => { router.push('/admin/analytics'); setShowMobileMenu(false); }} isActive={isActive('/admin/analytics')}>
                        Analytics
                      </MobileNavLink>
                      <MobileNavLink onClick={() => { router.push('/admin/events'); setShowMobileMenu(false); }} isActive={isActive('/admin/events')}>
                        Events
                      </MobileNavLink>
                      <MobileNavLink onClick={() => { router.push('/admin/announcements'); setShowMobileMenu(false); }} isActive={isActive('/admin/announcements')}>
                        Announcements
                      </MobileNavLink>
                    </>
                  )}
                  
                  <div className="border-t border-white/20 pt-4 mt-4">
                    <MobileNavLink onClick={() => { router.push('/profile'); setShowMobileMenu(false); }}>
                      Profile Settings
                    </MobileNavLink>
                    <MobileNavLink onClick={() => { router.push(`/${user.role}/preferences`); setShowMobileMenu(false); }}>
                      Preferences
                    </MobileNavLink>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-error-600 hover:bg-error-50 rounded-xl transition-colors font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <MobileNavLink onClick={() => { router.push('/about'); setShowMobileMenu(false); }}>
                    About
                  </MobileNavLink>
                  <MobileNavLink onClick={() => { router.push('/contact'); setShowMobileMenu(false); }}>
                    Contact
                  </MobileNavLink>
                  <button
                    onClick={() => { router.push('/'); setShowMobileMenu(false); }}
                    className="w-full mt-4 btn-primary"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// NavLink Component
interface NavLinkProps {
  children: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
  icon?: React.ReactNode;
  role?: 'resident' | 'admin';
}

function NavLink({ children, onClick, isActive = false, icon, role = 'resident' }: NavLinkProps) {
  const activeClass = role === 'admin' 
    ? 'bg-gradient-to-r from-secondary-500/20 to-secondary-600/20 text-secondary-700 border border-secondary-300/50 shadow-lg' 
    : 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-700 border border-primary-300/50 shadow-lg';
  
  const hoverClass = role === 'admin'
    ? 'hover:bg-secondary-50 hover:text-secondary-600 hover:border-secondary-400/50'
    : 'hover:bg-primary-50 hover:text-primary-600 hover:border-primary-400/50';

  return (
    <button
      onClick={onClick}
      className={`flex items-center px-6 py-3 text-base font-semibold rounded-2xl transition-all duration-500 hover-lift relative overflow-hidden ${
        isActive ? activeClass : `text-gray-700 ${hoverClass}`
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      {icon && <span className="mr-3 relative z-10">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

// Mobile NavLink Component
interface MobileNavLinkProps {
  children: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
}

function MobileNavLink({ children, onClick, isActive = false }: MobileNavLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left px-6 py-4 text-base font-semibold rounded-2xl transition-all duration-500 hover-lift relative overflow-hidden ${
        isActive 
          ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-700 border border-primary-300/50 shadow-lg' 
          : 'text-gray-700 hover:bg-white/20 hover:text-primary-600 hover:border-primary-400/50'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      <span className="relative z-10">{children}</span>
    </button>
  );
}

