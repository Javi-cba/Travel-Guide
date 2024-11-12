import React, { createContext, useState, useContext } from 'react';
import { getRecomendaciones } from '../services/recomendaciones';
import { useLugares } from '../context/drawerLugares';
import { useAuth0 } from '@auth0/auth0-react';

const RecomendContext = createContext();

export const RecomendProvider = ({ children }) => {
  const { hideDrawer } = useLugares();
  const [loadRec, setLoadRec] = useState(false);
  const [marker, setMarker] = useState({ lat: -32.406487, lng: -63.243276 });
  const [lugares, setLugares] = useState([]);
  const { isAuthenticated, user } = useAuth0();

  const cargarRecomendaciones = async () => {
    setLoadRec(true);
    if (isAuthenticated && user) {
      const resp = await getRecomendaciones(user.email);

      setLugares(resp);
    }
    setLoadRec(false);
  };

  const centrarMapa = async item => {
    if (isAuthenticated && user) {
      setMarker({ lat: item.lat, lng: item.lng });
      hideDrawer();
    }
  };

  return (
    <RecomendContext.Provider
      value={{ cargarRecomendaciones, lugares, loadRec, centrarMapa, marker }}
    >
      {children}
    </RecomendContext.Provider>
  );
};

export const useRecomend = () => useContext(RecomendContext);
