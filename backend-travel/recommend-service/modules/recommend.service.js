const { getAIResponse } = require('../services/serviceIA');
const { getInfoLugares } = require('../services/googleMaps');
const { getInfoClima } = require('../services/clima');
const axios = require('axios');

const URL_USER = process.env.URL_USER;

// DEVUELVE UNA RECOMENDACION DE LUGARES
async function getByUser(email) {
  try {
    const resp = await axios.get(`${URL_USER}/buscar-email?email=${email}`);
    console.log(resp.data);

    if (!resp.data) {
      throw new Error('Usuario no encontrado');
    }
    const user = resp.data;

    // Realiza la solicitud a la IA
    const respIA = await getAIResponse(
      'Crea un JSON con 10 destinos según las preferencias y características del siguiente usuario: ' +
        JSON.stringify(user) +
        '. Los destinos deben ser recomendados en relación al presupuesto del usuario. ' +
        `Si el usuario tiene un presupuesto bajo, se deben recomendar destinos CERCANOS a su ubicación (${user.ubicacion}) (no mas de 400km de distancia). ` +
        'Si el usuario tiene un presupuesto alto, se deben recomendar destinos más lejanos. ' +
        ` TAMBIEN los destinos deben ser recomendados en relación a las PREFERENCIAS del usuario (${user.preferencias.preferencias}). ` +
        'El esquema de respuesta debe seguir este formato: {"nombre": "String", "descripcion": "String", "categoria": ["String"]}, El nombre del lugar debe contener el nombre de la ciudad, la provincia o y el pais. ' +
        'Solo devuelve el JSON válido y puro, sin formato adicional como etiquetas de código (por ejemplo, no incluyas "```json" o comillas invertidas).'
    );
    const content = respIA.choices[0].message.content;
    const dataIA = JSON.parse(content);

    const data = await getInfoLugares(dataIA); // obtiene las cordenadas e imagen
    const recommendations = await getInfoClima(data); // obtiene el clima

    return recommendations; // Resuelve la promesa con las recomendaciones
  } catch (error) {
    console.error('Error realizando la solicitud a la IA:', error);
  }
}

module.exports = { getByUser };
