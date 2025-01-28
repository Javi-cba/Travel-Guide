import axios from 'axios';

const URL = import.meta.env.VITE_URL;

export const getRecomendaciones = async email => {
  try {
    console.log(URL);
    const response = await axios.post(
      `${URL}/recomendaciones/usuario?email=${email}`
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error en getRecomendaciones:', error);
    throw error;
  }
};
