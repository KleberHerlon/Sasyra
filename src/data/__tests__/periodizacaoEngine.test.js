import { describe, it, expect } from 'vitest';
import { gerarMacrociclo, gerarMicrocicloSemanal, sugerirTransicao } from '../periodizacaoEngine';

describe('gerarMacrociclo', () => {
  it('gera macrociclo para hipertrofia', () => {
    const r = gerarMacrociclo('hipertrofia', 'iniciante', 12);
    expect(r).toBeTruthy();
    expect(r.mesociclos.length).toBeGreaterThan(0);
    expect(r.params.label).toBe('Hipertrofia');
  });

  it('retorna null para objetivo inválido', () => {
    expect(gerarMacrociclo('invalido', 'iniciante', 12)).toBeNull();
  });

  it('distribui semanas entre mesociclos', () => {
    const r = gerarMacrociclo('forca', 'intermediario', 16);
    const total = r.mesociclos.reduce((s, m) => s + m.duracaoSemanas, 0);
    expect(total).toBe(16);
  });
});

describe('gerarMicrocicloSemanal', () => {
  it('extrai microciclo de uma semana válida', () => {
    const macro = gerarMacrociclo('hipertrofia', 'iniciante', 12);
    const r = gerarMicrocicloSemanal(macro, 1);
    expect(r).toBeTruthy();
    expect(r.series).toBeGreaterThan(0);
  });

  it('retorna null para semana fora do range', () => {
    const macro = gerarMacrociclo('hipertrofia', 'iniciante', 8);
    expect(gerarMicrocicloSemanal(macro, 99)).toBeNull();
  });
});

describe('sugerirTransicao', () => {
  it('sugere transição após semanas suficientes', () => {
    const r = sugerirTransicao('hipertrofia', 12);
    expect(r).toBeTruthy();
    expect(typeof r.prontaParaTransicao).toBe('boolean');
  });

  it('retorna null para objetivo inválido', () => {
    expect(sugerirTransicao('invalido', 12)).toBeNull();
  });
});
