import { db } from '../db';

export interface Torneio {
  id: number;
  nome: string;
  descricao: string;
  dataInicio: string;
  status: 'aberto' | 'em_andamento' | 'finalizado';
  criacaoAvancada: boolean;
  criadoEm: string;
}

function paraApi(row: any): Torneio | null {
  if (!row) return null;
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    dataInicio: row.data_inicio,
    status: row.status,
    criacaoAvancada: Boolean(row.criacao_avancada),
    criadoEm: row.criado_em,
  };
}

export const torneioModel = {
  listarTodos(): Torneio[] {
    const rows = db.prepare('SELECT * FROM torneios').all();
    return (rows as any[]).map(paraApi) as Torneio[];
  },

  buscarPorId(id: number): Torneio | null {
    const row = db.prepare('SELECT * FROM torneios WHERE id = ?').get(id);
    return paraApi(row);
  },

  inserir(dados: { nome: string; descricao?: string; dataInicio: string; status?: string; criacaoAvancada?: boolean }): Torneio {
    const r = db.prepare(`
      INSERT INTO torneios (nome, descricao, data_inicio, status, criacao_avancada, criado_em)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      dados.nome,
      dados.descricao || '',
      dados.dataInicio,
      dados.status || 'aberto',
      dados.criacaoAvancada ? 1 : 0,
      new Date().toISOString()
    );
    return this.buscarPorId(r.lastInsertRowid as number) as Torneio;
  },

  atualizar(id: number, dados: Partial<Omit<Torneio, 'id'>>): Torneio | null {
    const atual = this.buscarPorId(id);
    if (!atual) return null;
    
    const novo = { ...atual, ...dados };
    db.prepare(`
      UPDATE torneios 
      SET nome = ?, descricao = ?, data_inicio = ?, status = ?, criacao_avancada = ?
      WHERE id = ?
    `).run(
      novo.nome, 
      novo.descricao, 
      novo.dataInicio, 
      novo.status, 
      novo.criacaoAvancada ? 1 : 0, 
      id
    );
    return this.buscarPorId(id);
  },

  remover(id: number): boolean {
    const r = db.prepare('DELETE FROM torneios WHERE id = ?').run(id);
    return r.changes > 0;
  },
};
