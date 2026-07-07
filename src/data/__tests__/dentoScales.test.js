import { describe, it, expect } from "vitest";
import { calcFonseca, calcRDCTMD } from "../dentoScales";

describe("calcFonseca", () => {
  it("retorna sem disfunção para total 0", () => {
    const r = calcFonseca({});
    expect(r.total).toBe(0);
    expect(r.level).toBe("Sem disfunção");
    expect(r.max).toBe(20);
  });
  it("classifica disfunção leve para pct <= 45", () => {
    const r = calcFonseca({ q1: 2, q2: 2, q3: 2, q4: 2, q5: 0 });
    expect(r.total).toBe(8);
    expect(r.level).toBe("Disfunção leve a moderada");
  });
  it("classifica disfunção moderada para pct <= 70", () => {
    const r = calcFonseca({ q1: 3, q2: 3, q3: 3, q4: 3, q5: 2 });
    expect(r.total).toBe(14);
    expect(r.level).toBe("Disfunção moderada");
  });
  it("classifica severa para pct alto", () => {
    const r = calcFonseca({ q1: 4, q2: 4, q3: 4, q4: 4, q5: 4 });
    expect(r.total).toBe(20);
    expect(r.level).toBe("Disfunção muito severa");
  });
  it("retorna pct arredondado", () => {
    const r = calcFonseca({ q1: 1, q2: 1 });
    expect(r.pct).toBe(10);
  });
});

describe("calcRDCTMD", () => {
  it("retorna sem disfunção para total <= 10", () => {
    const r = calcRDCTMD({ a: 3, b: 4 });
    expect(r.total).toBe(7);
    expect(r.level).toBe("Sem disfunção");
  });
  it("classifica disfunção leve para total <= 20", () => {
    const r = calcRDCTMD({ a: 8, b: 7 });
    expect(r.total).toBe(15);
    expect(r.level).toBe("Disfunção leve");
  });
  it("classifica disfunção moderada para total <= 30", () => {
    const r = calcRDCTMD({ a: 12, b: 13 });
    expect(r.total).toBe(25);
    expect(r.level).toBe("Disfunção moderada");
  });
  it("classifica severa para total > 30", () => {
    const r = calcRDCTMD({ a: 20, b: 20, c: 8 });
    expect(r.total).toBe(48);
    expect(r.level).toBe("Disfunção severa");
  });
  it("lida com objeto vazio", () => {
    const r = calcRDCTMD({});
    expect(r.total).toBe(0);
    expect(r.level).toBe("Sem disfunção");
  });
});
