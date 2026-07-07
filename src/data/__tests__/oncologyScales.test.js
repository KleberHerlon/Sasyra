import { describe, it, expect } from 'vitest';
import { calcECOG, calcKPS, calcEORTC, calcESAS } from '../oncologyScales';

describe('calcECOG', () => {
  it('retorna label correto para cada nível', () => {
    expect(calcECOG(0).label).toContain('Atividade normal');
    expect(calcECOG(3).label).toContain('Autocuidado limitado');
    expect(calcECOG(5).label).toContain('Óbito');
  });

  it('retorna valor numérico', () => {
    expect(calcECOG(2).value).toBe(2);
  });
});

describe('calcKPS', () => {
  it('classifica >= 80 como normal', () => {
    expect(calcKPS(80).label).toContain('Atividade normal');
  });

  it('classifica 60-70 como autocuidado', () => {
    expect(calcKPS(70).label).toContain('Autocuidado');
  });

  it('classifica 40-50 como incapacidade', () => {
    expect(calcKPS(50).label).toContain('Incapaz');
  });

  it('classifica 10-30 como confinado', () => {
    expect(calcKPS(10).label).toContain('Confinado');
  });

  it('classifica 0 como óbito', () => {
    expect(calcKPS(0).label).toBe('Óbito');
  });
});

describe('calcEORTC', () => {
  it('calcula functional e symptom scores', () => {
    const r = calcEORTC({
      physical: 2, role: 2, emotional: 1, cognitive: 1, social: 2,
      fatigue: 3, nauseaVomiting: 1, pain: 3, dyspnea: 2, insomnia: 2,
      appetiteLoss: 1, constipation: 1, diarrhea: 1, global: 4,
    });
    expect(r.functionalAvg).toBeGreaterThan(0);
    expect(r.symptomAvg).toBeGreaterThan(0);
    expect(r.global).toBeGreaterThan(0);
    expect(r.functional.physical.transformed).toBe(67);
  });
});

describe('calcESAS', () => {
  it('soma scores e classifica', () => {
    const r = calcESAS({ dor: 3, fadiga: 5, nausea: 2 });
    expect(r.total).toBe(10);
    expect(r.level).toBe('Sintomas leves');
  });

  it('classifica moderado', () => {
    const r = calcESAS({ dor: 8, fadiga: 7, nausea: 6, depressao: 5, ansiedade: 4 });
    expect(r.total).toBe(30);
    expect(r.level).toBe('Sintomas moderados');
  });

  it('classifica grave', () => {
    const r = calcESAS({ dor: 8, fadiga: 8, nausea: 8, depressao: 8 });
    expect(r.total).toBe(32);
    expect(r.level).toBe('Sintomas graves');
  });
});
