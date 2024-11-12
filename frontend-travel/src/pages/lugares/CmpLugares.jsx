import React, { useEffect, useState } from 'react';
import { Card, Flex, Image } from 'antd';
import { CloudOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useAuth0 } from '@auth0/auth0-react';
import './lugares.css';
import CmpClima from './CmpClima';
import { useRecomend } from '../../context/recomend';

const CmpLugares = () => {
  const { cargarRecomendaciones, lugares, loadRec, centrarMapa } =
    useRecomend();
  const [selectedLugar, setselectedLugar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated, user } = useAuth0();

  useEffect(() => {
    cargarRecomendaciones();
  }, [isAuthenticated, user]);

  const openClimaModal = clima => {
    setselectedLugar(clima);
    setIsModalOpen(true);
  };

  const closeClimaModal = () => {
    setIsModalOpen(false);
    setselectedLugar(null);
  };

  return (
    <>
      {!loadRec ? (
        <Flex wrap justify="center" className="lugares-container">
          {lugares.map((item, index) => (
            <Card
              key={index}
              hoverable
              className="card"
              cover={
                <Image
                  width={'100%'}
                  height={'14rem'}
                  style={{ objectFit: 'cover' }}
                  alt={item.nombre}
                  src={item.imageUrl}
                />
              }
              actions={[
                <CloudOutlined
                  onClick={() => openClimaModal(item)}
                  className="iconAction"
                />,
                <EnvironmentOutlined
                  onClick={() => centrarMapa(item)}
                  className="iconAction"
                />,
              ]}
            >
              <div className="card-content">
                <h3>{item.nombre}</h3>
                <p>{item.descripcion}</p>

                <Flex justify="start" align="center" gap="small" wrap>
                  {item.categoria.slice(0, 5).map((item, index) => (
                    <label key={index} className="tag">
                      {item}
                    </label>
                  ))}
                </Flex>
              </div>
            </Card>
          ))}
        </Flex>
      ) : (
        <Flex wrap gap="small" justify="center">
          <Card loading={loadRec} className="card"></Card>
          <Card loading={loadRec} className="card"></Card>
          <Card loading={loadRec} className="card"></Card>
        </Flex>
      )}
      {selectedLugar && (
        <CmpClima
          lugar={selectedLugar}
          isOpen={isModalOpen}
          onClose={closeClimaModal}
        />
      )}
    </>
  );
};

export default CmpLugares;
