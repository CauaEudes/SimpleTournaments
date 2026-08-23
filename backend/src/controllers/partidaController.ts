import { Request, Response } from 'express';
import { partidaService } from '../services/partidaService';

export const partidaController = {
  gerarConfrontos(req: Request, res: Response) {
    const torneioId = Number(req.params.id);
    const { aleatorio } = req.body;
    const partidas = partidaService.gerarConfrontos(torneioId, aleatorio === true);
    res.status(201).json(partidas);
  },

  listarConfrontos(req: Request, res: Response) {
    const torneioId = Number(req.params.id);
    const resultado = partidaService.listarConfrontos(torneioId);
    res.json(resultado);
  },

  registrarPlacar(req: Request, res: Response) {
    const partidaId = Number(req.params.id);
    const { placar1, placar2 } = req.body;
    const partida = partidaService.registrarPlacar(partidaId, Number(placar1), Number(placar2));
    res.json(partida);
  },

  resetarConfrontos(req: Request, res: Response) {
    const torneioId = Number(req.params.id);
    partidaService.resetarConfrontos(torneioId);
    res.status(204).end();
  },
};
