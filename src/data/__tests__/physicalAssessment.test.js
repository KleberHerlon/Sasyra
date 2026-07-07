import { describe, it, expect } from 'vitest';
import {
  calcPollock7Dobras, calcPollock3Dobras,
  calcVO2maxCooper, calcVO2maxRockport,
  calc1RMPreditivo, calcPercentual1RM, calcZonaTreino,
} from '../physicalAssessment';

describe('calcPollock7Dobras', () => {
  it('calcula percentual de gordura masculino', () => {
    const r = calcPollock7Dobras({ peitoral: 12, abdominal: 22, coxa: 18, suprailiaca: 20, subescapular: 16, tricipital: 14, axilarMedia: 10 }, 'Masculino', 30);
    expect(r.percentualGordura).toBeGreaterThan(0);
    expect(r.percentualGordura).toBeLessThan(50);
    expect(r.protocolo).toBe('Pollock 7 Dobras');
    expect(r.densidadeCorporal).toBeGreaterThan(0);
  });

  it('calcula percentual de gordura feminino', () => {
    const r = calcPollock7Dobras({ peitoral: 18, abdominal: 26, coxa: 28, suprailiaca: 24, subescapular: 20, tricipital: 22, axilarMedia: 16 }, 'Feminino', 30);
    expect(r.percentualGordura).toBeGreaterThan(0);
    expect(r.percentualGordura).toBeLessThan(50);
  });
});

describe('calcPollock3Dobras', () => {
  it('calcula percentual de gordura masculino', () => {
    const r = calcPollock3Dobras({ abdominal: 22, coxa: 18, peitoral: 12 }, 'Masculino', 30);
    expect(r.percentualGordura).toBeGreaterThan(0);
    expect(r.protocolo).toBe('Pollock 3 Dobras');
  });
});

describe('calcVO2maxCooper', () => {
  it('calcula VO2max e classifica para homem 30 anos', () => {
    const r = calcVO2maxCooper(2800, 'Masculino', 30);
    expect(r.vo2max).toBeGreaterThan(40);
    expect(r.classificacao).toBeTruthy();
    expect(r.classificacao).not.toBe('—');
  });

  it('classifica performance ruim para distância baixa', () => {
    const r = calcVO2maxCooper(1000, 'Masculino', 30);
    expect(r.classificacao).toBe('Muito Ruim');
  });
});

describe('calcVO2maxRockport', () => {
  it('calcula VO2max de caminhada', () => {
    const r = calcVO2maxRockport(80, 'Masculino', 40, 14.5, 150);
    expect(r.vo2max).toBeGreaterThan(20);
    expect(r.vo2max).toBeLessThan(60);
  });
});

describe('calc1RMPreditivo', () => {
  it('retorna carga direta para 1 repetição', () => {
    const r = calc1RMPreditivo(100, 1);
    expect(r.rm).toBe(100);
    expect(r.formula).toBe('Direto');
  });

  it('calcula 1RM preditivo para 5 repetições', () => {
    const r = calc1RMPreditivo(80, 5);
    expect(r.rm).toBeGreaterThan(80);
    expect(r.rm).toBeLessThan(100);
    expect(r.classe).toBe('Força Máxima — Potência');
  });

  it('retorna bloqueio para mais de 10 repetições', () => {
    const r = calc1RMPreditivo(40, 15);
    expect(r.rm).toBeNull();
    expect(r.bloqueio).toBeTruthy();
    expect(r.bloqueio.tipo).toBe('alerta');
  });

  it('classifica hipertrofia para 8-12 repetições', () => {
    const r = calc1RMPreditivo(50, 10);
    expect(r.classe).toBe('Hipertrofia');
  });

  it('bloqueia e retorna null para reps > 10 (impreciso)', () => {
    const r = calc1RMPreditivo(30, 20);
    expect(r.rm).toBeNull();
    expect(r.bloqueio.tipo).toBe('alerta');
  });
});

describe('calcPercentual1RM', () => {
  it('calcula percentual do RM', () => {
    expect(calcPercentual1RM(100, 80)).toBe(80);
  });

  it('retorna null para inputs inválidos', () => {
    expect(calcPercentual1RM(0, 80)).toBeNull();
    expect(calcPercentual1RM(100, null)).toBeNull();
  });
});

describe('calcZonaTreino', () => {
  it('calcula zona de treino', () => {
    const r = calcZonaTreino(100, 60, 80);
    expect(r.cargaMinima).toBe(60);
    expect(r.cargaMaxima).toBe(80);
  });

  it('retorna null para RM inválido', () => {
    expect(calcZonaTreino(0, 60, 80)).toBeNull();
  });
});
