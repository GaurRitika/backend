import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import { apiUtils, residentAPI } from '../../utils/api';

interface Resident {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  lastLogin?: string;
  issueCount: number;
  resolvedCount: number;
  resolutionRate: string;
  status: 'active' | 'inactive' | 'suspended';
}

export default function ResidentsPage() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddResident, setShowAddResident] = useState(false);
  const [newResident, setNewResident] = useState({
    name: '',
    email: '',
    password: ''
  });
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
      fetchResidents();
    };

    checkAuth();
  }, [router]);

  const fetchResidents = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await residentAPI.getAllResidents({
        status: statusFilter || undefined,
        search: searchTerm || undefined
      });
      
      setResidents(response.residents);
    } catch (error) {
      console.error('Error fetching residents:', error);
      setError('Failed to fetch residents');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🟢';
      case 'inactive': return '⚪';
      case 'suspended': return '🔴';
      default: return '⚪';
    }
  };

  // Refetch residents when filters change
  useEffect(() => {
    if (user) {
      fetchResidents();
    }
  }, [statusFilter, searchTerm, user]);

  const filteredResidents = residents;

  const handleAddResident = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await residentAPI.createResident(newResident);
      setShowAddResident(false);
      setNewResident({ name: '', email: '', password: '' });
      fetchResidents(); // Refresh the list
    } catch (error) {
      console.error('Error adding resident:', error);
      setError('Failed to add resident');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (residentId: string, newStatus: string) => {
    try {
      await residentAPI.updateResidentStatus(residentId, newStatus);
      fetchResidents(); // Refresh the list
    } catch (error) {
      console.error('Error updating resident status:', error);
      setError('Failed to update resident status');
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Residents Management</h1>
            <p className="text-gray-600">Manage community residents and their accounts</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Residents</p>
                  <p className="text-2xl font-bold text-gray-900">{residents.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{residents.filter(r => r.status === 'active').length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold text-gray-900">{residents.filter(r => r.status === 'inactive').length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Suspended</p>
                  <p className="text-2xl font-bold text-gray-900">{residents.filter(r => r.status === 'suspended').length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Residents</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, or apartment..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  aria-label="Filter residents by status"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setShowAddResident(true)}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  Add Resident
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Residents List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Residents ({filteredResidents.length})</h2>
            </div>
            
            {loading ? (
              <div className="px-6 py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading residents...</p>
              </div>
            ) : filteredResidents.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No residents found</h3>
                <p className="mt-1 text-sm text-gray-500">No residents match your current filters.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredResidents.map((resident) => (
                  <div key={resident._id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-semibold text-sm">
                            {resident.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{resident.name}</h3>
                          <p className="text-sm text-gray-600">{resident.email}</p>
                          <p className="text-xs text-gray-500">
                            {resident.issueCount} issues • {resident.resolutionRate}% resolved
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resident.status)}`}>
                              {getStatusIcon(resident.status)} {resident.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Joined {new Date(resident.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                                                     <select
                             value={resident.status}
                             onChange={(e) => handleStatusChange(resident._id, e.target.value)}
                             className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                             aria-label={`Update status for ${resident.name}`}
                           >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                          </select>
                          
                          <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                            Edit
                          </button>
                          
                          <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Resident Modal */}
        {showAddResident && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Resident</h2>
              <form onSubmit={handleAddResident} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={newResident.name}
                    onChange={(e) => setNewResident({...newResident, name: e.target.value})}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newResident.email}
                    onChange={(e) => setNewResident({...newResident, email: e.target.value})}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={newResident.password}
                    onChange={(e) => setNewResident({...newResident, password: e.target.value})}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter password"
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700"
                  >
                    Add Resident
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddResident(false)}
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
