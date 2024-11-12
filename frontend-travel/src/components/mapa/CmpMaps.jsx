import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import darkModeStyle from './mapStyle';
import { Spin } from 'antd';
import { useRecomend } from '../../context/recomend';
import { useLugares } from '../../context/drawerLugares';

const KEYAPI = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;

const CmpMaps = () => {
  const { showDrawer } = useLugares();
  const { marker } = useRecomend();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: KEYAPI,
  });

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100vh',
    margin: '0rem',
    padding: '0rem',
  };

  return isLoaded ? ( // Mostrar mapa o spinner de carga
    <GoogleMap
      mapContainerStyle={containerStyle}
      options={{
        styles: darkModeStyle,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: false,
      }}
      center={marker}
      zoom={10}
    >
      <Marker onClick={showDrawer} position={marker} />
    </GoogleMap>
  ) : (
    <Spin size="large" style={containerStyle} />
  );
};

export default CmpMaps;
