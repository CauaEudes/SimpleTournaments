import { Request, Response } from 'express';
import { torneioService } from '../services/torneioService';

export const torneioController = {
  listarTodos(req: Request, res: Response) {
    const torneios = torneioService.listarTodos();
    res.json(torneios);
  },

  buscarPorId(req: Request, res: Response) {
    const torneio = torneioService.buscarPorId(Number(req.params.id));
    res.json(torneio);
  },

  criar(req: Request, res: Response) {
    const novo = torneioService.criar(req.body);
    res.status(201).json(novo);
  },

  atualizar(req: Request, res: Response) {
    const atualizado = torneioService.atualizar(Number(req.params.id), req.body);
    res.json(atualizado);
  },

  remover(req: Request, res: Response) {
    torneioService.remover(Number(req.params.id));
    res.status(204).end();
  },
};
