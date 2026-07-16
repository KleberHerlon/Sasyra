# Roteiro de Testes — SASYRA

**Instruções:** Execute cada item na ordem. ✅ = passou | ❌ = falhou | 🤖 = automatizado

## Tipos de Teste

| Símbolo | Significado | Comando |
|---------|-------------|---------|
| ✅/❌ | Teste manual — execute no navegador | — |
| 🤖 | Teste automatizado — Playwright E2E | `npm run test:e2e` |
| 🧪 | Teste automatizado — Vitest unitário | `npm test` |

---

## 1. Ortopédica / Traumato-Ortopédica

### 1.1 Identificação do Paciente
| # | Teste | Esperado | Tipo |
|---|-------|----------|------|
| 1.1 | Abrir módulo ortopédico, ver seção "Identificação do Paciente" colapsada | Header visível, conteúdo oculto, ▶ apontando direita | 🤖 |
| 1.2 | Clicar no header para expandir | ▶ gira 90°, conteúdo aparece | 🤖 |
| 1.3 | Selecionar Sexo = "Feminino" e abrir BodyMap | Silhueta feminina | 🤖 |
| 1.4 | Selecionar Sexo = "Masculino" | Silhueta masculina | 🤖 |
| 1.5 | Preencher Antropometria (Peso 70kg, Altura 170cm) | IMC calculado automaticamente | ✅ |
| 1.6 | Selecionar Convênio = "Particular" | Aparece campo Região CREFITO | ✅ |

### 1.2 BodyMap e Queixa Principal
| # | Teste | Esperado | Tipo |
|---|-------|----------|------|
| 1.7 | Clicar áreas do corpo | Áreas selecionadas em verde | 🤖 |
| 1.8 | Alternar Frente/Costas | Mapa muda de vista | 🤖 |
| 1.9 | Tela < 400px (mobile) | BodyMap reduz escala | 🤖 |
| 1.10 | Digitar queixa | Scanner semântico detecta | ✅ |

### 1.3 Tabs da Avaliação
| # | Teste | Esperado | Tipo |
|---|-------|----------|------|
| 1.12 | Tabs: Avaliação, Evolução, Relatório, Evidências | 4 abas visíveis | 🤖 |
| 1.13 | Clicar "Evolução" | Mostra conteúdo da aba | 🤖 |
| 1.14 | Clicar "Relatório" | Dados + botões PDF | 🤖 |
| 1.15 | Alternar tabs | Conteúdo preservado | 🤖 |

### 1.4 💡 Dicas
| # | Teste | Esperado | Tipo |
|---|-------|----------|------|
| 1.16 | Botão 💡 Dicas visível no header | Botão verde com ícone 💡 | 🤖 |
| 1.17 | Clicar 💡 Dicas | Modal abre com funcionalidades | 🤖 |
| 1.18 | Clicar ✕ no modal | Modal fecha | 🤖 |
| 1.19 | Clicar fora do modal | Modal fecha | 🤖 |
| 1.20 | Modal contém dicas específicas | Ícones, títulos, descrições | 🤖 |

### 1.5 NumericField
| # | Teste | Esperado | Tipo |
|---|-------|----------|------|
| 1.21 | Digitar 500 em campo Peso (max 300) | Borda vermelha + "Fora do intervalo" | 🤖 |
| 1.22 | Digitar 70 em campo Peso | Sem erro de validação | 🤖 |

## 2. Spot Checks — Cálculos de Escalas

| Módulo | Escala | Input | Output Esperado | Tipo |
|--------|--------|-------|-----------------|------|
| Geriatria | MEEM | Todos "Certo" | 30/30 — Normal | 🧪 |
| Geriatria | GDS-15 | Todos "Não" (itens invertidos) | 0/15 — Normal | 🧪 |
| Geriatria | Katz | Todos "Independente" | 6/6 — Independência total | 🧪 |
| Geriatria | Tinetti | Todos máximos | 28/28 — Baixo risco | 🧪 |
| Geriatria | BBS | Todos "4" | 56/56 — Baixo risco | 🧪 |
| Geriatria | MNA | Todos máximos | 30/30 — Normal | 🧪 |
| Neuro | GCS | 4 + 5 + 6 | 15 — Trauma leve | 🧪 |
| Neuro | MIF | Todos "7" | 126/126 — Independência | 🧪 |
| Reumato | FIQ-R | Todos "0" | ~0/100 — Impacto leve | 🧪 |
| Reumato | DAS28 | 0,0,0,0 | 0 — Remissão | 🧪 |
| Cardio | DASI | Todos "Sim" | 58.2 — Excelente | 🧪 |
| Uro | PISQ-12 | Todos "4" | 48/48 — Função preservada | 🧪 |

---

## Comandos de Teste

```bash
# Testes unitários (escalas, cálculos)
npm test

# Testes E2E automatizados (UI, interações)
npm run test:e2e

# Testes E2E com navegador visível
npm run test:e2e:headed

# Testes E2E com interface gráfica
npm run test:e2e:ui

# Todos os testes (unitários + E2E)
npm run test:all

# Relatório HTML dos testes E2E
npx playwright show-report
```

## Total de Testes

| Categoria | Automatizados | Manuais | Total |
|-----------|:---:|:---:|:---:|
| Vitest (unitários) | 721 | — | 721 |
| Playwright (E2E) | 16 | — | 16 |
| Manual (roteiro) | — | ~130 | 130 |
| **TOTAL** | **737** | **~130** | **~867** |

---

## 1. Ortopédica / Traumato-Ortopédica

### 1.1 Identificação do Paciente
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 1.1 | Abrir módulo ortopédico, ver seção "Identificação do Paciente" colapsada | Header visível, conteúdo oculto, ▶ apontando direita | |
| 1.2 | Clicar no header para expandir | ▶ gira 90°, conteúdo aparece: Nome, Data Nasc., Sexo, Lateralidade, Estado civil, Profissão, Telefone | |
| 1.3 | Selecionar Sexo = "Feminino" e abrir BodyMap | Silhueta feminina no mapa corporal | |
| 1.4 | Selecionar Sexo = "Masculino" | Silhueta masculina | |
| 1.5 | Preencher Antropometria (Peso 70kg, Altura 170cm) | IMC calculado automaticamente | |
| 1.6 | Selecionar Convênio = "Particular" | Aparece campo Região CREFITO e HonoráriosCard | |

### 1.2 BodyMap e Queixa Principal
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 1.7 | Clicar em áreas do corpo no BodyMap | Áreas selecionadas aparecem em verde com lista abaixo | |
| 1.8 | Alternar entre Frente/Costas | Mapa corporal muda de vista | |
| 1.9 | Em tela < 400px de largura (mobile pequeno) | BodyMap reduz escala, botões e labels menores | |
| 1.10 | Digitar queixa como "dor no joelho direito ao subir escadas" | Scanner semântico detecta músculos, lateralidade, caráter da dor | |
| 1.11 | Campo HDA com microfone | Funciona gravação de áudio | |

### 1.3 Tabs da Avaliação
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 1.12 | Ver tabs: Avaliação, Evolução, Relatório, Evidências | 4 abas visíveis | |
| 1.13 | Clicar na aba "Evolução" | Mostra avaliações salvas ou mensagem "Nenhuma avaliação" | |
| 1.14 | Clicar na aba "Relatório" | Mostra dados da última avaliação + botões Gerar PDF e Compartilhar | |
| 1.15 | Clicar na aba "Evidências" | Mostra condições detectadas na queixa ou mensagem informativa | |
| 1.16 | Voltar para aba "Avaliação" | Todos os campos preenchidos preservados | |

### 1.4 Escalas na Evolução
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 1.17 | Na aba Evolução, campo "Escala aplicada nesta sessão" | Mostra cabeçalho explicativo com ⭐ = sugeridas | |
| 1.18 | Abrir dropdown de escalas | Escalas sugeridas aparecem no topo; separador "── complementares ──"; todas as demais abaixo | |
| 1.19 | Selecionar escala sugerida (ex: ODI se detectado joelho) | Abre ScaleModal com questionário completo | |
| 1.20 | Preencher todos os itens e salvar | Resultado aparece com % e interpretação | |

### 1.5 Colapsáveis
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 1.21 | Verificar seções colapsáveis: Queixa, Dor e Funcionalidade, Exame Físico, Goniometria, Neuro Periférico, Observações, IA | Cada uma expande/recolhe independentemente | |

---

## 2. Neurológica

### 2.1 Identificação e Anamnese
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 2.1 | Abrir módulo Neuro, expandir PatientIdentification | Campos Nome, Data Nasc., Sexo, Lateralidade, Estado civil, Profissão, Telefone visíveis | |
| 2.2 | BridgeAlerts — paciente com restrições de outra avaliação | Card âmbar "Ponte de Transição" aparece no topo da avaliação | |
| 2.3 | Queixa principal com badge "OBRIGATÓRIO" | Badge vermelho visível | |
| 2.4 | Selecionar Sexo = Feminino, ver BodyMap no GeneralAssessment | Silhueta feminina | |

### 2.2 Escalas Neurológicas (Inline)
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 2.5 | Glasgow (GCS) — 3 componentes | Abertura Ocular (1-4), Verbal (1-5), Motora (1-6). Soma automática e interpretação | |
| 2.6 | MAS — 12 itens (6 grupos × 2 lados) | Cada item 0-4, soma 0-48 com interpretação | |
| 2.7 | BBS (Berg) — 14 itens | Cada item 0-4, soma 0-56 com nível de risco de queda | |
| 2.8 | MIF — 18 itens | Cada item 1-7, soma 18-126 com nível de independência | |
| 2.9 | TIS — 3 componentes | Estático (0-7), Dinâmico (0-10), Transferências (0-6). Soma 0-23 | |
| 2.10 | DermatomeMap | Clicar nos dermátomos, marcação visual funcional | |
| 2.11 | ReflexMatrix | Matriz de reflexos tendinosos e patológicos funciona | |

### 2.3 Escalas via ScaleSelector
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 2.12 | Abrir ScaleSelector — clicar Fugl-Meyer | Questionário com 15 itens 0-2 abre no modal | |
| 2.13 | NIHSS | Questionário com 15 itens e pesos ponderados | |
| 2.14 | GCS (registro) | Questionário 3 itens, mesmo cálculo da versão inline | |
| 2.15 | TIS (registro) | Questionário 3 itens com ranges corretos | |
| 2.16 | Barthel Index | 10 itens com scores ponderados | |
| 2.17 | SCIM | 15 itens com scores ponderados para lesão medular | |
| 2.18 | EDSS | 8 sistemas funcionais + deambulação | |

---

## 3. Geriátrica

### 3.1 Escalas Inline
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 3.1 | MEEM — 30 itens (1 ponto cada) | Questionário com orientação temporal (5), espacial (5), registro (3), cálculo (5), evocação (3), linguagem (9). Total 0-30 com interpretação | |
| 3.2 | GDS-15 — 15 perguntas Sim/Não | Cada item "Sim"/"Não" (alguns invertidos). Total 0-15 com nível de depressão | |
| 3.3 | Katz — 6 AVDs | Banho, vestir, higiene, transferência, continência, alimentação. Soma independentes 0-6 | |
| 3.4 | Lawton — 8 AVDs instrumentais 1-3 | Telefone, compras, alimentos, tarefas, lavanderia, transporte, medicações, finanças. Total 0-24 | |
| 3.5 | SARC-F — 5 itens 0-2 | Força, marcha, levantar, escadas, quedas. ≥4 = risco sarcopenia | |
| 3.6 | Tinetti — 18 sub-itens | Equilíbrio (9) + Marcha (9). Total 0-28 com risco de queda | |
| 3.7 | BBS (Berg) — 14 tarefas 0-4 | Cada item com critérios específicos. Total 0-56 | |
| 3.8 | Fragilidade de Fried — 5 checkboxes | Perda peso, exaustão, fraqueza, lentidão, baixa atividade | |

### 3.2 Escalas via ScaleSelector
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 3.9 | FES-I — 16 itens × 4 níveis | Questionário completo sobre medo de cair. Total 16-64 | |
| 3.10 | MNA — 18 itens (triagem + avaliação) | 6 triagem + 12 avaliação com pesos específicos. Total 0-30 | |
| 3.11 | SPPB — 3 testes | Equilíbrio (0-4), Marcha (0-4), Cadeira (0-4). Total 0-12 | |
| 3.12 | CFS — slider 1-9 | Escala de fragilidade clínica | |

---

## 4. Uro-Ginecológica

### 4.1 Estrutura
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 4.1 | Abrir módulo Uro | PatientIdentification aparece no TOPO da aba avaliação (não no final) | |
| 4.2 | BridgeAlerts funcional | Card âmbar se paciente tiver restrições | |
| 4.3 | BodyMap sexo | Silhueta feminina quando Sexo = Feminino | |

### 4.2 Anamnese e Avaliação
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 4.4 | História obstétrica | Gesta, Para, Partos normais, Cesários, Abortos, Menopausa — campos numéricos com validação | |
| 4.5 | Cirurgias pélvicas | TagSelect com 10 opções | |
| 4.6 | PelvicFloorMap | Mapa do assoalho pélvico clicável | |
| 4.7 | Bristol Stool Scale | Componente visual da escala de fezes | |
| 4.8 | Erection Rigidity Scale | Aparece apenas se Sexo = Masculino | |

### 4.3 Diário Miccional (ICS 3 dias)
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 4.9 | Componente do Diário Miccional visível | Card com título "Diário Miccional — 3 Dias (ICS)" | |
| 4.10 | Alternar entre Dia 1, Dia 2, Dia 3 | Tabs funcionam, cada uma com entradas independentes | |
| 4.11 | Adicionar horário | Botão "+" adiciona nova linha na tabela | |
| 4.12 | Remover horário | Botão "×" remove linha (mínimo 3 linhas) | |
| 4.13 | Preencher volumes, marcar perdas e trocas | Checkboxes e inputs numéricos funcionam | |
| 4.14 | Salvar diário | Persiste no localStorage, botão "💾 Salvar Diário" | |
| 4.15 | Sumário automático | Volume médio 24h, Ingestão média, Micções médias, Volume/micção, Perdas totais | |
| 4.16 | Alerta de poliúria | Aparece se volume total > 7500ml em 3 dias | |

### 4.4 Escalas
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 4.17 | ICIQ-SF inline | 4 questões (frequência, quantidade, interferência, quando). Score 0-21 | |
| 4.18 | PFDI-20 inline | 3 domínios: POPDI (0-120), CRADI (0-160), UDI (0-120). Total 0-300 | |
| 4.19 | FSFI inline | 6 domínios (desejo, excitação, lubrificação, orgasmo, satisfação, dor). Corte ≤26.55 | |
| 4.20 | Oxford AP | SingleSelect 0-5 com interpretação | |
| 4.21 | PERFECT | 4 campos: Power (0-5), Endurance (seg), Repetitions, Fast. Score total | |
| 4.22 | POP-Q | 7 pontos (Ba, Bp, C, D, Gh, Pb, TVL) com ranges | |
| 4.23 | ScaleSelector: PISQ-12 | 12 itens 0-4, questionário completo | |
| 4.24 | ScaleSelector: UDI-6 | 6 itens 0-3, score 0-100 | |
| 4.25 | ScaleSelector: OAB-q | Slider 0-100 | |

---

## 5. Esportiva

### 5.1 Estrutura
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 5.1 | Perfil do Atleta | NÃO mostra campos duplicados (Nome, Idade, Sexo removidos). Mostra Modalidade, Tempo prática, Nível, Fase temporada | |
| 5.2 | BridgeAlerts funcional | Card âmbar se paciente tiver restrições | |

### 5.2 Testes Funcionais
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 5.3 | Y-Balance | 6 entradas (Anterior D/E, PM D/E, PL D/E) + comprimento perna. Composite e LSI automáticos | |
| 5.4 | Hop Tests | Single hop D/E, Triple hop D/E, Crossover hop D/E. LSI bidirecional automático | |
| 5.5 | RTS Criteria | Checkboxes interativos, % calculado automaticamente | |
| 5.6 | CORE | Plank e Side plank com timer em segundos | |

### 5.3 Escalas Sport
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 5.7 | ScaleSelector: IKDC | 15 itens, subjetivo do joelho | |
| 5.8 | VISA-P, VISA-A, FAAM | Questionários específicos de tendão/tornozelo | |

---

## 6. Reumatológica

### 6.1 Estrutura
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 6.1 | BridgeAlerts funcional | Card âmbar se paciente tiver restrições | |
| 6.2 | NumericField com validação | Borda vermelha + aviso "Fora do intervalo" quando valor além do min/max | |

### 6.2 Escalas Inline
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 6.3 | DAS28 — 4 campos | Dolorosas (0-28), Edemaciadas (0-28), VHS, Saúde global. Cálculo automático | |
| 6.4 | BASDAI — 6 itens EvaSlider 0-10 | Fadiga, dor espinhal, articular, sensibilidade, severidade matinal, duração | |
| 6.5 | HAQ — 12 itens 0-3 | 12 AVDs, média calculada | |
| 6.6 | WOMAC — 24 itens | Dor (5), Rigidez (2), Função (17). Total com interpretação | |
| 6.7 | WPI — NumericField 0-19 | Com validação visual | |

### 6.3 Escalas via ScaleSelector
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 6.8 | FIQ-R (Fibromialgia) | 21 itens: 9 função (0-10), 2 impacto geral, 10 sintomas. Score 0-100 com 3 domínios | |
| 6.9 | SLEDAI (Lúpus) | 24 descritores presente/ausente com pesos (1-8). Score 0-105 | |
| 6.10 | BASFI | 10 itens 0-10 VAS. Média calculada | |
| 6.11 | SDAI | Tender28 + Swollen28 + Patient Global + Physician Global + CRP | |
| 6.12 | CDAI | Igual SDAI sem CRP | |

---

## 7. Cardio-Respiratória

### 7.1 Estrutura
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 7.1 | BridgeAlerts funcional | Card âmbar se paciente tiver restrições | |
| 7.2 | Sinais vitais: FC, FR, SpO₂, PA | NumericFields com validação de range | |

### 7.2 Escalas
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 7.3 | Minnesota — 21 itens inline | Cada item 0-5, total 0-105 | |
| 7.4 | ScaleSelector: LCADL | 15 itens 0-5, questionário completo | |
| 7.5 | ScaleSelector: DASI | 12 itens Sim/Não com pesos MET, score max 58.2 | |
| 7.6 | BODE Index | Slider 0-10 | |

---

## 8. Dermatofuncional

| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 8.1 | Vancouver (VSS) inline | 4 campos: Pigmentação (0-2), Vascularidade (0-3), Pliabilidade (0-5), Altura (0-3). Total 0-13 | |
| 8.2 | Edema inline | SingleSelect 0-4 com descrição | |
| 8.3 | ScaleSelector: DLQI | 10 itens 0-3, questionário completo | |
| 8.4 | ScaleSelector: PSFS | Slider 0-10 | |

---

## 9. Oncológica

| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 9.1 | ECOG inline | SingleSelect 0-5 com labels coloridos | |
| 9.2 | KPS (Karnofsky) inline | NumericField 0-100 com validação | |
| 9.3 | EORTC QLQ-C30 inline | 5 funcionais + 8 sintomas + QV global. Transformação linear 0-100 | |
| 9.4 | ESAS inline | 9 sintomas 0-10 EvaSlider | |
| 9.5 | ScaleSelector: BPI | 4 severidade + 7 interferência, questionário 0-10 | |
| 9.6 | ScaleSelector: Distress | Slider 0-10 | |
| 9.7 | Contraindicações e Precauções | Seção colapsável com lista de contraindicações | |

---

## 10. Pediátrica

| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 10.1 | PatientIdentification com hideAntropometria | Sem campos de peso/altura/IMC | |
| 10.2 | BodyMap com flag pediatric | Partes do corpo simplificadas para criança | |
| 10.3 | GMFCS inline | SingleSelect I-V com descrição por nível | |
| 10.4 | AIMS inline | NumericField 0-58 com validação | |
| 10.5 | M-CHAT inline | Checkboxes de itens positivos | |
| 10.6 | Escalas pediátricas no ScaleSelector | DENVER II, TUG Ped, MACS, MABC-2, FAC, Vignos, GMFM | |

---

## 11. Cross-Module (Transversais)

### 11.1 Persistência
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 11.1 | Salvar avaliação, recarregar página | Dados persistem via localStorage | |
| 11.2 | Trocar de paciente e voltar | Dados do paciente anterior preservados | |

### 11.2 BridgeAlerts
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 11.3 | Criar avaliação ortopédica com "condromalacia" na queixa, salvar | Restrições geradas | |
| 11.4 | Abrir mesmo paciente em módulo Neuro | Card âmbar "Ponte de Transição" aparece com alerta sobre compressão patelar | |
| 11.5 | Abrir mesmo paciente em módulo Geriatria | Card âmbar aparece | |

### 11.3 Responsividade
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 11.6 | Redimensionar para 375px (iPhone SE) | BodyMap escala reduzida (0.65), labels menores, botões compactos | |
| 11.7 | Redimensionar para 768px (tablet) | Layout confortável, grids 2-3 colunas | |
| 11.8 | Redimensionar para 1440px (desktop) | Layout completo, BodyMap escala 1.4 | |

### 11.4 NumericField
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 11.9 | Digitar valor fora do range (ex: Peso = 500 em campo max 300) | Borda vermelha + texto "Fora do intervalo (0–300)" | |
| 11.10 | Campo com required | Asterisco vermelho * ao lado do label | |
| 11.11 | Campo readOnly (ex: DAS28 resultado) | Aparência opaca, cursor not-allowed, sem validação | |

### 11.5 PatientIdentification
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 11.12 | Em qualquer módulo, expandir/recolher PatientIdentification | Header com ▶ rotativo, conteúdo condicional | |
| 11.13 | Campos presentes em todos módulos | Nome, Data Nasc, Sexo, Lateralidade, Estado civil, Profissão, Telefone | |
| 11.14 | Selecionar Sexo = Feminino em qualquer módulo | BodyMap mostra silhueta feminina | |

### 11.6 Escalas (ScaleSelector)
| # | Teste | Esperado | OK? |
|---|-------|----------|-----|
| 11.15 | Clicar em qualquer escala no ScaleSelector | Modal abre com questionário ou slider | |
| 11.16 | Preencher todos os itens de uma escala multi-item | Score calculado e exibido | |
| 11.17 | Escala salva aparece com ✓ verde | Indicador visual de escala preenchida | |
| 11.18 | Reabrir escala salva | Valores anteriores carregados | |

---

## 12. Avaliação Rápida de Cálculos (Spot Check)

| Módulo | Escala | Input | Output Esperado | OK? |
|--------|--------|-------|-----------------|-----|
| Geriatria | MEEM | Todos "Certo" | 30/30 — Normal | |
| Geriatria | GDS-15 | Todos "Não" (itens 1,5,7,11,13 invertidos) | 0/15 — Normal | |
| Geriatria | Katz | Todos "Independente" | 6/6 — Independência total | |
| Geriatria | Tinetti | Todos máximos | 28/28 — Baixo risco de queda | |
| Geriatria | BBS | Todos "4" | 56/56 — Baixo risco | |
| Geriatria | MNA | Todos máximos | 30/30 — Normal | |
| Neuro | GCS | 4 + 5 + 6 | 15 — Trauma leve | |
| Neuro | MIF | Todos "7" | 126/126 — Independência completa | |
| Reumato | FIQ-R | Todos "0" | ~0/100 — Impacto leve | |
| Reumato | DAS28 | 0,0,0,0 | 0 — Remissão | |
| Reumato | BASDAI | Todos "0" | 0 — Baixa atividade | |
| Cardio | DASI | Todos "Sim" | 58.2 — Excelente | |
| Cardio | LCADL | Todos "1" | 15/75 — Leve | |
| Dermato | DLQI | Todos "0" | 0/30 — Pequeno efeito | |
| Dermato | Vancouver | 0+0+0+0 | 0/13 — Cicatriz normal | |
| Uro | PISQ-12 | Todos "4" | 48/48 — Função preservada | |
| Uro | UDI-6 | Todos "0" | 0/100 — Leve | |

---

## Resumo Final

| Módulo | Testes | Passaram | Falharam | Nota |
|--------|--------|----------|----------|------|
| 1. Ortopédica | 21 | | | |
| 2. Neurológica | 18 | | | |
| 3. Geriátrica | 12 | | | |
| 4. Uro-Ginecológica | 25 | | | |
| 5. Esportiva | 8 | | | |
| 6. Reumatológica | 12 | | | |
| 7. Cardio-Respiratória | 6 | | | |
| 8. Dermatofuncional | 4 | | | |
| 9. Oncológica | 7 | | | |
| 10. Pediátrica | 6 | | | |
| 11. Cross-Module | 18 | | | |
| 12. Spot Check | 17 | | | |
| **TOTAL** | **154** | | | |

---

**Data do teste:** ___/___/______
**Testado por:** ________________
**Versão:** commit `HEAD`
