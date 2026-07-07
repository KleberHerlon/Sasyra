import { describe, it, expect } from 'vitest';
import { calcMAS, calcBBS, calcMIF } from '../neuroScales';

describe('calcMAS', () => {
  it('retorna Sem espasticidade para total 0', () => {
    expect(calcMAS({})).toMatchObject({ total: 0, level: 'Sem espasticidade' });
  });

  it('classifica espasticidade leve (1-6)', () => {
    const s = { flexoresCotoveloD: '2', flexoresCotoveloE: '1' };
    expect(calcMAS(s).level).toBe('Espasticidade leve');
  });

  it('classifica espasticidade moderada (7-12)', () => {
    const s = { flexoresCotoveloD: '3', flexoresCotoveloE: '3', extensoresJoelhoD: '2', extensoresJoelhoE: '2', flexoresPlantaresD: '1', flexoresPlantaresE: '1' };
    expect(calcMAS(s).level).toBe('Espasticidade moderada');
  });

  it('classifica espasticidade grave (>12)', () => {
    const s = { a: '4', b: '4', c: '4', d: '3' };
    expect(calcMAS(s).level).toBe('Espasticidade grave');
  });
});

describe('calcBBS', () => {
  it('retorna Baixo risco para total >= 16', () => {
    const s = { sentaPe: '4', peSemApoio: '4', transferencias: '4', alcanceFrente: '4', apoioUnipodal: '3' };
    const r = calcBBS(s);
    expect(r.total).toBe(19);
    expect(r.level).toBe('Baixo risco de queda');
  });

  it('retorna Médio risco para 10-15', () => {
    const s = { sentaPe: '3', peSemApoio: '3', transferencias: '3', alcanceFrente: '3', apoioUnipodal: '2' };
    const r = calcBBS(s);
    expect(r.total).toBe(14);
    expect(r.level).toBe('Médio risco de queda');
  });

  it('retorna Alto risco para < 10', () => {
    const s = { sentaPe: '2', peSemApoio: '2', transferencias: '1', alcanceFrente: '1', apoioUnipodal: '0' };
    const r = calcBBS(s);
    expect(r.total).toBe(6);
    expect(r.level).toBe('Alto risco de queda');
  });
});

describe('calcMIF', () => {
  it('retorna Independência modificada para >= 36', () => {
    const s = { alimentacao: '6', higiene: '6', banho: '6', vestirSuperior: '6', vestirInferior: '6', usoBanheiro: '6' };
    const r = calcMIF(s);
    expect(r.total).toBe(36);
    expect(r.level).toBe('Independência modificada');
  });

  it('retorna Dependência total para < 12', () => {
    const s = { alimentacao: '2', higiene: '2', banho: '2', vestirSuperior: '2', vestirInferior: '2', usoBanheiro: '1' };
    const r = calcMIF(s);
    expect(r.total).toBe(11);
    expect(r.level).toBe('Dependência total');
  });

  it('retorna max: 42', () => {
    const s = { alimentacao: '7', higiene: '7', banho: '7', vestirSuperior: '7', vestirInferior: '7', usoBanheiro: '7' };
    expect(calcMIF(s).max).toBe(42);
  });
});
