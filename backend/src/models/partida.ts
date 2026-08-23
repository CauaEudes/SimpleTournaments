import { db } from '../db';

export interface Partida {
  id: number;
  torneioId: number;
  participante1Id: number;
  participante2Id: number;
  placar1: number | null;
  placar2: number | null;
  finalizada: boolean;
  criadoEm: string;
}

function paraApi(row: any): Partida | null {
  if (!row) return null;
  return {
    id: row.id,
    torneioId: row.torneio_id,
    participante1Id: row.participante1_id,
    participante2Id: row.participante2_id,
    placar1: row.placar1 ?? null,
    placar2: row.placar2 ?? null,
    finalizada: row.finalizada === 1,
    criadoEm: row.criado_em,
  };
}

export const partidaModel = {
  listarPorTorneio(torneioId: number): Partida[] {
    const rows = db.prepare('SELECT * FROM partidas WHERE torneio_id = ?').all(torneioId);
    return (rows as any[]).map(paraApi) as Partida[];
  },

  buscarPorId(id: number): Partida | null {
    const row = db.prepare('SELECT * FROM partidas WHERE id = ?').get(id);
    return paraApi(row);
  },

  inserir(dados: { torneioId: number; participante1Id: number; participante2Id: number }): Partida {
    const r = db.prepare(`
      INSERT INTO partidas (torneio_id, participante1_id, participante2_id, criado_em)
      VALUES (?, ?, ?, ?)
    `).run(
      dados.torneioId,
      dados.participante1Id,
      dados.participante2Id,
      new Date().toISOString()
    );
    return this.buscarPorId(r.lastInsertRowid as number) as Partida;
  },

  atualizarPlacar(id: number, placar1: number, placar2: number): Partida | null {
    db.prepare(`
      UPDATE partidas SET placar1 = ?, placar2 = ?, finalizada = 1 WHERE id = ?
    `).run(placar1, placar2, id);
    return this.buscarPorId(id);
  },

  removerPorTorneio(torneioId: number): boolean {
    const r = db.prepare('DELETE FROM partidas WHERE torneio_id = ?').run(torneioId);
    return r.changes > 0;
  },
};
