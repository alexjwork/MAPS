import { Plus, Navigation, MapPin, Route as RouteIcon } from 'lucide-react';
import Button from '../ui/Button';

interface MapControlsProps {
  onAddLandmark: () => void;
  onAddRoute: () => void;
  onLocateUser: () => void;
  isAuthenticated: boolean;
}

const MapControls = ({ 
  onAddLandmark, 
  onAddRoute, 
  onLocateUser,
  isAuthenticated 
}: MapControlsProps) => {
  return (
    <div className="absolute bottom-24 right-4 flex flex-col space-y-2 z-[999]">
      <Button
        onClick={onLocateUser}
        variant="primary"
        className="rounded-full p-3 shadow-lg"
        aria-label="Locate me"
      >
        <Navigation className="h-5 w-5" />
      </Button>

      {isAuthenticated && (
        <>
          <Button
            onClick={onAddLandmark}
            variant="secondary"
            className="rounded-full p-3 shadow-lg"
            aria-label="Add landmark"
          >
            <MapPin className="h-5 w-5" />
          </Button>

          <Button
            onClick={onAddRoute}
            variant="secondary"
            className="rounded-full p-3 shadow-lg"
            aria-label="Add route"
          >
            <RouteIcon className="h-5 w-5" />
          </Button>
        </>
      )}
    </div>
  );
};

export default MapControls;