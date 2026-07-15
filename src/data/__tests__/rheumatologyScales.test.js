import { describe, it, expect } from 'vitest';
import { calcDAS28, calcBASDAI, calcHAQ, calcWOMAC, calcWPI, calcBASFI, calcSDAI, calcCDAI } from '../rheumatologyScales';

describe('calcDAS28', () => {
  it('calcula DAS28 em remissão', () => {
    const r = calcDAS28(0, 0, 5, 10);
    expect(r.total).toBeLessThan(2.6);
    expect(r.level).toBe('Remissão');
  });

  it('calcula DAS28 em alta atividade', () => {
    const r = calcDAS28(15, 10, 60, 70);
    expect(r.level).toBe('Alta atividade');
  });

  it('retorna null para todos zeros', () => {
    expect(calcDAS28(0, 0, 0, 0)).toBeNull();
  });

  it('usa 0 como fallback para undefined', () => {
    const r = calcDAS28(undefined, undefined, undefined, undefined);
    expect(r).toBeNull();
  });
});

describe('calcBASDAI', () => {
  it('calcula BASDAI corretamente', () => {
    const r = calcBASDAI({ f: 3, sp: 4, jp: 2, t: 3, s: 5, d: 4 });
    expect(r.total).toBeGreaterThan(0);
    expect(r.level).toBeDefined();
  });

  it('retorna null para menos de 6 itens', () => {
    expect(calcBASDAI({ a: 1, b: 2 })).toBeNull();
  });
});

describe('calcHAQ', () => {
  it('calcula HAQ com 8 categorias', () => {
    const r = calcHAQ({ a: 0, b: 1, c: 2, d: 0, e: 1, f: 2, g: 0, h: 1 });
    expect(r.total).toBeCloseTo(0.88, 1);
  });

  it('retorna 0 para lista vazia', () => {
    expect(calcHAQ({})).toMatchObject({ total: 0, level: 'Sem incapacidade' });
  });
});

describe('calcWOMAC', () => {
  it('calcula WOMAC total', () => {
    const r = calcWOMAC({ a: 2, b: 3 }, { c: 1, d: 2 }, { e: 3, f: 4 });
    expect(r.grandTotal).toBe(15);
    expect(r.level).toBe('Leve');
  });
});

describe('calcWPI', () => {
  it('classifica corretamente', () => {
    expect(calcWPI(3).level).toBe('Baixa dor generalizada');
    expect(calcWPI(6).level).toBe('Moderada');
    expect(calcWPI(10).level).toBe('Alta dor generalizada');
  });
});

describe('calcBASFI', () => {
  it('calcula BASFI com 10 itens (média)', () => {
    const r = calcBASFI({ a: 1, b: 3, c: 4, d: 3, e: 2, f: 5, g: 4, h: 2, i: 4, j: 6 });
    expect(r.total).toBeCloseTo(3.4, 0);
    expect(r.level).toBe('Limitação moderada');
  });

  it('retorna Baixa função', () => {
    const r = calcBASFI({ a: 0, b: 1, c: 1, d: 2, e: 1, f: 0, g: 2, h: 1, i: 1, j: 1 });
    expect(r.total).toBeLessThanOrEqual(3);
    expect(r.level).toBe('Boa função');
  });

  it('retorna Limitação grave', () => {
    const r = calcBASFI({ a: 8, b: 9, c: 7, d: 8, e: 9, f: 8, g: 7, h: 9, i: 8, j: 7 });
    expect(r.total).toBeGreaterThan(6);
    expect(r.level).toBe('Limitação grave');
  });

  it('retorna null para menos de 10 itens', () => {
    expect(calcBASFI({ a: 1, b: 2 })).toBeNull();
  });
});

describe('calcSDAI', () => {
  it('calcula SDAI em remissão', () => {
    const r = calcSDAI(0, 0, 1, 1, 0.5);
    expect(r.total).toBeLessThanOrEqual(3.3);
    expect(r.level).toBe('Remissão');
  });

  it('calcula SDAI em baixa atividade', () => {
    const r = calcSDAI(3, 2, 3, 2, 1);
    expect(r.level).toBe('Baixa atividade');
  });

  it('calcula SDAI em alta atividade', () => {
    const r = calcSDAI(12, 8, 7, 6, 5);
    expect(r.total).toBeGreaterThan(26);
    expect(r.level).toBe('Alta atividade');
  });

  it('retorna null para todos zeros', () => {
    expect(calcSDAI(0, 0, 0, 0, 0)).toBeNull();
  });
});

describe('calcCDAI', () => {
  it('calcula CDAI em remissão', () => {
    const r = calcCDAI(0, 0, 1, 1);
    expect(r.total).toBeLessThanOrEqual(2.8);
    expect(r.level).toBe('Remissão');
  });

  it('calcula CDAI em moderada atividade', () => {
    const r = calcCDAI(5, 4, 4, 3);
    expect(r.level).toBe('Atividade moderada');
  });

  it('calcula CDAI em alta atividade', () => {
    const r = calcCDAI(14, 10, 7, 6);
    expect(r.total).toBeGreaterThan(22);
    expect(r.level).toBe('Alta atividade');
  });

  it('retorna null para todos zeros', () => {
    expect(calcCDAI(0, 0, 0, 0)).toBeNull();
  });
});
