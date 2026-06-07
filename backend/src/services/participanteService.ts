import { participanteModel } from '../models/participante';

export const participanteService = {
  listarTodos() {
    return participanteModel.listarTodos();
  },

  buscarPorId(id: number) {
    const participante = participanteModel.buscarPorId(id);
    if (!participante) {
      const err = new Error('Participante não encontrado') as Error & { status: number };
      err.status = 404;
      throw err;
    }
    return participante;
  },

  criar(dados: { nome?: string; email?: string }) {
    if (!dados.nome || !dados.email) {
      const err = new Error('Campos "nome" e "email" são obrigatórios') as Error & { status: number };
      err.status = 400;
      throw err;
    }

    if (participanteModel.existeEmail(dados.email)) {
      const err = new Error('Já existe um participante com este e-mail') as Error & { status: number };
      err.status = 409;
      throw err;
    }

    return participanteModel.inserir({ nome: dados.nome, email: dados.email });
  },

  atualizar(id: number, dados: Record<string, unknown>) {
    const atualizado = participanteModel.atualizar(id, dados);
    if (!atualizado) {
      const err = new Error('Participante não encontrado') as Error & { status: number };
      err.status = 404;
      throw err;
    }
    return atualizado;
  },

  remover(id: number) {
    const removido = participanteModel.remover(id);
    if (!removido) {
      const err = new Error('Participante não encontrado') as Error & { status: number };
      err.status = 404;
      throw err;
    }
  },
};
