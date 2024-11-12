import { useState, useEffect } from 'react';
import PageLogin from '../../pages/login/PageLogin';
import { MenuOutlined } from '@ant-design/icons';

import './navbar.css';

export default function CmpHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar el menú
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleResize = () => {
    setWindowWidth(window.innerWidth); // Actualiza el ancho de la ventana
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize); // Escucha los cambios de tamaño de la ventana
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className="header">
      <nav>
        <h2>TravelMaps</h2>

        <MenuOutlined className="menu-toggle" onClick={toggleMenu} />

        <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          {windowWidth <= 1230 && <PageLogin />}
        </ul>

        {windowWidth > 1230 && <PageLogin />}
      </nav>
    </header>
  );
}
