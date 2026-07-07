import { describe, it, expect } from 'vitest';
import { calcOxford, calcPERFECT } from '../uroScales';

describe('calcOxford', () => {
  it('retorna grau exato', () => {
    expect(calcOxford(0).level).toBe('Sem contração');
    expect(calcOxford(3).level).toBe('Contração moderada');
    expect(calcOxford(5).level).toBe('Contração forte');
  });

  it('retorna fallback para índice inválido', () => {
    const r = calcOxford(10);
    expect(r.grade).toBe('—');
    expect(r.level).toBe('Não avaliado');
  });
});

describe('calcPERFECT', () => {
  it('soma power + endurance + repetitions + fast', () => {
    const r = calcPERFECT({ power: '4', endurance: '6', repetitions: '3', fast: '2' });
    expect(r.total).toBe(15);
    expect(r.level).toBe('Função excelente');
  });

  it('classifica >= 10 como boa', () => {
    expect(calcPERFECT({ power: '3', endurance: '4', repetitions: '2', fast: '1' }).level).toBe('Função boa');
  });

  it('classifica >= 5 como moderada', () => {
    expect(calcPERFECT({ power: '2', endurance: '2', repetitions: '1', fast: '0' }).level).toBe('Função moderada');
  });

  it('classifica < 5 como fraca', () => {
    expect(calcPERFECT({ power: '1', endurance: '1', repetitions: '0', fast: '0' }).level).toBe('Função fraca');
  });
});
