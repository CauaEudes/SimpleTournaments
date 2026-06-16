import { DatabaseSync } from 'node:sqlite';

export const db = new DatabaseSync('banco.db');

db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS torneios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    data_inicio TEXT NOT NULL,
    status TEXT NOT NULL,
    criacao_avancada INTEGER NOT NULL DEFAULT 0,
    criado_em TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS participantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    torneio_id INTEGER NOT NULL,
    criado_em TEXT NOT NULL,
    FOREIGN KEY (torneio_id) REFERENCES torneios(id) ON DELETE CASCADE
  );
`);
