import express from 'express';
import cors from 'cors';
import torneiosRouter from './routes/torneios';
import participantesRouter from './routes/participantes';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/torneios', torneiosRouter);
app.use('/participantes', participantesRouter);

app.get('/', (req, res) => {
  res.json({
    api: 'SimpleTournaments API',
    versao: '1.0.0',
    rotas: ['/torneios', '/participantes'],
  });
});

app.use(errorHandler);

export default app;
