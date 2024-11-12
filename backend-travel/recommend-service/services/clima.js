const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const CLIMAURL = process.env.CLIMA_URL;
const KEYAPI = process.env.CLIMA_API_KEY;

const getNombreDia = fecha => {
  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const dia = new Date(fecha).getDay();
  return diasSemana[dia];
};

const processClima = async ({ lat, lng }) => {
  try {
    // Obtiene las coordenadas usando la Geocoding API
    const climaResp = await axios.get(CLIMAURL, {
      params: {
        lat: lat,
        lon: lng,
        key: KEYAPI,
        units: 'auto',
        timezone: 'UTC',
        language: 'en',
        sections: 'daily',
      },
    });
    const clima = climaResp.data.daily.data.map(day => ({
      fecha: day.day,
      dia: getNombreDia(day.day),
      estadoClima: day.weather,
      descripcion: day.summary,
      icono: `../../../public/icons/${day.icon}.png`,
      temperatura: {
        promedio: day.all_day.temperature,
        minima: day.all_day.temperature_min,
        maxima: day.all_day.temperature_max,
      },
      viento: {
        velocidad: day.all_day.wind.speed,
        direccion: day.all_day.wind.dir,
        angulo: day.all_day.wind.angle,
      },
      nubosidad: day.all_day.cloud_cover.total,
      precipitacion: {
        total: day.all_day.precipitation.total,
        tipo: day.all_day.precipitation.type,
      },
    }));

    return { clima };
  } catch (error) {
    console.error('Error al obtener información del lugar:', error);
    return null;
  }
};

// Nueva función para procesar una lista de lugares
const getInfoClima = async data => {
  const results = await Promise.all(
    data.map(async lugar => {
      const info = await processClima({ lat: lugar.lat, lng: lugar.lng });
      return { ...lugar, ...info }; // objeto original + nueva información
    })
  );

  return results;
};

module.exports = { getInfoClima, processClima };
