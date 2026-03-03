const { genAI } = require('./config/config');
const fs = require('fs');
const { prompt_system } = require('./config/template');

async function processImage(imagePath) {
  if (!imagePath) {
    throw new Error('imagePath debe ser proporcionado');
  }

  if (!fs.existsSync(imagePath)) {
    throw new Error('Imagen no encontrada');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  const imageBytes = fs.readFileSync(imagePath);
  
  const result = await model.generateContent([
    prompt_system,
    {
      inlineData: {
        data: imageBytes.toString('base64'),
        mimeType: 'image/png'
      }
    }
  ]);

  const response = await result.response;
  const text = response.text().trim();
  
  if (!text || (text !== 'Reciclable' && text !== 'No Reciclable')) {
    throw new Error('Respuesta inválida de Gemini');
  }

  return text;
}

module.exports = { processImage };
