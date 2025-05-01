import { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';
import { Landmark, LandmarkType } from '../../types/map';
import L from 'leaflet';
import Button from '../ui/Button';

interface MapLandmarkFormProps {
  landmark?: Landmark;
  onSubmit: (landmarkData: Omit<Landmark, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  onCancel: () => void;
  map: L.Map | null;
}

const MapLandmarkForm = ({
  landmark,
  onSubmit,
  onCancel,
  map
}: MapLandmarkFormProps) => {
  const [name, setName] = useState(landmark?.name || '');
  const [description, setDescription] = useState(landmark?.description || '');
  const [type, setType] = useState<LandmarkType>(landmark?.type || 'other');
  const [location, setLocation] = useState(landmark?.location || { lat: 0, lng: 0 });
  const [marker, setMarker] = useState<L.Marker | null>(null);
  const [isPositioning, setIsPositioning] = useState(!landmark);

  // Set up map click handler for positioning
  useEffect(() => {
    if (!map) return;

    // Initialize with existing location or current map center
    const initialLocation = landmark?.location || map.getCenter();
    setLocation({ lat: initialLocation.lat, lng: initialLocation.lng });

    // If editing, create a marker at the landmark's position
    if (landmark) {
      const newMarker = L.marker([landmark.location.lat, landmark.location.lng], {
        draggable: true,
        icon: L.divIcon({
          html: '<div style="background-color: #3B82F6; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>',
          className: '',
          iconSize: [30, 30],
          iconAnchor: [15, 30]
        })
      }).addTo(map);

      newMarker.on('dragend', () => {
        const pos = newMarker.getLatLng();
        setLocation({ lat: pos.lat, lng: pos.lng });
      });

      setMarker(newMarker);
    }

    // Set up map click handler for positioning
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!isPositioning) return;

      // Update location
      setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });

      // Update or create marker
      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        const newMarker = L.marker(e.latlng, {
          draggable: true,
          icon: L.divIcon({
            html: '<div style="background-color: #3B82F6; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>',
            className: '',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
          })
        }).addTo(map);

        newMarker.on('dragend', () => {
          const pos = newMarker.getLatLng();
          setLocation({ lat: pos.lat, lng: pos.lng });
        });

        setMarker(newMarker);
      }

      // Exit positioning mode after first click
      setIsPositioning(false);
    };

    map.on('click', handleMapClick);

    // Clean up
    return () => {
      map.off('click', handleMapClick);
      if (marker) {
        marker.remove();
      }
    };
  }, [map, landmark, marker, isPositioning]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      type,
      location
    });
  };

  // Reset positioning mode
  const handleReposition = () => {
    setIsPositioning(true);
  };

  return (
    <div className="absolute top-4 left-4 right-4 z-[1000] max-w-md mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {landmark ? 'Edit Landmark' : 'Add New Landmark'}
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
              placeholder="Landmark name"
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
              placeholder="Describe this landmark"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['restaurant', 'attraction', 'hotel', 'park', 'shop', 'other'].map((landmarkType) => (
                <button
                  key={landmarkType}
                  type="button"
                  onClick={() => setType(landmarkType as LandmarkType)}
                  className={`px-3 py-2 rounded-md text-sm transition-colors ${
                    type === landmarkType
                      ? landmarkType === 'restaurant' ? 'bg-red-500 text-white' :
                        landmarkType === 'attraction' ? 'bg-amber-500 text-white' :
                        landmarkType === 'hotel' ? 'bg-blue-500 text-white' :
                        landmarkType === 'park' ? 'bg-green-500 text-white' :
                        landmarkType === 'shop' ? 'bg-purple-500 text-white' :
                        'bg-gray-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {landmarkType}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="lat" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    id="lat"
                    value={location.lat.toFixed(6)}
                    readOnly
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label htmlFor="lng" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    id="lng"
                    value={location.lng.toFixed(6)}
                    readOnly
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={<MapPin className="h-4 w-4" />}
                onClick={handleReposition}
                className="mt-5"
              >
                {isPositioning ? 'Click on map' : 'Reposition'}
              </Button>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {isPositioning ? 'Click on the map to place your landmark' : 'You can also drag the marker to adjust the position'}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={!name || !description || location.lat === 0 || location.lng === 0}
          >
            {landmark ? 'Update Landmark' : 'Add Landmark'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MapLandmarkForm;