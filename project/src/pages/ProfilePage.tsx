import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Route as RouteIcon, LogOut, Edit, Camera } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('Map enthusiast and explorer.');
  
  // Mock user stats
  const userStats = {
    totalLandmarks: 12,
    totalRoutes: 5,
    lastActive: new Date().toLocaleDateString()
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    showToast('Successfully logged out', 'info');
    navigate('/');
  };

  // Handle profile update
  const handleUpdateProfile = () => {
    // In a real app, this would update the user's profile
    showToast('Profile updated successfully', 'success');
    setIsEditing(false);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32"></div>
            <div className="px-6 py-4 sm:px-8 sm:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="relative -mt-16 sm:-mt-20">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white dark:border-gray-800 object-cover"
                  />
                  <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:border-blue-500"
                        />
                      ) : (
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                      )}
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{user.email}</span>
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full flex items-center">
                          {user.role === 'admin' ? (
                            <>Admin</>
                          ) : (
                            <>User</>
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Member since {formatDate(user.createdAt)}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex space-x-2">
                      {isEditing ? (
                        <>
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={handleUpdateProfile}
                          >
                            Save
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            icon={<Edit className="h-4 w-4" />}
                            onClick={() => setIsEditing(true)}
                          >
                            Edit Profile
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm"
                            icon={<LogOut className="h-4 w-4" />}
                            onClick={handleLogout}
                          >
                            Logout
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {isEditing ? (
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="mt-4 w-full h-20 text-gray-600 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-700 rounded-md p-2 focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <p className="mt-4 text-gray-600 dark:text-gray-300">
                      {bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account settings</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Account Type</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">{user.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Email</span>
                  <span className="font-medium text-gray-900 dark:text-white">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Last Login</span>
                  <span className="font-medium text-gray-900 dark:text-white">Today</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Landmarks</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Your created landmarks</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Total Landmarks</span>
                  <span className="font-medium text-gray-900 dark:text-white">{userStats.totalLandmarks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Most Popular Type</span>
                  <span className="font-medium text-gray-900 dark:text-white">Restaurant</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Last Created</span>
                  <span className="font-medium text-gray-900 dark:text-white">Yesterday</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-6" size="sm">
                View Your Landmarks
              </Button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <RouteIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Routes</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Your created routes</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Total Routes</span>
                  <span className="font-medium text-gray-900 dark:text-white">{userStats.totalRoutes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Total Distance</span>
                  <span className="font-medium text-gray-900 dark:text-white">42.5 km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Last Created</span>
                  <span className="font-medium text-gray-900 dark:text-white">3 days ago</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-6" size="sm">
                View Your Routes
              </Button>
            </div>
          </div>
          
          {/* Recent activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mt-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <div className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-900 dark:text-white">
                      You created a new landmark: <span className="font-medium">Central Park Cafe</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">2 days ago</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <RouteIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-900 dark:text-white">
                      You created a new route: <span className="font-medium">Downtown Tour</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">1 week ago</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Edit className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-900 dark:text-white">
                      You updated landmark: <span className="font-medium">City Museum</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">2 weeks ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;