import { describe, it, expect } from 'vitest';
import { calcInternalLoad, calcMonotony, deloadSuggestion } from '../pseFoster';

describe('calcInternalLoad', () => {
  it('calcula carga interna correta', () => {
    const r = calcInternalLoad(5, 30);
    expect(r.cargaInternaUA).toBe(150);
    expect(r.pseLabel).toBe('Um pouco pesado');
  });

  it('retorna null para inputs inválidos', () => {
    expect(calcInternalLoad(0, 30)).toBeNull();
    expect(calcInternalLoad(5, 0)).toBeNull();
    expect(calcInternalLoad(null, 30)).toBeNull();
  });

  it('usa valor arredondado para buscar rótulo PSE', () => {
    const r = calcInternalLoad(4.3, 30);
    expect(r.pseLabel).toBe('Moderado');
  });
});

describe('calcMonotony', () => {
  it('calcula monotonia e strain com 3 sessões', () => {
    const sessoes = [
      { pse: 5, duracaoMinutos: 30 },
      { pse: 6, duracaoMinutos: 35 },
      { pse: 4, duracaoMinutos: 25 },
    ];
    const r = calcMonotony(sessoes);
    expect(r.cargaSemanalTotal).toBe(460); // 5*30 + 6*35 + 4*25
    expect(r.monotonia).toBeGreaterThan(0);
    expect(r.strain).toBeGreaterThan(0);
    expect(typeof r.media).toBe('number');
    expect(typeof r.dp).toBe('number');
  });

  it('retorna null para menos de 2 sessões', () => {
    expect(calcMonotony([{ pse: 5, duracaoMinutos: 30 }])).toBeNull();
    expect(calcMonotony([])).toBeNull();
    expect(calcMonotony(null)).toBeNull();
  });

  it('trata carga direta (cargaInternaUA) quando disponível', () => {
    const sessoes = [
      { cargaInternaUA: 150 },
      { cargaInternaUA: 200 },
      { cargaInternaUA: 100 },
    ];
    const r = calcMonotony(sessoes);
    expect(r.cargaSemanalTotal).toBe(450);
  });

  it('lida com dp = 0 (monotonia = 1)', () => {
    const sessoes = [
      { pse: 5, duracaoMinutos: 30 },
      { pse: 5, duracaoMinutos: 30 },
    ];
    const r = calcMonotony(sessoes);
    expect(r.monotonia).toBe(1);
  });
});

describe('deloadSuggestion', () => {
  it('sugere deload para strain alto', () => {
    const sessoes = [
      { pse: 8, duracaoMinutos: 45 },
      { pse: 9, duracaoMinutos: 40 },
      { pse: 8, duracaoMinutos: 50 },
    ];
    const monotony = calcMonotony(sessoes);
    const sugestoes = deloadSuggestion(monotony, sessoes);
    expect(sugestoes.length).toBeGreaterThan(0);
    expect(sugestoes.some(s => s.mensagem.includes('Strain'))).toBe(true);
  });

  it('retorna array vazio para monotonyResult nulo', () => {
    expect(deloadSuggestion(null, [])).toEqual([]);
  });

  it('sugere deload para 3+ sessões com PSE >= 8', () => {
    const monotony = calcMonotony([
      { pse: 3, duracaoMinutos: 20 },
      { pse: 4, duracaoMinutos: 25 },
    ]);
    const sessoes = [
      { pse: 8, duracaoMinutos: 30 },
      { pse: 9, duracaoMinutos: 35 },
      { pse: 8, duracaoMinutos: 40 },
    ];
    const sugestoes = deloadSuggestion(monotony, sessoes);
    expect(sugestoes.some(s => s.mensagem.includes('PSE ≥ 8'))).toBe(true);
  });
});
