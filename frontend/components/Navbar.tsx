import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiUtils, notificationAPI } from '../utils/api';

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ message: string; time: string }>>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const userInfo = apiUtils.getUserFromToken();
    setUser(userInfo);
    
    // Fetch notifications if user is authenticated
    if (userInfo) {
      fetchNotifications();
    }
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
    <nav className="bg-white border-b border-gray-200 shadow-lg">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div 
              onClick={() => router.push('/')}
              className="flex items-center cursor-pointer"
            >
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">SheBuilds</h1>
                <p className="text-xs text-gray-500">Community Support</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden items-center space-x-8 md:flex">
            {user ? (
              <>
                {user.role === 'resident' && (
                  <>
                    <button
                      onClick={() => router.push('/resident/dashboard')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/resident/dashboard') 
                          ? 'text-indigo-700 bg-indigo-100' 
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => router.push('/resident/issues')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/resident/issues') 
                          ? 'text-indigo-700 bg-indigo-100' 
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      My Issues
                    </button>
                    <button
                      onClick={() => router.push('/resident/community')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/resident/community') 
                          ? 'text-indigo-700 bg-indigo-100' 
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      Community
                    </button>
                    <button
                      onClick={() => router.push('/resident/events')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/resident/events') 
                          ? 'text-indigo-700 bg-indigo-100' 
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      Events
                    </button>
                    <button
                      onClick={() => router.push('/resident/announcements')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/resident/announcements') 
                          ? 'text-indigo-700 bg-indigo-100' 
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      Announcements
                    </button>
                    <button
                      onClick={() => router.push('/resident/notifications')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/resident/notifications') 
                          ? 'text-indigo-700 bg-indigo-100' 
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      Notifications
                      {unreadCount > 0 && (
                        <span className="flex justify-center items-center ml-1 w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  </>
                )}
                {user.role === 'admin' && (
                  <>
                    <button
                      onClick={() => router.push('/admin/dashboard')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/admin/dashboard') 
                          ? 'text-orange-700 bg-orange-100' 
                          : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                    >
              Dashboard
                    </button>
                    <button
                      onClick={() => router.push('/admin/issues')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/admin/issues') 
                          ? 'text-orange-700 bg-orange-100' 
                          : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      All Issues
                    </button>
                    <button
                      onClick={() => router.push('/admin/residents')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/admin/residents') 
                          ? 'text-orange-700 bg-orange-100' 
                          : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      Residents
                    </button>
                    <button
                      onClick={() => router.push('/admin/analytics')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/admin/analytics') 
                          ? 'text-orange-700 bg-orange-100' 
                          : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      Analytics
                    </button>
                    <button
                      onClick={() => router.push('/admin/events')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/admin/events') 
                          ? 'text-orange-700 bg-orange-100' 
                          : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      Events
                    </button>
                    <button
                      onClick={() => router.push('/admin/announcements')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/admin/announcements') 
                          ? 'text-orange-700 bg-orange-100' 
                          : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      Announcements
                    </button>
                    <button
                      onClick={() => router.push('/admin/notifications')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${ isActive('/admin/notifications') 
                          ? 'text-orange-700 bg-orange-100' 
                          : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      Notifications
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/')}
                  className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md transition-colors hover:text-indigo-600 hover:bg-indigo-50"
                >
                  Home
                </button>
                <button
                  onClick={() => router.push('/about')}
                  className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md transition-colors hover:text-indigo-600 hover:bg-indigo-50"
                >
                  About
                </button>
                <button
                  onClick={() => router.push('/contact')}
                  className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md transition-colors hover:text-indigo-600 hover:bg-indigo-50"
                >
                  Contact
                </button>
              </>
            )}
          </div>

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:text-indigo-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 00-6 6v3.75l-2.25 2.25V19.5h12.5V15.75L16.5 13.5V9.75a6 6 0 00-6-6z" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="flex absolute -top-1 -right-1 justify-center items-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 z-50 mt-2 w-80 bg-white rounded-lg border border-gray-200 shadow-lg">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="overflow-y-auto max-h-64">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            No new notifications
                          </div>
                        ) : (
                          <>
                            {notifications.map((notification, index) => (
                              <div key={index} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                                <p className="text-sm text-gray-900">{notification.message}</p>
                                <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
                              </div>
                            ))}
                            <div className="p-4 border-t border-gray-200">
                              <button
                                onClick={() => {
                                  router.push(user?.role === 'admin' ? '/admin/notifications' : '/resident/notifications');
                                  setShowNotifications(false);
                                }}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                              >
                                View all notifications →
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center p-2 space-x-2 rounded-lg transition-colors hover:bg-gray-100"
                  >
                    <div className="flex justify-center items-center w-8 h-8 bg-indigo-600 rounded-full">
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
                    <div className="absolute right-0 z-50 mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            router.push('/profile');
                            setShowProfileDropdown(false);
                          }}
                          className="block px-4 py-2 w-full text-sm text-left text-gray-700 hover:bg-gray-100"
                        >
                          Profile Settings
                        </button>
                        <button
                          onClick={() => {
                            router.push('/settings');
                            setShowProfileDropdown(false);
                          }}
                          className="block px-4 py-2 w-full text-sm text-left text-gray-700 hover:bg-gray-100"
                        >
                          Preferences
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="block px-4 py-2 w-full text-sm text-left text-red-600 hover:bg-red-50"
                        >
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
                  className="font-medium text-gray-700 hover:text-indigo-600"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push('/resident/signup')}
                  className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-lg transition-colors hover:bg-indigo-700"
                >
                  Sign Up
            </button>
          </div>
        )}
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button 
          className="text-gray-700 hover:text-indigo-600"
          aria-label="Toggle mobile menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
} 