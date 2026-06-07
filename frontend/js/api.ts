import { API_URL } from './config.js';

async function request(caminho: string, opcoes: RequestInit = {}): Promise<any> {
  const resp = await fetch(`${API_URL}${caminho}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes,
  });

  if (!resp.ok) {
    let msg = `Erro ${resp.status}`;
    try {
      const corpo = await resp.json();
      if (corpo && corpo.error) msg = corpo.error;
    } catch (_) { }
    throw new Error(msg);
  }

  if (resp.status === 204) return null;
  return resp.json();
}

export const api = {
  getTorneios()                            { return request('/torneios'); },
  getTorneio(id: number)                   { return request(`/torneios/${id}`); },
  criarTorneio(dados: object)              { return request('/torneios', { method: 'POST', body: JSON.stringify(dados) }); },
  atualizarTorneio(id: number, dados: object) { return request(`/torneios/${id}`, { method: 'PUT', body: JSON.stringify(dados) }); },
  removerTorneio(id: number)               { return request(`/torneios/${id}`, { method: 'DELETE' }); },

  getParticipantes(torneioId?: number) {
    const query = torneioId ? `?torneioId=${torneioId}` : '';
    return request(`/participantes${query}`);
  },
  criarParticipante(dados: object)         { return request('/participantes', { method: 'POST', body: JSON.stringify(dados) }); },
  removerParticipante(id: number)          { return request(`/participantes/${id}`, { method: 'DELETE' }); },
};
