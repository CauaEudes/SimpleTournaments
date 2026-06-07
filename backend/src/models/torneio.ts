export interface Torneio {
  id: number;
  nome: string;
  descricao: string;
  dataInicio: string;
  status: 'aberto' | 'em_andamento' | 'finalizado';
  criacaoAvancada: boolean;
  criadoEm: string;
}

let torneios: Torneio[] = [];
let nextId = 1;

export const torneioModel = {
  listarTodos(): Torneio[] {
    return torneios;
  },

  buscarPorId(id: number): Torneio | null {
    return torneios.find(t => t.id === id) || null;
  },

  inserir(dados: { nome: string; descricao?: string; dataInicio: string; status?: string; criacaoAvancada?: boolean }): Torneio {
    const novo: Torneio = {
      id: nextId++,
      nome: dados.nome,
      descricao: dados.descricao || '',
      dataInicio: dados.dataInicio,
      status: (dados.status as Torneio['status']) || 'aberto',
      criacaoAvancada: !!dados.criacaoAvancada,
      criadoEm: new Date().toISOString(),
    };
    torneios.push(novo);
    return novo;
  },

  atualizar(id: number, dados: Partial<Omit<Torneio, 'id'>>): Torneio | null {
    const idx = torneios.findIndex(t => t.id === id);
    if (idx === -1) return null;
    torneios[idx] = { ...torneios[idx], ...dados, id };
    return torneios[idx];
  },

  remover(id: number): boolean {
    const tamanhoAntes = torneios.length;
    torneios = torneios.filter(t => t.id !== id);
    return torneios.length < tamanhoAntes;
  },
};
