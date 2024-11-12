const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

URL_OPENAI = process.env.URL_OPENAI;
KEY_OPENAI = process.env.OPENAI_API_KEY;

async function getAIResponse(prompt) {
  try {
    const response = await axios.post(
      URL_OPENAI,
      {
        model: 'gpt-4o-mini',
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

    // Devuelve la respuesta en formato JSON
    return response.data;
  } catch (error) {
    console.error('Error al enviar el prompt a OpenAI:', error);
    throw error;
  }
}

module.exports = { getAIResponse };
