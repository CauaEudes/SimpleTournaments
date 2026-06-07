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

  criar(dados: { nome?: string; descricao?: string; dataInicio?: string; status?: string; criacaoAvancada?: boolean }) {
    if (!dados.nome || !dados.dataInicio) {
      const err = new Error('Campos "nome" e "dataInicio" são obrigatórios') as Error & { status: number };
      err.status = 400;
      throw err;
    }

    const dataHoje = new Date();
    dataHoje.setHours(0, 0, 0, 0);
    const dataInformada = new Date(dados.dataInicio + 'T00:00:00');
    if (dataInformada < dataHoje) {
      const err = new Error('A data de início não pode estar no passado') as Error & { status: number };
      err.status = 400;
      throw err;
    }

    return torneioModel.inserir({
      nome: dados.nome,
      descricao: dados.descricao,
      dataInicio: dados.dataInicio,
      status: dados.status,
      criacaoAvancada: dados.criacaoAvancada,
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
