import { describe, it, expect } from 'vitest';
import { calcYBalance, calcLSI, calcLSIBidirectional, calcRTS } from '../sportsScales';

describe('calcYBalance', () => {
  it('calcula composite scores corretamente com leg length', () => {
    const scores = { anteriorD: 60, posteromedialD: 90, posterolateralD: 80, anteriorE: 55, posteromedialE: 85, posterolateralE: 75 };
    const result = calcYBalance(scores, 80);
    expect(result.compositeD).toBeCloseTo(95.8, 0);
    expect(result.compositeE).toBeCloseTo(89.6, 0);
    expect(result.lsi).toBeGreaterThan(0);
  });

  it('retorna LSI = 0 quando perna E tem valor 0', () => {
    const scores = { anteriorD: 60, posteromedialD: 90, posterolateralD: 80, anteriorE: 0, posteromedialE: 0, posterolateralE: 0 };
    const result = calcYBalance(scores, 80);
    expect(result.lsi).toBe(0);
  });

  it('retorna null para input null', () => {
    expect(calcYBalance(null, 80)).toBeNull();
  });

  it('usa legLength = 1 como fallback se não informado', () => {
    const scores = { anteriorD: 60, posteromedialD: 90, posterolateralD: 80, anteriorE: 55, posteromedialE: 85, posterolateralE: 75 };
    const result = calcYBalance(scores);
    expect(result.compositeD).toBeGreaterThan(0);
    expect(result.compositeE).toBeGreaterThan(0);
  });
});

describe('calcLSI', () => {
  it('calcula LSI normal', () => {
    expect(calcLSI(90, 100)).toBe(90);
  });

  it('retorna 0 se unaffected for 0', () => {
    expect(calcLSI(90, 0)).toBe(0);
  });

  it('retorna 0 se affected for 0', () => {
    expect(calcLSI(0, 100)).toBe(0);
  });
});

describe('calcLSIBidirectional', () => {
  it('usa lado afetado Direito como numerador', () => {
    expect(calcLSIBidirectional(80, 100, 'Direito')).toBe(80);
  });

  it('usa lado afetado Esquerdo como numerador', () => {
    expect(calcLSIBidirectional(100, 80, 'Esquerdo')).toBe(80);
  });

  it('usa E/D como fallback se ladoAfetado vazio (else assume Esquerdo afetado)', () => {
    expect(calcLSIBidirectional(80, 100, '')).toBe(125);
  });

  it('retorna 0 se um dos valores for 0', () => {
    expect(calcLSIBidirectional(0, 100, 'Direito')).toBe(0);
    expect(calcLSIBidirectional(100, 0, 'Direito')).toBe(0);
  });
});

describe('calcRTS', () => {
  it('calcula percentual corretamente', () => {
    const criteria = [
      { id: 'a', met: true }, { id: 'b', met: true },
      { id: 'c', met: false }, { id: 'd', met: true },
    ];
    const result = calcRTS(criteria);
    expect(result.total).toBe(4);
    expect(result.met).toBe(3);
    expect(result.pct).toBe(75);
    expect(result.status).toContain('Próximo');
  });

  it('classifica >= 90% como apto', () => {
    const criteria = Array.from({ length: 10 }, (_, i) => ({ id: String(i), met: i < 9 }));
    const result = calcRTS(criteria);
    expect(result.pct).toBe(90);
    expect(result.status).toContain('Apto');
  });

  it('classifica >= 70% como próximo do retorno', () => {
    const criteria = Array.from({ length: 10 }, (_, i) => ({ id: String(i), met: i < 7 }));
    const result = calcRTS(criteria);
    expect(result.pct).toBe(70);
    expect(result.status).toContain('Próximo');
  });

  it('retorna valores padrão para lista vazia', () => {
    const result = calcRTS([]);
    expect(result.total).toBe(0);
    expect(result.status).toBe('Sem critérios preenchidos');
  });
});
