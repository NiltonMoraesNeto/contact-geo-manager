import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import resetPasswordRoutes from './routes/resetPasswordRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const port = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração do middleware CORS
app.use(cors({
  origin: 'http://localhost:5173' // Permita a origem do seu frontend
}));

app.use(express.json());

app.use('/api/usuarios', authRoutes);
app.use('/api/usuarios', resetPasswordRoutes);
app.use('/api/usuarios', userRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});