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
4. Falta suporte para áreas específicas (pediatria, neuro, crossfit)
5. IA com custo alto nos planos básicos

---

## Arquitetura dos Últimos Módulos Implementados (Pediatria, CrossFit, Neuro)

### Ponte de Transição de Dados — `src/data/transitionBridge.js`
- Lê `sasyra_assessments` do localStorage e mapeia restrições da fisioterapia para alertas visuais no módulo de treino.
- **Deduplicação automática**: restrições já detectadas via `getRestricoesClinicas()` na anamnese do PE são omitidas da ponte (`bridgeExibidas`).
- **Bloqueio de exercícios**: 12 condições mapeadas para IDs de exercícios proibidos — aparecem como 🚫 na busca e nas sugestões, impedindo adição.
- **Validade temporal**: avaliações com >90 dias recebem badge "+90 dias" e aviso de reavaliação.

### Bloqueio Brzycki > 10 reps — `src/data/physicalAssessment.js`
- `calc1RMPreditivo` retorna `bloqueio` com mensagem simplificada quando `repeticoes > 10`.
- Interface exibe card vermelho 🚫 com alternativa (teste de 10RM).

### Novo Módulo Pediatria — `src/screens/Pediatria.jsx`
- Persistência: `ped_data_[studentId]` (localStorage)
- Abas: Anamnese (📋), Terapia (🏃), Evolução (📈), Evidências (🔬)
- Conteúdo: história gestacional/perinatal, marcos motores, comorbidades pediátricas, exame físico pediátrico (tônus, reflexos primitivos, coordenação)
- Escalas: GMFCS (I-V), AIMS score, M-CHAT (autismo - TagSelect)
- Plano terapêutico com atividades (estimulação motora, treino de marcha, fortalecimento, integração sensorial, exercícios lúdicos)
- Cor: C.blue (#60A5FA)
- Evidências pediátricas: paralisia_cerebral, sindrome_down, tea, mielomeningocele, distrofia_muscular, torcicolo_congenito

### Novo Módulo CrossFit — `src/screens/CrossFit.jsx`
- Persistência: `cf_data_[studentId]` (localStorage)
- Abas: Perfil (📋), Treinos (🏋️), Métricas (📊), Evolução (📈), Evidências (🔬)
- Conteúdo: perfil do atleta (nível, modalidades favoritas, lesões prévias, movimentos proibidos), registro de treinos (Strength/Metcon/Gymnastics/Weightlifting)
- Benchmarks WODs predefinidos: Fran, Helen, Cindy, Grace, Isabel, Diane, Annie, Karen, Kelly
- RPE tracking em cada treino
- 1RM tracking: Snatch, Clean & Jerk, Back Squat, Front Squat, Deadlift, Bench Press, Shoulder Press
- Cor: C.amber (#FBBF24)
- Evidências: Lombalgia em CrossFitters, Ombro do CrossFitter, Joelho do CrossFitter, Rabdomiólise, Tendinopatias

### Novo Módulo Neuro — `src/screens/Neuro.jsx`
- Persistência: `neuro_data_[studentId]` (localStorage)
- Abas: Anamnese (📋), Avaliação (🔬), Evolução (📈), Evidências (🔬)
- Conteúdo: diagnóstico neurológico, tempo/mecanismo da lesão, lado afetado, sintomas neurológicos, exame neurológico (tônus, força muscular MRC 0-5 para 6 grupos bilaterais, sensibilidade, coordenação, marcha, reflexos)
- Escalas embutidas:
  - **MAS (Ashworth Modificada)**: 6 itens (flexores cotovelo D/E, extensores joelho D/E, flexores plantares D/E), total 0-24
  - **BBS (Berg Balance Scale) simplificada**: 5 itens, total 0-20, classificação de risco de queda
  - **MIF (Medida de Independência Funcional) simplificada**: 6 itens (alimentação, higiene, banho, vestir superior/inferior, uso banheiro), total 0-42
- Cor: C.purple (#A78BFA)
- Evidências neurológicas: avc, lesao_medular, parkinson, esclerose_multipla, tce, elau, ataxia

### Registro no App.jsx
- LoginScreen: 3 novas profissões (pediatria, crossfit, neurofuncional)
- ModuleSelector: 3 novos cards de módulo
- handleLogin: mapeamento prof → module key
- Routing condicional: 3 novos blocos `if (module === "pediatria"/"crossfit"/"neuro")`
- Import statements para os 3 novos screens

### Arquivo de Memória Arquitetural
- `.sasyra-context.md` na raiz do projeto contém o escopo completo do sistema e próximos passos.
