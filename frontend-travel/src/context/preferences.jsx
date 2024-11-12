import React, { createContext, useState, useContext } from 'react';

const PreferencContext = createContext();

export const PreferencProvider = ({ children }) => {
  const [isOpen, setOpen] = useState(false);

  const showPreferenc = () => {
    setOpen(true);
    console.log(isOpen);
  };
  const hidePreferenc = () => setOpen(false);

  return (
    <PreferencContext.Provider value={{ hidePreferenc, showPreferenc, isOpen }}>
      {children}
    </PreferencContext.Provider>
  );
};

export const usePreferenc = () => useContext(PreferencContext);
