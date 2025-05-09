import express from 'express';
import jwt from 'jsonwebtoken';
import { readDB } from '../db.js';

const router = express.Router();
const secretKey = 'your-secret-key'; // Use uma chave secreta segura e armazene-a em um lugar seguro

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.usuarios.find(
    usuario => usuario.email === email && usuario.password === password
  );
  if (user) {
    const token = jwt.sign({ id: user.id, email: user.email, perfil: user.perfil, cep: user.cep, nome: user.nome, avatar: user.avatar }, secretKey, { expiresIn: '24h' });
    res.json({ token, user });
  } else {
    res.status(401).send('Email ou senha inválidos');
  }
});

export default router;