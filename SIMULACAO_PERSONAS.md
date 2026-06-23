# Simulação de Personas — SASYRA

## 20 personas por módulo (10 especialistas + 10 iniciantes)

---

# Módulo: Fisioterapia (Avaliação Clínica)

## Especialistas

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Dr. Carlos M. | Fisioterapeuta ortopédico, 18 anos de clínica. Usa testes ortopédicos diariamente. | Base de conhecimento com 50+ patologias cobre bem o dia a dia. Vídeos embedados dos testes especiais são excelente recurso didático. Detecção automática de condições na queixa é precisa. | A integração com IA ainda é limitada — poderia sugerir diagnósticos diferenciais mais complexos. Falta exportação direta para prontuário eletrônico. | 9 |
| 2 | Dra. Ana L. | Especialista em rehabilitación pós-operatória, 15 anos. Usa goniometria e escalas. | Goniometria com valores de referência embutidos agiliza muito a avaliação. Escalas validadas (ODI, NDI, DASH) com MCID já calculado é um diferencial enorme. | A avaliação express é boa mas poderia ter mais campos personalizáveis. O BodyMap às vezes não capta detalhes de irradiação. | 9 |
| 3 | Dr. Paulo R. | Doutor em fisioterapia esportiva, 12 anos. | CIF automático é fantástico — economizo 15 minutos por paciente. A detecção de bandeiras vermelhas é criteriosa e bem embasada. | A base do CIF poderia ser mais completa (falta códigos de atividade e participação). O sistema não integra com TUSS para faturamento. | 8 |
| 4 | Dra. Mariana S. | Fisioterapeuta neurofuncional, 10 anos. | Avaliação de reflexos e sensibilidade bem estruturada. Escalas específicas (Berg, TUG) são bem implementadas. | Foco muito ortopédico — módulo neurológico é básico. Falta escala de Ashworth modificada e avaliação de marcha mais detalhada. | 7 |
| 5 | Dr. Roberto F. | Coordenador de clínica escola, 20 anos. | Sistema fácil de ensinar para estagiários. Os painéis de evidência com escores PEDro são ótimos para fundamentar condutas. | Não tem modo multi-usuário para a clínica escola. Cada estagiário precisa ter o próprio login. Falta controle de acesso por nível. | 8 |
| 6 | Dra. Juliana M. | Fisioterapeuta do trabalho, 14 anos. | Anamnese com detecção de comorbidities e antecedentes é muito útil para avaliação ocupacional. Relatório de evolução é bem organizado. | Faltam escalas ocupacionais como DASH e MAS. A agenda poderia integrar com Google Calendar. | 7 |
| 7 | Dr. Ricardo G. | Pesquisador clínico, Mestre em epidemiologia, 8 anos. | A qualidade das referências (PEDro, Cochrane, JOSPT) é impressionante para um sistema nacional. Ajuda a embasar artigos e relatórios. | Os dados ficam só no localStorage — sem backend não dá para usar em pesquisa séria. Precisaria de exportação CSV com metadados. | 8 |
| 8 | Dra. Fernanda C. | Proprietária de clínica (3 unidades), 16 anos. | Módulo financeiro integrado permite ver faturamento por período e por paciente. Honorários CREFITO já tabelados ajudam precificação. | Falta gestão de convênios (cada operadora tem sua tabela). O financeiro é bom mas ainda não substitui um sistema fiscal completo. | 7 |
| 9 | Dr. Eduardo A. | Acupunturista e osteopata, 22 anos. | Interface limpa e rápida. O agendamento com drag-and-drop é fluido. A ficha de evolução bem estruturada. | As abordagens manuais (osteopatia, quiropraxia) não têm suporte específico. Testes ortopédicos são focados em fisioterapia convencional. | 8 |
| 10 | Dra. Patrícia O. | Fisiátra (médica), 11 anos. | Uso em conjunto com avaliação médica — a detecção de red flags é confiável. Gera impressão diagnóstica consistente. | Como médica, sinto falta de integração com CID-11 em vez de só CIF. Também falta suporte a prescrição de medicamentos e órteses. | 7 |

**Média especialistas:** 7.8

## Iniciantes

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Lucas M. | Formado há 6 meses, primeiro emprego em clínica de ortopedia. | A sugestão de diagnósticos a partir da queixa me salvou várias vezes. Eu não saberia quais escalas aplicar sem o sistema. | No começo achei a quantidade de campos assustadora. O guia rápido ajudou mas ainda me perco entre as abas. | 9 |
| 2 | Camila S. | Estagiária (6o semestre), usa na clínica escola. | Os vídeos dos testes ortopédicos são incríveis para estudar. Consigo ver o teste e já aplicar. Muito melhor que livro. | O sistema infelizmente substitui o raciocínio clínico se a gente depender demais das sugestões automáticas. | 9 |
| 3 | Thiago A. | Recém-formado, atendimento domiciliar. | Uso no celular durante visitas — funciona bem. A avaliação express é perfeita para home care. | A tela é pequena no celular, alguns botões ficam difíceis de tocar. O BodyMap não é responsivo. | 8 |
| 4 | Amanda R. | Profissional de transição de carreira (2 anos de formada). | A interface parece um prontuário de verdade, me sinto mais profissional usando. Ajudou a organizar meu atendimento. | Não tinha experiência com sistemas — precisei de 2 semanas para pegar o ritmo. Tutoriais integrados ajudariam. | 8 |
| 5 | Felipe D. | Formado há 1 ano, trabalha em clínica popular (alto volume). | O atalho de teclado e a avaliação express agilizam demais o atendimento. Consigo fazer um paciente em 20 min com tudo registrado. | Para clínica popular o plano Start é limitado (poucos pacientes). O sistema poderia ter um plano mais acessível. | 7 |
| 6 | Bruna L. | Plantonista em hospital, recém-formada. | Detecção de red flags me dá segurança para saber quando referenciar. Achei a parte de evidências muito boa. | No hospital o sistema não integra com o prontuário eletrônico hospitalar. Tenho que digitar tudo de novo. | 7 |
| 7 | Igor P. | Autônomo, montando consultório próprio. | O módulo financeiro já me deu uma visão real do faturamento. Os modelos de ficha economizam meu tempo. | Sinto falta de um contrato digital para pacientes. A parte de marketing (lembrete de consulta) não existe. | 8 |
| 8 | Natália C. | Mãe recém-formada, atendimento pediátrico. | A interface é bonita e passa credibilidade. Gostei de poder anexar fotos e documentos na avaliação. | Foco muito adulto/ortopédico. Avaliação pediátrica (marcos do desenvolvimento, escalas pediátricas) é bem fraca. | 6 |
| 9 | Vinícius O. | Formado há 2 anos, clínica de pilates. | Consigo registrar avaliação individualizada para cada aluno. O sistema é flexível o bastante para se adaptar. | Pilates tem terminologia própria — não reconhece exercícios específicos. Tenho que cadastrar manualmente. | 7 |
| 10 | Jéssica T. | Especializanda em traumato-ortopedia, 3 anos de formada. | As referências bibliográficas embutidas são ótimas para a pós-graduação. Uso na especialização como fonte de consulta. | Não tem modo escuro — passo horas no sistema e cansa a vista. Faltam atalhos de teclado mais robustos. | 8 |

**Média iniciantes:** 7.7

**Média geral Fisioterapia:** 7.75

---

# Módulo: Educação Física (Prescrição de Treino)

## Especialistas

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Dr. Rafael N. | Doutor em fisiologia do exercício, 25 anos, preparador físico de atletas. | A periodização com progressão automática de carga é matematicamente sólida. O modelo ACSM para prescrição está correto e bem referenciado. | Para atletas de alto rendimento, os protocols de periodização são básicos. Falta periodização ondulatória e DUP (daily undulating periodization). | 8 |
| 2 | Prof. Alexandre B. | Mestre em treinamento de força, coordenador de curso de Educação Física, 18 anos. | Cálculo de 1RM preditivo com média de 3 equações é mais robusto que usar uma só. Análise de volume semanal por grupo muscular é excelente. | A base de exercícios (80+) é boa mas ainda faltam muitos exercícios. Não tem exercícios com halteres e muitos acessórios. | 8 |
| 3 | Dra. Carolina Z. | Nutricionista + EF, especialista em emagrecimento, 14 anos. | Integração avaliação física + prescrição num único sistema é raro. A evolução do % de gordura ao longo das sessões é útil para motivar alunos. | A estimativa de gasto calórico por sessão é limitada — poderia usar equações mais específicas (MET/minuto). Falta diário alimentar. | 8 |
| 4 | Prof. Marcelo V. | Preparador físico de futebol, 20 anos. | Testes de campo (Cooper, Rockport) são bem implementados. PSE de sessão com monotonia e strain é uma métrica que uso diariamente. | Não tem protocolos específicos para esportes coletivos (salto vertical, sprints, yo-yo test). A periodização linear não atende bem equipes. | 7 |
| 5 | Dr. Thiago G. | Pesquisador em hipertrofia, 12 anos. | As evidências (ACSM, Schoenfeld) estão atualizadas e corretas. A sugestão de séries/repetições por objetivo segue a literatura atual. | O banco de exercícios não classifica por cadeia cinética (aberto/fechado) nem por padrão de movimento (empurrar, puxar, agachar). | 9 |
| 6 | Prof. Eduardo H. | Personal trainer de alta renda, 16 anos. | O relatório PDF fica profissional — meus alunos adoram receber. O design é moderno e passa confiança. | O relatório não permite personalização com logo ou cores da marca. Também não envia por e-mail automático. | 8 |
| 7 | Dra. Patrícia M. | Fisioterapeuta + EF, reabilitação esportiva, 13 anos. | As restrições clínicas por exercício são um achado — evita lesão. A detecção de condições na anamnese + prescrição segura = combinação perfeita. | Falta mostrar alternativa terapêutica quando o exercício é contraindicado. A sugestão de carga inicial para pós-reabilitação é agressiva. | 9 |
| 8 | Prof. Ricardo S. | Coordenador de academia de rede, 15 anos. | Gerenciamento de múltiplos alunos com histórico de avaliações é bom para fidelização. O dashboard mensal ajuda mostrar resultado. | Não tem integração com sistemas de catraca/presença da academia. O cadastro de aluno não tem campos de contato de emergência. | 7 |
| 9 | Dr. Fábio L. | Doutor em envelhecimento, gerontologia, 22 anos. | Protocolos de avaliação física para idosos são adequados. Risco cardiovascular ACSM é bem implementado — essencial para essa faixa etária. | Os exercícios sugeridos para idosos são os mesmos do público jovem — faltam variações para mobilidade reduzida. | 8 |
| 10 | Profa. Vivian T. | CrossFit L-1 coach, 10 anos. | Gosto da flexibilidade para montar treinos diferentes. A busca com vídeo embedado é útil para demonstrar execução. | CrossFit tem metodologia própria — o sistema não entende WODs, AMRAPs, EMOMs. A periodização clássica não se aplica. | 6 |

**Média especialistas:** 7.8

## Iniciantes

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Gustavo P. | Formado há 8 meses, personal trainer autônomo. | Eu não sabia montar periodização direito — o sistema faz isso por mim. As sugestões de progressão me dão segurança. | No começo não entendi os termos técnicos (monotonia, strain). Precisaria de um glossário embutido. | 9 |
| 2 | Letícia R. | Estagiária de EF, 5o semestre. | Usar o sistema na faculdade está me ensinando prescrição na prática. As diretrizes do ACSM aparecem na hora certa. | Alguns conceitos (PSE de sessão, zonas de FC) não têm explicação. Seria bom ter tooltips ou help inline. | 9 |
| 3 | Hugo N. | Formado em transição (ex-administrador), 1 ano. | O sistema estrutura todo o processo — anamnese → avaliação → prescrição. Me siente seguro seguindo o passo a passo. | É muita informação de uma vez. As abas são cheias de campos. Poderia ter um modo "guiado" para iniciantes. | 8 |
| 4 | Stefany A. | Recém-formada, atende em domicílio e parques. | A avaliação física com dobras cutâneas e bioimpedância no celular funciona. Os vídeos dos exercícios são ótimos para mostrar ao aluno. | Usar no sol (parque) a tela fica invisível. Faltam áudios explicativos ou comando de voz para não precisar olhar. | 7 |
| 5 | Diego C. | Formado há 2 anos, professor de musculação de academia. | Montei treino A/B/C para 30 alunos em um dia com o sistema. A busca e sugestão por foco agiliza demais. | Não tem aplicativo do aluno — preciso enviar screenshot. O PDF é bom mas não substitui um app. | 8 |
| 6 | Tainá O. | Profissional de dança, recém-formada em EF. | Gostei da parte de flexibilidade e avaliação postural. O BodyMap integrado é legal para marcar assimetrias. | Dança não tem suporte — não reconhece termos como "pliê", "arabesque". A flexibilidade é medida sem os testes específicos (sentar-e-alcançar, etc.). | 6 |
| 7 | Wesley M. | Militar, formado em EF, treina BOPE. | Avaliação de condicionamento (Cooper, 1RM) e a periodização são boas para planejamento operacional. | Os exercícios são de academia — faltam exercícios calistênicos, com kettlebell e treino funcional militar. | 7 |
| 8 | Sabrina C. | Mãe, atende online (home office), 3 anos de formada. | Consigo montar treino para cada aluno e enviar PDF por WhatsApp. O sistema roda bem no Chrome mesmo com internet fraca. | A versão mobile do site poderia ser melhor — não tem app. Controle de frequência dos alunos teria que ser manual. | 8 |
| 9 | Matheus J. | Formado há 1 ano, estagiário em clínica de reabilitação cardíaca. | A estratificação de risco cardiovascular ACSM é excelente para triagem. As zonas de treino por FC (Karvonen) são corretas. | Para reabilitação cardíaca faltam protocolos específicos (fase I, II, III). A prescrição é genérica demais para cardíacos. | 7 |
| 10 | Aline F. | Educadora física infantil, 4 anos. | Cadastro de alunos com dados antropométricos é completo. A evolução do crescimento (IMC por idade) seria útil. | Foco total em adulto — não tem nada para público infantil (lúdico, brincadeiras, coordenação motora). Exercícios são todos para adultos. | 5 |

**Média iniciantes:** 7.4

**Média geral Educação Física:** 7.6

---

# Módulo: Agenda

## Especialistas

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Dra. Renata K. | Proprietária de clínica, 14 anos de gestão. | Visualização dia/semana/mês completa. O drag-and-drop é muito prático para remarcar. | Falta sincronização Google Calendar/Outlook. A agenda não envia lembrete por WhatsApp automático. | 7 |
| 2 | Dr. Marcos V. | Fisioterapeuta com agenda lotada (40 pacientes/semana). | Atalhos de teclado e clique duplo para criar consulta agilizam. O bloqueio de horários é útil. | Não tem alerta de conflito de horário. Já marquei dois pacientes no mesmo horário sem querer. | 8 |
| 3 | Prof. Cláudia R. | Secretária de clínica (uso administrativo), 10 anos. | Interface clara e status visuais (check-in, concluído). Consigo ver o fluxo da clínica rapidamente. | Não tem busca rápida por nome do paciente na agenda. A impressão da agenda semanal não é boa. | 7 |
| 4 | Dr. Otávio L. | Gestor de clínica multidisciplinar, 18 anos. | Os status (agendado, em andamento, concluído, falta) são adequados para gestão. Falta justificada/injustificada é útil. | Não gerencia múltiplos profissionais na mesma agenda. Cada profissional precisa de visão separada. | 6 |
| 5 | Dra. Isabela G. | Osteopata, 20 anos, atende 1 paciente/hora. | Agenda visual simples e sem poluição visual. O histórico de presença do paciente aparece. | Para atendimento de 1h, a agenda em slot de 30 min é ruim. Poderia ter duração personalizada por procedimento. | 8 |
| 6 | Dr. Sérgio T. | Cardiologista (usa o sistema para apoio), 25 anos. | A integração de iniciar sessão direto da agenda é boa prática. Não precisa abrir ficha separada. | Não diferencia tipo de consulta (primeira vez vs retorno). Faltam cores personalizáveis por tipo. | 7 |
| 7 | Prof. Luciana F. | Personal trainer, atende em domicílio, 9 anos. | Consigo organizar deslocamentos entre alunos. A agenda mobile funciona bem. | Falta função de rota/deslocamento entre endereços. Marcar endereço do aluno automaticamente seria útil. | 7 |
| 8 | Dr. Fernando A. | Coordenador de estágio (clínica escola), 12 anos. | Permite gerenciar horários de estagiários e pacientes. O bloqueio de horários para reuniões é bom. | Não tem aprovação de horário (aluno solicita, coordenador aprova). A gestão de capacidade por período é manual. | 6 |
| 9 | Dra. Eliane S. | Fonoaudióloga, 16 anos. (Usa junto com fisioterapia.) | Atendimento individual bem representado. Registro de evolução integrado é funcional. | Agenda fonoaudiológica tem particularidades (terapia em grupo, duração variável) que não são suportadas. | 6 |
| 10 | Prof. Diego P. | Preparador físico de clube, 15 anos. | A agenda coletiva (treinos em grupo) é básica mas funciona. | Para clube com 50 atletas, a agenda individual não escala. Precisaria de agenda coletiva por modalidade/turma. | 5 |

**Média especialistas:** 6.7

## Iniciantes

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Karen B. | Secretária recém-contratada (primeiro emprego), 6 meses. | Achei fácil de aprender. Drag-and-drop é intuitivo. As cores dos status ajudam a organizar. | No começo me confundi com os botões. Alguns ícones não são óbvios — precisaria de tooltips. | 8 |
| 2 | Pedro H. | Fisioterapeuta autônomo, 2 anos de formado. | Organizou meus horários — antes usava papel. Consigo ver o mês inteiro e planejar férias. | O app não notifica no celular quando tem consulta marcada. Perdi horário porque não vi. | 8 |
| 3 | Jéssica M. | Recém-formada, montando agenda pela primeira vez. | A criação de horário fixo (ex.: seg/qua/sex 8-12) funcionou bem. Não precisei fazer manualmente cada slot. | Não achei como criar exceções (feriados). Tive que bloquear manualmente cada data. | 7 |
| 4 | Rafael T. | Personal trainer, 3 anos, agenda em parque público. | No celular funciona bem para ver o próximo aluno e marcar horário. | Marcar horário no celular é difícil (toque fino). Não tem widget para tela inicial. | 7 |
| 5 | Amanda G. | Profissional de pilates, 1 ano de formada. | Agenda por turma (até 5 alunos) funcionou depois que descobri como fazer. | Não estava óbvio como marcar turma vs individual. Tive que perguntar para um colega. | 6 |
| 6 | Bruno C. | Estudante estagiário, 7o semestre. | Uso para controlar horários de estágio. O bloqueio de horário "não disponível" é útil. | A agenda não mostra quantos pacientes você atendeu no mês. Não tem relatório de produtividade. | 7 |
| 7 | Vanessa P. | Mãe, home office, 4 anos, atende 10 pacientes. | Agenda simples resolve meu volume. Status "concluído" ajuda a saber quem já veio. | Não tem integração com WhatsApp. Preciso avisar cada paciente manualmente. | 7 |
| 8 | Leandro S. | Profissional de educação física, aula em grupo, 2 anos. | Agendar horários para aulas de grupo funcionou. Posso ver os inscritos. | Não controle de presença em grupo (check-in). Marcar quem veio em cada aula é manual. | 6 |
| 9 | Tábata C. | Esteticista, 3 anos (usa o sistema como prontuário). | Posso marcar sessões e ver evolução. Agenda integrada com ficha ajuda. | Os procedimentos estéticos não estão na lista. Crio manualmente. A agenda não tem campos específicos. | 6 |
| 10 | Fábio N. | Fisioterapeuta recém-formado, clínica popular, 8 meses. | A agenda gratuita no plano Start já organiza meu dia. Uso para controle financeiro básico. | Plano Start limita número de pacientes na agenda. Quando cheia, preciso anotar fora. | 7 |

**Média iniciantes:** 6.9

**Média geral Agenda:** 6.8

---

# Módulo: Financeiro

## Especialistas

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Dra. Sílvia M. | Administradora de clínica, 20 anos em gestão. | Relatório de receita por período é claro e funcional. A separação recebido/a receber é essencial. | Não emite nota fiscal. O controle é gerencial, não fiscal. Falta conciliação bancária. | 6 |
| 2 | Dr. Júlio C. | Proprietário de 2 clínicas, 15 anos. | Consigo ver faturamento mensal de cada unidade separada. Os gráficos são úteis para reunião de equipe. | Não tem fluxo de caixa projetado (receitas futuras). Preciso fazer em Excel paralelo. | 7 |
| 3 | Profa. Margarete B. | Controller financeira, 12 anos. | Planilha de despesas por categoria (aluguel, material, marketing) é bem organizada. | As categorias de despesa são fixas. Não posso criar. Falta centro de custo por profissional. | 7 |
| 4 | Dr. Rogério F. | Consultor de clínicas, 18 anos. | A margem de lucro por período é um indicador que recomendo para todos os meus clientes. | Os dados não são exportáveis para contador (falta CSV estruturado). A base é só localStorage. | 6 |
| 5 | Dra. Helena A. | Fisioterapeuta, gestora de equipe (4 profissionais), 16 anos. | Honorários CREFITO já tabelados por estado facilitam precificação. Consigo calcular valor de consulta por procedimento. | A tabela CREFITO está incompleta — faltam atos e procedimentos. Também não tem reajuste anual automático. | 7 |
| 6 | Dr. Márcio P. | Planejador financeiro de saúde, 22 anos. | A análise de receita por paciente (quem paga mais) é útil para direcionar marketing. | Indicadores de performance (ticket médio, custo por paciente, break-even) não estão disponíveis. | 7 |
| 7 | Prof. Antônio V. | Economista, diretor administrativo de hospital-dia, 20 anos. | Controle de inadimplência funcional. Marcar como "pago" e ver pendências é simples. | Para hospital-dia o fluxo é mais complexo (diárias, procedimentos, materiais). O sistema é simplificado demais. | 5 |
| 8 | Dra. Marcela O. | Proprietária de clínica de pilates, 10 anos. | Consigo ver qual plano (pacote) cada aluno comprou. O controle por sessão é bom. | Controle de pacotes (10 sessões, 20 sessões) é manual. O sistema não descontou automaticamente. | 6 |
| 9 | Dr. Pedro B. | Gestor de plano de saúde (parceria clínica), 15 anos. | A diferenciação consulta particular/convênio é útil para relatórios de parceria. | Faltam tabelas de convênios (Amil, Bradesco, Unimed) com valores de cada procedimento. | 6 |
| 10 | Prof. Luiz G. | Tesoureiro de clínica escola universitária, 25 anos. | O financeiro básico organiza o que antes era planilha. Bom para apresentar para a diretoria. | Não tem fluxo por centro de custo (cada estágio é um centro). A clínica escola precisa de mais granularidade. | 6 |

**Média especialistas:** 6.3

## Iniciantes

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Carla M. | Fisioterapeuta autônoma, 1 ano, atendimento em casa. | Pela primeira vez vi quanto estou ganhando no mês. Antes eu não tinha ideia. O gráfico é motivador. | As despesas que cadastro somem quando troco de mês? Achei confuso. Um tutorial inicial ajudaria. | 9 |
| 2 | Eduardo S. | Personal trainer, 3 anos, 20 alunos. | Finanças integradas com a agenda (sessão realizada = valor a receber) é inteligente. | Nem sempre o aluno paga no dia da sessão. O sistema marca como "recebido" e eu perco o controle de pendências. | 7 |
| 3 | Tamires L. | Recém-formada, primeiro consultório. | Me ajudou a definir preço dos serviços baseado na tabela CREFITO. Não sabia por onde começar. | O plano gratuito não tem o módulo financeiro completo. Tive que assinar o Evidencia para liberar. | 7 |
| 4 | Fernando G. | Profissional de EF, autônomo, 2 anos. | Ver receita vs despesa abriu meus olhos para onde estou gastando. Cortei assinaturas desnecessárias. | Não tem previsão de imposto (DAS, IRPF). O contador ainda pede planilha separada. | 7 |
| 5 | Juliana K. | Mãe, home office, 15 pacientes/mês. | Simples de usar. Marcar recebido/não recebido é intuitivo. Consigo ver quem está devendo. | Se eu marco "pago" errado, não tem "estornar". Já perdi controle de um pagamento. | 8 |
| 6 | André F. | Fisioterapeuta de clínica popular, 8 meses. | Saber exatamente o lucro no fim do mês me ajuda a planejar crescimento. | Não registro despesas fixas (não achei onde). Então o lucro mostrado não é real. | 7 |
| 7 | Patrícia D. | Esteticista, 4 anos. | Uso para controle de comissão das minhas funcionárias. O financeiro por profissional ajuda. | O sistema não calcula comissão percentual automaticamente. Tenho que fazer manual. | 6 |
| 8 | Roberto C. | Pilates, 2 anos, estúdio em casa. | O gráfico de receita mensal é bonito e mostro para minha esposa. Dá orgulho. | Parece que os valores somem depois de 6 meses? Não sei se o histórico é limitado. | 7 |
| 9 | Ana J. | Estudante estagiária, gerencia pequena clínica escolar. | Aprendi na prática como funciona financeiro de clínica. Ótimo para currículo. | Não tem relatório de inadimplência por período. Preciso somar manualmente. | 6 |
| 10 | Wesley R. | Educador físico de academia de bairro, 5 anos. | Uso para controle de mensalidades de alunos. Melhor que caderno. | Se o aluno paga no dinheiro, tenho que lançar manualmente. Não integra com maquininha. | 6 |

**Média iniciantes:** 7.0

**Média geral Financeiro:** 6.65

---

# Módulo: Inteligência Artificial (Análise Clínica)

## Especialistas

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Dr. Gustavo H. | Fisioterapeuta pesquisador, 12 anos, doutorando em IA em saúde. | A qualidade das análises clínicas usando Claude é impressionante. O diagnóstico diferencial sugerido é coerente na maioria dos casos. | A IA às vezes sugere condutas genéricas demais. Falta fine-tuning com base no histórico do paciente. O custo por análise é alto. | 8 |
| 2 | Dra. Daniela M. | Mestre em tecnologia em saúde, 15 anos. | Economizo 30 min por paciente na redação do diagnóstico e plano. Uso como rascunho e ajusto. | A IA não considera contraindicações medicamentosas. Uma análise de interação fármaco-tratamento seria ouro. | 8 |
| 3 | Dr. Felipe R. | Clínico geral (usa o sistema para apoio diagnóstico), 18 anos. | A sugestão de diagnósticos baseada em sintomas é precisa para condições comuns. Surpreendentemente bom para um sistema nacional. | Para condições raras ou apresentações atípicas, a IA frequentemente erra. Precisa de indicação de incerteza mais clara. | 7 |
| 4 | Prof. Alexandre P. | Doutor em bioética, 20 anos, coordena comitê de ética. | A privacidade dos dados (tudo local) é tranquilizadora. A IA não compartilha dados com terceiros visivelmente. | A transparência sobre o uso dos dados para treino do modelo não é clara. Precisaria de termo de consentimento integrado. | 7 |
| 5 | Dra. Fabíola S. | Fisioterapeuta traumato-ortopédica, 16 anos. | A correlação entre achados do exame físico e possíveis diagnósticos é boa. Sugere exames complementares pertinentes. | A IA não interpreta imagem (RX, ressonância). Seria o próximo passo lógico. A análise fica limitada ao texto. | 7 |
| 6 | Dr. Eduardo N. | Médico do esporte, 22 anos. | Análise de risco cardiovascular e liberação para atividade física é bem feita. A IA cruza fatores de risco corretamente. | Falta análise de eletrocardiograma e ergometria. A liberação cardiológica ainda depende de médico. | 7 |
| 7 | Profa. Lívia B. | Pesquisadora em reabilitação, 14 anos. | A IA referencia evidências (PEDro, Cochrane) nas sugestões — raro em sistemas nacionais. Útil para justificar conduta. | As referências citadas nem sempre são as mais recentes. A base de evidências precisa ser atualizada com maior frequência. | 8 |
| 8 | Dr. Ricardo M. | Chefe de serviço de fisioterapia hospitalar, 19 anos. | A análise de evolução do paciente ao longo das sessões ajuda na tomada de decisão clínica. | No ambiente hospitalar, a troca de informações com o prontuário eletrônico é essencial. A IA fica isolada. | 7 |
| 9 | Dra. Cristiane O. | Proprietária de clínica de reabilitação neurológica, 17 anos. | A IA ajuda a equipe menos experiente a não perder diagnósticos diferenciais importantes. Reduz erro médico. | Em neurologia, a IA é limitada — lesões medulares, AVC, Parkinson têm particularidades que o modelo não capta bem. | 6 |
| 10 | Dr. Marcos T. | Futurista, consultor de transformação digital em saúde, 25 anos. | É um dos sistemas mais inovadores que vi no Brasil. A combinação IA + evidências + escalas validadas é única. | A IA precisa de mais dados de entrada para ser realmente útil. Quanto mais completa a avaliação, melhor a análise. | 9 |

**Média especialistas:** 7.4

## Iniciantes

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Renan O. | Recém-formado, inseguro com diagnósticos. | A IA me dá segurança para fechar o raciocínio clínico. Comparo com o que pensei e vejo se faz sentido. | Já aconteceu de eu confiar cegamente e a IA sugerir algo errado. Perigo de dependência. | 9 |
| 2 | Talita C. | Estagiária (8o semestre). | Uso a IA para estudar — vejo o diagnóstico que o sistema sugeriu e pesquiso sobre. Aprendo muito. | Às vezes os termos são avançados demais. A IA deveria explicar o raciocínio em linguagem mais simples. | 9 |
| 3 | Igor B. | Formado há 1 ano, primeiro emprego em clínica. | O plano de tratamento sugerido pela IA me dá um ponto de partida. Edito e adapto, mas não começo do zero. | A IA usa linguagem técnica, então se o paciente pede explicação, tenho que traduzir. | 8 |
| 4 | Nathália F. | Migrou de área (administração para fisioterapia), 2 anos. | A análise da IA me ajuda a não esquecer de perguntar coisas importantes na anamnese. | A IA seria mais útil se perguntasse de volta (interativa) em vez de só analisar texto. | 8 |
| 5 | Leandro D. | Personal trainer, 3 anos, usa análise de lesão. | A IA detectou uma restrição que eu não tinha visto (síndrome do túnel do carpo). Encaminhei ao médico e o diagnóstico confirmou. | A IA deu alerta falso positivo outra vez. Às vezes gera ansiedade desnecessária. | 8 |
| 6 | Bianca S. | Fisioterapeuta domiciliar, 4 anos. | Economizo tempo escrevendo relatório de evolução. A IA gera um texto bem estruturado. | O texto gerado é formal demais. Para o paciente entender, preciso resumir. | 7 |
| 7 | Caio A. | Profissional de pilates, 2 anos, atendimento em grupo. | Consigo gerar análise individual para cada aluno rapidamente. | a IA não entende bem pilates (terminologia). Sugere exercícios que não são de pilates. | 6 |
| 8 | Débora L. | Recém-formada, clínica popular (alto volume). | A IA agiliza o atendimento. Faço anamnese rápida e a IA completa o raciocínio. | Análise ilimitada só no plano caro (R$ 79,90). Para clínica popular, o custo inviabiliza. | 7 |
| 9 | Gustavo M. | Educador físico, 5 anos, atendimento a idosos. | A IA sugere adaptações para limitações físicas. Ajuda a prescrever exercício seguro. | Idosos têm múltiplas comorbidades e medicações — a IA não considera interações medicamentosas. | 7 |
| 10 | Aline N. | Mãe, home office, 10 pacientes, 6 anos de formada. | Uso a IA como segunda opinião. Quando estou em dúvida, consulto antes de decidir. | A IA não substitui o olhar clínico. Às vezes o que faz sentido no texto não é o que o paciente apresenta. | 8 |

**Média iniciantes:** 7.7

**Média geral IA:** 7.55

---

# Módulo: Planos e Assinatura

## Especialistas

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Dr. Marcelo B. | Proprietário de clínica, 15 anos. | Plano Clinicas (R$ 49,90) é bem completo pelo valor. A adição de profissionais é justa. | O salto de preço de Evidencia (R$ 14,90) para Clinicas (R$ 49,90) é grande. Poderia ter um intermediário. | 8 |
| 2 | Dra. Paula S. | Fisioterapeuta autônoma, 12 anos. | Plano Start (R$ 9,90) é acessível. Dá para testar o sistema sem compromisso. | Start é muito limitado (pacientes, sem IA). Para usar de verdade precisa do Evidencia. | 7 |
| 3 | Prof. Rogério C. | Coordenador de curso, avalia sistemas para clínica escola. | O modelo de precificação é honesto. Sem surpresas — o que está escrito é o que é oferecido. | Para clínica escola, o limite de pacientes do Clinicas pode ser pouco. Precisaria de plano institucional. | 7 |
| 4 | Dr. Luciano F. | Gestor de saúde, 20 anos. | A flexibilidade de pagar análise IA avulsa (R$ 4,90) é boa para quem usa pouco. | AI análise avulsa é cara para uso frequente. Compensa assinar IA Premium se usar >16 análises/mês. | 7 |
| 5 | Dra. Andrea G. | Proprietária de clínica com 6 funcionários, 18 anos. | Preço justo comparado a sistemas concorrentes (ClínicaWeb, Versatiles). Entrega mais funcionalidades. | O limite de "usuários" (profissionais) no Clinicas é 3. Tenho 6. Precisaria de 2 assinaturas. | 6 |
| 6 | Prof. Hélio M. | Consultor de precificação de software em saúde, 25 anos. | A proposta de valor é boa — R$ 79,90 com IA + tudo incluso é competitivo. | O billing anual com 20% off é bom, mas a falta de desconto para pagamento antecipado perde vendas. | 8 |
| 7 | Dr. Eduardo V. | Fisioterapeuta concursado (usa como complemento). | Não preciso pagar — Start gratuito é viável para uso esporádico. | O Start sem IA é quase inútil para quem quer o diferencial do sistema. É só um teste. | 6 |
| 8 | Dra. Cíntia P. | Dono de clínica de pilates (franquia), 14 anos. | Plano Clinicas com até 3 unidades atende bem. A gestão separada de cada unidade funciona. | A fatura é única. Não consigo ratear entre as unidades para contabilidade. | 7 |
| 9 | Profa. Denise L. | Empresária de saúde, 22 anos, 4 franquias. | Já testei dezenas de sistemas — SASYRA tem o melhor custo-benefício para o que oferece. | Precisaria de uma call de vendas para negociar plano corporativo. O site só tem autosserviço. | 8 |
| 10 | Dr. Alexandre D. | Médico (ortopedista) usando o sistema para apoio. | O pay-per-use da IA é honesto. Não preciso assinar plano cheio. | Como médico, o sistema é focado em fisioterapia. Metade das funcionalidades não se aplicam. | 6 |

**Média especialistas:** 7.0

## Iniciantes

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Kelly M. | Recém-formada, sem $$ para investir. | O Start gratuito salvou minha vida. Consegui começar a atender com sistema profissional sem pagar nada. | A limitação de pacientes no Start me forçou a assinar rápido. Não deu tempo de testar tudo. | 9 |
| 2 | Diogo R. | Personal trainer, 2 anos, orçamento apertado. | O plano Start a R$ 9,90 é o preço de um café. Dá para usar e ver se gosta. | O Start não tem relatório PDF nem módulo financeiro. Os recursos que preciso estão no Evidencia (+R$ 14,90). | 7 |
| 3 | Sabrina T. | Estudante estagiária, sem renda. | Gostei que posso usar o sistema gratuitamente para aprender. A faculdade deveria ter parceria. | A versão gratuita não deixa explorar a IA. O diferencial do sistema fica escondido atrás do paywall. | 7 |
| 4 | Washington L. | Formado há 3 anos, primeiro consultório. | Assinei o Evidencia (R$ 14,90) e já atende minhas necessidades. IA não é essencial para mim. | Não testei a IA porque o Evidencia não inclui. Tenho curiosidade mas não quero pagar R$ 79,90. | 8 |
| 5 | Elisa C. | Mãe, home office, 2 anos. | Pago R$ 14,90/mês e está ótimo. O sistema me profissionalizou. | Se o preço subir, vou ter que reavaliar. Meu orçamento é justo. | 8 |
| 6 | Rafael G. | Fisioterapeuta recém-formado, clínica popular. | O valor anual com desconto (R$ 9,50/mês no Evidencia) é justo. | O desconto anual exige pagamento à vista. Para iniciante, R$ 114 de uma vez pesa. | 7 |
| 7 | Nicole A. | Profissional de EF, 1 ano de formada. | Assinei IA Premium (R$ 79,90) e uso a IA para tudo. O custo é alto mas vale pela economia de tempo. | R$ 79,90 é mais que Netflix + Spotify. Se não usar a IA todo dia, não compensa. | 7 |
| 8 | Fernando M. | Esteticista, 5 anos, atendimento domiciliar. | Queria só o módulo financeiro e agenda. O plano Start já resolve. | Os módulos não são vendidos separados. Pago por funcionalidades que não uso. | 6 |
| 9 | Viviane F. | Fisioterapeuta pediatra, 4 anos. | O plano que assinei atende bem. Superfície de atendimento pediátrico é limitada mas o preço é justo. | Paguei o ano inteiro e depois descobri que o módulo pediátrico não é bom. Me senti frustrada. | 6 |
| 10 | Celso P. | Profissional de educação física, 55+, 30 anos de mercado. | O preço é acessível. Meu neto me ajudou a instalar e estou gostando. | Achei confuso para assinar — muitos planos, muitos botões. Quase desisti. | 7 |

**Média iniciantes:** 7.2

**Média geral Planos:** 7.1

---

# Módulo: Performance Dashboard (Evolução)

## Especialistas

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | Prof. Cláudio N. | Preparador físico de atletas olímpicos, 20 anos. | Dashboard consolidado com % de gordura, VO2máx, 1RM tudo em uma tela é útil para reunião com atleta. | Dados históricos limitados — só mostra as últimas avaliações. Para atleta de alto nível, precisaria de anos de histórico. | 7 |
| 2 | Dra. Luciana T. | Nutricionista + EF, 14 anos. | A evolução de % de gordura em gráfico é motivadora para alunos. Uso na consulta para mostrar progresso. | O gráfico é bonito mas não tem meta visual (linha de objetivo). A interpretação poderia ser mais clara. | 8 |
| 3 | Prof. Marcelo S. | Doutor em comportamento motor, 18 anos. | Integração com os testes (Cooper, Rockport, 1RM) no dashboard é prática. Tudo centralizado. | O dashboard não tem indicadores preditivos (projeção de quando o aluno vai atingir a meta). | 7 |
| 4 | Dr. Rogério M. | Médico do esporte, 25 anos. | A classificação de risco ACSM integrada ao dashboard é útil para liberação médica. | Para avaliação médica, faltam dados como pressão arterial em repouso e durante exercício. | 7 |
| 5 | Prof. Fábio D. | Personal trainer de terceira idade, 16 anos. | Meus alunos idosos gostam de ver o gráfico de evolução — dá senso de progresso. | Para idosos, % de gordura e VO2máx não são os únicos indicadores. Faltam testes funcionais (Timed Up and Go, etc.). | 6 |
| 6 | Profa. Renata O. | Coordenadora de academia, 12 anos. | Consigo gerar relatório de evolução para cada aluno. Ajuda na retenção. | O relatório PDF não tem espaço para observações do professor. É impessoal. | 7 |
| 7 | Dr. Eduardo P. | Cientista de dados esportivos, 10 anos. | Os cálculos de volume semanal e monotonia são interessantes do ponto de vista de análise de treinamento. | A análise de carga de treino sazonal (períodos de maior volume) não existe. Os dados são muito "soltos". | 7 |
| 8 | Prof. Alexandre C. | Treinador de powerlifting, 15 anos. | O cálculo de 1RM preditivo (média de 3 equações) é o melhor que vi em sistemas nacionais. | O dashboard não tem gráfico de progressão de 1RM por exercício (só geral). Para powerlifting, quero ver supino separado. | 8 |
| 9 | Dra. Simone G. | Fisioterapeuta especializada em dor crônica, 16 anos. | A evolução de PSE ao longo das semanas ajuda a correlacionar percepção de esforço com progresso. | A PSE é subjetiva e varia muito com o humor. Um indicador mais objetivo (como carga absoluta) seria útil para comparar. | 7 |
| 10 | Prof. Ronaldo F. | Treinador de endurance (maratona, ciclismo), 22 anos. | VO2máx (Cooper/Rockport) com evolução temporal é ótimo para atletas de endurance. | Para endurance, faltam métricas como potência funcional (FTP), limiar de lactato, economia de movimento. | 6 |

**Média especialistas:** 7.0

## Iniciantes

| # | Persona | Perfil | Prós | Contras | Nota |
|---|---------|--------|------|---------|------|
| 1 | João V. | Personal trainer, 2 anos, 15 alunos. | Mostrar o dashboard no primeiro feedback deu super certo. O aluno ficou impressionado. | Consigo ver os dados mas não sei interpretar direito para explicar ao aluno. Tutoriais de interpretação ajudariam. | 8 |
| 2 | Fernanda R. | Recém-formada, atendimento em domicílio. | Gráfico bonito e profissional — passo para os alunos no WhatsApp. Eles adoram. | No celular o dashboard fica desorganizado. Os gráficos são pequenos. Preciso usar notebook. | 7 |
| 3 | Leonardo B. | Estudante, 6o semestre, estágio em academia. | Uso o dashboard para preparar relatórios de estágio. O professor elogiou a apresentação. | Os dados de um aluno não se apagam? Testei com dados fictícios e sumiram depois — não confio. | 7 |
| 4 | Camila D. | Profissional de EF, 1 ano. | A evolução de % de gordura em gráfico é o que meus alunos mais gostam. Uso como argumento de venda. | Quando o aluno não melhora, o gráfico fica estagnado. Não tem alerta de platô ou sugestão de mudança. | 7 |
| 5 | Thiago O. | Mãe, home office, 8 alunos. | Consigo ver rapidamente quem está evoluindo e quem precisa de ajuste no treino. | A interface tem muita informação. Fico perdido entre tantos números. Um resumo executivo seria bom. | 7 |
| 6 | Patricia H. | Formada há 3 anos, pilates. | Mostrar evolução de postura (fotos antes/depois) seria ótimo. O dashboard não tem esse recurso. | Dashboard focado em dados de academia (força, resistência). Para pilates, não reflete o progresso real. | 5 |
| 7 | Wesley G. | Profissional de crossfit, 2 anos. | A evolução de 1RM é útil para ver progresso nos lifts principais. | CrossFit tem muitos movimentos — só 1RM geral não representa. | 6 |
| 8 | Aline R. | Educadora física infantil, 4 anos. | Tentei usar para ver evolução das crianças mas não faz sentido. Não tem métricas infantis. | Não usaria de novo. Precisa de métricas específicas para crianças (coordenação, flexibilidade). | 4 |
| 9 | Carlos E. | Personal trainer de idosos, 7 anos. | O dashboard motiva idosos quando veem evolução no gráfico. Eles se sentem orgulhosos. | O gráfico de % de gordura pode ser negativo para idosos com baixa autoestima. Precisaria de métricas de capacidade funcional. | 6 |
| 10 | Bruna F. | Recém-formada, clínica de emagrecimento. | Uso o dashboard como ferramenta de retenção — mostro na consulta de feedback. Funciona. | Se o aluno falta muito, o dashboard fica defasado. Não tem como preencher lacunas. | 7 |

**Média iniciantes:** 6.4

**Média geral Performance Dashboard:** 6.7

---

# Resumo Geral

| Módulo | Especialistas | Iniciantes | Média Geral |
|--------|:------------:|:----------:|:----------:|
| Fisioterapia | 7.8 | 7.7 | **7.75** |
| Educação Física | 7.8 | 7.4 | **7.6** |
| Agenda | 6.7 | 6.9 | **6.8** |
| Financeiro | 6.3 | 7.0 | **6.65** |
| IA (Análise Clínica) | 7.4 | 7.7 | **7.55** |
| Planos / Assinatura | 7.0 | 7.2 | **7.1** |
| Performance Dashboard | 7.0 | 6.4 | **6.7** |
| **Média Geral do Sistema** | **7.14** | **7.19** | **7.16** |

## Top 5 Prós Mais Citados

1. **Base de exercícios com vídeos demo** — citado por 18 personas como diferencial
2. **Detecção automática de condições na queixa** — citado por 15 personas como economia de tempo
3. **Interface profissional e organizada** — citado por 14 personas como fator de credibilidade
4. **CIF e escalas validadas integradas** — citado por 12 personas como funcionalidade única
5. **Cálculo de 1RM e volume de treino** — citado por 11 personas como preciso e útil

## Top 5 Contras Mais Citados

1. **Dados só no localStorage (sem backend)** — citado por 16 personas como risco de perda
2. **Falta app mobile para alunos** — citado por 14 personas como limitação
3. **Sem integração Google Calendar/WhatsApp** — citado por 12 personas como lacuna
4. **Falta suporte para áreas específicas (pediatria, neuro, crossfit)** — citado por 11 personas
5. **IA com custo alto e análises limitadas nos planos básicos** — citado por 10 personas
