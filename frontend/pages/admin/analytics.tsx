import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import { analyticsAPI, apiUtils } from '../../utils/api';

interface AnalyticsData {
  overview: {
    totalIssues: number;
    pendingIssues: number;
    resolvedIssues: number;
    inProgressIssues: number;
    rejectedIssues: number;
    avgResolutionTime: number;
    resolutionRate: string;
  };
  categoryBreakdown: Array<{
    _id: string;
    count: number;
  }>;
  priorityDistribution: Array<{
    _id: string;
    count: number;
  }>;
  monthlyTrends: Array<{
    _id: {
      year: number;
      month: number;
    };
    count: number;
    resolved: number;
  }>;
  topResidents: Array<{
    _id: string;
    name: string;
    email: string;
    issueCount: number;
    resolvedCount: number;
  }>;
  statusTimeline: Array<{
    _id: {
      date: string;
      status: string;
    };
    count: number;
  }>;
  responseTime: {
    avgResponseTime: number;
    minResponseTime: number;
    maxResponseTime: number;
  };
  dateRange: {
    start: string;
    end: string;
  };
}

export default function AdminAnalytics() {
  // Remove user, only use setUser if you don't need user in render
  const [, setUser] = useState<{ name: string; role: string } | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('30d');
  const router = useRouter();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Calculate date range based on timeRange
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(endDate.getDate() - 30);
      }
      
      const response = await analyticsAPI.getAnalytics({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });
      
      setAnalytics(response);
    } catch (err: unknown) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  if (!analytics) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
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
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalIssues}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview.resolvedIssues}</p>
                  <p className="text-xs text-green-600">+{analytics.overview.resolutionRate}%</p>
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
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview.avgResolutionTime} days</p>
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
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview.pendingIssues}</p>
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
                {analytics.categoryBreakdown.map((category) => (
                  <div key={category._id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-700 capitalize">{category._id}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-500 h-2 rounded-full" 
                          style={{ width: `${(category.count / analytics.overview.totalIssues) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">{category.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
              <div className="space-y-3">
                {analytics.priorityDistribution.map((priority) => (
                  <div key={priority._id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${getPriorityColor(priority._id)}`}></div>
                      <span className="text-sm font-medium text-gray-700 capitalize">{priority._id}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getPriorityColor(priority._id)}`}
                          style={{ width: `${(priority.count / analytics.overview.totalIssues) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">{priority.count}</span>
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
              {analytics.monthlyTrends.map((trend) => {
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const monthName = monthNames[trend._id.month - 1];
                const maxCount = Math.max(...analytics.monthlyTrends.map(t => t.count));
                
                return (
                  <div key={`${trend._id.year}-${trend._id.month}`} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-indigo-500 rounded-t"
                      style={{ height: `${(trend.count / maxCount) * 100}%` }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">{monthName}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Residents */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Residents by Issue Count</h3>
            <div className="space-y-3">
              {analytics.topResidents.map((resident, index) => (
                <div key={resident._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{resident.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{resident.issueCount} issues ({resident.resolvedCount} resolved)</span>
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
                    {analytics.overview.resolutionRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rejection Rate</span>
                  <span className="text-sm font-medium text-red-600">
                    {Math.round((analytics.overview.rejectedIssues / analytics.overview.totalIssues) * 100)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Response Time</span>
                  <span className="text-sm font-medium text-blue-600">
                    {analytics.responseTime.avgResponseTime.toFixed(1)} days
                  </span>
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
      </div>
    </>
  );
} 
