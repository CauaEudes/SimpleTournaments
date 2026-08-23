import { Router } from 'express';
import { partidaController } from '../controllers/partidaController';

const router = Router();

router.post('/torneios/:id/confrontos', partidaController.gerarConfrontos);
router.get('/torneios/:id/confrontos', partidaController.listarConfrontos);
router.delete('/torneios/:id/confrontos', partidaController.resetarConfrontos);

router.put('/partidas/:id/placar', partidaController.registrarPlacar);

export default router;
