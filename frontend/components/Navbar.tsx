// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { apiUtils, notificationAPI } from '../utils/api';

// export default function Navbar() {
//   const [user, setUser] = useState<{ name: string; role: string } | null>(null);
//   const [showProfileDropdown, setShowProfileDropdown] = useState(false);
//   const [notifications, setNotifications] = useState<Array<{ message: string; time: string }>>([]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const router = useRouter();

//   useEffect(() => {
//     const userInfo = apiUtils.getUserFromToken();
//     setUser(userInfo);
    
//     // Fetch notifications if user is authenticated
//     if (userInfo) {
//       fetchNotifications();
//     }
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       const data = await notificationAPI.getNotifications({ limit: 5, unreadOnly: true });
//       setUnreadCount(data.unreadCount);
//       setNotifications(data.notifications.slice(0, 3).map(n => ({
//         message: n.title,
//         time: new Date(n.createdAt).toLocaleDateString()
//       })));
//     } catch (err) {
//       console.error('Error fetching notifications:', err);
//     }
//   };

//   const handleLogout = () => {
//     apiUtils.logout();
//     router.push('/');
//   };

//   const isActive = (path: string) => router.pathname === path;

//   return (
//     <nav className="bg-white border-b border-gray-200 shadow-lg">
//       <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           {/* Logo and Brand */}
//           <div className="flex items-center">
//             <div 
//               onClick={() => router.push('/')}
//               className="flex items-center cursor-pointer"
//             >
//               <div className="flex-shrink-0">
//                 <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
//                   <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <h1 className="text-xl font-bold text-gray-900">SheBuilds</h1>
//                 <p className="text-xs text-gray-500">Community Support</p>
//               </div>
//             </div>
//           </div>

//           {/* Navigation Links */}
//           <div className="hidden items-center space-x-8 md:flex">
//             {user ? (
//               <>
//                 {user.role === 'resident' && (
//                   <>
//                     <button
//                       onClick={() => router.push('/resident/dashboard')}
//                       className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/resident/dashboard') 
//                           ? 'text-indigo-700 bg-indigo-100' 
//                           : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
//                       }`}
//                     >
//                       Dashboard
//                     </button>
//                     <button
//                       onClick={() => router.push('/resident/issues')}
//                       className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/resident/issues') 
//                           ? 'text-indigo-700 bg-indigo-100' 
//                           : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
//                       }`}
//                     >
//                       My Issues
//                     </button>
//                     <button
//                       onClick={() => router.push('/resident/community')}
//                       className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/resident/community') 
//                           ? 'text-indigo-700 bg-indigo-100' 
//                           : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
//                       }`}
//                     >
//                       Community
//                     </button>
//                     <button
//                       onClick={() => router.push('/resident/events')}
//                       className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/resident/events') 
//                           ? 'text-indigo-700 bg-indigo-100' 
//                           : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
//                       }`}
//                     >
//                       Events
//                     </button>
//                     <button
//                       onClick={() => router.push('/resident/announcements')}
//                       className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/resident/announcements') 
//                           ? 'text-indigo-700 bg-indigo-100' 
//                           : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
//                       }`}
//                     >
//                       Announcements
//                     </button>
//                     <button
//                       onClick={() => router.push('/resident/notifications')}
//                       className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/resident/notifications') 
//                           ? 'text-indigo-700 bg-indigo-100' 
//                           : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
//                       }`}
//                     >
//                       Notifications
//                       {unreadCount > 0 && (
//                         <span className="flex justify-center items-center ml-1 w-5 h-5 text-xs text-white bg-red-500 rounded-full">
//                           {unreadCount}
//                         </span>
//                       )}
//                     </button>
//                   </>
//                 )}
//                 {user.role === 'admin' && (
//                   <>
//                     <button
//                       onClick={() => router.push('/admin/dashboard')}
//                       className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/admin/dashboard') 
//                           ? 'text-orange-700 bg-orange-100' 
//                           : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
//                       }`}
//                     >
//               Dashboard
//                     </button>
//                     <button
//                       onClick={() => router.push('/admin/issues')}
//                       className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/admin/issues') 
//                           ? 'text-orange-700 bg-orange-100' 
//                           : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
//                       }`}
//                     >
//                       All Issues
//                     </button>
//                     <button
//                       onClick={() => router.push('/admin/residents')}
//                       className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/admin/residents') 
//                           ? 'text-orange-700 bg-orange-100' 
//                           : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
//                       }`}
//                     >
//                       Residents
//                     </button>
//                     <button
//                       onClick={() => router.push('/admin/analytics')}
//                       className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/admin/analytics') 
//                           ? 'text-orange-700 bg-orange-100' 
//                           : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
//                       }`}
//                     >
//                       Analytics
//                     </button>
//                     <button
//                       onClick={() => router.push('/admin/events')}
//                       className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/admin/events') 
//                           ? 'text-orange-700 bg-orange-100' 
//                           : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
//                       }`}
//                     >
//                       Events
//                     </button>
//                     <button
//                       onClick={() => router.push('/admin/announcements')}
//                       className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/admin/announcements') 
//                           ? 'text-orange-700 bg-orange-100' 
//                           : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
//                       }`}
//                     >
//                       Announcements
//                     </button>
//                     <button
//                       onClick={() => router.push('/admin/notifications')}
//                       className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/admin/notifications') 
//                           ? 'text-orange-700 bg-orange-100' 
//                           : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
//                       }`}
//                     >
//                       Notifications
//                     </button>
//                   </>
//                 )}
//               </>
//             ) : (
//               <>
//                 <button
//                   onClick={() => router.push('/')}
//                   className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md transition-colors hover:text-indigo-600 hover:bg-indigo-50"
//                 >
//                   Home
//                 </button>
//                 <button
//                   onClick={() => router.push('/about')}
//                   className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md transition-colors hover:text-indigo-600 hover:bg-indigo-50"
//                 >
//                   About
//                 </button>
//                 <button
//                   onClick={() => router.push('/contact')}
//                   className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md transition-colors hover:text-indigo-600 hover:bg-indigo-50"
//                 >
//                   Contact
//                 </button>
//               </>
//             )}
//           </div>

//           {/* Right side - Notifications and Profile */}
//           <div className="flex items-center space-x-4">
//             {user && (
//               <>
//                 {/* Notifications */}
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowNotifications(!showNotifications)}
//                     className="relative p-2 text-gray-600 hover:text-indigo-600"
//                   >
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 00-6 6v3.75l-2.25 2.25V19.5h12.5V15.75L16.5 13.5V9.75a6 6 0 00-6-6z" />
//                     </svg>
//                     {unreadCount > 0 && (
//                       <span className="flex absolute -top-1 -right-1 justify-center items-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
//                         {unreadCount}
//                       </span>
//                     )}
//                   </button>
                  
//                   {/* Notifications Dropdown */}
//                   {showNotifications && (
//                     <div className="absolute right-0 z-50 mt-2 w-80 bg-white rounded-lg border border-gray-200 shadow-lg">
//                       <div className="p-4 border-b border-gray-200">
//                         <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
//                       </div>
//                       <div className="overflow-y-auto max-h-64">
//                         {notifications.length === 0 ? (
//                           <div className="p-4 text-center text-gray-500">
//                             No new notifications
//                           </div>
//                         ) : (
//                           <>
//                             {notifications.map((notification, index) => (
//                               <div key={index} className="p-4 border-b border-gray-100 hover:bg-gray-50">
//                                 <p className="text-sm text-gray-900">{notification.message}</p>
//                                 <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
//                               </div>
//                             ))}
//                             <div className="p-4 border-t border-gray-200">
//                               <button
//                                 onClick={() => {
//                                   router.push(user?.role === 'admin' ? '/admin/notifications' : '/resident/notifications');
//                                   setShowNotifications(false);
//                                 }}
//                                 className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
//                               >
//                                 View all notifications →
//                               </button>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Profile Dropdown */}
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowProfileDropdown(!showProfileDropdown)}
//                     className="flex items-center p-2 space-x-2 rounded-lg transition-colors hover:bg-gray-100"
//                   >
//                     <div className="flex justify-center items-center w-8 h-8 bg-indigo-600 rounded-full">
//                       <span className="text-sm font-medium text-white">
//                         {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
//                       </span>
//                     </div>
//                     <span className="hidden text-sm font-medium text-gray-700 md:block">
//                       {user.name || 'User'}
//                     </span>
//                     <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>

//                   {/* Profile Dropdown Menu */}
//                   {showProfileDropdown && (
//                     <div className="absolute right-0 z-50 mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg">
//                       <div className="py-1">
//                         <button
//                           onClick={() => {
//                             router.push('/profile');
//                             setShowProfileDropdown(false);
//                           }}
//                           className="block px-4 py-2 w-full text-sm text-left text-gray-700 hover:bg-gray-100"
//                         >
//                           Profile Settings
//                         </button>
//                         <button
//                           onClick={() => {
//                             router.push('/settings');
//                             setShowProfileDropdown(false);
//                           }}
//                           className="block px-4 py-2 w-full text-sm text-left text-gray-700 hover:bg-gray-100"
//                         >
//                           Preferences
//                         </button>
//                         <hr className="my-1" />
//                         <button
//                           onClick={handleLogout}
//                           className="block px-4 py-2 w-full text-sm text-left text-red-600 hover:bg-red-50"
//                         >
//                           Sign Out
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}

//             {/* Auth Buttons for non-authenticated users */}
//             {!user && (
//               <div className="flex items-center space-x-4">
//                 <button
//                   onClick={() => router.push('/resident/login')}
//                   className="font-medium text-gray-700 hover:text-indigo-600"
//                 >
//                   Login
//                 </button>
//                 <button
//                   onClick={() => router.push('/resident/signup')}
//                   className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-lg transition-colors hover:bg-indigo-700"
//                 >
//                   Sign Up
//             </button>
//           </div>
//         )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile menu button */}
//       <div className="md:hidden">
//         <button 
//           className="text-gray-700 hover:text-indigo-600"
//           aria-label="Toggle mobile menu"
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//         </button>
//       </div>
//     </nav>
//   );
// } 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiUtils, notificationAPI } from '../utils/api';

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ message: string; time: string }>>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userInfo = apiUtils.getUserFromToken();
    setUser(userInfo);
    
    // Fetch notifications if user is authenticated
    if (userInfo) {
      fetchNotifications();
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.dropdown-container')) {
        setShowProfileDropdown(false);
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationAPI.getNotifications({ limit: 5, unreadOnly: true });
      setUnreadCount(data.unreadCount);
      setNotifications(data.notifications.slice(0, 3).map(n => ({
        message: n.title,
        time: new Date(n.createdAt).toLocaleDateString()
      })));
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const handleLogout = () => {
    apiUtils.logout();
    router.push('/');
  };

  const isActive = (path: string) => router.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 shadow-lg sticky top-0 z-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div 
              onClick={() => router.push('/')}
              className="flex items-center cursor-pointer group"
            >
              <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">SheBuilds</h1>
                <p className="text-xs text-gray-500 font-medium">Community Support</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden items-center space-x-4 md:flex">
            {user ? (
              <>
                {user.role === 'resident' && (
                  <>
                    <button
                      onClick={() => router.push('/resident/dashboard')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 \${isActive('/resident/dashboard') 
                          ? 'text-indigo-700 bg-indigo-100 shadow-sm' 
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                      </span>
                    </button>
                    <button
                      onClick={() => router.push('/resident/issues')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 \${isActive('/resident/issues') 
                          ? 'text-indigo-700 bg-indigo-100 shadow-sm' 
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        My Issues
                      </span>
                    </button>
                    <button
                      onClick={() => router.push('/resident/community')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 \${isActive('/resident/community') 
                          ? 'text-indigo-700 bg-indigo-100 shadow-sm' 
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Community
                      </span>
                    </button>
                    <button
                      onClick={() => router.push('/resident/events')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 \${isActive('/resident/events') 
                          ? 'text-indigo-700 bg-indigo-100 shadow-sm' 
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Events
                      </span>
                    </button>
                    <button
                      onClick={() => router.push('/resident/announcements')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 \${isActive('/resident/announcements') 
                          ? 'text-indigo-700 bg-indigo-100 shadow-sm' 
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                        Announcements
                      </span>
                    </button>
                    <button
                      onClick={() => router.push('/resident/notifications')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 \${isActive('/resident/notifications') 
                          ? 'text-indigo-700 bg-indigo-100 shadow-sm' 
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        Notifications
                        {unreadCount > 0 && (
                          <span className="flex justify-center items-center ml-1 w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </span>
                    </button>
                  </>
                )}
                {user.role === 'admin' && (
                  <>
                    <button
                      onClick={() => router.push('/admin/dashboard')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 \${isActive('/admin/dashboard') 
                          ? 'text-orange-700 bg-orange-100 shadow-sm' 
                          : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                      </span>
                    </button>
                    <button
                      onClick={() => router.push('/admin/issues')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 \${isActive('/admin/issues') 
                          ? 'text-orange-700 bg-orange-100 shadow-sm' 
                          : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        All Issues
                      </span>
                    </button>
                    <button
                      onClick={() => router.push('/admin/residents')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 \${isActive('/admin/residents') 
                          ? 'text-orange-700 bg-orange-100 shadow-sm' 
                          : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Residents
                      </span>
                    </button>
                    <button
                      onClick={() => router.push('/admin/analytics')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 \${isActive('/admin/analytics') 
                          ? 'text-orange-700 bg-orange-100 shadow-sm' 
                          : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Analytics
                      </span>
                    </button>
                    <button
                      onClick={() => router.push('/admin/events')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 \${isActive('/admin/events') 
                          ? 'text-orange-700 bg-orange-100 shadow-sm' 
                          : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Events
                      </span>
                    </button>
                    <button
                      onClick={() => router.push('/admin/announcements')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 \${isActive('/admin/announcements') 
                          ? 'text-orange-700 bg-orange-100 shadow-sm' 
                          : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                        Announcements
                      </span>
                    </button>
                    <button
                      onClick={() => router.push('/admin/notifications')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 \${isActive('/admin/notifications') 
                          ? 'text-orange-700 bg-orange-100 shadow-sm' 
                          : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        Notifications
                      </span>
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 \${isActive('/') 
                    ? 'text-indigo-700 bg-indigo-100 shadow-sm' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                  </span>
                </button>
                <button
                  onClick={() => router.push('/about')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 \${isActive('/about') 
                    ? 'text-indigo-700 bg-indigo-100 shadow-sm' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    About
                  </span>
                </button>
                <button
                  onClick={() => router.push('/contact')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 \${isActive('/contact') 
                    ? 'text-indigo-700 bg-indigo-100 shadow-sm' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                {/* Notifications */}
                <div className="relative dropdown-container" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors duration-200"
                    aria-label="Notifications"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="flex absolute -top-1 -right-1 justify-center items-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 z-50 mt-2 w-80 bg-white rounded-lg border border-gray-200 shadow-xl transform transition-all duration-300 origin-top-right dropdown-container">
                      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="px-2 py-1 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="overflow-y-auto max-h-64 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <p className="mt-3 text-gray-500">No new notifications</p>
                          </div>
                        ) : (
                          <>
                            {notifications.map((notification, index) => (
                              <div key={index} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                                <div className="flex items-start">
                                  <div className="flex-shrink-0 pt-0.5">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                      </svg>
                                    </div>
                                  </div>
                                  <div className="ml-3 flex-1">
                                    <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                                    <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                            <div className="p-4 border-t border-gray-200 bg-gray-50">
                              <button
                                onClick={() => {
                                  router.push(user?.role === 'admin' ? '/admin/notifications' : '/resident/notifications');
                                  setShowNotifications(false);
                                }}
                                className="w-full text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-150 flex items-center justify-center"
                              >
                                View all notifications
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                  </svg>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
  
                  {/* Profile Dropdown */}
                  <div className="relative dropdown-container" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="flex items-center p-2 space-x-2 rounded-lg transition-colors hover:bg-gray-100"
                    >
                      <div className="flex justify-center items-center w-9 h-9 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full overflow-hidden shadow-md">
                        <span className="text-sm font-medium text-white">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <span className="hidden text-sm font-medium text-gray-700 md:block">
                        {user.name || 'User'}
                      </span>
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
  
                    {/* Profile Dropdown Menu */}
                    {showProfileDropdown && (
                      <div className="absolute right-0 z-50 mt-2 w-56 bg-white rounded-lg border border-gray-200 shadow-xl transform transition-all duration-300 origin-top-right dropdown-container">
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex items-center space-x-3">
                            <div className="flex justify-center items-center w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
                              <span className="text-lg font-medium text-white">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                            </div>
                          </div>
                        </div>
                        <div className="py-1">
                          <button
                            onClick={() => {
                              router.push('/profile');
                              setShowProfileDropdown(false);
                            }}
                            className="flex items-center px-4 py-3 w-full text-sm text-left text-gray-700 hover:bg-gray-50"
                          >
                            <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profile Settings
                          </button>
                          <button
                            onClick={() => {
                              router.push('/settings');
                              setShowProfileDropdown(false);
                            }}
                            className="flex items-center px-4 py-3 w-full text-sm text-left text-gray-700 hover:bg-gray-50"
                          >
                            <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Preferences
                          </button>
                          <hr className="my-1 border-gray-200" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center px-4 py-3 w-full text-sm text-left text-red-600 hover:bg-red-50"
                          >
                            <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
  
              {/* Auth Buttons for non-authenticated users */}
              {!user && (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => router.push('/resident/login')}
                    className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => router.push('/resident/signup')}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 transform hover:scale-105"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
  
        {/* Mobile menu */}
        <div className="md:hidden">
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="fixed bottom-4 right-4 p-3 rounded-full bg-indigo-600 text-white shadow-lg z-50 hover:bg-indigo-700 transition-all duration-200"
            aria-label="Toggle mobile menu"
          >
            {showMobileMenu ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          
          {/* Mobile menu panel */}
          {showMobileMenu && (
            <div className="fixed inset-0 z-40 bg-gray-800 bg-opacity-75 flex justify-end">
              <div className="w-3/4 max-w-xs bg-white h-full overflow-y-auto shadow-xl transform transition-all duration-300 ease-in-out">
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-white border-b border-gray-200">
                  {user ? (
                    <div className="flex items-center space-x-3">
                      <div className="flex justify-center items-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
                        <span className="text-xl font-medium text-white">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-base font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-3">
                      <h3 className="text-lg font-bold text-gray-900">SheBuilds</h3>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            router.push('/resident/login');
                            setShowMobileMenu(false);
                          }}
                          className="flex-1 px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors duration-200"
                        >
                          Login
                        </button>
                        <button
                          onClick={() => {
                            router.push('/resident/signup');
                            setShowMobileMenu(false);
                          }}
                          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                        >
                          Sign Up
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="px-2 py-4">
                  {user ? (
                    <>
                      {user.role === 'resident' && (
                        <>
                          <button
                            onClick={() => {
                              router.push('/resident/dashboard');
                              setShowMobileMenu(false);
                            }}
                            className={`flex items-center px-4 py-3 w-full text-left rounded-md \${
                              isActive('/resident/dashboard') 
                                ? 'text-indigo-700 bg-indigo-50' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Dashboard
                          </button>
                          <button
                            onClick={() => {
                              router.push('/resident/issues');
                              setShowMobileMenu(false);
                            }}
                            className={`flex items-center px-4 py-3 w-full text-left rounded-md \${
                              isActive('/resident/issues') 
                                ? 'text-indigo-700 bg-indigo-50' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            My Issues
                          </button>
                          <button
                            onClick={() => {
                              router.push('/resident/community');
                              setShowMobileMenu(false);
                            }}
                            className={`flex items-center px-4 py-3 w-full text-left rounded-md \${
                              isActive('/resident/community') 
                                ? 'text-indigo-700 bg-indigo-50' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Community
                          </button>
                          <button
                            onClick={() => {
                              router.push('/resident/events');
                              setShowMobileMenu(false);
                            }}
                            className={`flex items-center px-4 py-3 w-full text-left rounded-md \${
                              isActive('/resident/events') 
                                ? 'text-indigo-700 bg-indigo-50' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Events
                          </button>
                          <button
                            onClick={() => {
                              router.push('/resident/announcements');
                              setShowMobileMenu(false);
                            }}
                            className={`flex items-center px-4 py-3 w-full text-left rounded-md \${
                              isActive('/resident/announcements') 
                                ? 'text-indigo-700 bg-indigo-50' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                            Announcements
                          </button>
                          <button
                            onClick={() => {
                              router.push('/resident/notifications');
                              setShowMobileMenu(false);
                            }}
                            className={`flex items-center px-4 py-3 w-full text-left rounded-md \${
                              isActive('/resident/notifications') 
                                ? 'text-indigo-700 bg-indigo-50' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            Notifications
                            {unreadCount > 0 && (
                              <span className="ml-auto flex justify-center items-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                                {unreadCount}
                              </span>
                            )}
                          </button>
                        </>
                      )}
                      
                      {user.role === 'admin' && (
                        <>
                          <button
                            onClick={() => {
                              router.push('/admin/dashboard');
                              setShowMobileMenu(false);
                            }}
                            className={`flex items-center px-4 py-3 w-full text-left rounded-md \${
                              isActive('/admin/dashboard') 
                                ? 'text-orange-700 bg-orange-50' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Dashboard
                          </button>
                          <button
                            onClick={() => {
                              router.push('/admin/issues');
                              setShowMobileMenu(false);
                            }}
                            className={`flex items-center px-4 py-3 w-full text-left rounded-md \${
                              isActive('/admin/issues') 
                                ? 'text-orange-700 bg-orange-50' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            All Issues
                          </button>
                          <button
                            onClick={() => {
                              router.push('/admin/residents');
                              setShowMobileMenu(false);
                            }}
                            className={`flex items-center px-4 py-3 w-full text-left rounded-md \${
                              isActive('/admin/residents') 
                                ? 'text-orange-700 bg-orange-50' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Residents
                          </button>
                          <button
                            onClick={() => {
                              router.push('/admin/analytics');
                              setShowMobileMenu(false);
                            }}
                            className={`flex items-center px-4 py-3 w-full text-left rounded-md \${
                              isActive('/admin/analytics') 
                                ? 'text-orange-700 bg-orange-50' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Analytics
                          </button>
                          <button
                            onClick={() => {
                              router.push('/admin/events');
                              setShowMobileMenu(false);
                            }}
                            className={`flex items-center px-4 py-3 w-full text-left rounded-md \${
                              isActive('/admin/events') 
                                ? 'text-orange-700 bg-orange-50' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Events
                          </button>
                          <button
                            onClick={() => {
                              router.push('/admin/announcements');
                              setShowMobileMenu(false);
                            }}
                            className={`flex items-center px-4 py-3 w-full text-left rounded-md \${
                              isActive('/admin/announcements') 
                                ? 'text-orange-700 bg-orange-50' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                            Announcements
                          </button>
                          <button
                            onClick={() => {
                              router.push('/admin/notifications');
                              setShowMobileMenu(false);
                            }}
                            className={`flex items-center px-4 py-3 w-full text-left rounded-md \${
                              isActive('/admin/notifications') 
                                ? 'text-orange-700 bg-orange-50' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            Notifications
                          </button>
                        </>
                      )}
                      
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <button
                          onClick={() => {
                            router.push('/profile');
                            setShowMobileMenu(false);
                          }}
                          className="flex items-center px-4 py-3 w-full text-left text-gray-700 hover:bg-gray-50 rounded-md"
                        >
                          <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile Settings
                        </button>
                        <button
                          onClick={() => {
                            router.push('/settings');
                            setShowMobileMenu(false);
                          }}
                          className="flex items-center px-4 py-3 w-full text-left text-gray-700 hover:bg-gray-50 rounded-md"
                        >
                          <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-
                            3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Preferences
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowMobileMenu(false);
                        }}
                        className="flex items-center px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        router.push('/');
                        setShowMobileMenu(false);
                      }}
                      className={`flex items-center px-4 py-3 w-full text-left rounded-md ${
                        isActive('/') 
                          ? 'text-indigo-700 bg-indigo-50' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Home
                    </button>
                    <button
                      onClick={() => {
                        router.push('/about');
                        setShowMobileMenu(false);
                      }}
                      className={`flex items-center px-4 py-3 w-full text-left rounded-md ${
                        isActive('/about') 
                          ? 'text-indigo-700 bg-indigo-50' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      About
                    </button>
                    <button
                      onClick={() => {
                        router.push('/contact');
                        setShowMobileMenu(false);
                      }}
                      className={`flex items-center px-4 py-3 w-full text-left rounded-md ${
                        isActive('/contact') 
                          ? 'text-indigo-700 bg-indigo-50' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Contact
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

