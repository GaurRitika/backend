import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import { issueAPI, apiUtils } from '../../utils/api';

interface AnalyticsData {
  totalIssues: number;
  pendingIssues: number;
  resolvedIssues: number;
  inProgressIssues: number;
  rejectedIssues: number;
  avgResolutionTime: number;
  categoryBreakdown: {
    [key: string]: number;
  };
  monthlyTrends: {
    [key: string]: number;
  };
  priorityDistribution: {
    [key: string]: number;
  };
  topResidents: Array<{
    name: string;
    issueCount: number;
  }>;
}

export default function AdminAnalytics() {
  const [user, setUser] = useState<any>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('30d');
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
      fetchAnalytics();
    };

    checkAuth();
  }, [router, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Mock analytics data - in real app, this would come from API
      const mockData: AnalyticsData = {
        totalIssues: 156,
        pendingIssues: 23,
        resolvedIssues: 98,
        inProgressIssues: 28,
        rejectedIssues: 7,
        avgResolutionTime: 3.2,
        categoryBreakdown: {
          maintenance: 45,
          security: 12,
          noise: 18,
          utilities: 25,
          cleaning: 22,
          parking: 14,
          general: 20
        },
        monthlyTrends: {
          'Jan': 12,
          'Feb': 15,
          'Mar': 18,
          'Apr': 22,
          'May': 25,
          'Jun': 28,
          'Jul': 24,
          'Aug': 20,
          'Sep': 18,
          'Oct': 15,
          'Nov': 12,
          'Dec': 10
        },
        priorityDistribution: {
          urgent: 8,
          high: 25,
          medium: 89,
          low: 34
        },
        topResidents: [
          { name: 'Sarah Johnson', issueCount: 12 },
          { name: 'Mike Chen', issueCount: 9 },
          { name: 'Emily Davis', issueCount: 8 },
          { name: 'David Wilson', issueCount: 7 },
          { name: 'Lisa Brown', issueCount: 6 }
        ]
      };
      
      setAnalytics(mockData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'in-progress': return 'bg-blue-500';
      case 'resolved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive insights into community issues and performance</p>
          </div>

          {/* Time Range Selector */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Time Range:</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  aria-label="Select time range for analytics"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : analytics ? (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Issues</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.totalIssues}</p>
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
                      <p className="text-2xl font-bold text-gray-900">{analytics.resolvedIssues}</p>
                      <p className="text-xs text-green-600">+{Math.round((analytics.resolvedIssues / analytics.totalIssues) * 100)}%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg Resolution</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.avgResolutionTime} days</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.pendingIssues}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Breakdown */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues by Category</h3>
                  <div className="space-y-3">
                    {Object.entries(analytics.categoryBreakdown).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-indigo-500 rounded-full mr-3"></div>
                          <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-indigo-500 h-2 rounded-full" 
                              style={{ width: `${(count / analytics.totalIssues) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Priority Distribution */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
                  <div className="space-y-3">
                    {Object.entries(analytics.priorityDistribution).map(([priority, count]) => (
                      <div key={priority} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${getPriorityColor(priority)}`}></div>
                          <span className="text-sm font-medium text-gray-700 capitalize">{priority}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getPriorityColor(priority)}`}
                              style={{ width: `${(count / analytics.totalIssues) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Monthly Trends */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Issue Trends</h3>
                <div className="flex items-end space-x-2 h-32">
                  {Object.entries(analytics.monthlyTrends).map(([month, count]) => (
                    <div key={month} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-indigo-500 rounded-t"
                        style={{ height: `${(count / Math.max(...Object.values(analytics.monthlyTrends))) * 100}%` }}
                      ></div>
                      <span className="text-xs text-gray-600 mt-2">{month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Residents */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Residents by Issue Count</h3>
                <div className="space-y-3">
                  {analytics.topResidents.map((resident, index) => (
                    <div key={resident.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{resident.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">{resident.issueCount} issues</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Resolution Rate</span>
                      <span className="text-sm font-medium text-green-600">
                        {Math.round((analytics.resolvedIssues / analytics.totalIssues) * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rejection Rate</span>
                      <span className="text-sm font-medium text-red-600">
                        {Math.round((analytics.rejectedIssues / analytics.totalIssues) * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Avg Response Time</span>
                      <span className="text-sm font-medium text-blue-600">2.1 hours</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
                      Export Analytics Report
                    </button>
                    <button className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                      Generate Monthly Summary
                    </button>
                    <button className="w-full text-left p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                      Send Performance Alert
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
} 