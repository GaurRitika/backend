import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import { issueAPI, apiUtils } from '../../utils/api';

interface Issue {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  priority: string;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
   source?: 'web' | 'voice_call';
  voiceCallData?: {
    callId?: string;
    phoneNumber?: string;
    callDuration?: number;
    conversationSummary?: string;
    issueType?: string;
    location?: string;
  };
  resident?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    isVoiceCallUser?: boolean;
  };
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function ResidentDashboard() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [showNewIssueForm, setShowNewIssueForm] = useState(false);
  const [newIssue, setNewIssue] = useState({ 
    title: '', 
    description: '', 
    category: 'general',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
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
      fetchMyIssues();
    };

    checkAuth();
  }, [router]);

  const fetchMyIssues = async () => {
    try {
      setFetching(true);
      const response = await issueAPI.getMyIssues();
      setIssues(response.issues || []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      if (errorMessage.includes('401') || errorMessage.includes('403')) {
        router.push('/resident/login');
      }
    } finally {
      setFetching(false);
    }
  };

  const handleNewIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await issueAPI.createIssue(newIssue);
      console.log('New issue created:', response);
      
      // Add the new issue to the beginning of the list
      if (response.issue) {
        setIssues(prevIssues => [response.issue, ...prevIssues]);
      }
      
      setNewIssue({ title: '', description: '', category: 'general', priority: 'medium' });
      setShowNewIssueForm(false);
      
      // Refresh the issues list to ensure everything is up to date
      setTimeout(() => {
        fetchMyIssues();
      }, 1000);
    } catch (err: unknown) {
      console.error('Error creating issue:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setNewIssue({ title: '', description: '', category: 'general', priority: 'medium' });
      setShowNewIssueForm(false);
    } 
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const safeIssues = Array.isArray(issues) ? issues : [];

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name || 'Resident'}!</h1>
            <p className="text-gray-600">Manage your community issues and track their progress</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Issues</p>
                  <p className="text-2xl font-bold text-gray-900">{safeIssues.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{safeIssues.filter(i => i.status === 'pending').length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{safeIssues.filter(i => i.status === 'in-progress').length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-gray-900">{safeIssues.filter(i => i.status === 'resolved').length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowNewIssueForm(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Raise New Issue
            </button>

            {/* Voice Support Button */}
            <button
              onClick={() => {
                // Load and initialize OmniDIM widget
                const script = document.createElement('script');
                script.id = 'omnidimension-web-widget';
                script.async = true;
                script.src = 'https://backend.omnidim.io/web_widget.js?secret_key=282035f2e410a1a69bd4e73bb8ade8bf';
                
                // Remove existing script if present
                const existingScript = document.getElementById('omnidimension-web-widget');
                if (existingScript) {
                  existingScript.remove();
                }
                
                document.head.appendChild(script);
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Voice Support
            </button>
          </div>

          

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Issues List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Your Issues</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {fetching ? (
                <div className="px-6 py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading your issues...</p>
                </div>
              ) : safeIssues.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No issues yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by raising your first issue.</p>
                </div>
              ) : (
                safeIssues.map((issue) => (
                  <div key={issue._id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{issue.title}</h3>
                          {issue.source === 'voice_call' && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              Voice Call
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                            {issue.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{issue.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Category: {issue.category}</span>
                          <span>Created: {new Date(issue.createdAt).toLocaleDateString()}</span>
                          {issue.assignedTo && (
                            <span>Assigned to: {issue.assignedTo.name}</span>
                           )}
                          {issue.voiceCallData?.location && (
                            <span>Location: {issue.voiceCallData.location}</span>
                          )}
                       </div>
                        {issue.voiceCallData?.conversationSummary && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <strong>Call Summary:</strong> {issue.voiceCallData.conversationSummary}
                            </p>
                          </div>
                        )}
                        {issue.adminNotes && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Admin Notes:</strong> {issue.adminNotes}
                            </p>
                          </div>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* New Issue Modal */}
        {showNewIssueForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Raise New Issue</h2>
              <form onSubmit={handleNewIssue} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newIssue.title}
                    onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Brief description of the issue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newIssue.description}
                    onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Detailed description of the issue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newIssue.category}
                    onChange={(e) => setNewIssue({...newIssue, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="general">General</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="security">Security</option>
                    <option value="noise">Noise Complaint</option>
                    <option value="utilities">Utilities</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="parking">Parking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newIssue.priority}
                    onChange={(e) => setNewIssue({...newIssue, priority: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Issue'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewIssueForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>  
    </>
  );
} 




