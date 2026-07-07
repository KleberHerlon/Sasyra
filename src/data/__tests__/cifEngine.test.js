import { describe, it, expect } from 'vitest';
import { generateCIF } from '../cifEngine';

describe('generateCIF', () => {
  it('retorna código b280 com qualifier 3 para EVA >= 7', () => {
    const r = generateCIF({ evaMov: 8, avds: [], localDor: [] });
    expect(r).toContainEqual({ code: 'b280', desc: 'Sensação de dor', qualifier: 3 });
  });

  it('retorna código b280 com qualifier 2 para EVA entre 4 e 6', () => {
    const r = generateCIF({ evaMov: 5, avds: [], localDor: [] });
    expect(r).toContainEqual({ code: 'b280', desc: 'Sensação de dor', qualifier: 2 });
  });

  it('não retorna código de dor para EVA < 4', () => {
    const r = generateCIF({ evaMov: 2, avds: [], localDor: [] });
    expect(r.find(c => c.code === 'b280')).toBeUndefined();
  });

  it('inclui d450 (Andar) quando AVD contém Andar', () => {
    const r = generateCIF({ evaMov: 5, avds: ['Andar'], localDor: [] });
    expect(r).toContainEqual({ code: 'd450', desc: 'Andar', qualifier: 2 });
  });

  it('inclui d4551 (Subir escadas) quando AVD contém Subir escadas', () => {
    const r = generateCIF({ evaMov: 3, avds: ['Subir escadas'], localDor: [] });
    expect(r).toContainEqual({ code: 'd4551', desc: 'Subir escadas', qualifier: 2 });
  });

  it('inclui d850 (Trabalho) quando AVD contém Trabalho manual', () => {
    const r = generateCIF({ evaMov: 3, avds: ['Trabalho manual'], localDor: [] });
    expect(r).toContainEqual({ code: 'd850', desc: 'Trabalho remunerado', qualifier: 2 });
  });

  it('retorna array vazio para paciente sem dor nem AVDs', () => {
    const r = generateCIF({ evaMov: 2, avds: [], localDor: [] });
    expect(r).toEqual([]);
  });

  it('usa qualifier 3 para d450 quando EVA >= 7', () => {
    const r = generateCIF({ evaMov: 8, avds: ['Andar'], localDor: [] });
    expect(r).toContainEqual({ code: 'd450', desc: 'Andar', qualifier: 3 });
  });
});
