require('dotenv').config();

const express = require('express');
const cors = require('cors');

const testeRoute = require('./routes/teste');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.use('/api/teste', testeRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
