const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const URL_OPENAI = process.env.URL_OPENAI;
const KEY_OPENAI = process.env.OPENAI_API_KEY;

async function getAIResponse(prompt) {
  try {
    if (!URL_OPENAI || !KEY_OPENAI) {
      throw new Error('Faltan las variables URL_OPENAI / OPENAI_API_KEY');
    }

    const response = await axios.post(
      URL_OPENAI,
      {
        model: process.env.OPENAI_MODEL || 'gpt-5.4-mini',
        messages: [{ role: 'system', content: prompt }],
        max_tokens: 1100,
      },
      {
        headers: {
          Authorization: `Bearer ${KEY_OPENAI}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data);

    // Devuelve la respuesta en formato JSON
    return response.data;
  } catch (error) {
    console.error('Error al enviar el prompt a OpenAI:', error.message);
    throw error;
  }
}

module.exports = { getAIResponse };
