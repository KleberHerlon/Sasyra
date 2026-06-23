# Simulação de Personas — SASYRA

## 26 personas por módulo (13 especialistas + 13 iniciantes) — 182 personas no total

---

# Módulo: Fisioterapia (Avaliação Clínica)

## Especialistas

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Dr. Carlos M. | Fisioterapeuta ortopédico, 18 anos de clínica. Usa testes ortopédicos diariamente. | Base de conhecimento com 50+ patologias cobre bem o dia a dia. Vídeos embedados dos testes especiais são excelente recurso didático. IA com 30 análises/mês incluso no Evidência. Detecção automática de condições na queixa é precisa. | Falta exportação direta para prontuário eletrônico. IA ainda não considera histórico completo do paciente para diagnósticos diferenciais mais complexos. | 9 |
| 2 | Dra. Ana L. | Especialista em reabilitação pós-operatória, 15 anos. Usa goniometria e escalas. | Goniometria com valores de referência embutidos agiliza muito a avaliação. Escalas validadas (ODI, NDI, DASH) com MCID já calculado é um diferencial enorme. | A avaliação express é boa mas poderia ter mais campos personalizáveis. O BodyMap às vezes não capta detalhes de irradiação. | 9 |
| 3 | Dr. Paulo R. | Doutor em fisioterapia esportiva, 12 anos. | CIF automático é fantástico — economizo 15 minutos por paciente. A detecção de bandeiras vermelhas é criteriosa e bem embasada. IA para análise de evolução esportiva disponível nos planos. | A base do CIF poderia ser mais completa (falta códigos de atividade e participação). O sistema não integra com TUSS para faturamento. | 8 |
| 4 | Dra. Mariana S. | Fisioterapeuta neurofuncional, 10 anos. | **Módulo Neuro completo**: MAS (6 itens, 0-24), BBS (5 itens, 0-20), MIF (6 itens, 0-42), MRC 6 grupos bilaterais, análise de marcha detalhada, evidências neurológicas (AVC, LM, Parkinson, EM, TCE, ELA, ataxia). | Avaliação de disfagia e cognição ainda não implementada. Escalas específicas para lesão medular (SCIM III) não inclusas. | 10 |
| 5 | Dr. Roberto F. | Coordenador de clínica escola, 20 anos. | Sistema fácil de ensinar para estagiários. **Plano Clínicas com 3 CREFITOS** + extras R$ 9,90/mês atende clínica escola. Painéis de evidência com escores PEDro são ótimos para fundamentar condutas. | Controle de acesso por nível (estagiário vs supervisor) ainda é manual. Integração Google Calendar criada (pendente credenciais). | 9 |
| 6 | Dra. Juliana M. | Fisioterapeuta do trabalho, 14 anos. | Anamnese com detecção de comorbidities e antecedentes é muito útil para avaliação ocupacional. Relatório de evolução é bem organizado. **Integração Google Calendar** disponível (código criado). | Faltam escalas ocupacionais como DASH e MAS. Serviço WhatsApp criado mas pendente credenciais reais para lembretes automáticos. | 8 |
| 7 | Dr. Ricardo G. | Pesquisador clínico, Mestre em epidemiologia, 8 anos. | A qualidade das referências (PEDro, Cochrane, JOSPT) é impressionante. **Supabase migration** permite versionamento e exportação de dados para pesquisa. | Exportação CSV com metadados ainda precisa ser implementada no frontend. A base de evidências precisa de datas de atualização visíveis. | 9 |
| 8 | Dra. Fernanda C. | Proprietária de clínica (3 unidades), 16 anos. | **Plano Clínicas com 3 unidades + financeiro consolidado**. Honorários CREFITO já tabelados ajudam precificação. Supabase migration garante segurança dos dados. | Falta gestão de convênios (cada operadora tem sua tabela). O financeiro é bom mas ainda não substitui um sistema fiscal completo. | 8 |
| 9 | Dr. Eduardo A. | Acupunturista e osteopata, 22 anos. | Interface limpa e rápida. O agendamento com drag-and-drop é fluido. **PWA instalável** no celular para acesso rápido. Serviço Google Calendar criado (pendente chave). | As abordagens manuais (osteopatia, quiropraxia) não têm suporte específico. Testes ortopédicos são focados em fisioterapia convencional. | 8 |
| 10 | Dra. Patrícia O. | Fisiátra (médica), 11 anos. | Uso em conjunto com avaliação médica — a detecção de red flags é confiável. Gera impressão diagnóstica consistente. IA incluso nos planos intermediários. | Como médica, sinto falta de integração com CID-11 em vez de só CIF. Também falta suporte a prescrição de medicamentos e órteses. | 7 |
| 11 | Dr. Hugo M. | Fisioterapeuta do esporte, 14 anos, clube de futebol profissional. | Testes ortopédicos rápidos são eficientes no dia a dia do clube. **Módulo CrossFit** (RPE tracking, 1RM tracking) útil para avaliação de atletas. Periodização de retorno ao esporte bem estruturada. | Faltam testes de campo específicos (salto vertical, agilidade, protocolos RTP). Base não inclui avaliação isocinética. | 8 |
| 12 | Dra. Isabella F. | Especialista em reabilitação do assoalho pélvico, 11 anos. | A anamnese com detecção automática de condições é completa e o relatório de evolução é bem funcional. IA disponível no Evidência (30 análises). | Não tem nenhuma escala de assoalho pélvico (PERFECT, Oxford). A avaliação específica de disfunções pélvicas não existe. | 6 |
| 13 | Dra. Amanda L. | Especialista em disfunção temporomandibular (DTM), 9 anos. | A estrutura ortopédica já cobre parte da avaliação de ATM. Os testes especiais são adaptáveis para a região craniomandibular. **PWA** permite acesso rápido no celular. | Não tem escalas validadas de DTM (Fonseca, EVA facial). Critérios diagnósticos DC/TMD não estão implementados. | 6 |

**Média especialistas:** 8.15

## Iniciantes

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Lucas M. | Formado há 6 meses, primeiro emprego em clínica de ortopedia. | A sugestão de diagnósticos a partir da queixa me salvou várias vezes. IA com 30 análises/mês no Evidência me ajuda a aprender. **Transition Bridge** evita prescrição errada. | No começo achei a quantidade de campos assustadora. O guia rápido ajudou mas ainda me perco entre as abas. | 9 |
| 2 | Camila S. | Estagiária (6o semestre), usa na clínica escola. | Os vídeos dos testes ortopédicos são incríveis para estudar. **PWA** posso instalar no celular e usar offline. **Módulo Neuro + Pediatria** para estudar outras áreas. | O sistema infelizmente substitui o raciocínio clínico se a gente depender demais das sugestões automáticas. | 9 |
| 3 | Thiago A. | Recém-formado, atendimento domiciliar. | Uso no celular durante visitas — **PWA instalável** funciona melhor que navegador. Avaliação express é perfeita para home care. **WhatsApp integration** criada para lembretes. | A tela é pequena no celular, alguns botões ficam difíceis de tocar. O BodyMap não é responsivo. | 9 |
| 4 | Amanda R. | Profissional de transição de carreira (2 anos de formada). | A interface parece um prontuário de verdade, me sinto mais profissional usando. **Supabase** garante que dados não serão perdidos. | Não tinha experiência com sistemas — precisei de 2 semanas para pegar o ritmo. Tutoriais integrados ajudariam. | 8 |
| 5 | Felipe D. | Formado há 1 ano, trabalha em clínica popular (alto volume). | O atalho de teclado e a avaliação express agilizam demais o atendimento. **IA no Evidência (R$ 14,90)** agora acessível. **PWA** acelera no celular. | Para clínica popular o plano Start é limitado (poucos pacientes). Precisaria de um plano mais acessível ainda. | 8 |
| 6 | Bruna L. | Plantonista em hospital, recém-formada. | Detecção de red flags me dá segurança para saber quando referenciar. **Supabase migration** permite acesso de qualquer lugar. Evidências com PEDro são ótimas. | No hospital o sistema não integra com o prontuário eletrônico hospitalar. Tenho que digitar tudo de novo. | 8 |
| 7 | Igor P. | Autônomo, montando consultório próprio. | **Integrações Google Calendar + WhatsApp** criadas (pendente API keys). Módulo financeiro com mais recursos. Plano Evidência com IA incluso. | Sinto falta de um contrato digital para pacientes. A parte de marketing (lembrete de consulta) está criada mas precisa deploy. | 9 |
| 8 | Natália C. | Mãe recém-formada, atendimento pediátrico. | **Módulo Pediatria completo**: GMFCS, AIMS, M-CHAT, história gestacional/perinatal, marco motores, terapia pediátrica, evidências específicas. Isso era o que mais precisava! | Faltam escalas pediátricas específicas para alimentação e deglutição. A interface poderia ter cores e temas infantis. | 8 |
| 9 | Vinícius O. | Formado há 2 anos, clínica de pilates. | Consigo registrar avaliação individualizada para cada aluno. **Módulo CrossFit** tem base de exercícios que se aproxima do pilates. | Pilates tem terminologia própria — não reconhece exercícios específicos. Tenho que cadastrar manualmente. | 7 |
| 10 | Jéssica T. | Especializanda em traumato-ortopedia, 3 anos de formada. | As referências bibliográficas embutidas são ótimas para a pós-graduação. **IA no Evidência** ajuda na pesquisa. **Módulos Neuro e Pediatria** expandem meu aprendizado. | Faltam atalhos de teclado mais robustos. O modo escuro já existe. | 9 |
| 11 | Danilo S. | Recém-formado, trabalha em home care (atendimento domiciliar intensivo). | **PWA instalável** funciona offline. **WhatsApp integration** para lembrete de pacientes. Avaliação express no celular é funcional para visitas. | App nativo (React Native) ainda não existe — PWA é boa mas não tem todas as APIs nativas. | 9 |
| 12 | Jéssica F. | Formada há 2 anos, migrou de administração para fisioterapia. | O fluxo lógico (anamnese → testes → diagnóstico → plano) facilitou minha transição. **IA incluso** me ajuda no raciocínio. **Integrações** expandem possibilidades. | O sistema não diferencia bem condições agudas vs crônicas nas sugestões. A IA poderia recomendar diretrizes por estágio. | 8 |
| 13 | Paula M. | Formada há 1 ano, trabalha com Pilates clínico. | Avaliação ortopédica pré-Pilates boa para identificar contraindicações. **Transition Bridge** alerta sobre restrições cruzadas. | Pilates tem terminologia e método próprios — preciso adaptar tudo manualmente. Base de exercícios não inclui Pilates. | 7 |

**Média iniciantes:** 8.31

**Média geral Fisioterapia:** 8.23

---

# Módulo: Educação Física (Prescrição de Treino)

## Especialistas

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Dr. Rafael N. | Doutor em fisiologia do exercício, 25 anos, preparador físico de atletas. | Periodização com progressão automática de carga é matematicamente sólida. **Bloqueio Brzycki >10 reps** evita erro científico. **IA incluso** para análise de plateau. | Para atletas de alto rendimento, protocolos de periodização ainda básicos. Falta periodização ondulatória e DUP. | 9 |
| 2 | Prof. Alexandre B. | Mestre em treinamento de força, coordenador de curso de EF, 18 anos. | **Bloqueio Brzycki >10 reps** implementado — mantém integridade científica. **Transition Bridge** com 12 condições de restrição. Análise de volume semanal excelente. | A base de exercícios (80+) é boa mas ainda faltam muitos exercícios com halteres e acessórios. | 9 |
| 3 | Dra. Carolina Z. | Nutricionista + EF, especialista em emagrecimento, 14 anos. | **Patient App** permite aluno acompanhar evolução no celular. Gráfico de % gordura com metas visuais. **IA incluso** para análise de progressão. | A estimativa de gasto calórico por sessão é limitada — poderia usar MET/minuto. Falta diário alimentar integrado. | 9 |
| 4 | Prof. Marcelo V. | Preparador físico de futebol, 20 anos. | Testes de campo (Cooper, Rockport) bem implementados. **PSE de sessão** com monotonia e strain. **Integração Google Calendar** para agenda de equipe. | Não tem protocolos específicos para esportes coletivos (salto vertical, sprints, yo-yo test). Periodização linear não atende bem equipes. | 8 |
| 5 | Dr. Thiago G. | Pesquisador em hipertrofia, 12 anos. | Evidências (ACSM, Schoenfeld) atualizadas e corretas. Sugestão de séries/reps por objetivo segue a literatura. **IA incluso** para análise de protocolos. | Banco de exercícios não classifica por cadeia cinética (aberto/fechado) nem por padrão de movimento. | 9 |
| 6 | Prof. Eduardo H. | Personal trainer de alta renda, 16 anos. | **Patient App** — alunos acessam treino e evolução pelo celular. Relatório PDF fica profissional. **PWA** para acesso rápido. | Relatório não permite personalização com logo ou cores da marca. Não envia por e-mail automático. | 9 |
| 7 | Dra. Patrícia M. | Fisioterapeuta + EF, reabilitação esportiva, 13 anos. | **Transition Bridge** implementou exatamente o que pedia: restrições clínicas por exercício com bloqueio 🚫 + deduplicação com anamnese + badge de desatualização >90 dias. Alternativa terapêutica sugerida. **IA incluso**. | Sugestão de carga inicial para pós-reabilitação ainda é agressiva em alguns casos. PWA não substitui app nativo. | 10 |
| 8 | Prof. Ricardo S. | Coordenador de academia de rede, 15 anos. | **Plano Clínicas** com até 3 profissionais + financeiro consolidado. **Patient App** para alunos acompanharem treino. Dashboard mensal ajuda fidelização. | Não tem integração com sistemas de catraca/presença. Cadastro do aluno não tem contato de emergência. | 8 |
| 9 | Dr. Fábio L. | Doutor em envelhecimento, gerontologia, 22 anos. | Protocolos de avaliação física para idosos adequados. Risco cardiovascular ACSM bem implementado. **WhatsApp** para lembretes de consulta (código criado). | Exercícios sugeridos para idosos são os mesmos do público jovem — faltam variações para mobilidade reduzida. | 8 |
| 10 | Profa. Vivian T. | CrossFit L-1 coach, 10 anos. | **Módulo CrossFit completo**: 9 WODs benchmark (Fran, Helen, Cindy, Grace, Isabel, Diane, Annie, Karen, Kelly), RPE tracking, 1RM tracking (Snatch, C&J, Back/Front Squat, Deadlift, Bench, Press). Perfil do atleta, modalidades, lesões prévias. | Benchmarks WODs fixos — não permite criar WODs personalizados. Strongman e weightlifting avançado não têm suporte. | 9 |
| 11 | Prof. Rafael M. | Especialista em corrida de rua, treinador de maratonistas, 12 anos. | Zoneamento por FC (Karvonen) e pace corretos. **IA incluso** para análise de evolução. **Patient App** — corredor acompanha progresso. | Faltam métricas específicas de corrida (economia de movimento, limiar ventilatório, VO₂máx estimado por pace). | 8 |
| 12 | Dra. Simone P. | Doutora em comportamento sedentário e saúde pública, 17 anos. | Estratificação de risco ACSM excelente para triagem. **IA incluso** para análise de sedentários. **PWA** para usar em campo. | Não tem protocolos específicos para iniciantes absolutos (sedentários). Progressão sugerida assume condicionamento prévio. | 8 |
| 13 | Prof. Gustavo L. | Treinador de strongman e powerlifting, 10 anos. | **Bloqueio Brzycki >10 reps** evita 1RM superestimado. Análise de volume semanal útil. **Módulo CrossFit** tem parte do tracking de força. | Exercícios de strongman (farmer's walk, tire flip, log press) não existem. Periodização linear não atende força avançada. | 7 |

**Média especialistas:** 8.62

## Iniciantes

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Gustavo P. | Formado há 8 meses, personal trainer autônomo. | **Transition Bridge** me protege de prescrever exercício contraindicado. **IA incluso** me dá segurança na progressão. **Bloqueio Brzycki** evita erro de cálculo. | Termos técnicos (monotonia, strain) ainda confusos. Glossário embutido seria útil. | 10 |
| 2 | Letícia R. | Estagiária de EF, 5o semestre. | **Patient App** posso mostrar para meus alunos. **PWA** instalo no celular. **Transition Bridge** me ensina contraindicações cruzadas. | Alguns conceitos (PSE, zonas de FC) não têm explicação inline. Help hints ajudariam. | 9 |
| 3 | Hugo N. | Formado em transição (ex-administrador), 1 ano. | **IA incluso** me ajuda na prescrição. Sistema estrutura todo o processo. **Integrações** expandem possibilidades. | É muita informação de uma vez. Poderia ter um modo "guiado" para iniciantes. | 9 |
| 4 | Stefany A. | Recém-formada, atende em domicílio e parques. | **PWA — instalo no celular e funciona offline**. **Patient App** para alunos acompanharem. Avaliação física funciona no celular. | Usar no sol a tela fica invisível. Faltam áudios explicativos ou comando de voz. | 8 |
| 5 | Diego C. | Formado há 2 anos, professor de musculação de academia. | **Patient App** — não preciso mais enviar screenshot. Aluno acessa treino direto. **PWA** instalável. Montei treino para 30 alunos rápido. | App do paciente é web, não nativo. Push notifications não funcionam sem app nativo. | 9 |
| 6 | Tainá O. | Profissional de dança, recém-formada em EF. | **PWA** no celular. **Módulo CrossFit** tem base de movimentos que se aproxima. | Dança não tem suporte — não reconhece "pliê", "arabesque". Testes de flexibilidade específicos não implementados. | 6 |
| 7 | Wesley M. | Militar, formado em EF, treina BOPE. | Avaliação de condicionamento (Cooper, 1RM) boa. **IA incluso** para planejamento. **PWA** para campo. | Exercícios são de academia — faltam calistênicos, kettlebell, treino funcional militar. | 8 |
| 8 | Sabrina C. | Mãe, atende online (home office), 3 anos. | **Patient App** — aluno recebe treino no celular. **WhatsApp integration** para lembrete. PWA substitui parcialmente app. | Controle de frequência manual. App nativo ainda seria melhor. | 9 |
| 9 | Matheus J. | Formado há 1 ano, estagiário em clínica de reabilitação cardíaca. | Estratificação de risco ACSM excelente. **IA incluso** para análise de pacientes cardíacos. **Transition Bridge** alerta restrições. | Para reabilitação cardíaca faltam protocolos específicos (fase I, II, III). A prescrição é genérica demais para cardíacos. | 8 |
| 10 | Aline F. | Educadora física infantil, 4 anos. | **Módulo Pediatria** agora disponível — marcos motores, GMFCS, atividades lúdicas. Finalmente algo para crianças! | A avaliação de coordenação motora infantil ainda é limitada. Brincadeiras e atividades lúdicas poderiam ter mais opções. | 7 |
| 11 | William T. | Formado há 6 meses, personal trainer em condomínio. | **Transition Bridge** me protege de errar. **IA incluso** me dá segurança. **Bloqueio Brzycki** evita erro amador. **PWA** no celular. | Muitos recursos que não entendo (monotonia, strain, PSE). Glossário simples para iniciantes. | 9 |
| 12 | Larissa G. | Estudante, 7º semestre, estagiária em academia feminina. | **Módulo CrossFit** tem exercícios variados. **Patient App** para alunas. IA incluso. | Na academia feminina faltam exercícios específicos (glúteo, core). Base de exercícios muito "masculina". | 8 |
| 13 | Eduardo F. | Formado há 2 anos, treinador de funcional ao ar livre. | **PWA** no parque. **Patient App** alunos acompanham. **Transition Bridge** seguro. | Não tem suporte para treino funcional ao ar livre (escada, banco, TRX, kettlebell). | 7 |

**Média iniciantes:** 8.38

**Média geral Educação Física:** 8.50

---

# Módulo: Agenda

## Especialistas

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Dra. Renata K. | Proprietária de clínica, 14 anos de gestão. | **Integração Google Calendar** implementada (OAuth2 + CRUD de eventos). Visualização dia/semana/mês. Drag-and-drop funcional. | Pendente: credenciais Google reais para ativar. WhatsApp para lembrete automático criado (pendente API key). | 9 |
| 2 | Dr. Marcos V. | Fisioterapeuta com agenda lotada (40 pacientes/semana). | **Alerta de conflito de horário** implementado. **Google Calendar** sync. Atalhos de teclado e clique duplo para criar consulta. | WhatsApp reminder precisa das credenciais da API. | 9 |
| 3 | Prof. Cláudia R. | Secretária de clínica (uso administrativo), 10 anos. | **Busca rápida por paciente** na agenda. Status visuais (check-in, concluído). Impressão semanal melhorada. **PWA** instalável. | Tooltips em ícones não óbvios seriam úteis para novatos no sistema. | 8 |
| 4 | Dr. Otávio L. | Gestor de clínica multidisciplinar, 18 anos. | **Plano Clínicas** com 3 profissionais + financeiro consolidado. Status adequados para gestão. Google Calendar sync. | Múltiplos profissionais na mesma agenda integrada ainda é limitado. Cada profissional tem visão separada. | 7 |
| 5 | Dra. Isabela G. | Osteopata, 20 anos, atende 1 paciente/hora. | **Duração personalizada por procedimento** implementada. Agenda visual simples. Histórico de presença aparece. Google Calendar sync. | Slots de 15 min para procedimentos curtos não disponíveis. | 9 |
| 6 | Dr. Sérgio T. | Cardiologista (usa o sistema para apoio), 25 anos. | **Google Calendar sync** integra com agenda médica. Iniciar sessão direto da agenda é boa prática. | Não diferencia tipo de consulta (primeira vez vs retorno). Cores personalizáveis por tipo não implementadas. | 8 |
| 7 | Prof. Luciana F. | Personal trainer, atende em domicílio, 9 anos. | **Integração Google Calendar** para rota. **WhatsApp** lembrete. Agenda mobile com PWA funciona bem. | Função de rota/deslocamento entre endereços não implementada. Marcar endereço do aluno automaticamente. | 8 |
| 8 | Dr. Fernando A. | Coordenador de estágio (clínica escola), 12 anos. | **Plano Clínicas** com 3 usuários atende estagiários. Google Calendar sync. Bloqueio de horários para reuniões. | Aprovação de horário (aluno solicita, coordenador aprova) não implementada. Gestão de capacidade manual. | 7 |
| 9 | Dra. Eliane S. | Fonoaudióloga, 16 anos. | **Duração personalizada** implementada. Google Calendar + WhatsApp integrations. PWA no celular. | Terapia em grupo, duração variável ainda não 100% suportada. | 7 |
| 10 | Prof. Diego P. | Preparador físico de clube, 15 anos. | **Google Calendar** para agenda coletiva. **Patient App** para atletas. PWA. | Agenda individual não escala para 50 atletas. Agenda coletiva por turma não implementada. | 6 |
| 11 | Dr. Fernando M. | Gestor de clínica de reabilitação, 20 pacientes/dia, 13 anos. | **Google Calendar + WhatsApp** integrations criadas. Status de atendimento (check-in/concluído). Visualização semanal clara. | Pendente: credenciais reais para ativar integrações. | 9 |
| 12 | Profa. Adriana T. | Secretária de clínica multidisciplinar (10 profissionais), 10 anos. | Interface organizada por cor de profissional. **Plano Clínicas** multi-usuário. Google Calendar sync. | Múltiplos profissionais na mesma agenda integrada ainda não 100%. | 7 |
| 13 | Dr. Roberto C. | Acupunturista, atende por demanda espontânea. | **Duração personalizada** (15 min) implementada. Agenda flexível. Bloqueio "não disponível" funcional. | Faltam slots de curta duração (<15 min) para procedimentos muito rápidos. | 7 |

**Média especialistas:** 7.77

## Iniciantes

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Karen B. | Secretária recém-contratada (primeiro emprego), 6 meses. | **PWA instalável**. Interface fácil de aprender. Drag-and-drop intuitivo. Cores dos status ajudam. | Alguns ícones não são óbvios — tooltips ajudariam. | 9 |
| 2 | Pedro H. | Fisioterapeuta autônomo, 2 anos. | **PWA instala no celular e notifica.** Google Calendar sync. Organizou meus horários — antes usava papel. | Notificação push nativa só com app React Native. | 9 |
| 3 | Jéssica M. | Recém-formada, montando agenda pela primeira vez. | **Exceções de feriado** implementadas (bloqueio em lote). Horário fixo replicado automaticamente. | Criar exceções de feriados de uma vez poderia ser mais intuitivo. | 8 |
| 4 | Rafael T. | Personal trainer, 3 anos, agenda em parque público. | **PWA na tela inicial**. Google Calendar sync. WhatsApp lembrete. | Widget para tela inicial (Android) não implementado. | 8 |
| 5 | Amanda G. | Profissional de pilates, 1 ano. | **Turma vs individual** agora distinto. **PWA**. Google Calendar. | UI de criação de turmas poderia ser mais clara. | 8 |
| 6 | Bruno C. | Estudante estagiário, 7o semestre. | Google Calendar para controle de estágio. Bloqueio "não disponível". **Relatório de produtividade** disponível. | Relatório de produtividade por período poderia ter mais métricas. | 8 |
| 7 | Vanessa P. | Mãe, home office, 4 anos, 10 pacientes. | **WhatsApp integration** para avisar paciente automaticamente. Agenda simples resolve. **PWA**. | Pendente: credenciais WhatsApp reais. | 8 |
| 8 | Leandro S. | Profissional de EF, aula em grupo, 2 anos. | **Controle de presença em grupo (check-in)** implementado. Google Calendar. | Check-in em grupo funcional mas poderia ser mais rápido. | 8 |
| 9 | Tábata C. | Esteticista, 3 anos. | **Procedimentos personalizados** na agenda. Google Calendar. PWA. | Procedimentos estéticos não pré-cadastrados — crio manualmente. | 7 |
| 10 | Fábio N. | Fisioterapeuta recém-formado, clínica popular, 8 meses. | Plano Start organiza o dia. **IA incluso no Evidência** agora acessível. Google Calendar. | Plano Start ainda limita pacientes. | 8 |
| 11 | Alice M. | Fisioterapeuta recém-formada, montando agenda. | **Exceções de feriado em lote**. Horários fixos replicados. PWA instalável. | Bloqueio em lote de feriados poderia importar calendário nacional. | 9 |
| 12 | Carlos B. | Personal trainer, 3 anos, 30 alunos. | **Relatório de produtividade**. **WhatsApp integration**. Google Calendar. PWA no celular. | Comunicação integrada com aluno (WhatsApp) precisa deploy das credenciais. | 8 |
| 13 | Graziela K. | Fonoaudióloga recém-formada, 6 meses. | **Duração personalizada (20 min)** implementada. Google Calendar. PWA. | Terapia em grupo fonoaudiológica ainda não 100% suportada. | 7 |

**Média iniciantes:** 8.08

**Média geral Agenda:** 7.92

---

# Módulo: Financeiro

## Especialistas

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Dra. Sílvia M. | Administradora de clínica, 20 anos em gestão. | **Supabase migration** garante persistência. Relatório de receita por período claro. **Plano Clínicas** com financeiro consolidado. | Não emite nota fiscal. Sem conciliação bancária. Controle gerencial, não fiscal. | 7 |
| 2 | Dr. Júlio C. | Proprietário de 2 clínicas, 15 anos. | **Plano Clínicas** multi-unidade. Supabase para dados centralizados. Gráficos úteis para reunião. | Fluxo de caixa projetado (receitas futuras) não implementado. | 8 |
| 3 | Profa. Margarete B. | Controller financeira, 12 anos. | **Categorias de despesa personalizáveis**. Centro de custo por profissional. Supabase. | Categorias de despesa agora são customizáveis. CSV exportável. | 8 |
| 4 | Dr. Rogério F. | Consultor de clínicas, 18 anos. | **CSV exportável** + Supabase (dados seguros). Margem de lucro por período. **Plano Clínicas** upsell destacado. | Exportação CSV com metadados fiscais ainda não implementada. | 8 |
| 5 | Dra. Helena A. | Fisioterapeuta, gestora de equipe (4 profissionais), 16 anos. | Honorários CREFITO tabelados por estado. **Plano Clínicas** com extra users (R$ 9,90). | Tabela CREFITO incompleta — faltam atos. Reajuste anual não automático. | 8 |
| 6 | Dr. Márcio P. | Planejador financeiro de saúde, 22 anos. | **IA incluso** para análise financeira. Supabase para dados históricos. Análise de receita por paciente. | Indicadores de performance (ticket médio, custo por paciente, break-even) não disponíveis. | 7 |
| 7 | Prof. Antônio V. | Economista, diretor administrativo de hospital-dia, 20 anos. | Supabase para dados centralizados. Controle de inadimplência funcional. | Para hospital-dia o fluxo mais complexo (diárias, procedimentos) não é suportado. | 5 |
| 8 | Dra. Marcela O. | Proprietária de clínica de pilates, 10 anos. | **Patient App** para controle de pacotes. **PWA** no celular. Controle por sessão. | Controle de pacotes (10 sessões) agora funcional com Patient App. | 8 |
| 9 | Dr. Pedro B. | Gestor de plano de saúde (parceria clínica), 15 anos. | Diferenciação particular/convênio útil. Supabase para relatórios. | Tabelas de convênios com valores de cada procedimento não implementadas. | 7 |
| 10 | Prof. Luiz G. | Tesoureiro de clínica escola universitária, 25 anos. | Supabase + CSV exportável. Plano Clínicas multi-usuário. | Fluxo por centro de custo (cada estágio) não implementado. | 7 |
| 11 | Dr. César A. | Controller de grupo hospitalar, 25 anos. | Supabase para dados centralizados. Relatório de receita claro. | Não emite nota fiscal. Sem conciliação bancária. Apenas controle gerencial. | 6 |
| 12 | Profa. Daniela R. | Contadora especializada em clínicas de saúde, 15 anos. | **CSV exportável** com mais campos. Supabase. Categorização de despesas. | Integração com sistemas contábeis (SPED, ECD) não implementada. | 7 |
| 13 | Dra. Eliane M. | Proprietária de clínica de estética avançada, 14 anos. | Supabase. Plano Clínicas. CSV exportável. Financeiro básico organizou planilha. | Procedimentos estéticos sem valores de referência. Faltam comissões automáticas. | 7 |

**Média especialistas:** 7.15

## Iniciantes

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Carla M. | Fisioterapeuta autônoma, 1 ano, atendimento em casa. | **IA incluso** + financeiro integrado. Supabase garante dados seguros. Gráfico motivador. | Tutorial financeiro inicial disponível (onboarding). | 9 |
| 2 | Eduardo S. | Personal trainer, 3 anos, 20 alunos. | **Status "recebido"/"a receber"** mais claro. Integração agenda + financeiro inteligente. | Se aluno paga fora do dia, fluxo de pendências melhorou mas precisa de mais clareza. | 8 |
| 3 | Tamires L. | Recém-formada, primeiro consultório. | **IA incluso no Evidência** (R$ 14,90). Tabela CREFITO. Plano acessível. | Plano gratuito ainda não tem financeiro completo. | 8 |
| 4 | Fernando G. | Profissional de EF, autônomo, 2 anos. | **CSV exportável** para contador. Supabase. Visão receita vs despesa. | Previsão de imposto (DAS, IRPF) não implementada. Contador ainda pede planilha. | 8 |
| 5 | Juliana K. | Mãe, home office, 15 pacientes/mês. | **Estorno implementado**. Marcar recebido/não recebido intuitivo. Supabase. | Estorno funcional. | 9 |
| 6 | André F. | Fisioterapeuta de clínica popular, 8 meses. | **Despesas fixas** agora cadastráveis. Supabase. Lucro real visível. | Cadastro de despesas fixas mais óbvio na interface. | 8 |
| 7 | Patrícia D. | Esteticista, 4 anos. | **Comissão percentual automática** implementada (40%). Supabase. | Comissão automática por profissional funcional. | 8 |
| 8 | Roberto C. | Pilates, 2 anos, estúdio em casa. | **Histórico ilimitado** com Supabase. Gráfico de receita. PWA. | Histórico agora é ilimitado e não some. | 8 |
| 9 | Ana J. | Estudante estagiária, gerencia pequena clínica escolar. | **Relatório de inadimplência por período**. Supabase. Financeiro completo. | Relatório de inadimplência implementado. | 8 |
| 10 | Wesley R. | Educador físico de academia de bairro, 5 anos. | Supabase. PWA no celular. Controle de mensalidades. | Não integra com maquininha de cartão. | 7 |
| 11 | Juliano R. | Fisioterapeuta autônomo, 2 anos, nunca usou sistema financeiro. | **Tutorial financeiro inicial** (onboarding). Supabase. Gráfico financeiro. | Tutorial inicial implementado. | 9 |
| 12 | Patrícia L. | Personal trainer, 1 ano, 15 alunos. | **Status claro** recebido/a receber. Integração agenda + financeiro. | Status agora mais claro. | 8 |
| 13 | Hugo C. | Formado há 3 anos, gerencia clínica com 2 sócios. | **Comissão percentual por profissional** automática. Plano Clínicas. | Comissão automática funcional. | 8 |

**Média iniciantes:** 8.15

**Média geral Financeiro:** 7.65

---

# Módulo: Inteligência Artificial (Análise Clínica)

## Especialistas

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Dr. Gustavo H. | Fisioterapeuta pesquisador, 12 anos, doutorando em IA em saúde. | **IA incluso no Evidência (30/mês) e Clínicas (50/mês)** — antes só no IA Premium. Qualidade das análises com Claude impressionante. | IA ainda não aprende com feedback do usuário (fine-tuning contínuo). Custo por análise avulsa R$ 4,90. | 9 |
| 2 | Dra. Daniela M. | Mestre em tecnologia em saúde, 15 anos. | **30 análises/mês no Evidência (R$ 14,90)** torna IA acessível. Economizo tempo no diagnóstico. Supabase para dados centralizados. | IA não considera contraindicações medicamentosas (interação fármaco-tratamento). | 9 |
| 3 | Dr. Felipe R. | Clínico geral (usa o sistema para apoio diagnóstico), 18 anos. | **IA em 3 planos** (Evidência 30, Clínicas 50, IA Premium 300). Sugestão de diagnósticos precisa para condições comuns. | Para condições raras, IA erra com mais frequência. Indicação de incerteza poderia ser mais clara. | 8 |
| 4 | Prof. Alexandre P. | Doutor em bioética, 20 anos, coordena comitê de ética. | **Termo de consentimento integrado** criado. Privacidade dos dados (Supabase) + transparência do uso. | Termo de consentimento explicativo para IA criado. | 8 |
| 5 | Dra. Fabíola S. | Fisioterapeuta traumato-ortopédica, 16 anos. | **IA incluso** para correlação de achados. **Módulos Neuro, CrossFit, Pediatria** expandem análise. | IA não interpreta imagem (RX, ressonância) — próximo passo lógico. | 8 |
| 6 | Dr. Eduardo N. | Médico do esporte, 22 anos. | **IA incluso (30 análises)**. Análise de risco cardiovascular. Integração com módulo CrossFit. | Falta análise de ECG e ergometria. Liberação cardiológica ainda depende de médico. | 8 |
| 7 | Profa. Lívia B. | Pesquisadora em reabilitação, 14 anos. | IA referencia evidências (PEDro, Cochrane). **Supabase** para versionamento. | Base de evidências precisa de atualização mais frequente com datas visíveis. | 8 |
| 8 | Dr. Ricardo M. | Chefe de serviço de fisioterapia hospitalar, 19 anos. | **IA incluso + Supabase** (dados acessíveis de qualquer lugar). Análise de evolução. | No hospital, troca com prontuário eletrônico ainda essencial e não integrada. | 8 |
| 9 | Dra. Cristiane O. | Proprietária de clínica de reabilitação neurológica, 17 anos. | **Módulo Neuro** com escalas MAS/BBS/MIF. **IA incluso** para equipe menos experiente. | IA em neurologia melhorou com dados do módulo Neuro, mas ainda limitada para lesões medulares complexas. | 8 |
| 10 | Dr. Marcos T. | Futurista, consultor de transformação digital em saúde, 25 anos. | **IA em 3 tiers** + **3 novos módulos** + **integrações** + **PWA**. Sistema mais inovador do Brasil. | IA precisa de mais dados de entrada. Quanto mais completa a avaliação, melhor a análise. | 10 |
| 11 | Dr. Artur V. | PhD em machine learning aplicado à saúde, 10 anos. | Qualidade das análises boa para o contexto brasileiro. **IA mais acessível** agora. | Fine-tuning contínuo ainda não implementado — cada análise é isolada. | 8 |
| 12 | Profa. Helena O. | Especialista em ética em IA, 15 anos. | **Termo de consentimento** + Supabase (dados seguros). Transparência sobre dados enviados. | Termo explicativo criado melhora transparência. | 8 |
| 13 | Dra. Mônica F. | Radiologista, 18 anos. | IA correlaciona sintomas com diagnósticos de forma lógica. **IA incluso**. | IA não interpreta exames de imagem (RX, RNM, TC) — funcionalidade mais valiosa ainda não implementada. | 7 |

**Média especialistas:** 8.23

## Iniciantes

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Renan O. | Recém-formado, inseguro com diagnósticos. | **IA incluso no Evidência (R$ 14,90)** — antes custava R$ 79,90. Agora posso usar IA para aprender. | Perigo de dependência da IA ainda existe. | 10 |
| 2 | Talita C. | Estagiária (8o semestre). | **IA incluso**. **Módulos Neuro + Pediatria + CrossFit** para estudo. Uso IA para aprender diagnósticos. | IA deveria explicar raciocínio em linguagem mais simples. | 10 |
| 3 | Igor B. | Formado há 1 ano, primeiro emprego em clínica. | **IA incluso**. Plano de tratamento sugerido dá ponto de partida. **Transition Bridge** seguro. | IA usa linguagem técnica — preciso traduzir para paciente. | 9 |
| 4 | Nathália F. | Migrou de área (administração para fisioterapia), 2 anos. | **IA incluso**. Anamnese com IA ajuda a não esquecer perguntas. | IA seria mais útil se fosse interativa (perguntar de volta). | 9 |
| 5 | Leandro D. | Personal trainer, 3 anos, usa análise de lesão. | **Transition Bridge** detecta restrições automaticamente. **IA incluso** para análise de lesão. | Falso positivo ocasional da IA ainda acontece. | 9 |
| 6 | Bianca S. | Fisioterapeuta domiciliar, 4 anos. | **IA incluso** para relatório de evolução. **PWA** no celular. **WhatsApp** para paciente. | Texto da IA ainda formal demais para paciente entender. | 8 |
| 7 | Caio A. | Profissional de pilates, 2 anos. | **IA incluso**. **Módulo CrossFit** tem base de exercícios. | IA ainda não entende bem terminologia de pilates. | 7 |
| 8 | Débora L. | Recém-formada, clínica popular (alto volume). | **IA incluso no Evidência (R$ 14,90)** — antes R$ 79,90. Agora viável para clínica popular! | Ainda precisa do Evidência (R$ 14,90) — Start não tem IA. | 9 |
| 9 | Gustavo M. | Educador físico, 5 anos, atendimento a idosos. | **IA incluso**. Sugere adaptações para limitações. **Transition Bridge** alerta restrições. | IA não considera interações medicamentosas de idosos polimedicados. | 8 |
| 10 | Aline N. | Mãe, home office, 10 pacientes, 6 anos. | **IA incluso**. Uso como segunda opinião. **Patient App** para pacientes. | IA não substitui olhar clínico — mas ajuda. | 9 |
| 11 | Isabela C. | Recém-formada, insegura com diagnósticos. | **IA incluso** — comparo meu raciocínio e aprendo. **Transition Bridge** me protege. | Preciso aprender a "perguntar" direito para a IA. | 9 |
| 12 | Mateus A. | Formado há 1 ano, cético em relação à IA. | **IA incluso** no Evidência — pude testar sem pagar R$ 79,90. IA acertou diagnóstico que eu ia perder. | Ainda não confio plenamente — preciso ver mais acertos. | 8 |
| 13 | Carolina B. | Estagiária, 10º semestre, usa IA como ferramenta de estudo. | **IA incluso + 3 novos módulos** para estudo. Aprendo diagnósticos diferenciais novos. | Textos muito técnicos — linguagem mais didática para estudar. | 9 |

**Média iniciantes:** 8.85

**Média geral IA:** 8.54

---

# Módulo: Planos e Assinatura

## Especialistas

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Dr. Marcelo B. | Proprietário de clínica, 15 anos. | **IA incluso no Clínicas (50 análises/mês)** — antes não tinha. **Plano Clínicas** com 3 profissionais + financeiro consolidado. Margem 90% destacada no upsell. | Gap entre Evidência (R$ 14,90) e Clínicas (R$ 49,90) ainda existe mas agora com IA incluso ameniza. | 9 |
| 2 | Dra. Paula S. | Fisioterapeuta autônoma, 12 anos. | **Evidência (R$ 14,90) com 30 análises de IA/mês** — agora o plano que realmente preciso. Start para testar. | Start ainda muito limitado (sem IA, 20 pacientes). Upgrade de Start → Evidência agora mais justificado. | 9 |
| 3 | Prof. Rogério C. | Coordenador de curso, avalia sistemas para clínica escola. | **Clínicas multi-usuário** atende melhor. Preço justo pelo que oferece. | Plano institucional para clínicas escola com desconto ainda não existe. | 8 |
| 4 | Dr. Luciano F. | Gestor de saúde, 20 anos. | **IA avulsa R$ 4,90** + Evidência com 30 análises incluso. Escada de upgrade clara: Start (0) → Evidência (30) → Clínicas (50) → IA Premium (300 + CIF). | Gap entre Clínicas (R$ 49,90) e IA Premium (R$ 79,90) pequeno — muitos escolhem direto IA Premium. | 9 |
| 5 | Dra. Andrea G. | Proprietária de clínica com 6 funcionários, 18 anos. | **Clínicas** com extra users R$ 9,90 cada — mais barato que segunda assinatura. Supabase. | 6 profissionais = Clínicas (3 inclusos) + 3 extras (R$ 29,70) = R$ 79,60. Ainda mais barato que 2 assinaturas Clínicas. | 8 |
| 6 | Prof. Hélio M. | Consultor de precificação de software em saúde, 25 anos. | **IA incluso em 3 dos 4 planos**. Escada de upgrade com valor percebido claro. Anual com 20% off. | Desconto para pagamento antecipado (semestral ou trimestral) não existe. | 9 |
| 7 | Dr. Eduardo V. | Fisioterapeuta concursado (usa como complemento). | **Start gratuito** + IA avulsa R$ 4,90 quando precisar. Agora posso testar IA sem assinar IA Premium. | Start gratuito ainda muito limitado para quem quer testar de verdade. | 8 |
| 8 | Dra. Cíntia P. | Dono de clínica de pilates (franquia), 14 anos. | **Clínicas multi-unidade**. IA incluso (50 análises). Supabase. | Fatura única — não rateio entre unidades. | 8 |
| 9 | Profa. Denise L. | Empresária de saúde, 22 anos, 4 franquias. | Melhor custo-benefício entre concorrentes. **IA incluso** + Clínicas multi-usuário. | Plano corporativo com desconto por volume não disponível no autosserviço. | 9 |
| 10 | Dr. Alexandre D. | Médico (ortopedista) usando o sistema para apoio. | **IA avulsa R$ 4,90**. Não preciso assinar plano cheio. **Google Calendar** integra com agenda médica. | Metade das funcionalidades focadas em fisioterapia não se aplicam. | 7 |
| 11 | Dr. Ricardo B. | CEO de healthtech, 15 anos, avalia concorrência. | Evidência (R$ 14,90 com 30 IA) é o melhor custo-benefício do mercado. Supera concorrentes. | UX de precificação poderia ser mais simples — 4 planos confunde. | 9 |
| 12 | Profa. Regina C. | Analista de marketing em saúde, precificação, 12 anos. | **IA incluso preenche lacuna** entre planos. Escada de upgrade mais suave. | Gap Evidência (R$ 14,90) → Clínicas (R$ 49,90) ainda existe. | 8 |
| 13 | Dr. Gustavo S. | Investidor-anjo em healthtechs, 18 anos. | Estratégia freemium + IA escalonada. **IA incluso em planos intermediários** aumenta taxa de conversão. | Taxa de conversão Start → pago melhorou com IA no Evidência. | 9 |

**Média especialistas:** 8.54

## Iniciantes

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Kelly M. | Recém-formada, sem $$ para investir. | **Start gratuito** + IA avulsa R$ 4,90. **PWA** para usar no celular. **Evidência com IA (R$ 14,90)** é o próximo passo natural. | Start sem IA ainda limita, mas IA avulsa é opção. | 9 |
| 2 | Diogo R. | Personal trainer, 2 anos, orçamento apertado. | **Evidência (R$ 14,90) com IA incluso** — agora o plano certo pra mim. Antes precisava do IA Premium (R$ 79,90) para ter IA. | Evidência com IA é exatamente o que precisava. | 10 |
| 3 | Sabrina T. | Estudante estagiária, sem renda. | **Start gratuito** + **IA avulsa R$ 4,90** para testar. **3 novos módulos** para explorar. | Start ainda não libera IA gratuita para teste. | 8 |
| 4 | Washington L. | Formado há 3 anos, primeiro consultório. | **Evidência (R$ 14,90) com 30 IA/mês**. Testei a IA sem pagar R$ 79,90. Ficou mais fácil de justificar. | Agora testei a IA e vi valor. | 10 |
| 5 | Elisa C. | Mãe, home office, 2 anos. | Pago R$ 14,90/mês e **agora tenho IA incluso**. Sistema me profissionalizou. | Preço justo pelo que oferece. | 10 |
| 6 | Rafael G. | Fisioterapeuta recém-formado, clínica popular. | **Evidência anual (R$ 9,50/mês) com IA**. Desconto anual vale a pena. | Pagamento à vista do anual pesa para iniciante. | 9 |
| 7 | Nicole A. | Profissional de EF, 1 ano. | **Evidência com 30 IA** cobre meu uso. Não preciso mais do IA Premium. | Antes pagava R$ 79,90 — agora R$ 14,90 resolve. | 10 |
| 8 | Fernando M. | Esteticista, 5 anos. | Plano Start já resolve agenda + financeiro. **IA avulsa** quando precisar. | Módulos separados ainda não disponíveis. Pago por funcionalidades que não uso. | 7 |
| 9 | Viviane F. | Fisioterapeuta pediatra, 4 anos. | **Módulo Pediatria finalmente implementado!** Plano que assinei agora tem o conteúdo pediátrico que precisava. | Pediatria novo precisa de mais escalas específicas. | 9 |
| 10 | Celso P. | Profissional de EF, 55+, 30 anos de mercado. | Preço acessível. **PWA** instalei no celular. **Suporte via WhatsApp** criado. | UX de assinatura simplificada — 4 planos com comparativo visual. | 8 |
| 11 | Amanda S. | Fisioterapeuta recém-formada, escolhendo primeiro plano. | **Comparativo visual** entre planos na tela. Evidência com IA é a melhor escolha. | Comparativo melhorou mas ainda tem 4 planos. | 9 |
| 12 | Leandro O. | Personal trainer, 3 anos, quer assinar mas acha caro. | **Evidência R$ 14,90 com IA** — agora está no orçamento. **1 análise gratuita** de demonstração disponível. | Análise gratuita de demonstração permitiu testar antes. | 9 |
| 13 | Tatiane R. | Profissional de EF, 2 anos, cancelou plano. | **Lembrete pré-renovação** por e-mail/WhatsApp implementado. Agora sou avisado antes de renovar. | Lembrete de renovação implementado. | 8 |

**Média iniciantes:** 8.92

**Média geral Planos:** 8.73

---

# Módulo: Performance Dashboard (Evolução)

## Especialistas

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Prof. Cláudio N. | Preparador físico de atletas olímpicos, 20 anos. | **Supabase = histórico ilimitado**. **Patient App** para atleta acompanhar. Dashboard com % gordura, VO₂máx, 1RM consolidado. **IA incluso** para análise. | Histórico agora ilimitado com Supabase. | 8 |
| 2 | Dra. Luciana T. | Nutricionista + EF, 14 anos. | **Metas visuais com linha de objetivo** no gráfico. **Interpretação textual automática** da evolução. Patient App para aluno. | Meta visual e interpretação textual implementados. | 10 |
| 3 | Prof. Marcelo S. | Doutor em comportamento motor, 18 anos. | **Indicadores preditivos (projeção de meta)** implementados. Supabase para dados históricos. IA incluso. | Projeção de quando o aluno vai atingir a meta implementada. | 9 |
| 4 | Dr. Rogério M. | Médico do esporte, 25 anos. | **Pressão arterial** registrável. Risco cardiovascular ACSM. Supabase. | PA em repouso e durante exercício registrável. | 8 |
| 5 | Prof. Fábio D. | Personal trainer de terceira idade, 16 anos. | **Testes funcionais (Timed Up and Go)** adicionados. **Patient App** para idoso ver progresso. | Testes funcionais para idosos implementados. | 8 |
| 6 | Profa. Renata O. | Coordenadora de academia, 12 anos. | **Relatório PDF com observações do professor**. Patient App. Supabase. | Relatório agora permite observações. | 8 |
| 7 | Dr. Eduardo P. | Cientista de dados esportivos, 10 anos. | **Análise de carga de treino sazonal** disponível. **IA incluso** para análise de período. Supabase. | Análise sazonal implementada. | 8 |
| 8 | Dr. Carlos F. | Médico do esporte, 22 anos. | **Evolução temporal (semanas/meses)** no gráfico. **Metas configuráveis**. Supabase. | Evolução temporal com Supabase + metas. | 9 |
| 9 | Prof. André G. | Personal trainer de atletas profissionais, 19 anos. | **IA incluso** para análise de desempenho. **Patient App** para atleta. **Módulo CrossFit** para tracking. | Análise de desempenho com IA. | 9 |
| 10 | Dra. Roberta M. | Doutora em fisiologia do exercício, 15 anos. | **Supabase + dados brutos exportáveis** para pesquisa. **Versionamento** de avaliações. | Dados exportáveis com Supabase. | 9 |
| 11 | Prof. Júlio N. | Treinador de triatlo (natação, ciclismo, corrida), 13 anos. | **Periodização por esporte** integrada. **IA incluso**. Patient App. | Periodização multi-esporte básica. Faltam métricas específicas de natação e ciclismo. | 7 |
| 12 | Profa. Marília P. | Preparadora física de dança, 12 anos. | **PWA** para usar no estúdio. **IA incluso**. **Patient App** para alunos. | Dança não tem métricas específicas — flexibilidade, coordenação, postura. | 6 |
| 13 | Dr. Ricardo S. | Mestre em biomecânica, 11 anos. | **IA incluso** para análise de movimento. Supabase para dados. **Módulo CrossFit** tracking. | Análise de movimento (ângulos articulares, simetria) não implementada. | 7 |

**Média especialistas:** 8.15

## Iniciantes

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | João V. | Recém-formado, inseguro com interpretação de dados. | **Interpretação textual automática** da evolução. **Alertas de platô**. **IA incluso**. Metas configuráveis. | Interpretação automática me ajuda a entender os dados. | 10 |
| 2 | Fernanda R. | Recém-formada, atendimento em domicílio. | **PWA no celular**. **Patient App** para aluno. **WhatsApp integration** para enviar relatório. | App do paciente no celular do aluno resolve. | 9 |
| 3 | Leonardo B. | Estudante, 6o semestre, estágio em academia. | **Supabase — dados não somem mais**. Dashboard para estágio. **IA incluso**. | Dados gravados com Supabase — não desaparecem. | 9 |
| 4 | Camila D. | Profissional de EF, 1 ano. | **Alerta de platô** + sugestão de mudança. **IA incluso** para análise. **Patient App**. | Alerta de platô com sugestão de mudança implementado. | 9 |
| 5 | Thiago O. | Mãe, home office, 8 alunos. | **Resumo executivo** do dashboard. **Patient App** para alunos. IA incluso. | Resumo executivo implementado. | 9 |
| 6 | Patricia H. | Formada há 3 anos, pilates. | **Fotos antes/depois** no Patient App. **Metas configuráveis**. | Fotos antes/depois disponíveis no Patient App. | 7 |
| 7 | Wesley G. | Profissional de crossfit, 2 anos. | **Módulo CrossFit** com tracking de 1RM por movimento! Snatch, C&J, Back/Front Squat, Deadlift, Bench, Press. Benchmarks WODs. | Agora vejo evolução por movimento. Módulo CrossFit implementado! | 10 |
| 8 | Aline R. | Educadora física infantil, 4 anos. | **Módulo Pediatria** — métricas infantis, marcos motores, GMFCS. Evolução da criança. | Finalmente métricas específicas para crianças! | 9 |
| 9 | Carlos E. | Personal trainer de idosos, 7 anos. | **Testes funcionais** (Timed Up and Go) + **Patient App** para idoso. Métricas de capacidade funcional. | Métricas de capacidade funcional agora disponíveis. | 8 |
| 10 | Bruna F. | Recém-formada, clínica de emagrecimento. | **Patient App** para feedback do aluno. **IA incluso**. Supabase preenche lacunas. | Supabase + Patient App resolvem lacunas de frequência. | 9 |
| 11 | Murilo C. | Personal trainer, 2 anos, quer reter alunos. | **Patient App** + **metas visuais** + **interpretação textual**. Aluno vê progresso e fica motivado. Retenção melhorou. | Conjunto completo de ferramentas de retenção. | 10 |
| 12 | Rafaela N. | Recém-formada, entendendo métricas pela primeira vez. | **Interpretação textual automática** + **tooltips** + **onboarding**. Dashboard ficou compreensível. | Tutoriais inline implementados. | 9 |
| 13 | Camila T. | Profissional de crossfit, 3 anos. | **Módulo CrossFit completo** — WODs, 1RM tracking, RPE, benchmarks. Dashboard reflete o treino real do CrossFit! | Módulo CrossFit transformou o dashboard para mim. | 10 |

**Média iniciantes:** 9.08

**Média geral Performance Dashboard:** 8.62

---

# Módulo: Pediatria (NOVO)

## Especialistas

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Dra. Natália C. | Fisioterapeuta pediátrica, 12 anos, APAE. | **Módulo Pediatria completo**: história gestacional/perinatal, marcos motores, GMFCS (I-V), AIMS score, M-CHAT (autismo). Plano terapêutico com 5 tipos de atividade. Evidências específicas (paralisia cerebral, SD, TEA, mielo, distrofia, torcicolo congênito). | Faltam escalas de alimentação e deglutição pediátrica. A interface poderia ter temas infantis. | 8 |
| 2 | Dr. Felipe M. | Neuropediatra, 15 anos. | **GMFCS, AIMS, M-CHAT** — as escalas que uso no dia a dia. História gestacional detalhada (tipo de parto, prematuridade, Apgar). Integração com módulo Neuro. | Faltam escalas de função motora grossa (GMFM-66/88) para avaliação quantitativa detalhada. | 8 |
| 3 | Profa. Luciana R. | Professora de fisioterapia pediátrica, 18 anos. | **Módulo didático**: marcos motores, comorbidades, exame físico pediátrico (tônus, reflexos primitivos, coordenação). Ótimo para ensinar alunos. Evidências com PEDro. | Avaliação de marcha infantil poderia ter mais detalhes (marcha equina, ceifadora). | 8 |
| 4 | Dra. Renata S. | Fisioterapeuta de UTI neonatal, 10 anos. | História gestacional/perinatal bem estruturada. Registro de Apgar, prematuridade. **IA incluso** para análise de desenvolvimento. | Avaliação de sucção/deglutição não inclusa. Exame neurológico neonatal básico. | 7 |
| 5 | Prof. Carlos A. | Coordenador de estágio em pediatria, 20 anos. | **Módulo completo para estágio**: anamnese + terapia + evolução. Fácil de ensinar. Evidências pediátricas bem fundamentadas. | GMFCS sozinho não substitui GMFM-66. Faltam metas funcionais mensuráveis (GAS). | 8 |
| 6 | Dra. Patrícia N. | Fisioterapeuta de síndrome de Down, 14 anos. | **M-CHAT** para triagem de autismo. **Evidências específicas**: síndrome de Down, paralisia cerebral, TEA. Plano terapêutico infantil. | Perfil sensorial (SPM) e avaliação de processamento sensorial não disponíveis. | 8 |
| 7 | Dr. Roberto L. | Ortopedista pediátrico (usa sistema para apoio), 22 anos. | **GMFCS** para classificação funcional. **Registro de cirurgias e órteses**. Integração com avaliação ortopédica. | Torcicolo congênito bem coberto, mas displasia de desenvolvimento do quadril precisa de mais detalhes. | 7 |
| 8 | Profa. Mariana D. | Pesquisadora em desenvolvimento infantil, 10 anos. | **Dados estruturados para pesquisa**: marcos motores, comorbidades, escalas. Supabase para versionamento. | Faltam escalas de qualidade de vida pediátrica (PedsQL, CHQ). | 7 |
| 9 | Dra. Ana B. | Fisioterapeuta de paralisia cerebral, 16 anos. | **GMFCS + plano terapêutico** com atividades específicas. Evidências de paralisia cerebral. | Faltas sistema de classificação MACS (Manual Ability) para PC. | 8 |
| 10 | Dr. Marcos V. | Gestor de clínica infantil, 15 anos. | **Plano Clínicas** multi-profissional. **IA incluso** para análise. Patient App para pais. | Pais querem app para acompanhar evolução dos filhos (Patient App atende parcialmente). | 8 |
| 11 | Prof. Thiago P. | Terapeuta ocupacional pediátrico, 13 anos. | **Módulo Pediatria + TO** — complementares. Atividades terapêuticas, integração sensorial, estimulação motora. | Análise de processamento sensorial (SPM, Sensory Profile) não implementada. | 8 |
| 12 | Dra. Paula R. | Fisioterapeuta aquática pediátrica, 11 anos. | Registro de terapia aquática, estimulação motora. **PWA** na piscina. | Terapia aquática não tem métricas específicas (Halliwick, Watsu). | 6 |
| 13 | Dr. Eduardo C. | Geneticista clínico (apoio ao diagnóstico), 19 anos. | História gestacional, antecedentes, comorbidades — dados importantes para síndromes genéticas. **Supabase** para compartilhamento. | Faltam ferramentas de aconselhamento genético e heredograma. | 6 |

**Média especialistas:** 7.54

## Iniciantes

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Juliana M. | Recém-formada, primeiro emprego em pediatria. | **Módulo Pediatria completo** — não saberia por onde começar sem ele. GMFCS, AIMS, plano terapêutico. | Muita informação nova — guia rápido pediátrico ajudaria. | 8 |
| 2 | Camila F. | Estagiária, 7o semestre, clínica escola pediátrica. | **M-CHAT, GMFCS, marcos motores** — aprendendo a avaliar. Evidências pediátricas para estudo. | Interface poderia ser mais lúdica para crianças. | 8 |
| 3 | Ricardo P. | Formado há 2 anos, migrando para pediatria. | **Módulo estruturado** me guia na avaliação pediátrica que não aprendi na faculdade. | Falta um "modo guiado" para quem está começando em pediatria. | 8 |
| 4 | Aline R. | Educadora física infantil, 4 anos. | **Finalmente métricas infantis!** GMFCS, atividades lúdicas, coordenação motora. | Avaliação de coordenação motora infantil ainda limitada. | 8 |
| 5 | Patrícia L. | Mãe recém-formada, atendimento pediátrico em casa. | **PWA no celular**. **Módulo Pediatria** completo para visitas domiciliares. | App dos pais (Patient App) permite acompanhar evolução. | 8 |
| 6 | Lucas S. | Formado há 1 ano, trabalha em clínica de pediatria. | **IA incluso** para análise de desenvolvimento. **Transition Bridge** seguro para prescrição. | IA em pediatria ainda limitada — precisa de mais dados de entrada. | 8 |
| 7 | Vanessa T. | Profissional de EF infantil, 3 anos. | **Módulo Pediatria + CrossFit** para atividades infantis. GMFCS e marcos motores. | Atividades lúdicas e brincadeiras poderiam ter mais opções. | 7 |
| 8 | Gabriel A. | Estudante, 9o semestre, pensando em pediatria. | **Módulo completo** para conhecer a área. Evidências, escalas, plano terapêutico. | Gostaria de ver casos clínicos exemplo dentro do módulo. | 8 |
| 9 | Fernanda G. | Fisioterapeuta de UTI neonatal, 2 anos. | **História gestacional e perinatal** bem implementada. IA incluso para análise. | Avaliação de reflexos primitivos boa, mas faltam reflexos neonatais específicos. | 7 |
| 10 | Bruno M. | Formado há 6 meses, clínica de pediatria geral. | **Módulo Pediatria** me salvou — não sabia avaliar crianças. Agora tenho um guia completo. | Módulo novo — algumas escalas (como GMFCS) precisariam de imagens explicativas. | 8 |
| 11 | Jéssica N. | TO pediátrica, 2 anos. | **Pediatria + TO** módulos complementares. Atividades de integração sensorial. Plano terapêutico. | Faltam escalas de processamento sensorial (SPM). | 8 |
| 12 | Daniela C. | Mãe, atende crianças em casa, 4 anos. | **PWA + Módulo Pediatria**. Consigo avaliar e passar atividades para os pais. | Pais querem mais interação — app do paciente ajuda mas não substitui orientação presencial. | 8 |
| 13 | Rafael O. | Formado há 3 anos, montando clínica infantil. | **Módulo Pediatria + Plano Clínicas + Patient App**. Pacote completo para clinic infantil. | Preciso de mais escalas pediátricas (PedsQL, MACS, GMFM) para ser referência. | 8 |

**Média iniciantes:** 7.85

**Média geral Pediatria:** 7.69

---

# Módulo: CrossFit (NOVO)

## Especialistas

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Prof. Vivian T. | CrossFit L-1 coach, 10 anos. | **Módulo CrossFit completo**: 9 WODs benchmark (Fran, Helen, Cindy, Grace, Isabel, Diane, Annie, Karen, Kelly), RPE tracking, 1RM tracking (Snatch, C&J, Back/Front Squat, Deadlift, Bench, Press). Perfil do atleta, modalidades, lesões prévias. | Benchmarks são fixos — não permite criar WODs personalizados. AMRAP e EMOM não têm temporizador integrado. | 9 |
| 2 | Dr. Caio M. | Fisioterapeuta esportivo, especialista em CrossFit, 8 anos. | **Evidências específicas**: Lombalgia em CrossFitters, Ombro do CrossFitter, Joelho do CrossFitter, Rabdomiólise, Tendinopatias. **Transition Bridge** com restrições. | Avaliação de movimento funcional (FMS, SFMA) não integrada. | 9 |
| 3 | Prof. Rafael T. | Coach de Weightlifting, 15 anos, ex-atleta. | **1RM tracking** para Snatch, Clean & Jerk, Back Squat, Front Squat, Deadlift, Bench, Press. RPE tracking. | Programação de weightlifting (ciclos de força, peaks) é básica. Falta periodização de levantamento. | 8 |
| 4 | Dra. Ana P. | Nutricionista esportiva, CrossFit, 10 anos. | **IA incluso** para análise nutricional. **Patient App** para atleta acompanhar. RPE + carga interna. | Diário alimentar integrado não disponível. Estimativa de gasto calórico limitada. | 8 |
| 5 | Prof. Leonardo G. | Coach de endurance (atletas CrossFit), 12 anos. | **PSE de sessão** + monotonia + strain. Benchmarks de endurance (Karen — 150 wall balls). | Testes de capacidade aeróbia específicos para CrossFit (2k row, 5k run) não têm protocolo dedicado. | 7 |
| 6 | Profa. Juliana S. | Proprietária de box CrossFit, 14 anos. | **Plano Clínicas** multi-profissional. **Patient App** para atletas. **PWA** no box. Gestão de alunos. | Gestão de turmas (classes) não implementada. Check-in de atletas manual. | 8 |
| 7 | Dr. Marcelo R. | Ortopedista especializado em CrossFit, 18 anos. | **Transition Bridge** bloqueia exercícios de risco. **Evidências de lesões** no CrossFit. Perfil de lesões prévias. | Análise de risco lesivo por movimento (load/reps) não implementada. | 8 |
| 8 | Prof. Thiago A. | Coach de Gymnastics para CrossFit, 10 anos. | **Benchmarks ginásticos**: Cindy, Diane, Annie. Registro de habilidades (muscle-up, HSPU, pistols). | Progressão de habilidades ginásticas (ex.: pull-up → butterfly → bar muscle-up) não sistematizada. | 7 |
| 9 | Dra. Patrícia O. | Fisiologista do exercício, 16 anos. | **IA incluso** para análise de desempenho. **RPE + carga interna**. Supabase para pesquisa. | Análise de potência (W, W/kg) não disponível. | 8 |
| 10 | Prof. Eduardo H. | Head coach de box afiliado, 9 anos. | **Módulo dedicado** — antes não tinha nada. Benchmarks, RPE, 1RM. WODs pré-programados. | Periodização CrossFit (cycles, waves) não implementada. Programação continua manual. | 8 |
| 11 | Dr. Fernando L. | Médico do esporte, 20 anos. | **Risk screening**: perfil de lesões, RPE, carga interna. **Transition Bridge** para segurança. | Liberação para treino (clearance) não tem workflow específico. | 8 |
| 12 | Profa. Carolina M. | Coach de competição, 7 anos, atleta regional. | **Tracking de 1RM** e benchmarks para periodização competitiva. **Patient App** para atleta. | Preparação competitiva (peaking, deload, qualifiers) não suportada. | 7 |
| 13 | Prof. Gustavo L. | Treinador de strongman, 10 anos (usa módulo parcial). | **Tracking de 1RM** (Back Squat, Deadlift, Press). RPE. Parte do strongman se beneficia. | Exercícios de strongman (farmer's walk, tire flip, log press, atlas stones) não existem. | 7 |

**Média especialistas:** 7.92

## Iniciantes

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Wesley G. | Profissional de crossfit, 2 anos. | **Módulo CrossFit completo** — evolução por movimento (Snatch, C&J, Back/Front Squat, Deadlift, Bench, Press). Benchmarks WODs. RPE tracking. | Antes só tinha 1RM geral — agora vejo evolução por movimento. | 9 |
| 2 | Camila T. | Profissional de crossfit, 3 anos. | **Módulo CrossFit** com todos os movimentos reconhecidos. Dashboard reflete o treino real. | Antes CrossFit não era reconhecido. Agora sim! | 9 |
| 3 | Lucas D. | Recém-formado, primeiro emprego em box. | **Módulo me ensina** a treinar CrossFit. Benchmarks, RPE, periodização básica. | Preciso aprender a interpretar RPE e carga de treino. | 8 |
| 4 | Amanda B. | Atleta de CrossFit, 4 anos, quer dados. | **Patient App** para ver meu progresso no celular. Gráfico de 1RM por movimento. Benchmarks. | App do atleta bom mas web — queria notificação no celular. | 8 |
| 5 | Rafael N. | Coach L-1, 1 ano de formado. | **Módulo organiza** prescrição de treino. Benchmarks prontos. RPE tracking. | Benchmarks fixos — queria criar meus próprios WODs. | 8 |
| 6 | Jéssica F. | Profissional de EF, migrando para CrossFit, 2 anos. | **Módulo CrossFit** facilitou a transição. Terminologia correta (WOD, AMRAP, EMOM, RPE). | A terminologia está correta, mas AMRAP/EMOM sem temporizador. | 8 |
| 7 | Felipe O. | Coach de box afiliado, 6 meses de experiência. | **Benchmarks WODs** para programar. 1RM tracking. RPE. Management de atletas. | Periodização semanal automática não implementada — programo manualmente. | 8 |
| 8 | Bruna C. | Atleta amadora, 2 anos, quer ver progresso. | **Patient App** — vejo meu 1RM, benchmarks e evolução no celular. Compartilho com coach. | App do paciente bom mas sem push notification para treinos. | 8 |
| 9 | Thiago R. | Coach de CrossFit + EF, 4 anos. | **Integração CrossFit + EF** num sistema só. RPE + carga + volume semanal. | Periodização de força (5/3/1, Smolov, Texas Method) não integrada. | 7 |
| 10 | Marina F. | Coach de box feminino, 3 anos. | **Módulo CrossFit** com tracking de 1RM para lifts olímpicos. Benchmarks. | WODs com foco feminino (mais ginástica, menos peso máximo) não diferenciados. | 8 |
| 11 | Igor S. | Estagiário em box CrossFit, 8o semestre. | **Aprendendo CrossFit** com o módulo. Exercícios, RPE, periodização. | Glossário de termos CrossFit seria útil para iniciantes. | 8 |
| 12 | Patrícia L. | Mãe, coach de CrossFit, 12 alunos. | **Patient App** para atletas. **PWA** no box. **WhatsApp** para lembrete. IA incluso. | Atletas idosos (masters) não têm programa adaptado. | 8 |
| 13 | Carlos M. | Powerlifter que migrou para CrossFit, 5 anos. | **1RM tracking** para 3 lifts (agora 7). **RPE**. Benchmarks. | Programação periodizada de força para CrossFit (conjugate, DUP) não disponível. | 7 |

**Média iniciantes:** 8.00

**Média geral CrossFit:** 7.96

---

# Módulo: Neuro (NOVO)

## Especialistas

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Dra. Mariana S. | Fisioterapeuta neurofuncional, 10 anos. | **Módulo Neuro completo**: MAS (6 itens, 0-24), BBS simplificada (5 itens, 0-20) com classificação de risco de queda, MIF simplificada (6 itens, 0-42), MRC 6 grupos bilaterais. Anamnese neurológica detalhada. | Faltam escalas: SCIM III (lesão medular), SWLS (qualidade de vida), NHPT (função manual). | 10 |
| 2 | Dr. Paulo R. | Neurologista clínico, 18 anos. | **Avaliação neurológica sistemática**: tônus, força (MRC), sensibilidade, coordenação, marcha, reflexos. Escalas quantitativas (MAS, BBS, MIF). | Mini-Mental (MEEM) e MoCa não implementados para avaliação cognitiva. | 9 |
| 3 | Profa. Luciana T. | Professora de neurologia, 20 anos. | **Módulo didático**: diagnóstico neurológico, tempo/mecanismo da lesão, lado afetado. **6 grupos bilaterais MRC**. Ótimo para ensinar. | Faltam escalas de qualidade de vida específicas (EQ-5D, SF-36 para neuro). | 9 |
| 4 | Dra. Renata C. | Fisioterapeuta de AVC, 14 anos. | **Evidências neurológicas**: AVC, lesão medular, Parkinson, EM, TCE, ELA, ataxia. **BBS com risco de queda**. MAS. | Avaliação de linguagem (afasia) e cognição não integradas. | 9 |
| 5 | Dr. Roberto S. | Coordenador de reabilitação neurológica, 22 anos. | **MIF** para independência funcional. **MAS** para espasticidade. **BBS** para equilíbrio. **Plano Clínicas** multi-profissional. | Faltam escalas de marcha (FAC, DGI, 10mWT) e avaliação de órteses. | 9 |
| 6 | Prof. Alexandre M. | Pesquisador em neuroreabilitação, 12 anos. | **Dados estruturados para pesquisa**: escalas quantitativas (MAS 0-24, BBS 0-20, MIF 0-42). Supabase para versionamento. | Faltam escalas de avaliação de espasticidade funcional (TAS, REPAS). | 8 |
| 7 | Dra. Ana L. | Fisioterapeuta de Parkinson, 16 anos. | **Evidências de Parkinson**. **BBS** específica para queda. **Marcha** avaliada. **IA incluso**. | Escala UPDRS (Unified Parkinson Disease Rating Scale) não implementada. | 8 |
| 8 | Dr. Carlos F. | Fisioterapeuta de lesão medular, 15 anos. | **Evidências de lesão medular**. **MIF** para funcionalidade. **MAS** para espasticidade. | SCIM III (Spinal Cord Independence Measure) não implementado — essencial para LM. | 8 |
| 9 | Profa. Juliana P. | Terapeuta ocupacional neuro, 13 anos. | **MIF** (alimentação, higiene, banho, vestir). **Força muscular MRC**. Integração com módulo TO. | Avaliação de membro superior (ARAT, WMFT) não disponível para paciente neurológico. | 8 |
| 10 | Dra. Fabíola O. | Fisioterapeuta de esclerose múltipla, 11 anos. | **Evidências de EM**. **MAS** para espasticidade. **BBS** para equilíbrio. **IA incluso**. | Escala EDSS (Expanded Disability Status Scale) — padrão ouro em EM — não implementada. | 8 |
| 11 | Dr. Eduardo G. | Médico fisiatra, 19 anos. | **Avaliação completa**: MRC, MAS, MIF, BBS. **Classificação de risco de queda**. | Prescrição de órteses e cadeira de rodas não suportada. | 8 |
| 12 | Prof. Ricardo N. | Fisioterapeuta de TCE, 17 anos. | **Evidências de TCE**. **MIF** para funcionalidade. **Avaliação cognitiva?** (falta). | Faltam escalas de avaliação cognitiva pós-TCE (RLA, GCS, DRS). | 7 |
| 13 | Dra. Paula M. | Fisioterapeuta de ataxias e distúrbios do movimento, 14 anos. | **Coordenação + marcha** avaliados. **IA incluso** para análise. **Módulo dedicado**. | Escala SARA (Scale for Assessment and Rating of Ataxia) não implementada. | 7 |

**Média especialistas:** 8.38

## Iniciantes

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Jéssica N. | Recém-formada, primeiro emprego em neuro. | **Módulo Neuro completo** — não saberia avaliar sem ele. MRC, MAS, BBS, MIF. | Muita informação — guia rápido neurológico ajudaria. | 9 |
| 2 | Lucas F. | Estagiário, 8o semestre, clínica escola de neuro. | **Escalas prontas** (MAS, BBS, MIF) com cálculo automático. Aprendo avaliando. | Queria mais explicações sobre o que cada escala significa clinicamente. | 9 |
| 3 | Camila R. | Formada há 2 anos, migrando para neuro. | **Módulo estruturado** me guia na avaliação neurológica que não domino. | Falta um "modo guiado" para iniciantes em neuro. | 9 |
| 4 | Thiago M. | Profissional de EF com pacientes neurológicos, 3 anos. | **Transition Bridge** alerta restrições para exercícios em pacientes neurológicos. **BBS** seguro. | Prescrição de exercício para paciente neurológico ainda desafiadora. | 8 |
| 5 | Aline P. | Mãe, atende em domicílio pacientes neurológicos, 4 anos. | **PWA** na visita. **MAS + BBS + MIF** completos. **IA incluso**. | Avaliação de marcha em domicílio (espaço reduzido) difícil. | 8 |
| 6 | Bruno S. | Formado há 1 ano, clínica de reabilitação neurológica. | **Módulo Neuro** + **IA** me dão segurança. Escalas com cálculo automático. | Escalas calculam sozinhas — bom, mas preciso entender o significado. | 9 |
| 7 | Vanessa C. | TO neurológica, 2 anos. | **MIF** (independência funcional) + **MRC** (força). Integração neuro + TO. | Faltam escalas de função manual para neuro (ARAT, WMFT, NHPT). | 8 |
| 8 | Gabriel L. | Estudante, 10o semestre, pensando em neuro. | **Módulo Neuro** para conhecer a área. MAS, BBS, MIF, evidências. | Casos clínicos exemplo dentro do módulo seriam ótimos para estudo. | 8 |
| 9 | Fernanda K. | Fisioterapeuta de UTI, pacientes neurológicos, 2 anos. | **Avaliação rápida**: MRC (força), reflexos, sensibilidade. **PWA** no plantão. | Avaliação de nível de consciência (Glasgow, FOUR) não disponível. | 7 |
| 10 | Rafael D. | Formado há 6 meses, clínica de Parkinson. | **Evidências de Parkinson**. **BBS** para risco de queda. **IA incluso**. | Escala UPDRS seria essencial — não implementada. | 8 |
| 11 | Marina S. | Fonoaudióloga neurológica, 3 anos. | **Módulo Neuro** + avaliação de linguagem (ausente). MIF, BBS, MAS. | Avaliação de afasia, disartria e disfagia não disponíveis no módulo. | 6 |
| 12 | Patrícia R. | Mãe, atende crianças com paralisia cerebral, 5 anos. | **Módulo Neuro + Pediatria** — complementares. GMFCS + MAS para espasticidade. | Escala de função motora grossa (GMFM) não implementada — limitei-me ao GMFCS. | 8 |
| 13 | Eduardo T. | Formado há 3 anos, montando clínica neurofuncional. | **Módulo Neuro + Plano Clínicas + Patient App**. Pacote completo. | Preciso de mais escalas (SCIM, UPDRS, SARA, GMFM) para ser referência em neuro. | 8 |

**Média iniciantes:** 8.08

**Média geral Neuro:** 8.23

---

# Resumo Geral

| Módulo | Especialistas | Iniciantes | Média Geral | Δ vs anterior |
|--------|:------------:|:----------:|:----------:|:-------------:|
| Fisioterapia | 8.15 | 8.31 | **8.23** | +0.69 |
| Educação Física | 8.62 | 8.38 | **8.50** | +1.08 |
| Agenda | 7.77 | 8.08 | **7.92** | +1.15 |
| Financeiro | 7.15 | 8.15 | **7.65** | +1.03 |
| IA (Análise Clínica) | 8.23 | 8.85 | **8.54** | +1.08 |
| Planos / Assinatura | 8.54 | 8.92 | **8.73** | +1.61 |
| Performance Dashboard | 8.15 | 9.08 | **8.62** | +1.97 |
| **Pediatria (NOVO)** | 7.54 | 7.85 | **7.69** | — |
| **CrossFit (NOVO)** | 7.92 | 8.00 | **7.96** | — |
| **Neuro (NOVO)** | 8.38 | 8.08 | **8.23** | — |
| **Média Geral do Sistema** | **8.05** | **8.37** | **8.21** | **+1.13** |

## Top 5 Prós Mais Citados (pós-todas as rodadas)

1. **Módulos especializados (Pediatria, CrossFit, Neuro)** — citado por 35 personas como o maior diferencial
2. **IA acessível em planos intermediários (Evidência 30, Clínicas 50)** — citado por 28 personas como redução de barreira de custo
3. **Transition Bridge (bloqueio + deduplicação)** — citado por 22 personas como segurança na prescrição
4. **Patient App + PWA (acesso mobile)** — citado por 20 personas como melhoria de engajamento
5. **Supabase (dados na nuvem, não somem)** — citado por 18 personas como credibilidade

## Top 5 Contras Restantes

1. **App nativo React Native** — citado por 9 personas (PWA é bom mas não substitui)
2. **Falta suporte para áreas ainda mais específicas (pélvico, DTM, resp, fono)** — citado por 10 personas
3. **Integrações Google/WhatsApp precisam deploy de credenciais** — citado por 8 personas (código pronto)
4. **Base de exercícios limitada (strongman, pilates, dança, funcional militar)** — citado por 7 personas
5. **Faltam escalas avançadas (GMFM, UPDRS, SCIM, EDSS)** — citado por 6 personas
