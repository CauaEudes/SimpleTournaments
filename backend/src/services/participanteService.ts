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
      const err = new Error('Participante não encontrado.') as Error & { status: number };
      err.status = 404;
      throw err;
    }
    return participante;
  },

  criar(dados: { nome?: string; email?: string; telefone?: string; informacoes?: string; discord?: string; torneioId?: number }) {
    if (!dados.nome || !dados.nome.trim()) {
      const err = new Error('Preencha o nome do participante.') as Error & { status: number };
      err.status = 400;
      throw err;
    }

    if (!dados.torneioId) {
      const err = new Error('É necessário selecionar um torneio.') as Error & { status: number };
      err.status = 400;
      throw err;
    }

    const torneio = torneioModel.buscarPorId(Number(dados.torneioId));
    if (!torneio) {
      const err = new Error('Torneio não encontrado. Ele pode ter sido removido.') as Error & { status: number };
      err.status = 422;
      throw err;
    }

    if (torneio.camposObrigatorios && torneio.camposObrigatorios.trim().length > 0) {
      let campos: string[] = [];
      try {
        campos = JSON.parse(torneio.camposObrigatorios);
      } catch {
        campos = [];
      }

      const nomesCampos: Record<string, string> = {
        discord: 'Discord',
        email: 'E-mail',
        telefone: 'Telefone',
      };

      const campoMap: Record<string, string | undefined> = {
        discord: dados.discord,
        email: dados.email,
        telefone: dados.telefone,
      };

      for (const campo of campos) {
        const valor = campoMap[campo];
        if (!valor || !valor.trim()) {
          const nomeExibicao = nomesCampos[campo] || campo;
          const err = new Error(`O campo "${nomeExibicao}" é obrigatório para este torneio.`) as Error & { status: number };
          err.status = 400;
          throw err;
        }
      }
    }

    return participanteModel.inserir({
      nome: dados.nome.trim(),
      email: dados.email?.trim(),
      telefone: dados.telefone?.trim(),
      informacoes: dados.informacoes?.trim(),
      discord: dados.discord?.trim(),
      torneioId: Number(dados.torneioId),
    });
  },

  atualizar(id: number, dados: Record<string, unknown>) {
    const atualizado = participanteModel.atualizar(id, dados);
    if (!atualizado) {
      const err = new Error('Participante não encontrado.') as Error & { status: number };
      err.status = 404;
      throw err;
    }
    return atualizado;
  },

  remover(id: number) {
    const removido = participanteModel.remover(id);
    if (!removido) {
      const err = new Error('Participante não encontrado.') as Error & { status: number };
      err.status = 404;
      throw err;
    }
  },
};
