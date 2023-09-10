
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://batadatabase:Santizo.26017@cluster0.yrypwdx.mongodb.net/server', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  user: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());

app.post('/proyecto/login/:DPI', async (req, res) => {
  const { user, password } = req.body;

  if (user === 'admin' && password === 'admin') {
    // Generar un token
    const token = jwt.sign({ user }, 'secret', { expiresIn: '1h' });

    res.json({ token });
  } else {
    res.status(401).json({ message: 'Datos invalidos' });
  }
});

const verifyToken = (req, res, next) => {
  const token = req.headers['token'];

  if (!token) {
    return res.status(403).json({ message: 'Token faltante' });
  }

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token faltante' });
    }
    req.user = decoded.user;
    next();
  });
};

app.get('/proyecto/data', verifyToken, (req, res) => {
  const user = 'admin';
  const password = 'admin';

  res.json({ user, password });
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
