import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import { apiUtils } from '../../utils/api';

interface VoiceCall {
  _id: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
  voiceCallData: {
    callId: string;
    phoneNumber: string;
    callDuration: number;
    issueType: string;
    location: string;
  };
  resident: {
    name: string;
    phone: string;
  };
}

export default function VoiceCallsPage() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [voiceCalls, setVoiceCalls] = useState<VoiceCall[]>([]);
  const [stats, setStats] = useState<any>({
    totalVoiceCalls: 0,
    callsByCategory: {},
    callsByStatus: {},
    averageCallDuration: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (!apiUtils.isAuthenticated()) {
        router.push('/admin/login');
        return;
      }

      const userInfo = apiUtils.getUserFromToken();
      if (userInfo?.role !== 'admin') {
        router.push('/admin/login');
        return;
      }

      setUser(userInfo);
      fetchVoiceCallData();
    };

    checkAuth();
  }, [router]);

  const fetchVoiceCallData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/omnidim/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch voice call data');
      }
      
      const data = await response.json();
      setStats(data);
      setVoiceCalls(data.recentCalls || []);
    } catch (error) {
      console.error('Error fetching voice call data:', error);
      setError('Failed to fetch voice call data');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Voice Call Management</h1>
            <p className="text-gray-600">View and manage voice call interactions with residents</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Voice Calls</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalVoiceCalls}</p>
                </div>
              </div>
            </div>
            
            {Object.entries(stats.callsByCategory || {}).slice(0, 3).map(([category, count], index) => (
              <div key={category} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{category.charAt(0).toUpperCase() + category.slice(1)}</p>
                    <p className="text-2xl font-bold text-gray-900">{count as number}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Voice Calls List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Voice Calls</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="px-6 py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading voice calls...</p>
                </div>
              ) : voiceCalls.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No voice calls yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Start by initiating your first voice call.</p>
                </div>
              ) : (
                voiceCalls.map((call) => (
                  <div key={call._id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{call.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                            {call.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {call.voiceCallData?.location && `Location: ${call.voiceCallData.location}`}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Category: {call.category}</span>
                          <span>Created: {new Date(call.createdAt).toLocaleDateString()}</span>
                          <span>Duration: {formatDuration(call.voiceCallData?.callDuration || 0)}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Resident:</span> {call.resident?.name} • {call.voiceCallData?.phoneNumber}
                        </div>
                      </div>
                      <div>
                        <button 
                          onClick={() => router.push(`/admin/issues/${call._id}`)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
