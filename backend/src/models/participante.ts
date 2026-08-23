import { db } from '../db';

export interface Participante {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
  informacoes?: string;
  discord?: string;
  torneioId: number;
  criadoEm: string;
}

function paraApi(row: any): Participante | null {
  if (!row) return null;
  return {
    id: row.id,
    nome: row.nome,
    email: row.email,
    telefone: row.telefone,
    informacoes: row.informacoes || '',
    discord: row.discord || '',
    torneioId: row.torneio_id,
    criadoEm: row.criado_em,
  };
}

export const participanteModel = {
  listarTodos(): Participante[] {
    const rows = db.prepare('SELECT * FROM participantes').all();
    return (rows as any[]).map(paraApi) as Participante[];
  },

  listarPorTorneio(torneioId: number): Participante[] {
    const rows = db.prepare('SELECT * FROM participantes WHERE torneio_id = ?').all(torneioId);
    return (rows as any[]).map(paraApi) as Participante[];
  },

  buscarPorId(id: number): Participante | null {
    const row = db.prepare('SELECT * FROM participantes WHERE id = ?').get(id);
    return paraApi(row);
  },

  inserir(dados: { nome: string; email?: string; telefone?: string; informacoes?: string; discord?: string; torneioId: number }): Participante {
    const r = db.prepare(`
      INSERT INTO participantes (nome, email, telefone, informacoes, discord, torneio_id, criado_em)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      dados.nome,
      dados.email || null,
      dados.telefone || null,
      dados.informacoes || '',
      dados.discord || null,
      dados.torneioId,
      new Date().toISOString()
    );
    return this.buscarPorId(r.lastInsertRowid as number) as Participante;
  },

  atualizar(id: number, dados: Partial<Omit<Participante, 'id'>>): Participante | null {
    const atual = this.buscarPorId(id);
    if (!atual) return null;

    const novo = { ...atual, ...dados };
    db.prepare(`
      UPDATE participantes
      SET nome = ?, email = ?, telefone = ?, informacoes = ?, discord = ?, torneio_id = ?
      WHERE id = ?
    `).run(
      novo.nome,
      novo.email || null,
      novo.telefone || null,
      novo.informacoes || '',
      novo.discord || null,
      novo.torneioId,
      id
    );
    return this.buscarPorId(id);
  },

  remover(id: number): boolean {
    const r = db.prepare('DELETE FROM participantes WHERE id = ?').run(id);
    return r.changes > 0;
  },
};
