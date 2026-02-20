const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { processImage } = require('./services');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'temp_images';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(new Error('Solo PNG y JPEG permitidos'));
    }
  }
});

router.post('/upload-image/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió archivo' });
    }

    const fileLocation = path.join('temp_images', req.file.originalname);
    
    const response = await processImage(fileLocation);
    
    fs.unlinkSync(fileLocation);
    
    res.json({ result: response });
    
  } catch (error) {
    console.error('Error procesando imagen:', error.message);
    
    if (req.file) {
      const fileLocation = path.join('temp_images', req.file.originalname);
      if (fs.existsSync(fileLocation)) {
        fs.unlinkSync(fileLocation);
      }
    }
    
    if (error.message.includes('Solo PNG y JPEG')) {
      return res.status(400).json({ error: 'Tipo de archivo inválido. Solo PNG y JPEG permitidos.' });
    }
    
    res.status(500).json({ error: 'Error procesando la imagen' });
  }
});

module.exports = router;
