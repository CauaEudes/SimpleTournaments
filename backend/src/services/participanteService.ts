import { participanteModel } from '../models/participante';
import { torneioModel } from '../models/torneio';

export const participanteService = {
  listarTodos(torneioId?: string) {
    if (torneioId) {
      return participanteModel.listarPorTorneio(Number(torneioId));
    }
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

  criar(dados: { nome?: string; email?: string; telefone?: string; torneioId?: number }) {
    if (!dados.nome) {
      const err = new Error('Campo "nome" é obrigatório') as Error & { status: number };
      err.status = 400;
      throw err;
    }

    if (!dados.torneioId) {
      const err = new Error('Campo "torneioId" é obrigatório') as Error & { status: number };
      err.status = 400;
      throw err;
    }

    const torneio = torneioModel.buscarPorId(Number(dados.torneioId));
    if (!torneio) {
      const err = new Error('Torneio informado não existe') as Error & { status: number };
      err.status = 422;
      throw err;
    }

    if (torneio.criacaoAvancada) {
      if (!dados.email || !dados.telefone) {
        const err = new Error('Para este torneio (Criação Avançada), "email" e "telefone" são obrigatórios') as Error & { status: number };
        err.status = 400;
        throw err;
      }
    }

    return participanteModel.inserir({
      nome: dados.nome,
      email: dados.email,
      telefone: dados.telefone,
      torneioId: Number(dados.torneioId),
    });
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
