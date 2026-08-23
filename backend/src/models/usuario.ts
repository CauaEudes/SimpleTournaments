import { db } from '../db';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  criadoEm: string;
}

export type UsuarioSemSenha = Omit<Usuario, 'senha'>;

function paraApi(row: any): Usuario | null {
  if (!row) return null;
  return {
    id: row.id,
    nome: row.nome,
    email: row.email,
    senha: row.senha,
    criadoEm: row.criado_em,
  };
}

function semSenha(u: Usuario): UsuarioSemSenha {
  const { senha: _, ...rest } = u;
  return rest;
}

export const usuarioModel = {
  listarTodos(): UsuarioSemSenha[] {
    const rows = db.prepare('SELECT * FROM usuarios').all();
    return (rows as any[]).map(paraApi).filter(Boolean).map(u => semSenha(u!));
  },

  buscarPorId(id: number): Usuario | null {
    const row = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(id);
    return paraApi(row);
  },

  buscarPorEmail(email: string): Usuario | null {
    const row = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
    return paraApi(row);
  },

  inserir(dados: { nome: string; email: string; senha: string }): UsuarioSemSenha {
    const r = db.prepare(`
      INSERT INTO usuarios (nome, email, senha, criado_em)
      VALUES (?, ?, ?, ?)
    `).run(dados.nome, dados.email, dados.senha, new Date().toISOString());
    const u = this.buscarPorId(r.lastInsertRowid as number)!;
    return semSenha(u);
  },
};
