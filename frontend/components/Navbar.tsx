// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { apiUtils } from '../utils/api';
// import NotificationBell from './NotificationBell';

// export default function Navbar() {
//   const [user, setUser] = useState<{ name: string; role: string } | null>(null);
//   const [showProfileDropdown, setShowProfileDropdown] = useState(false);
//   const [showMobileMenu, setShowMobileMenu] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const userInfo = apiUtils.getUserFromToken();
//     setUser(userInfo);
//   }, []);

//   // Enhanced scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       const isScrolled = window.scrollY > 20;
//       setScrolled(isScrolled);
//     };
    
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (!(e.target as Element).closest('.dropdown-container')) {
//         setShowProfileDropdown(false);
//       }
//     };
    
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     apiUtils.logout();
//     router.push('/');
//   };

//   const isActive = (path: string) => router.pathname === path;

//   return (
//     <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
//       scrolled 
//         ? 'bg-white/90 backdrop-blur-3xl border-b-2 border-white/40 shadow-luxury-lg' 
//         : 'bg-white/20 backdrop-blur-2xl border-b border-white/30 shadow-luxury'
//     }`}>
//       <div className="px-8 mx-auto max-w-8xl sm:px-10 lg:px-12">
//         <div className="flex justify-between h-28">
          
//           {/* Ultra-Premium Logo and Brand */}
//           <div className="flex items-center">
//             <div 
//               onClick={() => router.push('/')}
//               className="flex items-center cursor-pointer group"
//             >
//               <div className="flex-shrink-0 transition-all duration-700 group-hover:scale-110 group-hover:rotate-12">
//                 <div className="w-18 h-18 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 rounded-[2rem] flex items-center justify-center shadow-luxury group-hover:shadow-neon transition-all duration-700 relative overflow-hidden border-2 border-white/40">
//                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
//                   <div className="absolute inset-0 bg-gradient-to-tr from-luxury-500/20 to-transparent animate-pulse-gentle"></div>
//                   <svg className="w-10 h-10 text-white relative z-10 animate-glow" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 48 48">
//                     <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2.5" fill="none" className="animate-pulse-slow" />
//                     <path d="M16 32c0-4 8-4 8-8s-8-4-8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
//                     <path d="M32 32c0-4-8-4-8-8s8-4 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-6">
//                 <h1 className="text-4xl font-display font-black text-gradient-luxury tracking-tight text-shadow-luxury font-luxury">SheBuilds</h1>
//                 <p className="text-base text-gray-600 font-bold">Community Support</p>
//               </div>
//             </div>
//           </div>

//           {/* Ultra-Premium Navigation Links - Desktop */}
//           <div className="hidden items-center space-x-3 lg:flex">
//             {user ? (
//               <>
//                 {/* Resident Navigation */}
//                 {user.role === 'resident' && (
//                   <>
//                     <NavLink
//                       onClick={() => router.push('/resident/dashboard')}
//                       isActive={isActive('/resident/dashboard')}
//                       icon={
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//                         </svg>
//                       }
//                       role="resident"
//                     >
//                       Dashboard
//                     </NavLink>
                    
//                     <NavLink
//                       onClick={() => router.push('/resident/community')}
//                       isActive={isActive('/resident/community')}
//                       icon={
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                         </svg>
//                       }
//                       role="resident"
//                     >
//                       Community
//                     </NavLink>

//                     <NavLink
//                       onClick={() => router.push('/resident/events')}
//                       isActive={isActive('/resident/events')}
//                       icon={
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                         </svg>
//                       }
//                       role="resident"
//                     >
//                       Events
//                     </NavLink>

//                     <NavLink
//                       onClick={() => router.push('/resident/announcements')}
//                       isActive={isActive('/resident/announcements')}
//                       icon={
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
//                         </svg>
//                       }
//                       role="resident"
//                     >
//                       Announcements
//                     </NavLink>
//                   </>
//                 )}

//                 {/* Admin Navigation */}
//                 {user.role === 'admin' && (
//                   <>
//                     <NavLink
//                       onClick={() => router.push('/admin/dashboard')}
//                       isActive={isActive('/admin/dashboard')}
//                       icon={
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                         </svg>
//                       }
//                       role="admin"
//                     >
//                       Dashboard
//                     </NavLink>

//                     <NavLink
//                       onClick={() => router.push('/admin/residents')}
//                       isActive={isActive('/admin/residents')}
//                       icon={
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//                         </svg>
//                       }
//                       role="admin"
//                     >
//                       Residents
//                     </NavLink>

//                     <NavLink
//                       onClick={() => router.push('/admin/analytics')}
//                       isActive={isActive('/admin/analytics')}
//                       icon={
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                         </svg>
//                       }
//                       role="admin"
//                     >
//                       Analytics
//                     </NavLink>

//                     <NavLink
//                       onClick={() => router.push('/admin/events')}
//                       isActive={isActive('/admin/events')}
//                       icon={
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                         </svg>
//                       }
//                       role="admin"
//                     >
//                       Events
//                     </NavLink>

//                     <NavLink
//                       onClick={() => router.push('/admin/announcements')}
//                       isActive={isActive('/admin/announcements')}
//                       icon={
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
//                         </svg>
//                       }
//                       role="admin"
//                     >
//                       Announcements
//                     </NavLink>
//                   </>
//                 )}

//                 {/* Ultra-Premium Notifications */}
//                 <div className="ml-4">
//                   <NotificationBell className="dropdown-container" />
//                 </div>

//                 {/* Ultra-Premium Profile Dropdown */}
//                 <div className="relative dropdown-container ml-4">
//                   <button
//                     onClick={() => {
//                       setShowProfileDropdown(!showProfileDropdown);
//                     }}
//                     className="flex items-center p-3 text-gray-600 hover:text-primary-600 rounded-3xl glass-card hover:shadow-luxury transition-all duration-700 hover-lift group border-2 border-white/40 hover:border-white/60"
//                   >
//                     <div className="w-12 h-12 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-luxury group-hover:shadow-glow transition-all duration-500">
//                       {user.name?.charAt(0).toUpperCase() || 'U'}
//                     </div>
//                     <div className="ml-4 text-left hidden xl:block">
//                       <p className="text-base font-bold text-gray-900">{user.name || 'User'}</p>
//                       <p className="text-sm text-gray-500 capitalize font-semibold">{user.role}</p>
//                     </div>
//                     <svg className="ml-3 w-5 h-5 transition-transform duration-500 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>

//                   {/* Ultra-Premium Profile Dropdown Menu */}
//                   {showProfileDropdown && (
//                     <div className="absolute right-0 mt-4 w-80 glass-card rounded-3xl shadow-luxury-xl animate-slide-down border-2 border-white/40 overflow-hidden">
//                       <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-primary-50/50 to-secondary-50/50">
//                         <div className="flex items-center">
//                           <div className="w-16 h-16 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-luxury">
//                             {user.name?.charAt(0).toUpperCase() || 'U'}
//                           </div>
//                           <div className="ml-4">
//                             <p className="font-bold text-gray-900 text-lg">{user.name || 'User'}</p>
//                             <p className="text-sm text-gray-500 capitalize font-semibold">{user.role}</p>
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div className="py-3">
//                         <button
//                           onClick={() => {
//                             router.push('/profile');
//                             setShowProfileDropdown(false);
//                           }}
//                           className="flex items-center w-full px-6 py-4 text-base text-gray-700 hover:bg-primary-50/50 hover:text-primary-600 transition-all duration-500 font-semibold hover-lift"
//                         >
//                           <svg className="w-5 h-5 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                           </svg>
//                           Profile Settings
//                         </button>
                        
//                         <button
//                           onClick={() => {
//                             router.push(`/${user.role}/preferences`);
//                             setShowProfileDropdown(false);
//                           }}
//                           className="flex items-center w-full px-6 py-4 text-base text-gray-700 hover:bg-primary-50/50 hover:text-primary-600 transition-all duration-500 font-semibold hover-lift"
//                         >
//                           <svg className="w-5 h-5 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                           </svg>
//                           Preferences
//                         </button>
                        
//                         <div className="border-t border-gray-200/50 mt-3 pt-3">
//                           <button
//                             onClick={handleLogout}
//                             className="flex items-center w-full px-6 py-4 text-base text-error-600 hover:bg-error-50/50 hover:text-error-700 transition-all duration-500 font-semibold hover-lift"
//                           >
//                             <svg className="w-5 h-5 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                             </svg>
//                             Sign Out
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </>
//             ) : (
//               /* Ultra-Premium Auth Buttons for non-authenticated users */
//               <div className="flex items-center space-x-6">
//                 <button
//                   onClick={() => router.push('/about')}
//                   className="nav-link text-gray-700 hover:text-primary-600 font-bold"
//                 >
//                   About
//                 </button>
//                 <button
//                   onClick={() => router.push('/contact')}
//                   className="nav-link text-gray-700 hover:text-primary-600 font-bold"
//                 >
//                   Contact
//                 </button>
//                 <button
//                   onClick={() => router.push('/')}
//                   className="btn-ghost text-lg py-4 px-8"
//                 >
//                   Get Started
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Ultra-Premium Mobile menu button */}
//           <div className="flex items-center lg:hidden">
//             <button 
//               onClick={() => setShowMobileMenu(!showMobileMenu)}
//               className="p-3 text-gray-600 hover:text-primary-600 glass-card rounded-2xl transition-all duration-500 hover-lift border-2 border-white/40 hover:border-white/60"
//               aria-label="Toggle mobile menu"
//             >
//               <svg className={`w-7 h-7 transition-transform duration-500 ${showMobileMenu ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 {showMobileMenu ? (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
//                 ) : (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
//                 )}
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Ultra-Premium Mobile Menu */}
//         {showMobileMenu && (
//           <div className="lg:hidden border-t border-white/30 mt-6 pt-6 pb-6 animate-slide-down">
//             <div className="space-y-3">
//               {user ? (
//                 <>
//                   {user.role === 'resident' && (
//                     <>
//                       <MobileNavLink onClick={() => { router.push('/resident/dashboard'); setShowMobileMenu(false); }} isActive={isActive('/resident/dashboard')}>
//                         Dashboard
//                       </MobileNavLink>
//                       <MobileNavLink onClick={() => { router.push('/resident/community'); setShowMobileMenu(false); }} isActive={isActive('/resident/community')}>
//                         Community
//                       </MobileNavLink>
//                       <MobileNavLink onClick={() => { router.push('/resident/events'); setShowMobileMenu(false); }} isActive={isActive('/resident/events')}>
//                         Events
//                       </MobileNavLink>
//                       <MobileNavLink onClick={() => { router.push('/resident/announcements'); setShowMobileMenu(false); }} isActive={isActive('/resident/announcements')}>
//                         Announcements
//                       </MobileNavLink>
//                       <MobileNavLink onClick={() => { router.push('/resident/notifications'); setShowMobileMenu(false); }} isActive={isActive('/resident/notifications')}>
//                         Notifications
//                       </MobileNavLink>
//                     </>
//                   )}
                  
//                   {user.role === 'admin' && (
//                     <>
//                       <MobileNavLink onClick={() => { router.push('/admin/dashboard'); setShowMobileMenu(false); }} isActive={isActive('/admin/dashboard')}>
//                         Dashboard
//                       </MobileNavLink>
//                       <MobileNavLink onClick={() => { router.push('/admin/residents'); setShowMobileMenu(false); }} isActive={isActive('/admin/residents')}>
//                         Residents
//                       </MobileNavLink>
//                       <MobileNavLink onClick={() => { router.push('/admin/analytics'); setShowMobileMenu(false); }} isActive={isActive('/admin/analytics')}>
//                         Analytics
//                       </MobileNavLink>
//                       <MobileNavLink onClick={() => { router.push('/admin/events'); setShowMobileMenu(false); }} isActive={isActive('/admin/events')}>
//                         Events
//                       </MobileNavLink>
//                       <MobileNavLink onClick={() => { router.push('/admin/announcements'); setShowMobileMenu(false); }} isActive={isActive('/admin/announcements')}>
//                         Announcements
//                       </MobileNavLink>
//                     </>
//                   )}
                  
//                   <div className="border-t border-white/30 pt-6 mt-6">
//                     <MobileNavLink onClick={() => { router.push('/profile'); setShowMobileMenu(false); }}>
//                       Profile Settings
//                     </MobileNavLink>
//                     <MobileNavLink onClick={() => { router.push(`/${user.role}/preferences`); setShowMobileMenu(false); }}>
//                       Preferences
//                     </MobileNavLink>
//                     <button
//                       onClick={handleLogout}
//                       className="block w-full text-left px-6 py-4 text-error-600 hover:bg-error-50/50 rounded-3xl transition-all duration-500 font-bold text-lg hover-lift"
//                     >
//                       Sign Out
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <MobileNavLink onClick={() => { router.push('/about'); setShowMobileMenu(false); }}>
//                     About
//                   </MobileNavLink>
//                   <MobileNavLink onClick={() => { router.push('/contact'); setShowMobileMenu(false); }}>
//                     Contact
//                   </MobileNavLink>
//                   <button
//                     onClick={() => { router.push('/'); setShowMobileMenu(false); }}
//                     className="w-full mt-6 btn-primary text-lg py-4"
//                   >
//                     Get Started
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }

// // Ultra-Premium NavLink Component
// interface NavLinkProps {
//   children: React.ReactNode;
//   onClick: () => void;
//   isActive?: boolean;
//   icon?: React.ReactNode;
//   role?: 'resident' | 'admin';
// }

// function NavLink({ children, onClick, isActive = false, icon, role = 'resident' }: NavLinkProps) {
//   const activeClass = role === 'admin' 
//     ? 'bg-gradient-to-r from-secondary-500/30 to-secondary-600/30 text-secondary-700 border-2 border-secondary-400/60 shadow-luxury backdrop-blur-xl' 
//     : 'bg-gradient-to-r from-primary-500/30 to-primary-600/30 text-primary-700 border-2 border-primary-400/60 shadow-luxury backdrop-blur-xl';
  
//   const hoverClass = role === 'admin'
//     ? 'hover:bg-secondary-50/30 hover:text-secondary-600 hover:border-secondary-400/60 hover:shadow-luxury'
//     : 'hover:bg-primary-50/30 hover:text-primary-600 hover:border-primary-400/60 hover:shadow-luxury';

//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center px-8 py-4 text-base font-bold rounded-3xl transition-all duration-700 hover-lift relative overflow-hidden border-2 ${
//         isActive ? activeClass : `text-gray-700 border-white/40 glass-card ${hoverClass}`
//       }`}
//     >
//       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
//       {icon && <span className="mr-3 relative z-10 transition-transform duration-300 hover:scale-110">{icon}</span>}
//       <span className="relative z-10">{children}</span>
//     </button>
//   );
// }

// // Ultra-Premium Mobile NavLink Component
// interface MobileNavLinkProps {
//   children: React.ReactNode;
//   onClick: () => void;
//   isActive?: boolean;
// }

// function MobileNavLink({ children, onClick, isActive = false }: MobileNavLinkProps) {
//   return (
//     <button
//       onClick={onClick}
//       className={`block w-full text-left px-8 py-5 text-lg font-bold rounded-3xl transition-all duration-700 hover-lift relative overflow-hidden border-2 ${
//         isActive 
//           ? 'bg-gradient-to-r from-primary-500/30 to-primary-600/30 text-primary-700 border-primary-400/60 shadow-luxury backdrop-blur-xl' 
//           : 'text-gray-700 border-white/40 glass-card hover:bg-white/30 hover:text-primary-600 hover:border-primary-400/60 hover:shadow-luxury'
//       }`}
//     >
//       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
//       <span className="relative z-10">{children}</span>
//     </button>
//   );
// }



import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiUtils } from '../utils/api';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userInfo = apiUtils.getUserFromToken();
    setUser(userInfo);
  }, []);

  // Enhanced scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl' 
        : 'bg-gray-900/90 backdrop-blur-lg border-b border-gray-800/50 shadow-xl'
    }`}>
      <div className="px-6 mx-auto max-w-7xl sm:px-8 lg:px-10">
        <div className="flex justify-between h-16">
          
          {/* Professional Logo and Brand */}
          <div className="flex items-center">
            <div 
              onClick={() => router.push('/')}
              className="flex items-center cursor-pointer group"
            >
              <div className="flex-shrink-0 transition-all duration-300 group-hover:scale-105">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 border border-gray-700">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-white tracking-tight">SheBuilds</h1>
                <p className="text-xs text-gray-400 font-medium">Community Support</p>
              </div>
            </div>
          </div>

          {/* Professional Navigation Links - Desktop */}
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

                {/* Professional Notifications */}
                <div className="ml-2">
                  <NotificationBell className="dropdown-container" />
                </div>

                {/* Professional Profile Dropdown */}
                <div className="relative dropdown-container ml-2">
                  <button
                    onClick={() => {
                      setShowProfileDropdown(!showProfileDropdown);
                    }}
                    className="flex items-center p-2 text-gray-300 hover:text-white rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 group border border-gray-700 hover:border-gray-600"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-medium text-sm shadow-lg">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="ml-2 text-left hidden xl:block">
                      <p className="text-sm font-medium text-white">{user.name || 'User'}</p>
                      <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                    </div>
                    <svg className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Professional Profile Dropdown Menu */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                      <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-medium text-lg shadow-lg">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-white text-sm">{user.name || 'User'}</p>
                            <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        <button
                          onClick={() => {
                            router.push('/profile');
                            setShowProfileDropdown(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
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
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Preferences
                        </button>
                        
                        <div className="border-t border-gray-700 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-200"
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
              /* Professional Auth Buttons for non-authenticated users */
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/about')}
                  className="text-gray-300 hover:text-white font-medium text-sm transition-colors duration-200"
                >
                  About
                </button>
                <button
                  onClick={() => router.push('/contact')}
                  className="text-gray-300 hover:text-white font-medium text-sm transition-colors duration-200"
                >
                  Contact
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Professional Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-300 hover:text-white bg-gray-800/50 rounded-lg transition-all duration-300 border border-gray-700 hover:border-gray-600"
              aria-label="Toggle mobile menu"
            >
              <svg className={`w-5 h-5 transition-transform duration-300 ${showMobileMenu ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Professional Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-gray-700 mt-4 pt-4 pb-4 animate-in slide-in-from-top-2 duration-200">
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
                  
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <MobileNavLink onClick={() => { router.push('/profile'); setShowMobileMenu(false); }}>
                      Profile Settings
                    </MobileNavLink>
                    <MobileNavLink onClick={() => { router.push(`/${user.role}/preferences`); setShowMobileMenu(false); }}>
                      Preferences
                    </MobileNavLink>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-200 font-medium text-sm"
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
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium text-sm transition-colors duration-200"
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

// Professional NavLink Component
interface NavLinkProps {
  children: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
  icon?: React.ReactNode;
  role?: 'resident' | 'admin';
}

function NavLink({ children, onClick, isActive = false, icon, role = 'resident' }: NavLinkProps) {
  const activeClass = role === 'admin' 
    ? 'bg-purple-600/20 text-purple-300 border-purple-500/30' 
    : 'bg-blue-600/20 text-blue-300 border-blue-500/30';
  
  const hoverClass = role === 'admin'
    ? 'hover:bg-purple-600/10 hover:text-purple-300 hover:border-purple-500/30'
    : 'hover:bg-blue-600/10 hover:text-blue-300 hover:border-blue-500/30';

  return (
    <button
      onClick={onClick}
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border ${
        isActive ? activeClass : `text-gray-300 border-gray-700 bg-gray-800/50 ${hoverClass}`
      }`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

// Professional Mobile NavLink Component
interface MobileNavLinkProps {
  children: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
}

function MobileNavLink({ children, onClick, isActive = false }: MobileNavLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' 
          : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}