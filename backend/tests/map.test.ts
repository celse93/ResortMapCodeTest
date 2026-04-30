import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import path from 'path';
import { createMapRouter } from '../src/routes/map.js';
import { parseMap } from '../src/mapParser.js';

const MAP_PATH = path.resolve(__dirname, '../../map.ascii');

describe('parseMap', () => {
  it('returns correct dimensions', () => {
    const { rows, cols, grid } = parseMap(MAP_PATH);
    expect(rows).toBeGreaterThan(0);
    expect(cols).toBeGreaterThan(0);
    expect(grid).toHaveLength(rows);
    expect(grid[0]).toHaveLength(cols);
  });

  it('assigns id to every cabana cell', () => {
    const { grid } = parseMap(MAP_PATH);
    const cabanas = grid.flat().filter((c) => c.type === 'cabana');
    expect(cabanas.length).toBeGreaterThan(0);
    cabanas.forEach((c) => expect(c.id).toMatch(/^W_\d+_\d+$/));
  });

  it('non-cabana cells have no id', () => {
    const { grid } = parseMap(MAP_PATH);
    const others = grid.flat().filter((c) => c.type !== 'cabana');
    others.forEach((c) => expect(c.id).toBeUndefined());
  });

  it('recognises all tile types from the map file', () => {
    const { grid } = parseMap(MAP_PATH);
    const cells = grid.flat();
    const types = new Set(cells.map((c) => c.type));
    expect(types).toContain('empty');
    expect(types).toContain('cabana');
    expect(types).toContain('pool');
    expect(types).toContain('path');
    expect(types).toContain('chalet');
  });
});

describe('GET /api/map', () => {
  const app = express();
  let server: ReturnType<typeof app.listen>;
  let baseUrl: string;

  beforeAll(() => {
    app.use('/api', createMapRouter(MAP_PATH));
    server = app.listen(0);
    const addr = server.address() as { port: number };
    baseUrl = `http://localhost:${addr.port}`;
  });

  afterAll(() => {
    server.close();
  });

  it('responds with 200', async () => {
    const res = await fetch(`${baseUrl}/api/map`);
    expect(res.status).toBe(200);
  });

  it('response has rows, cols and grid fields', async () => {
    const res = await fetch(`${baseUrl}/api/map`);
    const body = await res.json() as { rows: number; cols: number; grid: unknown[][] };
    expect(typeof body.rows).toBe('number');
    expect(typeof body.cols).toBe('number');
    expect(Array.isArray(body.grid)).toBe(true);
  });

  it('grid length matches rows', async () => {
    const res = await fetch(`${baseUrl}/api/map`);
    const body = await res.json() as { rows: number; cols: number; grid: unknown[][] };
    expect(body.grid).toHaveLength(body.rows);
  });

  it('each row length matches cols', async () => {
    const res = await fetch(`${baseUrl}/api/map`);
    const body = await res.json() as { rows: number; cols: number; grid: unknown[][] };
    body.grid.forEach((row) => expect(row).toHaveLength(body.cols));
  });

  it('every cell has a valid type', async () => {
    const res = await fetch(`${baseUrl}/api/map`);
    const body = await res.json() as { rows: number; cols: number; grid: { type: string }[][] };
    const validTypes = new Set(['empty', 'cabana', 'pool', 'path', 'chalet']);
    body.grid.flat().forEach((cell) => expect(validTypes.has(cell.type)).toBe(true));
  });

  it('cabana cells have an id in W_row_col format', async () => {
    const res = await fetch(`${baseUrl}/api/map`);
    const body = await res.json() as { rows: number; cols: number; grid: { type: string; id?: string }[][] };
    const cabanas = body.grid.flat().filter((c) => c.type === 'cabana');
    expect(cabanas.length).toBeGreaterThan(0);
    cabanas.forEach((c) => expect(c.id).toMatch(/^W_\d+_\d+$/));
  });
});
