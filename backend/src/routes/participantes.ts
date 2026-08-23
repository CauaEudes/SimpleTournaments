import { Router } from 'express';
import { participanteController } from '../controllers/participanteController';

const router = Router();

router.get('/',    participanteController.listarTodos);
router.get('/:id', participanteController.buscarPorId);
router.post('/',   participanteController.criar);
router.put('/:id', participanteController.atualizar);
router.delete('/:id', participanteController.remover);

export default router;
