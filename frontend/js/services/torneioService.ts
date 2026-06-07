import { api } from '../api.js';

export const torneioService = {
  listar() {
    return api.getTorneios();
  },

  buscar(id: number) {
    return api.getTorneio(id);
  },

  async criar(dados: { nome: string; descricao: string; dataInicio: string; criacaoAvancada: boolean }) {
    if (!dados.nome || !dados.nome.trim()) throw new Error('Nome é obrigatório');
    if (!dados.dataInicio) throw new Error('Data de início é obrigatória');
    
    const dataHoje = new Date();
    dataHoje.setHours(0, 0, 0, 0);
    const dataInformada = new Date(dados.dataInicio + 'T00:00:00');
    if (dataInformada < dataHoje) {
      throw new Error('A data de início não pode estar no passado');
    }

    return api.criarTorneio({
      nome: dados.nome.trim(),
      descricao: dados.descricao?.trim() || '',
      dataInicio: dados.dataInicio,
      criacaoAvancada: dados.criacaoAvancada,
    });
  },

  remover(id: number) {
    return api.removerTorneio(id);
  },
};
