import { Router } from 'express';
import { parseMap } from '../mapParser.js';

export function createMapRouter(mapPath: string): Router {
  const router = Router();
  const mapData = parseMap(mapPath);

  router.get('/map', (_req, res) => {
    res.json(mapData);
  });

  return router;
}
