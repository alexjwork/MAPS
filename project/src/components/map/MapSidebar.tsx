import { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter, MapPin, Route as RouteIcon, Search, Flag, Edit, Trash2 } from 'lucide-react';
import { Landmark, Route, MapFilters, LandmarkType } from '../../types/map';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

interface MapSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  landmarks: Landmark[];
  routes: Route[];
  filters: MapFilters;
  onFilterChange: (filters: MapFilters) => void;
  selectedLandmark: Landmark | null;
  selectedRoute: Route | null;
  onSelectLandmark: (landmark: Landmark | null) => void;
  onSelectRoute: (route: Route | null) => void;
  onEditLandmark: (landmark: Landmark) => void;
  onEditRoute: (route: Route) => void;
  onDeleteLandmark: (landmarkId: string) => void;
  onDeleteRoute: (routeId: string) => void;
  onFlagLandmark: (landmarkId: string, reason: string) => void;
}

const MapSidebar = ({
  isOpen,
  onToggle,
  landmarks,
  routes,
  filters,
  onFilterChange,
  selectedLandmark,
  selectedRoute,
  onSelectLandmark,
  onSelectRoute,
  onEditLandmark,
  onEditRoute,
  onDeleteLandmark,
  onDeleteRoute,
  onFlagLandmark
}: MapSidebarProps) => {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<'landmarks' | 'routes'>('landmarks');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<LandmarkType[]>([]);
  const [flagReason, setFlagReason] = useState('');
  const [showFlagDialog, setShowFlagDialog] = useState(false);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onFilterChange({ ...filters, search: term });
  };

  // Handle landmark type filter change
  const handleTypeChange = (type: LandmarkType) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    setSelectedTypes(newTypes);
    onFilterChange({ ...filters, types: newTypes.length > 0 ? newTypes : undefined });
  };

  // Handle showing only user's landmarks
  const handleMyLandmarksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && user) {
      onFilterChange({ ...filters, createdBy: user.id });
    } else {
      onFilterChange({ ...filters, createdBy: undefined });
    }
  };

  // Get creator name for a landmark or route
  const getCreatorName = (creatorId: string) => {
    if (creatorId === user?.id) return 'You';
    return `User ${creatorId}`; // In a real app, you'd look up the user's name
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Handle flag submission
  const handleFlagSubmit = () => {
    if (selectedLandmark && flagReason.trim()) {
      onFlagLandmark(selectedLandmark.id, flagReason);
      setShowFlagDialog(false);
      setFlagReason('');
    }
  };

  // Check if user can edit a landmark
  const canEditLandmark = (landmark: Landmark) => {
    if (!user) return false;
    return user.id === landmark.createdBy || hasPermission('landmark:update:any');
  };

  // Check if user can delete a landmark
  const canDeleteLandmark = (landmark: Landmark) => {
    if (!user) return false;
    return user.id === landmark.createdBy || hasPermission('landmark:delete:any');
  };

  // Check if user can edit a route
  const canEditRoute = (route: Route) => {
    if (!user) return false;
    return user.id === route.createdBy || hasPermission('route:update:any');
  };

  // Check if user can delete a route
  const canDeleteRoute = (route: Route) => {
    if (!user) return false;
    return user.id === route.createdBy || hasPermission('route:delete:any');
  };

  // Get color for landmark type
  const getLandmarkTypeColor = (type: LandmarkType) => {
    const colors = {
      restaurant: 'bg-red-500',
      attraction: 'bg-amber-500',
      hotel: 'bg-blue-500',
      park: 'bg-green-500',
      shop: 'bg-purple-500',
      other: 'bg-gray-500'
    };
    return colors[type];
  };

  return (
    <div className={`h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-md z-10 transition-all duration-300 ${isOpen ? 'w-80' : 'w-0'}`}>
      {isOpen && (
        <div className="h-full flex flex-col">
          {/* Toggle button */}
          <button
            onClick={onToggle}
            className="absolute -right-10 top-4 bg-white dark:bg-gray-800 p-2 rounded-r-md shadow-md border border-l-0 border-gray-200 dark:border-gray-700 z-10"
            aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isOpen ? (
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* Sidebar content */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Map Explorer</h2>
            
            {/* Search input */}
            <div className="mt-3 relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            {/* Filter button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="mt-3 flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <Filter className="h-4 w-4 mr-1" />
              {showFilters ? 'Hide filters' : 'Show filters'}
            </button>
            
            {/* Filters */}
            {showFilters && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Landmark Types</h3>
                
                <div className="flex flex-wrap gap-2">
                  {['restaurant', 'attraction', 'hotel', 'park', 'shop', 'other'].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleTypeChange(type as LandmarkType)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        selectedTypes.includes(type as LandmarkType)
                          ? `${getLandmarkTypeColor(type as LandmarkType)} text-white`
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                
                {user && (
                  <div className="mt-4">
                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        className="mr-2 h-4 w-4 rounded text-blue-500 focus:ring-blue-500"
                        onChange={handleMyLandmarksChange}
                        checked={filters.createdBy === user.id}
                      />
                      Show only my landmarks
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`flex-1 py-3 font-medium text-sm ${
                activeTab === 'landmarks'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              onClick={() => setActiveTab('landmarks')}
            >
              <div className="flex items-center justify-center">
                <MapPin className="h-4 w-4 mr-1" />
                Landmarks ({landmarks.length})
              </div>
            </button>
            <button
              className={`flex-1 py-3 font-medium text-sm ${
                activeTab === 'routes'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              onClick={() => setActiveTab('routes')}
            >
              <div className="flex items-center justify-center">
                <RouteIcon className="h-4 w-4 mr-1" />
                Routes ({routes.length})
              </div>
            </button>
          </div>
          
          {/* Content based on active tab */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'landmarks' ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {landmarks.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No landmarks found
                  </div>
                ) : (
                  landmarks.map(landmark => (
                    <div 
                      key={landmark.id}
                      className={`p-3 cursor-pointer transition-colors ${
                        selectedLandmark?.id === landmark.id
                          ? 'bg-blue-50 dark:bg-blue-900/20'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => onSelectLandmark(landmark)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-white">
                            {landmark.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Created by {getCreatorName(landmark.createdBy)} • {formatDate(landmark.createdAt)}
                          </p>
                        </div>
                        <span className={`${getLandmarkTypeColor(landmark.type)} text-white text-xs px-2 py-1 rounded-full`}>
                          {landmark.type}
                        </span>
                      </div>
                      
                      {selectedLandmark?.id === landmark.id && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {landmark.description}
                          </p>
                          
                          {landmark.isFlagged && (
                            <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs rounded-md">
                              <span className="font-medium">Flagged:</span> {landmark.flagReason}
                            </div>
                          )}
                          
                          <div className="mt-3 flex space-x-2">
                            {canEditLandmark(landmark) && (
                              <Button
                                variant="outline"
                                size="sm"
                                icon={<Edit className="h-3 w-3" />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditLandmark(landmark);
                                }}
                              >
                                Edit
                              </Button>
                            )}
                            
                            {canDeleteLandmark(landmark) && (
                              <Button
                                variant="danger"
                                size="sm"
                                icon={<Trash2 className="h-3 w-3" />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteLandmark(landmark.id);
                                }}
                              >
                                Delete
                              </Button>
                            )}
                            
                            {user && !landmark.isFlagged && (
                              <Button
                                variant="outline"
                                size="sm"
                                icon={<Flag className="h-3 w-3" />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowFlagDialog(true);
                                }}
                              >
                                Flag
                              </Button>
                            )}
                          </div>
                          
                          {/* Flag dialog */}
                          {showFlagDialog && (
                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Flag this landmark</h4>
                              <textarea
                                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm"
                                placeholder="Reason for flagging..."
                                value={flagReason}
                                onChange={(e) => setFlagReason(e.target.value)}
                                rows={3}
                              />
                              <div className="mt-2 flex justify-end space-x-2">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => setShowFlagDialog(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={handleFlagSubmit}
                                  disabled={!flagReason.trim()}
                                >
                                  Submit
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {routes.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No routes found
                  </div>
                ) : (
                  routes.map(route => (
                    <div 
                      key={route.id}
                      className={`p-3 cursor-pointer transition-colors ${
                        selectedRoute?.id === route.id
                          ? 'bg-blue-50 dark:bg-blue-900/20'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => onSelectRoute(route)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-white">
                            {route.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Created by {getCreatorName(route.createdBy)} • {formatDate(route.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span 
                            className="h-3 w-3 rounded-full" 
                            style={{ backgroundColor: route.color }}
                          ></span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {route.points.length} points
                          </span>
                        </div>
                      </div>
                      
                      {selectedRoute?.id === route.id && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {route.description}
                          </p>
                          
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Distance: {route.points.reduce((acc, point, i, arr) => {
                              if (i === 0) return 0;
                              const prevPoint = arr[i - 1];
                              const latDiff = point.lat - prevPoint.lat;
                              const lngDiff = point.lng - prevPoint.lng;
                              return acc + Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111.32; // rough conversion to km
                            }, 0).toFixed(2)} km
                          </p>
                          
                          <div className="mt-3 flex space-x-2">
                            {canEditRoute(route) && (
                              <Button
                                variant="outline"
                                size="sm"
                                icon={<Edit className="h-3 w-3" />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditRoute(route);
                                }}
                              >
                                Edit
                              </Button>
                            )}
                            
                            {canDeleteRoute(route) && (
                              <Button
                                variant="danger"
                                size="sm"
                                icon={<Trash2 className="h-3 w-3" />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteRoute(route.id);
                                }}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapSidebar;