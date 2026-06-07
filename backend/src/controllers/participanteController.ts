import { Request, Response } from 'express';
import { participanteService } from '../services/participanteService';

export const participanteController = {
  listarTodos(req: Request, res: Response) {
    const participantes = participanteService.listarTodos(req.query.torneioId as string);
    res.json(participantes);
  },

  buscarPorId(req: Request, res: Response) {
    const participante = participanteService.buscarPorId(Number(req.params.id));
    res.json(participante);
  },

  criar(req: Request, res: Response) {
    const novo = participanteService.criar(req.body);
    res.status(201).json(novo);
  },

  atualizar(req: Request, res: Response) {
    const atualizado = participanteService.atualizar(Number(req.params.id), req.body);
    res.json(atualizado);
  },

  remover(req: Request, res: Response) {
    participanteService.remover(Number(req.params.id));
    res.status(204).end();
  },
};
