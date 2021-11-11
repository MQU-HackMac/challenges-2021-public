import express from 'express';
import path from 'path';

const app = express();

app.use(express.static('./build'));

app.get('/', function (req, res) {
  res.sendFile('./build/index.html');
});

app.listen(5000, '0.0.0.0', () => {
  console.log('listening');
});

