export interface Participante {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
  torneioId: number;
  criadoEm: string;
}

let participantes: Participante[] = [];
let nextId = 1;

export const participanteModel = {
  listarTodos(): Participante[] {
    return participantes;
  },

  listarPorTorneio(torneioId: number): Participante[] {
    return participantes.filter(p => p.torneioId === torneioId);
  },

  buscarPorId(id: number): Participante | null {
    return participantes.find(p => p.id === id) || null;
  },

  inserir(dados: { nome: string; email?: string; telefone?: string; torneioId: number }): Participante {
    const novo: Participante = {
      id: nextId++,
      nome: dados.nome,
      email: dados.email,
      telefone: dados.telefone,
      torneioId: Number(dados.torneioId),
      criadoEm: new Date().toISOString(),
    };
    participantes.push(novo);
    return novo;
  },

  atualizar(id: number, dados: Partial<Omit<Participante, 'id'>>): Participante | null {
    const idx = participantes.findIndex(p => p.id === id);
    if (idx === -1) return null;
    participantes[idx] = { ...participantes[idx], ...dados, id };
    return participantes[idx];
  },

  remover(id: number): boolean {
    const tamanhoAntes = participantes.length;
    participantes = participantes.filter(p => p.id !== id);
    return participantes.length < tamanhoAntes;
  },
};
