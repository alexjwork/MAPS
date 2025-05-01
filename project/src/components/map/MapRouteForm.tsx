import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Route, Coordinates } from '../../types/map';
import L from 'leaflet';
import Button from '../ui/Button';

interface MapRouteFormProps {
  route?: Route;
  onSubmit: (routeData: Omit<Route, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  onCancel: () => void;
  map: L.Map | null;
}

const MapRouteForm = ({
  route,
  onSubmit,
  onCancel,
  map
}: MapRouteFormProps) => {
  const [name, setName] = useState(route?.name || '');
  const [description, setDescription] = useState(route?.description || '');
  const [color, setColor] = useState(route?.color || '#3B82F6');
  const [points, setPoints] = useState<Coordinates[]>(route?.points || []);
  const [markers, setMarkers] = useState<L.Marker[]>([]);
  const [polyline, setPolyline] = useState<L.Polyline | null>(null);
  const [isAddingPoints, setIsAddingPoints] = useState(!route || route.points.length === 0);

  // Set up map for route editing
  useEffect(() => {
    if (!map) return;

    // Clear existing markers and polyline when component mounts or unmounts
    const clearMap = () => {
      markers.forEach(marker => marker.remove());
      if (polyline) polyline.remove();
    };

    clearMap();

    // Create markers for existing points
    const newMarkers: L.Marker[] = [];
    
    points.forEach((point, index) => {
      const marker = L.marker([point.lat, point.lng], {
        draggable: true,
        icon: createPointMarker(index + 1)
      }).addTo(map);

      // Update point position when marker is dragged
      marker.on('dragend', () => {
        const newPos = marker.getLatLng();
        setPoints(prev => {
          const newPoints = [...prev];
          newPoints[index] = { lat: newPos.lat, lng: newPos.lng };
          return newPoints;
        });
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // Create polyline connecting the points
    if (points.length > 1) {
      const newPolyline = L.polyline(points.map(p => [p.lat, p.lng]), {
        color,
        weight: 4,
        opacity: 0.7
      }).addTo(map);
      
      setPolyline(newPolyline);
    }

    // Set up map click handler for adding new points
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!isAddingPoints) return;

      const newPoint = { lat: e.latlng.lat, lng: e.latlng.lng };
      const pointIndex = points.length;

      // Add marker for the new point
      const marker = L.marker(e.latlng, {
        draggable: true,
        icon: createPointMarker(pointIndex + 1)
      }).addTo(map);

      // Update point position when marker is dragged
      marker.on('dragend', () => {
        const newPos = marker.getLatLng();
        setPoints(prev => {
          const newPoints = [...prev];
          newPoints[pointIndex] = { lat: newPos.lat, lng: newPos.lng };
          return newPoints;
        });
      });

      // Add new point to points array
      setPoints(prev => [...prev, newPoint]);
      setMarkers(prev => [...prev, marker]);
    };

    if (isAddingPoints) {
      map.on('click', handleMapClick);
    }

    // Clean up
    return () => {
      clearMap();
      map.off('click', handleMapClick);
    };
  }, [map, points, color, isAddingPoints]);

  // Update polyline when points or color change
  useEffect(() => {
    if (!map) return;

    // Remove existing polyline
    if (polyline) polyline.remove();

    // Create new polyline if there are at least 2 points
    if (points.length > 1) {
      const newPolyline = L.polyline(points.map(p => [p.lat, p.lng]), {
        color,
        weight: 4,
        opacity: 0.7
      }).addTo(map);
      
      setPolyline(newPolyline);
    } else {
      setPolyline(null);
    }
  }, [map, points, color]);

  // Create a custom marker icon for route points
  const createPointMarker = (number: number) => {
    return L.divIcon({
      html: `<div style="background-color: ${color}; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">${number}</div>`,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      color,
      points
    });
  };

  // Remove a point
  const removePoint = (index: number) => {
    // Remove marker from map
    markers[index].remove();
    
    // Remove point and marker from state
    setPoints(prev => prev.filter((_, i) => i !== index));
    setMarkers(prev => {
      const newMarkers = prev.filter((_, i) => i !== index);
      // Update remaining markers with new indices
      newMarkers.forEach((marker, i) => {
        marker.setIcon(createPointMarker(i + 1));
      });
      return newMarkers;
    });
  };

  // Toggle adding points mode
  const toggleAddingPoints = () => {
    setIsAddingPoints(prev => !prev);
  };

  return (
    <div className="absolute top-4 left-4 right-4 z-[1000] max-w-md mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {route ? 'Edit Route' : 'Add New Route'}
        </h3>
        <button
          onClick={onCancel}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Route name"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe this route"
              rows={3}
              required
            />
          </div>

          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Route Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-12 border-0 p-0"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#3B82F6"
                pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Route Points ({points.length})
              </label>
              <Button
                type="button"
                variant={isAddingPoints ? 'primary' : 'outline'}
                size="sm"
                icon={<Plus className="h-4 w-4" />}
                onClick={toggleAddingPoints}
              >
                {isAddingPoints ? 'Adding Points...' : 'Add Points'}
              </Button>
            </div>
            
            {isAddingPoints && (
              <p className="mb-2 text-xs text-blue-500 dark:text-blue-400">
                Click on the map to add points to your route
              </p>
            )}
            
            <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
              {points.length === 0 ? (
                <div className="p-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                  No points added yet
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {points.map((point, index) => (
                    <li key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex items-center space-x-2">
                        <div
                          className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                          style={{ backgroundColor: color }}
                        >
                          {index + 1}
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePoint(index)}
                        className="text-red-500 hover:text-red-600 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {points.length > 0 && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Distance: {points.reduce((acc, point, i, arr) => {
                  if (i === 0) return 0;
                  const prevPoint = arr[i - 1];
                  const latDiff = point.lat - prevPoint.lat;
                  const lngDiff = point.lng - prevPoint.lng;
                  return acc + Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111.32; // rough conversion to km
                }, 0).toFixed(2)} km
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={!name || !description || points.length < 2}
          >
            {route ? 'Update Route' : 'Add Route'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MapRouteForm;