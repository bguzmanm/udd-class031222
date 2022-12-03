const express = require('express');
const app = express();

require('dotenv').config();

app.get('/', (req, res) => {
  res.send('hola mundo');
});

app.listen(process.env.PORT, () => {
  console.log(`listen in port ${process.env.PORT}`);
})