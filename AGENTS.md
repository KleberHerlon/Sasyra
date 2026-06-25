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

## Última Sessão — 25/06/2026

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

### 🟢 Baixa Prioridade

- [ ] **Exportação CSV/JSON** — Botão para exportar dados de todos os pacientes por módulo
- [ ] **Dashboard global multi-módulo** — Cruzar dados de paciente em Fisio + Nutri simultaneamente
- [ ] **Google Calendar ativo** — As credenciais OAuth estão comentadas no `.env`. Ativar integração
- [ ] **WhatsApp Business** — Token de acesso permanente comentado no `.env`. Ativar notificações
- [ ] **GitHub Actions / CI** — Build automático + lint ao fazer push

---

## Arquitetura dos Módulos

### Fisioterapia (referência gold standard)
- `src/App.jsx` — 2631 linhas. O módulo mais completo.
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
- `src/data/transitionBridge.js` — Ponte Fisioterapia → PE
- `server/memoryStore.js` — Memória permanente + token tracking

### Persistência
- localStorage: `[modulo]_data_[studentId]` para dados clínicos, `[modulo]_enhancer_[studentId]` para dados do enhancer
- Servidor: `server/data/memory-store.json` para análises IA, `server/data/token-tracker.json` para tokens
- Servidor: `npm run dev:server` (porta 3001)

---

## Arquivo de Memória Arquitetural
- `.sasyra-context.md` na raiz do projeto contém o escopo original do sistema.
