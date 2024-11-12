import axios from 'axios';

const URL = import.meta.env.VITE_URL;

export const getPreferencias = async () => {
  try {
    const response = await axios.get(`${URL}/preferencias/get`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las preferencias:', error);
    throw error;
  }
};
