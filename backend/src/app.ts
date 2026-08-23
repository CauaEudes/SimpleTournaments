import express from 'express';
import cors from 'cors';
import usuariosRouter from './routes/usuarios';
import torneiosRouter from './routes/torneios';
import participantesRouter from './routes/participantes';
import partidasRouter from './routes/partidas';
import { usuarioController } from './controllers/usuarioController';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/usuarios', usuariosRouter);
app.post('/login', usuarioController.login);
app.use('/torneios', torneiosRouter);
app.use('/participantes', participantesRouter);
app.use(partidasRouter);

app.get('/', (req, res) => {
  res.json({
    api: 'SimpleTournaments API',
    versao: '2.0.0',
    rotas: ['/usuarios', '/login', '/torneios', '/participantes'],
  });
});

app.use(errorHandler);

export default app;
