# Prompt de Implementação — Upgrade Completo dos Módulos

## Objetivo

Elevar **todos os módulos** (Neurofuncional, Pediatria, CrossFit, Nutrição Clínica, Terapia Ocupacional, Educação Física + 7 placeholders) ao **mesmo nível de completude e funcionalidade do módulo de Ortopedia** (`src/Assessment.jsx`).

Nenhum módulo deve ser "menos funcional" que o de Ortopedia. Cada módulo deve oferecer as **mesmas ferramentas e sistemas**, adaptados à sua especialidade.

---

## 1. Motor de Detecção Automática — Queixa Principal

**Onde:** `src/hooks/useClinicalScan.js`, `src/hooks/useSemanticScanner.js`, `src/utils/clinicalDetection.js`

**Ortopedia:** Quando o usuário digita a queixa, detecta automaticamente:
- Local(is) da dor → preenche `localDor`
- Caráter da dor → preenche `caraterDor`
- Músculos, lateralidade, condição → varredura semântica
- Comorbidades e antecedentes → preenche `comorbid` e `antec`

**Implementar em todos os módulos:**

| Módulo | O que detectar da queixa | Onde mapear |
|--------|--------------------------|-------------|
| **Neurofuncional** | "AVC", "hemiparesia D", "parkinson", "lesão medular", "ataxia", "tremor" → lado afetado, condição neurológica, sintomas (fraqueza, espasticidade) | `comorbidadesNeuro`, `diagnosticoMedico`, `ladoAfetado`, `sintomas` |
| **Pediatria** | "paralisia cerebral", "atraso motor", "não anda", "prematuridade" → condição, marcos motores | `diagnosticoMedico`, `comorbidadesPed`, `marcosMotores` |
| **CrossFit** | "ombro dor snatch", "lombalgia agachamento", "joelho crossfit" → lesão, modalidade, movimento | `lesoesPrevias`, `restricoesMovimentos`, `modalidadesFavoritas` |
| **Nutrição** | "emagrecer", "diabetes", "colesterol", "intestino" → condição nutricional, objetivo | `doencas`, `restricoesPreferencias`, `queixa` |
| **TO** | "AVC não consigo vestir", "dificuldade banho", "memória" → condição, AVDs comprometidas, comprometimento cognitivo | `diagnosticoMedico`, `avdsComprometidas`, `dominiosCognitivos` |
| **Educação Física** *(já implementado parcialmente)* | Estender para detectar também: local da dor, caráter da dor, EVA sugestão da queixa | `enhancer.pain` |

---

## 2. CIF Automática e CIF Sugerida

**Onde:** Sistema CIF com qualificadores + dicionário com 30+ códigos

**Ortopedia:** Duas camadas de CIF:
- CIF **sugeridos** pela condição identificada (Knowledge Base)
- CIF **automáticos** com qualificadores (0-4) derivados dos dados preenchidos (EVA, AVDs, força, etc.)
- Paywall: features CIF bloqueadas atrás dos planos Evidência/Clínica

**Implementar em todos os módulos:**

### 2.1 Dicionário CIF por Especialidade

Expandir `src/data/cif.js` com novos códigos específicos:

| Módulo | CIFs Novos a Mapear |
|--------|---------------------|
| **Neurofuncional** | b7300 (força muscular — MRC), b735 (tônus), b770 (marcha), b144 (memória), d450 (andar), d540 (vestir-se), s120 (medula), b164 (funções cognitivas superiores) |
| **Pediatria** | b760 (controle motor voluntário), d131 (aprender através de ações), d132 (aquisição de linguagem), d815 (educação pré-escolar), b7800 (tônus muscular adaptativo ao movimento) |
| **CrossFit** | b7301 (força de um único músculo/grupo), b455 (funções cardiovasculares), d4301 (levantar), d2201 (realizar múltiplas tarefas), d9201 (esportes) |
| **Nutrição** | b530 (funções de manutenção do peso), b545 (funções hídricas e eletrolíticas), e1100 (alimentos), e110 (medicamentos), +15 exames bioquímicos como códigos b5** |
| **TO** | d170 (ler), d175 (resolver problemas), d510 (lavar-se), d520 (cuidar de partes do corpo), d440 (uso fino da mão), d630 (preparar refeições) |
| **Educação Física** | b4550 (resistência cardiovascular), b4551 (frequência cardíaca), b740 (resistência muscular), d9200 (jogos), e140 (produtos e tecnologias para cultura, recreação e esporte) |

### 2.2 Qualificadores Automáticos

Para cada módulo, derivar qualificador CIF (0-4) dos dados clínicos preenchidos:

```
Regra geral: EVA 0-2 → qualif 1, EVA 3-5 → qualif 2, EVA 6-8 → qualif 3, EVA 9-10 → qualif 4
```

| Módulo | Mapeamento |
|--------|-----------|
| **Neuro** | b7300 (qualifier from sum MRC / 12), b735 (from MAS total), d450 (from BBS total), d540 (from MIF total) |
| **Pediatria** | b760 (from GMFCS level), d131 (from AIMS score), d815 (from M-CHAT risk) |
| **CrossFit** | b7301 (from 1RM total vs baseline), b455 (from RPE medio), d4301 (from WOD results) |
| **Nutrição** | b530 (from IMC), b545 (from RCQ + bioquímica), e1100 (from MUST score) |
| **TO** | d440 (from handgrip strength), d510/d520 (from Barthel), d170/d175 (from Mini-Mental), d630/d640 (from Lawton) |
| **EF** | b4550 (from VO2max), b740 (from 1RM preditivo), d9200 (from performance metrics) |

---

## 3. Knowledge Base (KB) por Especialidade

**Onde:** `src/data/` — criar arquivos `kb_neuro.js`, `kb_ped.js`, `kb_cf.js`, `kb_nutri.js`, `kb_to.js`, `kb_pe.js`

**Ortopedia:** ~45 condições clínicas mapeadas com:
- `label`, `pattern` (regex para detectar na queixa), `goldStandard` (texto baseado em evidência)
- `escalas` recomendadas para cada condição
- `cifSuggestions` (códigos CIF relevantes)
- `testes` especiais (30+ testes ortopédicos com vídeo, execução, resultado)

**Implementar por módulo:**

### 3.1 Condições a Mapear

| Módulo | Condições (mínimo 10 cada) |
|--------|---------------------------|
| **Neuro** | AVC, Lesão Medular, Parkinson, Esclerose Múltipla, ELA, Ataxia, TCE, Poliomielite, Neuropatia Periférica, Tumor SNC, Hidrocefalia, Síndrome do Túnel do Carpo, Polineuropatia, Paralisia Facial, Distrofia Muscular |
| **Pediatria** | Paralisia Cerebral, Síndrome de Down, TEA, Mielomeningocele, Distrofia Muscular, Torcicolo Congênito, Displasia do Quadril, Atraso Motor Global, Hipotonia, Prematuridade |
| **CrossFit** | Lombalgia, Ombro CrossFit, Joelho CrossFit, Rhabdomiólise, Síndrome do Túnel do Carpo, Tendinopatia de Aquiles, Pubalgia, Epicondilite, Síndrome Patelofemoral, Lesão de LCA, Fratura por Estresse |
| **Nutrição** | Obesidade, DM2, Desnutrição, Dislipidemia, HAS, DRC, Doença Hepática Gordurosa, Síndrome Metabólica, Transtorno Alimentar, Doença Inflamatória Intestinal |
| **TO** | AVC, Paralisia Cerebral, Alzheimer/Demência, TEA, Lesão Medular, Osteoartrite, Parkinson, Lesão de Plexo, Amputação, Esclerose Múltipla, TCE |
| **EF** | *(já possui detecção via `detectMultipleKB`)* — expandir para +20 condições |

### 3.2 KB Sugestão Automática

Ao identificar a condição na queixa, exibir em todos os módulos:
✅ **Condição identificada** (badge verde)
- **Padrão-ouro** baseado em evidência
- **CIF sugeridos** (códigos + descrições)
- **Escalas recomendadas** (tags para cada escala, ordenadas por nível de evidência)
- **Red Flags** específicas da condição (auto-selecionadas)

---

## 4. Goniometria

**Onde:** CRUD dinâmico com valores de referência

**Ortopedia:** Grid dinâmico com select de articulação (17 opções) → select de movimento (~55 combinações) → input numérico → valor de referência automático → detecção de out-of-range

**Implementar em:**

| Módulo | Articulações Relevantes |
|--------|------------------------|
| **Neuro** | Ombro, cotovelo, punho, quadril, joelho, tornozelo (bilateral — padrão por espasticidade/hemiparesia) |
| **Pediatria** | Quadril (displasia), joelho (genu recurvatum/valgo), tornozelo (pé equino), cervical (torcicolo) |
| **CrossFit** | Ombro, quadril, joelho, tornozelo, coluna lombar, punho (snatch, squat, overhead) |
| **TO** | Ombro, cotovelo, punho, dedos (mão funcional), polegar (oposição) |
| **EF** | *(já usa no módulo ortopedia)* — replicar em PE também |

**Valores de Referência:** Usar o mesmo dicionário `REF` de `components.jsx` + adicionar movimentos específicos de cada especialidade.

---

## 5. Força Muscular — Escala MRC

**Onde:** CRUD dinâmico de linhas MRC

**Ortopedia:** Select de músculo (12 opções) + select MRC 0-5 + botão remover + botão adicionar

**Implementar com grupos musculares específicos:**

| Módulo | Músculos Pré-definidos |
|--------|-----------------------|
| **Neuro** | Deltoide D/E, Bíceps D/E, Extensor punho D/E, Flexor quadril D/E, Quadríceps D/E, Tibial anterior D/E +++ *(substituir `forcaNeuro` fixo de 12 campos pelo CRUD dinâmico)* |
| **Pediatria** | Mesmos do Neuro + cervical, abdominal |
| **CrossFit** | Trapézio, Peitoral, Grande dorsal, Quadríceps, Isquiotibiais, Glúteo, Gastrocnêmio |
| **TO** | Flexores/extensores dedos D/E, Flexores/extensores polegar D/E, Oponente polegar, Interósseos, Tenar/hipotenar |
| **EF** | *(já usa no módulo ortopedia)* — replicar |

---

## 6. BodyMap (Mapa Corporal Interativo)

**Onde:** `BodyMap` component de `components.jsx`

**Ortopedia:** Mapa 3D interativo (frente/costas) com sexo-aware, labels mostrando áreas selecionadas com articulações e músculos, detecção automática da queixa

**Implementar em todos os módulos que registram dor** (Neuro, Pediatria, CrossFit, EF, TO, todos placeholders).

---

## 7. Testes Especiais

**Onde:** Por condição, com vídeo, execução, botões Positivo/Negativo/Não realizado

**Ortopedia:** 30+ testes com `TestCard` component (vídeo YouTube embed, "Como executar" accordion, 3 estados de resultado com cor)

**Implementar por módulo com testes específicos:**

| Módulo | Testes a Incluir |
|--------|-----------------|
| **Neuro** | Teste de Romberg, Teste de Fukuda, Teste do Dedao (Babinski), Teste de Schober (coluna), Teste de Lasègue, Teste de Patrick/FABER, Teste de Trendelenburg, Teste de Mingazzini, Teste de Barré, Timed Up and Go, Teste de Flexão de Braço (MRC), Teste de Flapping (asterixis) |
| **Pediatria** | Teste de Gowers, Teste de Ortolani, Teste de Barlow, Teste de Galeazzi, Teste de Adams (escoliose), Teste de Risser, Teste de Thomas, Teste de Ely, Teste de Duncan-Ely |
| **CrossFit** | Teste de O'Brien (ombro), Teste de Neer/Hawkins (impacto), Teste de Apprehension (ombro), Teste de Jobe, Teste de Gerber, Teste de Lachman/Anterior Drawer (joelho), Teste de McMurray, Teste de Thessaly, Teste de FABER/FADIR (quadril) |
| **TO** | Teste de Phalen, Teste de Tinel, Teste de Finkelstein, Teste de Froment, Teste de Pinch strength, Monofilamento de Semmes-Weinstein, Teste de Allen, Purdue Pegboard, Nine-Hole Peg Test |
| **EF** | *(já usa testes do módulo ortopedia)* |

---

## 8. Yellow Flags (Fatores Psicossociais)

**Onde:** Indicadores biopsicossociais com alerta inteligente

**Ortopedia:** TagSelect com 10 yellow flags + alerta se ≥3 selecionados ("considerar abordagem biopsicossocial / PNE / avaliação psicológica")

**Implementar em todos os módulos** (todos os pacientes podem ter fatores psicossociais — dor crônica, cinesiofobia, catastrofização):

| Módulo | Yellow Flags Adicionais |
|--------|------------------------|
| **Neuro** | + Baixa adesão ao tratamento, Fadiga crônica, Isolamento social secundário, Dependência funcional |
| **Pediatria** | + Superproteção parental, Ansiedade dos pais, Isolamento escolar, Dificuldade de adesão familiar |
| **CrossFit** | + Síndrome de overtraining, Comparação social excessiva, Exercício compulsivo, Sinais de red-s/osteoporose |
| **Nutrição** | + Compulsão alimentar, Restrição extrema, Vigorexia/Anorexia, Imagem corporal distorcida |
| **TO** | + Baixa motivação, Isolamento ocupacional, Perda de identidade, Fadiga de cuidador |
| **EF** | *(já integrado no módulo)* |

---

## 9. Honorários CREFITO / Tabela de Valores

**Onde:** Tabela de honorários por região (Sul, Sudeste SP, Sudeste RJ/ES/MG, Centro-Oeste, Nordeste, Norte)

**Ortopedia:** Select de região com cálculo automático de: consulta + sessão × nº sessões + avaliação + relatório

**Implementar em todos os módulos de Fisioterapia** (Neuro, Pediatria, CrossFit, TO + 7 placeholders). Não se aplica a Nutrição e EF.

Consultar `CREFITO_REGIOES` em `Assessment.jsx` para os valores.

---

## 10. Histórico de Avaliações (Save/Load/Reset)

**Onde:** Sistema de persistência com data, opção de carregar avaliação anterior e resetar

**Ortopedia:** Select dropdown no topo com avaliações anteriores ("Selecionar avaliação anterior...") + botões "💾 Salvar avaliação" e "🔄 Nova avaliação"

**Implementar em todos os módulos.** Atualmente cada módulo salva apenas um estado único. Substituir por múltiplas avaliações com timestamp.

---

## 11. Paywall / Planos Integrado

**Onde:** Sistema de monetização das features avançadas

**Ortopedia:** CIF e Análise IA atrás de paywall, com 3 comportamentos:
1. Trial → `onUpgrade()`
2. Plano Gratuito → análise avulsa R$4,90
3. Planos Evidência/Clínica → uso ilimitado

**Implementar em todos os módulos:**
- **CIF automática + sugerida** — bloqueada nos planos gratuitos (🔒)
- **Análise IA** — limite mensal por plano
- **Critério:** `canUseFeature("cif")` e `aiRemaining > 0 || payPerUse`

---

## 12. Diagnóstico Cinesioterapêutico (DCT) com Sugestão Automática

**Onde:** Campo de texto input com botão "← Sugestão" que preenche automaticamente baseado na queixa

**Ortopedia:** `useClinicalScan(queixa)` retorna `dcSuggestion`. Exibe: "Baseado na queixa: {dcSuggestion}"

**Implementar em:**
| Módulo | Nome do Campo | Lógica de Sugestão |
|--------|--------------|-------------------|
| **Neuro** | Diagnóstico Cinesioterapêutico Neurológico | Baseado em `diagnosticoMedico` + `sintomas` + `ladoAfetado` |
| **Pediatria** | Diagnóstico Cinesioterapêutico Pediátrico | Baseado em `diagnosticoMedico` + `comorbidadesPed` + `marcosMotores` |
| **CrossFit** | Diagnóstico Cinesioterapêutico Esportivo | Baseado em `lesoesPrevias` + `restricoesMovimentos` + `objetivos` |
| **TO** | Diagnóstico Cinesioterapêutico Ocupacional | Baseado em `diagnosticoMedico` + `avdsComprometidas` + `dominiosCognitivos` |

---

## 13. Análise IA Avançada (Prompt Estruturado)

**Onde:** System prompt em `server/proxy.js` + user message em cada módulo

**Já implementado para todos os módulos via ModuleEnhancer** — verificar se o `summaryText` de cada módulo inclui dados clínicos suficientes.

Reforçar o `summaryText` de cada módulo com:

| Módulo | Dados a Incluir no Summary |
|--------|---------------------------|
| **Neuro** | diagnosticoMedico, tempoLesao, ladoAfetado, sintomas, comorbidadesNeuro, MAS total, BBS total, MIF total, forcaNeuro, tipoMarcha, coordenacao, reflexos, + ModuleEnhancer pain |
| **Pediatria** | queixa, diagnosticoMedico, comorbidadesPed, tipoParto, prematuridade, APGAR, GMFCS, AIMS, M-CHAT, marcosMotores, tonus, reflexosPrimitivos, + activities, + ModuleEnhancer pain |
| **CrossFit** | nivelAtleta, modalidadesFavoritas, lesoesPrevias, restricoesMovimentos, objetivos, todos 1RM, total Olimpico, benchmark times, RPE medio, + ModuleEnhancer pain |
| **Nutrição** | queixa, peso, altura, IMC, RCQ, MUST, SARC-F, TMB/GET, BIA% fat, exames bioquímicos, recordatório 24h, doencas, suplementos, alergias, + ModuleEnhancer pain |
| **TO** | diagnosticoMedico, queixa, ocupacao, avdsComprometidas, AIVDs, Barthel total, Lawton total, COPM metas, Mini-Mental, forcaPreensao, barreirasAmbientais, tecnologiaAssistiva, + ModuleEnhancer pain |
| **EF** | *(já possui summary completo)* |

---

## 14. Responsividade Mobile

**Onde:** `useMediaQuery("(max-width:767px)")` em cada módulo

**Ortopedia, Pediatria, CrossFit:** ✅ Ok  
**Neuro, Nutrição, TO, EF + placeholders:** ❌ Pendente

Implementar:
- Grids adaptáveis (3 colunas → 1 coluna)
- Padding reduzido mobile
- Tabs com scroll horizontal (overflow-x: auto)
- Cabeçalho compacto (nome do paciente oculto em mobile)

---

## 15. Resumo por Módulo — Checklist de Implementação

### 🧠 Neurofuncional (Neuro.jsx) — Prioridade Alta
- [ ] Substituir `forcaNeuro` fixo (12 campos) por CRUD dinâmico MRC
- [ ] Adicionar goniometria completa com valores de referência
- [ ] Adicionar BodyMap (mapa corporal) na dor
- [ ] Adicionar CIF automática + sugerida com qualificadores
- [ ] Adicionar Knowledge Base (12+ condições + gold standard + escalas + testes)
- [ ] Adicionar testes especiais neurológicos (Romberg, Fukuda, Babinski, etc.) com vídeo
- [ ] Adicionar Yellow Flags com alerta
- [ ] Criar KB dedicada para Neuro (`kb_neuro.js`)
- [ ] Adicionar Auto-preenchimento da queixa (detectar AVC, Parkinson, etc.)
- [ ] Adicionar DCT com sugestão automática
- [ ] Adicionar Honorários CREFITO
- [ ] Adicionar Histórico de Avaliações (save/load/reset)
- [ ] Adicionar Paywall (CIF + IA)
- [ ] Responsividade mobile

### 👶 Pediatria (Pediatria.jsx) — Prioridade Alta
- [ ] Adicionar goniometria completa
- [x] BodyMap — já tem via ModuleEnhancer? Verificar
- [ ] Adicionar CIF automática + sugerida com qualificadores
- [ ] Adicionar Knowledge Base (12+ condições + gold standard + escalas + testes)
- [ ] Adicionar Auto-preenchimento da queixa
- [ ] Adicionar DCT com sugestão automática
- [ ] Adicionar Honorários CREFITO
- [ ] Adicionar testes especiais pediátricos (Gowers, Ortolani, Barlow, Adams) com vídeo
- [ ] Adicionar Yellow Flags com alerta
- [ ] Adicionar Histórico de Avaliações
- [ ] Adicionar Paywall

### 💪 CrossFit (CrossFit.jsx) — Prioridade Alta
- [ ] Adicionar goniometria completa
- [ ] Adicionar CIF automática + sugerida com qualificadores
- [ ] Adicionar Knowledge Base (12+ condições + gold standard + escalas + testes)
- [ ] Adicionar testes especiais CrossFit (O'Brien, Neer, Lachman, McMurray) com vídeo
- [ ] Adicionar Auto-preenchimento da queixa
- [ ] Adicionar DCT com sugestão automática
- [ ] Adicionar Honorários CREFITO
- [ ] Adicionar BodyMap
- [ ] Adicionar Yellow Flags
- [ ] Adicionar Histórico de Avaliações
- [ ] Adicionar Paywall

### 🥗 Nutrição Clínica (Nutrition.jsx) — Prioridade Média
- [x] Não precisa de goniometria, BodyMap, testes ortopédicos — são campos diferentes
- [ ] Adicionar CIF automática + sugerida (CIF específicos de nutrição)
- [ ] Adicionar Knowledge Base (12+ condições nutricionais)
- [ ] Adicionar Auto-preenchimento da queixa (detectar diabetes, obesidade, etc.)
- [ ] Adicionar Yellow Flags com alerta
- [ ] Adicionar Histórico de Avaliações
- [ ] Adicionar Paywall
- [ ] Responsividade mobile

### 🤲 Terapia Ocupacional (OccupationalTherapy.jsx) — Prioridade Alta
- [ ] Adicionar goniometria completa (mão dedicada: dedos, polegar)
- [ ] Adicionar Força Muscular MRC (músculos específicos de mão)
- [ ] Adicionar CIF automática + sugerida
- [ ] Adicionar Knowledge Base (12+ condições TO)
- [ ] Adicionar testes especiais TO (Phalen, Tinel, Finkelstein, Froment, Nine-Hole Peg)
- [ ] Adicionar Auto-preenchimento da queixa
- [ ] Adicionar DCT com sugestão automática
- [ ] Adicionar Yellow Flags
- [ ] Adicionar Honorários CREFITO
- [ ] Adicionar Histórico de Avaliações
- [ ] Adicionar Paywall
- [ ] Responsividade mobile

### 🏋️ Educação Física (PhysicalEducation.jsx) — Prioridade Média
- [x] BodyMap — adicionar (atualmente não tem)
- [x] CIF — adicionar
- [ ] Responsividade mobile
- [x] Análise IA — revisar summaryText para incluir todos os dados de performance

### 🟡 Placeholders (7 módulos) — Prioridade Baixa
- [ ] Já têm ModuleEnhancer completo (Pain, RedFlags, Sessões, IA, Relatório)
- [ ] Adicionar todos os sistemas acima conforme a especialidade

---

## 16. Arquitetura Técnica

### Arquivos a Criar/Modificar

```
src/
  data/
    cif.js                  ← EXPANDIR (adicionar CIFs de todas as especialidades)
    kb.js                   ← EXPANDIR (ou criar kb_neuro.js, kb_ped.js, etc.)
    kb_neuro.js             ← NOVO (12+ condições neurológicas)
    kb_ped.js               ← NOVO (12+ condições pediátricas)
    kb_cf.js                ← NOVO (12+ condições CrossFit)
    kb_nutri.js             ← NOVO (12+ condições nutricionais)
    kb_to.js                ← NOVO (12+ condições TO)
  hooks/
    useClinicalScan.js      ← EXPANDIR (detectar entidades de cada especialidade)
    useSemanticScanner.js   ← EXPANDIR (detectar comorbidades/antecedentes de cada especialidade)
  utils/
    clinicalDetection.js    ← EXPANDIR (regiões de dor, músculos, condições)
  components.jsx            ← JÁ TEM: AudioField, BodyMap, GonioRow, MRCRow, TestCard, etc.
  screens/
    Neuro.jsx               ← REWRITE (adicionar todos os sistemas)
    Pediatria.jsx           ← REWRITE
    CrossFit.jsx            ← REWRITE
    Nutrition.jsx           ← REWRITE
    OccupationalTherapy.jsx ← REWRITE
    PhysicalEducation.jsx   ← REWRITE (mobile + CIF)
```

### Estrutura de Componentes Compartilhados

Reutilizar de `src/components.jsx` (já existem):
- `AudioField` — ditado por voz
- `BodyMap` — mapa corporal interativo
- `EvaSlider` — escala EVA 0-10
- `TagSelect` — multi-select
- `SingleSelect` — single-select
- `GonioRow` — linha de goniometria com referência
- `MRCRow` — linha de força MRC
- `TestCard` — teste especial com vídeo
- `NumericDrum` — input numérico
- `SessionCounter` — contador de sessões
- `HonorariosCard` — calculadora CREFITO
- `Section`, `Row`, `Field` — layout grid

### Serviços Compartilhados

Reutilizar de `src/data/`:
- `cif.js` — dicionário CIF (expandir)
- `plans.js` — limites de IA por plano

---

## 17. Template Base para Cada Módulo

Cada módulo deve seguir a estrutura:

```
[Header: Voltar | Nome do Módulo | Inicial do Paciente | Tabs]

Tab: Anamnese
  - Identificação do Paciente (nome, data, nascimento, sexo, lateralidade)
  - Antropometria (peso, altura, IMC)
  - Queixa Principal com AudioField + Auto-detecção
  - Caracterização da Dor (BodyMap, local, caráter, tempo, melhora, piora)
  - HDA
  - Diagnóstico da Especialidade (com sugestão automática)
  - Comorbidades + Antecedentes (com detecção semântica)
  - Yellow Flags com alerta
  - Red Flags da especialidade
  - Knowledge Base (condição → gold standard, CIF sugeridos, escalas recomendadas)
  - CIF Automática com qualificadores
  - Honorários CREFITO (se Fisioterapia)

Tab: Exame Físico
  - Postura, Marcha, Edema, Sensibilidade, Reflexos, Palpação
  - Força MRC (CRUD dinâmico)
  - Goniometria (CRUD dinâmico com referências)
  - Testes Especiais da especialidade (com vídeo e execução)
  - Escalas Validadas da especialidade

Tab: Sessões [ModuleEnhancer]
  - PainSection
  - RedFlagsSection
  - SessionLogSection
  - AIAnalysisSection

Tab: Relatório [ModuleEnhancer]
  - ReportSection

Tab: Prescrição/Evolução
  - Específico de cada módulo

Tab: Evidências
  - Base de evidências com gold standard por condição
  - Detecção automática da condição atual
```

---

## 18. Critérios de Aceitação

Cada módulo deve:
1. **Auto-detectar** a condição ao digitar a queixa (mínimo 10 condições)
2. **Sugerir CIF** com qualificadores (mínimo 4 códigos)
3. **Mostrar gold standard** baseado em evidência
4. **Oferecer testes especiais** (mínimo 10) com vídeo + execução
5. **Registrar força MRC** com CRUD dinâmico
6. **Registrar goniometria** com valores de referência + out-of-range detection
7. **Sugerir escalas** validadas baseadas na condição
8. **Permitir impressão/PDF/compartilhamento** da análise IA e do relatório
9. **Bloquear CIF e IA** atrás do paywall (planos)
10. **Funcionar em mobile** (useMediaQuery, grids adaptáveis, scroll nas tabs)

---

## 19. Ordem de Implementação Sugerida

### Fase 1 — Módulos Core (Prioridade Alta)
1. **Neurofuncional** — módulo mais próximo de ortopedia, maior impacto clínico
2. **Pediatria** — já tem mobile + escalas, adicionar KB + CIF + testes
3. **Terapia Ocupacional** — já tem escalas ricas, adicionar MRC + gonio + KB + CIF

### Fase 2 — Especialidades (Prioridade Média)
4. **CrossFit** — já tem estruturas de métricas, adicionar KB + CIF + testes
5. **Nutrição Clínica** — adicionar CIF + KB + auto-detecção + mobile

### Fase 3 — Performance + Placeholders (Prioridade Baixa)
6. **Educação Física** — adicionar CIF + BodyMap + mobile
7. **7 Placeholders** — implementar conteúdo clínico completo
