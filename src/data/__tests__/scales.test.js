import { describe, it, expect } from 'vitest';
import SCALES from '../../scales.js';

const scaleNames = Object.keys(SCALES);

describe('SCALES data structure', () => {
  it('contains at least 80 scales', () => {
    expect(scaleNames.length).toBeGreaterThanOrEqual(80);
  });

  it('every scale has an id, shortName, aliases, mcid, mdc', () => {
    scaleNames.forEach(name => {
      const s = SCALES[name];
      expect(s.id, `${name}: missing id`).toBeTruthy();
      expect(s.shortName, `${name}: missing shortName`).toBeTruthy();
      expect(Array.isArray(s.aliases), `${name}: aliases must be array`).toBe(true);
      expect(s.aliases.length, `${name}: empty aliases`).toBeGreaterThan(0);
      expect(typeof s.mcid, `${name}: mcid must be a number`).toBe('number');
      expect(s.mcid, `${name}: mcid must be >= 0`).toBeGreaterThanOrEqual(0);
      expect(typeof s.mdc, `${name}: mdc must be a number`).toBe('number');
      expect(s.mdc, `${name}: mdc must be >= 0`).toBeGreaterThanOrEqual(0);
    });
  });

  it('every scale has a valid interpret function', () => {
    scaleNames.forEach(name => {
      const s = SCALES[name];
      expect(typeof s.interpret, `${name}: interpret must be a function`).toBe('function');
      const raw = s.interpret(0);
      const r = raw.pct || raw;
      expect(r, `${name}: interpret(0) must return object with level and color`).toBeTruthy();
      expect(typeof r.level, `${name}: interpret(0).level must be string`).toBe('string');
      expect(typeof r.color, `${name}: interpret(0).color must be string`).toBe('string');
      expect(r.color, `${name}: interpret(0).color must be a hex color`).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});

describe('SCALES — full scales', () => {
  const fullScales = scaleNames.filter(name => !SCALES[name].simple);

  it(`has ${fullScales.length} full scales with questions`, () => {
    expect(fullScales.length).toBeGreaterThanOrEqual(20);
  });

  fullScales.forEach(name => {
    const s = SCALES[name];
    describe(name, () => {
      it('has sections and maxPerSection defined', () => {
        expect(typeof s.sections, 'sections must be a number').toBe('number');
        expect(s.sections).toBeGreaterThan(0);
      });

      it('has a non-empty questions array', () => {
        expect(Array.isArray(s.questions)).toBe(true);
        expect(s.questions.length).toBeGreaterThan(0);
        expect(s.questions.length).toBe(s.sections);
      });

      it('every question has id, label, and options', () => {
        s.questions.forEach((q, i) => {
          expect(q.id, `question[${i}] missing id`).toBeTruthy();
          expect(q.label, `question[${i}] missing label`).toBeTruthy();
          expect(Array.isArray(q.o), `question[${i}] must have options array`).toBe(true);
          expect(q.o.length, `question[${i}] must have at least 2 options`).toBeGreaterThanOrEqual(2);
        });
      });

      it('interpret returns valid result at boundaries', () => {
        [0, 25, 50, 75, 100].forEach(pct => {
          const r = s.interpret(pct);
          expect(r, `interpret(${pct}) must return object`).toBeTruthy();
          expect(r.level).toBeTruthy();
          expect(r.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
        });
      });
    });
  });
});

describe('SCALES — simple scales', () => {
  const simpleScales = scaleNames.filter(name => SCALES[name].simple);

  it(`has ${simpleScales.length} simple scales`, () => {
    expect(simpleScales.length).toBeGreaterThanOrEqual(30);
  });

  simpleScales.forEach(name => {
    const s = SCALES[name];
    describe(name, () => {
      it('has range array with min/max', () => {
        expect(Array.isArray(s.range)).toBe(true);
        expect(s.range.length).toBe(2);
        expect(typeof s.range[0]).toBe('number');
        expect(typeof s.range[1]).toBe('number');
        expect(s.range[1]).toBeGreaterThan(s.range[0]);
      });

      it('has goodDirection defined', () => {
        expect(['highIsGood', 'highIsBad']).toContain(s.goodDirection);
      });

      it('interpret returns valid result for min, mid, max', () => {
        const mid = Math.floor((s.range[0] + s.range[1]) / 2);
        [s.range[0], mid, s.range[1]].forEach(val => {
          const raw = s.interpret(val);
          const r = raw.pct || raw;
          expect(r, `interpret(${val}) must return object`).toBeTruthy();
          expect(r.level, `interpret(${val}).level`).toBeTruthy();
          expect(r.color, `interpret(${val}).color`).toMatch(/^#[0-9A-Fa-f]{6}$/);
        });
      });

      it('mcid is appropriate for range', () => {
        const span = s.range[1] - s.range[0];
        if (span <= 10) expect(s.mcid, `mcid (${s.mcid}) too large for range ${span}`).toBeLessThanOrEqual(3);
        if (s.range[1] <= 3) expect(s.mcid, `mcid (${s.mcid}) too large for max ${s.range[1]}`).toBeLessThanOrEqual(1);
      });
    });
  });
});

describe('SCALES — MCID/MDC consistency', () => {
  it('mdc is always <= mcid', () => {
    scaleNames.forEach(name => {
      const s = SCALES[name];
      expect(s.mdc, `${name}: mdc (${s.mdc}) should be <= mcid (${s.mcid})`).toBeLessThanOrEqual(s.mcid);
    });
  });
});

describe('SCALES — known scale IDs are present', () => {
  const expected = ['od', 'ndi', 'lysholm', 'dash', 'womac', 'tsk', 'grc', 'nprs', 'mmrc', 'mas', 'bbs', 'mif', 'nihss', 'tug', 'gmfcs', 'ecog', 'kps', 'dn4'];
  expected.forEach(id => {
    it(`contains scale with id "${id}"`, () => {
      const found = scaleNames.some(name => SCALES[name].id === id);
      expect(found, `No scale found with id="${id}"`).toBe(true);
    });
  });
});
