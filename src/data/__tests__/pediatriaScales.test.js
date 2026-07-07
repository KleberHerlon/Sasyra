import { describe, it, expect } from "vitest";
import { calcGMFCS, calcAIMS, calcMCHAT, calcPEDI } from "../pediatriaScales";

describe("calcGMFCS", () => {
  it("retorna Nível I para I", () => {
    const r = calcGMFCS("I");
    expect(r.label).toContain("Nível I");
    expect(r.color).toBe("#4ADE80");
  });
  it("retorna Nível V para V", () => {
    const r = calcGMFCS("V");
    expect(r.label).toContain("Nível V");
    expect(r.color).toBe("#A78BFA");
  });
  it("retorna fallback para valor inválido", () => {
    const r = calcGMFCS("X");
    expect(r.label).toBe("N/A");
  });
});

describe("calcAIMS", () => {
  it("classifica >= 45 como adequado", () => {
    const r = calcAIMS(48);
    expect(r.level).toBe("Desenvolvimento motor adequado");
    expect(r.color).toBe("#4ADE80");
  });
  it("classifica >= 30 como atraso leve", () => {
    const r = calcAIMS(32);
    expect(r.level).toBe("Atraso motor leve");
  });
  it("classifica >= 15 como atraso moderado", () => {
    const r = calcAIMS(18);
    expect(r.level).toBe("Atraso motor moderado");
  });
  it("classifica < 15 como atraso grave", () => {
    const r = calcAIMS(5);
    expect(r.level).toBe("Atraso motor grave");
  });
  it("clampa entre 0 e 58", () => {
    expect(calcAIMS(-5).total).toBe(0);
    expect(calcAIMS(100).total).toBe(58);
  });
});

describe("calcMCHAT", () => {
  it("retorna baixo risco para < 2 itens", () => {
    const r = calcMCHAT(["item1"]);
    expect(r.level).toBe("Baixo risco");
  });
  it("retorna risco moderado para 2 itens", () => {
    const r = calcMCHAT(["item1", "item2"]);
    expect(r.level).toBe("Risco moderado");
  });
  it("retorna risco elevado para >= 3 itens", () => {
    const r = calcMCHAT(["item1", "item2", "item3"]);
    expect(r.level).toBe("Risco elevado");
  });
  it("retorna baixo risco para array vazio", () => {
    const r = calcMCHAT([]);
    expect(r.level).toBe("Baixo risco");
  });
});

describe("calcPEDI", () => {
  it("classifica >= 80 como função preservada", () => {
    const r = calcPEDI(85);
    expect(r.level).toBe("Função preservada");
    expect(r.max).toBe(100);
  });
  it("classifica >= 50 como limitação moderada", () => {
    const r = calcPEDI(55);
    expect(r.level).toBe("Limitação funcional moderada");
  });
  it("classifica >= 20 como limitação grave", () => {
    const r = calcPEDI(25);
    expect(r.level).toBe("Limitação funcional grave");
  });
  it("classifica < 20 como limitação severa", () => {
    const r = calcPEDI(5);
    expect(r.level).toBe("Limitação funcional severa");
  });
  it("clampa entre 0 e 100", () => {
    expect(calcPEDI(-10).total).toBe(0);
    expect(calcPEDI(200).total).toBe(100);
  });
});
