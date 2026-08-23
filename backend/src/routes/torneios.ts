import { Router } from 'express';
import { torneioController } from '../controllers/torneioController';

const router = Router();

router.get('/',    torneioController.listarTodos);
router.get('/:id', torneioController.buscarPorId);
router.post('/',   torneioController.criar);
router.put('/:id', torneioController.atualizar);
router.delete('/:id', torneioController.remover);

export default router;
