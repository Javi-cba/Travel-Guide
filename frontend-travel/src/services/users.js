import axios from 'axios';

const URL = import.meta.env.VITE_URL;

export const postUser = async userObj => {
  try {
    const response = await axios.post(`${URL}/usuarios/crear`, userObj);

    return response.data.message;
  } catch (error) {
    console.error('Error en postUser:', error);
    if (error.response.data.message) {
      throw new Error(error.response.data.message);
    }
  }
};

export const putUser = async userObj => {
  try {
    const response = await axios.put(`${URL}/usuarios/modificar`, userObj);

    return response.data.message;
  } catch (error) {
    console.error('Error en putUser:', error);
    if (error.response.data.message) {
      throw new Error(error.response.data.message);
    }
  }
};

export const getExistUser = async email => {
  try {
    const response = await axios.get(`${URL}/usuarios/valida-existe`, {
      params: {
        email: email,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error en getExistUser:', error);
  }
};

export const getUserByEmail = async email => {
  try {
    const response = await axios.get(`${URL}/usuarios/buscar-email`, {
      params: {
        email: email,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error en getUserByEmail:', error);
  }
};
