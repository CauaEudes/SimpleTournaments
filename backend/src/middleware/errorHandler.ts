import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error & { status?: number }, req: Request, res: Response, next: NextFunction): void {
  console.error(`❌ [${req.method} ${req.url}] ${err.message}`);

  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Erro interno do servidor',
  });
}
