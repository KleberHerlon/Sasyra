# RELATÓRIO DE AVALIAÇÃO CLÍNICA — SASYRA

**Revisão por painel de 10 fisioterapeutas especialistas**
Data: Julho 2026

---

## NOTAS GERAIS POR MÓDULO

| Módulo | Nota | Força Principal | Gap Crítico |
|--------|------|-----------------|-------------|
| Ortopédica | 9.0 | Base de evidências com 50+ condições, CIF automático, red flags por patologia | Avaliação neurológica periférica segmentar ausente |
| Neuro | 8.0 | GCS, TIS, matriz de reflexos, dermatomos, 10 condições KB | BBS truncada 5 itens (erro clínico), MIF truncada 6 itens |
| Pediatria | 8.0 | Marcos motores, reflexos primitivos, curvas OMS, goniometria pediátrica | GMFM-66 item-a-item ausente |
| Dermato | 7.5 | Vancouver scar scale, perimetria, classificação queimaduras | POSAS não implementada, sem registro fotográfico |
| Cardio | 8.5 | MLHFQ completo, sinais vitais, ausculta detalhada, TC6M, espirometria | Sem % predito TC6M, sem prescrição de exercício |
| Uro | 8.0 | PERFECT, POP-Q, Oxford, ICIQ-SF, PFDI-20, FSFI | Questionários como número bruto, sem formulários interativos |
| Geriatria | 8.0 | Katz, Lawton, SARC-F, Tinetti, Fried, MEEM, GDS-15 | Sem Berg Balance Scale (padrão-ouro) |
| Oncologia | 7.0 | ECOG, Karnofsky, EORTC QLQ-C30, ESAS, linfedema | Sem contraindicações/precauções estruturadas |
| Esportiva | 7.0 | Y-Balance, hop tests, LSI, critérios RTS, periodização | Sem FMS/SFMA, sem isocinético |
| Reumatologia | 7.5 | DAS28, BASDAI, HAQ, WOMAC, WPI | TagSelect articulações não sincronizado com DAS28 |

---

## TOP 10 AÇÕES PRIORITÁRIAS (impacto × esforço)

| # | Ação | Módulo | Prioridade |
|---|------|--------|-----------|
| 1 | **Corrigir BBS 5→14 itens e MIF 6→18 itens** — erro clínico, falsos-negativos de risco de queda | Neuro | 🔴 CRÍTICO |
| 2 | **Adicionar contraindicações estruturadas em oncologia** (metástases ósseas, plaquetas, neutrófilos, Mirels) | Oncologia | 🔴 CRÍTICO |
| 3 | **Implementar avaliação neurológica periférica completa** (dermátomos C5-S2, miótomos, reflexos ROTs) | Ortopédica | 🔴 CRÍTICO |
| 4 | **Implementar GMFM-66 item-a-item** — gold-standard PC, exigido pelo SUS/CID-11 | Pediatria | 🔴 CRÍTICO |
| 5 | **Adicionar Berg Balance Scale** (14 itens) — padrão-ouro para equilíbrio em idosos | Geriatria | 🔴 CRÍTICO |
| 6 | **Sincronizar TagSelect articulações com campos DAS28** — eliminar dupla entrada | Reumatologia | 🔴 CRÍTICO |
| 7 | **Implementar FMS** (7 testes) — padrão-ouro em avaliação esportiva | Esportiva | 🔴 CRÍTICO |
| 8 | **Adicionar formulários interativos para questionários uro** (ICIQ-SF, PFDI-20, FSFI, ICIQ-OAB) | Uro | 🟠 ALTA |
| 9 | **Implementar POSAS + campo de fotografia** para avaliação de cicatrizes | Dermato | 🟠 ALTA |
| 10 | **Adicionar % predito TC6M e prescrição de exercício** (FC alvo, %FC reserva, Borg, tipo) | Cardio | 🟠 ALTA |

---

## PADRÕES TRANSVERSAIS (problemas em múltiplos módulos)

### 1. Escalas truncadas ou invalidadas
- Neuro: BBS 5 itens (deveria ser 14), MIF 6 itens (deveria ser 18)
- Impacto: resultados não são válidos para laudos, pesquisa ou auditoria

### 2. Questionários como número bruto vs formulário interativo
- Uro: ICIQ-SF, PFDI-20, FSFI — apenas campo numérico do escore total
- Cardio: MLHFQ é exceção — 21 itens implementados individualmente
- Solução: seguir padrão MLHFQ para todos os questionários validados

### 3. Dupla entrada de dados sem sincronização
- Reumatologia: TagSelect de dolorosas/edemaciadas + campos DAS28 separados
- Esportiva: LSI calculado automaticamente mas não atualiza checkboxes RTS
- Solução: sincronização automática entre campos derivados

### 4. Ausência de comparativo temporal (gráficos de evolução)
- Nenhum módulo mostra delta entre avaliações seriadas
- Essencial para: justificar conduta, demonstrar progresso a convênios, pesquisa
- Solução: gráfico sparkline/tendência na aba Evolução

### 5. Relatório genérico sem dados específicos do módulo
- Dermato: Vancouver, perimetria e fibrose ausentes do relatório
- Uro: Oxford, PERFECT, POP-Q ausentes do relatório
- Solução: componente ReportSection com slots por especialidade

### 6. Ausência de modais/formulários de anamnese rápidos
- Para triagem/express: um modal com queixa + sinais vitais + impressão
- Já existe parcialmente (ExpressAssessment), mas não integrado a todos os módulos

---

## FORÇAS TRANSVERSAIS (diferenciais do sistema)

1. **Base de evidências vinculada a cada condição clínica** — nenhum concorrente brasileiro oferece integração JOSPT/NICE/Cochrane/PEDro inline
2. **CIF automático com qualificadores derivados dos dados clínicos** — economia de 10-15 min/paciente
3. **Red flags específicas por patologia** — não genéricas, com alertas visuais
4. **Cálculo automático de escalas validadas** — com interpretação e codificação de cores
5. **Estrutura modular consistente** — GeneralAssessment + CifSection + SessionLogSection padronizados
6. **Componentes visuais especializados** — BodyMap, DermatomeMap, ReflexMatrix, PelvicFloorMap, Bristol, EHS

---

## CONCLUSÃO

O SASYRA é um sistema **clinicamente superior a qualquer prontuário eletrônico genérico brasileiro** para fisioterapia. A base de evidências, CIF automático e as escalas validadas com cálculo integrado são diferenciais reais que nenhum concorrente oferece.

Os **7 gaps críticos** concentram-se em: (1) correção de escalas truncadas no Neuro, (2) segurança clínica em Oncologia, (3) completude da avaliação neurológica na Ortopédica, (4) GMFM-66 na Pediatria, (5) Berg na Geriatria, (6) sincronização de dados na Reumatologia, e (7) FMS na Esportiva.

**Corrigidos os 7 itens críticos, o sistema atinge padrão-ouro para prática ambulatorial em todas as 10 especialidades.**
