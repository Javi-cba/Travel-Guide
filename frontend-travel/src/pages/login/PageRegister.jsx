import { useState, useEffect } from 'react';
import { Modal, Space, Radio, Checkbox, Button, message, Steps } from 'antd';
import { getPreferencias } from '../../services/preferencias';
import { postUser } from '../../services/users';
import { useAuth0 } from '@auth0/auth0-react';
import { LoadingOutlined } from '@ant-design/icons';
import { useLugares } from '../../context/drawerLugares';
import './modal.css';

const PageRegister = () => {
  const { user } = useAuth0();
  const [open, setOpen] = useState(true);
  const { showDrawer } = useLugares();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [objPrefSelected, setObjPrefSelected] = useState(null);
  const [preferences, setPreferences] = useState([]);
  const [current, setCurrent] = useState(0);

  // Mi objeto Usuario
  const [userPref, setUserPref] = useState({
    nombre: user.name,
    email: user.email,
    preferencias: {
      tipoDeAventurero: '',
      preferencias: [],
      presupuesto: 'bajo',
      destinosFavoritos: [],
    },
    historialViajes: [],
  });

  useEffect(() => {
    const fetchPreferences = async () => {
      const resp = await getPreferencias();
      setPreferences(resp);
    };
    fetchPreferences();
  }, []);

  const options = preferences.map(pref => ({
    label: pref.tipoDeAventurero,
    value: pref,
  }));

  const options2 = objPrefSelected
    ? objPrefSelected.map(pref => ({
        label: pref,
        value: pref,
      }))
    : [];

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      const resp = await postUser(userPref);
      message.success(resp);

      showDrawer();
    } catch (error) {
      message.error(error.message);
    }
    setConfirmLoading(false);
  };

  const handleSelectedPref = e => {
    setObjPrefSelected(e.target.value.preferencias);
    setUserPref(prev => ({
      ...prev,
      preferencias: {
        ...prev.preferencias,
        tipoDeAventurero: e.target.value.tipoDeAventurero,
      },
    }));
  };

  const handleCheckboxChange = checkedValues => {
    setUserPref(prev => ({
      ...prev,
      preferencias: {
        ...prev.preferencias,
        preferencias: checkedValues,
      },
    }));
    console.log(userPref);
  };

  const handlePresupuesto = e => {
    setUserPref(prev => ({
      ...prev,
      preferencias: {
        ...prev.preferencias,
        presupuesto: e.target.value,
      },
    }));
  };

  const next = () => {
    if (objPrefSelected === null) {
      message.warning('Debes seleccionar un tipo de aventurero');
      return;
    }

    if (current == 1 && userPref.preferencias.preferencias.length == 0) {
      message.warning('Debes seleccionar al menos una preferencia');
      return;
    }

    if (current == 1) {
      handleOk();
      return;
    }

    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  // STEPS DE REGISTRO
  const steps = [
    {
      title: 'Tipo de Viajero',
      content: 'Tipo de Viajero Content',
    },
    {
      title: 'Preferencias',
      content: 'Preferencias Content',
    },
    {
      title: 'Confirmación',
      status: 'process',
      icon: confirmLoading ? <LoadingOutlined /> : null,
    },
  ];

  const items = steps.map(item => ({
    key: item.title,
    title: item.title,
  }));

  const renderStepContent = () => {
    switch (current) {
      case 0:
        return (
          <Radio.Group
            onChange={handleSelectedPref}
            optionType="button"
            buttonStyle="solid"
          >
            {options.map(option => (
              <Radio.Button key={option.value._id} value={option.value}>
                {option.label}
              </Radio.Button>
            ))}
          </Radio.Group>
        );
      case 1:
        return (
          <>
            <div>
              <h3>
                Preferencias para {userPref.preferencias.tipoDeAventurero}
              </h3>
              <Checkbox.Group
                onChange={handleCheckboxChange}
                options={options2}
                value={userPref.preferencias.preferencias}
              />
            </div>
            <div>
              <h3>Presupuesto</h3>
              <Radio.Group
                optionType="button"
                buttonStyle="solid"
                defaultValue="bajo"
                onChange={handlePresupuesto}
              >
                <Radio.Button value="bajo">Bajo</Radio.Button>
                <Radio.Button value="medio">Medio</Radio.Button>
                <Radio.Button value="alto">Alto</Radio.Button>
              </Radio.Group>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      title="Seleccione sus preferencias"
      confirmLoading={confirmLoading}
      open={open}
      width={'60rem'}
      footer={null}
      onCancel={() => setOpen(false)}
      className="custom-modal"
    >
      <Steps current={current} items={items} />
      <Space wrap size={10} style={{ minHeight: '15rem', padding: '0.5rem' }}>
        {renderStepContent()}
      </Space>
      <div
        style={{
          marginTop: 24,
        }}
      >
        {current < steps.length - 1 && (
          <Button
            type="primary"
            onClick={next}
            icon={confirmLoading ? <LoadingOutlined /> : null}
          >
            {current === steps.length - 2 ? 'Confirmar' : 'Siguiente'}
          </Button>
        )}

        {current > 0 && (
          <Button
            style={{
              margin: '0 8px',
            }}
            onClick={prev}
          >
            Volver
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default PageRegister;
