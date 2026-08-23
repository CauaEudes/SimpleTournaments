import { partidaModel } from '../models/partida';
import { participanteModel } from '../models/participante';
import { torneioModel } from '../models/torneio';

export const partidaService = {
  gerarConfrontos(torneioId: number, aleatorio: boolean = false) {
    const torneio = torneioModel.buscarPorId(torneioId);
    if (!torneio) {
      const err = new Error('Torneio não encontrado.') as Error & { status: number };
      err.status = 404;
      throw err;
    }

    const existentes = partidaModel.listarPorTorneio(torneioId);
    if (existentes.length > 0) {
      const err = new Error('Este torneio já possui confrontos gerados. Resete antes de gerar novamente.') as Error & { status: number };
      err.status = 400;
      throw err;
    }

    const participantes = participanteModel.listarPorTorneio(torneioId);
    if (participantes.length < 2) {
      const err = new Error('São necessários pelo menos 2 participantes para gerar confrontos.') as Error & { status: number };
      err.status = 400;
      throw err;
    }

    const pares: [number, number][] = [];
    for (let i = 0; i < participantes.length; i++) {
      for (let j = i + 1; j < participantes.length; j++) {
        pares.push([participantes[i].id, participantes[j].id]);
      }
    }

    for (let i = pares.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pares[i], pares[j]] = [pares[j], pares[i]];
    }

    const partidas = pares.map(([p1, p2]) =>
      partidaModel.inserir({
        torneioId,
        participante1Id: p1,
        participante2Id: p2,
      })
    );

    torneioModel.atualizar(torneioId, { status: 'em_andamento' });

    return partidas;
  },

  listarConfrontos(torneioId: number) {
    const torneio = torneioModel.buscarPorId(torneioId);
    if (!torneio) {
      const err = new Error('Torneio não encontrado.') as Error & { status: number };
      err.status = 404;
      throw err;
    }

    const partidas = partidaModel.listarPorTorneio(torneioId);
    const participantes = participanteModel.listarPorTorneio(torneioId);

    const nomesMap: Record<number, string> = {};
    for (const p of participantes) {
      nomesMap[p.id] = p.nome;
    }

    const partidasComNomes = partidas.map(p => ({
      ...p,
      nomeParticipante1: nomesMap[p.participante1Id] || 'Desconhecido',
      nomeParticipante2: nomesMap[p.participante2Id] || 'Desconhecido',
    }));

    const classificacao = this.calcularClassificacao(partidas, participantes);

    return { partidas: partidasComNomes, classificacao };
  },

  registrarPlacar(partidaId: number, placar1: number, placar2: number) {
    const partida = partidaModel.buscarPorId(partidaId);
    if (!partida) {
      const err = new Error('Partida não encontrada.') as Error & { status: number };
      err.status = 404;
      throw err;
    }

    if (placar1 < 0 || placar2 < 0) {
      const err = new Error('Os placares não podem ser negativos.') as Error & { status: number };
      err.status = 400;
      throw err;
    }

    return partidaModel.atualizarPlacar(partidaId, placar1, placar2);
  },

  calcularClassificacao(partidas: any[], participantes: any[]) {
    const stats: Record<number, {
      id: number;
      nome: string;
      pontos: number;
      vitorias: number;
      empates: number;
      derrotas: number;
      golsPro: number;
      golsContra: number;
      saldo: number;
    }> = {};

    for (const p of participantes) {
      stats[p.id] = {
        id: p.id,
        nome: p.nome,
        pontos: 0,
        vitorias: 0,
        empates: 0,
        derrotas: 0,
        golsPro: 0,
        golsContra: 0,
        saldo: 0,
      };
    }

    for (const p of partidas) {
      if (!p.finalizada) continue;

      const p1 = stats[p.participante1Id];
      const p2 = stats[p.participante2Id];
      if (!p1 || !p2) continue;

      p1.golsPro += p.placar1;
      p1.golsContra += p.placar2;
      p2.golsPro += p.placar2;
      p2.golsContra += p.placar1;

      if (p.placar1 > p.placar2) {
        p1.vitorias++;
        p1.pontos += 3;
        p2.derrotas++;
      } else if (p.placar1 < p.placar2) {
        p2.vitorias++;
        p2.pontos += 3;
        p1.derrotas++;
      } else {
        p1.empates++;
        p1.pontos += 1;
        p2.empates++;
        p2.pontos += 1;
      }
    }

    const lista = Object.values(stats).map(s => ({
      ...s,
      saldo: s.golsPro - s.golsContra,
    }));

    lista.sort((a, b) => {
      if (b.pontos !== a.pontos) return b.pontos - a.pontos;
      if (b.saldo !== a.saldo) return b.saldo - a.saldo;
      return b.vitorias - a.vitorias;
    });

    return lista;
  },

  resetarConfrontos(torneioId: number) {
    const torneio = torneioModel.buscarPorId(torneioId);
    if (!torneio) {
      const err = new Error('Torneio não encontrado.') as Error & { status: number };
      err.status = 404;
      throw err;
    }

    partidaModel.removerPorTorneio(torneioId);
    torneioModel.atualizar(torneioId, { status: 'aberto' });
  },
};
