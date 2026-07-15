function pct(p){return{pct:p}}

function simpleScale(name, short, aliases, range, dir, fn, mcid, mdc){
  if (mcid === undefined) {
    const span = range[1] - range[0];
    if (span <= 10) { mcid = 2; mdc = 1.3; }
    else if (span <= 20) { mcid = 3; mdc = 2; }
    else if (span <= 30) { mcid = 4; mdc = 3; }
    else if (range[1] <= 3) { mcid = 0.5; mdc = 0.3; }
    else if (range[1] <= 10) { mcid = 1.5; mdc = 1; }
    else { mcid = 10; mdc = 6; }
  } else { if (mdc === undefined) mdc = Math.round(mcid * 0.6); }
  return {id:short.toLowerCase(), shortName:short, aliases, simple:true, range, goodDirection:dir, interpret:fn, mcid, mdc};
}

const OPTS_5 = ["Nenhuma","Leve","Moderada","Forte","Muito forte"];
const OPTS_5_DIF = ["Sem dificuldade","Leve dificuldade","Moderada dificuldade","Muita dificuldade","Incapaz"];
const OPTS_5_CONC = ["Discordo totalmente","Discordo parcialmente","Neutro","Concordo parcialmente","Concordo totalmente"];

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
      {id:"sexlife",label:"Vida sexual (se aplicável)",o:["Normal, sem dor extra","Normal, com dor extra","Quase normal, mas muito dolorosa","Muito limitada pela dor","Quase ausente pela dor","Ausente pela dor"]},
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
      {id:"swelling",label:"Inchaço / Edema",max:10,o:[{t:"Nenhum",s:10},{t:"Após atividade intensa",s:6},{t:"Após atividade leve",s:2},{t:"Constante",s:0}]},
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
        .map(([txt,id])=>({id,label:`Dor: ${txt}`,o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]})),
      ...[["Rigidez matinal (ao acordar)","stiff_morning"],["Rigidez após sentar/deitar ao longo do dia","stiff_day"]]
        .map(([txt,id])=>({id,label:`Rigidez: ${txt}`,o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]})),
      ...[["Descer escadas","desc_stairs"],["Subir escadas","asc_stairs"],["Levantar da posição sentada","sit_to_stand"],["Ficar em pé","stand"],["Curvar-se / pegar algo no chão","bend"],["Caminhar em superfície plana","walk_flat2"],["Entrar e sair de um carro","car"],["Ir às compras","shopping"],["Vestir meias","socks"],["Levantar da cama","bed"],["Tirar meias","socks_off"],["Deitar na cama / virar-se","lie_bed"],["Entrar e sair do banho","bath"],["Sentar","sit"],["Sentar e levantar do vaso sanitário","toilet"],["Tarefas domésticas pesadas","heavy_chores"],["Tarefas domésticas leves","light_chores"]]
        .map(([txt,id])=>({id,label:`AVD: ${txt}`,o:["Nenhuma dificuldade","Leve","Moderada","Forte","Muito forte"]})),
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
    id:"dash", shortName:"QuickDASH", aliases:["DASH","DASH (Disabilities of the Arm, Shoulder and Hand)"], sections:12, maxPerSection:4, mcid:15, mdc:11,
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

  "Roland Morris Disability Questionnaire (RMDQ)": {
    id:"rmdq", shortName:"RMDQ", aliases:["RMDQ","Roland Morris"], sections:24, maxPerSection:1, mcid:5, mdc:3,
    goodDirection:"highIsBad",
    interpret(pct){
      if(pct<=20) return {level:"Incapacidade mínima", desc:"Pouca limitação funcional.", color:"#16A34A"};
      if(pct<=40) return {level:"Incapacidade moderada", desc:"Limitação parcial nas AVDs.", color:"#D97706"};
      if(pct<=60) return {level:"Incapacidade severa", desc:"Limitação funcional importante.", color:"#DC2626"};
      if(pct<=80) return {level:"Incapacidade grave", desc:"Comprometimento significativo.", color:"#7C3AED"};
      return {level:"Incapacidade total", desc:"Função severamente comprometida.", color:"#BE185D"};
    },
    questions:[
      {id:"rmdq_casa",label:"Fico em casa a maior parte do tempo por causa da dor",o:["Não","Sim"]},
      {id:"rmdq_posicao",label:"Mudo de posição frequentemente para aliviar a dor",o:["Não","Sim"]},
      {id:"rmdq_andar",label:"Ando mais devagar que o normal por causa da dor",o:["Não","Sim"]},
      {id:"rmdq_tarefas",label:"Não consigo fazer tarefas domésticas por causa da dor",o:["Não","Sim"]},
      {id:"rmdq_escadas",label:"Uso o corrimão para subir escadas por causa da dor",o:["Não","Sim"]},
      {id:"rmdq_deitar",label:"Fico deitado para descansar com mais frequência",o:["Não","Sim"]},
      {id:"rmdq_apoio",label:"Preciso me apoiar em algo para levantar da cadeira",o:["Não","Sim"]},
      {id:"rmdq_outros",label:"Peço ajuda para outras pessoas por causa da dor",o:["Não","Sim"]},
      {id:"rmdq_vestir",label:"Visto-me mais devagar que o normal por causa da dor",o:["Não","Sim"]},
      {id:"rmdq_ficar",label:"Fico apenas curto tempo em pé por causa da dor",o:["Não","Sim"]},
      {id:"rmdq_curvar",label:"Evito me curvar ou ajoelhar por causa da dor",o:["Não","Sim"]},
      {id:"rmdq_sentar",label:"Tenho dificuldade para sentar por muito tempo",o:["Não","Sim"]},
      {id:"rmdq_sono",label:"A dor atrapalha meu sono",o:["Não","Sim"]},
      {id:"rmdq_apetite",label:"Meu apetite é afetado pela dor",o:["Não","Sim"]},
      {id:"rmdq_caminhar",label:"Só consigo caminhar curtas distâncias",o:["Não","Sim"]},
      {id:"rmdq_carregar",label:"Evito carregar objetos pesados",o:["Não","Sim"]},
      {id:"rmdq_humor",label:"Sinto-me irritado / frustrado por causa da dor",o:["Não","Sim"]},
      {id:"rmdq_carros",label:"Tenho dificuldade para andar de carro",o:["Não","Sim"]},
      {id:"rmdq_apoiar",label:"Preciso me apoiar em algo enquanto ando",o:["Não","Sim"]},
      {id:"rmdq_esporte",label:"Não consigo fazer atividades de lazer como antes",o:["Não","Sim"]},
      {id:"rmdq_trabalho",label:"Meu trabalho é afetado pela dor",o:["Não","Sim"]},
      {id:"rmdq_sexo",label:"Minha vida sexual é afetada pela dor",o:["Não","Sim"]},
      {id:"rmdq_social",label:"Saio menos para eventos sociais por causa da dor",o:["Não","Sim"]},
      {id:"rmdq_geral",label:"Sinto que minha vida é controlada pela dor",o:["Não","Sim"]},
    ],
  },

  "KOOS (Knee injury and Osteoarthritis Outcome Score)": {
    id:"koos", shortName:"KOOS", aliases:["KOOS"], sections:43, maxPerSection:4, mcid:12, mdc:8,
    goodDirection:"highIsGood",
    interpret(pct){
      if(pct>=80) return {level:"Bom / Excelente", desc:"Boa função do joelho.", color:"#16A34A"};
      if(pct>=60) return {level:"Moderado", desc:"Limitação parcial. Tratamento em andamento.", color:"#D97706"};
      if(pct>=40) return {level:"Ruim", desc:"Limitação funcional significativa.", color:"#DC2626"};
      return {level:"Muito ruim", desc:"Função severamente comprometida.", color:"#BE185D"};
    },
    questions:[
      ...[[["Frequência da dor","pain_freq"],["Torcer / girar apoiando no joelho","pain_twist"],["Esticar totalmente o joelho","pain_extend"],["Flexionar totalmente o joelho","pain_flex"],["Dor ao caminhar em superfície plana","pain_walk"],["Subir ou descer escadas","pain_stairs"],["À noite na cama","pain_night"],["Sentado ou deitado","pain_sit"],["Em pé","pain_stand"]]]
        .flat().map(([t,i])=>({id:`koos_${i}`,label:`Dor: ${t}`,o:OPTS_5})),
      ...[["Inchaço no joelho","swell"],["Estalos / rangidos","crepitus"],["Travamento / engasgo","locking"],["Rigidez ao acordar","stiff_morning"],["Rigidez após sentar/deitar","stiff_day"],["Consegue esticar totalmente","stretch_full"],["Consegue flexionar totalmente","stretch_flex"]]
        .map(([t,i])=>({id:`koos_${i}`,label:`Sintomas: ${t}`,o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]})),
      ...[["Descer escadas","desc_stairs"],["Subir escadas","asc_stairs"],["Levantar da posição sentada","sit_to_stand"],["Ficar em pé","stand"],["Curvar-se / pegar algo no chão","bend"],["Caminhar em superfície plana","walk_flat"],["Entrar e sair do carro","car"],["Ir às compras","shop"],["Vestir meias","socks"],["Levantar da cama","bed"],["Tirar meias","socks_off"],["Virar-se / rodar apoiado no joelho","turn"],["Ajoelhar","kneel"],["Agachar","squat"],["Sentar","sit"],["Sentar e levantar do vaso","toilet"],["Tarefas domésticas pesadas","heavy"],["Tarefas domésticas leves","light"]]
        .map(([t,i])=>({id:`koos_${i}`,label:`AVD: ${t}`,o:OPTS_5_DIF})),
      ...[["Agachar","sport_squat"],["Correr","sport_run"],["Pular","sport_jump"],["Torcer / girar no joelho","sport_twist"],["Ajoelhar","sport_kneel"]]
        .map(([t,i])=>({id:`koos_${i}`,label:`Esporte/Lazer: ${t}`,o:OPTS_5_DIF})),
      ...[["Com que frequência pensa no joelho?","qol_aware"],["Modificou estilo de vida?","qol_modify"],["Confiança no joelho?","qol_trust"],["Joelho é um problema difícil?","qol_tough"]]
        .map(([t,i])=>({id:`koos_${i}`,label:`Qualidade de Vida: ${t}`,o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]})),
    ],
  },

  "Numeric Pain Rating Scale (NPRS)": simpleScale("nprs","NPRS",["NPRS","VAS / NPRS","VAS"], [0,10], "highIsBad", s=>{
    if(s<=3) return pct({level:"Dor leve", desc:"Bom controle da dor.", color:"#16A34A"});
    if(s<=6) return pct({level:"Dor moderada", desc:"Dor que limita parcialmente.", color:"#D97706"});
    if(s<=8) return pct({level:"Dor intensa", desc:"Dor com impacto funcional importante.", color:"#DC2626"});
    return pct({level:"Dor insuportável", desc:"Dor máxima. Intervenção imediata.", color:"#BE185D"});
  }),

  "Global Rating of Change (GRC)": simpleScale("grc","GRC",["GRC","Global Rating of Change"], [-7,7], "highIsGood", s=>{
    if(s>=5) return pct({level:"Melhora importante", desc:"Melhora significativa percebida pelo paciente.", color:"#16A34A"});
    if(s>=1) return pct({level:"Melhora leve", desc:"Pequena melhora percebida.", color:"#D97706"});
    if(s===0) return pct({level:"Sem mudança", desc:"Estado clínico inalterado.", color:"#7C3AED"});
    if(s>=-3) return pct({level:"Piora leve", desc:"Pequena piora percebida.", color:"#DC2626"});
    return pct({level:"Piora importante", desc:"Piora significativa. Reavaliação necessária.", color:"#BE185D"});
  }),

  "Start MSK – triagem biopsicossocial": {
    id:"startmsk", shortName:"StartMSK", aliases:["Start MSK"], sections:9, maxPerSection:1, mcid:2, mdc:1.3,
    goodDirection:"highIsBad",
    interpret(pct){
      if(pct<=33) return {level:"Baixo risco", desc:"Baixo risco de mau prognóstico.", color:"#16A34A"};
      if(pct<=67) return {level:"Médio risco", desc:"Risco moderado. Atenção a fatores psicossociais.", color:"#D97706"};
      return {level:"Alto risco", desc:"Alto risco. Abordagem biopsicossocial necessária.", color:"#DC2626"};
    },
    questions:[
      {id:"msk_ombro",label:"Sente dor no ombro / pescoço?",o:["Não","Sim"]},
      {id:"msk_punho",label:"Sente dor no punho / mão?",o:["Não","Sim"]},
      {id:"msk_quadril",label:"Sente dor no quadril / perna?",o:["Não","Sim"]},
      {id:"msk_joelho",label:"Sente dor no joelho?",o:["Não","Sim"]},
      {id:"msk_tornozelo",label:"Sente dor no tornozelo / pé?",o:["Não","Sim"]},
      {id:"msk_preocupacao",label:"Estou preocupado que minha dor seja grave",o:["Discordo","Concordo"]},
      {id:"msk_medo",label:"Sinto medo / evito atividades por causa da dor",o:["Discordo","Concordo"]},
      {id:"msk_humor",label:"Sinto que estou desanimado / deprimido",o:["Discordo","Concordo"]},
      {id:"msk_confianca",label:"Confio que posso melhorar com tratamento",o:["Concordo","Discordo"]},
    ],
  },

  "FABQ (Fear Avoidance Beliefs Questionnaire)": {
    id:"fabq", shortName:"FABQ", aliases:["FABQ","Fear Avoidance Beliefs Questionnaire"], sections:16, maxPerSection:4, mcid:12, mdc:8,
    goodDirection:"highIsBad",
    interpret(pct){
      if(pct<=38) return {level:"Baixas crenças de evitação", desc:"Pouco impacto psicossocial.", color:"#16A34A"};
      if(pct<=62) return {level:"Crenças moderadas", desc:"Atenção a fatores de evitação.", color:"#D97706"};
      return {level:"Altas crenças de evitação", desc:"Crenças disfuncionais. Abordagem cognitivo-comportamental.", color:"#DC2626"};
    },
    questions:[
      {id:"fabq_causa",label:"Minha dor foi causada por atividade física",o:["Discordo totalmente","Discordo","Neutro","Concordo","Concordo totalmente"]},
      {id:"fabq_atividade",label:"Atividade física piora minha dor",o:["Discordo totalmente","Discordo","Neutro","Concordo","Concordo totalmente"]},
      {id:"fabq_medo",label:"Tenho medo de me machucar com atividade física",o:["Discordo totalmente","Discordo","Neutro","Concordo","Concordo totalmente"]},
      {id:"fabq_evitar",label:"Devo evitar atividades que causam dor",o:["Discordo totalmente","Discordo","Neutro","Concordo","Concordo totalmente"]},
      {id:"fabq_naoposso",label:"Não posso fazer atividades que pioram a dor",o:["Discordo totalmente","Discordo","Neutro","Concordo","Concordo totalmente"]},
      {id:"fabq_lesao",label:"Atividade física pode lesionar meu corpo",o:["Discordo totalmente","Discordo","Neutro","Concordo","Concordo totalmente"]},
      {id:"fabq_seguro",label:"Só me sinto seguro sem fazer esforço físico",o:["Discordo totalmente","Discordo","Neutro","Concordo","Concordo totalmente"]},
      {id:"fabq_esforco",label:"Esforço físico pode prejudicar meu tratamento",o:["Discordo totalmente","Discordo","Neutro","Concordo","Concordo totalmente"]},
      {id:"fabq_trabalho_leve",label:"Meu trabalho é muito pesado para mim",o:["Discordo totalmente","Discordo","Neutro","Concordo","Concordo totalmente"]},
      {id:"fabq_trabalho_piora",label:"Meu trabalho piora minha dor",o:["Discordo totalmente","Discordo","Neutro","Concordo","Concordo totalmente"]},
      {id:"fabq_trab_voltar",label:"Não voltarei ao trabalho enquanto estiver com dor",o:["Discordo totalmente","Discordo","Neutro","Concordo","Concordo totalmente"]},
      {id:"fabq_trab_agora",label:"Não estou apto a trabalhar agora",o:["Discordo totalmente","Discordo","Neutro","Concordo","Concordo totalmente"]},
      {id:"fabq_trab_lesao",label:"Meu trabalho pode me lesionar novamente",o:["Discordo totalmente","Discordo","Neutro","Concordo","Concordo totalmente"]},
      {id:"fabq_trab_dor",label:"Trabalhar com dor é prejudicial",o:["Discordo totalmente","Discordo","Neutro","Concordo","Concordo totalmente"]},
      {id:"fabq_trab_ano",label:"Voltarei ao trabalho em até 3 meses",o:["Discordo totalmente","Discordo","Neutro","Concordo","Concordo totalmente"]},
      {id:"fabq_trab_demais",label:"Meu trabalho exige demais do meu corpo",o:["Discordo totalmente","Discordo","Neutro","Concordo","Concordo totalmente"]},
    ],
  },

  "Tampa Scale for Kinesiophobia (TSK-17)": {
    id:"tsk", shortName:"TSK-17", aliases:["TSK-17","Tampa Scale for Kinesiophobia"], sections:17, maxPerSection:4, mcid:6, mdc:4,
    goodDirection:"highIsBad",
    interpret(pct){
      if(pct<=27) return {level:"Baixa cinesiofobia", desc:"Pouco medo de movimento.", color:"#16A34A"};
      if(pct<=50) return {level:"Moderada", desc:"Cinesiofobia moderada. Educação em dor.", color:"#D97706"};
      return {level:"Alta cinesiofobia", desc:"Medo intenso. PNE e TCC indicados.", color:"#DC2626"};
    },
    questions:[
      {id:"tsk_medo",label:"Tenho medo de me machucar se fizer exercício",o:OPTS_5_CONC},
      {id:"tsk_parar",label:"Se eu sentir dor, devo parar o exercício",o:OPTS_5_CONC},
      {id:"tsk_perigo",label:"Meu corpo está me dizendo que algo perigoso está errado",o:OPTS_5_CONC},
      {id:"tsk_piorar",label:"Minha dor vai piorar se eu fizer exercício",o:OPTS_5_CONC},
      {id:"tsk_lesao",label:"Não é seguro que uma pessoa com minha condição faça exercício",o:OPTS_5_CONC},
      {id:"tsk_confianca",label:"Não confio no meu corpo",o:OPTS_5_CONC},
      {id:"tsk_fragil",label:"Meu corpo é frágil / vulnerável",o:OPTS_5_CONC},
      {id:"tsk_evitar",label:"Devo evitar atividades que causam dor",o:OPTS_5_CONC},
      {id:"tsk_pior",label:"Tenho medo de que a dor piore se eu me movimentar",o:OPTS_5_CONC},
      {id:"tsk_normal",label:"Acho que não sou capaz de fazer atividades normais",o:OPTS_5_CONC},
      {id:"tsk_seguro",label:"Só me sinto seguro quando não estou me movimentando",o:OPTS_5_CONC},
      {id:"tsk_alivio",label:"A dor que sinto é um sinal de que preciso parar",o:OPTS_5_CONC},
      {id:"tsk_esforco",label:"Qualquer esforço pode piorar minha condição",o:OPTS_5_CONC},
      {id:"tsk_incapaz",label:"Não sou capaz de fazer o que as pessoas normais fazem",o:OPTS_5_CONC},
      {id:"tsk_cuidado",label:"Preciso ter cuidado redobrado com meus movimentos",o:OPTS_5_CONC},
      {id:"tsk_recuperar",label:"Nunca mais vou me recuperar totalmente",o:OPTS_5_CONC},
      {id:"tsk_pessoas",label:"Outras pessoas não levam minha dor a sério",o:OPTS_5_CONC},
    ],
  },

  "IKDC Subjective Knee Form": {
    id:"ikdc", shortName:"IKDC", aliases:["IKDC","IKDC Subjective Knee Form"], sections:15, maxPerSection:null, mcid:12, mdc:9,
    goodDirection:"highIsGood",
    interpret(pct){
      if(pct>=80) return {level:"Bom / Excelente", desc:"Boa função do joelho.", color:"#16A34A"};
      if(pct>=60) return {level:"Moderado", desc:"Limitação parcial.", color:"#D97706"};
      if(pct>=40) return {level:"Ruim", desc:"Limitação funcional importante.", color:"#DC2626"};
      return {level:"Muito ruim", desc:"Função severamente comprometida.", color:"#BE185D"};
    },
    questions:[
      {id:"ikdc_dor",label:"Qual a intensidade da sua dor no joelho?",o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]},
      {id:"ikdc_dor_freq",label:"Com que frequência você sente dor no joelho?",o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]},
      {id:"ikdc_inch",label:"Seu joelho incha?",o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]},
      {id:"ikdc_lock",label:"Seu joelho engasga/trava?",o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]},
      {id:"ikdc_give",label:"Seu joelho falseia / cede?",o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]},
      {id:"ikdc_stairs",label:"Subir escadas",o:OPTS_5_DIF},
      {id:"ikdc_squat",label:"Agachar",o:OPTS_5_DIF},
      {id:"ikdc_sit",label:"Sentar com o joelho dobrado",o:OPTS_5_DIF},
      {id:"ikdc_rise",label:"Levantar da cadeira",o:OPTS_5_DIF},
      {id:"ikdc_run",label:"Correr em linha reta",o:OPTS_5_DIF},
      {id:"ikdc_jump",label:"Pular / Aterrissar",o:OPTS_5_DIF},
      {id:"ikdc_stop",label:"Parar / Mudar de direção rapidamente",o:OPTS_5_DIF},
      {id:"ikdc_preinjury",label:"Nível de atividade anterior à lesão",o:["Muito intenso (saltos, cortes)","Intenso (corrida, academia)","Moderado (caminhada, bike)","Leve (AVDs)","Sedentário"]},
      {id:"ikdc_current",label:"Nível de atividade ATUAL",o:["Muito intenso (saltos, cortes)","Intenso (corrida, academia)","Moderado (caminhada, bike)","Leve (AVDs)","Sedentário"]},
      {id:"ikdc_func",label:"Função geral do joelho (0 = pior, 10 = melhor)",o:["0 – Incapacitante","1","2","3","4","5","6","7","8","9","10 – Normal"]},
    ],
    calculate(answers){
      let sum = 0; let count = 0;
      const qMap = {ikdc_dor:4, ikdc_dor_freq:4, ikdc_inch:4, ikdc_lock:4, ikdc_give:4, ikdc_stairs:4, ikdc_squat:4, ikdc_sit:4, ikdc_rise:4, ikdc_run:4, ikdc_jump:4, ikdc_stop:4, ikdc_preinjury:4, ikdc_current:4, ikdc_func:10};
      Object.values(answers).forEach((v)=>{ if (v !== undefined) { sum += v; count++; } });
      const maxPos = Object.values(qMap).reduce((a,b)=>a+b, 0);
      const pct = count > 0 ? Math.round((sum / maxPos) * 100) : 0;
      return {raw:sum, pct};
    },
  },

  "ACL-RSI (Return to Sport after Injury)": {
    id:"acl-rsi", shortName:"ACL-RSI", aliases:["ACL-RSI"], sections:12, maxPerSection:10, mcid:15, mdc:11,
    goodDirection:"highIsGood",
    interpret(pct){
      if(pct>=80) return {level:"Pronto para retorno", desc:"Alta confiança para retorno esportivo.", color:"#16A34A"};
      if(pct>=60) return {level:"Moderada confiança", desc:"Trabalhar aspectos psicológicos do retorno.", color:"#D97706"};
      if(pct>=40) return {level:"Baixa confiança", desc:"Medo de re-lesão significativo.", color:"#DC2626"};
      return {level:"Muito baixa confiança", desc:"Alta cinesiofobia. Preparo psicológico necessário.", color:"#BE185D"};
    },
    questions:[
      ...[["Confiança de que o joelho não falhará","confidence"],["Medo de re-lesão","fear"],["Frustração com o joelho","frustration"],["Desconforto / pressão no joelho","discomfort"],["Dificuldade de confiar no joelho","trust"]]
        .map(([t,i])=>({id:`acl_${i}`,label:t,o:["Muito confiante / Sem medo (10)","(9)","(8)","(7)","(6)","(5)","(4)","(3)","(2)","Nada confiante / Muito medo (0)"]})),
      ...[["Sente que pode voltar a jogar igual?","return"],["Consegue se concentrar no jogo?","focus"],["Sente menos seguro no joelho?","unsafe"]]
        .map(([t,i])=>({id:`acl_${i}`,label:t,o:["Sim, totalmente (10)","(9)","(8)","(7)","(6)","(5)","(4)","(3)","(2)","Não, nada (0)"]})),
      ...[["Medo de sofrer nova lesão no joelho","reinjure"],["Medo de não voltar ao mesmo nível","level"],["Preocupação com dor ao jogar","pain_play"],["Confiança em fazer esforço máximo no joelho","max_effort"]]
        .map(([t,i])=>({id:`acl_${i}`,label:t,o:["Extremamente confiante (10)","(9)","(8)","(7)","(6)","(5)","(4)","(3)","(2)","Nada confiante (0)"]})),
    ],
    calculate(answers){
      const sum = Object.keys(answers).reduce((t,k)=>t+(answers[k]??0),0);
      const max = Object.keys(answers).length * 10;
      return {raw:sum, pct:max>0?Math.round(sum/max*100):0};
    },
  },

  "WORC (Western Ontario Rotator Cuff Index)": {
    id:"worc", shortName:"WORC", aliases:["WORC"], sections:21, maxPerSection:4, mcid:15, mdc:10,
    goodDirection:"highIsGood",
    interpret(pct){
      if(pct>=80) return {level:"Excelente", desc:"Boa função do ombro.", color:"#16A34A"};
      if(pct>=60) return {level:"Moderado", desc:"Limitação parcial do ombro.", color:"#D97706"};
      if(pct>=40) return {level:"Ruim", desc:"Comprometimento funcional importante.", color:"#DC2626"};
      return {level:"Muito ruim", desc:"Função severamente comprometida.", color:"#BE185D"};
    },
    questions:[
      ...[["Dor no ombro ao movimentar","pain_move"],["Dor ao levantar o braço","pain_lift"],["Dor à noite","pain_night"],["Dor ao deitar sobre o ombro","pain_lie"],["Dor ao fazer força","pain_strain"],["Rigidez / perda de amplitude","stiffness"]]
        .map(([t,i])=>({id:`worc_${i}`,label:`Sintomas físicos: ${t}`,o:["Nenhum","Leve","Moderado","Grave","Muito grave"]})),
      ...[["Atividades esportivas","sport"],["Levantar peso acima da cabeça","overhead"],["Empurrar","push"],["Puxar","pull"],["Carregar objetos","carry"],["Atividades domésticas","chores"],["Trabalho braçal","work"],["Dirigir","drive"]]
        .map(([t,i])=>({id:`worc_${i}`,label:`Esporte/Trabalho: ${t}`,o:["Sem dificuldade","Leve dificuldade","Moderada dificuldade","Muita dificuldade","Incapaz"]})),
      ...[["Frustração com a condição","frustration"],["Preocupação com o ombro","worry"],["Impacto no humor","mood"],["Dificuldade em aceitar","accept"]]
        .map(([t,i])=>({id:`worc_${i}`,label:`Emoções: ${t}`,o:["Nada","Um pouco","Moderadamente","Muito","Extremamente"]})),
      ...[["Limitação na vida social","social"],["Dependência de outras pessoas","dependence"],["Impacto no estilo de vida","lifestyle"]]
        .map(([t,i])=>({id:`worc_${i}`,label:`Estilo de vida: ${t}`,o:["Nenhum","Leve","Moderado","Grande","Extremo"]})),
    ],
  },

  "ASES (American Shoulder and Elbow Surgeons)": {
    id:"ases", shortName:"ASES", aliases:["ASES"], sections:13, maxPerSection:10, mcid:12, mdc:8,
    goodDirection:"highIsGood",
    interpret(pct){
      if(pct>=80) return {level:"Excelente", desc:"Boa função do ombro.", color:"#16A34A"};
      if(pct>=60) return {level:"Moderado", desc:"Limitação parcial.", color:"#D97706"};
      if(pct>=40) return {level:"Ruim", desc:"Comprometimento importante.", color:"#DC2626"};
      return {level:"Muito ruim", desc:"Função severamente comprometida.", color:"#BE185D"};
    },
    questions:[
      {id:"ases_dor",label:"Nível de dor no ombro (0=sem dor, 10=pior)",o:["0 - Sem dor","1","2","3","4","5","6","7","8","9","10 - Pior possível"]},
      ...[["Vestir um casaco","func_coat"],["Dormir sobre o lado afetado","func_sleep"],["Lavar as costas","func_back"],["Usar o banheiro","func_toilet"],["Pentear o cabelo","func_comb"],["Alcançar prateleira alta","func_reach"],["Levantar 5kg acima do ombro","func_lift"],["Carregar objetos pesados","func_carry"],["Atividades de arremesso","func_throw"],["Trabalho com braço elevado","func_overhead"],["Trabalho braçal pesado","func_heavy"],["Atividades esportivas","func_sport"]]
        .map(([t,i])=>({id:`ases_${i}`,label:t,o:OPTS_5_DIF})),
    ],
    calculate(answers){
      const maxPerQ = [10,4,4,4,4,4,4,4,4,4,4,4,4];
      let sum = 0; let max = 0;
      this.questions.forEach((q,i) => {
        const v = answers[q.id]; if (v !== undefined) { sum += v; }
        max += maxPerQ[i];
      });
      return {raw:sum, pct:max>0?Math.round(sum/max*100):0};
    },
  },

  "Oxford Shoulder Score": {
    id:"oxford-ss", shortName:"Oxford SS", aliases:["Oxford Shoulder Score"], sections:12, maxPerSection:4, mcid:8, mdc:5,
    goodDirection:"highIsBad",
    interpret(pct){
      if(pct<=20) return {level:"Função preservada", desc:"Boa função do ombro.", color:"#16A34A"};
      if(pct<=40) return {level:"Limitação moderada", desc:"Limitação parcial.", color:"#D97706"};
      if(pct<=60) return {level:"Limitação severa", desc:"Comprometimento importante.", color:"#DC2626"};
      return {level:"Limitação muito severa", desc:"Ombro severamente comprometido.", color:"#BE185D"};
    },
    questions:[
      {id:"oss_dor",label:"Como descreve a dor no ombro nas últimas 4 semanas?",o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]},
      {id:"oss_sono",label:"A dor atrapalha o sono?",o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]},
      {id:"oss_vestir",label:"Consegue se vestir sozinho?",o:["Sim, sem dificuldade","Sim, com leve dificuldade","Sim, com moderada dificuldade","Sim, com muita dificuldade","Não consigo"]},
      {id:"oss_alcancar",label:"Consegue alcançar prateleira alta?",o:["Sim, sem dificuldade","Sim, com leve dificuldade","Sim, com moderada dificuldade","Sim, com muita dificuldade","Não consigo"]},
      {id:"oss_carregar",label:"Consegue carregar sacola de compras?",o:["Sim, sem dificuldade","Sim, com leve dificuldade","Sim, com moderada dificuldade","Sim, com muita dificuldade","Não consigo"]},
      {id:"oss_lavar",label:"Consegue lavar as costas?",o:["Sim, sem dificuldade","Sim, com leve dificuldade","Sim, com moderada dificuldade","Sim, com muita dificuldade","Não consigo"]},
      {id:"oss_pentear",label:"Consegue pentear o cabelo?",o:["Sim, sem dificuldade","Sim, com leve dificuldade","Sim, com moderada dificuldade","Sim, com muita dificuldade","Não consigo"]},
      {id:"oss_trabalho",label:"Limitação no trabalho / AVDs?",o:["Nenhuma","Leve","Moderada","Grande","Total"]},
      {id:"oss_lancar",label:"Consegue arremessar um objeto?",o:["Sim, sem dificuldade","Sim, com leve dificuldade","Sim, com moderada dificuldade","Sim, com muita dificuldade","Não consigo"]},
      {id:"oss_forca",label:"Perda de força no braço?",o:["Nenhuma","Leve","Moderada","Grande","Total"]},
      {id:"oss_social",label:"A dor limita sua vida social?",o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]},
      {id:"oss_medicacao",label:"Precisa de analgésicos para dor?",o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]},
    ],
  },

  "PRTEE (Patient-Rated Tennis Elbow Evaluation)": {
    id:"prtee", shortName:"PRTEE", aliases:["PRTEE"], sections:15, maxPerSection:5, mcid:11, mdc:7,
    goodDirection:"highIsBad",
    interpret(pct){
      if(pct<=20) return {level:"Função preservada", desc:"Pouca limitação do cotovelo.", color:"#16A34A"};
      if(pct<=40) return {level:"Limitação leve", desc:"Limitação parcial.", color:"#D97706"};
      if(pct<=60) return {level:"Limitação moderada", desc:"Comprometimento funcional.", color:"#DC2626"};
      return {level:"Limitação grave", desc:"Cotovelo severamente comprometido.", color:"#BE185D"};
    },
    questions:[
      ...[["Dor em repouso","pain_rest"],["Dor ao mover o cotovelo","pain_move"],["Dor ao levantar objetos","pain_lift"],["Dor ao torcer","pain_twist"],["Dor ao apertar","pain_grip"]]
        .map(([t,i])=>({id:`prtee_${i}`,label:`Dor: ${t}`,o:["Nenhuma","Leve","Moderada","Forte","Muito forte","Insuportável"]})),
      ...[["Virar maçaneta / chave","func_key"],["Carregar sacola","func_bag"],["Levantar xícara","func_cup"],["Abrir pote","func_jar"],["Apertar mão","func_handshake"],["Torcer pano","func_wring"]]
        .map(([t,i])=>({id:`prtee_${i}`,label:`Função: ${t}`,o:["Sem dificuldade","Leve dificuldade","Moderada dificuldade","Muita dificuldade","Extrema dificuldade","Incapaz"]})),
      ...[["Atividades domésticas","chores"],["Trabalho","work"],["Lazer","leisure"],["Esportes","sport"]]
        .map(([t,i])=>({id:`prtee_${i}`,label:`Atividades: ${t}`,o:["Sem dificuldade","Leve dificuldade","Moderada dificuldade","Muita dificuldade","Extrema dificuldade","Incapaz"]})),
    ],
  },

  "Foot Function Index (FFI)": {
    id:"ffi", shortName:"FFI", aliases:["FFI","Foot Function Index"], sections:17, maxPerSection:4, mcid:12, mdc:8,
    goodDirection:"highIsBad",
    interpret(pct){
      if(pct<=25) return {level:"Função preservada", desc:"Boa função do pé.", color:"#16A34A"};
      if(pct<=50) return {level:"Limitação moderada", desc:"Limitação parcial.", color:"#D97706"};
      if(pct<=75) return {level:"Limitação severa", desc:"Comprometimento funcional.", color:"#DC2626"};
      return {level:"Limitação muito severa", desc:"Pé severamente comprometido.", color:"#BE185D"};
    },
    questions:[
      ...[["Pior dor no pé","pain_worst"],["Dor ao acordar","pain_morning"],["Dor ao caminhar","pain_walk"],["Dor ao ficar em pé","pain_stand"],["Dor ao usar sapatos","pain_shoes"]]
        .map(([t,i])=>({id:`ffi_${i}`,label:`Dor: ${t}`,o:OPTS_5})),
      ...[["Ficar em pé","func_stand"],["Caminhar em casa","func_walk_home"],["Caminhar na rua","func_walk_out"],["Subir escadas","func_stairs"],["Descer escadas","func_desc"],["Correr","func_run"],["Praticar esportes","func_sport"],["Usar sapatos fechados","func_shoes"],["Usar chinelos","func_slippers"]]
        .map(([t,i])=>({id:`ffi_${i}`,label:`Limitação: ${t}`,o:OPTS_5_DIF})),
      ...[["Uso de palmilha/órtese","orthosis"],["Uso de analgésicos","medication"],["Necessidade de repouso","rest"]]
        .map(([t,i])=>({id:`ffi_${i}`,label:`Outros: ${t}`,o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]})),
    ],
  },

  "VISA-A (Victorian Institute of Sport Assessment – Achilles)": {
    id:"visa-a", shortName:"VISA-A", aliases:["VISA-A"], sections:8, maxPerSection:4, mcid:15, mdc:10,
    goodDirection:"highIsGood",
    interpret(pct){
      if(pct>=80) return {level:"Bom / Excelente", desc:"Boa função do tendão de Aquiles.", color:"#16A34A"};
      if(pct>=60) return {level:"Moderado", desc:"Limitação parcial.", color:"#D97706"};
      if(pct>=40) return {level:"Ruim", desc:"Comprometimento importante.", color:"#DC2626"};
      return {level:"Muito ruim", desc:"Função severamente comprometida.", color:"#BE185D"};
    },
    questions:[
      {id:"visaa_dor_manha",label:"Rigidez no tendão ao acordar",o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]},
      {id:"visaa_dor_aquecer",label:"Dor ao aquecer para atividade",o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]},
      {id:"visaa_andar",label:"Dor ao caminhar",o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]},
      {id:"visaa_subir",label:"Dor ao subir escadas/ladeira",o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]},
      {id:"visaa_ponta",label:"Consegue ficar na ponta dos pés?",o:["Sim, totalmente","Sim, com leve dor","Sim, com moderada dor","Com muita dor","Não consigo"]},
      {id:"visaa_correr",label:"Consegue correr sem dor?",o:["Sim, totalmente","Sim, com leve dor","Sim, com moderada dor","Com muita dor","Não consigo"]},
      {id:"visaa_pular",label:"Consegue pular/saltar?",o:["Sim, totalmente","Sim, com leve dor","Sim, com moderada dor","Com muita dor","Não consigo"]},
      {id:"visaa_treino",label:"Consegue treinar normalmente?",o:["Sim, totalmente","Sim, com adaptação","Com limitação moderada","Com grande limitação","Não consigo"]},
    ],
  },

  "VISA-P (Victorian Institute of Sport Assessment – Patellar)": {
    id:"visa-p", shortName:"VISA-P", aliases:["VISA-P"], sections:8, maxPerSection:4, mcid:15, mdc:10,
    goodDirection:"highIsGood",
    interpret(pct){
      if(pct>=80) return {level:"Bom / Excelente", desc:"Boa função patelar.", color:"#16A34A"};
      if(pct>=60) return {level:"Moderado", desc:"Limitação parcial.", color:"#D97706"};
      if(pct>=40) return {level:"Ruim", desc:"Comprometimento importante.", color:"#DC2626"};
      return {level:"Muito ruim", desc:"Função severamente comprometida.", color:"#BE185D"};
    },
    questions:[
      {id:"visap_dor_rep",label:"Dor no joelho em repouso",o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]},
      {id:"visap_agachar",label:"Dor ao agachar",o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]},
      {id:"visap_andar",label:"Dor ao caminhar",o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]},
      {id:"visap_subir",label:"Dor ao subir escadas",o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]},
      {id:"visap_sentar",label:"Dor ao sentar com joelho dobrado",o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]},
      {id:"visap_correr",label:"Consegue correr sem dor?",o:["Sim, totalmente","Sim, com leve dor","Sim, com moderada dor","Com muita dor","Não consigo"]},
      {id:"visap_pular",label:"Consegue pular/saltar?",o:["Sim, totalmente","Sim, com leve dor","Sim, com moderada dor","Com muita dor","Não consigo"]},
      {id:"visap_treino",label:"Consegue treinar normalmente?",o:["Sim, totalmente","Sim, com adaptação","Com limitação moderada","Com grande limitação","Não consigo"]},
    ],
  },

  "AKPS (Anterior Knee Pain Scale)": {
    id:"akps", shortName:"AKPS", aliases:["AKPS"], sections:13, maxPerSection:null, mcid:8, mdc:5,
    goodDirection:"highIsGood",
    interpret(pct){
      if(pct>=80) return {level:"Bom / Excelente", desc:"Boa função patelofemoral.", color:"#16A34A"};
      if(pct>=60) return {level:"Moderado", desc:"Limitação parcial.", color:"#D97706"};
      if(pct>=40) return {level:"Ruim", desc:"Comprometimento importante.", color:"#DC2626"};
      return {level:"Muito ruim", desc:"Função severamente comprometida.", color:"#BE185D"};
    },
    questions:[
      {id:"akps_manqueira",label:"Manqueira",o:["Não","Leve","Moderada","Grave"]},
      {id:"akps_apoio",label:"Necessita de apoio para andar?",o:["Não","Bengala/muleta","Impossível apoiar"]},
      {id:"akps_andar",label:"Caminhar",o:["Normal","Limitado","Muito limitado"]},
      {id:"akps_subir",label:"Subir escadas",o:["Normal","Dor ao subir","Dor ao descer","Dor subindo e descendo"]},
      {id:"akps_agachar",label:"Agachar",o:["Normal","Dor ao agachar","Impossível"]},
      {id:"akps_sentar",label:"Sentar com joelho dobrado",o:["Normal","Dor após sentar","Dor constante","Impossível"]},
      {id:"akps_correr",label:"Correr",o:["Normal","Dor > 2km","Dor < 2km","Impossível"]},
      {id:"akps_pular",label:"Pular",o:["Normal","Leve dor","Moderada dor","Impossível"]},
      {id:"akps_esticar",label:"Esticar totalmente o joelho",o:["Normal","Dor ao esticar","Impossível"]},
      {id:"akps_flexao",label:"Flexionar totalmente o joelho",o:["Normal","Dor ao flexionar","Impossível"]},
      {id:"akps_inchaço",label:"Inchaço",o:["Nunca","Após exercício","Após AVDs","Constante"]},
      {id:"akps_estalo",label:"Estalos / rangidos",o:["Nunca","Raramente","Às vezes","Frequentemente"]},
      {id:"akps_dor_sentar",label:"Dor ao levantar de sentado",o:["Nenhuma","Leve","Moderada","Forte"]},
    ],
    calculate(answers){
      const maxPerQ = [3,2,2,3,2,3,3,3,2,2,3,3,3];
      let sum = 0; let max = 0;
      this.questions.forEach((q,i) => {
        const v = answers[q.id]; if (v !== undefined) { sum += v; }
        max += maxPerQ[i];
      });
      return {raw:sum, pct:max>0?Math.round(sum/max*100):0};
    },
  },

  "VISA-G (Victorian Institute of Sport Assessment – Gluteal)": {
    id:"visa-g", shortName:"VISA-G", aliases:["VISA-G"], sections:8, maxPerSection:10, mcid:15, mdc:10,
    goodDirection:"highIsGood",
    interpret(pct){
      if(pct>=80) return {level:"Bom / Excelente", desc:"Boa função glútea.", color:"#16A34A"};
      if(pct>=60) return {level:"Moderado", desc:"Limitação parcial.", color:"#D97706"};
      if(pct>=40) return {level:"Ruim", desc:"Comprometimento importante.", color:"#DC2626"};
      return {level:"Muito ruim", desc:"Função severamente comprometida.", color:"#BE185D"};
    },
    questions:[
      {id:"visag_dor_rep",label:"Dor na região glútea em repouso",o:OPTS_5},
      {id:"visag_dor_sentar",label:"Dor ao sentar",o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]},
      {id:"visag_andar",label:"Dor ao caminhar por >30 min",o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]},
      {id:"visag_subir",label:"Dor ao subir escadas / ladeira",o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]},
      {id:"visag_correr",label:"Consegue correr sem dor?",o:["Sim, totalmente","Sim, com leve dor","Sim, com moderada dor","Com muita dor","Não consigo"]},
      {id:"visag_pular",label:"Consegue pular / saltar?",o:["Sim, totalmente","Sim, com leve dor","Sim, com moderada dor","Com muita dor","Não consigo"]},
      {id:"visag_treino",label:"Consegue treinar normalmente?",o:["Sim, totalmente","Sim, com adaptação","Com limitação moderada","Com grande limitação","Não consigo"]},
      {id:"visag_geral",label:"Avaliação geral da função glútea (0=pior, 10=melhor)",o:["0 - Péssima","1","2","3","4","5","6","7","8","9","10 - Excelente"]},
    ],
    calculate(answers){
      const maxPerQ = [4,4,4,4,4,4,4,10];
      let sum = 0; let max = 0;
      this.questions.forEach((q,i) => {
        const v = answers[q.id]; if (v !== undefined) { sum += v; }
        max += maxPerQ[i];
      });
      return {raw:sum, pct:max>0?Math.round(sum/max*100):0};
    },
  },

  "iHOT-12 (International Hip Outcome Tool)": {
    id:"ihot12", shortName:"iHOT-12", aliases:["iHOT-12"], sections:12, maxPerSection:4, mcid:12, mdc:8,
    goodDirection:"highIsGood",
    interpret(pct){
      if(pct>=80) return {level:"Bom / Excelente", desc:"Boa função do quadril.", color:"#16A34A"};
      if(pct>=60) return {level:"Moderado", desc:"Limitação parcial.", color:"#D97706"};
      if(pct>=40) return {level:"Ruim", desc:"Comprometimento importante.", color:"#DC2626"};
      return {level:"Muito ruim", desc:"Função severamente comprometida.", color:"#BE185D"};
    },
    questions:[
      {id:"ihot_dor",label:"Nível de dor no quadril",o:["Sem dor","Dor leve","Dor moderada","Dor forte","Dor muito forte"]},
      {id:"ihot_rigidez",label:"Rigidez / amplitude do quadril",o:["Normal","Leve rigidez","Moderada rigidez","Grande rigidez","Extrema rigidez"]},
      {id:"ihot_andar",label:"Consegue andar sem limitação?",o:["Sim, totalmente","Sim, quase sempre","Às vezes","Raramente","Não"]},
      {id:"ihot_subir",label:"Consegue subir escadas?",o:["Sim, totalmente","Sim, quase sempre","Às vezes","Raramente","Não"]},
      {id:"ihot_correr",label:"Consegue correr?",o:["Sim, totalmente","Sim, quase sempre","Às vezes","Raramente","Não"]},
      {id:"ihot_agachar",label:"Consegue agachar?",o:["Sim, totalmente","Sim, quase sempre","Às vezes","Raramente","Não"]},
      {id:"ihot_esporte",label:"Consegue praticar esportes?",o:["Sim, totalmente","Sim, quase sempre","Às vezes","Raramente","Não"]},
      {id:"ihot_trabalho",label:"Consegue trabalhar sem limitação?",o:["Sim, totalmente","Sim, quase sempre","Às vezes","Raramente","Não"]},
      {id:"ihot_sono",label:"O quadril atrapalha o sono?",o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]},
      {id:"ihot_social",label:"Impacto na vida social",o:["Nenhum","Leve","Moderado","Grande","Muito grande"]},
      {id:"ihot_humor",label:"Impacto no humor / confiança",o:["Nenhum","Leve","Moderado","Grande","Muito grande"]},
      {id:"ihot_geral",label:"Satisfação geral com o quadril",o:["Muito satisfeito","Satisfeito","Neutro","Insatisfeito","Muito insatisfeito"]},
    ],
  },

  "HOS (Hip Outcome Score)": {
    id:"hos", shortName:"HOS", aliases:["HOS"], sections:19, maxPerSection:4, mcid:9, mdc:6,
    goodDirection:"highIsGood",
    interpret(pct){
      if(pct>=80) return {level:"Bom / Excelente", desc:"Boa função do quadril.", color:"#16A34A"};
      if(pct>=60) return {level:"Moderado", desc:"Limitação parcial.", color:"#D97706"};
      if(pct>=40) return {level:"Ruim", desc:"Comprometimento importante.", color:"#DC2626"};
      return {level:"Muito ruim", desc:"Função severamente comprometida.", color:"#BE185D"};
    },
    questions:[
      ...[["Ficar em pé","stand"],["Andar em superfície plana","walk_flat"],["Subir escadas","stairs"],["Descer escadas","desc_stairs"],["Andar em terreno irregular","walk_irreg"],["Curvar-se","bend"],["Agachar","squat"],["Sentar","sit"],["Levantar da cama","bed"],["Entrar/sair do carro","car"],["Calçar meias/sapatos","socks"],["Virar-se apoiado no quadril","turn"],["Atividades domésticas leves","light_chores"],["Atividades domésticas pesadas","heavy_chores"]]
        .map(([t,i])=>({id:`hos_${i}`,label:t,o:OPTS_5_DIF})),
      ...[["Subir escadas correndo","sport_stairs"],["Descer escadas correndo","sport_desc"],["Correr","sport_run"],["Pular","sport_jump"],["Mudar de direção rapidamente","sport_cut"]]
        .map(([t,i])=>({id:`hos_${i}`,label:`Esporte: ${t}`,o:OPTS_5_DIF})),
    ],
  },

  "HOOS (Hip disability and Osteoarthritis Outcome Score)": {
    id:"hoos", shortName:"HOOS", aliases:["HOOS"], sections:36, maxPerSection:4, mcid:12, mdc:8,
    goodDirection:"highIsGood",
    interpret(pct){
      if(pct>=80) return {level:"Bom / Excelente", desc:"Boa função do quadril.", color:"#16A34A"};
      if(pct>=60) return {level:"Moderado", desc:"Limitação parcial.", color:"#D97706"};
      if(pct>=40) return {level:"Ruim", desc:"Comprometimento importante.", color:"#DC2626"};
      return {level:"Muito ruim", desc:"Função severamente comprometida.", color:"#BE185D"};
    },
    questions:[
      ...[["Frequência da dor no quadril","pain_freq"],["Dor ao torcer/girar o quadril","pain_twist"],["Dor ao andar em plano","pain_walk"],["Dor ao subir escadas","pain_stairs"],["Dor à noite na cama","pain_night"],["Dor ao sentar/deitar","pain_sit_lie"],["Dor ao ficar em pé","pain_stand"]]
        .map(([t,i])=>({id:`hoos_${i}`,label:`Dor: ${t}`,o:OPTS_5})),
      ...[["Sensação de rigidez matinal","stiff_morning"],["Estalos/rangidos no quadril","crepitus"],["Amplitude de movimento reduzida","rom"]]
        .map(([t,i])=>({id:`hoos_${i}`,label:`Sintomas: ${t}`,o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]})),
      ...[["Descer escadas","desc_stairs"],["Subir escadas","asc_stairs"],["Levantar de sentado","sit_to_stand"],["Ficar em pé","stand"],["Curvar-se/pegar algo","bend"],["Andar em plano","walk_flat"],["Entrar/sair do carro","car"],["Fazer compras","shop"],["Calçar meias/sapatos","socks"],["Levantar da cama","bed"],["Tirar meias/sapatos","socks_off"],["Virar-se","turn"],["Ajoelhar","kneel"],["Agachar","squat"],["Sentar","sit"],["Sentar/levantar do vaso","toilet"],["Tarefas domésticas pesadas","heavy"],["Tarefas domésticas leves","light"]]
        .map(([t,i])=>({id:`hoos_${i}`,label:`AVD: ${t}`,o:OPTS_5_DIF})),
      ...[["Agachar","sport_squat"],["Correr","sport_run"],["Pular","sport_jump"],["Torcer/girar no quadril","sport_twist"]]
        .map(([t,i])=>({id:`hoos_${i}`,label:`Esporte: ${t}`,o:OPTS_5_DIF})),
      ...[["Pensa no quadril com frequência?","qol_aware"],["Modificou estilo de vida?","qol_modify"],["Confiança no quadril?","qol_trust"],["Problema difícil de lidar?","qol_tough"]]
        .map(([t,i])=>({id:`hoos_${i}`,label:`QV: ${t}`,o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]})),
    ],
  },

  "Swiss Spinal Stenosis Questionnaire": {
    id:"sss", shortName:"S.S.S.", aliases:["Swiss Spinal Stenosis Questionnaire"], sections:12, maxPerSection:4, mcid:8, mdc:5,
    goodDirection:"highIsBad",
    interpret(pct){
      if(pct<=25) return {level:"Sintomas leves", desc:"Pouca limitação.", color:"#16A34A"};
      if(pct<=50) return {level:"Sintomas moderados", desc:"Limitação parcial.", color:"#D97706"};
      if(pct<=75) return {level:"Sintomas severos", desc:"Comprometimento importante.", color:"#DC2626"};
      return {level:"Sintomas graves", desc:"Limitação severa.", color:"#BE185D"};
    },
    questions:[
      ...[["Dor na lombar","pain_back"],["Dor nas nádegas","pain_buttock"],["Dor nas pernas","pain_leg"],["Formigamento nas pernas","tingle_leg"],["Fraqueza nas pernas","weakness_leg"],["Dormência nas pernas","numbness_leg"]]
        .map(([t,i])=>({id:`sss_${i}`,label:`Sintomas: ${t}`,o:OPTS_5})),
      ...[["Caminhar","func_walk"],["Ficar em pé","func_stand"],["Subir escadas","func_stairs"],["Descer escadas","func_desc"],["Sentar-se","func_sit"],["Curvar-se","func_bend"]]
        .map(([t,i])=>({id:`sss_${i}`,label:`Limitação para: ${t}`,o:OPTS_5_DIF})),
    ],
  },

  "Boston Carpal Tunnel Questionnaire (BCTQ)": {
    id:"bctq", shortName:"BCTQ", aliases:["BCTQ","Boston Carpal Tunnel Questionnaire"], sections:19, maxPerSection:4, mcid:10, mdc:7,
    goodDirection:"highIsBad",
    interpret(pct){
      if(pct<=25) return {level:"Sintomas leves", desc:"Pouca limitação da mão.", color:"#16A34A"};
      if(pct<=50) return {level:"Sintomas moderados", desc:"Limitação funcional parcial.", color:"#D97706"};
      if(pct<=75) return {level:"Sintomas severos", desc:"Comprometimento sensório-motor.", color:"#DC2626"};
      return {level:"Sintomas graves", desc:"Função manual severamente comprometida.", color:"#BE185D"};
    },
    questions:[
      ...[["Dor na mão/punho à noite","pain_night"],["Dor na mão/punho durante o dia","pain_day"],["Frequência da dor","pain_freq"],["Duração da dor","pain_dur"]]
        .map(([t,i])=>({id:`bctq_${i}`,label:t,o:OPTS_5})),
      ...[["Formigamento noturno","tingle_night"],["Formigamento diurno","tingle_day"],["Dormência","numbness"],["Fraqueza na mão","weakness"],["Dificuldade com movimentos finos","fine_motor"],["Perda de sensibilidade","sensation_loss"]]
        .map(([t,i])=>({id:`bctq_${i}`,label:`Sintomas: ${t}`,o:["Nunca","Leve","Moderado","Forte","Muito forte"]})),
      ...[["Escrever","func_write"],["Abotoar","func_button"],["Segurar livro","func_hold"],["Abrir pote","func_jar"],["Carregar sacola","func_bag"],["Lavar louça","func_dishes"],["Segurar telefone","func_phone"],["Ler jornal/livro","func_read"],["Dirigir","func_drive"]]
        .map(([t,i])=>({id:`bctq_${i}`,label:`Dificuldade em: ${t}`,o:["Sem dificuldade","Leve dificuldade","Moderada dificuldade","Muita dificuldade","Incapaz"]})),
    ],
  },

  "Patient-Rated Wrist Evaluation (PRWE)": {
    id:"prwe", shortName:"PRWE", aliases:["Patient-Rated Wrist Evaluation"], sections:15, maxPerSection:5, mcid:11, mdc:7,
    goodDirection:"highIsBad",
    interpret(pct){
      if(pct<=25) return {level:"Função preservada", desc:"Boa função do punho.", color:"#16A34A"};
      if(pct<=50) return {level:"Limitação moderada", desc:"Limitação parcial.", color:"#D97706"};
      if(pct<=75) return {level:"Limitação severa", desc:"Comprometimento funcional.", color:"#DC2626"};
      return {level:"Limitação muito severa", desc:"Punho severamente comprometido.", color:"#BE185D"};
    },
    questions:[
      ...[["Dor no punho em repouso","pain_rest"],["Dor ao movimentar o punho","pain_move"],["Dor ao levantar peso","pain_lift"],["Dor ao torcer","pain_twist"],["Dor ao apertar","pain_squeeze"]]
        .map(([t,i])=>({id:`prwe_${i}`,label:`Dor: ${t}`,o:["Nenhuma","Leve","Moderada","Forte","Muito forte","Insuportável"]})),
      ...[["Abrir porta com chave","func_key"],["Cortar carne","func_cut"],["Apertar botão / fechar zíper","func_button"],["Limpar após usar banheiro","func_hygiene"],["Vestir-se","func_dress"],["Pentear cabelo","func_comb"],["Carregar sacola","func_carry"],["Escovar dentes","func_brush"],["Escrever","func_write"],["Usar talheres","func_eat"]]
        .map(([t,i])=>({id:`prwe_${i}`,label:`Função: ${t}`,o:["Sem dificuldade","Leve dificuldade","Moderada dificuldade","Muita dificuldade","Extrema dificuldade","Incapaz"]})),
    ],
  },

  "AUSCAN (Australian/Canadian Hand OA Index)": {
    id:"auscan", shortName:"AUSCAN", aliases:["AUSCAN"], sections:15, maxPerSection:4, mcid:10, mdc:7,
    goodDirection:"highIsBad",
    interpret(pct){
      if(pct<=25) return {level:"Sintomas leves", desc:"Pouca limitação manual.", color:"#16A34A"};
      if(pct<=50) return {level:"Sintomas moderados", desc:"Limitação parcial.", color:"#D97706"};
      if(pct<=75) return {level:"Sintomas severos", desc:"Comprometimento funcional.", color:"#DC2626"};
      return {level:"Sintomas graves", desc:"Função manual severamente comprometida.", color:"#BE185D"};
    },
    questions:[
      ...[["Dor nas mãos em repouso","pain_rest"],["Dor ao segurar objetos","pain_grip"],["Dor ao levantar objetos","pain_lift"],["Dor ao torcer","pain_twist"],["Dor ao usar as mãos","pain_use"]]
        .map(([t,i])=>({id:`auscan_${i}`,label:t,o:OPTS_5})),
      {id:"auscan_rigidez",label:"Rigidez matinal nas mãos",o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]},
      ...[["Virar chave / abrir fechadura","func_key"],["Cortar alimentos","func_cut"],["Abrir pote / tampa de rosca","func_jar"],["Abotoar camisa","func_button"],["Escrever","func_write"],["Abrir porta","func_door"],["Carregar objetos","func_carry"],["Fazer tarefas domésticas","func_chores"],["Usar talheres","func_utensils"]]
        .map(([t,i])=>({id:`auscan_${i}`,label:t,o:OPTS_5_DIF})),
    ],
  },

  "Fonseca Anamnestic Index": {
    id:"fonseca", shortName:"Fonseca", aliases:["Fonseca Anamnestic Index"], sections:10, maxPerSection:2, mcid:8, mdc:5,
    goodDirection:"highIsBad",
    interpret(pct){
      if(pct<=15) return {level:"Sem disfunção", desc:"Função temporomandibular normal.", color:"#16A34A"};
      if(pct<=45) return {level:"Disfunção leve", desc:"DTM leve.", color:"#D97706"};
      if(pct<=70) return {level:"Disfunção moderada", desc:"DTM moderada.", color:"#DC2626"};
      return {level:"Disfunção severa", desc:"DTM severa. Avaliação odontológica.", color:"#BE185D"};
    },
    questions:[
      {id:"fon_abrir",label:"Tem dificuldade para abrir a boca?",o:["Não","Às vezes","Sim"]},
      {id:"fon_estalar",label:"Tem estalos na mandíbula?",o:["Não","Às vezes","Sim"]},
      {id:"fon_cansaco",label:"Sente cansaço nos maxilares?",o:["Não","Às vezes","Sim"]},
      {id:"fon_dor_mast",label:"Sente dor ao mastigar?",o:["Não","Às vezes","Sim"]},
      {id:"fon_cabeca",label:"Tem dores de cabeça frequentes?",o:["Não","Às vezes","Sim"]},
      {id:"fon_pescoço",label:"Sente dor no pescoço?",o:["Não","Às vezes","Sim"]},
      {id:"fon_ouvido",label:"Sente dor no ouvido?",o:["Não","Às vezes","Sim"]},
      {id:"fon_apertar",label:"Aperta ou range os dentes?",o:["Não","Às vezes","Sim"]},
      {id:"fon_morder",label:"Tem dor ao morder?",o:["Não","Às vezes","Sim"]},
      {id:"fon_neural",label:"Tem dor na face / mandíbula?",o:["Não","Às vezes","Sim"]},
    ],
    calculate(answers){
      const weights = [0,2,5];
      let sum = 0;
      this.questions.forEach(q => {
        const v = answers[q.id];
        if (v !== undefined) sum += weights[v] ?? 0;
      });
      return {raw:sum, pct:Math.round(sum/50*100)};
    },
  },

  "RDC/TMD (Research Diagnostic Criteria for TMD)": {
    id:"rdctmd", shortName:"RDC/TMD", aliases:["RDC/TMD"], sections:12, maxPerSection:4, mcid:10, mdc:7,
    goodDirection:"highIsBad",
    interpret(pct){
      if(pct<=25) return {level:"Leve", desc:"Pouca limitação da ATM.", color:"#16A34A"};
      if(pct<=50) return {level:"Moderado", desc:"Limitação funcional parcial.", color:"#D97706"};
      if(pct<=75) return {level:"Severo", desc:"Comprometimento importante.", color:"#DC2626"};
      return {level:"Muito severo", desc:"Função severamente comprometida.", color:"#BE185D"};
    },
    questions:[
      {id:"rdc_dor_face",label:"Dor na face / mandíbula",o:OPTS_5},
      {id:"rdc_estalar",label:"Estalos ao abrir/fechar a boca",o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]},
      {id:"rdc_travar",label:"Travamento da mandíbula",o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]},
      {id:"rdc_abrir",label:"Dificuldade para abrir a boca",o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]},
      {id:"rdc_mastigar",label:"Dor ao mastigar",o:OPTS_5},
      {id:"rdc_bocejar",label:"Dor ao bocejar",o:OPTS_5},
      {id:"rdc_falar",label:"Dor ao falar",o:OPTS_5},
      {id:"rdc_cabeca",label:"Dor de cabeça",o:["Nunca","1-2x/mês","1x/semana","2-3x/semana","Diária"]},
      {id:"rdc_dentes",label:"Aperta / Range os dentes?",o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]},
      {id:"rdc_ouvido",label:"Dor no ouvido / zumbido",o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]},
      {id:"rdc_mascaras",label:"Sensação de cansaço na face ao acordar",o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]},
      {id:"rdc_dor_neuro",label:"Dor irradiada para cabeça/pescoço",o:OPTS_5},
    ],
  },

  "SRS-22 (Scoliosis Research Society)": {
    id:"srs22", shortName:"SRS-22", aliases:["SRS-22"], sections:14, maxPerSection:4, mcid:10, mdc:7,
    goodDirection:"highIsGood",
    interpret(pct){
      if(pct>=80) return {level:"Boa qualidade de vida", desc:"Pouco impacto da escoliose.", color:"#16A34A"};
      if(pct>=60) return {level:"Moderado", desc:"Impacto parcial da deformidade.", color:"#D97706"};
      if(pct>=40) return {level:"Ruim", desc:"Impacto importante na QV.", color:"#DC2626"};
      return {level:"Muito ruim", desc:"Impacto severo na QV.", color:"#BE185D"};
    },
    questions:[
      {id:"srs_dor",label:"Intensidade da dor nas costas",o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]},
      {id:"srs_atividade",label:"Nível de atividade física",o:["Normal","Leve redução","Moderada redução","Grande redução","Muito limitado"]},
      {id:"srs_autoimagem",label:"Satisfação com a aparência física",o:["Muito satisfeito","Satisfeito","Neutro","Insatisfeito","Muito insatisfeito"]},
      {id:"srs_humor",label:"Como está seu humor?",o:["Excelente","Bom","Regular","Ruim","Muito ruim"]},
      {id:"srs_social",label:"Impacto na vida social",o:["Nenhum","Leve","Moderado","Grande","Muito grande"]},
      {id:"srs_dor_freq",label:"Frequência da dor",o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]},
      {id:"srs_medicacao",label:"Precisa de analgésicos?",o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]},
      {id:"srs_andar",label:"Consegue andar por mais de 1h?",o:["Sim, sempre","Sim, quase sempre","Às vezes","Raramente","Não"]},
      {id:"srs_escola",label:"Impacto nos estudos/trabalho",o:["Nenhum","Leve","Moderado","Grande","Muito grande"]},
      {id:"srs_confianca",label:"Confiança em atividades sociais",o:["Total","Boa","Moderada","Pouca","Nenhuma"]},
      {id:"srs_apar",label:"Sente-se atraente fisicamente?",o:["Sim, muito","Sim","Neutro","Não","Não, nada"]},
      {id:"srs_amigos",label:"Os amigos comentam sobre sua postura?",o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]},
      {id:"srs_futuro",label:"Preocupação com o futuro da coluna",o:["Nenhuma","Leve","Moderada","Grande","Muito grande"]},
      {id:"srs_tratamento",label:"Satisfação com o tratamento",o:["Muito satisfeito","Satisfeito","Neutro","Insatisfeito","Muito insatisfeito"]},
    ],
  },

  "Limb Symmetry Index": simpleScale("lsi","LSI",["Limb Symmetry Index"], [0,100], "highIsGood", s=>{
    if(s>=90) return pct({level:"Simetria funcional", desc:"Retorno esportivo seguro.", color:"#16A34A"});
    if(s>=80) return pct({level:"Assimetria leve", desc:"Próximo do critério de liberação.", color:"#D97706"});
    if(s>=70) return pct({level:"Assimetria moderada", desc:"Déficit neuromuscular presente.", color:"#DC2626"});
    return pct({level:"Assimetria grave", desc:"Risco elevado de re-lesão.", color:"#BE185D"});
  }),

  "HAGOS (Copenhagen Hip and Groin Outcome Score)": {
    id:"hagos", shortName:"HAGOS", aliases:["HAGOS"], sections:29, maxPerSection:4, mcid:12, mdc:8,
    goodDirection:"highIsGood",
    interpret(pct){
      if(pct>=80) return {level:"Bom / Excelente", desc:"Boa função do quadril.", color:"#16A34A"};
      if(pct>=60) return {level:"Moderado", desc:"Limitação parcial.", color:"#D97706"};
      if(pct>=40) return {level:"Ruim", desc:"Comprometimento importante.", color:"#DC2626"};
      return {level:"Muito ruim", desc:"Função severamente comprometida.", color:"#BE185D"};
    },
    questions:[
      ...[["Dor na virilha/quadril","pain_groin"],["Dor ao sentar","pain_sit"],["Dor ao andar","pain_walk"],["Dor ao subir escadas","pain_stairs"],["Dor ao correr","pain_run"],["Dor ao pular","pain_jump"],["Dor ao agachar","pain_squat"],["Dor ao cruzar as pernas","pain_cross"],["Dor ao encostar na região","pain_touch"],["Dor ao mudar de direção","pain_cut"]]
        .map(([t,i])=>({id:`hagos_${i}`,label:`Dor: ${t}`,o:OPTS_5})),
      ...[["Agachar","func_squat"],["Curvar-se / pegar algo","func_bend"],["Correr","func_run"],["Pular","func_jump"],["Sentar por tempo prolongado","func_sit"],["Mudar de direção","func_cut"],["Chutar","func_kick"],["Apoiar em uma perna","func_stand1"],["Subir escadas","func_stairs"],["Descer escadas","func_desc"],["Caminhar rápido","func_walk_fast"]]
        .map(([t,i])=>({id:`hagos_${i}`,label:`Função: ${t}`,o:OPTS_5_DIF})),
      ...[["Consegue correr sem restrição?","sport_run"],["Consegue pular sem restrição?","sport_jump"],["Consegue mudar direção?","sport_cut"],["Consegue chutar?","sport_kick"]]
        .map(([t,i])=>({id:`hagos_${i}`,label:`Esporte: ${t}`,o:OPTS_5_DIF})),
      ...[["Com que frequência pensa no quadril?","qol_aware"],["Modificou estilo de vida?","qol_modify"],["Confiança no quadril?","qol_trust"],["Problema difícil de lidar?","qol_tough"]]
        .map(([t,i])=>({id:`hagos_${i}`,label:`QV: ${t}`,o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]})),
    ],
  },

  "Fibromyalgia Impact Questionnaire (FIQ)": {
    id:"fiq", shortName:"FIQ", aliases:["FIQ","Fibromyalgia Impact Questionnaire"], sections:10, maxPerSection:4, mcid:14, mdc:9,
    goodDirection:"highIsBad",
    interpret(pct){
      if(pct<=30) return {level:"Impacto leve", desc:"Bom controle da fibromialgia.", color:"#16A34A"};
      if(pct<=55) return {level:"Impacto moderado", desc:"Fibromialgia com limitação parcial.", color:"#D97706"};
      if(pct<=80) return {level:"Impacto severo", desc:"Comprometimento funcional importante.", color:"#DC2626"};
      return {level:"Impacto muito severo", desc:"Fibromialgia grave. Abordagem multidisciplinar.", color:"#BE185D"};
    },
    questions:[
      {id:"fiq_andar",label:"Caminhar",o:["Sem dificuldade","Leve dificuldade","Moderada dificuldade","Muita dificuldade","Incapaz"]},
      {id:"fiq_compras",label:"Fazer compras",o:["Sem dificuldade","Leve dificuldade","Moderada dificuldade","Muita dificuldade","Incapaz"]},
      {id:"fiq_tarefas",label:"Tarefas domésticas",o:["Sem dificuldade","Leve dificuldade","Moderada dificuldade","Muita dificuldade","Incapaz"]},
      {id:"fiq_carro",label:"Dirigir / andar de carro",o:["Sem dificuldade","Leve dificuldade","Moderada dificuldade","Muita dificuldade","Incapaz"]},
      {id:"fiq_subir",label:"Subir escadas",o:["Sem dificuldade","Leve dificuldade","Moderada dificuldade","Muita dificuldade","Incapaz"]},
      {id:"fiq_trabalho",label:"Trabalho / Atividades laborais",o:["Sem dificuldade","Leve dificuldade","Moderada dificuldade","Muita dificuldade","Incapaz"]},
      {id:"fiq_sono",label:"Qualidade do sono",o:["Excelente","Boa","Regular","Ruim","Muito ruim"]},
      {id:"fiq_cansaço",label:"Nível de cansaço / fadiga",o:["Nenhum","Leve","Moderado","Forte","Muito forte"]},
      {id:"fiq_dor",label:"Nível de dor generalizada",o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]},
      {id:"fiq_rigidez",label:"Rigidez matinal",o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]},
    ],
  },

  "WPI (Widespread Pain Index)": simpleScale("wpi","WPI",["WPI"], [0,19], "highIsBad", s=>{
    if(s<=6) return pct({level:"Dor localizada", desc:"Poucas áreas dolorosas.", color:"#16A34A"});
    if(s<=11) return pct({level:"Dor disseminada moderada", desc:"Múltiplas áreas dolorosas.", color:"#D97706"});
    return pct({level:"Dor generalizada", desc:"Dor difusa. Critério para fibromialgia.", color:"#DC2626"});
  }),

  "SSS (Symptom Severity Scale)": simpleScale("sss2","SSS",["SSS","Symptom Severity Scale"], [0,12], "highIsBad", s=>{
    if(s<=4) return pct({level:"Sintomas leves", desc:"Pouca severidade.", color:"#16A34A"});
    if(s<=8) return pct({level:"Sintomas moderados", desc:"Severidade moderada.", color:"#D97706"});
    return pct({level:"Sintomas graves", desc:"Alta severidade. Intervenção necessária.", color:"#DC2626"});
  }),

  "HAQ (Health Assessment Questionnaire)": {
    id:"haq", shortName:"HAQ", aliases:["HAQ"], sections:12, maxPerSection:3, mcid:0.22, mdc:0.15,
    goodDirection:"highIsBad",
    interpret(pct){
      if(pct<=16) return {level:"Incapacidade mínima", desc:"Função preservada.", color:"#16A34A"};
      if(pct<=50) return {level:"Incapacidade moderada", desc:"Limitação parcial nas AVDs.", color:"#D97706"};
      return {level:"Incapacidade grave", desc:"Dependência funcional importante.", color:"#DC2626"};
    },
    questions:[
      {id:"haq_vestir",label:"Vestir-se (incluindo abotoar, amarrar sapatos)",o:["Sem dificuldade","Com alguma dificuldade","Com muita dificuldade","Incapaz"]},
      {id:"haq_lavar",label:"Lavar o cabelo",o:["Sem dificuldade","Com alguma dificuldade","Com muita dificuldade","Incapaz"]},
      {id:"haq_deitar",label:"Levantar da cama",o:["Sem dificuldade","Com alguma dificuldade","Com muita dificuldade","Incapaz"]},
      {id:"haq_cortar",label:"Cortar carne / abrir alimentos",o:["Sem dificuldade","Com alguma dificuldade","Com muita dificuldade","Incapaz"]},
      {id:"haq_xicara",label:"Levar xícara à boca",o:["Sem dificuldade","Com alguma dificuldade","Com muita dificuldade","Incapaz"]},
      {id:"haq_andar",label:"Caminhar em superfície plana",o:["Sem dificuldade","Com alguma dificuldade","Com muita dificuldade","Incapaz"]},
      {id:"haq_banho",label:"Levantar para tomar banho",o:["Sem dificuldade","Com alguma dificuldade","Com muita dificuldade","Incapaz"]},
      {id:"haq_sentar",label:"Sentar e levantar da cadeira",o:["Sem dificuldade","Com alguma dificuldade","Com muita dificuldade","Incapaz"]},
      {id:"haq_alcancar",label:"Alcançar objeto acima da cabeça",o:["Sem dificuldade","Com alguma dificuldade","Com muita dificuldade","Incapaz"]},
      {id:"haq_agarrar",label:"Abrir porta / torneira",o:["Sem dificuldade","Com alguma dificuldade","Com muita dificuldade","Incapaz"]},
      {id:"haq_compras",label:"Fazer compras / recados",o:["Sem dificuldade","Com alguma dificuldade","Com muita dificuldade","Incapaz"]},
      {id:"haq_tarefas",label:"Tarefas domésticas pesadas",o:["Sem dificuldade","Com alguma dificuldade","Com muita dificuldade","Incapaz"]},
    ],
  },

  "DAS28 (Disease Activity Score)": simpleScale("das28","DAS28",["DAS28"], [0,9.4], "highIsBad", s=>{
    if(s<=2.6) return pct({level:"Remissão", desc:"Atividade inflamatória controlada.", color:"#16A34A"});
    if(s<=3.2) return pct({level:"Baixa atividade", desc:"Pouca atividade inflamatória.", color:"#16A34A"});
    if(s<=5.1) return pct({level:"Atividade moderada", desc:"Atividade inflamatória moderada.", color:"#D97706"});
    return pct({level:"Alta atividade", desc:"Atividade inflamatória intensa.", color:"#DC2626"});
  }),

  "Oxford Knee Score": {
    id:"oxford-ks", shortName:"Oxford KS", aliases:["Oxford Knee Score"], sections:12, maxPerSection:4, mcid:8, mdc:5,
    goodDirection:"highIsBad",
    interpret(pct){
      if(pct<=20) return {level:"Função preservada", desc:"Boa função do joelho.", color:"#16A34A"};
      if(pct<=40) return {level:"Limitação moderada", desc:"Limitação parcial.", color:"#D97706"};
      if(pct<=60) return {level:"Limitação severa", desc:"Comprometimento importante.", color:"#DC2626"};
      return {level:"Limitação muito severa", desc:"Joelho severamente comprometido.", color:"#BE185D"};
    },
    questions:[
      {id:"oks_dor",label:"Como descreve a dor no joelho nas últimas 4 semanas?",o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]},
      {id:"oks_banho",label:"Consegue tomar banho / se secar sozinho?",o:["Sim, sem dificuldade","Sim, com leve dificuldade","Sim, com moderada dificuldade","Sim, com muita dificuldade","Não consigo"]},
      {id:"oks_carro",label:"Consegue entrar/sair do carro?",o:["Sim, sem dificuldade","Sim, com leve dificuldade","Sim, com moderada dificuldade","Sim, com muita dificuldade","Não consigo"]},
      {id:"oks_andar",label:"Quanto tempo consegue caminhar?",o:[">30 min","15-30 min","5-15 min","Apenas dentro de casa","Não consigo"]},
      {id:"oks_curvar",label:"Consegue se curvar / ajoelhar?",o:["Sim, sem dificuldade","Sim, com leve dificuldade","Sim, com moderada dificuldade","Sim, com muita dificuldade","Não consigo"]},
      {id:"oks_sono",label:"A dor atrapalha o sono?",o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]},
      {id:"oks_trabalho",label:"Limitação no trabalho / AVDs?",o:["Nenhuma","Leve","Moderada","Grande","Total"]},
      {id:"oks_manqueira",label:"Manqueira ao andar?",o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]},
      {id:"oks_escadas",label:"Consegue descer escadas?",o:["Sim, sem dificuldade","Sim, com leve dificuldade","Sim, com moderada dificuldade","Sim, com muita dificuldade","Não consigo"]},
      {id:"oks_subir",label:"Consegue subir escadas?",o:["Sim, sem dificuldade","Sim, com leve dificuldade","Sim, com moderada dificuldade","Sim, com muita dificuldade","Não consigo"]},
      {id:"oks_instavel",label:"Sente o joelho instável / falseia?",o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]},
      {id:"oks_medicacao",label:"Precisa de analgésicos para dor?",o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]},
    ],
  },

  "Oxford Hip Score": {
    id:"oxford-hs", shortName:"Oxford HS", aliases:["Oxford Hip Score"], sections:12, maxPerSection:4, mcid:8, mdc:5,
    goodDirection:"highIsBad",
    interpret(pct){
      if(pct<=20) return {level:"Função preservada", desc:"Boa função do quadril.", color:"#16A34A"};
      if(pct<=40) return {level:"Limitação moderada", desc:"Limitação parcial.", color:"#D97706"};
      if(pct<=60) return {level:"Limitação severa", desc:"Comprometimento importante.", color:"#DC2626"};
      return {level:"Limitação muito severa", desc:"Quadril severamente comprometido.", color:"#BE185D"};
    },
    questions:[
      {id:"ohs_dor",label:"Como descreve a dor no quadril nas últimas 4 semanas?",o:["Nenhuma","Leve","Moderada","Forte","Muito forte"]},
      {id:"ohs_banho",label:"Consegue tomar banho / se secar sozinho?",o:["Sim, sem dificuldade","Sim, com leve dificuldade","Sim, com moderada dificuldade","Sim, com muita dificuldade","Não consigo"]},
      {id:"ohs_carro",label:"Consegue entrar/sair do carro?",o:["Sim, sem dificuldade","Sim, com leve dificuldade","Sim, com moderada dificuldade","Sim, com muita dificuldade","Não consigo"]},
      {id:"ohs_meias",label:"Consegue calçar meias / sapatos?",o:["Sim, sem dificuldade","Sim, com leve dificuldade","Sim, com moderada dificuldade","Sim, com muita dificuldade","Não consigo"]},
      {id:"ohs_compras",label:"Consegue fazer compras sozinho?",o:["Sim, sem dificuldade","Sim, com leve dificuldade","Sim, com moderada dificuldade","Sim, com muita dificuldade","Não consigo"]},
      {id:"ohs_andar",label:"Quanto tempo consegue caminhar?",o:[">30 min","15-30 min","5-15 min","Apenas dentro de casa","Não consigo"]},
      {id:"ohs_escadas",label:"Consegue subir escadas?",o:["Sim, sem dificuldade","Sim, com leve dificuldade","Sim, com moderada dificuldade","Sim, com muita dificuldade","Não consigo"]},
      {id:"ohs_trabalho",label:"Limitação no trabalho / AVDs?",o:["Nenhuma","Leve","Moderada","Grande","Total"]},
      {id:"ohs_manqueira",label:"Manqueira ao andar?",o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]},
      {id:"ohs_sono",label:"A dor atrapalha o sono?",o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]},
      {id:"ohs_social",label:"A dor limita sua vida social?",o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]},
      {id:"ohs_medicacao",label:"Precisa de analgésicos para dor?",o:["Nunca","Raramente","Às vezes","Frequentemente","Sempre"]},
    ],
  },

  "SPADI (Shoulder Pain and Disability Index)": {
    id:"spadi", shortName:"SPADI", aliases:["SPADI","Spadi"], sections:15, maxPerSection:5, mcid:13, mdc:9,
    goodDirection:"highIsBad",
    interpret(pct){
      if(pct<=20) return {level:"Função preservada", desc:"Boa função do ombro.", color:"#16A34A"};
      if(pct<=40) return {level:"Limitação leve", desc:"Limitação parcial.", color:"#D97706"};
      if(pct<=60) return {level:"Limitação moderada", desc:"Comprometimento funcional.", color:"#DC2626"};
      return {level:"Limitação grave", desc:"Ombro severamente comprometido.", color:"#BE185D"};
    },
    questions:[
      ...[["Pior dor no ombro","pain_worst"],["Dor em repouso","pain_rest"],["Dor ao mover o braço","pain_move"],["Dor ao tocar o ombro","pain_touch"],["Dor ao deitar sobre o ombro","pain_lie"]]
        .map(([t,i])=>({id:`spadi_${i}`,label:`Dor: ${t}`,o:["Sem dor","Leve","Moderada","Forte","Muito forte","Pior possível"]})),
      ...[["Lavar o cabelo","wash_hair"],["Lavar as costas","wash_back"],["Vestir uma camisa","dress_shirt"],["Vestir uma camisa com botões","dress_buttons"],["Colocar uma camisa por cima da cabeça","dress_overhead"],["Vestir uma jaqueta","dress_jacket"],["Abrir uma porta pesada","open_door"],["Colocar objeto em prateleira acima","reach_high"],["Carregar peso de 4kg","carry_4kg"],["Pegar algo no bolso de trás","reach_back"]]
        .map(([t,i])=>({id:`spadi_${i}`,label:`AVD: ${t}`,o:["Sem dificuldade","Leve dificuldade","Moderada dificuldade","Muita dificuldade","Extrema dificuldade","Incapaz"]})),
    ],
  },

  "WOSI (Western Ontario Shoulder Instability Index)": {
    id:"wosi", shortName:"WOSI", aliases:["WOSI"], sections:21, maxPerSection:4, mcid:15, mdc:10,
    goodDirection:"highIsBad",
    interpret(pct){
      if(pct<=20) return {level:"Boa estabilidade", desc:"Instabilidade leve.", color:"#16A34A"};
      if(pct<=40) return {level:"Instabilidade moderada", desc:"Limitação parcial.", color:"#D97706"};
      if(pct<=60) return {level:"Instabilidade severa", desc:"Comprometimento importante.", color:"#DC2626"};
      return {level:"Instabilidade muito severa", desc:"Ombro severamente instável.", color:"#BE185D"};
    },
    questions:[
      ...[["Dor ao movimentar o ombro","pain_move"],["Dor ao levantar peso","pain_lift"],["Dor à noite","pain_night"],["Dor ao arremessar","pain_throw"],["Dor ao fazer força","pain_strain"],["Estalos / rangidos no ombro","crepitus"],["Sensação de que o ombro vai sair do lugar","sublux_sensation"]]
        .map(([t,i])=>({id:`wosi_${i}`,label:`Sintomas físicos: ${t}`,o:["Nenhum","Leve","Moderado","Grave","Muito grave"]})),
      ...[["Praticar esportes","sport"],["Levantar peso acima da cabeça","overhead"],["Empurrar objetos pesados","push"],["Puxar objetos pesados","pull"],["Carregar bolsa/mochila","carry"],["Atividades domésticas","chores"],["Trabalho","work"]]
        .map(([t,i])=>({id:`wosi_${i}`,label:`Esporte/Lazer/Trabalho: ${t}`,o:["Sem dificuldade","Leve dificuldade","Moderada dificuldade","Muita dificuldade","Incapaz"]})),
      ...[["Medo de lesionar o ombro","fear"],["Preocupação com a instabilidade","worry"],["Frustração pela condição","frustration"],["Dificuldade em aceitar a lesão","accept"]]
        .map(([t,i])=>({id:`wosi_${i}`,label:`Emoções: ${t}`,o:["Nada","Um pouco","Moderadamente","Muito","Extremamente"]})),
      ...[["Limitação na vida social","social"],["Dependência de outras pessoas","dependence"],["Impacto no humor","mood"]]
        .map(([t,i])=>({id:`wosi_${i}`,label:`Estilo de vida: ${t}`,o:["Nenhum","Leve","Moderado","Grande","Extremo"]})),
    ],
  },

  "Patient Global Impression of Change (PGIC)": simpleScale("pgic","PGIC",["PGIC","Patient Global Impression of Change"], [1,7], "highIsGood", s=>{
    if(s>=6) return pct({level:"Melhora importante", desc:"Melhora significativa.", color:"#16A34A"});
    if(s>=4) return pct({level:"Melhora leve / Sem mudança", desc:"Pequena mudança.", color:"#D97706"});
    if(s>=2) return pct({level:"Piora leve", desc:"Pequena piora.", color:"#DC2626"});
    return pct({level:"Piora importante", desc:"Piora significativa. Reavaliação.", color:"#BE185D"});
  }),

  "Northwick Park Neck Pain Questionnaire": {
    id:"npq", shortName:"NPQ", aliases:["Northwick Park Neck Pain Questionnaire"], sections:9, maxPerSection:4, mcid:8, mdc:5,
    goodDirection:"highIsBad",
    interpret(pct){
      if(pct<=20) return {level:"Incapacidade mínima", desc:"Pouca limitação cervical.", color:"#16A34A"};
      if(pct<=40) return {level:"Incapacidade moderada", desc:"Limitação parcial.", color:"#D97706"};
      if(pct<=60) return {level:"Incapacidade severa", desc:"Comprometimento funcional.", color:"#DC2626"};
      return {level:"Incapacidade grave", desc:"Função cervical severamente comprometida.", color:"#BE185D"};
    },
    questions:[
      {id:"npq_dor",label:"Intensidade da dor cervical",o:OPTS_5},
      {id:"npq_sono",label:"A dor atrapalha o sono?",o:["Não atrapalha","Atrapalha levemente","Atrapalha moderadamente","Atrapalha muito","Impede de dormir"]},
      {id:"npq_formig",label:"Formigamento nos braços/mãos",o:["Nunca","Leve e raro","Moderado e ocasional","Forte e frequente","Constante"]},
      {id:"npq_ler",label:"Ler / Usar computador",o:["Sem dificuldade","Leve dificuldade","Moderada dificuldade","Muita dificuldade","Incapaz"]},
      {id:"npq_carregar",label:"Carregar pesos",o:["Sem dificuldade","Leve dificuldade","Moderada dificuldade","Muita dificuldade","Incapaz"]},
      {id:"npq_trabalho",label:"Trabalho / Atividades diárias",o:["Normal","Leve limitação","Moderada limitação","Grande limitação","Impossível"]},
      {id:"npq_social",label:"Vida social / Lazer",o:["Normal","Leve redução","Moderada redução","Grande redução","Abandonei"]},
      {id:"npq_dirigir",label:"Dirigir",o:["Sem dificuldade","Leve dificuldade","Moderada dificuldade","Muita dificuldade","Incapaz"]},
      {id:"npq_cabeca",label:"Dor de cabeça",o:["Nunca","1-2x/mês","1x/semana","2-3x/semana","Diária"]},
    ],
  },

  "AOS (Ankle Osteoarthritis Scale)": {
    id:"aos", shortName:"AOS", aliases:["AOS","Ankle Osteoarthritis Scale"], sections:18, maxPerSection:4, mcid:12, mdc:8,
    goodDirection:"highIsBad",
    interpret(pct){
      if(pct<=25) return {level:"Sintomas leves", desc:"Pouca limitação do tornozelo.", color:"#16A34A"};
      if(pct<=50) return {level:"Sintomas moderados", desc:"Limitação parcial.", color:"#D97706"};
      if(pct<=75) return {level:"Sintomas severos", desc:"Comprometimento funcional.", color:"#DC2626"};
      return {level:"Sintomas graves", desc:"Tornozelo severamente comprometido.", color:"#BE185D"};
    },
    questions:[
      ...[["Dor no tornozelo em repouso","pain_rest"],["Dor ao caminhar em plano","pain_walk"],["Dor ao subir escadas","pain_stairs"],["Dor ao ficar em pé","pain_stand"],["Dor à noite","pain_night"],["Rigidez matinal","stiff_morning"]]
        .map(([t,i])=>({id:`aos_${i}`,label:t,o:OPTS_5})),
      ...[["Caminhar em superfície plana","func_walk"],["Subir escadas","func_stairs"],["Descer escadas","func_desc"],["Ficar em pé","func_stand"],["Curvar-se","func_bend"],["Sentar/levantar do chão","func_floor"],["Caminhar em irregular","func_irreg"],["Correr","func_run"],["Pular","func_jump"],["Vestir calçados","func_shoes"],["Dirigir","func_drive"],["Atividades domésticas","func_chores"]]
        .map(([t,i])=>({id:`aos_${i}`,label:t,o:OPTS_5_DIF})),
    ],
  },

  "CAIT (Cumberland Ankle Instability Tool)": {
    id:"cait", shortName:"CAIT", aliases:["CAIT"], sections:9, maxPerSection:null, mcid:3, mdc:2,
    goodDirection:"highIsGood",
    interpret(pct){
      if(pct>=80) return {level:"Tornozelo estável", desc:"Boa estabilidade do tornozelo.", color:"#16A34A"};
      if(pct>=60) return {level:"Instabilidade leve", desc:"Limitação parcial.", color:"#D97706"};
      if(pct>=33) return {level:"Instabilidade moderada", desc:"Instabilidade funcional.", color:"#DC2626"};
      return {level:"Instabilidade grave", desc:"Tornozelo severamente instável.", color:"#BE185D"};
    },
    questions:[
      {id:"cait_dor",label:"Sente dor no tornozelo?",o:["Nunca","Durante esporte intenso","Correndo em irregular","Correndo em plano","Caminhando em irregular","Caminhando em plano"]},
      {id:"cait_instavel",label:"Sente instabilidade no tornozelo?",o:["Nunca","Às vezes no esporte","Frequentemente no esporte","Às vezes em AVDs","Frequentemente em AVDs"]},
      {id:"cait_torce",label:"Com que frequência torce o tornozelo?",o:["Nunca","1-2 vezes/ano","1-2 vezes/mês","1 vez/semana","Diariamente"]},
      {id:"cait_irreg",label:"Caminhar em terreno irregular",o:["Sem dificuldade","Leve dificuldade","Moderada dificuldade","Muita dificuldade","Incapaz"]},
      {id:"cait_rapido",label:"Correr / mudar direção rapidamente",o:["Sem dificuldade","Leve dificuldade","Moderada dificuldade","Muita dificuldade","Incapaz"]},
      {id:"cait_escadas",label:"Descer escadas",o:["Sem dificuldade","Leve dificuldade","Moderada dificuldade","Muita dificuldade","Incapaz"]},
      {id:"cait_apoio",label:"Ficar em apoio unipodal",o:["Sem dificuldade","Leve dificuldade","Moderada dificuldade","Muita dificuldade","Incapaz"]},
      {id:"cait_pular",label:"Pular / Aterrissar",o:["Sem dificuldade","Leve dificuldade","Moderada dificuldade","Muita dificuldade","Incapaz"]},
      {id:"cait_incha",label:"O tornozelo incha após atividade?",o:["Nunca","Após atividade intensa","Após atividade moderada","Após atividade leve","Constantemente"]},
    ],
    calculate(answers){
      const maxPerQ = [5,4,4,4,4,4,4,4,4];
      let sum = 0; let max = 0;
      this.questions.forEach((q,i) => {
        const v = answers[q.id]; if (v !== undefined) { sum += v; }
        max += maxPerQ[i];
      });
      return {raw:sum, pct:max>0?Math.round(sum/max*100):0};
    },
  },

  // ════════════════════ NEURO ════════════════════

  "Modified Ashworth Scale (MAS)": {
    id:"mas", shortName:"MAS", aliases:["MAS","Modified Ashworth Scale","Ashworth"], sections:6, maxPerSection:4, mcid:3, mdc:2,
    interpret(pct){
      if(pct<=5) return {level:"Sem espasticidade", desc:"Tônus normal.", color:"#16A34A"};
      if(pct<=25) return {level:"Espasticidade leve", desc:"Leve aumento do tônus.", color:"#D97706"};
      if(pct<=50) return {level:"Espasticidade moderada", desc:"Aumento moderado, ADM possível.", color:"#DC2626"};
      return {level:"Espasticidade grave", desc:"Aumento acentuado ou rigidez.", color:"#7C3AED"};
    },
    questions:[
      {id:"mas_fcd",label:"Flexores de cotovelo — Direito",o:["0 — Sem aumento de tônus","1 — Leve aumento, sem resistência","2 — Aumento moderado, ADM fácil","3 — Aumento acentuado, ADM difícil","4 — Rigidez em flexão/extensão"]},
      {id:"mas_fce",label:"Flexores de cotovelo — Esquerdo",o:["0 — Sem aumento de tônus","1 — Leve aumento, sem resistência","2 — Aumento moderado, ADM fácil","3 — Aumento acentuado, ADM difícil","4 — Rigidez em flexão/extensão"]},
      {id:"mas_ejd",label:"Extensores de joelho — Direito",o:["0 — Sem aumento de tônus","1 — Leve aumento, sem resistência","2 — Aumento moderado, ADM fácil","3 — Aumento acentuado, ADM difícil","4 — Rigidez em flexão/extensão"]},
      {id:"mas_eje",label:"Extensores de joelho — Esquerdo",o:["0 — Sem aumento de tônus","1 — Leve aumento, sem resistência","2 — Aumento moderado, ADM fácil","3 — Aumento acentuado, ADM difícil","4 — Rigidez em flexão/extensão"]},
      {id:"mas_fpd",label:"Flexores plantares — Direito",o:["0 — Sem aumento de tônus","1 — Leve aumento, sem resistência","2 — Aumento moderado, ADM fácil","3 — Aumento acentuado, ADM difícil","4 — Rigidez em flexão/extensão"]},
      {id:"mas_fpe",label:"Flexores plantares — Esquerdo",o:["0 — Sem aumento de tônus","1 — Leve aumento, sem resistência","2 — Aumento moderado, ADM fácil","3 — Aumento acentuado, ADM difícil","4 — Rigidez em flexão/extensão"]},
    ],
  },

  "Berg Balance Scale (BBS)": {
    id:"bbs", shortName:"BBS", aliases:["Berg Balance Scale","BBS","Berg"], sections:14, maxPerSection:4, mcid:5, mdc:3,
    goodDirection:"highIsGood",
    interpret(pct){
      if(pct>=80) return {level:"Baixo risco de queda", desc:"Equilíbrio funcional preservado.", color:"#16A34A"};
      if(pct>=38) return {level:"Médio risco de queda", desc:"Equilíbrio moderadamente comprometido.", color:"#D97706"};
      return {level:"Alto risco de queda", desc:"Equilíbrio severamente comprometido.", color:"#DC2626"};
    },
    questions:[
      {id:"bbs_1",label:"1 — Sentado para em pé",o:["0 — Precisa de ajuda moderada/máxima","1 — Precisa de ajuda mínima ou supervisão","2 — Levanta-se com ajuda das mãos após várias tentativas","3 — Levanta-se sozinho com as mãos","4 — Levanta-se sozinho sem as mãos e estabiliza"]},
      {id:"bbs_2",label:"2 — Em pé sem apoio",o:["0 — Incapaz de ficar em pé >30s sem ajuda","1 — Necessita várias tentativas para ficar 30s","2 — Fica em pé 30s sem ajuda (observar)","3 — Fica em pé 2min sob supervisão","4 — Fica em pé 2min com segurança"]},
      {id:"bbs_3",label:"3 — Sentado sem apoio, pés no chão",o:["0 — Incapaz de sentar >10s sem apoio","1 — Senta 10s com apoio","2 — Senta 10s sem apoio, mas precisa compensar","3 — Senta 2min sob supervisão","4 — Senta 2min com segurança"]},
      {id:"bbs_4",label:"4 — Em pé para sentado",o:["0 — Precisa de ajuda para sentar","1 — Senta sem controle do movimento","2 — Usa as mãos para controlar a descida","3 — Controla a descida com leve uso das mãos","4 — Senta com segurança e mínimo uso das mãos"]},
      {id:"bbs_5",label:"5 — Transferências (cadeira↔cadeira / cama↔cadeira)",o:["0 — Precisa de 2 pessoas para transferir","1 — Precisa de 1 pessoa para ajudar","2 — Transfere com supervisão verbal ou física","3 — Transfere sozinho com leve auxílio das mãos","4 — Transfere sozinho com segurança"]},
      {id:"bbs_6",label:"6 — Em pé sem apoio, olhos fechados",o:["0 — Precisa de ajuda para não cair","1 — Não consegue fechar os olhos e ficar 3s","2 — Mantém 3s com olhos fechados","3 — Mantém 10s sob supervisão","4 — Mantém 10s com segurança"]},
      {id:"bbs_7",label:"7 — Em pé sem apoio, pés juntos",o:["0 — Precisa de ajuda para juntar os pés","1 — Junta os pés mas não mantém 15s","2 — Mantém 15s com supervisão","3 — Mantém 15s sozinho","4 — Junta os pés sozinho e mantém 1min"]},
      {id:"bbs_8",label:"8 — Alcançar à frente com braço estendido",o:["0 — Perde equilíbrio ao tentar","1 — Alcança mas precisa de supervisão","2 — Alcança <5cm","3 — Alcança 5-12cm","4 — Alcança >12cm com segurança"]},
      {id:"bbs_9",label:"9 — Pegar objeto do chão",o:["0 — Incapaz de tentar / precisa de ajuda","1 — Tenta mas não pega","2 — Pega o objeto com supervisão","3 — Pega o objeto sozinho, com dificuldade","4 — Pega o objeto com facilidade e segurança"]},
      {id:"bbs_10",label:"10 — Virar-se e olhar sobre os ombros",o:["0 — Precisa de ajuda para não cair","1 — Gira com desequilíbrio","2 — Gira apenas lateralmente mantendo equilíbrio","3 — Olha apenas para um lado com desequilíbrio","4 — Olha sobre ambos os ombros com segurança"]},
      {id:"bbs_11",label:"11 — Girar 360°",o:["0 — Precisa de ajuda para girar","1 — Gira com muitos passos (>8)","2 — Gira em 4-8 passos, devagar","3 — Gira em <4 passos em uma direção","4 — Gira 360° em ≤4s em ambas as direções"]},
      {id:"bbs_12",label:"12 — Apoiar pés alternadamente sobre banco",o:["0 — Incapaz de tentar / precisa de ajuda","1 — Apoia 2-4 pés mas não completa","2 — Completa 8 apoios em >20s","3 — Completa 8 apoios em 20s","4 — Completa 8 apoios em <20s"]},
      {id:"bbs_13",label:"13 — Em pé, um pé à frente do outro",o:["0 — Perde equilíbrio ao colocar os pés","1 — Dá o passo, não mantém","2 — Dá passo pequeno, mantém com ajuda","3 — Coloca um pé à frente e mantém 30s","4 — Coloca pé à frente e mantém 30s com segurança"]},
      {id:"bbs_14",label:"14 — Em pé sobre uma perna só",o:["0 — Incapaz de tentar / precisa de ajuda","1 — Tenta levantar a perna, não mantém","2 — Mantém 3s com supervisão","3 — Mantém 5-10s","4 — Mantém >10s com segurança"]},
    ],
  },

  "Functional Independence Measure (MIF)": {
    id:"mif", shortName:"MIF", aliases:["MIF","Functional Independence Measure","FIM"], sections:18, maxPerSection:7, mcid:12, mdc:8,
    goodDirection:"highIsGood",
    interpret(pct){
      if(pct>=86) return {level:"Independência completa/modificada", desc:"Funcionalidade preservada.", color:"#16A34A"};
      if(pct>=57) return {level:"Dependência moderada", desc:"Necessita de assistência parcial.", color:"#D97706"};
      if(pct>=29) return {level:"Dependência grave", desc:"Necessita de assistência significativa.", color:"#DC2626"};
      return {level:"Dependência total", desc:"Assistência total nas AVDs.", color:"#BE185D"};
    },
    questions:[
      // ── Autocuidado ──
      {id:"mif_1",label:"Alimentação",o:["1 — Assistência total","2 — Assistência máxima (25-50%)","3 — Assistência moderada (50-75%)","4 — Assistência mínima (>75%)","5 — Supervisão / preparo","6 — Independência modificada","7 — Independência completa"]},
      {id:"mif_2",label:"Higiene pessoal (rosto, dentes, barba, cabelo)",o:["1 — Assistência total","2 — Assistência máxima","3 — Assistência moderada","4 — Assistência mínima","5 — Supervisão","6 — Independência modificada","7 — Independência completa"]},
      {id:"mif_3",label:"Banho (lavar e secar o corpo)",o:["1 — Assistência total","2 — Assistência máxima","3 — Assistência moderada","4 — Assistência mínima","5 — Supervisão","6 — Independência modificada","7 — Independência completa"]},
      {id:"mif_4",label:"Vestir — Tronco superior",o:["1 — Assistência total","2 — Assistência máxima","3 — Assistência moderada","4 — Assistência mínima","5 — Supervisão","6 — Independência modificada","7 — Independência completa"]},
      {id:"mif_5",label:"Vestir — Tronco inferior",o:["1 — Assistência total","2 — Assistência máxima","3 — Assistência moderada","4 — Assistência mínima","5 — Supervisão","6 — Independência modificada","7 — Independência completa"]},
      {id:"mif_6",label:"Uso do vaso sanitário (higiene íntima, ajustar roupa)",o:["1 — Assistência total","2 — Assistência máxima","3 — Assistência moderada","4 — Assistência mínima","5 — Supervisão","6 — Independência modificada","7 — Independência completa"]},
      // ── Controle esfincteriano ──
      {id:"mif_7",label:"Controle vesical (bexiga)",o:["1 — Incontinência total","2 — Incontinência >1x/dia","3 — Incontinência <1x/dia","4 — Continente com uso de sonda/fralda","5 — Continente com medicação/dispositivo","6 — Continente, independência modificada","7 — Continência completa"]},
      {id:"mif_8",label:"Controle intestinal",o:["1 — Incontinência total","2 — Incontinência >1x/semana","3 — Incontinência <1x/semana","4 — Continente com uso de fralda","5 — Continente com laxante/supositório","6 — Continente, independência modificada","7 — Continência completa"]},
      // ── Transferências ──
      {id:"mif_9",label:"Transferência — Cama / cadeira / cadeira de rodas",o:["1 — Assistência total","2 — Assistência máxima","3 — Assistência moderada","4 — Assistência mínima","5 — Supervisão","6 — Independência modificada","7 — Independência completa"]},
      {id:"mif_10",label:"Transferência — Vaso sanitário",o:["1 — Assistência total","2 — Assistência máxima","3 — Assistência moderada","4 — Assistência mínima","5 — Supervisão","6 — Independência modificada","7 — Independência completa"]},
      {id:"mif_11",label:"Transferência — Banheira / Chuveiro",o:["1 — Assistência total","2 — Assistência máxima","3 — Assistência moderada","4 — Assistência mínima","5 — Supervisão","6 — Independência modificada","7 — Independência completa"]},
      // ── Locomoção ──
      {id:"mif_12",label:"Locomoção — Marcha / cadeira de rodas",o:["1 — Assistência total","2 — Assistência máxima","3 — Assistência moderada","4 — Assistência mínima","5 — Supervisão","6 — Independência modificada","7 — Independência completa"]},
      {id:"mif_13",label:"Escadas (subir e descer 12-14 degraus)",o:["1 — Assistência total","2 — Assistência máxima","3 — Assistência moderada","4 — Assistência mínima","5 — Supervisão","6 — Independência modificada","7 — Independência completa"]},
      // ── Comunicação ──
      {id:"mif_14",label:"Compreensão (auditiva / visual)",o:["1 — Compreensão ausente","2 — Compreende <25%","3 — Compreende 25-49%","4 — Compreende 50-74%","5 — Compreende 75-90%","6 — Compreende 90-99%","7 — Compreensão completa"]},
      {id:"mif_15",label:"Expressão (verbal / não verbal)",o:["1 — Expressão ausente","2 — Expressa <25%","3 — Expressa 25-49%","4 — Expressa 50-74%","5 — Expressa 75-90%","6 — Expressa 90-99%","7 — Expressão completa"]},
      // ── Cognição social ──
      {id:"mif_16",label:"Interação social (cooperação, comportamento)",o:["1 — Interação totalmente inadequada","2 — Interação inadequada >75% do tempo","3 — Interação inadequada 50-74%","4 — Interação inadequada 25-49%","5 — Interação inadequada <25%","6 — Interação adequada quase sempre","7 — Interação totalmente adequada"]},
      {id:"mif_17",label:"Resolução de problemas",o:["1 — Nenhuma capacidade de resolver","2 — Resolve <25%","3 — Resolve 25-49%","4 — Resolve 50-74%","5 — Resolve 75-90%","6 — Resolve 90-99%","7 — Resolução completa"]},
      {id:"mif_18",label:"Memória",o:["1 — Nenhuma capacidade de lembrar","2 — Lembra <25%","3 — Lembra 25-49%","4 — Lembra 50-74%","5 — Lembra 75-90%","6 — Lembra 90-99%","7 — Memória completa"]},
    ],
  },

  "Fugl-Meyer Assessment": {
    id:"fugl", shortName:"Fugl-Meyer", aliases:["Fugl-Meyer","FMA","Fugl-Meyer Assessment"],
    sections:15, maxPerSection:2, mcid:10, mdc:6,
    interpret(pct){
      if(pct>=80) return {level:"Função motora preservada", desc:"Boa recuperação motora.", color:"#16A34A"};
      if(pct>=60) return {level:"Déficit motor moderado", desc:"Limitação motora parcial.", color:"#D97706"};
      if(pct>=40) return {level:"Déficit motor grave", desc:"Comprometimento motor importante.", color:"#DC2626"};
      return {level:"Déficit motor muito grave", desc:"Função motora severamente comprometida.", color:"#BE185D"};
    },
    questions:[
      {id:"fma_a",label:"Reflexos — Bíceps e tríceps (MS)",o:["0 — Ausentes","1 — Presente em um","2 — Presentes"]},
      {id:"fma_b",label:"Flexão de ombro — padrão sinérgico",o:["0 — Não inicia","1 — Parcial (<90°)","2 — Completa (180°)"]},
      {id:"fma_c",label:"Abdução de ombro a 90°",o:["0 — Não realiza","1 — Parcial","2 — Completa (≥90°)"]},
      {id:"fma_d",label:"Rotação externa de ombro",o:["0 — Não inicia","1 — Parcial","2 — Completa"]},
      {id:"fma_e",label:"Extensão de cotovelo",o:["0 — Não realiza","1 — Parcial","2 — Completa"]},
      {id:"fma_f",label:"Extensão de punho — estabilidade",o:["0 — Não realiza","1 — Com flexão","2 — Punho neutro"]},
      {id:"fma_g",label:"Preensão — flexão em massa",o:["0 — Ausente","1 — Fraca","2 — Completa"]},
      {id:"fma_h",label:"Pinça lateral (polegar-dedo)",o:["0 — Ausente","1 — Parcial","2 — Funcional"]},
      {id:"fma_i",label:"Pinça cilíndrica",o:["0 — Ausente","1 — Parcial","2 — Funcional"]},
      {id:"fma_j",label:"Coordenação — Tremor",o:["0 — Tremor marcado","1 — Tremor leve","2 — Sem tremor"]},
      {id:"fma_k",label:"Coordenação — Dismetria (índex-nariz)",o:["0 — Dismetria grave","1 — Dismetria leve","2 — Sem dismetria"]},
      {id:"fma_l",label:"Velocidade — Índex-nariz",o:["0 — >6s / muito lento","1 — 2-5s","2 — <2s"]},
      {id:"fma_m",label:"Sensibilidade — Toque leve / propriocepção",o:["0 — Anestesia","1 — Hipo/Disestesia","2 — Normal"]},
      {id:"fma_n",label:"ADM passiva — Ombro e cotovelo",o:["0 — <50%","1 — 50-80%","2 — >80%"]},
      {id:"fma_o",label:"Dor articular — Ombro/punho/mão",o:["0 — Dor intensa ao movimento","1 — Dor leve","2 — Sem dor"]},
    ],
  },

  "NIH Stroke Scale (NIHSS)": {
    id:"nihss", shortName:"NIHSS", aliases:["NIHSS","NIH Stroke Scale"],
    sections:15, maxPerSection:null, mcid:3, mdc:2,
    calculate(answers){
      const weights = {n1a:3,n1b:2,n1c:2,n2:2,n3:3,n4:3,n5a:4,n5b:4,n6a:4,n6b:4,n7:2,n8:2,n9:3,n10:2,n11:2};
      let sum=0, max=0;
      for(const [k,w] of Object.entries(weights)){ sum+= (Number(answers[k])||0); max+=w; }
      return {raw:sum, max, pct:max>0?Math.round((sum/max)*100):0};
    },
    interpret(pct){
      if(pct<=10) return {level:"AVC leve", desc:"Déficit neurológico leve.", color:"#16A34A"};
      if(pct<=35) return {level:"AVC moderado", desc:"Déficit neurológico moderado.", color:"#D97706"};
      if(pct<=60) return {level:"AVC moderado-grave", desc:"Déficit neurológico importante.", color:"#DC2626"};
      return {level:"AVC grave", desc:"Déficit neurológico severo.", color:"#BE185D"};
    },
    questions:[
      {id:"n1a",label:"1a — Nível de Consciência",o:["0 — Alerta","1 — Sonolento","2 — Torporoso","3 — Coma"]},
      {id:"n1b",label:"1b — Orientação (mês + idade)",o:["0 — Ambas corretas","1 — Uma correta","2 — Nenhuma/Não testável"]},
      {id:"n1c",label:"1c — Comandos (abrir/fechar olhos + mão)",o:["0 — Ambos corretos","1 — Um correto","2 — Nenhum"]},
      {id:"n2",label:"2 — Olhar conjugado horizontal",o:["0 — Normal","1 — Paresia parcial","2 — Desvio forçado"]},
      {id:"n3",label:"3 — Campo visual (quadrantes)",o:["0 — Sem perda","1 — Hemianopsia parcial","2 — Hemianopsia completa","3 — Hemianopsia bilateral"]},
      {id:"n4",label:"4 — Paralisia facial",o:["0 — Normal","1 — Paresia leve","2 — Paresia parcial inferior","3 — Completa (uni ou bi)"]},
      {id:"n5a",label:"5a — Motor braço E (10s)",o:["0 — Mantém","1 — Queda <10s","2 — Queda <5s","3 — Esforço sem gravidade","4 — Sem movimento"]},
      {id:"n5b",label:"5b — Motor braço D (10s)",o:["0 — Mantém","1 — Queda <10s","2 — Queda <5s","3 — Esforço sem gravidade","4 — Sem movimento"]},
      {id:"n6a",label:"6a — Motor perna E (5s)",o:["0 — Mantém","1 — Queda <5s","2 — Queda <2s","3 — Esforço sem gravidade","4 — Sem movimento"]},
      {id:"n6b",label:"6b — Motor perna D (5s)",o:["0 — Mantém","1 — Queda <5s","2 — Queda <2s","3 — Esforço sem gravidade","4 — Sem movimento"]},
      {id:"n7",label:"7 — Ataxia apendicular",o:["0 — Ausente","1 — Presente em um membro","2 — Presente em dois membros"]},
      {id:"n8",label:"8 — Sensibilidade dolorosa",o:["0 — Normal","1 — Perda leve-moderada","2 — Perda grave ou total"]},
      {id:"n9",label:"9 — Linguagem (compreensão/expressão)",o:["0 — Normal","1 — Afasia leve-moderada","2 — Afasia grave","3 — Mudo/global"]},
      {id:"n10",label:"10 — Disartria",o:["0 — Normal","1 — Disartria leve-moderada","2 — Disartria grave ou mudo"]},
      {id:"n11",label:"11 — Extinção / Inatenção",o:["0 — Ausente","1 — Parcial (1 modalidade)","2 — Grave (>1 modalidade)"]},
    ],
  },

  "Glasgow Coma Scale (GCS)": {
    id:"gcs", shortName:"GCS", aliases:["Glasgow Coma Scale","GCS","Escala de Coma de Glasgow"], sections:3, maxPerSection:null, mcid:2, mdc:1.3,
    goodDirection:"highIsGood",
    calculate(answers){
      const sum = Object.values(answers).reduce((t,v)=>t+(Number(v)||0),0);
      return {raw:sum, max:15, pct:Math.round(sum/15*100)};
    },
    interpret(pct){
      if(pct>=87) return {level:"Trauma leve", desc:"Comprometimento neurológico leve.", color:"#16A34A"};
      if(pct>=60) return {level:"Trauma moderado", desc:"Comprometimento neurológico moderado.", color:"#D97706"};
      if(pct>=27) return {level:"Trauma grave", desc:"Comprometimento neurológico grave.", color:"#DC2626"};
      return {level:"Coma", desc:"Estado comatoso. Intervenção imediata.", color:"#BE185D"};
    },
    questions:[
      {id:"gcs_ocular",label:"Abertura Ocular",o:["1 — Não abre","2 — Abre à pressão (estímulo doloroso)","3 — Abre ao comando verbal","4 — Abertura espontânea"]},
      {id:"gcs_verbal",label:"Resposta Verbal",o:["1 — Sem resposta","2 — Sons incompreensíveis (gemidos)","3 — Palavras inadequadas","4 — Confuso / conversação confusa","5 — Orientado / conversação normal"]},
      {id:"gcs_motora",label:"Resposta Motora",o:["1 — Sem resposta","2 — Extensão ao estímulo (descerebração)","3 — Flexão anormal (decorticação)","4 — Flexão normal / retirada inespecífica","5 — Localiza estímulo doloroso","6 — Obedece comandos"]},
    ],
  },

  "Trunk Impairment Scale (TIS)": {
    id:"tis", shortName:"TIS", aliases:["TIS","Trunk Impairment Scale","Escala de Comprometimento de Tronco"], sections:3, maxPerSection:null, mcid:3, mdc:2,
    goodDirection:"highIsGood",
    calculate(answers){
      const sum = Object.values(answers).reduce((t,v)=>t+(Number(v)||0),0);
      return {raw:sum, max:23, pct:Math.round(sum/23*100)};
    },
    interpret(pct){
      if(pct>=87) return {level:"Controle preservado", desc:"Bom controle de tronco.", color:"#16A34A"};
      if(pct>=61) return {level:"Déficit leve", desc:"Comprometimento leve de tronco.", color:"#D97706"};
      if(pct>=30) return {level:"Déficit moderado", desc:"Comprometimento moderado de tronco.", color:"#A78BFA"};
      return {level:"Déficit grave", desc:"Comprometimento grave de tronco.", color:"#BE185D"};
    },
    questions:[
      {id:"tis_estatico",label:"Sentado estático",o:["0 — Incapaz","1","2","3","4","5","6","7 — Controle total"]},
      {id:"tis_dinamico",label:"Sentado dinâmico (alcances / flexão)",o:["0 — Incapaz","1","2","3","4","5","6","7","8","9","10 — Controle total"]},
      {id:"tis_transf",label:"Transferências / coordenação",o:["0 — Incapaz","1","2","3","4","5","6 — Independente"]},
    ],
  },

  "Timed Up and Go (TUG)": simpleScale("tug","TUG",["Timed Up and Go (TUG)","TUG","Timed Up and Go"], [0,120], "highIsBad", s=>{
    if(s<=10) return pct({level:"Normal", desc:"Mobilidade funcional preservada.", color:"#16A34A"});
    if(s<=20) return pct({level:"Risco moderado de queda", desc:"Mobilidade reduzida.", color:"#D97706"});
    if(s<=30) return pct({level:"Alto risco de queda", desc:"Mobilidade significativamente comprometida.", color:"#DC2626"});
    return pct({level:"Muito alto risco", desc:"Mobilidade severamente comprometida.", color:"#BE185D"});
  }),

  "Barthel Index": {
    id:"barthel", shortName:"Barthel", aliases:["Barthel Index","Barthel"], sections:10, maxPerSection:null, mcid:10, mdc:6,
    calculate(answers){
      const map = {
        b_alim: [0,5,10], b_banho: [0,5], b_higiene: [0,5], b_vestir: [0,5,10], b_intest: [0,5,10], b_bexiga: [0,5,10],
        b_vaso: [0,5,10], b_transf: [0,5,10,15], b_mobil: [0,5,10,15], b_escada: [0,5,10],
      };
      let sum = 0;
      for (const [k, w] of Object.entries(map)) {
        const idx = Number(answers[k]);
        if (!isNaN(idx) && w[idx] !== undefined) sum += w[idx];
      }
      return {raw:sum, max:100, pct:sum};
    },
    interpret(pct){
      if(pct>=90) return {level:"Independência", desc:"Funcionalidade preservada nas AVDs.", color:"#16A34A"};
      if(pct>=60) return {level:"Dependência leve", desc:"Necessita de ajuda em algumas atividades.", color:"#D97706"};
      if(pct>=40) return {level:"Dependência moderada", desc:"Necessita de ajuda significativa.", color:"#DC2626"};
      return {level:"Dependência grave", desc:"Dependente para a maioria das AVDs.", color:"#BE185D"};
    },
    questions:[
      {id:"b_alim",label:"Alimentação",o:["0 — Dependente","5 — Precisa de ajuda (cortar, passar manteiga)","10 — Independente"]},
      {id:"b_banho",label:"Banho",o:["0 — Dependente","5 — Independente"]},
      {id:"b_higiene",label:"Higiene pessoal (rosto/dentes/barba)",o:["0 — Dependente","5 — Independente"]},
      {id:"b_vestir",label:"Vestir-se",o:["0 — Dependente","5 — Precisa de ajuda","10 — Independente"]},
      {id:"b_intest",label:"Controle intestinal",o:["0 — Incontinente","5 — Acidente ocasional","10 — Continente"]},
      {id:"b_bexiga",label:"Controle vesical",o:["0 — Incontinente ou cateter","5 — Acidente ocasional","10 — Continente"]},
      {id:"b_vaso",label:"Uso do vaso sanitário",o:["0 — Dependente","5 — Ajuda parcial","10 — Independente"]},
      {id:"b_transf",label:"Transferência (cadeira↔cama)",o:["0 — Dependente","5 — Grande ajuda","10 — Pequena ajuda","15 — Independente"]},
      {id:"b_mobil",label:"Mobilidade (caminhar/cadeira)",o:["0 — Imóvel","5 — Independente em cadeira","10 — Anda com ajuda","15 — Anda independente (≥50m)"]},
      {id:"b_escada",label:"Subir e descer escadas",o:["0 — Dependente","5 — Precisa de ajuda","10 — Independente"]},
    ],
  },

  "SCIM (Spinal Cord Independence Measure)": {
    id:"scim", shortName:"SCIM", aliases:["SCIM","Spinal Cord Independence Measure"], sections:15, maxPerSection:null, mcid:8, mdc:5,
    calculate(answers){
      const map = {
        s_alim: [0,1,2,3], s_banho_s: [0,1,2,3], s_banho_i: [0,1,2,3], s_vestir_s: [0,1,2,3], s_vestir_i: [0,1,2,3],
        s_higiene: [0,1,2,3], s_resp: [0,2,4,6,8,10], s_esfinct: [0,3,6,9,12,15],
        s_mobil_cama: [0,2,4,6], s_transf_banho: [0,1,2], s_transf_chao: [0,1,2],
        s_mobil_int: [0,2,4,6,8], s_mobil_mod: [0,2,4,6,8], s_mobil_ext: [0,2,4,6,8,10],
        s_escada: [0,1,2,3],
      };
      let sum = 0, max = 0;
      for (const [k, w] of Object.entries(map)) {
        const idx = Number(answers[k]);
        if (!isNaN(idx) && w[idx] !== undefined) sum += w[idx];
        max += w[w.length-1];
      }
      return {raw:sum, max, pct:max>0?Math.round((sum/max)*100):0};
    },
    interpret(pct){
      if(pct>=80) return {level:"Independência funcional", desc:"Boa funcionalidade na lesão medular.", color:"#16A34A"};
      if(pct>=50) return {level:"Dependência moderada", desc:"Assistência parcial nas AVDs.", color:"#D97706"};
      if(pct>=20) return {level:"Dependência grave", desc:"Assistência significativa.", color:"#DC2626"};
      return {level:"Dependência total", desc:"Assistência completa.", color:"#BE185D"};
    },
    questions:[
      {id:"s_alim",label:"Alimentação",o:["0 — Sonda/dependente","1 — Ajuda parcial","2 — Independente com adaptação","3 — Independente"]},
      {id:"s_banho_s",label:"Banho — Tronco superior",o:["0 — Dependente","1 — Ajuda parcial","2 — Independente com adaptação","3 — Independente"]},
      {id:"s_banho_i",label:"Banho — Tronco inferior",o:["0 — Dependente","1 — Ajuda parcial","2 — Independente com adaptação","3 — Independente"]},
      {id:"s_vestir_s",label:"Vestir — Tronco superior",o:["0 — Dependente","1 — Ajuda parcial","2 — Independente com adaptação","3 — Independente"]},
      {id:"s_vestir_i",label:"Vestir — Tronco inferior",o:["0 — Dependente","1 — Ajuda parcial","2 — Independente com adaptação","3 — Independente"]},
      {id:"s_higiene",label:"Higiene (face/barba/dentes)",o:["0 — Dependente","1 — Ajuda parcial","2 — Independente com adaptação","3 — Independente"]},
      {id:"s_resp",label:"Respiração (capacidade vital)",o:["0 — Ventilação dependente","2 — CV <30%","4 — CV 30-50%","6 — CV 50-80%","8 — CV >80% (necessita auxílio)","10 — CV >80% (independente)"]},
      {id:"s_esfinct",label:"Controle esfincteriano (urinário+intestinal)",o:["0 — Cateter ou incontinência total","3 — Esvaziamento assistido (cateterismo)","6 — Incontinência parcial","9 — Continente (horário programado)","12 — Continente (micção voluntária)","15 — Continência completa"]},
      {id:"s_mobil_cama",label:"Mobilidade e transferências no leito",o:["0 — Dependente","2 — Ajuda parcial","4 — Independente com dispositivos","6 — Independente"]},
      {id:"s_transf_banho",label:"Transferência: cama↔cadeira de banho",o:["0 — Dependente","1 — Ajuda parcial ou supervisão","2 — Independente"]},
      {id:"s_transf_chao",label:"Transferência: cadeira↔chão",o:["0 — Dependente","1 — Ajuda parcial ou supervisão","2 — Independente"]},
      {id:"s_mobil_int",label:"Mobilidade: curta distância (10-100m)",o:["0 — Dependente","2 — Cadeira elétrica ou ajuda","4 — Cadeira manual independente","6 — Anda com andador/muletas","8 — Anda com órteses (sem supervisão)"]},
      {id:"s_mobil_mod",label:"Mobilidade: distância moderada (100-500m)",o:["0 — Dependente","2 — Cadeira elétrica","4 — Cadeira manual independente","6 — Anda com andador/muletas","8 — Anda com órteses"]},
      {id:"s_mobil_ext",label:"Mobilidade: longa distância (>500m / exteriores)",o:["0 — Dependente","2 — Cadeira elétrica","4 — Cadeira manual independente","6 — Anda com andador","8 — Anda com órteses","10 — Anda sem auxílio"]},
      {id:"s_escada",label:"Subir e descer escadas",o:["0 — Incapaz","1 — Com ajuda (1+ pessoas)","2 — Com supervisão ou corrimão","3 — Independente (sem ajuda)"]},
    ],
  },

  "Expanded Disability Status Scale (EDSS)": {
    id:"edss", shortName:"EDSS", aliases:["EDSS","Expanded Disability Status Scale"], sections:8, maxPerSection:null, mcid:1, mdc:0.5,
    calculate(answers){
      const w = {e_pyra:[0,1,2,3,4,5],e_cereb:[0,1,2,3,4,5],e_brain:[0,1,2,3,4,5],
                 e_sens:[0,1,2,3,4,5],e_bb:[0,1,2,3,4,5],e_vis:[0,1,2,3,4,5],
                 e_mental:[0,1,2,3,4,5],e_amb:[]};
      let fsSum=0, fsMax=0;
      for(const [k,arr] of Object.entries(w)){
        if(k==="e_amb") continue;
        const idx=Number(answers[k]); fsSum+=(!isNaN(idx)&&arr[idx]!==undefined?arr[idx]:0); fsMax+=5;
      }
      const amb = Number(answers.e_amb)||0;
      // Aproximação EDSS baseada em Functional Systems + deambulação
      let edss;
      if(amb===0) edss=0; // Normal
      else if(amb===1) edss=fsSum<=10?1.5:2.5; // Leve, sem limitação marcha
      else if(amb===2) edss=fsSum<=8?3.0:3.5; // Moderada, marcha preservada
      else if(amb===3) edss=4.0; // Anda 500m
      else if(amb===4) edss=4.5; // Anda 300m
      else if(amb===5) edss=5.0; // Anda 200m
      else if(amb===6) edss=5.5; // Anda 100m
      else if(amb===7) edss=6.0; // Apoio unilateral
      else if(amb===8) edss=6.5; // Apoio bilateral
      else if(amb===9) edss=7.0; // Cadeira de rodas, transfere
      else if(amb===10) edss=7.5; // Cadeira, transfere com ajuda
      else if(amb===11) edss=8.0; // Restrito ao leito/cadeira
      else if(amb===12) edss=8.5; // Restrito ao leito, usa braços
      else edss=9.0; // Restrito ao leito, dependente
      const pct=Math.round(Math.min(100,(edss/9.5)*100));
      return {raw:edss, max:10, pct};
    },
    interpret(pct){
      if(pct<=25) return {level:"Incapacidade mínima", desc:"Pouca limitação funcional.", color:"#16A34A"};
      if(pct<=45) return {level:"Incapacidade moderada", desc:"Limitação funcional parcial.", color:"#D97706"};
      if(pct<=65) return {level:"Incapacidade grave", desc:"Comprometimento importante da marcha.", color:"#DC2626"};
      return {level:"Incapacidade muito grave", desc:"Restrito à cadeira de rodas/leito.", color:"#BE185D"};
    },
    questions:[
      {id:"e_pyra",label:"Função piramidal (força MMII)",o:["0 — Normal","1 — Déficit leve (Grau 4)","2 — Déficit moderado (Grau 3)","3 — Déficit grave (Grau 2)","4 — Movimento mínimo (Grau 1)","5 — Plegia (Grau 0)"]},
      {id:"e_cereb",label:"Função cerebelar (ataxia/tremor)",o:["0 — Normal","1 — Sinais leves, sem disfunção","2 — Ataxia leve (marcha, membro)","3 — Ataxia moderada","4 — Ataxia grave (incapaz de coord.)","5 — Ataxia severa (não realiza)"]},
      {id:"e_brain",label:"Tronco cerebral (fala/deglutição/ocular)",o:["0 — Normal","1 — Sinais leves (nistagmo)","2 — Disartria/nistagmo moderado","3 — Disartria/disgafia importante","4 — Necessidade de CAA","5 — Incapaz deglutir/falar"]},
      {id:"e_sens",label:"Função sensitiva (toque/dor/mmii)",o:["0 — Normal","1 — Hipoestesia leve em 1-2 membros","2 — Hipoestesia leve em 3-4 membros ou moderada em 1-2","3 — Hipoestesia moderada em 3-4 membros","4 — Hipoestesia grave (estereognosia)","5 — Anestesia completa"]},
      {id:"e_bb",label:"Bexiga e intestino",o:["0 — Normal","1 — Urgência/hesitação leve","2 — Urgência/hesitação moderada","3 — Incontinência ocasional","4 — Sondagem intermitente","5 — Cateter permanente/incontinência total"]},
      {id:"e_vis",label:"Função visual (acuidade/escotoma)",o:["0 — Normal","1 — Escotoma, acuidade ≥20/30","2 — Pior olho com escotoma ou 20/30-20/50","3 — Pior olho com grande escotoma ou 20/60","4 — Pior olho <20/60, melhor olho <20/60","5 — Pior olho <20/60, melhor olho ≤20/60"]},
      {id:"e_mental",label:"Função cerebral (cognição/humor)",o:["0 — Normal","1 — Alteração de humor (sem déficit cognitivo)","2 — Déficit cognitivo leve","3 — Déficit cognitivo moderado","4 — Síndrome cerebral crônica","5 — Demência grave"]},
      {id:"e_amb",label:"Deambulação — distância máxima sem descanso",o:["0 — Sem restrições","1 — >500m, sem limitação","2 — >500m, sinais leves","3 — 500m sem descanso","4 — 300m sem descanso","5 — 200m sem descanso","6 — 100m sem descanso","7 — Apoio unilateral (bengala)","8 — Apoio bilateral (muletas/andador)","9 — Cadeira de rodas — transfere sozinho","10 — Cadeira de rodas — transferência com ajuda","11 — Restrito ao leito/cadeira","12 — Restrito ao leito (usa braços)","13 — Restrito, dependente total"]},
    ],
  },

  // ════════════════════ PEDIATRIA ════════════════════

  "GMFCS (Gross Motor Function Classification System)": simpleScale("gmfcs","GMFCS",["GMFCS","Gross Motor Function Classification System"], [1,5], "highIsBad", s=>{
    if(s<=1) return pct({level:"Nível I", desc:"Anda sem limitações.", color:"#16A34A"});
    if(s<=2) return pct({level:"Nível II", desc:"Anda com limitações.", color:"#D97706"});
    if(s<=3) return pct({level:"Nível III", desc:"Anda com dispositivo de mobilidade.", color:"#F59E0B"});
    if(s<=4) return pct({level:"Nível IV", desc:"Mobilidade limitada, usa cadeira de rodas.", color:"#DC2626"});
    return pct({level:"Nível V", desc:"Transportado em cadeira de rodas.", color:"#BE185D"});
  }),

  "AIMS (Alberta Infant Motor Scale)": simpleScale("aims","AIMS",["AIMS","Alberta Infant Motor Scale"], [0,58], "highIsGood", s=>{
    if(s>=45) return pct({level:"Desenvolvimento motor adequado", desc:"Dentro do esperado para a idade.", color:"#16A34A"});
    if(s>=30) return pct({level:"Atraso motor leve", desc:"Abaixo do esperado. Estimulação indicada.", color:"#D97706"});
    if(s>=15) return pct({level:"Atraso motor moderado", desc:"Atraso significativo. Intervenção precoce.", color:"#DC2626"});
    return pct({level:"Atraso motor grave", desc:"Atraso severo. Estimulação intensiva.", color:"#BE185D"});
  }),

  "M-CHAT (Modified Checklist for Autism in Toddlers)": simpleScale("mchat","M-CHAT",["M-CHAT","Modified Checklist for Autism in Toddlers"], [0,23], "highIsBad", s=>{
    if(s<=2) return pct({level:"Baixo risco de TEA", desc:"Rastreamento negativo. Sem necessidade de avaliação adicional.", color:"#16A34A"});
    if(s<=7) return pct({level:"Risco médio de TEA", desc:"Rastreamento positivo. Encaminhar para avaliação diagnóstica.", color:"#D97706"});
    return pct({level:"Alto risco de TEA", desc:"Rastreamento fortemente positivo. Encaminhamento urgente.", color:"#DC2626"});
  }),

  "PEDI (Pediatric Evaluation of Disability Inventory)": simpleScale("pedi","PEDI",["PEDI","Pediatric Evaluation of Disability Inventory"], [0,100], "highIsGood", s=>{
    if(s>=80) return pct({level:"Função preservada", desc:"Independência funcional adequada.", color:"#16A34A"});
    if(s>=50) return pct({level:"Limitação funcional moderada", desc:"Dependência parcial em AVDs.", color:"#D97706"});
    if(s>=20) return pct({level:"Limitação funcional grave", desc:"Dependência significativa.", color:"#DC2626"});
    return pct({level:"Limitação funcional severa", desc:"Dependência total.", color:"#BE185D"});
  }),

  // ════════════════════ CARDIO-RESPIRATÓRIA ════════════════════

  "London Chest Activity of Daily Living (LCADL)": {
    id:"lcadl", shortName:"LCADL", aliases:["LCADL","London Chest Activity of Daily Living","London Chest Activity of Daily Living (LCADL)"], sections:15, maxPerSection:5, mcid:10, mdc:6,
    goodDirection: "highIsBad",
    interpret(pct){
      if(pct<20) return {level:"Leve", desc:"Pouco impacto nas AVDs.", color:"#16A34A"};
      if(pct<50) return {level:"Moderada", desc:"Impacto moderado nas AVDs.", color:"#D97706"};
      if(pct<80) return {level:"Grave", desc:"Grande impacto nas AVDs.", color:"#DC2626"};
      return {level:"Muito grave", desc:"Impacto muito grave nas AVDs.", color:"#BE185D"};
    },
    questions:[
      {id:"lcadl_1",label:"Cuidados pessoais (lavar/secar/cabelo/vestir)",o:["0 - Eu nunca fiz","1 - Não me dá falta de ar","2 - Falta de ar moderada","3 - Falta de ar forte","4 - Deixei de fazer por causa da falta de ar","5 - Não faço por outras razões"]},
      {id:"lcadl_2",label:"Secar a parte superior do corpo",o:["0 - Eu nunca fiz","1 - Não me dá falta de ar","2 - Falta de ar moderada","3 - Falta de ar forte","4 - Deixei de fazer por causa da falta de ar","5 - Não faço por outras razões"]},
      {id:"lcadl_3",label:"Calçar sapatos/meias",o:["0 - Eu nunca fiz","1 - Não me dá falta de ar","2 - Falta de ar moderada","3 - Falta de ar forte","4 - Deixei de fazer por causa da falta de ar","5 - Não faço por outras razões"]},
      {id:"lcadl_4",label:"Tomar banho/duche",o:["0 - Eu nunca fiz","1 - Não me dá falta de ar","2 - Falta de ar moderada","3 - Falta de ar forte","4 - Deixei de fazer por causa da falta de ar","5 - Não faço por outras razões"]},
      {id:"lcadl_5",label:"Curvar-se (abaixar para pegar objetos)",o:["0 - Eu nunca fiz","1 - Não me dá falta de ar","2 - Falta de ar moderada","3 - Falta de ar forte","4 - Deixei de fazer por causa da falta de ar","5 - Não faço por outras razões"]},
      {id:"lcadl_6",label:"Subir escadas",o:["0 - Eu nunca fiz","1 - Não me dá falta de ar","2 - Falta de ar moderada","3 - Falta de ar forte","4 - Deixei de fazer por causa da falta de ar","5 - Não faço por outras razões"]},
      {id:"lcadl_7",label:"Andar em plano",o:["0 - Eu nunca fiz","1 - Não me dá falta de ar","2 - Falta de ar moderada","3 - Falta de ar forte","4 - Deixei de fazer por causa da falta de ar","5 - Não faço por outras razões"]},
      {id:"lcadl_8",label:"Fazer a cama",o:["0 - Eu nunca fiz","1 - Não me dá falta de ar","2 - Falta de ar moderada","3 - Falta de ar forte","4 - Deixei de fazer por causa da falta de ar","5 - Não faço por outras razões"]},
      {id:"lcadl_9",label:"Arrumar a casa",o:["0 - Eu nunca fiz","1 - Não me dá falta de ar","2 - Falta de ar moderada","3 - Falta de ar forte","4 - Deixei de fazer por causa da falta de ar","5 - Não faço por outras razões"]},
      {id:"lcadl_10",label:"Fazer compras",o:["0 - Eu nunca fiz","1 - Não me dá falta de ar","2 - Falta de ar moderada","3 - Falta de ar forte","4 - Deixei de fazer por causa da falta de ar","5 - Não faço por outras razões"]},
      {id:"lcadl_11",label:"Lavar roupa",o:["0 - Eu nunca fiz","1 - Não me dá falta de ar","2 - Falta de ar moderada","3 - Falta de ar forte","4 - Deixei de fazer por causa da falta de ar","5 - Não faço por outras razões"]},
      {id:"lcadl_12",label:"Aspirar/varrer",o:["0 - Eu nunca fiz","1 - Não me dá falta de ar","2 - Falta de ar moderada","3 - Falta de ar forte","4 - Deixei de fazer por causa da falta de ar","5 - Não faço por outras razões"]},
      {id:"lcadl_13",label:"Jardinagem",o:["0 - Eu nunca fiz","1 - Não me dá falta de ar","2 - Falta de ar moderada","3 - Falta de ar forte","4 - Deixei de fazer por causa da falta de ar","5 - Não faço por outras razões"]},
      {id:"lcadl_14",label:"Passear",o:["0 - Eu nunca fiz","1 - Não me dá falta de ar","2 - Falta de ar moderada","3 - Falta de ar forte","4 - Deixei de fazer por causa da falta de ar","5 - Não faço por outras razões"]},
      {id:"lcadl_15",label:"Sair para socializar",o:["0 - Eu nunca fiz","1 - Não me dá falta de ar","2 - Falta de ar moderada","3 - Falta de ar forte","4 - Deixei de fazer por causa da falta de ar","5 - Não faço por outras razões"]},
    ],
  },

  "Duke Activity Status Index (DASI)": {
    id:"dasi", shortName:"DASI", aliases:["DASI","Duke Activity Status Index","Duke Activity Status Index (DASI)"], sections:12, maxPerSection:1, mcid:10, mdc:6,
    goodDirection: "highIsGood",
    calculate(answers){
      const weights = {
        dasi_1: 2.75, dasi_2: 1.75, dasi_3: 2.75, dasi_4: 5.50,
        dasi_5: 8.00, dasi_6: 8.00, dasi_7: 8.00, dasi_8: 2.70,
        dasi_9: 3.50, dasi_10: 8.00, dasi_11: 4.50, dasi_12: 5.25,
      };
      const max = 58.2;
      let total = 0;
      for (const [key, val] of Object.entries(answers)) {
        total += val ? (weights[key] || 0) : 0;
      }
      const pct = Math.round((total / max) * 100);
      return { raw: total, pct, max };
    },
    interpret(pct){
      if(pct>=80) return {level:"Excelente", desc:"Capacidade funcional preservada.", color:"#16A34A"};
      if(pct>=60) return {level:"Moderado", desc:"Capacidade funcional reduzida.", color:"#D97706"};
      if(pct>=40) return {level:"Reduzido", desc:"Comprometimento funcional significativo.", color:"#DC2626"};
      return {level:"Muito reduzido", desc:"Comprometimento funcional grave.", color:"#BE185D"};
    },
    questions:[
      {id:"dasi_1",label:"Autocuidado (comer, vestir, banho)",o:["Não","Sim"]},
      {id:"dasi_2",label:"Caminhar em casa",o:["Não","Sim"]},
      {id:"dasi_3",label:"Caminhar 1-2 quarteirões em terreno plano",o:["Não","Sim"]},
      {id:"dasi_4",label:"Subir um lance de escadas",o:["Não","Sim"]},
      {id:"dasi_5",label:"Subir alguns lances de escadas",o:["Não","Sim"]},
      {id:"dasi_6",label:"Andar em morro/ladeira",o:["Não","Sim"]},
      {id:"dasi_7",label:"Correr curta distância",o:["Não","Sim"]},
      {id:"dasi_8",label:"Tarefas domésticas leves (tirar pó, lavar louça)",o:["Não","Sim"]},
      {id:"dasi_9",label:"Tarefas domésticas moderadas (aspirar, varrer)",o:["Não","Sim"]},
      {id:"dasi_10",label:"Tarefas domésticas pesadas (mover móveis)",o:["Não","Sim"]},
      {id:"dasi_11",label:"Jardinagem (cavar, plantar)",o:["Não","Sim"]},
      {id:"dasi_12",label:"Relação sexual",o:["Não","Sim"]},
    ],
  },

  "NYHA Functional Classification": simpleScale("nyha","NYHA",["NYHA","NYHA Functional Classification","New York Heart Association"], [1,4], "highIsBad", s=>{
    if(s<=1) return pct({level:"Classe I", desc:"Sem limitação. Atividade física habitual não causa sintomas.", color:"#16A34A"});
    if(s<=2) return pct({level:"Classe II", desc:"Limitação leve. Atividade física habitual causa sintomas.", color:"#D97706"});
    if(s<=3) return pct({level:"Classe III", desc:"Limitação moderada. Atividades leves causam sintomas.", color:"#DC2626"});
    return pct({level:"Classe IV", desc:"Limitação severa. Sintomas em repouso.", color:"#BE185D"});
  }),

  "Borg CR10 Scale": simpleScale("borg","Borg CR10",["Borg (CR10)","Borg CR10","Borg"], [0,10], "highIsBad", s=>{
    if(s<=2) return pct({level:"Muito leve", desc:"Esforço percebido mínimo.", color:"#16A34A"});
    if(s<=4) return pct({level:"Moderado", desc:"Esforço percebido moderado.", color:"#D97706"});
    if(s<=6) return pct({level:"Intenso", desc:"Esforço percebido intenso.", color:"#DC2626"});
    if(s<=8) return pct({level:"Muito intenso", desc:"Esforço percebido muito intenso.", color:"#7C3AED"});
    return pct({level:"Máximo", desc:"Esforço máximo percebido.", color:"#BE185D"});
  }),

  "mMRC Dyspnea Scale": simpleScale("mmrc","mMRC",["mMRC","mMRC Dyspnea Scale","Modified Medical Research Council"], [0,4], "highIsBad", s=>{
    if(s<=0) return pct({level:"Grau 0", desc:"Falta de ar apenas ao exercício intenso.", color:"#16A34A"});
    if(s<=1) return pct({level:"Grau 1", desc:"Falta de ar ao andar rápido ou subida leve.", color:"#D97706"});
    if(s<=2) return pct({level:"Grau 2", desc:"Anda mais devagar que pessoas da mesma idade.", color:"#F59E0B"});
    if(s<=3) return pct({level:"Grau 3", desc:"Para para respirar após andar 100m ou poucos minutos.", color:"#DC2626"});
    return pct({level:"Grau 4", desc:"Falta de ar ao sair de casa ou ao se vestir.", color:"#BE185D"});
  }),

  "BODE Index": simpleScale("bode","BODE",["BODE Index","BODE"], [0,10], "highIsBad", s=>{
    if(s<=4) return pct({level:"Baixo risco", desc:"Melhor prognóstico na DPOC.", color:"#16A34A"});
    if(s<=7) return pct({level:"Risco moderado", desc:"Prognóstico intermediário.", color:"#D97706"});
    return pct({level:"Alto risco", desc:"Pior prognóstico. Mortalidade elevada.", color:"#DC2626"});
  }),

  "6 Minute Walk Test (6MWT)": simpleScale("mwt6","6MWT",["6 Minute Walk Test","6MWT","Teste de Caminhada 6 min"], [0,800], "highIsGood", s=>{
    if(s>=500) return pct({level:"Normal", desc:"Capacidade funcional preservada.", color:"#16A34A"});
    if(s>=350) return pct({level:"Leve redução", desc:"Capacidade funcional levemente reduzida.", color:"#D97706"});
    if(s>=200) return pct({level:"Redução moderada", desc:"Capacidade funcional moderadamente reduzida.", color:"#DC2626"});
    return pct({level:"Redução grave", desc:"Capacidade funcional severamente reduzida.", color:"#BE185D"});
  }),

  // ════════════════════ URO-GINECOLÓGICA ════════════════════

  "Oxford Grading System (Assoalho Pélvico)": simpleScale("oxfordAP","Oxford",["Oxford Grading","Oxford","PERFECT Oxford"], [0,5], "highIsGood", s=>{
    if(s>=4) return pct({level:"Função preservada", desc:"Boa força do assoalho pélvico.", color:"#16A34A"});
    if(s>=2) return pct({level:"Força moderada", desc:"Contração presente, mas com limitação.", color:"#D97706"});
    if(s<=1) return pct({level:"Força fraca", desc:"Contração ausente ou muito fraca.", color:"#DC2626"});
    return pct({level:"Sem contração", desc:"Ausência de contração detectável.", color:"#BE185D"});
  }),

  "ICIQ-SF (International Consultation on Incontinence)": simpleScale("iciqsf","ICIQ-SF",["ICIQ-SF","International Consultation on Incontinence","ICIQ"], [0,21], "highIsBad", s=>{
    if(s<=5) return pct({level:"Incontinência leve", desc:"Pouco impacto na qualidade de vida.", color:"#16A34A"});
    if(s<=12) return pct({level:"Incontinência moderada", desc:"Impacto moderado na qualidade de vida.", color:"#D97706"});
    return pct({level:"Incontinência grave", desc:"Grande impacto na qualidade de vida.", color:"#DC2626"});
  }),

  "ICIQ-OAB (Overactive Bladder)": simpleScale("iciqoab","ICIQ-OAB",["ICIQ-OAB","Overactive Bladder"], [0,16], "highIsBad", s=>{
    if(s<=5) return pct({level:"Sintomas leves", desc:"Pouco impacto da bexiga hiperativa.", color:"#16A34A"});
    if(s<=10) return pct({level:"Sintomas moderados", desc:"Impacto moderado.", color:"#D97706"});
    return pct({level:"Sintomas graves", desc:"Grande impacto. Tratamento intensivo.", color:"#DC2626"});
  }),

  "PFIQ-7 (Pelvic Floor Impact Questionnaire)": simpleScale("pfiq7","PFIQ-7",["PFIQ-7","Pelvic Floor Impact Questionnaire"], [0,300], "highIsBad", s=>{
    if(s<=50) return pct({level:"Impacto leve", desc:"Pouco impacto na qualidade de vida.", color:"#16A34A"});
    if(s<=150) return pct({level:"Impacto moderado", desc:"Impacto moderado nas AVDs.", color:"#D97706"});
    return pct({level:"Impacto grave", desc:"Grande impacto funcional e social.", color:"#DC2626"});
  }),

  "PISQ-12 (Pelvic Organ Prolapse/Incontinence Sexual Questionnaire)": {
    id:"pisq12", shortName:"PISQ-12", aliases:["PISQ-12","Pelvic Organ Prolapse/Incontinence Sexual Questionnaire"], sections:12, maxPerSection:4, goodDirection:"highIsGood", mcid:10, mdc:6,
    interpret(pct){
      if(pct>=80) return {level:"Função sexual preservada", desc:"Função sexual preservada com mínimo impacto dos sintomas pélvicos.", color:"#16A34A"};
      if(pct>=50) return {level:"Disfunção moderada", desc:"Disfunção sexual moderada. Intervenção indicada.", color:"#D97706"};
      return {level:"Disfunção importante", desc:"Disfunção sexual importante com grande impacto na qualidade de vida.", color:"#DC2626"};
    },
    questions:[
      {id:"pisq1",label:"Com que frequência seu problema pélvico afeta seu desejo sexual?",o:["Sempre","Frequentemente","Às vezes","Raramente","Nunca"]},
      {id:"pisq2",label:"Com que frequência seu problema pélvico dificulta atingir o orgasmo?",o:["Sempre","Frequentemente","Às vezes","Raramente","Nunca"]},
      {id:"pisq3",label:"Com que frequência você evita relações sexuais por causa do seu problema?",o:["Sempre","Frequentemente","Às vezes","Raramente","Nunca"]},
      {id:"pisq4",label:"Com que frequência se sente ansiosa ou deprimida quanto à sua vida sexual?",o:["Sempre","Frequentemente","Às vezes","Raramente","Nunca"]},
      {id:"pisq5",label:"Você sente dor durante a relação sexual?",o:["Sempre","Frequentemente","Às vezes","Raramente","Nunca"]},
      {id:"pisq6",label:"Você perde urina durante a atividade sexual?",o:["Sempre","Frequentemente","Às vezes","Raramente","Nunca"]},
      {id:"pisq7",label:"Evita relações sexuais por medo de perda urinária ou fecal?",o:["Sempre","Frequentemente","Às vezes","Raramente","Nunca"]},
      {id:"pisq8",label:"Sente desconforto vaginal (peso, pressão) durante a relação?",o:["Sempre","Frequentemente","Às vezes","Raramente","Nunca"]},
      {id:"pisq9",label:"Seu problema pélvico limita as posições sexuais?",o:["Sempre","Frequentemente","Às vezes","Raramente","Nunca"]},
      {id:"pisq10",label:"Seu parceiro evita contato sexual devido ao seu problema pélvico?",o:["Sempre","Frequentemente","Às vezes","Raramente","Nunca"]},
      {id:"pisq11",label:"Você evita discutir o problema com seu parceiro?",o:["Sempre","Frequentemente","Às vezes","Raramente","Nunca"]},
      {id:"pisq12",label:"Sente-se menos feminina ou com baixa autoestima sexual?",o:["Sempre","Frequentemente","Às vezes","Raramente","Nunca"]},
    ],
  },

  "UDI-6 (Urogenital Distress Inventory-6)": {
    id:"udi6", shortName:"UDI-6", aliases:["UDI-6","Urogenital Distress Inventory-6"], sections:6, maxPerSection:3, goodDirection:"highIsBad", mcid:15, mdc:10,
    interpret(pct){
      if(pct<=25) return {level:"Leve", desc:"Sintomas urinários leves.", color:"#16A34A"};
      if(pct<=50) return {level:"Moderado", desc:"Sintomas urinários moderados.", color:"#D97706"};
      if(pct<=75) return {level:"Grave", desc:"Sintomas urinários graves.", color:"#DC2626"};
      return {level:"Muito grave", desc:"Sintomas urinários muito graves. Encaminhamento especializado.", color:"#BE185D"};
    },
    questions:[
      {id:"udi1",label:"Frequência urinária (urinar muitas vezes ao dia)",o:["Não incomoda","Incomoda um pouco","Incomoda moderadamente","Incomoda muito"]},
      {id:"udi2",label:"Urgência para urinar (vontade forte e súbita)",o:["Não incomoda","Incomoda um pouco","Incomoda moderadamente","Incomoda muito"]},
      {id:"udi3",label:"Perda de urina ao tossir, espirrar ou fazer esforço",o:["Não incomoda","Incomoda um pouco","Incomoda moderadamente","Incomoda muito"]},
      {id:"udi4",label:"Perda de urina em pequenas quantidades (gotas)",o:["Não incomoda","Incomoda um pouco","Incomoda moderadamente","Incomoda muito"]},
      {id:"udi5",label:"Dificuldade para esvaziar a bexiga",o:["Não incomoda","Incomoda um pouco","Incomoda moderadamente","Incomoda muito"]},
      {id:"udi6",label:"Dor ou desconforto na região da bexiga ou pélvis",o:["Não incomoda","Incomoda um pouco","Incomoda moderadamente","Incomoda muito"]},
    ],
  },

  "OAB-q (Overactive Bladder Questionnaire)": simpleScale("oabq","OAB-q",["OAB-q","Overactive Bladder Questionnaire"], [0,100], "highIsBad", s=>{
    if(s<=25) return pct({level:"Leve", desc:"Sintomas leves de bexiga hiperativa.", color:"#16A34A"});
    if(s<=50) return pct({level:"Moderado", desc:"Sintomas moderados de bexiga hiperativa.", color:"#D97706"});
    if(s<=75) return pct({level:"Grave", desc:"Sintomas graves. Tratamento intensivo indicado.", color:"#DC2626"});
    return pct({level:"Muito grave", desc:"Sintomas muito graves. Grande impacto na qualidade de vida.", color:"#BE185D"});
  }),

  // ════════════════════ GERIATRIA ════════════════════

  "MEEM (Mini-Exame do Estado Mental)": {
    id:"meem", shortName:"MEEM", aliases:["MEEM (MMSE)","MEEM","MMSE","Mini-Exame do Estado Mental","Mini Mental State Examination"], sections:30, maxPerSection:1, mcid:3, mdc:2,
    goodDirection:"highIsGood",
    interpret(pct){
      if(pct>=90) return {level:"Normal", desc:"Função cognitiva preservada.", color:"#16A34A"};
      if(pct>=70) return {level:"Declínio cognitivo leve", desc:"Comprometimento cognitivo leve (CCL).", color:"#D97706"};
      if(pct>=37) return {level:"Declínio cognitivo moderado", desc:"Demência moderada.", color:"#DC2626"};
      return {level:"Declínio cognitivo grave", desc:"Demência avançada.", color:"#BE185D"};
    },
    questions:[
      {id:"meem_t1",label:"Orientação temporal — Que ano é?",o:["Errado","Certo"]},
      {id:"meem_t2",label:"Orientação temporal — Em que estação do ano estamos?",o:["Errado","Certo"]},
      {id:"meem_t3",label:"Orientação temporal — Que dia do mês é hoje?",o:["Errado","Certo"]},
      {id:"meem_t4",label:"Orientação temporal — Em que dia da semana estamos?",o:["Errado","Certo"]},
      {id:"meem_t5",label:"Orientação temporal — Em que mês estamos?",o:["Errado","Certo"]},
      {id:"meem_e1",label:"Orientação espacial — Em que estado estamos?",o:["Errado","Certo"]},
      {id:"meem_e2",label:"Orientação espacial — Em que cidade estamos?",o:["Errado","Certo"]},
      {id:"meem_e3",label:"Orientação espacial — Em que bairro/região estamos?",o:["Errado","Certo"]},
      {id:"meem_e4",label:"Orientação espacial — Em que local específico (hospital/clínica/casa)?",o:["Errado","Certo"]},
      {id:"meem_e5",label:"Orientação espacial — Em que andar/sala estamos?",o:["Errado","Certo"]},
      {id:"meem_r1",label:"Registro — Repetir: CARRO",o:["Errado","Certo"]},
      {id:"meem_r2",label:"Registro — Repetir: VASO",o:["Errado","Certo"]},
      {id:"meem_r3",label:"Registro — Repetir: TIJOLO",o:["Errado","Certo"]},
      {id:"meem_a1",label:"Atenção/Cálculo — 100−7 (93)",o:["Errado","Certo"]},
      {id:"meem_a2",label:"Atenção/Cálculo — 93−7 (86)",o:["Errado","Certo"]},
      {id:"meem_a3",label:"Atenção/Cálculo — 86−7 (79)",o:["Errado","Certo"]},
      {id:"meem_a4",label:"Atenção/Cálculo — 79−7 (72)",o:["Errado","Certo"]},
      {id:"meem_a5",label:"Atenção/Cálculo — 72−7 (65)",o:["Errado","Certo"]},
      {id:"meem_ev1",label:"Evocação — Recordar: CARRO",o:["Errado","Certo"]},
      {id:"meem_ev2",label:"Evocação — Recordar: VASO",o:["Errado","Certo"]},
      {id:"meem_ev3",label:"Evocação — Recordar: TIJOLO",o:["Errado","Certo"]},
      {id:"meem_ln1",label:"Nomeação — Mostrar relógio e perguntar: 'O que é isto?'",o:["Errado","Certo"]},
      {id:"meem_ln2",label:"Nomeação — Mostrar caneta e perguntar: 'O que é isto?'",o:["Errado","Certo"]},
      {id:"meem_lr",label:"Repetição — Repetir: 'NEM AQUI, NEM ALI, NEM LÁ'",o:["Errado","Certo"]},
      {id:"meem_lc1",label:"Comando 3 etapas — Pegar o papel com a mão direita",o:["Errado","Certo"]},
      {id:"meem_lc2",label:"Comando 3 etapas — Dobrar o papel ao meio",o:["Errado","Certo"]},
      {id:"meem_lc3",label:"Comando 3 etapas — Colocar o papel no chão",o:["Errado","Certo"]},
      {id:"meem_ll",label:"Leitura — Ler e executar: 'FECHE OS OLHOS'",o:["Errado","Certo"]},
      {id:"meem_le",label:"Escrita — Escrever uma frase completa (sujeito+verbo+objeto)",o:["Errado","Certo"]},
      {id:"meem_ld",label:"Cópia — Copiar o desenho de dois pentágonos interseccionados",o:["Errado","Certo"]},
    ],
  },

  "GDS-15 (Geriatric Depression Scale)": {
    id:"gds15", shortName:"GDS-15", aliases:["GDS-15","Geriatric Depression Scale","GDS"], sections:15, maxPerSection:1, mcid:3, mdc:2,
    goodDirection:"highIsBad",
    interpret(pct){
      if(pct<=33) return {level:"Normal", desc:"Sintomas depressivos ausentes.", color:"#16A34A"};
      if(pct<=67) return {level:"Depressão leve", desc:"Sintomas depressivos leves.", color:"#D97706"};
      return {level:"Depressão grave", desc:"Sintomas depressivos graves. Encaminhamento psiquiátrico.", color:"#DC2626"};
    },
    questions:[
      {id:"gds_1",label:"Está satisfeito(a) com sua vida?",o:["Sim","Não"]},
      {id:"gds_2",label:"Deixou muitos de seus interesses e atividades?",o:["Não","Sim"]},
      {id:"gds_3",label:"Sente que sua vida está vazia?",o:["Não","Sim"]},
      {id:"gds_4",label:"Fica entediado(a)/aborrecido(a) com frequência?",o:["Não","Sim"]},
      {id:"gds_5",label:"Está de bom humor a maior parte do tempo?",o:["Sim","Não"]},
      {id:"gds_6",label:"Tem medo de que algo ruim lhe aconteça?",o:["Não","Sim"]},
      {id:"gds_7",label:"Sente-se feliz a maior parte do tempo?",o:["Sim","Não"]},
      {id:"gds_8",label:"Sente-se desamparado(a) / sem saída?",o:["Não","Sim"]},
      {id:"gds_9",label:"Prefere ficar em casa a sair e fazer coisas novas?",o:["Não","Sim"]},
      {id:"gds_10",label:"Sente que tem mais problemas de memória que os outros?",o:["Não","Sim"]},
      {id:"gds_11",label:"Acha maravilhoso estar vivo(a)?",o:["Sim","Não"]},
      {id:"gds_12",label:"Sente-se inútil / sem valor do jeito que está agora?",o:["Não","Sim"]},
      {id:"gds_13",label:"Sente-se cheio(a) de energia?",o:["Sim","Não"]},
      {id:"gds_14",label:"Sente que sua situação é sem esperança?",o:["Não","Sim"]},
      {id:"gds_15",label:"Acha que os outros estão melhores que você?",o:["Não","Sim"]},
    ],
  },

  "Katz Index of Independence in ADLs": {
    id:"katz", shortName:"Katz", aliases:["Katz Index","Katz","Katz Index of Independence in ADLs"], sections:6, maxPerSection:1, mcid:1, mdc:0.5,
    goodDirection:"highIsGood",
    calculate(answers){
      const indep = Object.values(answers).filter(v => v === 1).length;
      return {raw:indep, max:6, pct:Math.round(indep/6*100)};
    },
    interpret(pct){
      if(pct>=83) return {level:"Independência funcional", desc:"Função preservada nas AVDs básicas.", color:"#16A34A"};
      if(pct>=33) return {level:"Dependência parcial", desc:"Dependência em 1-4 atividades.", color:"#D97706"};
      return {level:"Dependência grave", desc:"Dependente em 5-6 atividades.", color:"#DC2626"};
    },
    questions:[
      {id:"katz_1",label:"Banho (esponja, chuveiro ou banheira)",o:["Dependente / precisa de ajuda","Independente"]},
      {id:"katz_2",label:"Vestir-se (inclui calçados e amarrar sapatos)",o:["Dependente / precisa de ajuda","Independente"]},
      {id:"katz_3",label:"Higiene pessoal (ir ao banheiro, higiene íntima)",o:["Dependente / precisa de ajuda","Independente"]},
      {id:"katz_4",label:"Transferência (deitar e levantar da cama, sentar e levantar)",o:["Dependente / precisa de ajuda","Independente"]},
      {id:"katz_5",label:"Continência (controle de esfíncteres)",o:["Dependente / precisa de ajuda","Independente"]},
      {id:"katz_6",label:"Alimentação (levar comida do prato à boca)",o:["Dependente / precisa de ajuda","Independente"]},
    ],
  },

  "Lawton Instrumental ADL Scale": {
    id:"lawton", shortName:"Lawton", aliases:["Lawton Scale","Lawton","Lawton Instrumental ADL Scale"], sections:8, maxPerSection:3, mcid:3, mdc:2,
    goodDirection:"highIsGood",
    interpret(pct){
      if(pct>=83) return {level:"Independência funcional", desc:"Função preservada nas AVDs instrumentais.", color:"#16A34A"};
      if(pct>=42) return {level:"Dependência parcial", desc:"Necessita de assistência em atividades instrumentais.", color:"#D97706"};
      return {level:"Dependência grave", desc:"Dependente para atividades instrumentais.", color:"#DC2626"};
    },
    questions:[
      {id:"lawton_1",label:"Uso do telefone",o:["1 — Não usa","2 — Atende, mas não disca / Disca alguns números","3 — Usa por iniciativa própria"]},
      {id:"lawton_2",label:"Fazer compras",o:["1 — Não faz compras","2 — Precisa de acompanhamento","3 — Faz compras sozinho(a)"]},
      {id:"lawton_3",label:"Preparo de alimentos",o:["1 — Não prepara","2 — Aquece e serve refeições","3 — Planeja e prepara refeições completas"]},
      {id:"lawton_4",label:"Tarefas domésticas",o:["1 — Não realiza","2 — Tarefas leves com ajuda","3 — Mantém a casa sozinho(a)"]},
      {id:"lawton_5",label:"Lavanderia / Cuidar da própria roupa",o:["1 — Não lava a própria roupa","2 — Lava pequenas peças","3 — Lava todas as roupas sozinho(a)"]},
      {id:"lawton_6",label:"Uso de transporte",o:["1 — Não utiliza transporte","2 — Utiliza com acompanhamento","3 — Utiliza transporte de forma independente"]},
      {id:"lawton_7",label:"Uso de medicações",o:["1 — Não administra","2 — Toma se preparadas com antecedência","3 — Toma sozinho(a) na dose e horário corretos"]},
      {id:"lawton_8",label:"Manejo de finanças",o:["1 — Não cuida das finanças","2 — Apenas pequenas compras diárias","3 — Gerencia todas as finanças sozinho(a)"]},
    ],
  },

  "Tinetti Performance Oriented Mobility Assessment": {
    id:"tinetti", shortName:"Tinetti", aliases:["Tinetti","POMA","Tinetti Performance Oriented Mobility Assessment"], sections:18, maxPerSection:null, mcid:4, mdc:3,
    goodDirection:"highIsGood",
    calculate(answers){
      const w = {
        t_1:[0,1], t_2:[0,1,2], t_3:[0,1,2], t_4:[0,1,2], t_5:[0,1,2], t_6:[0,1,2], t_7:[0,1],
        t_8a:[0,1], t_8b:[0,1], t_9:[0,1,2],
        t_10:[0,1], t_11a:[0,1,2], t_11b:[0,1,2], t_12:[0,1], t_13:[0,1,2], t_14:[0,1,2], t_15:[0,1,2], t_16:[0,1],
      };
      const maxw = {t_1:1,t_2:2,t_3:2,t_4:2,t_5:2,t_6:2,t_7:1,t_8a:1,t_8b:1,t_9:2,t_10:1,t_11a:2,t_11b:2,t_12:1,t_13:2,t_14:2,t_15:2,t_16:1};
      let sum=0, max=0;
      for(const [k,arr] of Object.entries(w)){
        const idx = Number(answers[k]);
        if(!isNaN(idx) && arr[idx]!==undefined) sum+=arr[idx];
        max+=maxw[k]||1;
      }
      return {raw:sum, max:28, pct:Math.round(sum/28*100)};
    },
    interpret(pct){
      if(pct>=89) return {level:"Baixo risco de queda", desc:"Mobilidade e equilíbrio preservados.", color:"#16A34A"};
      if(pct>=68) return {level:"Risco moderado de queda", desc:"Alterações de equilíbrio/marcha.", color:"#D97706"};
      return {level:"Alto risco de queda", desc:"Equilíbrio e marcha severamente comprometidos.", color:"#DC2626"};
    },
    questions:[
      // ── Equilíbrio (9 itens, máx 16) ──
      {id:"t_1",label:"1 — Equilíbrio sentado",o:["0 — Inclina-se / desliza da cadeira","1 — Estável, seguro"]},
      {id:"t_2",label:"2 — Levantar da cadeira",o:["0 — Incapaz sem ajuda","1 — Capaz, mas usa os braços","2 — Capaz sem usar os braços"]},
      {id:"t_3",label:"3 — Tentativas de levantar",o:["0 — Incapaz sem ajuda","1 — >1 tentativa","2 — 1 tentativa"]},
      {id:"t_4",label:"4 — Equilíbrio imediato (primeiros 5 segundos)",o:["0 — Instável (cambaleia, move os pés)","1 — Estável, mas usa suporte","2 — Estável sem suporte"]},
      {id:"t_5",label:"5 — Equilíbrio em pé (pés juntos)",o:["0 — Instável","1 — Estável, mas base alargada (>10cm)","2 — Pés juntos, estável"]},
      {id:"t_6",label:"6 — Teste do empurrão (3× no esterno, pés juntos)",o:["0 — Cai ou precisa de apoio","1 — Cambaleia, agarra, mas mantém","2 — Estável, não se desequilibra"]},
      {id:"t_7",label:"7 — Olhos fechados (pés juntos)",o:["0 — Instável / cai","1 — Estável"]},
      {id:"t_8a",label:"8a — Giro 360° — Passos contínuos",o:["0 — Passos descontínuos / interrompidos","1 — Passos contínuos e fluidos"]},
      {id:"t_8b",label:"8b — Giro 360° — Estabilidade",o:["0 — Instável (cambaleia, agarra)","1 — Estável durante todo o giro"]},
      {id:"t_9",label:"9 — Sentar-se",o:["0 — Inseguro (erra distância, cai)","1 — Usa os braços ou movimento brusco","2 — Movimento suave e controlado"]},
      // ── Marcha (7 itens, máx 12) ──
      {id:"t_10",label:"10 — Início da marcha",o:["0 — Hesitação, múltiplas tentativas","1 — Inicia sem hesitação"]},
      {id:"t_11a",label:"11a — Altura do passo — Pé direito",o:["0 — Não eleva o pé do chão","1 — Passa o pé D pelo tornozelo E","2 — Eleva completamente o pé do chão"]},
      {id:"t_11b",label:"11b — Altura do passo — Pé esquerdo",o:["0 — Não eleva o pé do chão","1 — Passa o pé E pelo tornozelo D","2 — Eleva completamente o pé do chão"]},
      {id:"t_12",label:"12 — Simetria dos passos",o:["0 — Comprimento dos passos desigual","1 — Comprimento dos passos simétrico"]},
      {id:"t_13",label:"13 — Continuidade dos passos",o:["0 — Passos interrompidos / paradas frequentes","1 — Passos hesitantes, mas sem parar","2 — Passos contínuos, sem interrupção"]},
      {id:"t_14",label:"14 — Trajetória (caminha 3m em linha reta)",o:["0 — Desvio marcado da linha","1 — Desvio leve com uso de apoio","2 — Linha reta sem auxílio"]},
      {id:"t_15",label:"15 — Tronco",o:["0 — Balanço acentuado ou uso de apoio","1 — Flexão de joelhos/dorso ou abertura de braços","2 — Ereta, sem balanço ou flexão"]},
      {id:"t_16",label:"16 — Base de apoio durante a marcha",o:["0 — Calcanhares afastados ao caminhar","1 — Calcanhares quase se tocando ao caminhar"]},
    ],
  },

  "FES-I (Falls Efficacy Scale)": {
    id:"fesi", shortName:"FES-I", aliases:["FES-I","Falls Efficacy Scale"], sections:16, maxPerSection:4, mcid:5, mdc:3,
    goodDirection:"highIsBad",
    interpret(pct){
      if(pct<=30) return {level:"Baixa preocupação", desc:"Pouco medo de cair.", color:"#16A34A"};
      if(pct<=43) return {level:"Preocupação moderada", desc:"Medo moderado de cair.", color:"#D97706"};
      return {level:"Alta preocupação", desc:"Medo intenso de cair. Risco de restrição de atividades.", color:"#DC2626"};
    },
    questions:[
      {id:"fesi_1",label:"Limpar a casa (varrer, aspirar)",o:["Nem um pouco preocupado","Um pouco preocupado","Moderadamente preocupado","Muito preocupado"]},
      {id:"fesi_2",label:"Vestir-se ou despir-se",o:["Nem um pouco preocupado","Um pouco preocupado","Moderadamente preocupado","Muito preocupado"]},
      {id:"fesi_3",label:"Preparar refeições simples",o:["Nem um pouco preocupado","Um pouco preocupado","Moderadamente preocupado","Muito preocupado"]},
      {id:"fesi_4",label:"Tomar banho",o:["Nem um pouco preocupado","Um pouco preocupado","Moderadamente preocupado","Muito preocupado"]},
      {id:"fesi_5",label:"Ir às compras",o:["Nem um pouco preocupado","Um pouco preocupado","Moderadamente preocupado","Muito preocupado"]},
      {id:"fesi_6",label:"Sentar-se ou levantar-se da cadeira",o:["Nem um pouco preocupado","Um pouco preocupado","Moderadamente preocupado","Muito preocupado"]},
      {id:"fesi_7",label:"Subir ou descer escadas",o:["Nem um pouco preocupado","Um pouco preocupado","Moderadamente preocupado","Muito preocupado"]},
      {id:"fesi_8",label:"Caminhar pela vizinhança / fora de casa",o:["Nem um pouco preocupado","Um pouco preocupado","Moderadamente preocupado","Muito preocupado"]},
      {id:"fesi_9",label:"Alcançar algo acima da cabeça ou no chão",o:["Nem um pouco preocupado","Um pouco preocupado","Moderadamente preocupado","Muito preocupado"]},
      {id:"fesi_10",label:"Atender o telefone antes que pare de tocar",o:["Nem um pouco preocupado","Um pouco preocupado","Moderadamente preocupado","Muito preocupado"]},
      {id:"fesi_11",label:"Andar em superfície escorregadia (molhada, encerada)",o:["Nem um pouco preocupado","Um pouco preocupado","Moderadamente preocupado","Muito preocupado"]},
      {id:"fesi_12",label:"Visitar um amigo ou parente",o:["Nem um pouco preocupado","Um pouco preocupado","Moderadamente preocupado","Muito preocupado"]},
      {id:"fesi_13",label:"Andar em local com aglomeração de pessoas",o:["Nem um pouco preocupado","Um pouco preocupado","Moderadamente preocupado","Muito preocupado"]},
      {id:"fesi_14",label:"Caminhar em superfície irregular (calçada, grama)",o:["Nem um pouco preocupado","Um pouco preocupado","Moderadamente preocupado","Muito preocupado"]},
      {id:"fesi_15",label:"Subir ou descer uma rampa/ladeira",o:["Nem um pouco preocupado","Um pouco preocupado","Moderadamente preocupado","Muito preocupado"]},
      {id:"fesi_16",label:"Sair para evento social (igreja, reunião)",o:["Nem um pouco preocupado","Um pouco preocupado","Moderadamente preocupado","Muito preocupado"]},
    ],
  },

  "MNA (Mini Nutritional Assessment)": {
    id:"mna", shortName:"MNA", aliases:["MNA","Mini Nutritional Assessment"], sections:18, maxPerSection:null, mcid:4, mdc:3,
    goodDirection:"highIsGood",
    calculate(answers){
      const weights = {
        mna_a:[0,1,2], mna_b:[0,1,2,3], mna_c:[0,1,2], mna_d:[0,2], mna_e:[0,1,2], mna_f:[0,1,2,3],
        mna_g:[0,1], mna_h:[0,1], mna_i:[0,1], mna_j:[0,1,2], mna_k:[0,0.5,1], mna_l:[0,1],
        mna_m:[0,0.5,1], mna_n:[0,1,2], mna_o:[0,1,2], mna_p:[0,0.5,1,2], mna_q:[0,0.5,1], mna_r:[0,1],
      };
      let sum = 0;
      for(const [k, w] of Object.entries(weights)) {
        const idx = Number(answers[k]);
        if(!isNaN(idx) && w[idx] !== undefined) sum += w[idx];
      }
      return {raw:sum, max:30, pct:Math.round(sum/30*100)};
    },
    interpret(pct){
      if(pct>=80) return {level:"Estado nutricional normal", desc:"Boa nutrição.", color:"#16A34A"};
      if(pct>=57) return {level:"Risco de desnutrição", desc:"Risco nutricional. Monitoramento e intervenção.", color:"#D97706"};
      return {level:"Desnutrido", desc:"Desnutrição estabelecida. Intervenção nutricional urgente.", color:"#DC2626"};
    },
    questions:[
      // ── Triagem (6 itens, máx 14 pontos) ──
      {id:"mna_a",label:"A — Ingestão alimentar nos últimos 3 meses",o:["0 — Diminuição grave","1 — Diminuição moderada","2 — Sem diminuição"]},
      {id:"mna_b",label:"B — Perda de peso nos últimos 3 meses",o:["0 — >3 kg","1 — Não sabe","2 — 1-3 kg","3 — Sem perda"]},
      {id:"mna_c",label:"C — Mobilidade",o:["0 — Restrito ao leito/cadeira","1 — Deambula no domicílio","2 — Sai do domicílio"]},
      {id:"mna_d",label:"D — Doença aguda / estresse psicológico nos últimos 3 meses?",o:["0 — Sim","2 — Não"]},
      {id:"mna_e",label:"E — Problemas neuropsicológicos (demência/depressão)",o:["0 — Demência/depressão grave","1 — Demência/depressão leve","2 — Sem problemas"]},
      {id:"mna_f",label:"F — IMC (kg/m²)",o:["0 — <19","1 — 19 a <21","2 — 21 a <23","3 — ≥23"]},
      // ── Avaliação (12 itens, máx 16 pontos) ──
      {id:"mna_g",label:"G — Vive em domicílio próprio (não institucionalizado)?",o:["0 — Não","1 — Sim"]},
      {id:"mna_h",label:"H — Utiliza >3 medicamentos/dia?",o:["0 — Sim","1 — Não"]},
      {id:"mna_i",label:"I — Úlceras/lesões de pele por pressão?",o:["0 — Sim","1 — Não"]},
      {id:"mna_j",label:"J — Quantas refeições completas faz por dia?",o:["0 — 1 refeição","1 — 2 refeições","2 — 3 refeições"]},
      {id:"mna_k",label:"K — Consome proteínas? (≥1: laticínios/ovos/legumes/carne/peixe/aves)",o:["0 — Nenhuma","0.5 — Sim (1-2 fontes)","1 — Sim (≥3 fontes)"]},
      {id:"mna_l",label:"L — Consome ≥2 porções de frutas/vegetais/dia?",o:["0 — Não","1 — Sim"]},
      {id:"mna_m",label:"M — Ingestão hídrica/dia (água, suco, café, leite...)",o:["0 — <3 copos","0.5 — 3-5 copos","1 — >5 copos"]},
      {id:"mna_n",label:"N — Modo de alimentação",o:["0 — Necessita de ajuda","1 — Alimenta-se sozinho, com dificuldade","2 — Alimenta-se sozinho sem dificuldade"]},
      {id:"mna_o",label:"O — O paciente acredita ter problema nutricional?",o:["0 — Acredita estar desnutrido","1 — Incerteza","2 — Acredita não ter problema"]},
      {id:"mna_p",label:"P — Estado de saúde comparado a outros da mesma idade?",o:["0 — Pior","0.5 — Não sabe","1 — Igual","2 — Melhor"]},
      {id:"mna_q",label:"Q — Circunferência do braço (cm)",o:["0 — <21 cm","1 — ≥21 cm"]},
      {id:"mna_r",label:"R — Circunferência da panturrilha (cm)",o:["0 — <31 cm","1 — ≥31 cm"]},
    ],
  },

  "SPPB (Short Physical Performance Battery)": {
    id:"sppb", shortName:"SPPB", aliases:["SPPB","Short Physical Performance Battery","Short Physical Performance Battery (SPPB)"], sections:3, maxPerSection:4, mcid:2, mdc:1.3,
    goodDirection:"highIsGood",
    calculate(answers){
      const sum = Object.values(answers).reduce((t,v)=>t+(Number(v)||0),0);
      return {raw:sum, max:12, pct:Math.round(sum/12*100)};
    },
    interpret(pct){
      if(pct>=83) return {level:"Bom desempenho", desc:"Desempenho físico preservado.", color:"#16A34A"};
      if(pct>=58) return {level:"Desempenho moderado", desc:"Limitação física leve.", color:"#D97706"};
      if(pct>=33) return {level:"Desempenho baixo", desc:"Limitação física importante.", color:"#F87171"};
      return {level:"Desempenho muito baixo", desc:"Limitação física severa. Risco de fragilidade.", color:"#BE185D"};
    },
    questions:[
      {id:"sppb_balance",label:"Equilíbrio (side-by-side + semi-tandem + tandem)",o:["0 — Incapaz","1 — Mantém <10s","2 — Mantém parcialmente","3 — Mantém com dificuldade","4 — Mantém 10s em cada"]},
      {id:"sppb_gait",label:"Velocidade de marcha (4m)",o:["0 — Incapaz","1 — >8,7s","2 — 6,21-8,70s","3 — 4,82-6,20s","4 — <4,82s"]},
      {id:"sppb_chair",label:"Levantar da cadeira (5x)",o:["0 — Incapaz","1 — >16,7s","2 — 13,70-16,69s","3 — 11,20-13,69s","4 — <11,19s"]},
    ],
  },

  "Clinical Frailty Scale (CFS)": simpleScale("cfs","CFS",["Clinical Frailty Scale","CFS"], [1,9], "highIsBad", s=>{
    if(s<=3) return pct({level:"Em forma", desc:"Boa condição física.", color:"#16A34A"});
    if(s===4) return pct({level:"Vulnerável", desc:"Sinais iniciais de vulnerabilidade.", color:"#D97706"});
    if(s===5) return pct({level:"Levemente frágil", desc:"Dependência parcial em AVD instrumentais.", color:"#F59E0B"});
    if(s<=7) return pct({level:"Moderadamente frágil", desc:"Dependência em AVDs.", color:"#DC2626"});
    return pct({level:"Severamente frágil", desc:"Dependência total. Risco de desfechos adversos.", color:"#BE185D"});
  }),

  // ════════════════════ DERMATOFUNCIONAL ════════════════════

  "Vancouver Scar Scale (VSS)": simpleScale("vancouver","VSS",["Vancouver Scar Scale","VSS","Vancouver"], [0,13], "highIsBad", s=>{
    if(s<=4) return pct({level:"Cicatriz leve", desc:"Boa qualidade cicatricial.", color:"#16A34A"});
    if(s<=8) return pct({level:"Cicatriz moderada", desc:"Alterações moderadas da cicatriz.", color:"#D97706"});
    return pct({level:"Cicatriz grave", desc:"Cicatriz hipertrófica/contratura significativa.", color:"#DC2626"});
  }),

  "POSAS (Patient and Observer Scar Assessment Scale)": simpleScale("posas","POSAS",["POSAS","Patient and Observer Scar Assessment Scale"], [6,60], "highIsBad", s=>{
    if(s<=15) return pct({level:"Cicatriz leve", desc:"Boa aparência da cicatriz.", color:"#16A34A"});
    if(s<=35) return pct({level:"Cicatriz moderada", desc:"Alterações moderadas.", color:"#D97706"});
    return pct({level:"Cicatriz grave", desc:"Cicatriz com alterações importantes.", color:"#DC2626"});
  }),

  "LEFS (Lower Extremity Functional Scale)": simpleScale("lefs","LEFS",["LEFS","Lower Extremity Functional Scale"], [0,80], "highIsGood", s=>{
    if(s>=64) return pct({level:"Função preservada", desc:"Boa função de MMII.", color:"#16A34A"});
    if(s>=40) return pct({level:"Limitação moderada", desc:"Limitação funcional parcial de MMII.", color:"#D97706"});
    if(s>=20) return pct({level:"Limitação grave", desc:"Comprometimento funcional importante.", color:"#DC2626"});
    return pct({level:"Limitação severa", desc:"Função de MMII severamente comprometida.", color:"#BE185D"});
  }),

  "DLQI (Dermatology Life Quality Index)": {
    id:"dlqi", shortName:"DLQI", aliases:["DLQI","Dermatology Life Quality Index"],
    sections:10, maxPerSection:3, mcid:5, mdc:3,
    interpret(pct){
      if(pct<=16) return {level:"Pequeno efeito", desc:"Impacto mínimo na qualidade de vida.", color:"#16A34A"};
      if(pct<=33) return {level:"Efeito moderado", desc:"Impacto moderado na qualidade de vida.", color:"#D97706"};
      if(pct<=50) return {level:"Efeito importante", desc:"Impacto importante na qualidade de vida.", color:"#DC2626"};
      return {level:"Efeito muito importante", desc:"Impacto muito importante na qualidade de vida.", color:"#BE185D"};
    },
    questions:[
      {id:"dlqi_1",label:"Sintomas e sensações (coceira, dor, ardência)",o:["Nada","Um pouco","Muito","Extremamente"]},
      {id:"dlqi_2",label:"Vergonha ou constrangimento",o:["Nada","Um pouco","Muito","Extremamente"]},
      {id:"dlqi_3",label:"Compras e cuidados com a casa",o:["Nada","Um pouco","Muito","Extremamente"]},
      {id:"dlqi_4",label:"Vestuário e escolha de roupas",o:["Nada","Um pouco","Muito","Extremamente"]},
      {id:"dlqi_5",label:"Vida social e lazer",o:["Nada","Um pouco","Muito","Extremamente"]},
      {id:"dlqi_6",label:"Esporte e atividades físicas",o:["Nada","Um pouco","Muito","Extremamente"]},
      {id:"dlqi_7",label:"Trabalho e estudo",o:["Nada","Um pouco","Muito","Extremamente"]},
      {id:"dlqi_8",label:"Relacionamentos (parceiro, amigos, parentes)",o:["Nada","Um pouco","Muito","Extremamente"]},
      {id:"dlqi_9",label:"Dificuldades sexuais",o:["Nada","Um pouco","Muito","Extremamente"]},
      {id:"dlqi_10",label:"Tratamento e cuidados com a pele",o:["Nada","Um pouco","Muito","Extremamente"]},
    ],
  },

  "Patient-Specific Functional Scale (PSFS)": simpleScale("psfs","PSFS",["PSFS","Patient-Specific Functional Scale"], [0,10], "highIsGood", s=>{
    if(s>=8) return pct({level:"Função excelente", desc:"Capaz de realizar atividades sem limitações.", color:"#16A34A"});
    if(s>=6) return pct({level:"Boa função", desc:"Capaz de realizar a maioria das atividades.", color:"#22C55E"});
    if(s>=4) return pct({level:"Limitação moderada", desc:"Dificuldade em algumas atividades.", color:"#D97706"});
    return pct({level:"Limitação grave", desc:"Dificuldade significativa nas atividades.", color:"#DC2626"});
  }),

  // ════════════════════ REUMATOLÓGICA ════════════════════

  "BASDAI (Bath Ankylosing Spondylitis Disease Activity Index)": simpleScale("basdai","BASDAI",["BASDAI","Bath Ankylosing Spondylitis Disease Activity Index"], [0,10], "highIsBad", s=>{
    if(s<=3) return pct({level:"Baixa atividade", desc:"Doença controlada.", color:"#16A34A"});
    if(s<=6) return pct({level:"Atividade moderada", desc:"Atividade inflamatória moderada.", color:"#D97706"});
    return pct({level:"Alta atividade", desc:"Atividade inflamatória intensa. Ajuste terapêutico.", color:"#DC2626"});
  }),

  "Tegner Activity Scale": simpleScale("tegner","Tegner",["Tegner Activity Scale","Tegner"], [0,10], "highIsGood", s=>{
    if(s>=9) return pct({level:"Atleta competitivo", desc:"Esporte de alto impacto.", color:"#16A34A"});
    if(s>=6) return pct({level:"Atleta recreacional", desc:"Esporte de médio impacto.", color:"#D97706"});
    if(s>=3) return pct({level:"Atividade leve", desc:"Trabalho leve e caminhada.", color:"#F59E0B"});
    if(s>=1) return pct({level:"Atividade mínima", desc:"AVDs básicas.", color:"#DC2626"});
    return pct({level:"Inativo / Licença médica", desc:"Sem atividade física.", color:"#BE185D"});
  }),

  "Y-Balance Test (SEBT) Composite": simpleScale("ybalance","Y-Balance",["Y-Balance Test","SEBT","Y-Balance"], [0,100], "highIsGood", s=>{
    if(s>=90) return pct({level:"Bom controle", desc:"Equilíbrio dinâmico preservado.", color:"#16A34A"});
    if(s>=80) return pct({level:"Controle moderado", desc:"Limitação leve do equilíbrio.", color:"#D97706"});
    if(s>=70) return pct({level:"Controle reduzido", desc:"Risco de lesão aumentado.", color:"#DC2626"});
    return pct({level:"Controle insuficiente", desc:"Déficit importante. Reabilitação de equilíbrio.", color:"#BE185D"});
  }),

  // ════════════════════ ONCOLOGIA ════════════════════

  "ECOG Performance Status": simpleScale("ecog","ECOG",["ECOG","ECOG Performance Status","Eastern Cooperative Oncology Group"], [0,5], "highIsBad", s=>{
    if(s<=0) return pct({level:"Atividade completa", desc:"Totalmente ativo sem restrições.", color:"#16A34A"});
    if(s<=1) return pct({level:"Restrição leve", desc:"Ativo, mas limitação para atividades físicas intensas.", color:"#D97706"});
    if(s<=2) return pct({level:"Restrição moderada", desc:"Capaz de autocuidado, incapaz para trabalho.", color:"#F59E0B"});
    if(s<=3) return pct({level:"Restrição grave", desc:"Autocuidado limitado. No leito >50% do dia.", color:"#DC2626"});
    if(s<=4) return pct({level:"Incapacidade total", desc:"Totalmente restrito ao leito.", color:"#BE185D"});
    return pct({level:"Óbito", desc:"Paciente falecido.", color:"#7C3AED"});
  }),

  "Karnofsky Performance Status (KPS)": simpleScale("kps","KPS",["KPS","Karnofsky Performance Status","Karnofsky"], [0,100], "highIsGood", s=>{
    if(s>=80) return pct({level:"Ativo / Independente", desc:"Capaz de atividades normais.", color:"#16A34A"});
    if(s>=50) return pct({level:"Incapaz para trabalho", desc:"Requer assistência ocasional.", color:"#D97706"});
    if(s>=30) return pct({level:"Incapaz para autocuidado", desc:"Requer hospitalização.", color:"#DC2626"});
    return pct({level:"Gravemente incapacitado", desc:"Cuidados intensivos.", color:"#BE185D"});
  }),

  "ESAS (Edmonton Symptom Assessment System)": simpleScale("esas","ESAS",["ESAS","Edmonton Symptom Assessment System"], [0,90], "highIsBad", s=>{
    if(s<=20) return pct({level:"Sintomas controlados", desc:"Bom controle sintomático.", color:"#16A34A"});
    if(s<=45) return pct({level:"Sintomas moderados", desc:"Controle sintomático moderado.", color:"#D97706"});
    if(s<=65) return pct({level:"Sintomas graves", desc:"Controle sintomático insuficiente.", color:"#DC2626"});
    return pct({level:"Sintomas muito graves", desc:"Necessidade de cuidados paliativos intensivos.", color:"#BE185D"});
  }),

  "DN4 (Douleur Neuropathique 4)": simpleScale("dn4","DN4",["DN4","Douleur Neuropathique 4","Neuropathic Pain"], [0,10], "highIsBad", s=>{
    if(s<=3) return pct({level:"Dor provavelmente nociceptiva", desc:"Baixa probabilidade de componente neuropático.", color:"#16A34A"});
    if(s<=5) return pct({level:"Possível componente neuropático", desc:"Sugestivo de dor mista.", color:"#D97706"});
    return pct({level:"Dor predominantemente neuropática", desc:"Alta probabilidade de componente neuropático. Farmacoterapia específica.", color:"#DC2626"});
  }),

  "FACT-F (Functional Assessment of Cancer Therapy - Fatigue)": simpleScale("factf","FACT-F",["FACT-F","Functional Assessment of Cancer Therapy - Fatigue"], [0,52], "highIsGood", s=>{
    if(s>=40) return pct({level:"Fadiga leve / controlada", desc:"Boa energia para atividades diárias.", color:"#16A34A"});
    if(s>=25) return pct({level:"Fadiga moderada", desc:"Fadiga com impacto parcial nas AVDs.", color:"#D97706"});
    return pct({level:"Fadiga grave", desc:"Fadiga intensa. Intervenção para conservação de energia.", color:"#DC2626"});
  }),

  "PALLIA-10": simpleScale("pallia10","PALLIA-10",["PALLIA-10","Pallia-10"], [0,30], "highIsBad", s=>{
    if(s<=10) return pct({level:"Cuidados paliativos básicos", desc:"Complexidade baixa.", color:"#16A34A"});
    if(s<=20) return pct({level:"CP moderadamente complexos", desc:"Complexidade moderada. Equipe especializada.", color:"#D97706"});
    return pct({level:"CP altamente complexos", desc:"Alta complexidade. Cuidados paliativos exclusivos.", color:"#DC2626"});
  }),

  "Brief Pain Inventory (BPI)": {
    id:"bpi", shortName:"BPI", aliases:["BPI","Brief Pain Inventory","Brief Pain Inventory (BPI)"],
    sections:11, maxPerSection:10, goodDirection:"highIsBad", mcid:2, mdc:1.3,
    calculate(answers){
      const sev = ["pain_worst","pain_least","pain_avg","pain_now"];
      const interf = ["pain_interf_general","pain_interf_mood","pain_interf_walk","pain_interf_work","pain_interf_relations","pain_interf_sleep","pain_interf_enjoy"];
      const all = [...sev, ...interf];
      const s = ks => ks.reduce((t,k) => t + (Number(answers[k])||0), 0);
      const total = s(all);
      const max = all.length * 10;
      return {raw:total, pct:Math.round((total/max)*100), max, severityAvg:Number((s(sev)/sev.length).toFixed(1)), interferenceAvg:Number((s(interf)/interf.length).toFixed(1))};
    },
    interpret(pct){
      if(pct<=30) return {level:"Leve", desc:"Intensidade e interferência leves. Intervenção analgésica básica.", color:"#16A34A"};
      if(pct<=60) return {level:"Moderada", desc:"Intensidade moderada. Abordagem multimodal.", color:"#D97706"};
      return {level:"Grave", desc:"Intensidade elevada. Controle álgico intensivo.", color:"#DC2626"};
    },
    questions:[
      {id:"pain_worst",label:"Pior dor nas últimas 24h",o:["0","1","2","3","4","5","6","7","8","9","10"]},
      {id:"pain_least",label:"Dor mais fraca nas últimas 24h",o:["0","1","2","3","4","5","6","7","8","9","10"]},
      {id:"pain_avg",label:"Dor em média",o:["0","1","2","3","4","5","6","7","8","9","10"]},
      {id:"pain_now",label:"Dor neste momento",o:["0","1","2","3","4","5","6","7","8","9","10"]},
      {id:"pain_interf_general",label:"Interferência: Atividade geral",o:["0","1","2","3","4","5","6","7","8","9","10"]},
      {id:"pain_interf_mood",label:"Interferência: Humor",o:["0","1","2","3","4","5","6","7","8","9","10"]},
      {id:"pain_interf_walk",label:"Interferência: Caminhar",o:["0","1","2","3","4","5","6","7","8","9","10"]},
      {id:"pain_interf_work",label:"Interferência: Trabalho",o:["0","1","2","3","4","5","6","7","8","9","10"]},
      {id:"pain_interf_relations",label:"Interferência: Relacionamentos",o:["0","1","2","3","4","5","6","7","8","9","10"]},
      {id:"pain_interf_sleep",label:"Interferência: Sono",o:["0","1","2","3","4","5","6","7","8","9","10"]},
      {id:"pain_interf_enjoy",label:"Interferência: Prazer de viver",o:["0","1","2","3","4","5","6","7","8","9","10"]},
    ],
  },

  "Distress Thermometer": simpleScale("distress","Distress",["Distress Thermometer"], [0,10], "highIsBad", s=>{
    if(s<=3) return pct({level:"Baixo", desc:"Sofrimento emocional baixo. Suporte básico.", color:"#16A34A"});
    if(s<=6) return pct({level:"Moderado", desc:"Sofrimento moderado. Avaliação psicossocial.", color:"#D97706"});
    if(s<=8) return pct({level:"Alto", desc:"Sofrimento elevado. Encaminhamento para psico-oncologia.", color:"#DC2626"});
    return pct({level:"Muito alto", desc:"Sofrimento muito elevado. Intervenção urgente.", color:"#BE185D"});
  }),

  // ════════════════════ REUMATOLÓGICA (cont.) ════════════════════

  "BASFI (Bath Ankylosing Spondylitis Functional Index)": {
    id:"basfi", shortName:"BASFI", aliases:["BASFI","Bath Ankylosing Spondylitis Functional Index"], sections:10, maxPerSection:10, mcid:7, mdc:5,
    goodDirection:"highIsBad",
    interpret(pct){
      if(pct<=30) return {level:"Boa função", desc:"Função preservada. Independência nas AVDs.", color:"#16A34A"};
      if(pct<=60) return {level:"Limitação moderada", desc:"Comprometimento funcional parcial.", color:"#D97706"};
      return {level:"Limitação grave", desc:"Comprometimento funcional importante.", color:"#DC2626"};
    },
    questions:[
      {id:"basfi_meias",label:"Vestir meias ou meia-calça sem ajuda",o:["0 - Fácil","1","2","3","4","5","6","7","8","9","10 - Impossível"]},
      {id:"basfi_caneta",label:"Curvar-se para pegar caneta do chão",o:["0 - Fácil","1","2","3","4","5","6","7","8","9","10 - Impossível"]},
      {id:"basfi_prateleira",label:"Alcançar prateleira alta sem ajuda",o:["0 - Fácil","1","2","3","4","5","6","7","8","9","10 - Impossível"]},
      {id:"basfi_cadeira",label:"Levantar de cadeira sem usar os braços",o:["0 - Fácil","1","2","3","4","5","6","7","8","9","10 - Impossível"]},
      {id:"basfi_chao",label:"Levantar-se do chão (decúbito dorsal)",o:["0 - Fácil","1","2","3","4","5","6","7","8","9","10 - Impossível"]},
      {id:"basfi_pe",label:"Ficar em pé sem apoio por 10 minutos",o:["0 - Fácil","1","2","3","4","5","6","7","8","9","10 - Impossível"]},
      {id:"basfi_escada",label:"Subir 12-15 degraus sem corrimão",o:["0 - Fácil","1","2","3","4","5","6","7","8","9","10 - Impossível"]},
      {id:"basfi_ombro",label:"Olhar sobre o ombro sem girar o corpo",o:["0 - Fácil","1","2","3","4","5","6","7","8","9","10 - Impossível"]},
      {id:"basfi_atividade",label:"Realizar atividade física (exercícios, jardinagem)",o:["0 - Fácil","1","2","3","4","5","6","7","8","9","10 - Impossível"]},
      {id:"basfi_tarefas",label:"Realizar tarefas domésticas dia inteiro",o:["0 - Fácil","1","2","3","4","5","6","7","8","9","10 - Impossível"]},
    ],
  },

  "SDAI (Simplified Disease Activity Index)": simpleScale("sdai","SDAI",["SDAI","Simplified Disease Activity Index"], [0,126], "highIsBad", s=>{
    if(s<=3.3) return pct({level:"Remissão", desc:"Doença em remissão clínica.", color:"#16A34A"});
    if(s<=11) return pct({level:"Baixa atividade", desc:"Baixa atividade de doença.", color:"#D97706"});
    if(s<=26) return pct({level:"Atividade moderada", desc:"Atividade moderada de doença.", color:"#F59E0B"});
    return pct({level:"Alta atividade", desc:"Alta atividade de doença. Ajuste terapêutico.", color:"#DC2626"});
  }),

  "CDAI (Clinical Disease Activity Index)": simpleScale("cdai","CDAI",["CDAI","Clinical Disease Activity Index"], [0,76], "highIsBad", s=>{
    if(s<=2.8) return pct({level:"Remissão", desc:"Doença em remissão clínica.", color:"#16A34A"});
    if(s<=10) return pct({level:"Baixa atividade", desc:"Baixa atividade de doença.", color:"#D97706"});
    if(s<=22) return pct({level:"Atividade moderada", desc:"Atividade moderada de doença.", color:"#F59E0B"});
    return pct({level:"Alta atividade", desc:"Alta atividade de doença. Ajuste terapêutico.", color:"#DC2626"});
  }),

  // ════════════════════ ESPORTIVA ════════════════════

  "Return to Sport Criteria (RTS)": simpleScale("rts","RTS",["Return to Sport Criteria","RTS","Return to Sport"], [0,100], "highIsGood", s=>{
    if(s>=90) return pct({level:"Pronto para retorno", desc:"Critérios satisfeitos. Liberação para RTS.", color:"#16A34A"});
    if(s>=70) return pct({level:"Próximo do retorno", desc:"Parcialmente apto. Última fase de reabilitação.", color:"#D97706"});
    if(s>=50) return pct({level:"Fase intermediária", desc:"Critérios parcialmente atendidos. Continuar reabilitação.", color:"#DC2626"});
    return pct({level:"Fase inicial", desc:"Muitos critérios não atendidos. Reabilitação intensiva.", color:"#BE185D"});
  }),

  // ════════════════════ PEDIATRIA — NOVAS ════════════════════

  "GMFM (Gross Motor Function Measure)": simpleScale("gmfm","GMFM",["GMFM","Gross Motor Function Measure","GMFM-88","GMFM-66"], [0,100], "highIsGood", s=>{
    if(s>=90) return pct({level:"Função motora grossa preservada", desc:"Capacidade motora dentro do esperado.", color:"#16A34A"});
    if(s>=60) return pct({level:"Limitação motora leve a moderada", desc:"Capacidade motora reduzida, mas funcional.", color:"#D97706"});
    if(s>=30) return pct({level:"Limitação motora grave", desc:"Comprometimento motor importante.", color:"#DC2626"});
    return pct({level:"Limitação motora severa", desc:"Função motora grossa severamente comprometida.", color:"#BE185D"});
  }),

  "MACS (Manual Ability Classification System)": simpleScale("macs","MACS",["MACS","Manual Ability Classification System"], [1,5], "highIsBad", s=>{
    if(s<=1) return pct({level:"Nível I — Manipula objetos facilmente", desc:"Boa habilidade manual.", color:"#16A34A"});
    if(s<=2) return pct({level:"Nível II — Manipula com qualidade reduzida", desc:"Limitação leve na destreza.", color:"#D97706"});
    if(s<=3) return pct({level:"Nível III — Dificuldade para manipular", desc:"Necessita adaptações.", color:"#F59E0B"});
    if(s<=4) return pct({level:"Nível IV — Manipula objetos simples", desc:"Limitação manual importante.", color:"#DC2626"});
    return pct({level:"Nível V — Não manipula objetos", desc:"Habilidade manual severamente limitada.", color:"#BE185D"});
  }),

  "MABC-2 (Motor Assessment Battery for Children)": simpleScale("mabc2","MABC-2",["MABC-2","Motor Assessment Battery for Children"], [0,100], "highIsGood", s=>{
    if(s>=85) return pct({level:"Desempenho motor normal", desc:"Dentro do esperado para a idade.", color:"#16A34A"});
    if(s>=70) return pct({level:"Risco de dificuldade motora", desc:"Abaixo da média. Monitorar.", color:"#D97706"});
    if(s>=56) return pct({level:"Dificuldade motora significativa", desc:"Desempenho motor abaixo do esperado.", color:"#DC2626"});
    return pct({level:"Dificuldade motora grave", desc:"Desempenho motor muito abaixo.", color:"#BE185D"});
  }),

  "FAC (Functional Ambulation Categories)": simpleScale("fac","FAC",["FAC","Functional Ambulation Categories"], [0,5], "highIsGood", s=>{
    if(s>=5) return pct({level:"Nível 5 — Deambulador independente", desc:"Marcha independente em qualquer superfície.", color:"#16A34A"});
    if(s>=4) return pct({level:"Nível 4 — Deambulador em terreno plano", desc:"Marcha independente apenas em superfície plana.", color:"#D97706"});
    if(s>=3) return pct({level:"Nível 3 — Deambulador com supervisão", desc:"Marcha com supervisão.", color:"#F59E0B"});
    if(s>=2) return pct({level:"Nível 2 — Deambulador com suporte", desc:"Marcha com assistência de uma pessoa.", color:"#DC2626"});
    if(s>=1) return pct({level:"Nível 1 — Deambulador com ajuda", desc:"Marcha com assistência física de uma pessoa.", color:"#BE185D"});
    return pct({level:"Nível 0 — Não deambulador", desc:"Incapaz de deambular.", color:"#7C3AED"});
  }),

  "Vignos Scale (Muscular Dystrophy)": simpleScale("vignos","Vignos",["Vignos Scale","Vignos","Vignos Muscular Dystrophy"], [1,10], "highIsBad", s=>{
    if(s<=2) return pct({level:"Deambulador independente", desc:"Marcha preservada. Sobe escadas sem apoio.", color:"#16A34A"});
    if(s<=4) return pct({level:"Deambulador com dificuldade", desc:"Marcha preservada, sobe escadas com apoio.", color:"#D97706"});
    if(s<=6) return pct({level:"Deambulador com auxílio", desc:"Necessita cadeira de rodas para longas distâncias.", color:"#F59E0B"});
    if(s<=8) return pct({level:"Cadeira de rodas parcial", desc:"Cadeira de rodas para a maioria das atividades.", color:"#DC2626"});
    return pct({level:"Restrito ao leito / cadeira de rodas total", desc:"Dependente para transferências.", color:"#BE185D"});
  }),

  "TUG Pediátrico": {
    id:"tugped", shortName:"TUG Ped", aliases:["TUG Pediátrico","Timed Up and Go Pediátrico","TUG Ped"], simple:true, range:[0,120], goodDirection:"highIsBad", mcid:3, mdc:2,
    interpret(s){
      if(s<=8) return pct({level:"Normal", desc:"Mobilidade funcional preservada.", color:"#16A34A"});
      if(s<=15) return pct({level:"Limítrofe", desc:"Mobilidade reduzida. Monitorar.", color:"#D97706"});
      if(s<=25) return pct({level:"Alto risco", desc:"Mobilidade significativamente comprometida.", color:"#DC2626"});
      return pct({level:"Muito alto risco", desc:"Mobilidade severamente comprometida.", color:"#BE185D"});
    },
  },

  "DENVER II": {
    id:"denver", shortName:"DENVER II", aliases:["DENVER II"], simple:true, range:[0,100], goodDirection:"highIsGood", mcid:10, mdc:6,
    interpret(s){
      if(s>=90) return pct({level:"Normal/Avançado", desc:"Desenvolvimento acima ou dentro do esperado.", color:"#16A34A"});
      if(s>=75) return pct({level:"Dentro do normal", desc:"Desenvolvimento na faixa esperada.", color:"#D97706"});
      if(s>=50) return pct({level:"Risco/Questionável", desc:"Atenção ao desenvolvimento. Reavaliar.", color:"#DC2626"});
      return pct({level:"Atraso", desc:"Atraso significativo. Encaminhamento para avaliação.", color:"#BE185D"});
    },
  },
};

export default SCALES;
