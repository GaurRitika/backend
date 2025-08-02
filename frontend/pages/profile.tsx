import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { apiUtils } from '../utils/api';
import { PrimaryButton } from '../components/EnhancedButton';
import { LuxuryCard, PremiumCard } from '../components/EnhancedCard';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  apartment?: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'auto';
    timezone: string;
  };
}

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    apartment: '',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    preferences: {
      language: 'en',
      theme: 'light',
      timezone: 'UTC'
    }
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    const checkAuth = () => {
      if (!apiUtils.isAuthenticated()) {
        router.push('/');
        return;
      }

      const userInfo = apiUtils.getUserFromToken();
      setUser(userInfo);
      
      // Load user profile data
      if (userInfo) {
        setProfile({
          name: userInfo.name || '',
          email: userInfo.email || '',
          phone: userInfo.phone || '',
          apartment: userInfo.apartment || '',
          notifications: {
            email: true,
            push: true,
            sms: false
          },
          preferences: {
            language: 'en',
            theme: 'light',
            timezone: 'UTC'
          }
        });
      }
    };

    checkAuth();
  }, [router]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // In real app, this would call API to update profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSuccess('Profile updated successfully!');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // In real app, this would call API to change password
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSuccess('Password changed successfully!');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  if (!mounted || !user) return null;

  return (
    <>
      <Navbar />
      
      {/* Ultra-Premium Background */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/70 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-gradient-to-br from-primary-400/10 to-secondary-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-gradient-to-br from-secondary-400/10 to-luxury-400/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-gradient-to-br from-luxury-400/8 to-primary-400/8 rounded-full blur-2xl animate-pulse-gentle"></div>
        
        <div className="relative z-10 px-6 py-12 mx-auto max-w-6xl sm:px-8 lg:px-10">
          {/* Ultra-Premium Header */}
          <div className="mb-16 text-center animate-fade-in-up">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-luxury animate-glow">
              <span className="text-white font-bold text-4xl">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-display font-black text-gradient-luxury mb-4 text-shadow-luxury">Profile Settings</h1>
            <p className="text-2xl text-gray-600 font-medium">Manage your account with style and elegance</p>
          </div>

          {/* Ultra-Premium Tab Navigation */}
          <div className="mb-12 animate-fade-in-up animate-delay-200">
            <LuxuryCard className="p-0 overflow-hidden">
              <nav className="flex">
                <TabButton
                  active={activeTab === 'profile'}
                  onClick={() => setActiveTab('profile')}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                >
                  Profile
                </TabButton>
                <TabButton
                  active={activeTab === 'notifications'}
                  onClick={() => setActiveTab('notifications')}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-5 5v-5zM4.343 12.344l7.686 7.686m0 0l2.83-2.83m-2.83 2.83l-2.83-2.83m-7.686-7.686L14.657 4.86m-7.314 7.484l2.83-2.83m-2.83 2.83l7.686 7.686M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                >
                  Notifications
                </TabButton>
                <TabButton
                  active={activeTab === 'security'}
                  onClick={() => setActiveTab('security')}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                >
                  Security
                </TabButton>
              </nav>
            </LuxuryCard>
          </div>

          {/* Success/Error Messages */}
          {(success || error) && (
            <div className="mb-8 animate-fade-in">
              {success && (
                <div className="p-6 bg-gradient-to-r from-success-50 to-success-100 border-2 border-success-200 rounded-3xl shadow-luxury">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-success-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-success-800 font-semibold text-lg">{success}</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="p-6 bg-gradient-to-r from-error-50 to-error-100 border-2 border-error-200 rounded-3xl shadow-luxury">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-error-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-error-800 font-semibold text-lg">{error}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab Content */}
          <div className="animate-fade-in-up animate-delay-400">
            {activeTab === 'profile' && (
              <PremiumCard size="xl">
                <h2 className="text-4xl font-display font-bold text-gray-900 mb-8 flex items-center">
                  <svg className="w-8 h-8 text-primary-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personal Information
                </h2>
                
                <form onSubmit={handleProfileUpdate} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-lg font-bold text-gray-900 mb-3">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="input-luxury"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-gray-900 mb-3">Email Address</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="input-luxury"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-gray-900 mb-3">Phone Number</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="input-luxury"
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-gray-900 mb-3">Apartment Number</label>
                      <input
                        type="text"
                        value={profile.apartment}
                        onChange={(e) => setProfile({ ...profile, apartment: e.target.value })}
                        className="input-luxury"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <PrimaryButton
                      loading={saving}
                      size="lg"
                      className="px-12"
                    >
                      Update Profile
                    </PrimaryButton>
                  </div>
                </form>
              </PremiumCard>
            )}

            {activeTab === 'notifications' && (
              <PremiumCard size="xl">
                <h2 className="text-4xl font-display font-bold text-gray-900 mb-8 flex items-center">
                  <svg className="w-8 h-8 text-primary-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-5 5v-5zM4.343 12.344l7.686 7.686m0 0l2.83-2.83m-2.83 2.83l-2.83-2.83m-7.686-7.686L14.657 4.86m-7.314 7.484l2.83-2.83m-2.83 2.83l7.686 7.686M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Notification Preferences
                </h2>
                
                <div className="space-y-8">
                  <NotificationToggle
                    title="Email Notifications"
                    description="Receive updates and alerts via email"
                    checked={profile.notifications.email}
                    onChange={(checked) => setProfile({
                      ...profile,
                      notifications: { ...profile.notifications, email: checked }
                    })}
                    icon={
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    }
                  />
                  
                  <NotificationToggle
                    title="Push Notifications"
                    description="Receive real-time notifications on your device"
                    checked={profile.notifications.push}
                    onChange={(checked) => setProfile({
                      ...profile,
                      notifications: { ...profile.notifications, push: checked }
                    })}
                    icon={
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    }
                  />
                  
                  <NotificationToggle
                    title="SMS Notifications"
                    description="Receive important alerts via text message"
                    checked={profile.notifications.sms}
                    onChange={(checked) => setProfile({
                      ...profile,
                      notifications: { ...profile.notifications, sms: checked }
                    })}
                    icon={
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    }
                  />
                </div>
                
                <div className="flex justify-end mt-8">
                  <PrimaryButton
                    onClick={() => handleProfileUpdate({ preventDefault: () => {} } as React.FormEvent)}
                    loading={saving}
                    size="lg"
                    className="px-12"
                  >
                    Save Preferences
                  </PrimaryButton>
                </div>
              </PremiumCard>
            )}

            {activeTab === 'security' && (
              <PremiumCard size="xl">
                <h2 className="text-4xl font-display font-bold text-gray-900 mb-8 flex items-center">
                  <svg className="w-8 h-8 text-primary-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Security Settings
                </h2>
                
                <form onSubmit={handlePasswordChange} className="space-y-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-bold text-gray-900 mb-3">Current Password</label>
                      <input
                        type="password"
                        className="input-luxury"
                        placeholder="Enter your current password"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-gray-900 mb-3">New Password</label>
                      <input
                        type="password"
                        className="input-luxury"
                        placeholder="Enter your new password"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-gray-900 mb-3">Confirm New Password</label>
                      <input
                        type="password"
                        className="input-luxury"
                        placeholder="Confirm your new password"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <PrimaryButton
                      loading={saving}
                      size="lg"
                      className="px-12"
                    >
                      Change Password
                    </PrimaryButton>
                  </div>
                </form>
              </PremiumCard>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Ultra-Premium Tab Button Component
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function TabButton({ active, onClick, icon, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center px-8 py-6 text-lg font-bold transition-all duration-500 hover-lift relative overflow-hidden group ${
        active
          ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-700 border-b-4 border-primary-500'
          : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50/30'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <span className="mr-3 relative z-10 transition-transform duration-300 group-hover:scale-110">{icon}</span>
      <span className="relative z-10">{children}</span>
    </button>
  );
}

// Ultra-Premium Notification Toggle Component
interface NotificationToggleProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon: React.ReactNode;
}

function NotificationToggle({ title, description, checked, onChange, icon }: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between p-6 glass-card rounded-3xl hover:shadow-luxury transition-all duration-500 hover-lift">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-2xl flex items-center justify-center mr-6">
          <span className="text-primary-600">{icon}</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-gray-600 font-medium">{description}</p>
        </div>
      </div>
      
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-16 h-8 rounded-full transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-primary-500/30 ${
          checked ? 'bg-gradient-to-r from-primary-500 to-primary-600' : 'bg-gray-300'
        }`}
      >
        <div
          className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-500 ${
            checked ? 'transform translate-x-8' : 'transform translate-x-1'
          }`}
        />
      </button>
    </div>
  );
} 