# Contexto de Sessão — SASYRA

## Regra: Continuidade da Análise de Personas

Ao iniciar uma nova sessão, SEMPRE ler o arquivo `SIMULACAO_PERSONAS.md` antes de qualquer modificação no código. Use como ponto de partida para:

1. **Validar** se uma funcionalidade atende às dores apontadas pelas personas
2. **Priorizar** correções baseado nos contras mais citados (top 5)
3. **Guiar** novas implementações pelos prós mais valorizados (top 5)
4. **Manter** a nota média geral (~7.16) como referência de satisfação atual

### Top 5 Contras (prioridade de resolução)

1. Dados só no localStorage sem backend
2. Falta app mobile para alunos
3. Sem integração Google Calendar/WhatsApp
4. ~~Falta suporte para áreas específicas (pediatria, neuro, crossfit)~~ ✅ Implementado
5. IA com custo alto nos planos básicos

---

## Sessão Atual — 07/07/2026

### O que foi implementado

#### 1. Escalas extraídas para `src/data/` + testes
| Módulo | Arquivo | Funções | Testes |
|---|---|---|---|
| Geriatria | `src/data/geriatriaScales.js` | MEEM, GDS15, SarcF, Katz, Lawton, Tinetti, Fragilidade | 20 |
| Urológica | `src/data/uroScales.js` | Oxford, PERFECT | 6 |
| Dermatofuncional | `src/data/dermatoScales.js` | Vancouver, Edema | 10 |
| Oncológica | `src/data/oncologyScales.js` | ECOG, KPS, EORTC, ESAS | 11 |

#### 2. `src/data/__tests__/transitionBridge.test.js` — 12 testes
Testa `encaminharParaPE` e `receberDeFisio` com mock de localStorage para cada módulo de fisioterapia.

#### 3. Correções de escalas
- **calcLawton**: max 27→24, cutoffs >=20 independente / >=13 leve / >=7 moderada / <7 severa
- **calcLSIBidirectional**: empty `ladoAfetado` → else branch (125)
- **sportsScales**: threshold 75% → "Próximo do retorno" (não "Continua")

#### 4. `src/components/GeneralAssessment.jsx` — Componente compartilhado
Encapsula BodyMap + caracterização da dor + Yellow Flags com persistência própria em localStorage (`{module}_general_{sid}`). Instanciado em 8 módulos com 1 import + 1 tag JSX cada.

#### 5. GeneralAssessment integrado em 8 módulos
CardioRespiratory, UroGynecology, Geriatria, DermatoFunctional, Rheumatology, SportsPhysio, Oncology, Pediatria — adicionado na aba anamnese com cores específicas de cada módulo.

#### 6. Relatório de comparação gerado
Mapeamento completo de todos os ~20 campos/funcionalidades do Assessment.jsx gold standard vs cada módulo, identificando lacunas como BodyMap, Yellow Flags, MRC/Gonio dinâmico, AutoCIF, paywall, mobile responsive.

### Total de testes: 596 ✓ (18 suites, 0 falhas)

---

## O que foi implementado nesta sessão (07/07/2026)

#### 1. GeneralAssessment em Neuro
Neuro era o único módulo de fisioterapia sem GeneralAssessment. Adicionado com `storageKey="neuro"` e cor roxa. Removidas seções inline duplicadas (BodyMap + Caracterização da Dor + Yellow Flags).

#### 2. `src/data/pediatriaScales.js` + `cardioScales.js` + `dentoScales.js`
| Módulo | Arquivo | Funções | Testes |
|---|---|---|---|
| Pediatria | `src/data/pediatriaScales.js` | calcGMFCS, calcAIMS, calcMCHAT, calcPEDI | 17 |
| Cardio | `src/data/cardioScales.js` | calcMinnesota (extraído do inline) | 6 |
| DTM | `src/data/dentoScales.js` | calcFonseca, calcRDCTMD | 10 |

#### 3. Integração nos módulos
- **CardioRespiratory**: `calcMinnesota` agora importado de `cardioScales` (inline removido)
- **Pediatria**: calcGMFCS/AIMS/MCHAT/PEDI usam `pediatriaScales` — inline substituído por chamadas às funções
- **SportsPhysio**: ScaleSelector agora inclui `Fonseca Anamnestic Index` + `RDC/TMD` (DTM)
- **Pediatria**: ScaleSelector ampliado com GMFM, MACS, MABC-2, FAC, Vignos

#### 4. Novas escalas em `src/scales.js` (5 entradas)
GMFM, MACS, MABC-2, FAC, Vignos Scale — todas com interpretação completa via `simpleScale`

#### 5. Correções em escalas existentes
- `calcMinnesota` extraída para `cardioScales.js` (removida definição inline duplicada)
- `calcGMFCS`/`calcAIMS`/`calcMCHAT`/`calcPEDI` agora em `pediatriaScales.js` com testes
