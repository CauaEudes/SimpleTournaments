const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(caminho, opcoes = {}) {
  let resp;
  try {
    resp = await fetch(`${API_URL}${caminho}`, {
      headers: { 'Content-Type': 'application/json' },
      ...opcoes,
    });
  } catch (err) {
    throw new Error('Sem conexão com o servidor. Verifique se o backend está rodando e tente novamente.');
  }

  if (resp.status === 204) return null;

  const corpo = await resp.json().catch(() => null);

  if (!resp.ok) {
    if (corpo && corpo.erro) throw new Error(corpo.erro);
    if (resp.status >= 500) throw new Error('Erro no servidor. Tente novamente mais tarde.');
    if (resp.status >= 400) throw new Error('Algo deu errado com os dados enviados. Verifique e tente novamente.');
    throw new Error('Erro inesperado. Tente novamente.');
  }

  return corpo;
}

export async function fazerLogin(email, senha) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });
}

export async function cadastrarUsuario(dados) {
  return request('/usuarios', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export async function listarTorneios(usuarioId) {
  return request(`/torneios?usuarioId=${usuarioId}`);
}

export async function buscarTorneio(id) {
  return request(`/torneios/${id}`);
}

export async function criarTorneio(dados) {
  return request('/torneios', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export async function atualizarTorneio(id, dados) {
  return request(`/torneios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados),
  });
}

export async function removerTorneio(id) {
  return request(`/torneios/${id}`, { method: 'DELETE' });
}

export async function listarParticipantes(torneioId) {
  return request(`/participantes?torneioId=${torneioId}`);
}

export async function criarParticipante(dados) {
  return request('/participantes', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export async function removerParticipante(id) {
  return request(`/participantes/${id}`, { method: 'DELETE' });
}

export async function gerarConfrontos(torneioId, opcoes) {
  return request(`/torneios/${torneioId}/confrontos`, {
    method: 'POST',
    body: JSON.stringify(opcoes),
  });
}

export async function listarConfrontos(torneioId) {
  return request(`/torneios/${torneioId}/confrontos`);
}

export async function registrarPlacar(partidaId, placar1, placar2) {
  return request(`/partidas/${partidaId}/placar`, {
    method: 'PUT',
    body: JSON.stringify({ placar1, placar2 }),
  });
}

export async function resetarConfrontos(torneioId) {
  return request(`/torneios/${torneioId}/confrontos`, { method: 'DELETE' });
}
