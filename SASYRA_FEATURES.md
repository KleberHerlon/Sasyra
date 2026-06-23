# SASYRA — Assistente Clínico Inteligente para Fisioterapeutas

> *Reabilitação baseada em evidências, potencializada por inteligência artificial.*

---

## Visão Geral

SASYRA é uma plataforma SaaS de avaliação fisioterapêutica que unifica **anamnese inteligente**, **testes especiais com vídeo**, **escalas validadas**, **classificação CIF automatizada** e **análise clínica por IA** em uma única interface moderna e responsiva.

---

## 🧠 1. Anamnese Inteligente com Detecção Automática de Queixa

- **Campo de queixa principal com reconhecimento de voz** (Speech-to-text em português‑BR)
- **Detecção automática da condição**: ao digitar a queixa, o sistema reconhece mais de 20 patologias ortopédicas (lombalgia, cervicalgia, gonalgia, ombralgia, LCA, lesão meniscal, fascite plantar, tendinopatia de Aquiles, hérnia de disco, estenose lombar, síndrome patelofemoral, impacto femoroacetabular, coxartrose, tendinopatia de glúteo, epicondilite, instabilidade de cotovelo, ombro congelado, etc.)
- **Detecção de local da dor com lateralidade**: suporte a 10 regiões anatômicas, cada uma com especificidade de lado (D/E) e fallback bilateral; detecta termos populares como "barriga da perna", "canelite", "joelho do saltador"
- **Seção de HDA (História da Doença Atual)** com transcrição por voz
- **Caráter da dor**: 12 descritores (latejante, queimação, pontada, choques, neuropática, etc.)
- **Duração/tempo de evolução**: categorias de aguda a crônica complexa
- **Fatores de melhora/piora**: multisseleção com tags
- **Red flags**: lista de bandeiras vermelhas específicas para cada condição
- **Yellow flags**: avaliação psicossocial (catastrofização, cinesiofobia, autoeficácia)

---

## 🩺 2. BodyMap Interativo (Mapa Corporal Digital)

- **Visualização frontal e posterior** do corpo humano para marcação de áreas sintomáticas
- **Clique para adicionar/remover regiões** com feedback visual imediato
- **Detecção automática de lateralidade** (D/E) nas áreas do corpo
- **34 áreas mapeadas**: cabeça, cervical, ombros, braços, antebraços, mãos, tórax, abdômen, coluna (cervical/torácica/lombar), quadril, joelhos, pernas, tornozelos, pés
- **Exibição de detalhes**: articulação e músculos correspondentes a cada área selecionada
- **Integração com detecção automática**: áreas pré-selecionadas conforme a queixa do paciente

---

## 📏 3. Escalas e Medidas de Avaliação

- **36 instrumentos validados internacionalmente**, incluindo:
  - **Coluna**: Oswestry ODI (10 domínios), Neck Disability Index, Roland‑Morris
  - **Joelho**: KOOS (5 subescalas), Lysholm, Tegner, IKDC, Kujala, OKS (Oxford Knee)
  - **Quadril**: HOOS, OHS (Oxford Hip), Harris Hip Score
  - **Ombro**: DASH/QuickDASH, Constant, ASES, WORC, SST, UCLA, OSS (Oxford Shoulder)
  - **Tornozelo/Pé**: AOFAS, FAAM, CAIT, FADI, FFI
  - **Gerais**: SF‑36 (8 domínios), EQ‑5D‑5L, NPRS (0–10), FRI
  - **Psicossociais**: TSK‑17 (cinesiofobia), PCS (catastrofização), START Back Screening Tool
- **Cálculo automático** dos scores de cada escala
- **Modal de preenchimento interativo** com navegação item a item
- **MCID/MDC** documentados para cada escala (Diferença Mínima Clinicamente Importante)

---

## 💪 4. Testes Musculoesqueléticos (Força e Goniometria)

- **Teste de força muscular MRC** (0 a 5) para 12 grupos musculares
- **Goniometria** com suporte a todas as articulações e movimentos (flexão, extensão, rotação, inclinação)
- **Ângulos normativos** de referência para cada movimento
- **Interface dinâmica** de adicionar/remover linhas de avaliação

---

## 🎥 5. Testes Especiais com Vídeo Incorporado

- **38+ testes especiais** organizados por condição clínica
- **Vídeos de demonstração incorporados** (YouTube) para **36 testes** — o fisioterapeuta vê a execução sem sair do sistema
- **Descrição detalhada** de cada teste: como executar, sensibilidade, especificidade, interpretação
- **Registro de resultado**: Positivo / Negativo / Não realizado, com codificação visual por cores
- **Gravação automática de progresso** por paciente

### Testes por Condição:

| Condição | Testes |
|----------|--------|
| **Lombalgia** | Lasègue (SLR), Slump Test, Schober, FABER/Patrick, Gaenslen, Waddell |
| **Cervicalgia** | Spurling, Distração Cervical, FRT, ULTT 1 (mediano), ULTT 2a (radial), Compressão Axial Cervical |
| **Ombro** | Neer, Hawkins-Kennedy, Empty Can / Jobe, Full Can, O'Brien (SLAP), Apreensão Anterior + Relocação, Gerber Lift-off |
| **Joelho** | Lachman, Pivot Shift, McMurray, Thessaly 20°, Valgus/Varus Stress, Clarke / Patelofemoral, Dial Test |
| **Tornozelo/Pé** | Anterior Drawer, Talar Tilt, Ottawa Ankle Rules, Windlass Test, Thompson (Aquiles), CAIT |
| **Cotovelo** | Mills, Cozen, Golfer (Medial), Valgus Stress Test, Moving Valgus Stress, Milking Maneuver, Lateral Pivot Shift, Elbow Flexion Test (Ulnar) |

---

## 🏛️ 6. Classificação CIF Automática

- **11 códigos CIF** integrados (b28013, b710, b715, b730, b735, b740, b770, d410, d415, d450, d850)
- **Sugestão automática de códigos** com base na condição identificada
- **Identificação avançada de códigos CIF** baseada nos dados preenchidos (EVA, AVDS, local da dor, goniometria, testes)
- **Qualificadores automáticos** (0–4) gerados por engine dedicada
- **Exibição integrada** na avaliação e no relatório final

---

## 🤖 7. Análise Clínica por Inteligência Artificial

- **Integração com API Claude (Anthropic)** para geração de análise clínica
- **Prompt contextual avançado**: queixa, local da dor, testes, escalas, goniometria, fatores psicossociais — tudo embutido na análise
- **Recomendações baseadas em evidências** com referências (PEDro, Cochrane, CPGs)
- **Plano de tratamento personalizado** gerado automaticamente
- **Acompanhamento de evolução**: histórico de todas as análises salvo por paciente

---

## 📋 8. Base de Conhecimento e Evidências

- **Base de evidências PEDro** para 6 condições principais com:
  - Pontuação PEDro (0–10)
  - Conclusão do estudo
  - Fonte (Cochrane, BJSM, Lancet, NEJM, JOSPT)
- **Padrão-ouro** (Gold Standard) documentado para cada condição com nível de evidência
- **Citações atualizadas** (2021–2023) das principais revistas
- **Guias de prática clínica** (CPGs) referenciados

---

## 👥 9. Gestão de Pacientes

- **Cadastro completo** com nome, idade, sexo, peso, altura, profissão, diagnóstico, contato
- **IMC calculado automaticamente**
- **Histórico de avaliações**: todas as avaliações salvas por paciente com data
- **Navegação temporal**: carregar avaliações anteriores, editar e salvar novamente
- **Logs de evolução**: registros de sessão com EVA, procedimentos, resposta ao tratamento
- **Logs por paciente**: filtrados automaticamente pelo paciente ativo

---

## 📄 10. Relatório Multidisciplinar

- **Geração automática** de relatório completo formatado
- **Seções**: queixa principal, local da dor, testes físicos, goniometria, MRC, escalas, CIF, análise de IA
- **Design profissional** com tipografia serifada e layout de impressão
- **Otimizado para impressão** (CSS print)
- **Informações do paciente** (nome, idade, sexo, profissão) e do profissional (nome, CREFITO)
- **Observações clínicas editáveis** para personalização do relatório

---

## 💰 11. Módulo Financeiro

- **Gestão de honorários** com base na tabela CREFITO por região:
  - Valores por região (Sul, Sudeste SP, Sudeste RJ/ES/MG, Centro-Oeste, Nordeste, Norte)
  - Consulta, sessão, avaliação, relatório
- **Tabela de procedimentos** categorizada:
  - Eletroterapia, Termoterapia, Terapia Manual, Cinesioterapia, Hidroterapia, Acupuntura, Pilates
- **Controle de recebimentos** com datas e valores recebidos
- **Resumo financeiro mensal**: total previsto, total recebido, pendente, percentual
- **Seção de despesas** e **extrato mensal**
- **Relatório financeiro exportável**

---

## 📅 12. Agenda Inteligente

- **Visualização mensal** com calendário interativo
- **Agendamento de consultas**: paciente, tipo (consulta/sessão/avaliação), status (confirmado/pendente/cancelado)
- **Edição e exclusão** de compromissos
- **Navegação entre meses**
- **Destaque visual**: compromissos com cor no calendário
- **Clique em data** para filtrar compromissos do dia
- **Integração**: clique em paciente na agenda para ir direto à avaliação

---

## 🎛️ 13. Exame Físico Completo

- **Postura**: seleção de desvios posturais
- **Marcha**: campo de descrição da marcha
- **Edema**: avaliação de edema (cacifo, grau)
- **Palpação**: campo com transcrição por voz
- **Sensibilidade**: campo de descrição
- **Reflexos**: campo de descrição

---

## 🌓 14. Tema e Experiência do Usuário

- **Modo escuro e claro** com toggle integrado
- **CSS Variables** para theming consistente
- **Design responsivo** para mobile, tablet e desktop
- **Glassmorphism** na tela de login
- **Animações sutis** (floating glow effects)
- **Interface limpa** com cards, cores semânticas (verde/positivo, vermelho/negativo, âmbar/pendente)
- **Transições suaves** entre temas

---

## 🎤 15. Transcrição por Voz

- **Reconhecimento de fala nativo** (Web Speech API)
- **Suporte a português‑BR**
- **Gravação contínua**: mantém captando até o usuário parar
- **Acumulação de texto**: novas falas são concatenadas ao texto existente
- **Disponível em**: queixa principal, HDA, palpação, observações clínicas, evolução
- **Botão toggle** com feedback visual (verde = ouvindo, vermelho = parado)

---

## 🔒 16. Autenticação e Segurança

- **Tela de login** com credenciais profissionais (profissão, nome, CREFITO)
- **Acesso restrito**: apenas profissionais cadastrados
- **Indicação visual de sistema seguro e monitorado**
- **Logout** com limpeza de dados da sessão
- **Tema independente** para tela de login

---

## ⚙️ 17. Tecnologia e Infraestrutura

- **Frontend**: React 19 + Vite 8 (build ~380ms)
- **Linguagem**: JavaScript (JSX moderno)
- **Estilização**: CSS-in-JS com design tokens (CSS Variables)
- **ESLint**: configuração ativa para qualidade de código
- **Responsividade**: suporte mobile via `useMediaQuery`
- **Armazenamento**: localStorage com persistência de pacientes, avaliações e logs
- **IA**: API Anthropic Claude
- **Vídeos**: YouTube embed (iframe) e react-youtube
- **BodyMap**: `react-muscle-highlighter`
- **Ícones**: SVG sprites + Material Symbols

---

## 🧩 Principais Diferenciais

1. **Detecção automática de condição** — digite a queixa e o sistema já carrega testes, escalas e evidências
2. **Vídeos dos testes incorporados** — sem precisar sair do sistema para ver a execução
3. **BodyMap inteligente** — marcação visual com integração à detecção automática
4. **CIF automatizado** — códigos e qualificadores gerados a partir dos dados da avaliação
5. **IA clínica contextual** — análise que considera TODOS os dados da avaliação
6. **36 escalas validadas** — todas com cálculo automático e referências MCID/MDC
7. **Financeiro integrado** — honorários CREFITO por região com controle de recebimentos
8. **Tudo em um só lugar** — anamnese, exame físico, testes, escalas, CIF, IA, relatório, agenda, financeiro

---

## 🔮 Roadmap (Funcionalidades Identificadas no Código)

- Integração com **Supabase** (backend real)
- **Múltiplas avaliações independentes** por paciente (já implementado)
- **Relatório multidisciplinar** aprimorado
- **Referenciação de pacientes** entre profissionais (já há sugestão de lógica)
- **Melhorias no BodyMap SVG** (redesenho planejado)

---

*SASYRA — Reabilitação e Evidência • 2025–2026*
