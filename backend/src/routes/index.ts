import { Router, Request, Response } from 'express';
import pool from '../config/postgres';
import { getMongo } from '../config/mongo';

const router = Router();

// Health check
router.get('/health', async (_req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1');
    getMongo().command({ ping: 1 });
    res.json({ status: 'ok', postgres: 'up', mongo: 'up' });
  } catch (err) {
    res.status(503).json({ status: 'error', detail: String(err) });
  }
});

/* EXAMPLES
router.get('/users', async (_req: Request, res: Response) => {
  const result = await pool.query('SELECT * FROM users LIMIT 50');
  res.json(result.rows);
});

router.get('/logs', async (_req: Request, res: Response) => {
  const logs = await getMongo().collection('logs').find().limit(50).toArray();
  res.json(logs);
});*/

export default router;