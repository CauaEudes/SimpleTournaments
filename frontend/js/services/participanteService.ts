import { api } from '../api.js';

export const participanteService = {
  listarTodos() {
    return api.getParticipantes();
  },

  listarPorTorneio(torneioId: number) {
    return api.getParticipantes(torneioId);
  },

  async criar(dados: { nome: string; email?: string; telefone?: string; torneioId: number }) {
    if (!dados.nome || !dados.nome.trim()) throw new Error('Nome é obrigatório');
    return api.criarParticipante({
      nome: dados.nome.trim(),
      email: dados.email?.trim() || '',
      telefone: dados.telefone?.trim() || '',
      torneioId: dados.torneioId,
    });
  },

  remover(id: number) {
    return api.removerParticipante(id);
  },
};
