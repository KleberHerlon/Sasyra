import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

const mockStore = {};
const mockLocalStorage = {
  getItem: (key) => mockStore[key] ?? null,
  setItem: (key, val) => { mockStore[key] = String(val); },
  removeItem: (key) => { delete mockStore[key]; },
  clear: () => { Object.keys(mockStore).forEach(k => delete mockStore[k]); },
  get length() { return Object.keys(mockStore).length; },
  key: (i) => Object.keys(mockStore)[i] ?? null,
};

vi.stubGlobal('localStorage', mockLocalStorage);

import { readFisioterapiaRestrictions, getBridgeAlertCount, getBlockedExercises, getRestrictionWarning, isAvaliacaoDesatualizada } from '../transitionBridge';

describe('readFisioterapiaRestrictions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('retorna array vazio para studentId vazio', () => {
    expect(readFisioterapiaRestrictions('')).toEqual([]);
    expect(readFisioterapiaRestrictions(null)).toEqual([]);
  });

  it('retorna array vazio se sem dados no localStorage', () => {
    expect(readFisioterapiaRestrictions('abc')).toEqual([]);
  });

  it('deteta restrição baseada em queixa', () => {
    localStorage.setItem('sasyra_assessments', JSON.stringify([
      { patientId: 'abc', queixa: 'lombalgia crônica', diagnosticoCinesio: 'dor ao levantar peso', date: '2025-01-01' },
    ]));
    const r = readFisioterapiaRestrictions('abc');
    expect(r.length).toBeGreaterThan(0);
    expect(r.some(x => x.key === 'lombalgia')).toBe(true);
  });

  it('retorna vazio se paciente não encontrado', () => {
    localStorage.setItem('sasyra_assessments', JSON.stringify([
      { patientId: 'xyz', queixa: 'dor' },
    ]));
    expect(readFisioterapiaRestrictions('abc')).toEqual([]);
  });
});

describe('getBridgeAlertCount', () => {
  it('retorna 0 se sem restrições', () => {
    expect(getBridgeAlertCount('abc')).toBe(0);
  });
});

describe('getBlockedExercises', () => {
  it('retorna Set de exercícios bloqueados', () => {
    const restrictions = [{ key: 'lombalgia' }, { key: 'ombralgia' }];
    const blocked = getBlockedExercises(restrictions);
    expect(blocked.has('peso-morto')).toBe(true);
    expect(blocked.has('desenvolvimento')).toBe(true);
    expect(blocked.has('supino')).toBe(false);
  });

  it('retorna Set vazio para restrições sem mapeamento', () => {
    const blocked = getBlockedExercises([{ key: 'unknown' }]);
    expect(blocked.size).toBe(0);
  });
});

describe('getRestrictionWarning', () => {
  it('retorna warning para exercício bloqueado', () => {
    const restrictions = [{ key: 'lombalgia', local: 'Coluna', descricao: 'Evitar', alternativa: 'Fazer outro' }];
    const w = getRestrictionWarning('peso-morto', restrictions);
    expect(w).not.toBeNull();
    expect(w.restricao).toBe('lombalgia');
    expect(w.mensagem).toBe('Evitar');
  });

  it('retorna null para exercício não relacionado', () => {
    const restrictions = [{ key: 'lombalgia' }];
    expect(getRestrictionWarning('rosca-direta', restrictions)).toBeNull();
  });
});

describe('isAvaliacaoDesatualizada', () => {
  it('retorna false para undefined', () => {
    expect(isAvaliacaoDesatualizada(undefined)).toBe(false);
  });

  it('retorna true para data muito antiga', () => {
    expect(isAvaliacaoDesatualizada('2020-01-01')).toBe(true);
  });

  it('retorna false para data recente', () => {
    const hoje = new Date().toISOString().slice(0, 10);
    expect(isAvaliacaoDesatualizada(hoje)).toBe(false);
  });
});
