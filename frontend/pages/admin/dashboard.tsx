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
    agentId?: string;
    phoneNumber?: string;
    callDuration?: number;
    conversationSummary?: string;
    extractedVariables?: any;
    issueType?: string;
    location?: string;
  };
  resident: {
    _id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
}

interface Stats {
  totalIssues: number;
  pendingIssues: number;
  resolvedIssues: number;
  inProgressIssues: number;
}

 


export default function AdminDashboard() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalIssues: 0,
    pendingIssues: 0,
    resolvedIssues: 0,
    inProgressIssues: 0
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: ''
  });
  const [showInitiateCallModal, setShowInitiateCallModal] = useState(false);
  const [callForm, setCallForm] = useState({ phone_number: '' });
  const [initiatingCall, setInitiatingCall] = useState(false);
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
      fetchAllData();
    };

    checkAuth();
  }, [router]);

  const fetchAllData = async () => {
    try {
      setFetching(true);
      const [issuesResponse, statsResponse] = await Promise.all([
        issueAPI.getAllIssues(filters),
        issueAPI.getIssueStats()
      ]);
      
      setIssues(issuesResponse.issues || []);
      setStats({
        totalIssues: statsResponse.totalIssues || 0,
        pendingIssues: statsResponse.pendingIssues || 0,
        resolvedIssues: statsResponse.resolvedIssues || 0,
        inProgressIssues: statsResponse.inProgressIssues || 0
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      if (errorMessage.includes('401') || errorMessage.includes('403')) {
        router.push('/admin/login');
      }
    } finally {
      setFetching(false);
    }
  };

  const updateIssueStatus = async (issueId: string, newStatus: string, adminNotes?: string) => {
    setLoading(true);
    try {
      const response = await issueAPI.updateIssueStatus(issueId, {
        status: newStatus,
        adminNotes
      });
      
      // Update the issue in the local state
      setIssues(issues.map(issue => 
        issue._id === issueId ? response.issue : issue
      ));
      
      // Refresh stats
      const statsResponse = await issueAPI.getIssueStats();
      setStats({
        totalIssues: statsResponse.totalIssues || 0,
        pendingIssues: statsResponse.pendingIssues || 0,
        resolvedIssues: statsResponse.resolvedIssues || 0,
        inProgressIssues: statsResponse.inProgressIssues || 0
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type: 'status' | 'category', value: string) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    
    // Fetch filtered data
    issueAPI.getAllIssues(newFilters)
      .then(response => setIssues(response.issues || []))
      .catch(err => setError(err.message));
  };

  const handleInitiateCall = async (e: React.FormEvent) => {
    e.preventDefault();
    setInitiatingCall(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/omnidim/initiate-call`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(callForm)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to initiate call');
      }
      
      alert('Call initiated successfully!');
      setShowInitiateCallModal(false);
      setCallForm({ phone_number: '' });
    } catch (error) {
      console.error('Error initiating call:', error);
      alert(`Failed to initiate call: \${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setInitiatingCall(false);
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'maintenance': return '🔧';
      case 'security': return '🔒';
      case 'noise': return '🔊';
      case 'utilities': return '⚡';
      case 'cleaning': return '🧹';
      case 'parking': return '🚗';
      default: return '📋';
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12 animate-fade-in">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-3xl flex items-center justify-center mr-6 shadow-glow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-xl text-gray-600">Welcome back, {user.name}! Manage your community with precision.</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="card hover-lift group animate-slide-up">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-6">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Issues</p>
                  <p className="text-3xl font-display font-bold text-gray-900">{stats.totalIssues}</p>
                </div>
              </div>
            </div>
            
            <div className="card hover-lift group animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-6">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Pending</p>
                  <p className="text-3xl font-display font-bold text-gray-900">{stats.pendingIssues}</p>
                </div>
              </div>
            </div>
            
            <div className="card hover-lift group animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-6">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">In Progress</p>
                  <p className="text-3xl font-display font-bold text-gray-900">{stats.inProgressIssues}</p>
                </div>
              </div>
            </div>
            
            <div className="card hover-lift group animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-6">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Resolved</p>
                  <p className="text-3xl font-display font-bold text-gray-900">{stats.resolvedIssues}</p>
                </div>
              </div>
            </div>
          </div>


           {/* Voice Call Controls */}
           <div className="card p-8 mb-12 hover-lift animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-900">Voice Support</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button
                onClick={() => setShowInitiateCallModal(true)}
                className="btn-primary text-lg py-4 hover-lift group"
              >
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Initiate Voice Call
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              
              <button
                onClick={() => router.push('/admin/voice-calls')}
                className="btn-ghost text-lg py-4 hover-lift group"
              >
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  View Call History
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="card p-8 mb-12 hover-lift animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-900">Filter Issues</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="input-luxury"
                  aria-label="Filter issues by status"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input-luxury"
                  aria-label="Filter issues by category"
                >
                  <option value="">All Categories</option>
                  <option value="general">General</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="security">Security</option>
                  <option value="noise">Noise</option>
                  <option value="utilities">Utilities</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="parking">Parking</option>
                </select>
              </div>
            </div>
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
              <h2 className="text-lg font-semibold text-gray-900">All Issues</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {fetching ? (
                <div className="px-6 py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading issues...</p>
                </div>
              ) : issues.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No issues found</h3>
                  <p className="mt-1 text-sm text-gray-500">No issues match your current filters.</p>
                </div>
              ) : (
                issues.map((issue) => (
                  <div key={issue._id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{getCategoryIcon(issue.category)}</span>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">{issue.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                            {issue.priority}
                          </span>
                        </div>
                        <div className="flex items-center mt-3 space-x-4 text-sm text-gray-500">
                          <span>By: {issue.resident.name}</span>
                          <span>Category: {issue.category}</span>
                          <span>Created: {new Date(issue.createdAt).toLocaleDateString()}</span>
                          {issue.source === 'voice_call' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              Voice Call
                            </span>
                          )}
                        </div>
                        {issue.adminNotes && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Admin Notes:</strong> {issue.adminNotes}
                            </p>
                          </div>
                        )}
                        {issue.source === 'voice_call' && issue.voiceCallData && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-800 font-medium mb-2">Voice Call Details:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
                              {issue.voiceCallData.phoneNumber && (
                                <div><strong>Phone:</strong> {issue.voiceCallData.phoneNumber}</div>
                              )}
                              {issue.voiceCallData.callDuration && (
                                <div><strong>Duration:</strong> {Math.round(issue.voiceCallData.callDuration / 60)}m</div>
                              )}
                              {issue.voiceCallData.location && (
                                <div><strong>Location:</strong> {issue.voiceCallData.location}</div>
                              )}
                              {issue.voiceCallData.issueType && (
                                <div><strong>Type:</strong> {issue.voiceCallData.issueType.replace(/_/g, ' ')}</div>
                              )}
                            </div>
                            {issue.voiceCallData.conversationSummary && (
                              <div className="mt-2">
                                <strong className="text-xs text-green-800">Summary:</strong>
                                <p className="text-xs text-green-700 mt-1">{issue.voiceCallData.conversationSummary}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                          {issue.status}
                        </span>
                        <select
                          value={issue.status}
                          onChange={(e) => updateIssueStatus(issue._id, e.target.value)}
                          disabled={loading}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          aria-label="Update issue status"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Initiate Call Modal */}
        {showInitiateCallModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Initiate Voice Call</h2>
              <form onSubmit={handleInitiateCall} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={callForm.phone_number}
                    onChange={(e) => setCallForm({...callForm, phone_number: e.target.value})}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="+1234567890"
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={initiatingCall}
                    className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
                  >
                    {initiatingCall ? 'Initiating...' : 'Start Call'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInitiateCallModal(false)}
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