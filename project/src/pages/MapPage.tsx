import PageLayout from '../components/layout/PageLayout';
import MapView from '../components/map/MapView';

const MapPage = () => {
  return (
    <PageLayout hideFooter>
      <MapView />
    </PageLayout>
  );
};

export default MapPage;