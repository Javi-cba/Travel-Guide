import React, { createContext, useState, useContext } from 'react';

const LugaresContext = createContext();

export const DrawerProvider = ({ children }) => {
  const [isOpen, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
    console.log(isOpen);
  };
  const hideDrawer = () => setOpen(false);

  return (
    <LugaresContext.Provider value={{ hideDrawer, showDrawer, isOpen }}>
      {children}
    </LugaresContext.Provider>
  );
};

export const useLugares = () => useContext(LugaresContext);
