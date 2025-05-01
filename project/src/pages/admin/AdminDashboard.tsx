import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Flag, BarChart3, Shield, User, Ban, UserCheck, Map, MapPin } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

// Mock user data
const mockUsers = [
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user',
    status: 'active',
    landmarks: 12,
    routes: 5,
    lastActive: '2023-06-15T12:30:00Z',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'active',
    landmarks: 8,
    routes: 2,
    lastActive: '2023-06-10T09:15:00Z',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '4',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'user',
    status: 'banned',
    landmarks: 3,
    routes: 1,
    lastActive: '2023-05-28T16:45:00Z',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '5',
    name: 'Alice Williams',
    email: 'alice@example.com',
    role: 'user',
    status: 'active',
    landmarks: 15,
    routes: 7,
    lastActive: '2023-06-14T11:20:00Z',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
  }
];

// Mock flagged content
const mockFlaggedContent = [
  {
    id: 'flag1',
    type: 'landmark',
    name: 'Inappropriate Restaurant',
    createdBy: '3',
    creatorName: 'Jane Smith',
    flaggedBy: '5',
    flaggerName: 'Alice Williams',
    reason: 'Offensive description and inaccurate location',
    flaggedAt: '2023-06-14T10:30:00Z',
    status: 'pending'
  },
  {
    id: 'flag2',
    type: 'landmark',
    name: 'Non-existent Hotel',
    createdBy: '4',
    creatorName: 'Bob Johnson',
    flaggedBy: '2',
    flaggerName: 'Regular User',
    reason: 'This hotel does not exist at this location',
    flaggedAt: '2023-06-13T14:20:00Z',
    status: 'pending'
  },
  {
    id: 'flag3',
    type: 'landmark',
    name: 'Spam Attraction',
    createdBy: '4',
    creatorName: 'Bob Johnson',
    flaggedBy: '3',
    flaggerName: 'Jane Smith',
    reason: 'This is just spam advertising',
    flaggedAt: '2023-06-12T09:45:00Z',
    status: 'resolved'
  }
];

// Admin dashboard tabs
type DashboardTab = 'users' | 'moderation' | 'analytics';

const AdminDashboard = () => {
  const { user, hasPermission } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<DashboardTab>('users');
  const [users, setUsers] = useState(mockUsers);
  const [flaggedContent, setFlaggedContent] = useState(mockFlaggedContent);
  
  // Check if user is admin
  if (!user || !hasPermission('user:manage')) {
    navigate('/');
    showToast('You do not have permission to access the admin dashboard', 'error');
    return null;
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Handle toggling user ban status
  const toggleUserBan = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'banned' ? 'active' : 'banned';
        showToast(`User ${u.name} has been ${newStatus === 'banned' ? 'banned' : 'unbanned'}`, 'info');
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  // Handle toggling user role
  const toggleUserRole = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const newRole = u.role === 'admin' ? 'user' : 'admin';
        showToast(`User ${u.name} is now ${newRole === 'admin' ? 'an admin' : 'a regular user'}`, 'info');
        return { ...u, role: newRole };
      }
      return u;
    }));
  };

  // Handle resolving flagged content
  const resolveFlaggedContent = (flagId: string, action: 'approve' | 'remove') => {
    setFlaggedContent(flaggedContent.map(f => {
      if (f.id === flagId) {
        showToast(`Flagged content ${action === 'approve' ? 'approved' : 'removed'}`, 'success');
        return { ...f, status: 'resolved' };
      }
      return f;
    }));
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-blue-500 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Logged in as <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`flex items-center px-6 py-3 font-medium text-sm ${
                activeTab === 'users'
                  ? 'text-blue-500 border-b-2 border-blue-500 dark:border-blue-400'
                  : 'text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400'
              }`}
              onClick={() => setActiveTab('users')}
            >
              <Users className="h-5 w-5 mr-2" />
              User Management
            </button>
            <button
              className={`flex items-center px-6 py-3 font-medium text-sm ${
                activeTab === 'moderation'
                  ? 'text-blue-500 border-b-2 border-blue-500 dark:border-blue-400'
                  : 'text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400'
              }`}
              onClick={() => setActiveTab('moderation')}
            >
              <Flag className="h-5 w-5 mr-2" />
              Content Moderation
            </button>
            <button
              className={`flex items-center px-6 py-3 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'text-blue-500 border-b-2 border-blue-500 dark:border-blue-400'
                  : 'text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400'
              }`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Analytics
            </button>
          </div>
          
          {/* Tab content */}
          <div className="p-6">
            {/* User Management Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Management</h2>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="px-4 py-2 pr-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <User className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Content
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Last Active
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img className="h-10 w-10 rounded-full object-cover" src={u.avatar} alt="" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              u.status === 'active'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">
                            {u.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4" />
                              <span>{u.landmarks}</span>
                              <span className="mx-1">|</span>
                              <Map className="h-4 w-4" />
                              <span>{u.routes}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(u.lastActive)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button
                                variant={u.status === 'banned' ? 'success' : 'danger'}
                                size="sm"
                                icon={u.status === 'banned' ? <UserCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                                onClick={() => toggleUserBan(u.id)}
                              >
                                {u.status === 'banned' ? 'Unban' : 'Ban'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                icon={<Shield className="h-4 w-4" />}
                                onClick={() => toggleUserRole(u.id)}
                              >
                                {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Content Moderation Tab */}
            {activeTab === 'moderation' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Flagged Content</h2>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      className={`${flaggedContent.filter(f => f.status === 'pending').length > 0 ? 'border-red-500 text-red-500' : ''}`}
                    >
                      Pending ({flaggedContent.filter(f => f.status === 'pending').length})
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                    >
                      Resolved ({flaggedContent.filter(f => f.status === 'resolved').length})
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {flaggedContent.filter(f => f.status === 'pending').length === 0 ? (
                    <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Flag className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No pending flags</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        All flagged content has been reviewed and resolved.
                      </p>
                    </div>
                  ) : (
                    flaggedContent.filter(f => f.status === 'pending').map(flag => (
                      <div key={flag.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{flag.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {flag.type.charAt(0).toUpperCase() + flag.type.slice(1)} created by {flag.creatorName}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs rounded-full flex items-center">
                            Flagged
                          </span>
                        </div>
                        
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Reason for flag:</p>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-600">
                            {flag.reason}
                          </p>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Flagged by {flag.flaggerName} on {formatDate(flag.flaggedAt)}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => resolveFlaggedContent(flag.id, 'approve')}
                            >
                              Approve Content
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => resolveFlaggedContent(flag.id, 'remove')}
                            >
                              Remove Content
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            
            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Platform Analytics</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                      <h3 className="text-lg font-medium">Total Users</h3>
                      <p className="text-3xl font-bold mt-2">{users.length + 1}</p>
                      <p className="text-blue-100 text-sm mt-1">+2 this week</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                      <h3 className="text-lg font-medium">Total Landmarks</h3>
                      <p className="text-3xl font-bold mt-2">38</p>
                      <p className="text-green-100 text-sm mt-1">+5 this week</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                      <h3 className="text-lg font-medium">Total Routes</h3>
                      <p className="text-3xl font-bold mt-2">15</p>
                      <p className="text-purple-100 text-sm mt-1">+2 this week</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Activity heatmap */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">User Activity Heatmap</h3>
                    </div>
                    <div className="p-6">
                      <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400">Activity heatmap visualization would appear here</p>
                      </div>
                      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        This heatmap shows areas with the highest user activity, with hotspots in downtown and tourist areas.
                      </p>
                    </div>
                  </div>
                  
                  {/* Content creation chart */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Content Creation Trends</h3>
                    </div>
                    <div className="p-6">
                      <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400">Content creation chart would appear here</p>
                      </div>
                      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        This chart shows the trend of landmarks and routes created over time, with a notable increase in the past month.
                      </p>
                    </div>
                  </div>
                  
                  {/* User growth */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">User Growth</h3>
                    </div>
                    <div className="p-6">
                      <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400">User growth chart would appear here</p>
                      </div>
                      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        This chart shows the number of new users joining the platform over time, with steady growth since launch.
                      </p>
                    </div>
                  </div>
                  
                  {/* Top content */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Top Content</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-bold text-blue-500">1</span>
                            <span className="text-gray-900 dark:text-white">City Park</span>
                          </div>
                          <span className="text-gray-500 dark:text-gray-400">382 views</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-bold text-blue-500">2</span>
                            <span className="text-gray-900 dark:text-white">Downtown Tour</span>
                          </div>
                          <span className="text-gray-500 dark:text-gray-400">295 views</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-bold text-blue-500">3</span>
                            <span className="text-gray-900 dark:text-white">Harbor Restaurant</span>
                          </div>
                          <span className="text-gray-500 dark:text-gray-400">241 views</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-bold text-blue-500">4</span>
                            <span className="text-gray-900 dark:text-white">Historic District</span>
                          </div>
                          <span className="text-gray-500 dark:text-gray-400">187 views</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-bold text-blue-500">5</span>
                            <span className="text-gray-900 dark:text-white">Waterfront Walk</span>
                          </div>
                          <span className="text-gray-500 dark:text-gray-400">156 views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;