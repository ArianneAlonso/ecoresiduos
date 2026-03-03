require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GENAI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

module.exports = { genAI };
