import { api } from '../api.js';
export const participanteService = {
    listarTodos() {
        return api.getParticipantes();
    },
    listarPorTorneio(torneioId) {
        return api.getParticipantes(torneioId);
    },
    async criar(dados) {
        if (!dados.nome || !dados.nome.trim())
            throw new Error('Nome é obrigatório');
        return api.criarParticipante({
            nome: dados.nome.trim(),
            email: dados.email?.trim() || '',
            telefone: dados.telefone?.trim() || '',
            torneioId: dados.torneioId,
        });
    },
    remover(id) {
        return api.removerParticipante(id);
    },
};
//# sourceMappingURL=participanteService.js.map