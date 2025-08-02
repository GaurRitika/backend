import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { announcementAPI } from '../../utils/api';
import { apiUtils } from '../../utils/api';
import Navbar from '../../components/Navbar';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  author: { _id: string; name: string; email: string };
  priority: string;
  category: string;
  targetAudience: string;
  isActive: boolean;
  publishAt: string;
  expiresAt?: string;
  attachments: string[];
  readBy: string[];
  createdAt: string;
}

interface AnnouncementsResponse {
  announcements: Announcement[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const ResidentAnnouncements: React.FC = () => {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    isActive: true
  });

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

      fetchAnnouncements();
    };

    checkAuth();
  }, [router, filters, activeTab]);

  const fetchAnnouncements = async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: 12, isActive: true };
      // Remove any userId or role filter
      const data = await announcementAPI.getAnnouncements(params);
      setAnnouncements(Array.isArray(data.announcements) ? data.announcements : []);
      setPagination(data.pagination || { currentPage: 1, totalPages: 1, totalItems: 0, hasNextPage: false, hasPrevPage: false });
      setError(null);
    } catch {
      setError('Failed to fetch announcements');
      setAnnouncements([]);
      setPagination({ currentPage: 1, totalPages: 1, totalItems: 0, hasNextPage: false, hasPrevPage: false });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (announcementId: string) => {
    try {
      await announcementAPI.markAsRead(announcementId);
      // Update local state
      setAnnouncements(prev => 
        prev.map(announcement => 
          announcement._id === announcementId 
            ? { ...announcement, readBy: [...announcement.readBy, apiUtils.getUserFromToken()?.id || ''] }
            : announcement
        )
      );
    } catch (err) {
      console.error('Error marking announcement as read:', err);
    }
  };

  const isReadByUser = (announcement: Announcement) => {
    const userInfo = apiUtils.getUserFromToken();
    return announcement.readBy.includes(userInfo?.id || '');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800',
      'urgent': 'bg-red-200 text-red-900'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  if (loading && announcements.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Announcements</h1>
          <p className="text-gray-600">Stay updated with important community news and updates</p>
        </div>

        {/* Filters and Tabs */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Announcements
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'unread'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Unread Only
            </button>
          </div>

          {activeTab === 'all' && (
            <div className="flex space-x-4">
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                aria-label="Filter announcements by category"
              >
                <option value="">All Categories</option>
                <option value="general">General</option>
                <option value="maintenance">Maintenance</option>
                <option value="security">Security</option>
                <option value="events">Events</option>
                <option value="emergency">Emergency</option>
              </select>
              <select
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                aria-label="Filter announcements by priority"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div 
              key={announcement._id} 
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 transition-all hover:shadow-lg ${
                isReadByUser(announcement) 
                  ? 'border-gray-300 opacity-75' 
                  : 'border-indigo-500'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {announcement.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                      {announcement.priority}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {announcement.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {announcement.author.name}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(announcement.publishAt)}
                    </div>
                    {announcement.expiresAt && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Expires: {formatDate(announcement.expiresAt)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!isReadByUser(announcement) && (
                    <button
                      onClick={() => handleMarkAsRead(announcement._id)}
                      className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Mark as Read
                    </button>
                  )}
                  <div className={`w-2 h-2 rounded-full ${
                    isReadByUser(announcement) ? 'bg-gray-300' : 'bg-indigo-500'
                  }`}></div>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {announcement.content}
                </p>
              </div>

              {announcement.attachments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Attachments:</h4>
                  <div className="flex flex-wrap gap-2">
                    {announcement.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Attachment {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {announcement.targetAudience && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    Target Audience: {announcement.targetAudience}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {announcements.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {activeTab === 'all' ? 'No announcements found' : 'No unread announcements'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'all' 
                ? 'Check back later for new announcements.'
                : 'All announcements have been read!'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => fetchAnnouncements(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="px-3 py-2 text-sm text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => fetchAnnouncements(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidentAnnouncements; 
