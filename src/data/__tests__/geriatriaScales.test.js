import { describe, it, expect } from 'vitest';
import { calcMEEM, calcGDS15, calcSarcF, calcKatz, calcLawton, calcTinetti, calcFragilidade } from '../geriatriaScales';

describe('calcMEEM', () => {
  it('classifica >= 24 como normal', () => {
    const r = calcMEEM(25);
    expect(r.total).toBe(25);
    expect(r.level).toContain('Normal');
  });

  it('classifica 18-23 como déficit leve', () => {
    expect(calcMEEM(18).level).toContain('leve');
  });

  it('classifica 10-17 como déficit moderado', () => {
    expect(calcMEEM(10).level).toContain('moderado');
  });

  it('classifica < 10 como déficit grave', () => {
    expect(calcMEEM(5).level).toContain('grave');
  });

  it('clampa entre 0 e 30', () => {
    expect(calcMEEM(-5).total).toBe(0);
    expect(calcMEEM(35).total).toBe(30);
  });
});

describe('calcGDS15', () => {
  it('classifica <= 5 como normal', () => {
    expect(calcGDS15(4).level).toBe('Normal');
  });

  it('classifica 6-10 como leve', () => {
    expect(calcGDS15(8).level).toBe('Depressão leve');
  });

  it('classifica > 10 como grave', () => {
    expect(calcGDS15(12).level).toBe('Depressão grave');
  });

  it('clampa entre 0 e 15', () => {
    expect(calcGDS15(20).total).toBe(15);
  });
});

describe('calcSarcF', () => {
  it('soma scores e classifica risco', () => {
    const r = calcSarcF({ a: '2', b: '1', c: '0' });
    expect(r.total).toBe(3);
    expect(r.risk).toContain('Baixo');
  });

  it('>= 4 é alto risco', () => {
    const r = calcSarcF({ a: '2', b: '2', c: '1' });
    expect(r.total).toBe(5);
    expect(r.risk).toContain('Alto');
  });
});

describe('calcKatz', () => {
  it('6 independentes = A', () => {
    const k = { a: 'Independente', b: 'Independente', c: 'Independente', d: 'Independente', e: 'Independente', f: 'Independente' };
    expect(calcKatz(k).indep).toBe(6);
    expect(calcKatz(k).level).toContain('A');
  });

  it('4-5 = B-D dependência parcial', () => {
    const k = { a: 'Independente', b: 'Independente', c: 'Independente', d: 'Independente', e: 'Dependente', f: 'Dependente' };
    expect(calcKatz(k).level).toContain('B-D');
  });
});

describe('calcLawton', () => {
  it('8 itens * 3 = max 24', () => {
    const s = { a: '3', b: '3', c: '3', d: '3', e: '3', f: '3', g: '3', h: '3' };
    const r = calcLawton(s);
    expect(r.total).toBe(24);
    expect(r.max).toBe(24);
    expect(r.level).toContain('Independência');
  });

  it('classifica dependência conforme thresholds corrigidos', () => {
    expect(calcLawton({ a: '2', b: '2', c: '2', d: '2', e: '2', f: '2', g: '2', h: '2' }).level).toContain('Dependência leve');
    expect(calcLawton({ a: '1', b: '1', c: '1', d: '1', e: '1', f: '1', g: '1', h: '0' }).level).toContain('moderada/grave');
    expect(calcLawton({ a: '0', b: '0', c: '0', d: '0', e: '0', f: '0', g: '0', h: '0' }).level).toContain('grave');
  });
});

describe('calcTinetti', () => {
  it('soma balance + gait', () => {
    const bal = { a: '2', b: '2', c: '1', d: '2', e: '1' };
    const ga = { x: '2', y: '1', z: '2' };
    const r = calcTinetti(bal, ga);
    expect(r.balance).toBe(8);
    expect(r.gait).toBe(5);
    expect(r.total).toBe(13);
    expect(r.level).toContain('Alto risco');
  });

  it('>= 24 baixo risco', () => {
    const bal = { a: '2', b: '2', c: '2', d: '2', e: '2', f: '2', g: '2', h: '2', i: '2' };
    const ga = { x: '2', y: '2', z: '2', w: '2', v: '2', u: '2', t: '2' };
    expect(calcTinetti(bal, ga).level).toContain('Baixo');
  });
});

describe('calcFragilidade', () => {
  it('0 indicadores = não frágil', () => {
    expect(calcFragilidade({ a: false, b: false, c: false }).level).toBe('Não frágil');
  });

  it('1-2 = pré-frágil', () => {
    expect(calcFragilidade({ a: true, b: false }).level).toBe('Pré-frágil');
  });

  it('>= 3 = frágil', () => {
    expect(calcFragilidade({ a: true, b: true, c: true }).level).toBe('Frágil');
  });
});
