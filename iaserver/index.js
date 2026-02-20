const express = require('express');
const cors = require('cors');
const imagesRouter = require('./images/controllers');

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['*'],
  allowedHeaders: ['*']
}));

app.use(express.json());
app.use(imagesRouter);

app.get('/', (req, res) => {
  res.json({ Hello: 'World' });
});

const PORT = 8000;
app.listen(PORT, 'localhost', () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
