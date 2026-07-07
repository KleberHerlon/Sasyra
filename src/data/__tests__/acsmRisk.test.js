import { describe, it, expect } from 'vitest';
import { acsmRiskStrata } from '../acsmRisk';

describe('acsmRiskStrata', () => {
  it('retorna estágio 1 (baixo risco) para sem fatores', () => {
    const r = acsmRiskStrata([], 'Masculino', 25);
    expect(r.estagio).toBe(1);
    expect(r.label).toBe('Baixo Risco');
  });

  it('retorna estágio 3 (alto risco) para sintomas cardíacos', () => {
    const r = acsmRiskStrata(['sintomas_cardiacos'], 'Masculino', 30);
    expect(r.estagio).toBe(3);
    expect(r.label).toBe('Alto Risco');
  });

  it('retorna estágio 3 para diabetes + hipertensão', () => {
    const r = acsmRiskStrata(['diabetes', 'hipertensao'], 'Masculino', 30);
    expect(r.estagio).toBe(3);
  });

  it('retorna estágio 2 (risco moderado) para 2+ fatores', () => {
    const r = acsmRiskStrata(['tabagismo', 'sedentarismo'], 'Masculino', 30);
    expect(r.estagio).toBe(2);
    expect(r.label).toBe('Risco Moderado');
  });

  it('considera idade como fator de risco para homem >= 45', () => {
    const r = acsmRiskStrata(['tabagismo'], 'Masculino', 45);
    expect(r.estagio).toBe(2);
    expect(r.totalFatores).toBe(2);
  });

  it('considera idade como fator de risco para mulher >= 55', () => {
    const r = acsmRiskStrata(['tabagismo'], 'Feminino', 55);
    expect(r.estagio).toBe(2);
    expect(r.totalFatores).toBe(2);
  });

  it('não considera idade como fator de risco para homem < 45', () => {
    const r = acsmRiskStrata(['tabagismo'], 'Masculino', 30);
    expect(r.estagio).toBe(1);
    expect(r.totalFatores).toBe(1);
  });

  it('retorna null/undefined handling para detectedRiscos null', () => {
    const r = acsmRiskStrata(null, 'Masculino', 25);
    expect(r.estagio).toBe(1);
  });
});
