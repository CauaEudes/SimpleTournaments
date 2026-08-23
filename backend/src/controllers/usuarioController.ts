import { Request, Response } from 'express';
import { usuarioService } from '../services/usuarioService';

export const usuarioController = {
  listarTodos(req: Request, res: Response) {
    const usuarios = usuarioService.listarTodos();
    res.json(usuarios);
  },

  cadastrar(req: Request, res: Response) {
    const novo = usuarioService.cadastrar(req.body);
    res.status(201).json(novo);
  },

  login(req: Request, res: Response) {
    const usuario = usuarioService.login(req.body);
    res.json(usuario);
  },
};
