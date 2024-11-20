import { useState, useCallback } from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import { Box } from '@chakra-ui/react';

const Map = ({ location, onLocationSelect, isInteractive = false }) => {
  const [, setMap] = useState(null);

  const defaultCenter = {
    lat: location?.lat || 48.8566,
    lng: location?.lng || 2.3522
  };

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleClick = useCallback((e) => {
    if (isInteractive && onLocationSelect) {
      onLocationSelect({
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      });
    }
  }, [isInteractive, onLocationSelect]);

  return (
    <Box h="100%" minH="300px">
      <LoadScript googleMapsApiKey="VOTRE_CLE_API_GOOGLE_MAPS">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={defaultCenter}
          zoom={13}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleClick}
        >
          {location && <Marker position={location} />}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

export default Map;