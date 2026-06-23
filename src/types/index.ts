export interface User {
  nome: string;
  prof: string;
  crefito?: string;
}

export interface Patient {
  id: number;
  nome: string;
  dataNasc: string;
  sexo: string;
  profissao: string;
  convenio: string;
  telefone?: string;
  peso?: string;
  altura?: string;
  lateralidade?: string;
  estadoCivil?: string;
  sessoesAuth?: string;
  data?: string;
  evaluations?: any[];
}

export interface GonioRow {
  id: number;
  joint: string;
  movement: string;
  value: string;
}

export interface LogEntry {
  id: number;
  sessaoNum?: number;
  data: string;
  eva: number;
  procedimentos: string[];
  resposta: string;
  evolucao: string;
  metas: string;
  escalas: string;
}

export interface Study {
  id: string;
  titulo: string;
  pontuacao: number;
  conclusao: string;
  fonte: string;
}

export interface CifItem {
  code: string;
  desc: string;
  qualifier: number;
}

export interface TestItem {
  name: string;
  desc: string;
  how: string;
  video: string;
}

export interface KbEntry {
  label: string;
  tests: TestItem[];
  redFlags: string[];
  goldStandard: string;
  yellowFlags: string[];
  escalas: string[];
}

export interface EvidenceEntry {
  cif: string[];
  pedro: Study[];
  escalas: string[];
  atualizacao: string;
}
