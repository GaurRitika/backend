import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { eventAPI } from '../../utils/api';
import { apiUtils } from '../../utils/api';
import Navbar from '../../components/Navbar';

interface Event {
  _id: string;
  title: string;
  description: string;
  organizer: { _id: string; name: string; email: string };
  startDate: string;
  endDate: string;
  location: string;
  maxAttendees: number;
  attendees: Array<{ _id: string; name: string; email: string }>;
  category: string;
  isPublic: boolean;
  isActive: boolean;
  imageUrl?: string;
  tags: string[];
  createdAt: string;
}

interface EventsResponse {
  events: Event[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const ResidentEvents: React.FC = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'my-events'>('all');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [filters, setFilters] = useState({
    category: '',
    upcoming: true
  });

  useEffect(() => {
    const checkAuth = () => {
      if (!apiUtils.isAuthenticated()) {
        router.push('/resident/login');
        return;
      }
      fetchEvents();
      fetchMyEvents();
    };

    checkAuth();
  }, [router, filters]);

  const fetchEvents = async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: 12, isActive: true };
      // Remove any userId or role filter
      const data = await eventAPI.getEvents(params);
      setEvents(Array.isArray(data.events) ? data.events : []);
      setPagination(data.pagination || { currentPage: 1, totalPages: 1, totalItems: 0, hasNextPage: false, hasPrevPage: false });
      setError(null);
    } catch {
      setError('Failed to fetch events');
      setEvents([]);
      setPagination({ currentPage: 1, totalPages: 1, totalItems: 0, hasNextPage: false, hasPrevPage: false });
    } finally {
      setLoading(false);
    }
  };

  const fetchMyEvents = async () => {
    try {
      const data = await eventAPI.getMyEvents();
      setMyEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching my events:', err);
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    try {
      await eventAPI.joinEvent(eventId);
      // Refresh both lists
      fetchEvents();
      fetchMyEvents();
    } catch (err) {
      alert('Failed to join event');
      console.error('Error joining event:', err);
    }
  };

  const handleLeaveEvent = async (eventId: string) => {
    try {
      await eventAPI.leaveEvent(eventId);
      // Refresh both lists
      fetchEvents();
      fetchMyEvents();
    } catch (err) {
      alert('Failed to leave event');
      console.error('Error leaving event:', err);
    }
  };

  const isUserAttending = (event: Event) => {
    const userInfo = apiUtils.getUserFromToken();
    return event.attendees.some(attendee => attendee._id === userInfo?.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'social': 'bg-blue-100 text-blue-800',
      'educational': 'bg-green-100 text-green-800',
      'sports': 'bg-orange-100 text-orange-800',
      'cultural': 'bg-purple-100 text-purple-800',
      'business': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Events</h1>
          <p className="text-gray-600">Discover and join exciting community events</p>
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
              All Events
            </button>
            <button
              onClick={() => setActiveTab('my-events')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'my-events'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              My Events
            </button>
          </div>

          {activeTab === 'all' && (
            <div className="flex space-x-4">
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                aria-label="Filter events by category"
              >
                <option value="">All Categories</option>
                <option value="social">Social</option>
                <option value="educational">Educational</option>
                <option value="sports">Sports</option>
                <option value="cultural">Cultural</option>
                <option value="business">Business</option>
              </select>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.upcoming}
                  onChange={(e) => setFilters(prev => ({ ...prev, upcoming: e.target.checked }))}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Upcoming only</span>
              </label>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === 'all' ? events : myEvents).map((event) => (
            <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {event.imageUrl && (
                <div className="h-48 bg-gray-200">
                  <img
                    src={event.imageUrl}
                    alt={`Event image for ${event.title}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {event.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(event.startDate)}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    {event.attendees.length}/{event.maxAttendees} attendees
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Organized by {event.organizer.name}
                  </div>
                  
                  {activeTab === 'all' && (
                    <button
                      onClick={() => isUserAttending(event) ? handleLeaveEvent(event._id) : handleJoinEvent(event._id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isUserAttending(event)
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {isUserAttending(event) ? 'Leave' : 'Join'}
                    </button>
                  )}
                </div>

                {event.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(activeTab === 'all' ? events : myEvents).length === 0 && !loading && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {activeTab === 'all' ? 'No events found' : 'You haven&apos;t joined any events yet'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'all' 
                ? 'Try adjusting your filters or check back later for new events.'
                : 'Browse all events to find something that interests you!'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {activeTab === 'all' && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => fetchEvents(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="px-3 py-2 text-sm text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => fetchEvents(pagination.currentPage + 1)}
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

export default ResidentEvents; 
