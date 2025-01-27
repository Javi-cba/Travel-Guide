const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const GEOCODE_URL = process.env.GEOCODE_URL;
const PLACES_URL = process.env.PLACES_URL;
const DETAILS_URL = process.env.DETAILS_URL;
const PHOTO_URL = process.env.PHOTO_URL;
const KEYAPI = process.env.KEY_GOOGLE_MAPS;

const processLugares = async nombre => {
  try {
    // Obtiene las coordenadas usando la Geocoding API
    const geocodeResponse = await axios.get(GEOCODE_URL, {
      params: {
        address: nombre,
        key: KEYAPI,
      },
    });

    const location = geocodeResponse.data.results[0]?.geometry.location;
    if (!location) return null;

    const { lat, lng } = location;

    // Obtiene el place_id del lugar usando Places API
    const placeResponse = await axios.get(PLACES_URL, {
      params: {
        input: nombre,
        inputtype: 'textquery',
        fields: 'place_id',
        key: KEYAPI,
      },
    });

    const place = placeResponse.data.candidates[0];
    if (!place) return null;

    const { place_id } = place;

    // Obtiene detalles del lugar usando place_id para acceder a las fotos
    const detailsResponse = await axios.get(DETAILS_URL, {
      params: {
        place_id: place_id,
        fields: 'photos',
        key: KEYAPI,
      },
    });

    const photoReference =
      detailsResponse.data.result.photos?.[0]?.photo_reference;
    if (!photoReference) return { lat, lng, imageUrl: null };

    // Generamos la URL de la imagen usando el photo_reference
    const imageUrl = `${PHOTO_URL}?maxwidth=400&photoreference=${photoReference}&key=${KEYAPI}`;

    return {
      lat,
      lng,
      imageUrl,
    };
  } catch (error) {
    console.error('Error al obtener información del lugar:', error);
    return null;
  }
};

// Nueva función para procesar una lista de lugares
const getInfoLugares = async data => {
  const results = await Promise.all(
    data.map(async lugar => {
      const info = await processLugares(lugar.nombre);
      return { ...lugar, ...info }; // objeto original + nueva información
    })
  );

  return results;
};

module.exports = { getInfoLugares, processLugares };
