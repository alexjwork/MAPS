import { useState, useEffect, useRef } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Polyline, 
  useMap, 
  ZoomControl
} from 'react-leaflet';
import L from 'leaflet';
import { useAuth } from '../../context/AuthContext';
import { Landmark, Route, MapFilters, LandmarkType } from '../../types/map';
import MapSidebar from './MapSidebar';
import MapControls from './MapControls';
import MapLandmarkForm from './MapLandmarkForm';
import MapRouteForm from './MapRouteForm';
import { mockLandmarks, mockRoutes } from '../../data/mockMapData';
import { useToast } from '../../context/ToastContext';
import { Pin, Navigation } from 'lucide-react';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color: string, icon: JSX.Element) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">${ReactDOMServer.renderToString(icon)}</div>`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

// Ensure ReactDOMServer is available for marker icon creation
// This is a simplified polyfill for demo purposes
const ReactDOMServer = {
  renderToString: (element: JSX.Element) => {
    // Simplified version, in a real app you'd use the actual ReactDOMServer
    if (element.type === Pin) {
      return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
    }
    if (element.type === Navigation) {
      return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>';
    }
    return '';
  }
};

// Types of actions for map
type MapAction = 
  | { type: 'view' } 
  | { type: 'add-landmark' } 
  | { type: 'add-route' }
  | { type: 'edit-landmark'; landmark: Landmark }
  | { type: 'edit-route'; route: Route };

// Custom hook to locate user
const useLocateUser = () => {
  const map = useMap();
  
  const locateUser = () => {
    map.locate({ setView: true, maxZoom: 16 });
  };

  return locateUser;
};

// Map component
const MapView = () => {
  const { user, hasPermission } = useAuth();
  const { showToast } = useToast();
  const [landmarks, setLandmarks] = useState<Landmark[]>(mockLandmarks);
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [filters, setFilters] = useState<MapFilters>({});
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [currentAction, setCurrentAction] = useState<MapAction>({ type: 'view' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const mapRef = useRef<L.Map | null>(null);

  // Filter landmarks based on current filters
  const filteredLandmarks = landmarks.filter(landmark => {
    // Type filter
    if (filters.types && filters.types.length > 0 && !filters.types.includes(landmark.type)) {
      return false;
    }
    
    // Search filter
    if (filters.search && !landmark.name.toLowerCase().includes(filters.search.toLowerCase()) && 
        !landmark.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Creator filter
    if (filters.createdBy && landmark.createdBy !== filters.createdBy) {
      return false;
    }
    
    return true;
  });

  // Handle landmark form submission
  const handleLandmarkSubmit = (landmarkData: Omit<Landmark, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    if (currentAction.type === 'edit-landmark' && user) {
      // Check if user has permission to edit this landmark
      const canEdit = user.id === currentAction.landmark.createdBy || hasPermission('landmark:update:any');
      
      if (!canEdit) {
        showToast('You do not have permission to edit this landmark', 'error');
        return;
      }

      // Update landmark
      const updatedLandmark = {
        ...currentAction.landmark,
        ...landmarkData,
        updatedAt: new Date().toISOString()
      };

      setLandmarks(prev => 
        prev.map(l => l.id === updatedLandmark.id ? updatedLandmark : l)
      );
      
      showToast('Landmark updated successfully', 'success');
    } else if (currentAction.type === 'add-landmark' && user) {
      // Create new landmark
      const newLandmark: Landmark = {
        id: `landmark-${Date.now()}`,
        ...landmarkData,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setLandmarks(prev => [...prev, newLandmark]);
      showToast('Landmark created successfully', 'success');
    }

    // Reset to view mode
    setCurrentAction({ type: 'view' });
  };

  // Handle route form submission
  const handleRouteSubmit = (routeData: Omit<Route, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    if (currentAction.type === 'edit-route' && user) {
      // Check if user has permission to edit this route
      const canEdit = user.id === currentAction.route.createdBy || hasPermission('route:update:any');
      
      if (!canEdit) {
        showToast('You do not have permission to edit this route', 'error');
        return;
      }

      // Update route
      const updatedRoute = {
        ...currentAction.route,
        ...routeData,
        updatedAt: new Date().toISOString()
      };

      setRoutes(prev => 
        prev.map(r => r.id === updatedRoute.id ? updatedRoute : r)
      );
      
      showToast('Route updated successfully', 'success');
    } else if (currentAction.type === 'add-route' && user) {
      // Create new route
      const newRoute: Route = {
        id: `route-${Date.now()}`,
        ...routeData,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setRoutes(prev => [...prev, newRoute]);
      showToast('Route created successfully', 'success');
    }

    // Reset to view mode
    setCurrentAction({ type: 'view' });
  };

  // Handle deleting a landmark
  const handleDeleteLandmark = (landmarkId: string) => {
    const landmarkToDelete = landmarks.find(l => l.id === landmarkId);
    
    if (!landmarkToDelete) return;
    
    // Check if user has permission to delete this landmark
    const canDelete = user?.id === landmarkToDelete.createdBy || hasPermission('landmark:delete:any');
    
    if (!canDelete) {
      showToast('You do not have permission to delete this landmark', 'error');
      return;
    }

    setLandmarks(prev => prev.filter(l => l.id !== landmarkId));
    setSelectedLandmark(null);
    showToast('Landmark deleted successfully', 'success');
  };

  // Handle deleting a route
  const handleDeleteRoute = (routeId: string) => {
    const routeToDelete = routes.find(r => r.id === routeId);
    
    if (!routeToDelete) return;
    
    // Check if user has permission to delete this route
    const canDelete = user?.id === routeToDelete.createdBy || hasPermission('route:delete:any');
    
    if (!canDelete) {
      showToast('You do not have permission to delete this route', 'error');
      return;
    }

    setRoutes(prev => prev.filter(r => r.id !== routeId));
    setSelectedRoute(null);
    showToast('Route deleted successfully', 'success');
  };

  // Handle flagging a landmark as inappropriate
  const handleFlagLandmark = (landmarkId: string, reason: string) => {
    setLandmarks(prev => 
      prev.map(l => l.id === landmarkId ? { ...l, isFlagged: true, flagReason: reason } : l)
    );
    showToast('Landmark has been flagged for review', 'info');
  };

  // Gets marker color based on landmark type
  const getLandmarkColor = (type: LandmarkType): string => {
    const colors = {
      restaurant: '#EF4444', // red
      attraction: '#F59E0B', // amber
      hotel: '#3B82F6', // blue
      park: '#10B981', // green
      shop: '#8B5CF6', // purple
      other: '#6B7280', // gray
    };
    return colors[type];
  };

  // Reset the current action
  const cancelAction = () => {
    setCurrentAction({ type: 'view' });
  };

  // The MapEvents component to capture map clicks
  const MapEvents = () => {
    const map = useMap();
    
    useEffect(() => {
      if (!mapRef.current) {
        mapRef.current = map;
      }
      
      // Handle map clicks differently based on current action
      const handleMapClick = (e: L.LeafletMouseEvent) => {
        if (currentAction.type === 'add-landmark') {
          // When adding a landmark, set the location
          setCurrentAction({ 
            type: 'add-landmark' 
          });
          // Focus the form with the selected location
          map.panTo(e.latlng);
        } else if (currentAction.type === 'add-route') {
          // When adding a route, add a point to the route
          // This would be implemented in the route creation UI
        }
      };
      
      map.on('click', handleMapClick);
      
      return () => {
        map.off('click', handleMapClick);
      };
    }, [map, currentAction]);
    
    return null;
  };

  // Component to provide locate user functionality
  const LocateControl = () => {
    const locateUser = useLocateUser();
    return null; // The actual UI is in MapControls component
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Map sidebar */}
      <MapSidebar 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        landmarks={filteredLandmarks}
        routes={routes}
        filters={filters}
        onFilterChange={setFilters}
        selectedLandmark={selectedLandmark}
        selectedRoute={selectedRoute}
        onSelectLandmark={setSelectedLandmark}
        onSelectRoute={setSelectedRoute}
        onEditLandmark={(landmark) => setCurrentAction({ type: 'edit-landmark', landmark })}
        onEditRoute={(route) => setCurrentAction({ type: 'edit-route', route })}
        onDeleteLandmark={handleDeleteLandmark}
        onDeleteRoute={handleDeleteRoute}
        onFlagLandmark={handleFlagLandmark}
      />
      
      {/* Main map container */}
      <div className="flex-grow relative">
        <MapContainer
          center={[51.505, -0.09]} // Default location
          zoom={13}
          zoomControl={false}
          className="h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <ZoomControl position="bottomright" />
          
          {/* Display landmarks */}
          {filteredLandmarks.map(landmark => (
            <Marker 
              key={landmark.id}
              position={[landmark.location.lat, landmark.location.lng]}
              icon={createCustomIcon(getLandmarkColor(landmark.type), <Pin size={16} />)}
              eventHandlers={{
                click: () => {
                  setSelectedLandmark(landmark);
                  setSelectedRoute(null);
                }
              }}
            >
              <Popup>
                <div className="flex flex-col space-y-2">
                  <h3 className="font-bold text-lg">{landmark.name}</h3>
                  <p className="text-sm">{landmark.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs text-white bg-${landmark.type === 'restaurant' ? 'red' : landmark.type === 'attraction' ? 'amber' : landmark.type === 'hotel' ? 'blue' : landmark.type === 'park' ? 'green' : landmark.type === 'shop' ? 'purple' : 'gray'}-500`}>
                      {landmark.type}
                    </span>
                    {landmark.isFlagged && (
                      <span className="px-2 py-1 rounded-full text-xs text-white bg-red-500">
                        Flagged
                      </span>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Display routes */}
          {routes.map(route => (
            <Polyline 
              key={route.id}
              positions={route.points.map(point => [point.lat, point.lng])}
              color={route.color}
              weight={4}
              opacity={0.7}
              eventHandlers={{
                click: () => {
                  setSelectedRoute(route);
                  setSelectedLandmark(null);
                }
              }}
            >
              <Popup>
                <div className="flex flex-col space-y-2">
                  <h3 className="font-bold text-lg">{route.name}</h3>
                  <p className="text-sm">{route.description}</p>
                  <p className="text-xs text-gray-500">{route.points.length} points · {route.points.reduce((acc, point, i, arr) => {
                    if (i === 0) return 0;
                    const prevPoint = arr[i - 1];
                    const latDiff = point.lat - prevPoint.lat;
                    const lngDiff = point.lng - prevPoint.lng;
                    return acc + Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111.32; // rough conversion to km
                  }, 0).toFixed(2)} km</p>
                </div>
              </Popup>
            </Polyline>
          ))}
          
          <MapEvents />
          <LocateControl />
        </MapContainer>

        {/* Map controls */}
        <MapControls 
          onAddLandmark={() => {
            if (!user) {
              showToast('You must be logged in to add landmarks', 'warning');
              return;
            }
            setCurrentAction({ type: 'add-landmark' });
          }}
          onAddRoute={() => {
            if (!user) {
              showToast('You must be logged in to add routes', 'warning');
              return;
            }
            setCurrentAction({ type: 'add-route' });
          }}
          onLocateUser={() => {
            if (mapRef.current) {
              mapRef.current.locate({ setView: true, maxZoom: 16 });
            }
          }}
          isAuthenticated={!!user}
        />

        {/* Landmark creation/editing form */}
        {(currentAction.type === 'add-landmark' || currentAction.type === 'edit-landmark') && (
          <MapLandmarkForm 
            landmark={currentAction.type === 'edit-landmark' ? currentAction.landmark : undefined}
            onSubmit={handleLandmarkSubmit}
            onCancel={cancelAction}
            map={mapRef.current}
          />
        )}

        {/* Route creation/editing form */}
        {(currentAction.type === 'add-route' || currentAction.type === 'edit-route') && (
          <MapRouteForm 
            route={currentAction.type === 'edit-route' ? currentAction.route : undefined}
            onSubmit={handleRouteSubmit}
            onCancel={cancelAction}
            map={mapRef.current}
          />
        )}
      </div>
    </div>
  );
};

export default MapView;