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

## Sessão Atual — 01/07/2026

### O que foi corrigido

#### 1. CAUSA RAIZ: Tela preta ao selecionar paciente em Neuro.jsx
- **Bug**: `Section` NÃO era importado de `src/components.jsx` em `Neuro.jsx:3`. O componente usa `<Section>` na aba "avaliacao" (linha 789) e "evidencias" (linha 1097), mas o import só listava `AudioField, BodyMap, EvaSlider, TagSelect, SingleSelect, GonioRow, MRCRow, TestCard, Row, HonorariosCard`.
- **Sintoma**: ao clicar em um paciente, `setStudentListView(false)` renderiza a tela principal → `React.createElement(Section, ...)` crasha com `"Section is not defined"` → tela totalmente preta/branca.
- **Fix**: adicionado `Section` ao import na linha 3.
- **Build**: `✓ built in 1.77s` (1,312.21 kB).
- **Demais módulos**: Cardio, Uro, Geriatria, Dermato, Reumatológica, Esportiva, Oncológica, Pediatria e OT — todos definem `Section` LOCALMENTE (linha ~40-59). Não têm o bug.

#### 2. Bug secundário: Seções colapsadas por padrão (Neuro.jsx + Pediatria.jsx)
- **Neuro.jsx**: `expandedSections` não era salvo no `localStorage` nem restaurado no `useEffect` de load. Fix: adicionado `expandedSections` ao `saveNeuroData()` e ao load. Para pacientes NOVOS, auto-expand "Identificação do Paciente".
- **Pediatria.jsx**: já salvava/restaurava `expandedSections` corretamente, mas faltava auto-expand para novos pacientes. Adicionado `else` clause no load `useEffect`.
- **Placeholders** (Cardio, Uro, Geriatria, Dermato, Reumatológica, Esportiva, Oncológica): usam `<Section>` (sempre expandido), não `CollapsibleSection` — não têm o bug.

#### 3. OT Refactoring aplicado
- `OccupationalTherapy.jsx` refatorado com layout padrão de 8 seções colapsáveis + 4 abas (avaliacao, sessoes, relatorio, evidencias)

### Regra de Foco
- **Até segunda ordem**: trabalhar exclusivamente nos módulos de **Fisioterapia** (Neuro, Pediatria, Cardio, Uro, Geriatria, Dermato, Reumatológica, Esportiva, Oncológica, Ortopedia).
- Módulos congelados: Terapia Ocupacional, Nutrição, CrossFit, Educação Física, Fonoaudiologia.

---

## Última Sessão — 01/07/2026

### O que foi implementado

#### 1. Componente Compartilhado: `src/components/ModuleEnhancer.jsx`
Adiciona a qualquer módulo: Dor (EVA), Red Flags, Sessões Diário, Análise IA, Relatório PDF

#### 2. Módulos Aprimorados (Pain + RedFlags + SessionLog + IA + Report)
| Módulo | Arquivo | Abas novas |
|---|---|---|
| Pediatria | `src/screens/Pediatria.jsx` | 📅 Sessões, 📊 Relatório |
| Neurofuncional | `src/screens/Neuro.jsx` | 📅 Sessões, 📊 Relatório |
| CrossFit | `src/screens/CrossFit.jsx` | 📅 Sessões, 📊 Relatório |
| Nutrição Clínica | `src/screens/Nutrition.jsx` | 📅 Sessões, 📊 Relatório |
| Terapia Ocupacional | `src/screens/OccupationalTherapy.jsx` | 📅 Sessões, 📊 Relatório |

#### 3. Servidor de Memória Permanente
- `server/memoryStore.js` — Persistência JSON das análises IA no servidor
- `server/proxy.js` — Endpoints `/api/memory`, `/api/tokens`
- `src/hooks/useMemory.js`, `useTokens.js` — Hooks frontend
- Token tracking extraído automaticamente das respostas Anthropic
- Card de uso de tokens em `SubscriptionSettings.jsx`

#### 4. Estrutura Multi-idioma (i18n)
- `src/i18n/index.js` — Config i18next com fallback pt-BR, detecção de idioma (localStorage → navegador → pt-BR)
- `src/i18n/locales/pt-BR.json` — Traduções português
- `src/i18n/locales/en.json` — Traduções inglês
- `src/components/LanguageSwitcher.jsx` — Seletor PT/EN com persistência em localStorage
- Integrado em: LoginScreen, ModuleSelector, PatientList (App.jsx)
- Seletor de idioma posicionado no canto superior direito (login, módulos) e na navbar (pacientes)
- Pronto para expansão: todos os arquivos de tela podem importar `useTranslation` e usar `t("chave")`

#### 5. Responsividade Mobile
- **Pediatria** — `useMediaQuery` adicionado; grids (formulários, escalas, terapia) viram 1 coluna; padding reduzido; tabs com scroll horizontal; cabeçalho compacto
- **CrossFit** — `useMediaQuery` adicionado; grids (anamnese, treinos, 1RM tracking) adaptativos; tabs com scroll horizontal; cabeçalho compacto; nome do aluno oculto em mobile

#### 5. Infraestrutura (antigo)
- `src/components/ModuleEnhancer.jsx` — Componentes: `useEnhancer`, `PainSection`, `RedFlagsSection`, `SessionLogSection`, `AIAnalysisSection`, `ReportSection`
- Persistência por paciente: `[modulo]_enhancer_[studentId]` no localStorage
- Script: `npm run dev:server` para iniciar servidor de memória

#### 6. Sistema de Sub-Módulos Data-Driven + 7 Placeholders
- `src/data/modules.js` — Registro centralizado de sub-módulos Fisioterapia (FISIO_SUB_MODULES + FISIO_MODULE_MAP)
- `FisioSubModulePicker` refatorado para consumir `FISIO_SUB_MODULES` — adiciona badge "Em breve" p/ módulos futuros
- Roteamento refatorado em App.jsx — usa `FISIO_MODULE_MAP` + `FISIO_SCREEN_MAP` para render dinâmico
- 7 novas screens placeholder com estrutura padronizada + ModuleEnhancer integrado:
  | Especialidade | Arquivo | Cor |
  |---|---|---|
  | Cardio-Respiratória | `CardioRespiratory.jsx` | 🔴 Vermelho |
  | Uro-Ginecológica | `UroGynecology.jsx` | 🟡 Âmbar |
  | Geriatria | `Geriatria.jsx` | 🟢 Verde |
  | Dermatofuncional | `DermatoFunctional.jsx` | 🟡 Âmbar |
  | Reumatológica | `Rheumatology.jsx` | 🟣 Roxo |
  | Esportiva | `SportsPhysio.jsx` | 🔵 Azul |
  | Oncológica | `Oncology.jsx` | 🟡 Âmbar |

---

## Roadmap de Melhorias Pendentes

### 🔴 Alta Prioridade

- [ ] **Supabase como backend real** — Migrar localStorage para Supabase. `src/data/supabaseService.js` já tem base com `syncLocalStorageToSupabase()`
- [ ] **App mobile (PWA)** — Melhorar `public/sw.js` para cache de dados + IndexedDB. Adicionar manifest com suporte a instalação
- [ ] **Code-splitting** — Usar `React.lazy()` + `Suspense` nos 6 módulos para reduzir bundle inicial (atualmente 1.2MB)
- [x] **ModuleEnhancer no PhysicalEducation** — PE (`src/screens/PhysicalEducation.jsx`) agora com PainSection, RedFlagsSection, SessionLogSection, AIAnalysisSection e ReportSection nas abas "Sessões" e "Relatório". Persistência via `pe_enhancer_[id]` no localStorage

### 🟡 Média Prioridade

- [ ] **Ponte de Transição entre todos os módulos** — Atualmente só conecta Fisioterapia → PE via `transitionBridge.js`. Estender para: TO → Neuro, Nutri → Fisio, Ped → TO
- [ ] **Tema claro para Neuro, CrossFit, Nutrição, TO** — Só Pediatria tem tema claro. Os demais são escuros fixos
- [x] **Responsivo mobile** — Pediatria e CrossFit agora com `useMediaQuery`, grids adaptativos, tabs scroll, cabeçalho compacto
- [ ] **Testes automatizados** — Adicionar pelo menos smoke tests: `npm test` inexistente. Criar testes com Vitest
- [x] **Multi-idioma (i18n)** — Preparar estrutura para futura tradução
- [ ] **Implementar conteúdo clínico das especialidades placeholder** — Cardio-Respiratória, Uro-Ginecológica, Geriatria, Dermatofuncional, Reumatológica, Esportiva e Oncológica

### 🟢 Baixa Prioridade

- [x] **Foco exclusivo em Fisioterapia** — LoginScreen agora só exibe "Fisioterapeuta" como profissão; removidos TO, Educador Físico, Nutricionista, CrossFit da tela inicial; módulos ocultos e `PROF_LABELS` limpos; `REGISTRY_CONFIG` simplificado só com CREFITO; Dashboard.jsx sincronizado
- [ ] **Exportação CSV/JSON** — Botão para exportar dados de todos os pacientes por módulo
- [ ] **Dashboard global multi-módulo** — Cruzar dados de paciente em Fisio + Nutri simultaneamente
- [ ] **Google Calendar ativo** — As credenciais OAuth estão comentadas no `.env`. Ativar integração
- [ ] **WhatsApp Business** — Token de acesso permanente comentado no `.env`. Ativar notificações
- [ ] **GitHub Actions / CI** — Build automático + lint ao fazer push

---

## Arquitetura dos Módulos

### Sistema de Sub-Módulos (Fisioterapia)
- `src/data/modules.js` — Registro centralizado com `FISIO_SUB_MODULES` (array) + `FISIO_MODULE_MAP` (lookup). Cada módulo tem: id, icon, title, desc, color, hasPatientList, screen (nome do componente), comingSoon
- `src/App.jsx` — Roteamento data-driven: picker usa `FISIO_SUB_MODULES`, render usa `FISIO_MODULE_MAP` + `FISIO_SCREEN_MAP` para resolver componente por string
- `SubModuleLayout` — Wrapper com header fixo + botão voltar + toggle tema
- Para adicionar nova especialidade: (1) criar screen em `src/screens/`, (2) adicionar ao `FISIO_SUB_MODULES` em `modules.js`, (3) importar + registrar em `FISIO_SCREEN_MAP` no `App.jsx`

### Sub-módulos Existentes
| ID | Tela | Status |
|---|---|---|
| `ortopedica` | Assessment.jsx (full) | ✅ Completo |
| `neurologica` | Neuro.jsx | ✅ Completo |
| `pediatrica` | Pediatria.jsx | ✅ Completo |
| `cardioRespiratoria` | CardioRespiratory.jsx | 🟡 Placeholder |
| `uroginecologica` | UroGynecology.jsx | 🟡 Placeholder |
| `geriatria` | Geriatria.jsx | 🟡 Placeholder |
| `dermatoFuncional` | DermatoFunctional.jsx | 🟡 Placeholder |
| `reumatologica` | Rheumatology.jsx | 🟡 Placeholder |
| `esportiva` | SportsPhysio.jsx | 🟡 Placeholder |
| `oncologica` | Oncology.jsx | 🟡 Placeholder |

### Fisioterapia (referência gold standard)
- `src/App.jsx` — 2715 linhas. O módulo mais completo.
- Features exclusivas: autoCIF, Yellow Flags, Testes ortopédicos (30+), Goniometria com valores de referência, Escalas (WOMAC/DASH/SF-36), Agenda, Financeiro, Planos/Assinatura, Express Assessment, Barra de progresso, Paywall

### Educação Física
- `src/screens/PhysicalEducation.jsx` — 1766 linhas. Segundo maior.
- Features exclusivas: Periodização (macro/micro/deload), PSE Foster (monotonia/strain), VO2max (Cooper+Rockport), 1RM preditivo (Epley/Brzycki/Lombardi), Zonas FC Karvonen, Estratificação ACSM, Dashboard de Performance, PatientView, Ponte de Transição com Fisioterapia

### Terapia Ocupacional
- `src/screens/OccupationalTherapy.jsx` — 836 linhas.
- Features exclusivas: COPM, Barthel, Lawton & Brody, Força de pinça/preensão, Mini-Mental, Barreiras ambientais, Tecnologia assistiva

### Nutrição Clínica
- `src/screens/Nutrition.jsx` — 961 linhas.
- Features exclusivas: MUST, SARC-F, IPAQ, TMB/GET (Harris-Mifflin), Recordatório 24h, Bioquímica (15 campos), Bioimpedância, Pollock dobras

### Pediatria
- `src/screens/Pediatria.jsx` — ~620 linhas.
- Features exclusivas: História gestacional/perinatal, Marcos motores, Reflexos primitivos, GMFCS, AIMS, M-CHAT, Plano terapêutico com orientações ao cuidador

### CrossFit
- `src/screens/CrossFit.jsx` — ~750 linhas.
- Features exclusivas: Perfil atleta CrossFit, 1RM tracking (7 levantamentos), Total Olímpico, 9 WODs benchmark, RPE tracking, Modalidades de treino (Strength/Metcon/Gymnastics/Weightlifting)

### Neurofuncional
- `src/screens/Neuro.jsx` — ~720 linhas.
- Features exclusivas: MAS (Ashworth Modificada 0-24), BBS simplificada (0-20), MIF simplificada (0-42), Força MRC 12 grupos bilaterais, Marcha (8 tipos), Reflexos patológicos

### Componentes Compartilhados
- `src/components.jsx` — EvaSlider, TagSelect, SingleSelect, AudioField, Section, Row, Field, SubHeading, GonioRow, MRCRow
- `src/components/ModuleEnhancer.jsx` — useEnhancer, PainSection, RedFlagsSection, SessionLogSection, AIAnalysisSection, ReportSection
- `src/data/modules.js` — Registro centralizado de sub-módulos de Fisioterapia
- `src/data/transitionBridge.js` — Ponte Fisioterapia → PE
- `server/memoryStore.js` — Memória permanente + token tracking

### Persistência
- localStorage: `[modulo]_data_[studentId]` para dados clínicos, `[modulo]_enhancer_[studentId]` para dados do enhancer
- Servidor: `server/data/memory-store.json` para análises IA, `server/data/token-tracker.json` para tokens
- Servidor: `npm run dev:server` (porta 3001)

---

## Arquivo de Memória Arquitetural
- `.sasyra-context.md` na raiz do projeto contém o escopo original do sistema.
