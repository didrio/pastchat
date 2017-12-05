const express = require('express');
const colors = require('colors');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.status(200).send('Welcome to Past Chat');
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}...`.green));