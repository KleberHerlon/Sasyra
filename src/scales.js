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
};

export default SCALES;
