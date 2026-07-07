import { describe, it, expect } from 'vitest';
import { calcIMC, calcRCQ, calcFCRegistro } from '../peScales';

describe('calcIMC', () => {
  it('calcula IMC normal', () => {
    const r = calcIMC(70, 175);
    expect(r.imc).toBeCloseTo(22.9, 0);
    expect(r.classificacao).toBe('Peso normal');
  });

  it('retorna null para inputs inválidos', () => {
    expect(calcIMC(0, 175)).toBeNull();
    expect(calcIMC(70, 0)).toBeNull();
    expect(calcIMC(null, 175)).toBeNull();
  });

  it('classifica abaixo do peso', () => {
    const r = calcIMC(50, 175);
    expect(r.classificacao).toBe('Abaixo do peso');
  });

  it('classifica sobrepeso', () => {
    const r = calcIMC(85, 175);
    expect(r.classificacao).toBe('Sobrepeso');
  });

  it('classifica obesidade grau I', () => {
    const r = calcIMC(95, 175);
    expect(r.classificacao).toBe('Obesidade Grau I');
  });

  it('classifica obesidade grau II', () => {
    const r = calcIMC(110, 175);
    expect(r.classificacao).toBe('Obesidade Grau II');
  });

  it('classifica obesidade grau III', () => {
    const r = calcIMC(130, 175);
    expect(r.classificacao).toBe('Obesidade Grau III');
  });
});

describe('calcRCQ', () => {
  it('calcula RCQ masculino baixo risco', () => {
    const r = calcRCQ(85, 100, 'Masculino');
    expect(r.rcq).toBeCloseTo(0.85, 1);
    expect(r.risco).toBe('Baixo');
  });

  it('calcula RCQ feminino alto risco', () => {
    const r = calcRCQ(95, 100, 'Feminino');
    expect(r.risco).toBe('Alto');
  });

  it('retorna null para inputs inválidos', () => {
    expect(calcRCQ(0, 100, 'Masculino')).toBeNull();
    expect(calcRCQ(85, null, 'Masculino')).toBeNull();
  });
});

describe('calcFCRegistro', () => {
  it('calcula zonas Karvonen para homem', () => {
    const r = calcFCRegistro(70, 30, 'Masculino');
    expect(r.fcMax).toBe(190);
    expect(r.fcReserva).toBe(120);
    expect(r.zonas.moderado.min).toBe(130);
    expect(r.zonas.intenso.min).toBe(154);
    expect(r.zonas.maximo.min).toBe(172);
  });

  it('calcula zonas Karvonen para mulher', () => {
    const r = calcFCRegistro(70, 30, 'Feminino');
    expect(r.fcMax).toBe(196);
    expect(r.fcReserva).toBe(126);
  });

  it('retorna null para inputs inválidos', () => {
    expect(calcFCRegistro(0, 30, 'Masculino')).toBeNull();
    expect(calcFCRegistro(70, null, 'Masculino')).toBeNull();
  });
});
