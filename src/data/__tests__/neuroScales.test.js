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
  it('retorna Baixo risco para total >= 41 (14 itens)', () => {
    const s = { bbs1:'4',bbs2:'4',bbs3:'4',bbs4:'4',bbs5:'4',bbs6:'4',bbs7:'3',bbs8:'3',bbs9:'3',bbs10:'3',bbs11:'2',bbs12:'2',bbs13:'1',bbs14:'1' };
    const r = calcBBS(s);
    expect(r.total).toBe(42);
    expect(r.level).toBe('Baixo risco de queda');
    expect(r.max).toBe(56);
  });

  it('retorna Médio risco para 21-40 (14 itens)', () => {
    const s = { bbs1:'3',bbs2:'3',bbs3:'3',bbs4:'3',bbs5:'3',bbs6:'2',bbs7:'2',bbs8:'2',bbs9:'2',bbs10:'2',bbs11:'1',bbs12:'1',bbs13:'1',bbs14:'1' };
    const r = calcBBS(s);
    expect(r.total).toBe(29);
    expect(r.level).toBe('Médio risco de queda');
  });

  it('retorna Alto risco para < 21 (14 itens)', () => {
    const s = { bbs1:'2',bbs2:'2',bbs3:'2',bbs4:'2',bbs5:'2',bbs6:'1',bbs7:'1',bbs8:'1',bbs9:'1',bbs10:'1',bbs11:'1',bbs12:'1',bbs13:'1',bbs14:'0' };
    const r = calcBBS(s);
    expect(r.total).toBe(18);
    expect(r.level).toBe('Alto risco de queda');
  });
});

describe('calcMIF', () => {
  it('retorna Independência modificada para >= 90 (18 itens)', () => {
    const s = { mif1:'5',mif2:'5',mif3:'5',mif4:'5',mif5:'5',mif6:'5',mif7:'5',mif8:'5',mif9:'5',mif10:'5',mif11:'5',mif12:'5',mif13:'5',mif14:'5',mif15:'5',mif16:'5',mif17:'5',mif18:'5' };
    const r = calcMIF(s);
    expect(r.total).toBe(90);
    expect(r.level).toBe('Independência modificada');
    expect(r.max).toBe(126);
  });

  it('retorna Dependência total para total 0 (sem itens)', () => {
    const r = calcMIF({});
    expect(r.total).toBe(0);
    expect(r.level).toBe('Dependência total');
  });

  it('retorna Independência completa com todos 7 (126)', () => {
    const s = { mif1:'7',mif2:'7',mif3:'7',mif4:'7',mif5:'7',mif6:'7',mif7:'7',mif8:'7',mif9:'7',mif10:'7',mif11:'7',mif12:'7',mif13:'7',mif14:'7',mif15:'7',mif16:'7',mif17:'7',mif18:'7' };
    const r = calcMIF(s);
    expect(r.total).toBe(126);
    expect(r.level).toBe('Independência completa');
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
