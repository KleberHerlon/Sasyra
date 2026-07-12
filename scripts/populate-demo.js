(function () {
  "use strict";

  console.log(
    "%c╔══════════════════════════════════════════╗\n%c║   SASYRA — Populate Demo Data v1.0       ║\n%c║   11 pacientes · 10 evoluções cada        ║\n%c╚══════════════════════════════════════════╝",
    "color:#22c55e;font-weight:bold",
    "color:#22c55e;font-weight:bold",
    "color:#22c55e;font-weight:bold",
    "color:#22c55e;font-weight:bold"
  );

  // ── HELPERS ──────────────────────────────────────────────────

  function dateDaysAgo(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0, 10);
  }

  function weeksAgo(w) {
    return dateDaysAgo(w * 7);
  }

  function sessionDates(startWeeksAgo, count) {
    const dates = [];
    for (let i = 0; i < count; i++) {
      const w = startWeeksAgo - Math.floor(i / 2) * 1;
      const day = i % 2 === 0 ? 0 : 3;
      const d = new Date();
      d.setDate(d.getDate() - w * 7 - day);
      dates.push(d.toISOString().slice(0, 10));
    }
    return dates;
  }

  // ── CLEAR EXISTING DEMO DATA ─────────────────────────────────

  function clearDemoData() {
    [
      "sasyra_patients",
      "sasyra_assessments",
      "sasyra_logs",
      "sasyra_pagamentos",
      "sasyra_despesas",
      "sasyra_convenio_valores",
      "sasyra_signatures",
    ].forEach((k) => localStorage.removeItem(k));

    // Remove enhancer data for all demo patients
    const moduleIds = [
      "ortopedica",
      "neurologica",
      "cardioRespiratoria",
      "geriatria",
      "pediatrica",
      "dermatoFuncional",
      "uroginecologica",
      "oncologica",
      "esportiva",
      "reumatologica",
    ];
    const demoIds = [
      "demo_orto_1",
      "demo_neuro_1",
      "demo_cardio_1",
      "demo_geria_1",
      "demo_ped_1",
      "demo_derm_1",
      "demo_uro_1",
      "demo_onco_1",
      "demo_cross_1",
      "demo_sport_1",
      "demo_reum_1",
    ];
    for (const mod of moduleIds) {
      for (const pid of demoIds) {
        localStorage.removeItem(`${mod}_enhancer_${pid}`);
      }
    }
  }

  console.log("→ Limpando dados demo antigos...");
  clearDemoData();

  // ── 1. SUBSCRIPTION ──────────────────────────────────────────

  localStorage.setItem("sasyra_module", "fisioterapia");
  localStorage.setItem(
    "sasyra_subscription",
    JSON.stringify({
      plan: "evidencia",
      aiAnalysesUsed: 0,
      aiPeriodStart: new Date().toISOString().slice(0, 7),
      aiExpansion: null,
    })
  );
  console.log("✓ Subscription: Evidência (40 análises/mês)");

  // ── 2. PATIENTS ──────────────────────────────────────────────

  const patients = [
    {
      id: "demo_orto_1",
      nome: "Carlos Eduardo Silva",
      dataNasc: "1981-03-15",
      sexo: "Masculino",
      profissao: "Motorista de caminhão",
      convenio: "Particular",
      peso: 88,
      altura: 178,
      telefone: "(11) 98765-4321",
      lateralidade: "Destro",
      estadoCivil: "Casado",
      assignedModules: ["ortopedica"],
      data: dateDaysAgo(60),
    },
    {
      id: "demo_neuro_1",
      nome: "Maria Aparecida Santos",
      dataNasc: "1968-07-22",
      sexo: "Feminino",
      profissao: "Professora aposentada",
      convenio: "Unimed",
      peso: 72,
      altura: 162,
      telefone: "(11) 97654-3210",
      lateralidade: "Destra",
      estadoCivil: "Viúva",
      assignedModules: ["neurologica"],
      data: dateDaysAgo(50),
    },
    {
      id: "demo_cardio_1",
      nome: "José Roberto Almeida",
      dataNasc: "1964-11-08",
      sexo: "Masculino",
      profissao: "Bancário",
      convenio: "Bradesco Saúde",
      peso: 95,
      altura: 175,
      telefone: "(11) 96543-2109",
      lateralidade: "Destro",
      estadoCivil: "Casado",
      assignedModules: ["cardioRespiratoria"],
      data: dateDaysAgo(55),
    },
    {
      id: "demo_geria_1",
      nome: "Dona Cleonice Ferreira",
      dataNasc: "1948-01-10",
      sexo: "Feminino",
      profissao: "Do lar",
      convenio: "Particular",
      peso: 58,
      altura: 155,
      telefone: "(11) 95432-1098",
      lateralidade: "Destra",
      estadoCivil: "Viúva",
      assignedModules: ["geriatria"],
      data: dateDaysAgo(85),
    },
    {
      id: "demo_ped_1",
      nome: "Lucas Oliveira Martins",
      dataNasc: "2019-06-20",
      sexo: "Masculino",
      profissao: "Estudante",
      convenio: "SUS / NASF",
      peso: 22,
      altura: 118,
      telefone: "(11) 94321-0987",
      lateralidade: "Destro",
      estadoCivil: "Solteiro",
      assignedModules: ["pediatrica"],
      data: dateDaysAgo(85),
    },
    {
      id: "demo_derm_1",
      nome: "Fernanda Costa Lima",
      dataNasc: "1992-09-05",
      sexo: "Feminino",
      profissao: "Empresária",
      convenio: "Particular",
      peso: 67,
      altura: 168,
      telefone: "(11) 93210-9876",
      lateralidade: "Destra",
      estadoCivil: "Casada",
      assignedModules: ["dermatoFuncional"],
      data: dateDaysAgo(40),
    },
    {
      id: "demo_uro_1",
      nome: "Patrícia Nunes Souza",
      dataNasc: "1984-12-03",
      sexo: "Feminino",
      profissao: "Advogada",
      convenio: "Amil",
      peso: 65,
      altura: 164,
      telefone: "(11) 92109-8765",
      lateralidade: "Destra",
      estadoCivil: "Casada",
      assignedModules: ["uroginecologica"],
      data: dateDaysAgo(55),
    },
    {
      id: "demo_onco_1",
      nome: "Sandra Regina Alves",
      dataNasc: "1971-05-18",
      sexo: "Feminino",
      profissao: "Secretária executiva",
      convenio: "SulAmérica",
      peso: 70,
      altura: 163,
      telefone: "(11) 91098-7654",
      lateralidade: "Destra",
      estadoCivil: "Divorciada",
      assignedModules: ["oncologica"],
      data: dateDaysAgo(70),
    },
    {
      id: "demo_cross_1",
      nome: "Thiago Mendes Barbosa",
      dataNasc: "1997-08-14",
      sexo: "Masculino",
      profissao: "Atleta de CrossFit",
      convenio: "Particular",
      peso: 82,
      altura: 179,
      telefone: "(11) 90987-6543",
      lateralidade: "Destro",
      estadoCivil: "Solteiro",
      assignedModules: ["esportiva"],
      data: dateDaysAgo(55),
    },
    {
      id: "demo_sport_1",
      nome: "Amanda Rocha Carvalho",
      dataNasc: "1991-02-28",
      sexo: "Feminino",
      profissao: "Corredora amadora",
      convenio: "Particular",
      peso: 58,
      altura: 167,
      telefone: "(11) 89876-5432",
      lateralidade: "Destra",
      estadoCivil: "Solteira",
      assignedModules: ["esportiva"],
      data: dateDaysAgo(85),
    },
    {
      id: "demo_reum_1",
      nome: "Helena Dantas Vieira",
      dataNasc: "1974-04-25",
      sexo: "Feminino",
      profissao: "Costureira",
      convenio: "Unimed",
      peso: 64,
      altura: 160,
      telefone: "(11) 88765-4321",
      lateralidade: "Destra",
      estadoCivil: "Casada",
      assignedModules: ["reumatologica"],
      data: dateDaysAgo(85),
    },
  ];

  localStorage.setItem("sasyra_patients", JSON.stringify(patients));
  console.log(`✓ ${patients.length} pacientes criados`);

  // ── 3. CONVENIO_VALORES ─────────────────────────────────────

  const convenioValores = {
    demo_orto_1: { valor: 180, dataPrevista: dateDaysAgo(7) },
    demo_neuro_1: { valor: 120, dataPrevista: dateDaysAgo(14) },
    demo_cardio_1: { valor: 150, dataPrevista: dateDaysAgo(10) },
    demo_uro_1: { valor: 110, dataPrevista: dateDaysAgo(21) },
    demo_onco_1: { valor: 130, dataPrevista: dateDaysAgo(5) },
    demo_reum_1: { valor: 120, dataPrevista: dateDaysAgo(14) },
  };
  localStorage.setItem("sasyra_convenio_valores", JSON.stringify(convenioValores));
  console.log("✓ Convênios configurados");

  // ── 4. LOGS (EVOLUÇÕES) ─────────────────────────────────────

  const procedimentosBase = {
    demo_orto_1: [
      "TENS paravertebral L4-S1",
      "Mobilização articular Maitland L4-S1",
      "Exercício bird-dog 3x10",
      "Alongamento cadeia posterior",
      "Educação em dor",
    ],
    demo_neuro_1: [
      "Posicionamento no leito",
      "Alongamento passivo MMSS",
      "Facilitação neuromuscular",
      "Treino de ponte",
      "Marcha com dispositivo",
    ],
    demo_cardio_1: [
      "Monitorização PA/FC",
      "Exercício aeróbio esteira 20min",
      "Exercício resistido MMII",
      "Alongamento global",
      "Escala de Borg",
    ],
    demo_geria_1: [
      "Sit-to-stand 3x10",
      "Equilíbrio unipodal",
      "Marcha com obstáculos",
      "Fortalecimento extensores",
      "Educação prevenção quedas",
    ],
    demo_ped_1: [
      "Alongamento isquiotibiais",
      "Treino sentado bola suíça",
      "Marcha com pistas visuais",
      "Fortalecimento lúdico",
      "Brincadeira caranguejo",
    ],
    demo_derm_1: [
      "Drenagem linfática Leduc",
      "Ultrassom 3MHz pulsado",
      "Laser 660nm 4J/cm²",
      "Massagem modeladora",
      "Radiofrequência",
    ],
    demo_uro_1: [
      "Biofeedback MAP",
      "Exercício Kegel sustentado",
      "Eletroestimulação 50Hz",
      "Treino the knack",
      "Cones vaginais",
    ],
    demo_onco_1: [
      "DLM Leduc/Földi",
      "Exercício Codman",
      "Polia para ADM ombro",
      "Laser baixa potência cicatriz",
      "Enfaixamento compressivo",
    ],
    demo_cross_1: [
      "Laser 904nm",
      "Mobilização glenoumeral",
      "Exercício pendular",
      "Rotadores externos faixa",
      "Abdução plano escapular",
    ],
    demo_sport_1: [
      "Isométrico quadríceps 45°",
      "Laser 904nm tendão",
      "Agachamento declinado",
      "Fortalecimento glúteo médio",
      "Crioterapia pós-exercício",
    ],
    demo_reum_1: [
      "Exercícios ativo-livres",
      "Termoterapia calor úmido",
      "Laser baixa potência",
      "Fortalecimento preensão",
      "Hidroterapia",
    ],
  };

  const evolucoes = {
    demo_orto_1: [
      "Paciente refere dor lombar EVA 6 ao movimento. Boa tolerância ao TENS e mobilização. Orientado sobre neurociência da dor.",
      "Melhora parcial. EVA 5. Iniciado bird-dog com boa execução. Paciente relata menos rigidez matinal.",
      "EVA 4. Evolução favorável. Adicionado dead bug ao programa. Mantém orientações posturais.",
      "Relata dor EVA 4 após longa viagem. Retomada gradual. Ênfase em alongamento de cadeia posterior.",
      "EVA 3. Boa progressão. Iniciada ponte de glúteos bilateral. Paciente mais confiante nos movimentos.",
      "EVA 3. Mantém evolução. Progressão para ponte unilateral. Iniciada prancha frontal 15s.",
      "EVA 2. Excelente resposta. Prancha lateral adicionada. Paciente relata dirigir 1h sem dor.",
      "EVA 2. Mantém ganhos. Agachamento isométrico 30s. Fortalecimento com faixa elástica para glúteo médio.",
      "EVA 1-2. Agachamento livre iniciado com boa técnica. Simulação entrada/saída de veículo satisfatória.",
      "EVA 1. Alta próxima. Paciente dirige 2h sem dor. Força extensores 4+/5. Orientações de manutenção fornecidas.",
    ],
    demo_neuro_1: [
      "Paciente com hemiparesia E. Posicionamento adequado, sling para ombro. Boa aceitação. Sem dor.",
      "Alongamento passivo de flexores MS com melhora de ADM. Paciente colaborativa. Iniciado rolamento.",
      "Iniciada ponte com auxílio moderado. Tônus MAS 1+ em MMII. Paciente motivada.",
      "Treino de alcance funcional com bom desempenho. Restrição de tronco parcial. Melhora no controle postural.",
      "Marcha com andador: 30m com supervisão. Fadiga moderada. BBS estimado 38/56.",
      "Progressão para 50m de marcha. Transição sentado-para-pé com auxílio mínimo. Tônus estável.",
      "Marcha 70m com auxílio mínimo. Iniciado treino de escada com corrimão. Paciente otimista.",
      "AVDs: lavar-se com supervisão. Melhora significativa na independência. Treino de vestir-se.",
      "Marcha 100m com bengala. BBS estimado 42/56. Transições posturais independentes com supervisão.",
      "BBS 45/56. Marcha comunitária com bengala. Velocidade 0,4 m/s. Alta programada em 2 semanas.",
    ],
    demo_cardio_1: [
      "Esteira 50% FC reserva, 20 min. TISS 2. Sem arritmias. PA 130/80. Boa tolerância.",
      "Progressão para 60% FCres, 25 min. TISS 3. Iniciado resistido 40% RM, 6 exercícios. Sem intercorrências.",
      "PA 128/78. Mantém protocolo. Paciente relata mais disposição. Adicionado circuito funcional leve.",
      "FCres 65%, 30 min esteira. TISS 3-4. Resistido 60% RM, 8 exercícios. Resposta hemodinâmica adequada.",
      "Borg 3-4 em esteira 30 min. Progressão carga resistida. Paciente realiza AVDs com menos fadiga.",
      "FCres 70%. Iniciado treino intervalado leve. Paciente monitorizado, sem eventos.",
      "Progressão para 70% FCres, 35 min. TISS 4. Circuito funcional com boa tolerância cardiovascular.",
      "Resistido 70% RM, 10 exercícios. Excelente condicionamento. Paciente relata subir escadas sem dispneia.",
      "Teste ergométrico informal: 8 METs estimados. Transição para programa de manutenção discutida.",
      "Alta para programa comunitário. Orientação exercícios domiciliares. Meta 8-10 METs alcançada.",
    ],
    demo_geria_1: [
      "Sit-to-stand 3x8 com supervisão. Paciente ansiosa. Orientações modificações domiciliares fornecidas.",
      "Melhora na confiança. 3x10 sit-to-stand sem auxílio. Equilíbrio semi-tandem 15s.",
      "Apoio unipodal com barra: 5s bilateral. Marcha com pistas visuais bem executada. Sem quedas desde início.",
      "Progressão sit-to-stand com halter 2kg. Tandem walk 8 passos. Instaladas barras no banheiro (relato).",
      "Leg press 60% RM estimado, 3x10. Extensão joelho 3x10. Paciente animada com ganhos.",
      "Subir degrau rápido 3x8. Equilíbrio unipodal sem apoio: 3s. Otago fase 2 iniciado.",
      "Remada baixa 3x12, supino 3x12. Força de preensão 16 kg (+2 kg). Marcha 0,8 m/s.",
      "TUG 13s (melhora de 3s). Paciente relata sair para feira sozinha. Excelente evolução funcional.",
      "Progressão carga resistida. Apoio unipodal 8s sem apoio. Marcha comunitária segura.",
      "TUG 11s, SARC-F 4/10. Velocidade marcha 0,9 m/s. Alta com programa domiciliar Otago. Sem quedas.",
    ],
    demo_ped_1: [
      "Alongamento sustentado de isquiotibiais 30s. Boa colaboração. Posicionamento noturno com AFO orientado.",
      "Fortalecimento dorsiflexores com brincadeira. Paciente engajado. Sentar na bola suíça: 2 min estável.",
      "Treino de marcha com pegadas coloridas: excelente adesão. Melhora no padrão equino durante brincadeiras.",
      "Obstáculos baixos com supervisão. Mãe relata mais confiança em casa. Fortalecimento glúteo médio lúdico.",
      "Subir escadas alternando pés com corrimão. Marcha em espuma com bom controle. AIMS previsto melhora.",
      "Circuito motor leve: saltos e agachamentos lúdicos. Criança muito participativa. Sem queixas álgicas.",
      "Progressão para superfícies variadas (grama sintética). Marcha mais estável, menos equino.",
      "Atividades aquáticas iniciadas 1x/semana. Relato materno de melhora no brincar com outras crianças.",
      "GMFM-66 em andamento. Marcha comunitária: parque com supervisão. Boa evolução motora global.",
      "AIMS percentil 25 (melhora +15). Marcha independente funcional. Alta com programa domiciliar lúdico.",
    ],
    demo_derm_1: [
      "DLM 40 min método Leduc. Edema grau 2 em abdome/flancos. Boa tolerância. Cinta compressiva 23h/dia.",
      "Ultrassom 3MHz pulsado + DLM. Equimose regredindo. Laser 660nm nas áreas residuais. Paciente otimista.",
      "Redução visível do edema. DLM mantida. Iniciada endermologia suave. Cinta mantida conforme orientação.",
      "Laser + DLM. Fibroedema geloide glúteos: iniciada massagem modeladora. Pele com boa resposta.",
      "Radiofrequência para flacidez abdominal. Paciente satisfeita com evolução estética. DLM 2x/semana.",
      "PEP/RPG para FEG glúteos. Resultados visíveis na textura da pele. Sem aderências palpáveis.",
      "DLM + radiofrequência. Exercícios hipopressivos iniciados. Paciente usando cinta noturna apenas.",
      "Região abdominal com boa definição. Sem fibrose. Continuidade do remodelamento tecidual.",
      "Massagem modeladora + DLM. Resultado estético muito satisfatório. Orientações de manutenção.",
      "Alta estética. Sem edema residual, boa elasticidade cutânea. Paciente satisfeita. Retorno em 3 meses.",
    ],
    demo_uro_1: [
      "Biofeedback com palpação digital. Oxford 2 confirmado. Ensinado Kegel sustentado 5s. Diário miccional iniciado.",
      "Kegel sustentado 6s + fibras rápidas. Paciente com boa consciência perineal. Diário mostra 4 episódios/dia.",
      "Eletroestimulação intracavitária 50Hz, 15 min. Boa tolerância. Oxford progredindo para 2+.",
      "Kegel em ortostatismo iniciado. 3 episódios/dia no diário. Paciente mais confiante em atividades sociais.",
      "Treino the knack com tosse. Boa coordenação MAP. Oxford 3. Pad test estimado 5g/24h.",
      "Exercícios hipopressivos iniciados. Kegel sustentado 8s. Cones vaginais: consegue segurar cone 2.",
      "Progressão cone 3 por 5 min. Sem perdas durante exercícios. Paciente relata voltar a correr.",
      "Pad test 3g/24h. Oxford 3+. The knack automatizado. Melhora significativa na qualidade de vida.",
      "Cone 4 por 10 min. Exercícios MAP em atividades dinâmicas. Sem episódios de perda na última semana.",
      "Oxford 4, Pad test < 2g/24h. PERFECT Power 4. Alta com manutenção domiciliar. Reavaliação em 6 meses.",
    ],
    demo_onco_1: [
      "DLM para linfedema grau I. Exercícios Codman iniciados. Boa tolerância. Enfaixamento compressivo orientado.",
      "Polia para flexão de ombro: ganho de 15°. DLM mantida. Laser na cicatriz: boa resposta tecidual.",
      "ADM flexão 140° (ganho +30°). Enfaixamento multicamadas mantido. Paciente motivada com progresso.",
      "Bastão para rotação externa. ADM abdução 120°. Linfedema controlado. Iniciada resistência leve.",
      "Fortalecimento com halter 1kg: elevação frontal e lateral. Sem aumento do linfedema. Boa tolerância.",
      "Progressão para 2kg halteres. Treino funcional de alcance. Braçadeira compressiva durante exercícios.",
      "ADM ombro completa (flexão 170°, abdução 165°). Resistência 60% RM. Linfedema grau 0-I.",
      "Fortalecimento 70% RM. AVDs com MSD sem restrições. Paciente relata independência total.",
      "Treino funcional avançado. Sem sinais de linfedema. Retorno às atividades laborais parciais.",
      "Alta fisioterapêutica. ADM completa, força 4+/5 MSD. Linfedema controlado. Manutenção domiciliar.",
    ],
    demo_cross_1: [
      "Laser 904nm + US 1MHz pulsado. Mobilização glenoumeral grau III. Codman orientado. EVA 6 em repouso.",
      "EVA 5. Polia para flexão. Exercícios pendulares com boa execução. Paciente ansioso sobre retorno.",
      "EVA 4. ADM melhorando. Iniciado rotadores externos com faixa elástica leve. Sem dor durante exercício.",
      "EVA 3. Remada baixa e exercícios para serrátil iniciados. Boa ativação escapular. Laser mantido.",
      "EVA 2-3. Abdução no plano escapular com halter 2kg. Fortalecimento progredindo bem.",
      "EVA 2. Prancha dinâmica tolerada. Progressão faixa elástica para rotação externa. Teste de Neer negativo.",
      "EVA 1-2. Iniciado snatch com PVC. Padrão de movimento corrigido. Paciente muito motivado.",
      "EVA 1. Overhead squat com PVC 3x10. Sem dor. Transição para barra 15kg autorizada.",
      "Snatch 25kg, 3x5. Metcon leve reintroduzido. Sem queixas álgicas. Mobilidade escapular normalizada.",
      "RTP parcial: WODs modificados. Força rotadores externos 5/5. Alta com programa de manutenção preventiva.",
    ],
    demo_sport_1: [
      "Isométrico quadríceps 5x45s. Laser 904nm + US 1MHz. Crioterapia pós. EVA 5 em repouso.",
      "EVA 4. Isométricos mantidos. Alongamento excêntrico assistido com boa tolerância. Sem piora.",
      "EVA 3. Iniciado agachamento declinado excêntrico em decline board 25°. Boa técnica.",
      "EVA 3. Progressão excêntricos. Fortalecimento glúteo médio e core iniciados. VISA-P estimado 60.",
      "EVA 2. Transição isométrico → isotônico. Agachamento com halter leve. Boa progressão de carga.",
      "EVA 2. Iniciada fase pliométrica leve (saltos baixos). Sem dor durante salto. VISA-P 68.",
      "EVA 1-2. Corrida intervalada: 5 min corrida / 2 min caminhada. Boa tolerância. Sem dor pós.",
      "EVA 1. Volume corrida +15% conforme protocolo. Salto > 85% do contralateral. Paciente confiante.",
      "EVA 0-1. Corrida contínua 20 min sem dor. VISA-P 78. Fortalecimento de manutenção.",
      "VISA-P 82/100. Salto > 90% contralateral. RTP: retorno à corrida de rua. Programa de prevenção.",
    ],
    demo_reum_1: [
      "Exercícios ativo-livres sem carga. Órteses noturnas orientadas. Termoterapia com calor úmido. DAS28 4.2.",
      "Boa tolerância aos exercícios. Laser baixa potência em MCFs e IFPs. Paciente relata menos rigidez matinal.",
      "Alongamentos globais com boa resposta. Proteção articular reforçada. Fadiga moderada mantida.",
      "Iniciado fortalecimento com massinha terapêutica. Exercícios resistidos leves 50% RM. DAS28 estimado 3.8.",
      "Progressão resistida 60% RM. Arco-finger exercícios. Hidroterapia 1x/semana: excelente resposta.",
      "Força de preensão 14 kg (+2 kg). Menos edema articular visível. Paciente relata costurar 1h sem dor.",
      "HAQ estimado 1.1. Fortalecimento progredindo. Paciente relata melhora na qualidade de vida.",
      "Exercícios domiciliares com boa adesão. DAS28 estimado 3.5. Articulações com menos sinais inflamatórios.",
      "Preensão 16 kg. Fortalecimento 70% RM mantido. Autogestão eficaz. Paciente independente nas AVDs.",
      "DAS28 3.2, HAQ 0.9. Preensão bilateral 17 kg. Alta com programa de autogestão. Reumatologista ciente.",
    ],
  };

  const evaValues = {
    demo_orto_1: [6, 5, 4, 4, 3, 3, 2, 2, 1, 1],
    demo_neuro_1: [null, null, null, null, null, null, null, null, null, null],
    demo_cardio_1: [null, null, null, null, null, null, null, null, null, null],
    demo_geria_1: [null, null, null, null, null, null, null, null, null, null],
    demo_ped_1: [null, null, null, null, null, null, null, null, null, null],
    demo_derm_1: [4, 3, 3, 2, 2, 1, 1, 1, 0, 0],
    demo_uro_1: [null, null, null, null, null, null, null, null, null, null],
    demo_onco_1: [4, 3, 3, 2, 2, 1, 1, 1, 0, 0],
    demo_cross_1: [6, 5, 4, 3, 3, 2, 2, 1, 1, 0],
    demo_sport_1: [5, 4, 3, 3, 2, 2, 2, 1, 1, 0],
    demo_reum_1: [5, 4, 4, 3, 3, 2, 2, 2, 1, 1],
  };

  let allLogs = [];
  let logIdCounter = 1000;

  for (const p of patients) {
    const pid = p.id;
    const dates = sessionDates(10, 10);
    const procs = procedimentosBase[pid] || [
      "Avaliação",
      "Exercícios terapêuticos",
    ];
    const evols = evolucoes[pid] || [];
    const evas = evaValues[pid] || [];

    for (let i = 0; i < 10; i++) {
      allLogs.push({
        id: logIdCounter++,
        patientId: pid,
        data: dates[i],
        eva: evas[i],
        procedimentos: procs,
        evolucao: evols[i] || `Sessão ${i + 1}/10. Evolução conforme plano terapêutico.`,
        resposta: "",
        metas: "",
        escalas: null,
        escalaData: null,
        pa: null,
        adms: [],
        mrcs: [],
        sessaoNum: i + 1,
        spo2: null,
        glucose: null,
        heartRate: null,
        isExpressVital: false,
      });
    }
  }

  localStorage.setItem("sasyra_logs", JSON.stringify(allLogs));
  console.log(`✓ ${allLogs.length} evoluções criadas (10 por paciente)`);

  // ── 5. PAGAMENTOS ───────────────────────────────────────────

  const pagamentos = {};
  for (const log of allLogs) {
    // Mark most as paid (sessions 1-8 paid, 9-10 pending for some)
    if (log.sessaoNum <= 8) {
      pagamentos[String(log.id)] = true;
    } else {
      pagamentos[String(log.id)] = false;
    }
  }
  localStorage.setItem("sasyra_pagamentos", JSON.stringify(pagamentos));

  const totalPaid = Object.values(pagamentos).filter(Boolean).length;
  console.log(`✓ ${totalPaid} pagamentos marcados como recebidos`);

  // ── 6. DESPESAS ─────────────────────────────────────────────

  const despesas = [
    {
      id: Date.now() + 1,
      data: "2026-01-01",
      descricao: "Aluguel sala comercial",
      categoria: "Aluguel",
      valor: 2200.0,
      recorrencia: "mensal",
    },
    {
      id: Date.now() + 2,
      data: "2026-01-05",
      descricao: "Conta de energia elétrica",
      categoria: "Contas",
      valor: 380.0,
      recorrencia: "mensal",
    },
    {
      id: Date.now() + 3,
      data: "2026-01-05",
      descricao: "Conta de água",
      categoria: "Contas",
      valor: 120.0,
      recorrencia: "mensal",
    },
    {
      id: Date.now() + 4,
      data: "2026-01-05",
      descricao: "Internet fibra óptica",
      categoria: "Contas",
      valor: 159.9,
      recorrencia: "mensal",
    },
    {
      id: Date.now() + 5,
      data: "2026-01-10",
      descricao: "Materiais de consumo (gel, eletrodos, papel)",
      categoria: "Materiais",
      valor: 250.0,
      recorrencia: "mensal",
    },
    {
      id: Date.now() + 6,
      data: "2026-01-15",
      descricao: "CREFITO mensalidade",
      categoria: "Assinaturas",
      valor: 89.9,
      recorrencia: "mensal",
    },
    {
      id: Date.now() + 7,
      data: "2026-01-15",
      descricao: "Software SASYRA (plano Evidência)",
      categoria: "Assinaturas",
      valor: 59.9,
      recorrencia: "mensal",
    },
    {
      id: Date.now() + 8,
      data: "2026-03-15",
      descricao: "Aparelho TENS portátil novo",
      categoria: "Equipamentos",
      valor: 450.0,
      recorrencia: "none",
    },
    {
      id: Date.now() + 9,
      data: "2026-04-01",
      descricao: "Marketing digital (Instagram ads)",
      categoria: "Marketing",
      valor: 200.0,
      recorrencia: "mensal",
    },
    {
      id: Date.now() + 10,
      data: "2026-06-10",
      descricao: "Curso de atualização em fisioterapia",
      categoria: "Outros",
      valor: 897.0,
      recorrencia: "none",
    },
  ];

  localStorage.setItem("sasyra_despesas", JSON.stringify(despesas));
  console.log(`✓ ${despesas.length} despesas cadastradas`);

  // ── 7. MODULE-SPECIFIC ENHANCER DATA ────────────────────────

  const moduleMapping = {
    demo_orto_1: "ortopedica",
    demo_neuro_1: "neurologica",
    demo_cardio_1: "cardioRespiratoria",
    demo_geria_1: "geriatria",
    demo_ped_1: "pediatrica",
    demo_derm_1: "dermatoFuncional",
    demo_uro_1: "uroginecologica",
    demo_onco_1: "oncologica",
    demo_cross_1: "esportiva",
    demo_sport_1: "esportiva",
    demo_reum_1: "reumatologica",
  };

  const aiTexts = {
    demo_orto_1:
      "## ANÁLISE CLÍNICA BASEADA EM EVIDÊNCIAS — LOMBALGIA CRÔNICA\n\n" +
      "### 1. HIPÓTESE DIAGNÓSTICA FUNCIONAL (CIF)\n" +
      "**Diagnóstico fisioterapêutico principal:** Lombalgia crônica inespecífica com dor irradiada para membro inferior direito secundária a disfunção mecânica lombar, fraqueza muscular segmentar (L4-L5) e descondicionamento físico associado a sobrepeso e sedentarismo.\n\n" +
      "**Diagnósticos diferenciais:**\n" +
      "- Síndrome radicular L5 ou S1 por hérnia discal (Lasègue + a 45°)\n" +
      "- Estenose do canal lombar\n" +
      "- Disfunção da articulação sacroilíaca\n\n" +
      "**Fatores contribuintes:**\n" +
      "- Biomecânicos: fraqueza de estabilizadores lombares (glúteo médio, transverso abdominal), encurtamento de cadeia posterior e postura sentada prolongada (motorista)\n" +
      "- Psicossociais: cronicidade > 6 meses, possível cinesiofobia\n" +
      "- Ocupacionais: motorista profissional com exposição a vibração de corpo inteiro\n\n" +
      "**Códigos CIF:**\n" +
      "- b28013(3) — Dor nas costas, grave\n" +
      "- b730(2) — Força muscular, deficiência moderada\n" +
      "- d4100(2) — Deitar-se, deficiência moderada\n" +
      "- d450(2) — Marcha, deficiência moderada\n" +
      "- d850(2) — Trabalho remunerado, deficiência moderada\n\n" +
      "### 2. PLANO DE TRATAMENTO\n\n" +
      "**Fase 1 — Analgesia e Educação (Sessões 1-4)**\n" +
      "- Frequência: 2x/semana | Duração: 2 semanas\n" +
      "- Objetivos: Reduzir dor para EVA ≤4, educar sobre neurociência da dor, ativar estabilizadores profundos\n" +
      "- Intervenções:\n" +
      "  - TENS (burst mode, 100Hz, 30 min, eletrodos paravertebrais L4-S1)\n" +
      "  - Terapia manual: mobilização grau II-III em segmentos L4-L5 e S1 (Maitland)\n" +
      "  - Exercícios de estabilização segmentar: bird-dog, dead bug, 3x10\n" +
      "  - Educação em neurociência da dor (Painaustralia, 2021 — Nível 1B)\n" +
      "  - Evidências: Hayden et al. (2021) \"Exercise therapy for chronic low back pain\". Cochrane Database Syst Rev. Nível 1A.\n\n" +
      "**Fase 2 — Fortalecimento e Controle Motor (Sessões 5-10)**\n" +
      "- Frequência: 2x/semana | Duração: 3 semanas\n" +
      "- Objetivos: Aumentar força de estabilizadores segmentares, melhorar controle lombo-pélvico, restaurar ADM de flexão lombar\n" +
      "- Intervenções:\n" +
      "  - Ponte de glúteos bilateral → unilateral, 3x12\n" +
      "  - Prancha frontal e lateral, progressão de 15s para 45s\n" +
      "  - Agachamento isométrico na parede 3x30s\n" +
      "  - Exercícios com faixa elástica para glúteo médio (clamshell, abdução lateral) 3x15\n" +
      "  - Alongamento ativo de cadeia posterior (isquiotibiais, piriforme)\n" +
      "  - Evidências: Saragiotto et al. (2016) \"Motor control exercise for chronic low back pain\". Cochrane. Nível 1A\n\n" +
      "**Fase 3 — Recondicionamento e Retorno Funcional (Sessões 11-16)**\n" +
      "- Frequência: 2x/semana | Duração: 3 semanas\n" +
      "- Objetivos: Simular demandas laborais (motorista), integrar cadeias cinéticas, profilaxia de recidiva\n" +
      "- Intervenções:\n" +
      "  - Agachamento livre com progressão de carga 3x10\n" +
      "  - Levantamento terra leve com barra (técnica de agachamento)\n" +
      "  - Simulação de entrada/saída de veículo com carga\n" +
      "  - Treino de postura sentada prolongada com breaks ativos a cada 45 min\n" +
      "  - Exercícios de McKenzie (extensão em prono) se indicado\n" +
      "  - Evidências: Steffens et al. (2016) \"Prevention of low back pain\". JAMA Internal Medicine. Nível 1A\n\n" +
      "### 3. RESUMO DO TRATAMENTO\n" +
      "- Total de sessões: 16\n" +
      "- Intervalo entre sessões: 48-72h\n" +
      "- Duração total: 8 semanas\n\n" +
      "### 4. CRITÉRIOS DE ALTA\n" +
      "- EVA ≤2/10 em repouso e ≤4/10 em movimento\n" +
      "- ADM de flexão lombar ≥ 60°\n" +
      "- Retorno à direção sem dor por período ≥ 2h\n" +
      "- Força de extensores lombares e glúteo médio ≥ 4/5\n" +
      "- Questionário de prontidão para retorno ao trabalho (FABQ < 20)\n\n" +
      "### 5. ESCALAS RECOMENDADAS\n" +
      "- Índice de Incapacidade de Oswestry (ODI) — avaliar a cada 4 semanas\n" +
      "- Escala de Cinesiofobia de Tampa\n" +
      "- Roland-Morris Disability Questionnaire\n\n" +
      "### 6. PROGNÓSTICO\n" +
      "- Expectativa: melhora funcional significativa em 6-8 semanas com programa estruturado\n" +
      "- Fatores de risco para mau prognóstico: obesidade (IMC 29), ocupação com exposição a vibração, baixo condicionamento prévio, cronicidade > 6 meses\n" +
      "- Fatores favoráveis: idade (45 anos), ausência de sinais neurológicos graves\n\n" +
      "**Recomendações ao paciente:**\n" +
      "1. Alternar posição sentada com pausas a cada 45 min durante o trabalho\n" +
      "2. Caminhadas leves de 15-20 min/dia\n" +
      "3. Evitar carregar peso > 5 kg nas primeiras 4 semanas\n" +
      "4. Manter hidratação e sono regular (≥7h)\n" +
      "5. Monitorar sinais de alarme: perda de força progressiva, alteração esfincteriana, dor noturna intensa",

    demo_neuro_1:
      "## ANÁLISE CLÍNICA BASEADA EM EVIDÊNCIAS — AVC ISQUÊMICO\n\n" +
      "### 1. HIPÓTESE DIAGNÓSTICA FUNCIONAL (CIF)\n" +
      "**Diagnóstico fisioterapêutico principal:** Hemiparesia esquerda espástica pós-AVC isquêmico (45 dias) com comprometimento motor moderado (MAS 1+-2), limitação funcional significativa (BBS 35/56 — risco de quedas; MIF 72/126 — dependência moderada) e marcha hemiparética com dispositivo auxiliar.\n\n" +
      "**Diagnósticos diferenciais:**\n" +
      "- Progressão de lesão neurológica vs plateau de recuperação\n" +
      "- Síndrome de ombro doloroso do hemiplégico (preventivo)\n" +
      "- Depressão pós-AVC (prevalência 30%)\n\n" +
      "**Códigos CIF:**\n" +
      "- b7302(3) — Força muscular de um lado do corpo, grave\n" +
      "- b735(3) — Tônus muscular, deficiência grave\n" +
      "- d450(3) — Marcha, deficiência grave\n" +
      "- d510(2) — Lavar-se, deficiência moderada\n" +
      "- d540(2) — Vestir-se, deficiência moderada\n" +
      "- b770(2) — Funções de padrão de marcha, moderada\n\n" +
      "### 2. PLANO DE TRATAMENTO\n\n" +
      "**Fase 1 — Prevenção e Posicionamento (Sessões 1-5)**\n" +
      "- 3x/semana | Duração: 2 semanas\n" +
      "- Objetivos: Prevenir ombro doloroso, padrão flexor, posicionamento adequado\n" +
      "- Intervenções: posicionamento no leito, sling para ombro, alongamentos passivos de cadeia flexora MS, mobilização escapular\n" +
      "- Evidência: Ada et al. (2005) \"Strengthening interventions increase strength...\". Cochrane. Nível 1A\n\n" +
      "**Fase 2 — Ativação e Treino Funcional (Sessões 6-12)**\n" +
      "- 3x/semana | Duração: 2-3 semanas\n" +
      "- Objetivos: Recrutar musculatura antigravitacional, treino de alcance e preensão\n" +
      "- Intervenções: exercícios ativo-assistidos, facilitação neuromuscular proprioceptiva, terapia de restrição de tronco, treino de ponte e rolamento, alcance funcional\n" +
      "- Evidência: Pollock et al. (2014) \"Physical rehabilitation approaches...\". Cochrane. Nível 1A\n\n" +
      "**Fase 3 — Marcha e Independência (Sessões 13-20)**\n" +
      "- 3x/semana | Duração: 3 semanas\n" +
      "- Objetivos: Marcha comunitária sem auxílio, independência AVDs\n" +
      "- Intervenções: treino de marcha com feedback, esteira parcial, circuito funcional AVDs, transições posturais\n" +
      "- Evidência: French et al. (2016) \"Repetitive task training...\". Cochrane. Nível 1A\n\n" +
      "### 3. RESUMO\n" +
      "- Total: 20 sessões, 3x/semana, 7 semanas\n\n" +
      "### 4. CRITÉRIOS DE ALTA\n" +
      "- BBS ≥ 45/56, MIF ≥ 100/126, marcha independente por ≥ 100m, velocidade ≥ 0,4 m/s\n\n" +
      "### 5. PROGNÓSTICO\n" +
      "Favorável com programa intensivo. Meta: independência funcional parcial em 8-12 semanas.",

    demo_cardio_1:
      "## ANÁLISE CLÍNICA BASEADA EM EVIDÊNCIAS — REABILITAÇÃO CARDÍACA PÓS-IAM\n\n" +
      "### 1. HIPÓTESE DIAGNÓSTICA FUNCIONAL (CIF)\n" +
      "**Diagnóstico principal:** Insuficiência coronariana pós-IAM com FEVE 45%. Classe funcional NYHA II. Capacidade funcional 6 METs. Bom prognóstico para reabilitação. Baixo risco cardiovascular após estratificação.\n\n" +
      "**CIF:** b410(2) Funções cardíacas moderada | d450(1) Marcha leve | d570(2) Cuidado saúde moderada\n\n" +
      "### 2. PLANO DE TRATAMENTO — REABILITAÇÃO CARDÍACA FASE II\n\n" +
      "**Fase 1 — Adaptação (Sessões 1-6, 3x/sem, 2 sem)**\n" +
      "- Exercício aeróbio: esteira 50-60% FC reserva, 20 min. TISS: 2-3 (Borg).\n" +
      "- Resistido: 40% 1RM estimado, 1-2 séries x 12-15 reps, 6 exercícios grandes grupos.\n" +
      "- Monitoramento: FC, PA, sinais/sintomas pré, durante, pós. Escala de Borg.\n" +
      "- Evidência: Anderson et al. (2016) \"Exercise-based cardiac rehabilitation for coronary heart disease\". Cochrane. Nível 1A.\n\n" +
      "**Fase 2 — Progressão (Sessões 7-16, 3x/sem, 3 sem)**\n" +
      "- Aeróbio: 60-70% FC reserva, 30 min. TISS 3-4.\n" +
      "- Resistido: 60% 1RM, 2-3 séries x 10-12 reps, 8-10 exercícios.\n" +
      "- Incluir circuito funcional.\n" +
      "- Evidência: Same.\n\n" +
      "**Fase 3 — Manutenção (Sessões 17-24, 3x/sem, 3 sem)**\n" +
      "- Aeróbio: 70-80% FC reserva, 30-40 min. TISS 4-5.\n" +
      "- Resistido: 70% 1RM, 3 séries x 8-10 reps.\n" +
      "- Transição para programa comunitário.\n\n" +
      "### 3. RESUMO\n" +
      "24 sessões, 8 semanas. Intervalo 48h. Alta para programa de manutenção. Meta: 8-10 METs.",

    demo_geria_1:
      "## ANÁLISE CLÍNICA — SARCOPENIA EM IDOSA COM RISCO DE QUEDAS\n\n" +
      "### 1. HIPÓTESE DIAGNÓSTICA FUNCIONAL (CIF)\n" +
      "**Diagnóstico principal:** Sarcopenia provável (SARC-F 6/10) associada a baixa força de preensão (14 kg), velocidade de marcha reduzida (0,6 m/s) e risco elevado de quedas (TUG 16s, 2 quedas em 6 meses).\n\n" +
      "**CIF:** b730(3) Força muscular grave | b770(2) Marcha moderada | d410(2) Mudança de posição moderada | d450(2) Marcha moderada\n\n" +
      "### 2. PLANO DE TRATAMENTO\n\n" +
      "**Fase 1 — Adaptação e segurança (Sessões 1-5, 2x/sem, 2-3 sem)**\n" +
      "- Fortalecimento: exercícios sentado-para-de-pé (sit-to-stand), 3x8-10, cadeia extensora.\n" +
      "- Equilíbrio estático: apoio unipodal progressivo com suporte, semi-tandem.\n" +
      "- Marcha: treino com pistas visuais e obstáculos baixos.\n" +
      "- Educação: modificações domiciliares (barras, tapetes, iluminação).\n" +
      "- Evidência: Sherrington et al. (2019) \"Exercise for preventing falls...\". Cochrane. Nível 1A.\n\n" +
      "**Fase 2 — Fortalecimento progressivo (Sessões 6-15, 2-3x/sem, 5 sem)**\n" +
      "- Exercícios resistidos: 60-75% 1RM estimado, 3x8-12 (leg press, extensão joelho, remada, supino).\n" +
      "- Treino de potência: subir degrau rápido 3x8.\n" +
      "- Equilíbrio dinâmico: tandem walk, apoio unipodal com perturbações.\n" +
      "- Otago Exercise Programme.\n" +
      "- Evidência: Liu & Latham (2009) \"Progressive resistance strength training...\". Cochrane. Nível 1A.\n\n" +
      "**Fase 3 — Manutenção (Sessões 16-24, 2x/sem, 4 sem)**\n" +
      "- Progressão carga, integração comunitária, prevenção quedas.\n" +
      "- Avaliar nutrição proteica (1,2-1,5 g/kg/dia).\n\n" +
      "### 3. RESUMO\n" +
      "24 sessões, 2-3x/semana, 12 semanas.",

    demo_ped_1:
      "## ANÁLISE CLÍNICA — PARALISIA CEREBRAL DIPARÉTICA ESPÁSTICA\n\n" +
      "### 1. HIPÓTESE DIAGNÓSTICA FUNCIONAL (CIF)\n" +
      "**Diagnóstico principal:** Paralisia cerebral diparética espástica GMFCS nível II. Comprometimento motor com espasticidade em MMII (isquiotibiais, gastrocnêmios), padrão equino bilateral, AIMS percentil 10 indicando atraso no desenvolvimento motor. Boa capacidade cognitiva (M-CHAT sem sinais de TEA).\n\n" +
      "**CIF:** b735(2) Tônus moderado | b770(1) Marcha leve | d450(2) Marcha moderada | d880(2) Engajamento no brincar moderado\n\n" +
      "### 2. PLANO DE TRATAMENTO\n\n" +
      "**Fase 1 — Alongamento e Posicionamento (Sessões 1-6, 2x/sem, 3 sem)**\n" +
      "- Alongamento sustentado de isquiotibiais (30s), gastrocnêmios (30s), adutores.\n" +
      "- Posicionamento noturno com órtese (AFO) se indicado.\n" +
      "- Fortalecimento lúdico de dorsiflexores (brincar de \"pegar objetos com o pé\").\n" +
      "- Treino de sentar estável na bola suíça.\n" +
      "- Evidência: Novak et al. (2020) \"Systematic Review of Interventions...\". Current Neurology. Nível 1A.\n\n" +
      "**Fase 2 — Treino de Marcha (Sessões 7-15, 2x/sem, 4-5 sem)**\n" +
      "- Treino de marcha com obstáculos e superfícies variadas (espuma, grama sintética).\n" +
      "- Estimulação de passos com pistas visuais (pegadas coloridas).\n" +
      "- Fortalecimento de glúteo médio (brincar de \"caranguejo\").\n" +
      "- Treino de subir e descer escadas alternando pés.\n" +
      "- Evidência: Moreau et al. (2016) \"Effectiveness of Rehabilitation...\". Pediatric PT. Nível 2A.\n\n" +
      "**Fase 3 — Funcionalidade e Participação (Sessões 16-24, 2x/sem, 4-5 sem)**\n" +
      "- Circuitos motores com obstáculos, saltos, agachamentos.\n" +
      "- Atividades aquáticas se disponível.\n" +
      "- Orientação familiar para atividades em casa.\n\n" +
      "### 3. RESUMO\n" +
      "24 sessões, 2x/semana, 12 semanas. Reavaliação GMFM-66 a cada 12 semanas.",

    demo_derm_1:
      "## ANÁLISE CLÍNICA — PÓS-OPERATÓRIO LIPOASPIRAÇÃO\n\n" +
      "### 1. HIPÓTESE DIAGNÓSTICA FUNCIONAL (CIF)\n" +
      "**Diagnóstico principal:** Pós-operatório imediato de lipoaspiração (48h) com edema e equimose grau 2 em abdome/flancos. Fibroedema geloide grau II prévio em glúteos. Risco de fibrose tecidual e aderências subdérmicas.\n\n" +
      "**CIF:** b820(2) Funções reparadoras moderada | b280(2) Dor moderada | b810(2) Funções protetoras da pele moderada\n\n" +
      "### 2. PLANO DE TRATAMENTO\n" +
      "**Fase 1 — Drenagem e analgesia (Sessões 1-6, 2x/sem)**\n" +
      "- DLM (drenagem linfática manual) método Leduc, 40 min.\n" +
      "- Ultrassom 3MHz modo pulsado para analgesia.\n" +
      "- Laser de baixa potência (660nm, 4J/cm²) nas áreas de maior equimose.\n" +
      "- Cinta compressiva 23h/dia.\n" +
      "- Evidência: Avram et al. (2009) \"Postoperative care...\". Dermatologic Surgery. 2B.\n\n" +
      "**Fase 2 — Remodelamento (Sessões 7-15)**\n" +
      "- Endermologia/massagem modeladora, radiofrequência para flacidez, PEP/RPG para FEG em glúteos.\n" +
      "- Drenagem 2x/sem, exercícios hipopressivos.\n" +
      "- Evidência: Alster & Tanzi (2005) \"Cellulite treatment...\". 2B.\n\n" +
      "**Prognóstico:** Resultado estético satisfatório em 8-12 semanas. 15 sessões.",

    demo_uro_1:
      "## ANÁLISE CLÍNICA — INCONTINÊNCIA URINÁRIA DE ESFORÇO\n\n" +
      "### 1. HIPÓTESE DIAGNÓSTICA FUNCIONAL (CIF)\n" +
      "**Diagnóstico principal:** Incontinência urinária de esforço moderada (Pad test 8g/24h) associada a fraqueza dos músculos do assoalho pélvico (Oxford 2, PERFECT: Power 2).\n\n" +
      "**CIF:** b6202(2) Continência urinária moderada | b730(3) Força MAP grave | d5300(1) Regulação micção leve | b670(2) Funções associadas ao parto moderada\n\n" +
      "### 2. PLANO DE TRATAMENTO\n" +
      "**Fase 1 — Consciência e Ativação (Sessões 1-6, 2x/sem)**\n" +
      "- Biofeedback com palpação vaginal digital ou dispositivo.\n" +
      "- Exercícios de Kegel: contração sustentada (5s) + fibras rápidas (5 reps), 8-12 séries/dia.\n" +
      "- Eletroestimulação intracavitária (50Hz, 250μs, 15 min).\n" +
      "- Diário miccional.\n" +
      "- Evidência: Dumoulin et al. (2018) \"Pelvic floor muscle training vs no treatment...\". Cochrane. Nível 1A.\n\n" +
      "**Fase 2 — Fortalecimento e Coordenação (Sessões 7-16)**\n" +
      "- Progressão: exercícios MAP em ortostatismo e durante atividades.\n" +
      "- Treino de \"the knack\" (contração MAP prévia à tosse/espirro).\n" +
      "- Exercícios hipopressivos.\n" +
      "- Cones vaginais.\n" +
      "- Evidência: Bø et al. (2017) \"International Continence Society...\". Neurourology Urodynamics. CPG.\n\n" +
      "### 3. RESUMO\n" +
      "16 sessões, 8 semanas. Reavaliação: Pad test < 2g/24h, PERFECT Power ≥ 4.",

    demo_onco_1:
      "## ANÁLISE CLÍNICA — PÓS-MASTECTOMIA COM LINFADENECTOMIA\n\n" +
      "### 1. HIPÓTESE DIAGNÓSTICA FUNCIONAL (CIF)\n" +
      "**Diagnóstico principal:** Pós-operatório de mastectomia direita + linfadenectomia axilar (60 dias). Déficit de ADM de ombro, linfedema grau I e fraqueza muscular MSD.\n\n" +
      "**CIF:** b710(2) Funções mobilidade articular moderada | b730(2) Força muscular moderada | b435(2) Funções sistema imunológico moderada | d445(2) Uso mão e braço moderada\n\n" +
      "### 2. PLANO DE TRATAMENTO\n" +
      "**Fase 1 — ADM e drenagem (Sessões 1-8, 2x/sem)**\n" +
      "- DLM para linfedema (Leduc/Földi).\n" +
      "- Exercícios de Codman, polias, bastão.\n" +
      "- Enfaixamento compressivo multicamadas.\n" +
      "- Laser de baixa potência para cicatriz.\n" +
      "- Evidência: McNeely et al. (2010) \"Exercise interventions for upper-limb dysfunction...\". Cochrane. Nível 1A.\n\n" +
      "**Fase 2 — Fortalecimento (Sessões 9-20)**\n" +
      "- Resistência progressiva 60-70% 1RM.\n" +
      "- Treino funcional de alcance. Braçadeira compressiva.\n" +
      "- Evidência: Schmitz et al. (2009) \"Weight Lifting in Women with Breast-Cancer-Related Lymphedema\". NEJM. Nível 1B.\n\n" +
      "### 3. RESUMO\n" +
      "20 sessões, 10 semanas. Meta: ADM completa, linfedema controlado.",

    demo_cross_1:
      "## ANÁLISE CLÍNICA — LESÃO DE OMBRO EM ATLETA DE CROSSFIT\n\n" +
      "### 1. HIPÓTESE DIAGNÓSTICA FUNCIONAL (CIF)\n" +
      "**Diagnóstico principal:** Síndrome do impacto subacromial (estágio II de Neer) em ombro direito com tendinopatia do supraespinhal secundária a sobrecarga excêntrica no movimento de snatch.\n\n" +
      "**CIF:** b28013(2) Dor no ombro moderada | b710(2) ADM moderada | b730(2) Força muscular moderada\n\n" +
      "### 2. PLANO DE TRATAMENTO\n" +
      "**Fase 1 — Analgesia e ADM (Sessões 1-6, 3x/sem)**\n" +
      "- Laser 904nm, US 1MHz modo pulsado.\n" +
      "- Mobilização glenoumeral grau III inferior/anterior.\n" +
      "- Codman, polia flexão. Exercícios pendulares.\n" +
      "- Evidência: Littlewood et al. (2016) \"Exercise for rotator cuff tendinopathy...\". Cochrane. Nível 1A.\n\n" +
      "**Fase 2 — Fortalecimento (Sessões 7-15, 3x/sem)**\n" +
      "- Rotadores externos (faixa elástica, lado), exercícios escapulares (remo baixa, serrátil).\n" +
      "- Abdução no plano escapular com halter leve.\n" +
      "- Prancha dinâmica.\n" +
      "- Evidência: Cools et al. (2014) \"Rehabilitation of scapular dyskinesis...\". BJSM. CPG.\n\n" +
      "**Fase 3 — Retorno ao CrossFit (Sessões 16-24)**\n" +
      "- Progressão para snatch e overhead squat com carga reduzida (PVC, 15kg).\n" +
      "- Gradual reintrodução dos WODs (começar com metcon leve).\n\n" +
      "### 3. RESUMO\n" +
      "24 sessões, 8 semanas. RTP: 12 semanas.",

    demo_sport_1:
      "## ANÁLISE CLÍNICA — TENDINOPATIA PATELAR\n\n" +
      "### 1. HIPÓTESE DIAGNÓSTICA FUNCIONAL (CIF)\n" +
      "**Diagnóstico principal:** Tendinopatia patelar crônica (VISA-P 52/100) em joelho direito associada a sobrecarga de volume de corrida.\n\n" +
      "**CIF:** b28013(2) Dor moderada | b770(1) Marcha leve | d450(1) Marcha longa distância leve\n\n" +
      "### 2. PLANO DE TRATAMENTO\n" +
      "**Fase 1 — Controle de carga (Sessões 1-6, 2x/sem)**\n" +
      "- Isométricos de quadríceps (45° flexão, 5x45s).\n" +
      "- Laser 904nm + US 1MHz sobre tendão.\n" +
      "- Crioterapia pós-exercício.\n" +
      "- Alongamento excêntrico assistido.\n" +
      "- Evidência: Malliaras et al. (2015) \"Achilles and patellar tendinopathy loading programmes...\". Sports Med. Nível 1A.\n\n" +
      "**Fase 2 — Fortalecimento excêntrico (Sessões 7-15)**\n" +
      "- Agachamento declinado excêntrico (decline board, 25°).\n" +
      "- Progressão: isométrico → isotônico → pliométrico.\n" +
      "- Fortalecimento de glúteo médio e core.\n\n" +
      "**Fase 3 — Retorno à corrida (Sessões 16-24)**\n" +
      "- Corrida intervalada, aumento 10-15% volume/semana.\n" +
      "- Meta VISA-P > 80/100, salto > 90% contralateral.",

    demo_reum_1:
      "## ANÁLISE CLÍNICA — ARTRITE REUMATOIDE EM ATIVIDADE MODERADA\n\n" +
      "### 1. HIPÓTESE DIAGNÓSTICA FUNCIONAL (CIF)\n" +
      "**Diagnóstico principal:** Artrite reumatoide em atividade moderada (DAS28 4.2). Deformidades articulares em mãos. Limitação funcional significativa (HAQ 1.25). Fadiga moderada.\n\n" +
      "**CIF:** b710(2) ADM articular moderada | b730(3) Força muscular grave | b28013(2) Dor articular moderada | d440(2) Uso fino da mão moderado | d850(2) Trabalho moderado\n\n" +
      "### 2. PLANO DE TRATAMENTO\n" +
      "**Fase 1 — Proteção articular (Sessões 1-6, 2x/sem, 3 sem)**\n" +
      "- Exercícios ativo-livres sem carga. Proteção articular (órteses noturnas de punho e IFP). Termoterapia (calor úmido). Laser de baixa potência.\n" +
      "- Evidência: Hurkmans et al. (2009) \"Dynamic exercise programs...\". Cochrane. Nível 1A.\n\n" +
      "**Fase 2 — Fortalecimento (Sessões 7-15, 2-3x/sem, 5 sem)**\n" +
      "- Exercícios resistidos leves (50-70% 1RM). Treino funcional de preensão (massinha, arco-finger). Alongamentos globais. Hidroterapia 1x/semana.\n" +
      "- Evidência: Baillet et al. (2010) \"Efficacy of resistance exercises...\". Rheumatology. Nível 2A.\n\n" +
      "**Fase 3 — Manutenção e autocuidado (Sessões 16-24, 1-2x/sem, 8 sem)**\n" +
      "- Autogestão, exercícios domiciliares, prevenção de deformidades. Atividades aeróbias leves.\n\n" +
      "### 3. RESUMO\n" +
      "24 sessões, 12 semanas. Meta: HAQ < 1.0, redução DAS28 para < 3.2. Fortalecer mão: preensão > 16 kg bilateral.",
  };

  for (const p of patients) {
    const pid = p.id;
    const mod = moduleMapping[pid];
    if (!mod) continue;
    const key = `${mod}_enhancer_${pid}`;
    const enhancerData = {
      evaMov: 0,
      evaRep: 0,
      localDor: [],
      caraterDor: [],
      tempoDor: "",
      melhora: [],
      piora: [],
      logs: [],
      redFlags: [],
      aiRes: aiTexts[pid] || "",
    };
    localStorage.setItem(key, JSON.stringify(enhancerData));
  }
  console.log("✓ Dados do ModuleEnhancer preenchidos com análises de IA");

  // ── 8. SIGNATURES ───────────────────────────────────────────

  const signatures = {};
  for (const p of patients) {
    const pid = p.id;
    signatures[`fisio_${pid}`] =
      "data:image/svg+xml," +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="80"><text x="10" y="50" font-family="cursive" font-size="24" fill="#333">Dr. Kleber Herlon</text><text x="10" y="72" font-family="sans-serif" font-size="11" fill="#888">CREFITO-3 123456-F</text></svg>`
      );
  }
  localStorage.setItem("sasyra_signatures", JSON.stringify(signatures));
  console.log("✓ Assinaturas pré-preenchidas");

  // ── 9. ASSESSMENTS ──────────────────────────────────────────

  const assessments = [];
  let assessmentIdCounter = 5000;

  const assessmentTemplates = {
    demo_orto_1: {
      queixa: "Lombalgia crônica com irradiação MID",
      queixaKey: "lombalgia",
      hda: "Paciente motorista profissional (45 anos) com dor lombar crônica há mais de 6 meses, EVA 7/10, com irradiação para MID. Lasègue positivo a 45°. IMC 27,8 (sobrepeso). Sedentário.",
      diagnosticoCinesio:
        "Lombalgia crônica inespecífica com componente radicular L5-S1. Fraqueza estabilizadores segmentares e encurtamento cadeia posterior.",
      localDor: ["lombar", "gluteoDir", "postCoxaDir"],
      caraterDor: ["pontada", "queimacao", "peso"],
      tempoDor: "cronica",
      melhora: ["repouso", "calor", "deitar"],
      piora: ["sentar", "dirigir", "carregarPeso"],
      objTrat: ["reduzirDor", "voltarTrabalho", "dirigirSemDor"],
      evaMov: 7,
      evaRep: 5,
    },
    demo_neuro_1: {
      queixa: "Hemiparesia esquerda pós-AVC isquêmico",
      queixaKey: "avc",
      hda: "AVC isquêmico há 45 dias. Hemiparesia esquerda espástica. BBS 35/56, MIF 72/126. Marcha hemiparética com andador. Professora aposentada.",
      diagnosticoCinesio:
        "Hemiparesia esquerda espástica pós-AVC isquêmico com comprometimento motor moderado e limitação funcional significativa.",
      localDor: [],
      caraterDor: [],
      tempoDor: "",
      melhora: [],
      piora: [],
      objTrat: ["marchaIndependente", "independenciaAVDs", "prevenirOmbroDoloroso"],
      evaMov: null,
      evaRep: null,
    },
    demo_cardio_1: {
      queixa: "Reabilitação cardíaca pós-IAM",
      queixaKey: "iam",
      hda: "IAM há 30 dias, FEVE 45%, NYHA II. Realizou angioplastia. Baixo risco cardiovascular. Iniciando reabilitação fase II.",
      diagnosticoCinesio:
        "Insuficiência coronariana pós-IAM. Classe funcional NYHA II. Capacidade funcional 6 METs. Bom prognóstico.",
      localDor: [],
      caraterDor: [],
      tempoDor: "",
      melhora: [],
      piora: [],
      objTrat: ["reabilitacaoCardiaca", "condicionamento", "retornoAVDs"],
      evaMov: null,
      evaRep: null,
    },
    demo_geria_1: {
      queixa: "Fraqueza e risco de quedas",
      queixaKey: "riscoQuedas",
      hda: "Idosa 78 anos, sarcopenia provável (SARC-F 6/10), 2 quedas nos últimos 6 meses. Força preensão 14 kg, TUG 16s, velocidade marcha 0,6 m/s.",
      diagnosticoCinesio:
        "Sarcopenia provável com risco elevado de quedas. Fraqueza muscular generalizada e déficit de equilíbrio dinâmico.",
      localDor: [],
      caraterDor: [],
      tempoDor: "",
      melhora: [],
      piora: [],
      objTrat: ["prevenirQuedas", "fortalecimento", "independenciaMarcha"],
      evaMov: null,
      evaRep: null,
    },
    demo_ped_1: {
      queixa: "Atraso no desenvolvimento motor",
      queixaKey: "paralisiaCerebral",
      hda: "Criança 7 anos com PC diparética espástica GMFCS II. Marcha equina, AIMS percentil 10. Boa cognição (M-CHAT negativo).",
      diagnosticoCinesio:
        "PC diparética espástica GMFCS nível II. Padrão equino bilateral com espasticidade em isquiotibiais e gastrocnêmios.",
      localDor: [],
      caraterDor: [],
      tempoDor: "",
      melhora: [],
      piora: [],
      objTrat: ["desenvolvimentoMotor", "melhorarMarcha", "participacaoSocial"],
      evaMov: null,
      evaRep: null,
    },
    demo_derm_1: {
      queixa: "Pós-operatório lipoaspiração",
      queixaKey: "posCirurgico",
      hda: "Pós-operatório imediato (48h) de lipoaspiração abdominal e flancos. Edema grau 2, equimose difusa. FEG grau II prévio em glúteos.",
      diagnosticoCinesio:
        "Pós-operatório de lipoaspiração com edema e equimose grau 2. Risco de fibrose e aderências subdérmicas.",
      localDor: ["abdome", "flancos"],
      caraterDor: ["peso", "queimacao"],
      tempoDor: "aguda",
      melhora: ["repouso", "cinta", "gelo"],
      piora: ["movimento", "tosse"],
      objTrat: ["reduzirEdema", "prevenirFibrose", "resultadoEstetico"],
      evaMov: 4,
      evaRep: 2,
    },
    demo_uro_1: {
      queixa: "Incontinência urinária de esforço",
      queixaKey: "incontinenciaUrinaria",
      hda: "Paciente 42 anos, IU de esforço moderada. Pad test 8g/24h. Oxford 2. PERFECT Power 2. Multípara (3 partos vaginais).",
      diagnosticoCinesio:
        "IU de esforço moderada com fraqueza MAP grau Oxford 2. Déficit de coordenação perineal.",
      localDor: [],
      caraterDor: [],
      tempoDor: "",
      melhora: [],
      piora: [],
      objTrat: ["continencia", "fortalecimentoMAP", "qualidadeVida"],
      evaMov: null,
      evaRep: null,
    },
    demo_onco_1: {
      queixa: "Pós-mastectomia direita + linfadenectomia",
      queixaKey: "mastectomia",
      hda: "Paciente 55 anos, mastectomia direita + linfadenectomia axilar há 60 dias. Déficit ADM ombro direito, linfedema grau I. Fraqueza MSD.",
      diagnosticoCinesio:
        "Pós-operatório mastectomia com déficit ADM ombro, linfedema grau I e fraqueza muscular MSD.",
      localDor: ["ombroDir", "bracoDir", "axilaDir"],
      caraterDor: ["peso", "rigidez"],
      tempoDor: "subaguda",
      melhora: ["repouso", "elevacao"],
      piora: ["movimento", "esforco"],
      objTrat: ["recuperarADM", "controlarLinfedema", "independenciaAVDs"],
      evaMov: 4,
      evaRep: 2,
    },
    demo_cross_1: {
      queixa: "Dor no ombro direito durante snatch",
      queixaKey: "ombro",
      hda: "Atleta CrossFit 29 anos, dor ombro direito há 4 semanas. Neer +, Hawkins +, arco doloroso 80-120°. Snatch e overhead como gatilhos.",
      diagnosticoCinesio:
        "Síndrome do impacto subacromial estágio II de Neer. Tendinopatia do supraespinhal secundária a sobrecarga.",
      localDor: ["ombroDir"],
      caraterDor: ["pontada", "queimacao"],
      tempoDor: "subaguda",
      melhora: ["repouso", "gelo"],
      piora: ["snatch", "overhead", "supino"],
      objTrat: ["retornarCrossFit", "snatchSemDor", "fortalecimentoOmbro"],
      evaMov: 7,
      evaRep: 4,
    },
    demo_sport_1: {
      queixa: "Dor no joelho direito durante corrida",
      queixaKey: "joelho",
      hda: "Corredora amadora 35 anos, dor joelho direito há 3 meses. VISA-P 52/100. Dor no polo inferior da patela durante corrida e salto.",
      diagnosticoCinesio: "Tendinopatia patelar crônica em joelho direito. VISA-P 52/100.",
      localDor: ["joelhoDir"],
      caraterDor: ["pontada", "latejante"],
      tempoDor: "subaguda",
      melhora: ["repouso", "gelo"],
      piora: ["corrida", "salto", "escada"],
      objTrat: ["retornarCorrida", "correrSemDor", "prova10k"],
      evaMov: 5,
      evaRep: 2,
    },
    demo_reum_1: {
      queixa: "Dor e deformidade articular em mãos",
      queixaKey: "artriteReumatoide",
      hda: "Paciente 52 anos, AR ativa (DAS28 4.2), deformidades IFP e punhos. HAQ 1.25. Fadiga moderada. Costureira com limitação laboral.",
      diagnosticoCinesio:
        "Artrite reumatoide em atividade moderada (DAS28 4.2). Deformidades em mãos com limitação funcional.",
      localDor: ["maos", "punhos", "joelhos"],
      caraterDor: ["queimacao", "rigidez", "latejante"],
      tempoDor: "cronica",
      melhora: ["calor", "repouso"],
      piora: ["frio", "esforcoRepetitivo", "manha"],
      objTrat: ["reduzirDor", "fortalecerMaos", "protecaoArticular"],
      evaMov: 5,
      evaRep: 3,
    },
  };

  for (const p of patients) {
    const pid = p.id;
    const tmpl = assessmentTemplates[pid];
    if (!tmpl) continue;
    assessments.push({
      id: assessmentIdCounter++,
      date: p.data || dateDaysAgo(60),
      patientId: pid,
      queixa: tmpl.queixa,
      queixaKey: tmpl.queixaKey,
      localDor: tmpl.localDor || [],
      caraterDor: tmpl.caraterDor || [],
      tempoDor: tmpl.tempoDor || "",
      melhora: tmpl.melhora || [],
      piora: tmpl.piora || [],
      hda: tmpl.hda || "",
      comorbid: [],
      antec: [],
      meds: "",
      yellowFlagsState: [],
      selectedRedFlags: [],
      evaMov: tmpl.evaMov,
      evaRep: tmpl.evaRep,
      avds: [],
      objTrat: tmpl.objTrat || [],
      nivelAti: "",
      postura: [],
      marcha: "",
      edema: "",
      palpacao: "",
      sensib: "",
      reflexos: "",
      forca: [],
      gonio: [],
      tests: {},
      obs: "",
      regiao: "",
      diagnosticoCinesio: tmpl.diagnosticoCinesio || "",
      vitalSigns: {},
      impressaoClinica: "",
      autoCIF: [],
      recommendedScales: [],
      honorario: null,
      isExpress: false,
      status: "complete",
    });
  }
  localStorage.setItem("sasyra_assessments", JSON.stringify(assessments));
  console.log(`✓ ${assessments.length} avaliações criadas`);

  // ── 10. APPOINTMENTS (opcional, para a Agenda) ──────────────

  const appointments = patients.map((p, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      id: Date.now() + 100 + i,
      title: `Sessão - ${p.nome.split(" ")[0]}`,
      date: d.toISOString().slice(0, 10),
      startTime: "09:00",
      endTime: "10:00",
      patientId: p.id,
      status: "agendado",
      notes: p.convenio,
    };
  });
  // Don't overwrite existing appointments - check first
  const existingAppointments = (() => {
    try {
      const d = localStorage.getItem("sasyra_appointments");
      return d ? JSON.parse(d) : [];
    } catch {
      return [];
    }
  })();
  localStorage.setItem(
    "sasyra_appointments",
    JSON.stringify([...existingAppointments, ...appointments])
  );
  console.log(`✓ ${appointments.length} agendamentos criados`);

  // ── FINAL BANNER ────────────────────────────────────────────

  console.log(
    "%c╔══════════════════════════════════════════╗\n%c║   DEMO DATA POPULATED SUCCESSFULLY       ║\n%c╚══════════════════════════════════════════╝",
    "color:#22c55e;font-weight:bold",
    "color:#22c55e;font-weight:bold",
    "color:#22c55e;font-weight:bold"
  );

  console.log("%c📋 Summary:", "font-weight:bold;font-size:14px");
  console.log("  • 11 pacientes (1 por especialidade)");
  console.log("  • 110 evoluções (10 por paciente)");
  console.log("  • 11 avaliações completas");
  console.log("  • 10 despesas recorrentes");
  console.log("  • 11 agendamentos futuros");
  console.log("  • Todas as análises de IA preenchidas");
  console.log("  • Convênios configurados");
  console.log("  • Pagamentos marcados");
  console.log("  • Assinaturas pré-preenchidas");
  console.log("");
  console.log("%c🚀 Next steps:", "font-weight:bold;font-size:14px");
  console.log("  1. Recarregue a página (F5)");
  console.log(
    "  2. Faça login ou vá para /dashboard para ver os pacientes"
  );
  console.log(
    "  3. Navegue entre os módulos no menu lateral para explorar cada especialidade"
  );
  console.log(
    "  4. Acesse Financeiro para ver pagamentos, despesas e saldo líquido"
  );
  console.log(
    "  5. Abra cada paciente e clique em 'Análise IA' para ver o texto da análise já carregado"
  );

  return "OK — Dados demo populados com sucesso!";
})();
