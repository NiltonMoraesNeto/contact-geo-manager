import express from 'express';
import { readDB, writeDB } from '../db.js';

const router = express.Router();

function generateResetCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const db = readDB();
  const user = db.usuarios.find(usuario => usuario.email === email);

  if (!user) {
    
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  const resetCode = generateResetCode();

  // Aqui, a gente salva o código no banco de dados
  user.resetCode = resetCode;
  writeDB(db);

  res.status(200).json({ resetCode });
});

router.put('/reset-password', (req, res) => {
  const { email, resetCode, newPassword } = req.body;
  const db = readDB();
  const user = db.usuarios.find(usuario => usuario.email === email);

  if (!user || user.resetCode !== resetCode) {
    return res.status(400).json({ message: 'Código de redefinição inválido ou expirado' });
  }

  user.password = newPassword;
  writeDB(db);

  res.status(200).json({ message: 'Senha alterada com sucesso' });
});

router.put('/clean-resetCode', (req, res) => {
  const { email, resetCode } = req.body;
  const db = readDB();
  const user = db.usuarios.find(usuario => usuario.email === email);

  if (!user || user.resetCode !== resetCode) {
    return res.status(400).json({ message: 'Código de redefinição inválido ou expirado' });
  }

  user.resetCode = "";
  writeDB(db);

  res.status(200).json({ message: 'ResetCode deletado com sucesso' });
});


export default router;