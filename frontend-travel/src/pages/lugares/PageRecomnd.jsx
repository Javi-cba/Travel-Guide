import React from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Drawer, Button } from 'antd';
import { useLugares } from '../../context/drawerLugares';
import CmpLugares from './CmpLugares';
import './lugares.css';
import { usePreferenc } from '../../context/preferences';
import Preferencias from '../preferencias/Preferencias';

const PageRecomnd = () => {
  const { isOpen, hideDrawer } = useLugares();
  const { showPreferenc } = usePreferenc();

  const onClose = () => {
    hideDrawer();
  };

  return (
    <Drawer
      title="Recomendaciones"
      placement="bottom"
      closable={true}
      onClose={onClose}
      open={isOpen}
      height="70vh"
      headerStyle={{ display: 'none' }}
      className="drawer-container"
    >
      <Preferencias />

      <Button icon={<EditOutlined />} onClick={showPreferenc}>
        Editar Preferencias
      </Button>
      <CmpLugares />
    </Drawer>
  );
};
export default PageRecomnd;
