import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ajuste o caminho para o arquivo db.json conforme necessário
const filePath = path.join(__dirname, 'db.json');

export function readDB() {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

export function writeDB(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}