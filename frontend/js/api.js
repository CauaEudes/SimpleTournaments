import { API_URL } from './config.js';
async function request(caminho, opcoes = {}) {
    const resp = await fetch(`${API_URL}${caminho}`, {
        headers: { 'Content-Type': 'application/json' },
        ...opcoes,
    });
    if (!resp.ok) {
        let msg = `Erro ${resp.status}`;
        try {
            const corpo = await resp.json();
            if (corpo && corpo.error)
                msg = corpo.error;
        }
        catch (_) { }
        throw new Error(msg);
    }
    if (resp.status === 204)
        return null;
    return resp.json();
}
export const api = {
    getTorneios() { return request('/torneios'); },
    getTorneio(id) { return request(`/torneios/${id}`); },
    criarTorneio(dados) { return request('/torneios', { method: 'POST', body: JSON.stringify(dados) }); },
    atualizarTorneio(id, dados) { return request(`/torneios/${id}`, { method: 'PUT', body: JSON.stringify(dados) }); },
    removerTorneio(id) { return request(`/torneios/${id}`, { method: 'DELETE' }); },
    getParticipantes(torneioId) {
        const query = torneioId ? `?torneioId=${torneioId}` : '';
        return request(`/participantes${query}`);
    },
    criarParticipante(dados) { return request('/participantes', { method: 'POST', body: JSON.stringify(dados) }); },
    removerParticipante(id) { return request(`/participantes/${id}`, { method: 'DELETE' }); },
};
//# sourceMappingURL=api.js.map