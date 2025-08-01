import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import ChatModal from '../../components/ChatModal';
import { apiUtils, eventAPI, announcementAPI, messageAPI } from '../../utils/api';

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

interface Resident {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function CommunityPage() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'announcements' | 'events' | 'members'>('announcements');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedResident, setSelectedResident] = useState<Resident | undefined>();
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
      fetchCommunityData();
    };
    checkAuth();
  }, [router]);

  const fetchCommunityData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch real data from APIs
      const [announcementsData, eventsData, residentsData] = await Promise.all([
        announcementAPI.getAnnouncements({ limit: 5, isActive: true }),
        eventAPI.getEvents({ limit: 5, isActive: true, upcoming: true }),
        messageAPI.getResidents()
      ]);
      
      setAnnouncements(Array.isArray(announcementsData.announcements) ? announcementsData.announcements : []);
      setEvents(Array.isArray(eventsData.events) ? eventsData.events : []);
      setResidents(Array.isArray(residentsData) ? residentsData : []);
    } catch (error) {
      setError('Error fetching community data');
      setAnnouncements([]);
      setEvents([]);
      setResidents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageResident = (resident: Resident) => {
    setSelectedResident(resident);
    setShowChatModal(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!user) return null;
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Hub</h1>
            <p className="text-gray-600">Stay connected with your neighbors and community updates</p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('announcements')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'announcements'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Announcements
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'events'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Events
                </button>
                <button
                  onClick={() => setActiveTab('members')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'members'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Community Members
                </button>
              </nav>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Announcements Tab */}
              {activeTab === 'announcements' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Latest Announcements</h2>
                    <button 
                      onClick={() => router.push('/resident/announcements')}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      View All
                    </button>
                  </div>
                  
                  <div className="grid gap-6">
                    {announcements.map((announcement) => (
                      <div key={announcement._id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{getPriorityIcon(announcement.priority)}</span>
                            <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                              {announcement.priority}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">{new Date(announcement.publishAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-700 mb-4">{announcement.content}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Posted by {announcement.author.name}</span>
                          <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                            Read More
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Events Tab */}
              {activeTab === 'events' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
                    <button 
                      onClick={() => router.push('/resident/events')}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      View All
                    </button>
                  </div>
                  
                  <div className="grid gap-6">
                    {events.map((event) => (
                      <div key={event._id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                            <p className="text-gray-700 mb-3">{event.description}</p>
                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {new Date(event.startDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {event.location}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600 mb-2">
                              {event.attendees.length}/{event.maxAttendees} attending
                            </div>
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                              Join Event
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Members Tab */}
              {activeTab === 'members' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Community Members</h2>
                    <div className="text-sm text-gray-600">
                      {residents.length} active members
                    </div>
                  </div>
                  
                  <div className="grid gap-4">
                    {residents.map((resident) => (
                      <div key={resident._id} className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold text-lg">{getInitials(resident.name)}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">{resident.name}</h3>
                            <p className="text-sm text-gray-600">Resident • Joined {new Date(resident.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600 mb-2">
                              {resident.email}
                            </div>
                            <button 
                              onClick={() => handleMessageResident(resident)}
                              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                            >
                              Message
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-12 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Report Issue</span>
              </button>
              <button 
                onClick={() => setShowChatModal(true)}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              >
                <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Community Chat</span>
              </button>
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">View Documents</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      <ChatModal
        isOpen={showChatModal}
        onClose={() => {
          setShowChatModal(false);
          setSelectedResident(undefined);
        }}
        selectedResident={selectedResident}
      />
    </>
  );
} 
