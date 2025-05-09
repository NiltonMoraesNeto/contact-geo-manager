import express from 'express';
import { readDB, writeDB } from '../db.js';

const router = express.Router();

router.get('/filterById', (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  const db = readDB();
  const user = db.usuarios.find(usuario => usuario.id === id);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "Usuário não encontrado" });
  }
});

router.get('/list', (req, res) => {
  const db = readDB();
  const usuarios = db.usuarios;

  const userId = parseInt(req.headers['user-id'], 10);
  if (!userId) {
    return res.status(400).json({ error: 'ID do usuário logado não fornecido.' });
  }

  // Obtenha os parâmetros de consulta page, totalItemsByPage e search
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const totalItemsByPage = Math.max(parseInt(req.query.totalItemsByPage, 10) || 10, 1);
  const search = req.query.search?.toLowerCase() || '';

  // Filtrar os usuários criados pelo usuário logado e com base na consulta de pesquisa
  const filteredUsuarios = usuarios.filter(user =>
    user.IdUserCreate === userId && // Filtrar pelo usuário criador
    (
      (user.nome && user.nome.toLowerCase().includes(search)) ||
      (user.email && user.email.toLowerCase().includes(search)) ||
      (user.cpf && user.cpf.includes(search))
    )
  );

  // Calcular o total de itens filtrados
  const total = filteredUsuarios.length;

  // Calcular os índices de início e fim dos itens a serem retornados com base na paginação
  const startIndex = (page - 1) * totalItemsByPage;
  const endIndex = startIndex + totalItemsByPage;

  // Extrair os itens referentes à página atual
  const paginatedUsuarios = filteredUsuarios.slice(startIndex, endIndex);

  const response = {
    total,
    usuarios: paginatedUsuarios,
  };

  res.json(response);
});

router.post("/new", (req, res) => {
  const {
    nome,
    cpf,
    telefone,
    cep,
    endereco,
    numero,
    complemento,
    cidade,
    estado,
    latitude,
    longitude,
    password,
    email,
    IdUserCreate, // Adicionando IdUserCreate
  } = req.body;

  // Validação básica
  if (
    !nome ||
    !cpf ||
    !telefone ||
    !cep ||
    !endereco ||
    !numero ||
    !cidade ||
    !estado ||
    !latitude ||
    !longitude ||
    !password ||
    !email
  ) {
    return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos" });
  }

  // Validação do formato do e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Formato de e-mail inválido" });
  }

  const db = readDB();

  // Verificar se o CPF ou e-mail já estão cadastrados
  const cpfExists = db.usuarios.some((user) => user.cpf === cpf);
  const emailExists = db.usuarios.some((user) => user.email === email);

  if (cpfExists) {
    return res.status(400).json({ error: "CPF já cadastrado" });
  }

  if (emailExists) {
    return res.status(400).json({ error: "E-mail já cadastrado" });
  }

  const newUsuario = {
    id: db.usuarios.length + 2,
    nome,
    cpf,
    telefone,
    cep,
    endereco,
    numero,
    complemento: complemento || "", // Campo opcional
    cidade,
    estado,
    latitude,
    longitude,
    password,
    email,
    IdUserCreate, // Incluindo o ID do criador
    resetCode: "", // Campo resetCode vazio
  };

  db.usuarios.push(newUsuario);
  writeDB(db);

  res.status(201).json({ message: "Usuário criado com sucesso", newUsuario });
});

router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ error: 'Descrição é obrigatória' });
  }

  const db = readDB();
  const usuarioIndex = db.usuarios.findIndex(usuarios => usuarios.id === id);

  if (usuarioIndex === -1) {
    return res.status(404).json({ error: 'Usuario não encontrado' });
  }

  db.usuarios[usuarioIndex].nome = nome;
  writeDB(db);

  res.status(200).json({ message: 'Usuario atualizado com sucesso', usuarios: db.usuarios[usuarioIndex] });
});

router.delete('/deletar/:id', (req, res) => {
  const { id } = req.params; // ID do usuário a ser deletado
  const { password, loggedUserId } = req.body; // Senha do usuário logado e ID do usuário logado
  const db = readDB(); // Lê o banco de dados em memória

  // Converte o ID do usuário a ser deletado para número
  const userIdToDelete = parseInt(id, 10);

  // Localiza o usuário logado pelo ID
  const loggedUser = db.usuarios.find((usuario) => usuario.id === loggedUserId);
  if (!loggedUser) {
    return res.status(404).json({ error: 'Usuário logado não encontrado.' });
  }

  // Valida a senha do usuário logado
  if (loggedUser.password !== password) {
    return res.status(401).json({ error: 'Senha do usuário logado incorreta.' });
  }

  // Localiza o usuário a ser deletado
  const usuarioIndex = db.usuarios.findIndex((usuario) => usuario.id === userIdToDelete);
  if (usuarioIndex === -1) {
    return res.status(404).json({ error: 'Usuário a ser deletado não encontrado.' });
  }

  const usuarioDeletado = db.usuarios[usuarioIndex];

  // Remove o usuário principal
  db.usuarios.splice(usuarioIndex, 1);

  // Se o usuário deletado for o mesmo que o usuário logado, remove também os subordinados
  if (usuarioDeletado.id === loggedUserId) {
    db.usuarios = db.usuarios.filter((usuario) => usuario.IdUserCreate !== loggedUserId);
  }

  // Salva as alterações no banco de dados
  writeDB(db);

  return res
    .status(200)
    .json({ message: 'Usuário e seus subordinados deletados com sucesso.' });
});

router.get('/byId/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();

  const usuario = db.usuarios.find(
    (usuario) => usuario.id.toString() === id.toString()
  );

  if (!usuario) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  res.status(200).json(usuario);
});

router.patch('/updateUser/:id', (req, res) => {
  const { id } = req.params; // ID do usuário a ser atualizado
  const { IdUserCreate } = req.body; // Novo valor de IdUserCreate

  const db = readDB(); // Lê o banco de dados em memória
  const usuarios = db.usuarios;

  // Localiza o usuário pelo ID
  const usuarioIndex = usuarios.findIndex(user => user.id === parseInt(id, 10));
  if (usuarioIndex === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  // Atualiza o campo IdUserCreate do usuário
  usuarios[usuarioIndex].IdUserCreate = IdUserCreate;

  // Salva as alterações no banco de dados
  db.usuarios = usuarios;
  writeDB(db);

  return res.json({ message: 'IdUserCreate atualizado com sucesso.', usuario: usuarios[usuarioIndex] });
});

router.patch("/editById/:id", (req, res) => {
  const { id } = req.params; // ID do usuário
  const updates = req.body; // Dados enviados pelo cliente
  const db = readDB(); // Lê o "banco de dados"

  // Encontra o usuário pelo ID
  const userIndex = db.usuarios.findIndex((usuario) => usuario.id.toString() === id);

  if (userIndex === -1) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  // Atualiza os campos fornecidos no body
  const updatedUser = { ...db.usuarios[userIndex], ...updates };
  db.usuarios[userIndex] = updatedUser;

  writeDB(db); // Salva as alterações no "banco de dados"

  return res.status(200).json(updatedUser);
});

export default router;