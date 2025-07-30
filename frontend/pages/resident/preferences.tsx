import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { preferencesAPI, apiUtils } from '../../utils/api';
import { useRouter } from 'next/router';

export default function ResidentPreferences() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [preferences, setPreferences] = useState<{
    notifications: { email: boolean; sms: boolean; push: boolean };
    theme: string;
  }>({
    notifications: { email: true, sms: false, push: false },
    theme: 'light',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const fetchPreferences = async () => {
    setError('');
    try {
      const res = await preferencesAPI.getPreferences('resident');
      setPreferences(res.preferences || preferences);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load preferences');
    }
  };

  useEffect(() => {
    if (!apiUtils.isAuthenticated()) {
      router.push('/resident/login');
      return;
    }
    const userInfo = apiUtils.getUserFromToken();
    if (userInfo?.role !== 'resident') {
      router.push('/resident/login');
      return;
    }
    setUser(userInfo);
    fetchPreferences();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await preferencesAPI.updatePreferences('resident', preferences);
      setSuccess('Preferences updated successfully!');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex justify-center items-start py-12">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Preferences</h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Notifications</h3>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={preferences.notifications.email}
                    onChange={e => setPreferences({ ...preferences, notifications: { ...preferences.notifications, email: e.target.checked } })}
                  />
                  Email Notifications
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={preferences.notifications.sms}
                    onChange={e => setPreferences({ ...preferences, notifications: { ...preferences.notifications, sms: e.target.checked } })}
                  />
                  SMS Notifications
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={preferences.notifications.push}
                    onChange={e => setPreferences({ ...preferences, notifications: { ...preferences.notifications, push: e.target.checked } })}
                  />
                  Push Notifications
                </label>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Theme</h3>
              <select
                value={preferences.theme}
                onChange={e => setPreferences({ ...preferences, theme: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                aria-label="Select theme preference"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{success}</div>}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}