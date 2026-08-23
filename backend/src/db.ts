import { DatabaseSync } from 'node:sqlite';

export const db = new DatabaseSync('banco.db');

db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    criado_em TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS torneios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    data_inicio TEXT NOT NULL,
    status TEXT NOT NULL,
    campos_obrigatorios TEXT DEFAULT '',
    usuario_id INTEGER NOT NULL,
    criado_em TEXT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS participantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    informacoes TEXT DEFAULT '',
    discord TEXT,
    torneio_id INTEGER NOT NULL,
    criado_em TEXT NOT NULL,
    FOREIGN KEY (torneio_id) REFERENCES torneios(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS partidas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    torneio_id INTEGER NOT NULL,
    participante1_id INTEGER NOT NULL,
    participante2_id INTEGER NOT NULL,
    placar1 INTEGER,
    placar2 INTEGER,
    finalizada INTEGER DEFAULT 0,
    criado_em TEXT NOT NULL,
    FOREIGN KEY (torneio_id) REFERENCES torneios(id) ON DELETE CASCADE,
    FOREIGN KEY (participante1_id) REFERENCES participantes(id) ON DELETE CASCADE,
    FOREIGN KEY (participante2_id) REFERENCES participantes(id) ON DELETE CASCADE
  );
`);

try {
  db.exec(`ALTER TABLE torneios ADD COLUMN campos_obrigatorios TEXT DEFAULT '';`);
} catch (_) {}

try {
  db.exec(`ALTER TABLE participantes ADD COLUMN informacoes TEXT DEFAULT '';`);
} catch (_) {}

try {
  db.exec(`ALTER TABLE participantes ADD COLUMN discord TEXT;`);
} catch (_) {}
