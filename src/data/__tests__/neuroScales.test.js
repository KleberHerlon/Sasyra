import { describe, it, expect } from 'vitest';
import { calcMAS, calcBBS, calcMIF, calcGlasgow, calcTIS } from '../neuroScales';

describe('calcMAS', () => {
  it('retorna Sem espasticidade para total 0', () => {
    expect(calcMAS({})).toMatchObject({ total: 0, level: 'Sem espasticidade' });
  });

  it('classifica espasticidade leve (1-12) — 12 itens', () => {
    const s = { flexoresCotoveloD: '2', flexoresCotoveloE: '1', extensoresJoelhoD: '3', extensoresJoelhoE: '2' };
    expect(calcMAS(s).level).toBe('Espasticidade leve');
  });

  it('classifica espasticidade moderada (13-24) — 12 itens', () => {
    const s = {
      flexoresCotoveloD: '3', flexoresCotoveloE: '3', extensoresJoelhoD: '3', extensoresJoelhoE: '3',
      flexoresPlantaresD: '2', flexoresPlantaresE: '2', flexoresPunhoD: '2', flexoresPunhoE: '2',
    };
    expect(calcMAS(s).level).toBe('Espasticidade moderada');
  });

  it('classifica espasticidade grave (>24) — 12 itens', () => {
    const s = {
      flexoresCotoveloD: '4', flexoresCotoveloE: '4', extensoresJoelhoD: '4', extensoresJoelhoE: '4',
      flexoresPlantaresD: '4', flexoresPlantaresE: '4', flexoresPunhoD: '3', flexoresPunhoE: '3',
      adutoresQuadrilD: '3', adutoresQuadrilE: '3', flexoresQuadrilD: '2', flexoresQuadrilE: '2',
    };
    expect(calcMAS(s).total).toBe(40);
    expect(calcMAS(s).level).toBe('Espasticidade grave');
  });

  it('retorna max 48 para 12 itens', () => {
    const s = {
      flexoresCotoveloD: '4', flexoresCotoveloE: '4', extensoresJoelhoD: '4', extensoresJoelhoE: '4',
      flexoresPlantaresD: '4', flexoresPlantaresE: '4', flexoresPunhoD: '4', flexoresPunhoE: '4',
      adutoresQuadrilD: '4', adutoresQuadrilE: '4', flexoresQuadrilD: '4', flexoresQuadrilE: '4',
    };
    expect(calcMAS(s).total).toBe(48);
    expect(calcMAS(s).max).toBe(48);
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

describe('calcGlasgow', () => {
  it('retorna Trauma leve para total >= 13', () => {
    const r = calcGlasgow({ aberturaOcular: '4', respostaVerbal: '5', respostaMotora: '6' });
    expect(r.total).toBe(15);
    expect(r.level).toBe('Trauma leve');
    expect(r.max).toBe(15);
  });

  it('retorna Trauma moderado para 9-12', () => {
    const r = calcGlasgow({ aberturaOcular: '3', respostaVerbal: '4', respostaMotora: '4' });
    expect(r.total).toBe(11);
    expect(r.level).toBe('Trauma moderado');
  });

  it('retorna Trauma grave para 4-8', () => {
    const r = calcGlasgow({ aberturaOcular: '2', respostaVerbal: '2', respostaMotora: '3' });
    expect(r.total).toBe(7);
    expect(r.level).toBe('Trauma grave');
  });

  it('retorna Coma para < 4', () => {
    const r = calcGlasgow({ aberturaOcular: '1', respostaVerbal: '1', respostaMotora: '1' });
    expect(r.total).toBe(3);
    expect(r.level).toBe('Coma');
  });

  it('ignora valores ausentes', () => {
    const r = calcGlasgow({ aberturaOcular: '4' });
    expect(r.total).toBe(4);
  });
});

describe('calcTIS', () => {
  it('retorna Controle preservado para >= 20', () => {
    const r = calcTIS({ sentadoEstatico: '7', sentadoDinamico: '9', transferencias: '5' });
    expect(r.total).toBe(21);
    expect(r.level).toBe('Controle de tronco preservado');
    expect(r.max).toBe(23);
  });

  it('retorna Déficit leve para 14-19', () => {
    const r = calcTIS({ sentadoEstatico: '5', sentadoDinamico: '7', transferencias: '4' });
    expect(r.total).toBe(16);
    expect(r.level).toBe('Déficit leve');
  });

  it('retorna Déficit moderado para 7-13', () => {
    const r = calcTIS({ sentadoEstatico: '3', sentadoDinamico: '4', transferencias: '2' });
    expect(r.total).toBe(9);
    expect(r.level).toBe('Déficit moderado');
  });

  it('retorna Déficit grave para < 7', () => {
    const r = calcTIS({ sentadoEstatico: '1', sentadoDinamico: '2', transferencias: '1' });
    expect(r.total).toBe(4);
    expect(r.level).toBe('Déficit grave');
  });
});
