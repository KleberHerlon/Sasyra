import { describe, it, expect } from "vitest";
import { calcMinnesota } from "../cardioScales";

describe("calcMinnesota", () => {
  it("retorna impacto mínimo para total <= 5", () => {
    const r = calcMinnesota({ m1: "2", m2: "1", m3: "0" });
    expect(r.total).toBe(3);
    expect(r.level).toBe("Impacto mínimo");
    expect(r.max).toBe(105);
  });
  it("retorna impacto leve para total <= 30", () => {
    const r = calcMinnesota({ m1: "10", m2: "10", m3: "5" });
    expect(r.total).toBe(25);
    expect(r.level).toBe("Impacto leve");
  });
  it("retorna impacto moderado para total <= 60", () => {
    const r = calcMinnesota({ m1: "20", m2: "20", m3: "15" });
    expect(r.total).toBe(55);
    expect(r.level).toBe("Impacto moderado");
  });
  it("retorna impacto grave para total <= 90", () => {
    const r = calcMinnesota({ m1: "30", m2: "30", m3: "20" });
    expect(r.total).toBe(80);
    expect(r.level).toBe("Impacto grave");
  });
  it("retorna impacto muito grave para total > 90", () => {
    const r = calcMinnesota({ m1: "35", m2: "35", m3: "35" });
    expect(r.total).toBe(105);
    expect(r.level).toBe("Impacto muito grave");
  });
  it("lida com objeto vazio", () => {
    const r = calcMinnesota({});
    expect(r.total).toBe(0);
    expect(r.level).toBe("Impacto mínimo");
  });
});
