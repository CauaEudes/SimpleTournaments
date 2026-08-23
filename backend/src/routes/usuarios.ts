import { Router } from 'express';
import { usuarioController } from '../controllers/usuarioController';

const router = Router();

router.get('/', usuarioController.listarTodos);
router.post('/', usuarioController.cadastrar);

export default router;
