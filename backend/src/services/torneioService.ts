import { torneioModel } from '../models/torneio';

export const torneioService = {
  listarTodos() {
    return torneioModel.listarTodos();
  },

  buscarPorId(id: number) {
    const torneio = torneioModel.buscarPorId(id);
    if (!torneio) {
      const err = new Error('Torneio não encontrado') as Error & { status: number };
      err.status = 404;
      throw err;
    }
    return torneio;
  },

  criar(dados: { nome?: string; descricao?: string; dataInicio?: string; status?: string }) {
    if (!dados.nome || !dados.dataInicio) {
      const err = new Error('Campos "nome" e "dataInicio" são obrigatórios') as Error & { status: number };
      err.status = 400;
      throw err;
    }

    return torneioModel.inserir({
      nome: dados.nome,
      descricao: dados.descricao,
      dataInicio: dados.dataInicio,
      status: dados.status,
    });
  },

  atualizar(id: number, dados: Record<string, unknown>) {
    const atualizado = torneioModel.atualizar(id, dados);
    if (!atualizado) {
      const err = new Error('Torneio não encontrado') as Error & { status: number };
      err.status = 404;
      throw err;
    }
    return atualizado;
  },

  remover(id: number) {
    const removido = torneioModel.remover(id);
    if (!removido) {
      const err = new Error('Torneio não encontrado') as Error & { status: number };
      err.status = 404;
      throw err;
    }
  },
};
