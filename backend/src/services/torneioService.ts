import { torneioModel } from '../models/torneio';

export const torneioService = {
  listarTodos(usuarioId?: string) {
    if (usuarioId) {
      return torneioModel.listarPorUsuario(Number(usuarioId));
    }
    return torneioModel.listarTodos();
  },

  buscarPorId(id: number) {
    const torneio = torneioModel.buscarPorId(id);
    if (!torneio) {
      const err = new Error('Torneio não encontrado.') as Error & { status: number };
      err.status = 404;
      throw err;
    }
    return torneio;
  },

  criar(dados: { nome?: string; descricao?: string; dataInicio?: string; status?: string; camposObrigatorios?: string; usuarioId?: number }) {
    if (!dados.nome || !dados.dataInicio) {
      const err = new Error('Preencha o nome e a data de início do torneio.') as Error & { status: number };
      err.status = 400;
      throw err;
    }

    if (!dados.usuarioId) {
      const err = new Error('É necessário estar logado para criar um torneio.') as Error & { status: number };
      err.status = 400;
      throw err;
    }

    const dataHoje = new Date();
    dataHoje.setHours(0, 0, 0, 0);
    const dataInformada = new Date(dados.dataInicio + 'T00:00:00');
    if (dataInformada < dataHoje) {
      const err = new Error('A data de início não pode estar no passado. Escolha hoje ou uma data futura.') as Error & { status: number };
      err.status = 400;
      throw err;
    }

    return torneioModel.inserir({
      nome: dados.nome.trim(),
      descricao: dados.descricao?.trim(),
      dataInicio: dados.dataInicio,
      status: dados.status,
      camposObrigatorios: dados.camposObrigatorios?.trim() || '',
      usuarioId: dados.usuarioId,
    });
  },

  atualizar(id: number, dados: Record<string, unknown>) {
    const atualizado = torneioModel.atualizar(id, dados);
    if (!atualizado) {
      const err = new Error('Torneio não encontrado.') as Error & { status: number };
      err.status = 404;
      throw err;
    }
    return atualizado;
  },

  remover(id: number) {
    const removido = torneioModel.remover(id);
    if (!removido) {
      const err = new Error('Torneio não encontrado.') as Error & { status: number };
      err.status = 404;
      throw err;
    }
  },
};
