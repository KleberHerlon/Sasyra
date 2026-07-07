import { describe, it, expect } from 'vitest';
import { calcVancouver, calcEdema } from '../dermatoScales';

describe('calcVancouver', () => {
  it('calcula total com clamp individual por domínio', () => {
    const r = calcVancouver({ pigmentation: '2', vascularity: '3', pliability: '5', height: '3' });
    expect(r.total).toBe(13);
    expect(r.max).toBe(13);
    expect(r.level).toBe('Cicatriz grave');
  });

  it('clampa valores acima do max', () => {
    const r = calcVancouver({ pigmentation: '99', vascularity: '99', pliability: '99', height: '99' });
    expect(r.total).toBe(13);
  });

  it('total 0 = cicatriz normal', () => {
    expect(calcVancouver({}).level).toBe('Cicatriz normal');
  });

  it('<= 4 = leve', () => {
    expect(calcVancouver({ pigmentation: '1', vascularity: '1', pliability: '1', height: '1' }).level).toBe('Cicatriz leve');
  });

  it('>= 9 = grave', () => {
    expect(calcVancouver({ pigmentation: '2', vascularity: '3', pliability: '5', height: '0' }).level).toBe('Cicatriz grave');
  });
});

describe('calcEdema', () => {
  it('0 = ausente', () => {
    expect(calcEdema(0).description).toBe('Ausente');
  });

  it('1 = leve', () => {
    expect(calcEdema(1).description).toContain('Leve');
  });

  it('2 = moderado', () => {
    expect(calcEdema(2).description).toContain('Moderado');
  });

  it('3 = acentuado', () => {
    expect(calcEdema(3).description).toContain('Acentuado');
  });

  it('>= 4 = grave', () => {
    expect(calcEdema(4).description).toContain('Grave');
  });
});
