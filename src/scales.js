function pct(p){return{pct:p}}

function sim(name, short, aliases, range, dir, fn, mcid, mdc){
  if (mcid === undefined) {
    const span = range[1] - range[0];
    if (span <= 10) { mcid = 2; mdc = 1.3; }       // NPRS, GRC, PGIC
    else if (span <= 20) { mcid = 3; mdc = 2; }      // WPI, SSS
    else if (span <= 30) { mcid = 4; mdc = 3; }      // CAIT
    else if (range[1] <= 3) { mcid = 0.5; mdc = 0.3; } // HAQ
    else if (range[1] <= 10) { mcid = 1.5; mdc = 1; }  // DAS28
    else { mcid = 10; mdc = 6; }                     // 0-100 scales
  } else { if (mdc === undefined) mdc = Math.round(mcid * 0.6); }
  return {id:short.toLowerCase(), shortName:short, aliases, simple:true, range, goodDirection:dir, interpret:fn, mcid, mdc};
}

const SCALES = {
  // ═══════════════ Full scales (with questions) ═══════════════

  "Oswestry Disability Index (ODI)": {
    id:"od", shortName:"ODI", aliases:["ODI"], sections:10, maxPerSection:5, mcid:10, mdc:6,
    interpret(pct){
      if(pct<=20) return {level:"Incapacidade mínima", desc:"Consegue lidar com a maioria das atividades. Orientação postural e exercícios.", color:"#16A34A"};
      if(pct<=40) return {level:"Incapacidade moderada", desc:"Maior limitação funcional. Tratamento conservador indicado.", color:"#D97706"};
      if(pct<=60) return {level:"Incapacidade severa", desc:"Atividades diárias significativamente afetadas. Reabilitação intensiva.", color:"#DC2626"};
      if(pct<=80) return {level:"Incapacidade grave", desc:"Limitação severa em todas as atividades. Intervenção multidisciplinar.", color:"#7C3AED"};
      return {level:"Incapacidade total / Restrito ao leito", desc:"Paciente acamado ou com todas as funções severamente comprometidas.", color:"#BE185D"};
    },
    questions:[
      {id:"pain",label:"Intensidade da dor",o:["Não sinto dor no momento","A dor é muito leve","A dor é moderada","A dor é forte","A dor é muito forte","A dor é a pior imaginável"]},
      {id:"personal",label:"Cuidados pessoais (lavar, vestir, etc.)",o:["Consigo cuidar de mim normalmente sem dor extra","Consigo cuidar de mim normalmente mas é muito doloroso","Cuidar de mim é doloroso, sou lento e cuidadoso","Preciso de alguma ajuda mas consigo a maior parte","Preciso de ajuda diária na maioria dos cuidados","Não me visto, lavo-me com dificuldade e fico na cama"]},
      {id:"lifting",label:"Levantar peso",o:["Consigo levantar pesos sem dor extra","Consigo levantar pesos mas causa dor extra","A dor impede levantar pesos do chão, mas consigo se colocados em local conveniente","A dor impede levantar pesos, mas consigo pesos leves se bem posicionados","Consigo levantar apenas pesos muito leves","Não consigo levantar ou carregar nada"]},
      {id:"walking",label:"Caminhar",o:["A dor não me impede de caminhar qualquer distância","A dor impede de caminhar mais de 1 km","A dor impede de caminhar mais de 400 m","A dor impede de caminhar mais de 100 m","Só consigo andar com bengala ou muletas","Fico na cama a maior parte do tempo e arrasto-me ao banheiro"]},
      {id:"sitting",label:"Sentar",o:["Consigo sentar em qualquer cadeira o tempo que quiser","Consigo sentar apenas na minha cadeira favorita o tempo que quiser","A dor impede de sentar mais de 1 hora","A dor impede de sentar mais de 30 minutos","A dor impede de sentar mais de 10 minutos","A dor impede de sentar completamente"]},
      {id:"standing",label:"Ficar em pé",o:["Consigo ficar em pé o tempo que quiser sem dor extra","Consigo ficar em pé o tempo que quiser mas causa dor extra","A dor impede de ficar em pé mais de 1 hora","A dor impede de ficar em pé mais de 30 minutos","A dor impede de ficar em pé mais de 10 minutos","Evito ficar em pé e a dor impede completamente"]},
      {id:"sleeping",label:"Dormir",o:["A dor não atrapalha meu sono","Só durmo bem usando analgésicos","Mesmo com analgésicos, durmo menos de 6 horas","Mesmo com analgésicos, durmo menos de 4 horas","Mesmo com analgésicos, durmo menos de 2 horas","A dor impede de dormir completamente"]},
      {id:"social",label:"Vida social",o:["Minha vida social é normal e sem dor extra","Minha vida social é normal mas a dor aumenta","A dor não afeta significativamente exceto em atividades mais energéticas","A dor restringiu minha vida social e saio menos","A dor restringiu minha vida social ao meu lar","Não tenho vida social por causa da dor"]},
      {id:"traveling",label:"Viajar",o:["Consigo viajar para qualquer lugar sem dor extra","Consigo viajar para qualquer lugar mas causa dor extra","A dor é forte mas consigo viagens de mais de 2 horas","A dor me restringe a viagens de menos de 1 hora","A dor me restringe a pequenas viagens necessárias de menos de 30 min","A dor me impede de viajar exceto para tratamento"]},
    ],
  },

  "Neck Disability Index (NDI)": {
    id:"ndi", shortName:"NDI", aliases:["NDI","NDI (Neck Disability Index)"], sections:10, maxPerSection:5, mcid:10, mdc:5,
    interpret(pct){
      if(pct<=20) return {level:"Incapacidade mínima", desc:"Pouca ou nenhuma limitação funcional.", color:"#16A34A"};
      if(pct<=40) return {level:"Incapacidade moderada", desc:"Limitação parcial. Acompanhamento fisioterapêutico.", color:"#D97706"};
      if(pct<=60) return {level:"Incapacidade severa", desc:"Limitação significativa nas AVDs. Reabilitação intensiva.", color:"#DC2626"};
      if(pct<=80) return {level:"Incapacidade grave", desc:"Comprometimento importante. Avaliação multidisciplinar.", color:"#7C3AED"};
      return {level:"Incapacidade total", desc:"Restrição completa. Intervenção urgente.", color:"#BE185D"};
    },
    questions:[
      {id:"pain",label:"Intensidade da dor",o:["Não sinto dor no momento","A dor é muito leve","A dor é moderada","A dor é forte","A dor é muito forte","A dor é a pior imaginável"]},
      {id:"personal",label:"Cuidados pessoais (lavar, vestir, etc.)",o:["Consigo cuidar de mim normalmente sem dor extra","Consigo cuidar de mim normalmente mas causa dor extra","Cuidar de mim é doloroso e sou lento","Preciso de alguma ajuda mas consigo a maior parte","Preciso de ajuda diária na maioria dos cuidados","Não consigo me vestir, lavo-me com dificuldade e fico na cama"]},
      {id:"lifting",label:"Levantar peso",o:["Consigo levantar pesos sem dor extra","Consigo levantar pesos mas causa dor extra","A dor impede de levantar pesos do chão, mas consigo se bem posicionados","A dor impede de levantar pesos, mas consigo pesos leves","Consigo levantar apenas pesos muito leves","Não consigo levantar ou carregar nada"]},
      {id:"reading",label:"Leitura",o:["Consigo ler o quanto quiser sem dor","Consigo ler o quanto quiser com dor leve","Consigo ler o quanto quiser com dor moderada","Não consigo ler por muito tempo por dor moderada","Mal consigo ler por causa de dor intensa","Não consigo ler por causa da dor"]},
      {id:"headache",label:"Cefaleia",o:["Não tenho dores de cabeça","Tenho dores de cabeça leves e raras","Tenho dores de cabeça moderadas e ocasionais","Tenho dores de cabeça moderadas e frequentes","Tenho dores de cabeça fortes e frequentes","Tenho dores de cabeça constantes"]},
      {id:"concentration",label:"Concentração",o:["Consigo me concentrar totalmente","Consigo me concentrar com leve dificuldade","Tenho alguma dificuldade para me concentrar","Tenho bastante dificuldade","Tenho muita dificuldade","Não consigo me concentrar"]},
      {id:"work",label:"Trabalho",o:["Consigo trabalhar o quanto quiser","Consigo fazer meu trabalho habitual mas nada além","Consigo fazer a maior parte do trabalho mas não tudo","Não consigo fazer meu trabalho habitual","Mal consigo fazer qualquer trabalho","Não consigo trabalhar"]},
      {id:"driving",label:"Condução de veículos",o:["Consigo dirigir sem dor","Consigo dirigir o quanto quiser com dor leve","Consigo dirigir o quanto quiser com dor moderada","Não consigo dirigir por muito tempo por dor moderada","Mal consigo dirigir por causa de dor intensa","Não consigo dirigir por causa da dor"]},
      {id:"sleeping",label:"Dormir",o:["Não tenho problemas para dormir","Meu sono é levemente perturbado (<1h)","Meu sono é moderadamente perturbado (1-2h)","Meu sono é moderadamente perturbado (2-3h)","Meu sono é intensamente perturbado (3-5h)","Meu sono é completamente perturbado (5-7h)"]},
      {id:"recreation",label:"Lazer / Recreação",o:["Consigo fazer todas as atividades sem dor","Consigo fazer todas as atividades com dor leve","Consigo fazer a maioria com dor moderada","Consigo fazer poucas atividades","Mal consigo fazer qualquer atividade","Não consigo fazer nenhuma atividade de lazer"]},
    ],
  },

  "Lysholm Knee Score": {
    id:"lysholm", shortName:"Lysholm", aliases:["Lysholm","Lysholm Knee Score"], sections:8, maxPerSection:null, mcid:10, mdc:8,
    interpret(raw){
      if(raw>=95) return {level:"Excelente", desc:"Função normal ou quase normal do joelho.", color:"#16A34A"};
      if(raw>=84) return {level:"Bom", desc:"Leve limitação funcional.", color:"#D97706"};
      if(raw>=65) return {level:"Regular", desc:"Limitação moderada. Atividades intensas comprometidas.", color:"#DC2626"};
      return {level:"Ruim", desc:"Limitação severa. Avaliação ortopédica.", color:"#BE185D"};
    },
    questions:[
      {id:"limp",label:"Claudicação",max:5,o:[{t:"Não",s:5},{t:"Leve ou periódica",s:3},{t:"Forte e constante",s:0}]},
      {id:"support",label:"Suporte / Apoio",max:5,o:[{t:"Não necessito",s:5},{t:"Bengala ou muleta",s:2},{t:"Impossível apoiar",s:0}]},
      {id:"locking",label:"Bloqueio articular",max:15,o:[{t:"Sem bloqueio",s:15},{t:"Sensação de bloqueio sem travamento",s:10},{t:"Bloqueio ocasional",s:6},{t:"Bloqueio frequente",s:2},{t:"Articulação travada",s:0}]},
      {id:"instability",label:"Instabilidade / Falseios",max:25,o:[{t:"Nunca falseia",s:25},{t:"Raramente durante esportes",s:20},{t:"Frequentemente durante esportes (incapaz de praticar)",s:15},{t:"Ocasionalmente nas AVDs",s:10},{t:"Frequentemente nas AVDs",s:5},{t:"A cada passo",s:0}]},
      {id:"pain",label:"Dor",max:25,o:[{t:"Nenhuma",s:25},{t:"Leve e intermitente durante esforço intenso",s:20},{t:"Moderada durante esforço intenso",s:15},{t:"Forte durante ou após caminhada > 2 km",s:10},{t:"Forte durante ou após caminhada < 2 km",s:5},{t:"Constante e forte",s:0}]},
      {id:"stairs",label:"Subir escadas",max:10,o:[{t:"Sem dificuldade",s:10},{t:"Leve dificuldade",s:6},{t:"Um degrau de cada vez",s:2},{t:"Impossível",s:0}]},
      {id:"squat",label:"Agachamento",max:5,o:[{t:"Sem dificuldade",s:5},{t:"Leve dificuldade",s:4},{t:"Não além de 90°",s:2},{t:"Impossível",s:0}]},
    ],
    calculate(answers){
      const sum = Object.keys(answers).reduce((t,k) => t + (answers[k]??0), 0);
      return {raw:sum, pct:Math.round(sum/100*100)};
    },
  },

  "WOMAC (Western Ontario and McMaster Universities Osteoarthritis Index)": {
    id:"womac", shortName:"WOMAC", aliases:["WOMAC"], sections:24, maxPerSection:4, mcid:12, mdc:8,
    interpret(pct){
      if(pct<=20) return {level:"Sintomas leves", desc:"Pouco impacto na qualidade de vida.", color:"#16A34A"};
      if(pct<=40) return {level:"Sintomas moderados", desc:"Limitação parcial. Tratamento conservador.", color:"#D97706"};
      if(pct<=60) return {level:"Sintomas severos", desc:"Limitação funcional importante.", color:"#DC2626"};
      if(pct<=80) return {level:"Sintomas graves", desc:"Comprometimento significativo.", color:"#7C3AED"};
      return {level:"Sintomas muito graves", desc:"Dor e rigidez intensas.", color:"#BE185D"};
    },
    questions:[
      ...[["Caminhando em superfície plana","walk_flat"],["Subindo ou descendo escadas","stairs"],["À noite na cama","night"],["Sentado ou deitado","sit_lie"],["Em posição ortostática","stand"]]
        .map(([txt,id],i)=>({id,label:`Dor: ${txt}`,o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]})),
      ...[["Rigidez matinal (ao acordar)","stiff_morning"],["Rigidez após sentar/deitar ao longo do dia","stiff_day"]]
        .map(([txt,id])=>({id,label:`Rigidez: ${txt}`,o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]})),
      ...[["Descer escadas","desc_stairs"],["Subir escadas","asc_stairs"],["Levantar da posição sentada","sit_to_stand"],["Ficar em pé","stand"],["Curvar-se / pegar algo no chão","bend"],["Caminhar em superfície plana","walk_flat2"],["Entrar e sair de um carro","car"],["Ir às compras","shopping"],["Vestir meias","socks"],["Levantar da cama","bed"],["Tirar meias","socks_off"],["Deitar na cama / virar-se","lie_bed"],["Entrar e sair do banho","bath"],["Sentar","sit"],["Sentar e levantar do vaso sanitário","toilet"],["Tarefas domésticas pesadas","heavy_chores"],["Tarefas domésticas leves","light_chores"]]
        .map(([txt,id],i)=>({id,label:`AVD: ${txt}`,o:["Nenhuma dificuldade","Leve","Moderada","Forte","Muito forte"]})),
    ],
  },

  "FAAM (Foot and Ankle Ability Measure) – ADL": {
    id:"faam", shortName:"FAAM", aliases:["FAAM","FAAM (Foot and Ankle Ability Measure)"], sections:21, maxPerSection:4, mcid:8, mdc:5,
    interpret(pct){
      if(pct<=24) return {level:"Comprometimento mínimo", desc:"Boa função do pé e tornozelo.", color:"#16A34A"};
      if(pct<=49) return {level:"Comprometimento leve-moderado", desc:"Limitação parcial. Reabilitação.", color:"#D97706"};
      if(pct<=74) return {level:"Comprometimento moderado-grave", desc:"Limitação funcional significativa.", color:"#DC2626"};
      return {level:"Comprometimento grave", desc:"Função muito prejudicada.", color:"#BE185D"};
    },
    questions:[
      ["Ficar em pé","stand"],["Caminhar em superfície plana","walk_flat"],["Caminhar em superfície irregular","walk_irreg"],
      ["Subir escadas","stairs"],["Descer escadas","desc_stairs"],["Correr","run"],["Pular","jump"],
      ["Agarrar / mudar de direção rápido","cut"],["Agachar / abaixar","squat"],
      ["Atividades de baixo impacto (caminhada, ioga)","low_impact"],["Atividades de alto impacto (corrida, jump)","high_impact"],
      ["Trabalho em pé","work_stand"],["Trabalho sentado","work_sit"],["Dirigir","drive"],["Subir e descer do carro","car"],
      ["Vestir calçados","shoes"],["Dormir","sleep"],["Atividades sociais","social"],
      ["Atividades domésticas","chores"],["Cuidados pessoais","personal"],["Qualidade de vida geral","qol"],
    ].map(([txt,id])=>({id,label:txt,o:["Sem dificuldade","Leve dificuldade","Moderada dificuldade","Extrema dificuldade","Incapaz de realizar"]})),
  },

  "QuickDASH (Disabilities of the Arm, Shoulder and Hand)": {
    id:"dash", shortName:"QuickDASH", aliases:["DASH","DASH (Disabilities of the Arm, Shoulder and Hand)"], sections:12, maxPerSection:5, mcid:15, mdc:11,
    interpret(pct){
      if(pct<=20) return {level:"Função preservada", desc:"Pouca ou nenhuma limitação do membro superior.", color:"#16A34A"};
      if(pct<=40) return {level:"Limitação leve", desc:"Impacto funcional parcial.", color:"#D97706"};
      if(pct<=60) return {level:"Limitação moderada", desc:"Dificuldade em atividades com uso do membro.", color:"#DC2626"};
      if(pct<=80) return {level:"Limitação grave", desc:"Comprometimento importante.", color:"#7C3AED"};
      return {level:"Limitação muito grave", desc:"Membro superior severamente comprometido.", color:"#BE185D"};
    },
    questions:[
      ["Abrir um vidro novo ou bem fechado","jar"],["Fazer tarefas domésticas pesadas","heavy_chores"],
      ["Carregar sacola de compras ou maleta","carry"],["Lavar as costas","wash_back"],
      ["Usar faca para cortar alimentos","knife"],["Atividades de lazer que exigem esforço do braço","recreation_strenuous"],
      ["Atividades de lazer que exigem pouco esforço","recreation_light"],["Problemas para se vestir","dress"],
      ["Atividade sexual","sexual"],["Consegue realizar suas atividades por quanto tempo?","duration"],
      ["Quanto interferiu na sua vida social?","social"],["Dor atrapalhou o sono?","sleep"],
    ].map(([txt,id])=>({id,label:txt,o:["Sem dificuldade","Leve dificuldade","Moderada dificuldade","Muita dificuldade","Incapaz"]})),
  },

  // ═══════════════ Simple scales (numeric input) ═══════════════

  "Roland Morris Disability Questionnaire (RMDQ)": sim("rmdq","RMDQ",["RMDQ","Roland Morris"], [0,100], "highIsBad", s=>{
    if(s<=20) return pct({level:"Incapacidade mínima", desc:"Pouca limitação funcional.", color:"#16A34A"});
    if(s<=40) return pct({level:"Incapacidade moderada", desc:"Limitação parcial nas AVDs.", color:"#D97706"});
    if(s<=60) return pct({level:"Incapacidade severa", desc:"Limitação funcional importante.", color:"#DC2626"});
    if(s<=80) return pct({level:"Incapacidade grave", desc:"Comprometimento significativo.", color:"#7C3AED"});
    return pct({level:"Incapacidade total", desc:"Função severamente comprometida.", color:"#BE185D"});
  }),

  "KOOS (Knee injury and Osteoarthritis Outcome Score)": sim("koos","KOOS",["KOOS"], [0,100], "highIsGood", s=>{
    if(s>=80) return pct({level:"Bom / Excelente", desc:"Boa função do joelho.", color:"#16A34A"});
    if(s>=60) return pct({level:"Moderado", desc:"Limitação parcial. Tratamento em andamento.", color:"#D97706"});
    if(s>=40) return pct({level:"Ruim", desc:"Limitação funcional significativa.", color:"#DC2626"});
    return pct({level:"Muito ruim", desc:"Função severamente comprometida.", color:"#BE185D"});
  }),

  "Numeric Pain Rating Scale (NPRS)": sim("nprs","NPRS",["NPRS","VAS / NPRS","VAS"], [0,10], "highIsBad", s=>{
    if(s<=3) return pct({level:"Dor leve", desc:"Bom controle da dor.", color:"#16A34A"});
    if(s<=6) return pct({level:"Dor moderada", desc:"Dor que limita parcialmente.", color:"#D97706"});
    if(s<=8) return pct({level:"Dor intensa", desc:"Dor com impacto funcional importante.", color:"#DC2626"});
    return pct({level:"Dor insuportável", desc:"Dor máxima. Intervenção imediata.", color:"#BE185D"});
  }),

  "Global Rating of Change (GRC)": sim("grc","GRC",["GRC","Global Rating of Change"], [-7,7], "highIsGood", s=>{
    if(s>=5) return pct({level:"Melhora importante", desc:"Melhora significativa percebida pelo paciente.", color:"#16A34A"});
    if(s>=1) return pct({level:"Melhora leve", desc:"Pequena melhora percebida.", color:"#D97706"});
    if(s===0) return pct({level:"Sem mudança", desc:"Estado clínico inalterado.", color:"#7C3AED"});
    if(s>=-3) return pct({level:"Piora leve", desc:"Pequena piora percebida.", color:"#DC2626"});
    return pct({level:"Piora importante", desc:"Piora significativa. Reavaliação necessária.", color:"#BE185D"});
  }),

  "Start MSK – triagem biopsicossocial": sim("startmsk","StartMSK",["Start MSK"], [0,12], "highIsBad", s=>{
    if(s<=3) return pct({level:"Baixo risco", desc:"Baixo risco de mau prognóstico.", color:"#16A34A"});
    if(s<=7) return pct({level:"Médio risco", desc:"Risco moderado. Atenção a fatores psicossociais.", color:"#D97706"});
    return pct({level:"Alto risco", desc:"Alto risco. Abordagem biopsicossocial necessária.", color:"#DC2626"});
  }),

  "FABQ (Fear Avoidance Beliefs)": sim("fabq","FABQ",["FABQ","Fear Avoidance Beliefs Questionnaire"], [0,96], "highIsBad", s=>{
    if(s<=37) return pct({level:"Baixas crenças de evitação", desc:"Pouco impacto psicossocial.", color:"#16A34A"});
    if(s<=60) return pct({level:"Crenças moderadas", desc:"Atenção a fatores de evitação.", color:"#D97706"});
    return pct({level:"Altas crenças de evitação", desc:"Crenças disfuncionais. Abordagem cognitivo-comportamental.", color:"#DC2626"});
  }),

  "Tampa Scale for Kinesiophobia (TSK-17)": sim("tsk","TSK-17",["TSK-17","Tampa Scale for Kinesiophobia"], [17,68], "highIsBad", s=>{
    if(s<=30) return pct({level:"Baixa cinesiofobia", desc:"Pouco medo de movimento.", color:"#16A34A"});
    if(s<=44) return pct({level:"Moderada", desc:"Cinesiofobia moderada. Educação em dor.", color:"#D97706"});
    return pct({level:"Alta cinesiofobia", desc:"Medo intenso. PNE e TCC indicados.", color:"#DC2626"});
  }),

  "IKDC Subjective Knee Form": sim("ikdc","IKDC",["IKDC","IKDC Subjective Knee Form"], [0,100], "highIsGood", s=>{
    if(s>=80) return pct({level:"Bom / Excelente", desc:"Boa função do joelho.", color:"#16A34A"});
    if(s>=60) return pct({level:"Moderado", desc:"Limitação parcial.", color:"#D97706"});
    if(s>=40) return pct({level:"Ruim", desc:"Limitação funcional importante.", color:"#DC2626"});
    return pct({level:"Muito ruim", desc:"Função severamente comprometida.", color:"#BE185D"});
  }),

  "ACL-RSI (Return to Sport after Injury)": sim("acl-rsi","ACL-RSI",["ACL-RSI"], [0,100], "highIsGood", s=>{
    if(s>=80) return pct({level:"Pronto para retorno", desc:"Alta confiança para retorno esportivo.", color:"#16A34A"});
    if(s>=60) return pct({level:"Moderada confiança", desc:"Trabalhar aspectos psicológicos do retorno.", color:"#D97706"});
    if(s>=40) return pct({level:"Baixa confiança", desc:"Medo de re-lesão significativo.", color:"#DC2626"});
    return pct({level:"Muito baixa confiança", desc:"Alta cinesiofobia. Preparo psicológico necessário.", color:"#BE185D"});
  }),

  "WORC (Western Ontario Rotator Cuff Index)": sim("worc","WORC",["WORC"], [0,100], "highIsGood", s=>{
    if(s>=80) return pct({level:"Excelente", desc:"Boa função do ombro.", color:"#16A34A"});
    if(s>=60) return pct({level:"Moderado", desc:"Limitação parcial do ombro.", color:"#D97706"});
    if(s>=40) return pct({level:"Ruim", desc:"Comprometimento funcional importante.", color:"#DC2626"});
    return pct({level:"Muito ruim", desc:"Função severamente comprometida.", color:"#BE185D"});
  }),

  "ASES (American Shoulder and Elbow Surgeons)": sim("ases","ASES",["ASES"], [0,100], "highIsGood", s=>{
    if(s>=80) return pct({level:"Excelente", desc:"Boa função do ombro.", color:"#16A34A"});
    if(s>=60) return pct({level:"Moderado", desc:"Limitação parcial.", color:"#D97706"});
    if(s>=40) return pct({level:"Ruim", desc:"Comprometimento importante.", color:"#DC2626"});
    return pct({level:"Muito ruim", desc:"Função severamente comprometida.", color:"#BE185D"});
  }),

  "Oxford Shoulder Score": sim("oxford-ss","Oxford SS",["Oxford Shoulder Score","Oxford Shoulder Score"], [0,100], "highIsBad", s=>{
    if(s<=20) return pct({level:"Função preservada", desc:"Boa função do ombro.", color:"#16A34A"});
    if(s<=40) return pct({level:"Limitação moderada", desc:"Limitação parcial.", color:"#D97706"});
    if(s<=60) return pct({level:"Limitação severa", desc:"Comprometimento importante.", color:"#DC2626"});
    return pct({level:"Limitação muito severa", desc:"Ombro severamente comprometido.", color:"#BE185D"});
  }),

  "PRTEE (Patient-Rated Tennis Elbow Evaluation)": sim("prtee","PRTEE",["PRTEE"], [0,100], "highIsBad", s=>{
    if(s<=20) return pct({level:"Função preservada", desc:"Pouca limitação do cotovelo.", color:"#16A34A"});
    if(s<=40) return pct({level:"Limitação leve", desc:"Limitação parcial.", color:"#D97706"});
    if(s<=60) return pct({level:"Limitação moderada", desc:"Comprometimento funcional.", color:"#DC2626"});
    return pct({level:"Limitação grave", desc:"Cotovelo severamente comprometido.", color:"#BE185D"});
  }),

  "Foot Function Index (FFI)": sim("ffi","FFI",["FFI","Foot Function Index"], [0,100], "highIsBad", s=>{
    if(s<=25) return pct({level:"Função preservada", desc:"Boa função do pé.", color:"#16A34A"});
    if(s<=50) return pct({level:"Limitação moderada", desc:"Limitação parcial.", color:"#D97706"});
    if(s<=75) return pct({level:"Limitação severa", desc:"Comprometimento funcional.", color:"#DC2626"});
    return pct({level:"Limitação muito severa", desc:"Pé severamente comprometido.", color:"#BE185D"});
  }),

  "VISA-A (Victorian Institute of Sport Assessment – Achilles)": sim("visa-a","VISA-A",["VISA-A"], [0,100], "highIsGood", s=>{
    if(s>=80) return pct({level:"Bom / Excelente", desc:"Boa função do tendão de Aquiles.", color:"#16A34A"});
    if(s>=60) return pct({level:"Moderado", desc:"Limitação parcial.", color:"#D97706"});
    if(s>=40) return pct({level:"Ruim", desc:"Comprometimento importante.", color:"#DC2626"});
    return pct({level:"Muito ruim", desc:"Função severamente comprometida.", color:"#BE185D"});
  }),

  "VISA-P (Victorian Institute of Sport Assessment – Patellar)": sim("visa-p","VISA-P",["VISA-P"], [0,100], "highIsGood", s=>{
    if(s>=80) return pct({level:"Bom / Excelente", desc:"Boa função patelar.", color:"#16A34A"});
    if(s>=60) return pct({level:"Moderado", desc:"Limitação parcial.", color:"#D97706"});
    if(s>=40) return pct({level:"Ruim", desc:"Comprometimento importante.", color:"#DC2626"});
    return pct({level:"Muito ruim", desc:"Função severamente comprometida.", color:"#BE185D"});
  }),

  "AKPS (Anterior Knee Pain Scale)": sim("akps","AKPS",["AKPS"], [0,100], "highIsGood", s=>{
    if(s>=80) return pct({level:"Bom / Excelente", desc:"Boa função patelofemoral.", color:"#16A34A"});
    if(s>=60) return pct({level:"Moderado", desc:"Limitação parcial.", color:"#D97706"});
    if(s>=40) return pct({level:"Ruim", desc:"Comprometimento importante.", color:"#DC2626"});
    return pct({level:"Muito ruim", desc:"Função severamente comprometida.", color:"#BE185D"});
  }),

  "VISA-G": sim("visa-g","VISA-G",["VISA-G"], [0,100], "highIsGood", s=>{
    if(s>=80) return pct({level:"Bom / Excelente", desc:"Boa função glútea.", color:"#16A34A"});
    if(s>=60) return pct({level:"Moderado", desc:"Limitação parcial.", color:"#D97706"});
    if(s>=40) return pct({level:"Ruim", desc:"Comprometimento importante.", color:"#DC2626"});
    return pct({level:"Muito ruim", desc:"Função severamente comprometida.", color:"#BE185D"});
  }),

  "iHOT-12 (International Hip Outcome Tool)": sim("ihot12","iHOT-12",["iHOT-12"], [0,100], "highIsGood", s=>{
    if(s>=80) return pct({level:"Bom / Excelente", desc:"Boa função do quadril.", color:"#16A34A"});
    if(s>=60) return pct({level:"Moderado", desc:"Limitação parcial.", color:"#D97706"});
    if(s>=40) return pct({level:"Ruim", desc:"Comprometimento importante.", color:"#DC2626"});
    return pct({level:"Muito ruim", desc:"Função severamente comprometida.", color:"#BE185D"});
  }),

  "HOS (Hip Outcome Score)": sim("hos","HOS",["HOS"], [0,100], "highIsGood", s=>{
    if(s>=80) return pct({level:"Bom / Excelente", desc:"Boa função do quadril.", color:"#16A34A"});
    if(s>=60) return pct({level:"Moderado", desc:"Limitação parcial.", color:"#D97706"});
    if(s>=40) return pct({level:"Ruim", desc:"Comprometimento importante.", color:"#DC2626"});
    return pct({level:"Muito ruim", desc:"Função severamente comprometida.", color:"#BE185D"});
  }),

  "HOOS (Hip disability and Osteoarthritis Outcome Score)": sim("hoos","HOOS",["HOOS"], [0,100], "highIsGood", s=>{
    if(s>=80) return pct({level:"Bom / Excelente", desc:"Boa função do quadril.", color:"#16A34A"});
    if(s>=60) return pct({level:"Moderado", desc:"Limitação parcial.", color:"#D97706"});
    if(s>=40) return pct({level:"Ruim", desc:"Comprometimento importante.", color:"#DC2626"});
    return pct({level:"Muito ruim", desc:"Função severamente comprometida.", color:"#BE185D"});
  }),

  "Swiss Spinal Stenosis Questionnaire": sim("sss","S.S.S.",["Swiss Spinal Stenosis Questionnaire"], [0,100], "highIsBad", s=>{
    if(s<=25) return pct({level:"Sintomas leves", desc:"Pouca limitação.", color:"#16A34A"});
    if(s<=50) return pct({level:"Sintomas moderados", desc:"Limitação parcial.", color:"#D97706"});
    if(s<=75) return pct({level:"Sintomas severos", desc:"Comprometimento importante.", color:"#DC2626"});
    return pct({level:"Sintomas graves", desc:"Limitação severa.", color:"#BE185D"});
  }),

  "Boston Carpal Tunnel Questionnaire (BCTQ)": sim("bctq","BCTQ",["BCTQ","Boston Carpal Tunnel Questionnaire"], [0,100], "highIsBad", s=>{
    if(s<=25) return pct({level:"Sintomas leves", desc:"Pouca limitação da mão.", color:"#16A34A"});
    if(s<=50) return pct({level:"Sintomas moderados", desc:"Limitação funcional parcial.", color:"#D97706"});
    if(s<=75) return pct({level:"Sintomas severos", desc:"Comprometimento sensório-motor.", color:"#DC2626"});
    return pct({level:"Sintomas graves", desc:"Função manual severamente comprometida.", color:"#BE185D"});
  }),

  "Patient-Rated Wrist Evaluation": sim("prwe","PRWE",["Patient-Rated Wrist Evaluation"], [0,100], "highIsBad", s=>{
    if(s<=25) return pct({level:"Função preservada", desc:"Boa função do punho.", color:"#16A34A"});
    if(s<=50) return pct({level:"Limitação moderada", desc:"Limitação parcial.", color:"#D97706"});
    if(s<=75) return pct({level:"Limitação severa", desc:"Comprometimento funcional.", color:"#DC2626"});
    return pct({level:"Limitação muito severa", desc:"Punho severamente comprometido.", color:"#BE185D"});
  }),

  "AUSCAN (Australian/Canadian Hand OA Index)": sim("auscan","AUSCAN",["AUSCAN"], [0,100], "highIsBad", s=>{
    if(s<=25) return pct({level:"Sintomas leves", desc:"Pouca limitação manual.", color:"#16A34A"});
    if(s<=50) return pct({level:"Sintomas moderados", desc:"Limitação parcial.", color:"#D97706"});
    if(s<=75) return pct({level:"Sintomas severos", desc:"Comprometimento funcional.", color:"#DC2626"});
    return pct({level:"Sintomas graves", desc:"Função manual severamente comprometida.", color:"#BE185D"});
  }),

  "Fonseca Anamnestic Index": sim("fonseca","Fonseca",["Fonseca Anamnestic Index"], [0,100], "highIsBad", s=>{
    if(s<=15) return pct({level:"Sem disfunção", desc:"Função temporomandibular normal.", color:"#16A34A"});
    if(s<=45) return pct({level:"Disfunção leve", desc:"DTM leve.", color:"#D97706"});
    if(s<=70) return pct({level:"Disfunção moderada", desc:"DTM moderada.", color:"#DC2626"});
    return pct({level:"Disfunção severa", desc:"DTM severa. Avaliação odontológica.", color:"#BE185D"});
  }),

  "RDC/TMD": sim("rdctmd","RDC/TMD",["RDC/TMD"], [0,100], "highIsBad", s=>{
    if(s<=25) return pct({level:"Leve", desc:"Pouca limitação da ATM.", color:"#16A34A"});
    if(s<=50) return pct({level:"Moderado", desc:"Limitação funcional parcial.", color:"#D97706"});
    if(s<=75) return pct({level:"Severo", desc:"Comprometimento importante.", color:"#DC2626"});
    return pct({level:"Muito severo", desc:"Função severamente comprometida.", color:"#BE185D"});
  }),

  "SRS-22 (Scoliosis Research Society)": sim("srs22","SRS-22",["SRS-22"], [0,100], "highIsGood", s=>{
    if(s>=80) return pct({level:"Boa qualidade de vida", desc:"Pouco impacto da escoliose.", color:"#16A34A"});
    if(s>=60) return pct({level:"Moderado", desc:"Impacto parcial da deformidade.", color:"#D97706"});
    if(s>=40) return pct({level:"Ruim", desc:"Impacto importante na QV.", color:"#DC2626"});
    return pct({level:"Muito ruim", desc:"Impacto severo na QV.", color:"#BE185D"});
  }),

  "Limb Symmetry Index": sim("lsi","LSI",["Limb Symmetry Index"], [0,100], "highIsGood", s=>{
    if(s>=90) return pct({level:"Simetria funcional", desc:"Retorno esportivo seguro.", color:"#16A34A"});
    if(s>=80) return pct({level:"Assimetria leve", desc:"Próximo do critério de liberação.", color:"#D97706"});
    if(s>=70) return pct({level:"Assimetria moderada", desc:"Déficit neuromuscular presente.", color:"#DC2626"});
    return pct({level:"Assimetria grave", desc:"Risco elevado de re-lesão.", color:"#BE185D"});
  }),

  "HAGOS (Copenhagen Hip and Groin Outcome Score)": sim("hagos","HAGOS",["HAGOS"], [0,100], "highIsGood", s=>{
    if(s>=80) return pct({level:"Bom / Excelente", desc:"Boa função do quadril/quadril.", color:"#16A34A"});
    if(s>=60) return pct({level:"Moderado", desc:"Limitação parcial.", color:"#D97706"});
    if(s>=40) return pct({level:"Ruim", desc:"Comprometimento importante.", color:"#DC2626"});
    return pct({level:"Muito ruim", desc:"Função severamente comprometida.", color:"#BE185D"});
  }),

  "Fibromyalgia Impact Questionnaire (FIQ)": sim("fiq","FIQ",["FIQ","Fibromyalgia Impact Questionnaire"], [0,100], "highIsBad", s=>{
    if(s<=30) return pct({level:"Impacto leve", desc:"Bom controle da fibromialgia.", color:"#16A34A"});
    if(s<=55) return pct({level:"Impacto moderado", desc:"Fibromialgia com limitação parcial.", color:"#D97706"});
    if(s<=80) return pct({level:"Impacto severo", desc:"Comprometimento funcional importante.", color:"#DC2626"});
    return pct({level:"Impacto muito severo", desc:"Fibromialgia grave. Abordagem multidisciplinar.", color:"#BE185D"});
  }),

  "WPI (Widespread Pain Index)": sim("wpi","WPI",["WPI"], [0,19], "highIsBad", s=>{
    if(s<=6) return pct({level:"Dor localizada", desc:"Poucas áreas dolorosas.", color:"#16A34A"});
    if(s<=11) return pct({level:"Dor disseminada moderada", desc:"Múltiplas áreas dolorosas.", color:"#D97706"});
    return pct({level:"Dor generalizada", desc:"Dor difusa. Critério para fibromialgia.", color:"#DC2626"});
  }),

  "SSS (Symptom Severity Scale)": sim("sss2","SSS",["SSS","Symptom Severity Scale"], [0,12], "highIsBad", s=>{
    if(s<=4) return pct({level:"Sintomas leves", desc:"Pouca severidade.", color:"#16A34A"});
    if(s<=8) return pct({level:"Sintomas moderados", desc:"Severidade moderada.", color:"#D97706"});
    return pct({level:"Sintomas graves", desc:"Alta severidade. Intervenção necessária.", color:"#DC2626"});
  }),

  "HAQ (Health Assessment Questionnaire)": sim("haq","HAQ",["HAQ"], [0,3], "highIsBad", s=>{
    if(s<=0.5) return pct({level:"Incapacidade mínima", desc:"Função preservada.", color:"#16A34A"});
    if(s<=1.5) return pct({level:"Incapacidade moderada", desc:"Limitação parcial nas AVDs.", color:"#D97706"});
    return pct({level:"Incapacidade grave", desc:"Dependência funcional importante.", color:"#DC2626"});
  }),

  "DAS28 (Disease Activity Score)": sim("das28","DAS28",["DAS28"], [0,9.4], "highIsBad", s=>{
    if(s<=2.6) return pct({level:"Remissão", desc:"Atividade inflamatória controlada.", color:"#16A34A"});
    if(s<=3.2) return pct({level:"Baixa atividade", desc:"Pouca atividade inflamatória.", color:"#16A34A"});
    if(s<=5.1) return pct({level:"Atividade moderada", desc:"Atividade inflamatória moderada.", color:"#D97706"});
    return pct({level:"Alta atividade", desc:"Atividade inflamatória intensa.", color:"#DC2626"});
  }),

  "Oxford Knee Score": sim("oxford-ks","Oxford KS",["Oxford Knee Score"], [0,100], "highIsBad", s=>{
    if(s<=20) return pct({level:"Função preservada", desc:"Boa função do joelho.", color:"#16A34A"});
    if(s<=40) return pct({level:"Limitação moderada", desc:"Limitação parcial.", color:"#D97706"});
    if(s<=60) return pct({level:"Limitação severa", desc:"Comprometimento importante.", color:"#DC2626"});
    return pct({level:"Limitação muito severa", desc:"Joelho severamente comprometido.", color:"#BE185D"});
  }),

  "Oxford Hip Score": sim("oxford-hs","Oxford HS",["Oxford Hip Score"], [0,100], "highIsBad", s=>{
    if(s<=20) return pct({level:"Função preservada", desc:"Boa função do quadril.", color:"#16A34A"});
    if(s<=40) return pct({level:"Limitação moderada", desc:"Limitação parcial.", color:"#D97706"});
    if(s<=60) return pct({level:"Limitação severa", desc:"Comprometimento importante.", color:"#DC2626"});
    return pct({level:"Limitação muito severa", desc:"Quadril severamente comprometido.", color:"#BE185D"});
  }),

  "Spadi (Shoulder Pain and Disability Index)": sim("spadi","SPADI",["Spadi"], [0,100], "highIsBad", s=>{
    if(s<=20) return pct({level:"Função preservada", desc:"Boa função do ombro.", color:"#16A34A"});
    if(s<=40) return pct({level:"Limitação leve", desc:"Limitação parcial.", color:"#D97706"});
    if(s<=60) return pct({level:"Limitação moderada", desc:"Comprometimento funcional.", color:"#DC2626"});
    return pct({level:"Limitação grave", desc:"Ombro severamente comprometido.", color:"#BE185D"});
  }),

  "WOSI (Western Ontario Shoulder Instability Index)": sim("wosi","WOSI",["WOSI"], [0,100], "highIsBad", s=>{
    if(s<=20) return pct({level:"Boa estabilidade", desc:"Instabilidade leve.", color:"#16A34A"});
    if(s<=40) return pct({level:"Instabilidade moderada", desc:"Limitação parcial.", color:"#D97706"});
    if(s<=60) return pct({level:"Instabilidade severa", desc:"Comprometimento importante.", color:"#DC2626"});
    return pct({level:"Instabilidade muito severa", desc:"Ombro severamente instável.", color:"#BE185D"});
  }),

  "Patient Global Impression of Change (PGIC)": sim("pgic","PGIC",["PGIC","Patient Global Impression of Change"], [1,7], "highIsGood", s=>{
    if(s>=6) return pct({level:"Melhora importante", desc:"Melhora significativa.", color:"#16A34A"});
    if(s>=4) return pct({level:"Melhora leve / Sem mudança", desc:"Pequena mudança.", color:"#D97706"});
    if(s>=2) return pct({level:"Piora leve", desc:"Pequena piora.", color:"#DC2626"});
    return pct({level:"Piora importante", desc:"Piora significativa. Reavaliação.", color:"#BE185D"});
  }),

  "Northwick Park Neck Pain Questionnaire": sim("npq","NPQ",["Northwick Park Neck Pain Questionnaire"], [0,100], "highIsBad", s=>{
    if(s<=20) return pct({level:"Incapacidade mínima", desc:"Pouca limitação cervical.", color:"#16A34A"});
    if(s<=40) return pct({level:"Incapacidade moderada", desc:"Limitação parcial.", color:"#D97706"});
    if(s<=60) return pct({level:"Incapacidade severa", desc:"Comprometimento funcional.", color:"#DC2626"});
    return pct({level:"Incapacidade grave", desc:"Função cervical severamente comprometida.", color:"#BE185D"});
  }),

  "AOS (Ankle Osteoarthritis Scale)": sim("aos","AOS",["AOS","Ankle Osteoarthritis Scale"], [0,100], "highIsBad", s=>{
    if(s<=25) return pct({level:"Sintomas leves", desc:"Pouca limitação do tornozelo.", color:"#16A34A"});
    if(s<=50) return pct({level:"Sintomas moderados", desc:"Limitação parcial.", color:"#D97706"});
    if(s<=75) return pct({level:"Sintomas severos", desc:"Comprometimento funcional.", color:"#DC2626"});
    return pct({level:"Sintomas graves", desc:"Tornozelo severamente comprometido.", color:"#BE185D"});
  }),

  "CAIT (Cumberland Ankle Instability Tool)": sim("cait","CAIT",["CAIT"], [0,30], "highIsGood", s=>{
    if(s>=24) return pct({level:"Tornozelo estável", desc:"Boa estabilidade do tornozelo.", color:"#16A34A"});
    if(s>=18) return pct({level:"Instabilidade leve", desc:"Limitação parcial.", color:"#D97706"});
    if(s>=10) return pct({level:"Instabilidade moderada", desc:"Instabilidade funcional.", color:"#DC2626"});
    return pct({level:"Instabilidade grave", desc:"Tornozelo severamente instável.", color:"#BE185D"});
  }),
};

export default SCALES;
