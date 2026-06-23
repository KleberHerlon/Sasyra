import { REF } from "@/data/joints";

export function getRef(mv: string, jt: string): string {
  return REF[`${mv}|${jt}`] || "";
}

export function isOutOfRange(val: string | number | undefined, refStr: string): boolean {
  if (!refStr || val === undefined || val === null || val === "") return false;
  const m = refStr.match(/(\d+)[–-](\d+)/);
  if (!m) return false;
  return Number(val) > Number(m[2]);
}
