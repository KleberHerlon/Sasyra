import { useState, useEffect, useMemo } from "react";
import { EvaSlider, TagSelect, SingleSelect, AudioField, useProgress, Section, Row, Field, SubHeading, useMediaQuery } from "./components";
import Assessment from "./Assessment";

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:          "var(--bg)",
  surface:     "var(--surface)",
  card:        "var(--card)",
  cardAlt:     "var(--cardAlt)",
  border:      "var(--border)",
  borderLight: "var(--borderLight)",
  green:       "var(--green)",
  greenDim:    "var(--greenDim)",
  greenDeep:   "var(--greenDeep)",
  greenBg:     "var(--greenBg)",
  greenBgHov:  "var(--greenBgHov)",
  amber:       "var(--amber)",
  amberBg:     "var(--amberBg)",
  red:         "var(--red)",
  redBg:       "var(--redBg)",
  blue:        "var(--blue)",
  blueBg:      "var(--blueBg)",
  purple:      "var(--purple)",
  purpleBg:    "var(--purpleBg)",
  text:        "var(--text)",
  textSub:     "var(--textSub)",
  textMuted:   "var(--textMuted)",
  textDim:     "var(--textDim)",
  white:       "var(--white)",
};
const F = "'Inter','Segoe UI',system-ui,sans-serif";

// ── Micro-styles ──────────────────────────────────────────────────────────────
const inp = (extra={}) => ({ width:"100%", boxSizing:"border-box", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:13, padding:"9px 12px", outline:"none", fontFamily:F, ...extra });
const sel = (extra={}) => ({...inp(), cursor:"pointer", ...extra});
const lbl = (extra={}) => ({ display:"block", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textMuted, marginBottom:5, ...extra });
const cardStyle = (extra={}) => ({ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 22px", marginBottom:14, ...extra });
const primaryBtn = (extra={}) => ({ background:C.green, color:"#061A0C", border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:F, display:"inline-flex", alignItems:"center", gap:6, ...extra });
const ghostBtn = (extra={}) => ({ background:"transparent", color:C.green, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:F, display:"inline-flex", alignItems:"center", gap:6, ...extra });
const iconBtn = (active=false, activeColor=C.green, extra={}) => ({ background: active ? `${activeColor}18` : C.surface, border:`1px solid ${active ? activeColor+"50" : C.border}`, color: active ? activeColor : C.textMuted, borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight: active ? 700 : 400, cursor:"pointer", fontFamily:F, transition:"all 0.12s", ...extra });
// ── BMI ───────────────────────────────────────────────────────────────────────
const PROCEDIMENTOS_CATEGORIES = [
  { category: "Eletroterapia", items: ["TENS", "FES", "Ultrassom terapêutico", "Laser de baixa potência", "Magnetoterapia"] },
  { category: "Termoterapia", items: ["Crioterapia", "Termoterapia"] },
  { category: "Terapia Manual", items: ["Massagem terapêutica", "Mobilização articular", "Manipulação", "Tração", "Dry needling", "Ventosaterapia", "Liberação miofascial"] },
  { category: "Bandagens Funcionais", items: ["Bandagem funcional", "Kinesio taping"] },
  { category: "Cinesioterapia e Exercícios", items: ["RPG", "Pilates clínico", "Cinesioterapia", "Treino de força", "Treino proprioceptivo", "Treino funcional", "Exercício neuromotor"] },
  { category: "Hidroterapia", items: ["Hidroterapia"] },
  { category: "Alongamento", items: ["Alongamento global"] },
  { category: "Abordagens Cognitivo-Comportamentais", items: ["PNE – Educação em Dor", "Graded Exposure", "CFT – Terapia Funcional Cognitiva"] },
];

function calcIMC(peso, altura) {
  const p = parseFloat(peso), h = parseFloat(altura)/100;
  if (!p || !h || h <= 0) return null;
  const v = p / (h*h);
  const cat = v < 18.5 ? {l:"Baixo peso", c:C.blue} : v < 25 ? {l:"Peso normal", c:C.green} : v < 30 ? {l:"Sobrepeso", c:C.amber} : {l:"Obeso", c:C.red};
  return { value: v.toFixed(1), ...cat };
}





// ── Evidence (PEDRO / Cochrane / CPG) ────────────────────────────────────────
const EVIDENCE = {
  lombalgia: {
    cif: ["b28013","d410","d415","d450","d850"],
    pedro: [
      { id:"PEDro-2847", titulo:"Exercício vs repouso na lombalgia crônica", pontuacao:9, conclusao:"Exercício ativo superior ao repouso. NNT=3.", fonte:"Cochrane 2021" },
      { id:"PEDro-4521", titulo:"PNE (Pain Neuroscience Education) na dor lombar", pontuacao:8, conclusao:"PNE reduz catastrofização e melhora função.", fonte:"JOSPT 2022" },
      { id:"PEDro-3390", titulo:"McKenzie vs terapia manual na lombalgia", pontuacao:8, conclusao:"Eficácia equivalente; combinação superior.", fonte:"Spine J 2020" },
    ],
    escalas:["Oswestry Disability Index (ODI)","Roland Morris Disability Questionnaire (RMDQ)","Start MSK – triagem biopsicossocial","FABQ (Fear Avoidance Beliefs)","Tampa Scale for Kinesiophobia (TSK-17)"],
    atualizacao:"CPG Cochrane 2021 | JOSPT 2022 | EuroPain 2023",
  },
  cervicalgia: {
    cif: ["b28010","b710","d445","d430"],
    pedro: [
      { id:"PEDro-3811", titulo:"Manipulação C1-C2 vs mobilização na cefaleia cervicogênica", pontuacao:9, conclusao:"Manipulação ATL superior à mobilização. NNT=2.", fonte:"JOSPT 2023" },
      { id:"PEDro-2990", titulo:"Exercício de controle motor vs analgésico na cervicalgia crônica", pontuacao:8, conclusao:"Exercício profundo = efeito a longo prazo superior.", fonte:"BJSM 2021" },
    ],
    escalas:["Neck Disability Index (NDI)","Northwick Park Neck Pain Questionnaire","Global Rating of Change (GRC)","Numeric Pain Rating Scale (NPRS)"],
    atualizacao:"CPG JOSPT 2023 | Cochrane Cervical 2022",
  },
  gonalgia: {
    cif: ["b28015","b710","b730","d450","d455","d410"],
    pedro: [
      { id:"PEDro-5102", titulo:"Exercício vs artroscopia no menisco degenerativo (ESCAPE trial)", pontuacao:10, conclusao:"Exercício = cirurgia em OA meniscal. Evitar artroscopia.", fonte:"NEJM 2018" },
      { id:"PEDro-4877", titulo:"Treino neuromuscular pós-reconstrução LCA", pontuacao:9, conclusao:"Protocolo MOON reduz re-lesão em 50%.", fonte:"AJSM 2022" },
      { id:"PEDro-3654", titulo:"Glúteo médio + VMO na síndrome patelofemoral", pontuacao:8, conclusao:"Fortalecimento proximal reduz dor patelofemoral efetivamente.", fonte:"BJSM 2020" },
    ],
    escalas:["KOOS (Knee injury and Osteoarthritis Outcome Score)","Lysholm Knee Score","ACL-RSI (Return to Sport after Injury)","IKDC Subjective Knee Form","VAS / NPRS"],
    atualizacao:"ESCAPE Trial NEJM 2018 | MOON Protocol 2022 | CPG JOSPT 2023",
  },
  ombralgia: {
    cif: ["b28014","b710","b715","b730","d445","d430"],
    pedro: [
      { id:"PEDro-4210", titulo:"Exercício vs cirurgia no impacto subacromial (CSAW trial)", pontuacao:10, conclusao:"Exercício = cirurgia no impacto. Optar por conservador.", fonte:"Lancet 2018" },
      { id:"PEDro-3980", titulo:"Fortalecimento escapular no impacto subacromial", pontuacao:8, conclusao:"Estabilização escapular melhora força e função.", fonte:"JOSPT 2021" },
    ],
    escalas:["DASH (Disabilities of the Arm, Shoulder and Hand)","WORC (Western Ontario Rotator Cuff Index)","ASES (American Shoulder and Elbow Surgeons)","NPRS","Oxford Shoulder Score"],
    atualizacao:"CSAW Trial Lancet 2018 | Cochrane Shoulder 2022",
  },
  tornozelo: {
    cif: ["b28015","b710","b770","d450","d455"],
    pedro: [
      { id:"PEDro-3721", titulo:"PEACE & LOVE vs RICE na entorse lateral", pontuacao:9, conclusao:"Carga precoce + exercício superior ao repouso/gelo.", fonte:"BJSM 2019" },
      { id:"PEDro-4450", titulo:"Treino proprioceptivo na prevenção de entorse recorrente", pontuacao:9, conclusao:"Reduz recorrência em 46%. Evidência A.", fonte:"CPG JOSPT 2021" },
      { id:"PEDro-3280", titulo:"Alongamento plantar + excêntrico na fasciíte plantar", pontuacao:8, conclusao:"Alongamento específico de Windlass superior ao inespecífico.", fonte:"JFAS 2020" },
    ],
    escalas:["FAAM (Foot and Ankle Ability Measure)","AOS (Ankle Osteoarthritis Scale)","CAIT (Cumberland Ankle Instability Tool)","NPRS","Patient Global Impression of Change (PGIC)"],
    atualizacao:"PEACE & LOVE BJSM 2019 | CPG JOSPT 2021 | Cochrane Ankle 2022",
  },
  cotovelo: {
    cif: ["b28014","b710","b730","d445","d4401"],
    pedro: [
      { id:"PEDro-4130", titulo:"Isométrico vs excêntrico na epicondilite lateral", pontuacao:8, conclusao:"Isométrico = analgesia imediata; excêntrico = ganho funcional a longo prazo.", fonte:"BJSM 2021" },
      { id:"PEDro-3560", titulo:"Corticoide vs exercício na tendinopatia lateral (MINT trial)", pontuacao:9, conclusao:"Corticoide: rápido mas recidiva alta (>52 sem). Exercício: melhor desfecho tardio.", fonte:"Lancet 2013" },
      { id:"PEDro-4780", titulo:"Ondas de choque na epicondilite lateral refratária", pontuacao:7, conclusao:"Adjuvante válido quando exercício falha (NNT=4).", fonte:"Cochrane 2019" },
    ],
    escalas:["PRTEE (Patient-Rated Tennis Elbow Evaluation)","DASH","VAS","NPRS","Global Rating of Change (GRC)"],
    atualizacao:"MINT Trial Lancet 2013 | Cochrane Elbow 2019 | BJSM 2021",
  },
};

// ── Knowledge Base (atualizada) ───────────────────────────────────────────────
const KB = {
  lombalgia:{
    label:"Lombalgia",
    tests:[
      {name:"Lasègue (SLR)",desc:"Radiculopatia L4-S1. Sens. ~80%, Esp. ~40%.",how:"Paciente em DD. Elevar o membro passivamente com joelho estendido. Positivo: dor irradiada abaixo do joelho com ângulo < 60°. Cruzado (crossed SLR) tem especificidade ~90%.",video:"https://www.youtube.com/watch?v=rzndCc1HiUk"},
      {name:"Slump Test",desc:"Tensão neural lombossacra. Sens. ~84%, Esp. ~83%.",how:"Sentado, flexão lombar + extensão joelho + dorsiflexão. Positivo: sintomas reproduzidos e aliviados com extensão cervical. Superior ao SLR na lombalgia com irradiação.",video:"https://www.youtube.com/watch?v=_fMy6pEpRp8"},
      {name:"Teste de Schober",desc:"Mobilidade lombar — hipomobilidade em EA.",how:"Marcar L5 e 10 cm acima em bipedestação. Pedir flexão máxima. Normal: distância aumenta ≥ 5 cm. Modificado de Schober: 5 cm acima + 10 cm abaixo de L5.",video:"https://www.youtube.com/watch?v=iEOiAGoaxQM"},
      {name:"FABER / Patrick",desc:"Disfunção sacroilíaca vs coxofemoral.",how:"Tornozelo do lado testado sobre o joelho contralateral (posição '4'). Pressionar suavemente joelho ipsilateral. Positivo: dor na virilha = coxofemoral; dor posterior = SI.",video:"https://www.youtube.com/watch?v=gRvmXN4GSyo"},
      {name:"Gaenslen",desc:"Articulação sacroilíaca. Sens. ~53%, Esp. ~71%.",how:"Paciente na beira da maca. Uma perna em flexão máxima ao peito, outra em extensão pendente. Estresse simultâneo em direções opostas. Positivo: dor SI ipsilateral.",video:"https://www.youtube.com/watch?v=eLnSdiUZCqY"},
      {name:"Teste de Waddell",desc:"Fatores não-orgânicos / psicossociais (yellow flags).",how:"5 sinais: (1) sensibilidade superficial difusa, (2) dor com simulação de compressão axial, (3) melhora com distração, (4) distribuição regional não-anatômica, (5) reação exagerada. ≥3 positivos = investigar fatores psicossociais.",video:"https://www.youtube.com/watch?v=WOhfYdcj8Jk"},
    ],
    redFlags:["Déficit neurológico progressivo / paresia","Síndrome da cauda equina (bexiga/reto)","Suspeita de fratura osteoporótica ou trauma","Neoplasia conhecida / perda de peso inexplicada","Febre + dor noturna intensa (infecção)","Perda de controle esfincteriano","Dor que piora em repouso e à noite","Imunossuprimido / uso de corticoide crônico"],
    goldStandard:"Exercício terapêutico ativo (McKenzie, CFT – Cognitive Functional Therapy, estabilização segmentar). PNE (Pain Neuroscience Education) reduz catastrofização e retorno ao trabalho. Terapia manual como adjuvante de curto prazo. Evitar repouso e medicalização excessiva. (Cochrane 2021 – Evidência A). Não indicar imagem em < 6 sem sem red flags (CPG NICE 2023).",
    yellowFlags:["Catastrofização (Pain Catastrophizing Scale)","Cinesiofobia (TSK-17)","Baixa autoeficácia","Insatisfação e conflitos no trabalho","Depressão / ansiedade comórbida","Expectativa de não recuperação","Comportamento de doença / evitação"],
    escalas:EVIDENCE.lombalgia.escalas,
  },
  cervicalgia:{
    label:"Cervicalgia",
    tests:[
      {name:"Spurling (Foraminal Compression)",desc:"Radiculopatia cervical. Sens. ~50%, Esp. ~86%.",how:"Rotacionar + inclinar a cabeça para o lado sintomático + compressão axial suave. Positivo: irradiação para o MS ipsilateral. Alta especificidade, usar para confirmar.",video:"https://www.youtube.com/watch?v=GMzS3VbScfc"},
      {name:"Distração Cervical",desc:"Alívio da compressão foraminal. Sens. ~44%, Esp. ~90%.",how:"Tracionar levemente a cabeça em posição neutra (aprox. 5–7 kg). Positivo: alívio da dor ou da irradiação. Complementar ao Spurling.",video:""},
      {name:"Flexion-Rotation Test (FRT)",desc:"Disfunção C1-C2 / cefaleia cervicogênica. Sens. ~91%, Esp. ~90%.",how:"Paciente em DD, flexão cervical máxima + rotação passiva bilateral. Normal ≥ 44°. Diferença > 10° entre lados = hipomobilidade C1-C2.",video:"https://www.youtube.com/watch?v=RxLJHJG8KbQ"},
      {name:"ULTT 1 – Mediano",desc:"Tensão neural do nervo mediano.",how:"Depressão escapular → abdução 90° → supinação → extensão cotovelo → extensão punho/dedos → inclinação cervical contralateral. Positivo: sintomas reproduzidos, aliviados com inclinação ipsilateral.",video:""},
      {name:"ULTT 2a – Radial",desc:"Tensão neural do nervo radial.",how:"Depressão escapular → abdução 10° → RI ombro + pronação → flexão punho/dedos. Positivo: sintomas em território radial.",video:""},
      {name:"Teste de Compressão Axial Cervical",desc:"Lesão discal ou foraminal.",how:"Aplicar pressão axial suave no vertex com a cabeça em posição neutra. Positivo: reprodução de dor cervical local ou irradiada.",video:""},
    ],
    redFlags:["Mielopatia (Babinski +, hiperreflexia, marcha atáxica)","Fratura instável / trauma de alta energia","Suspeita de dissecção de artéria vertebral (5D + 3N)","Tumor cervical / mieloma","Infecção (espondilodiscite)","Síndrome de Horner associada","Disfagia / disfonesia progressiva"],
    goldStandard:"Manipulação/mobilização C1-C2 para cefaleia cervicogênica (NNT=2, JOSPT 2023). Exercício de controle motor profundo (longo do pescoço + escalenos) para cervicalgia crônica. ULTT neurogliding para radiculopatia cervical. Combinação manual + exercício superior a cada um isolado (CPG JOSPT 2023 – Evidência A).",
    yellowFlags:["Dor crônica > 3 meses","Cefaleia cervicogênica associada","Tontura cervicogênica","Trabalho com computador prolongado","Trauma prévio de alta energia (whiplash)"],
    escalas:EVIDENCE.cervicalgia.escalas,
  },
  gonalgia:{
    label:"Joelho",
    tests:[
      {name:"Lachman",desc:"Ruptura do LCA. Sens. 85%, Esp. 94% (melhor que gaveta anterior).",how:"Joelho 20–30° de flexão em DD. Mão proximal fixa o fêmur, mão distal translada tíbia anteriormente. Positivo: translação > 3 mm sem endpoint firme (graduação 1+/2+/3+).",video:"https://www.youtube.com/watch?v=CSP3QWhlBDo"},
      {name:"Pivot Shift",desc:"LCA – Instabilidade rotacional. Esp. ~98% (confirmatório).",how:"Valgo + RI sobre o joelho estendido enquanto flexiona. Positivo: ressalto articular entre 20–40° (redução da subluxação). Mais específico que Lachman.",video:""},
      {name:"McMurray",desc:"Lesão meniscal medial e lateral.",how:"Flex/ext do joelho + RI (menisco lateral) e RE (menisco medial). Positivo: clunk palpável + dor na linha articular. Esp. ~98%; sens. ~53%.",video:"https://www.youtube.com/watch?v=PEdzdL3cniI"},
      {name:"Thessaly 20°",desc:"Lesão meniscal – mais sensível. Sens. ~94%, Esp. ~96%.",how:"Paciente em monopé com 20° de flexão, mãos do examinador. Rotação do corpo 3x interna/externa. Positivo: dor ou desconforto na linha articular medial ou lateral.",video:""},
      {name:"Valgus/Varus Stress",desc:"LCM (valgo) / LCL (varo).",how:"A 0° (integridade cápsula) e a 30° de flexão (LCM/LCL isolado). Abertura articular > 3 mm comparado ao contralateral = positivo. Grau I < 5 mm; Grau II 5–10 mm; Grau III > 10 mm.",video:""},
      {name:"Clarke / Patelofemoral",desc:"Síndrome patelofemoral.",how:"Pressionar a patela superiormente/inferiormente enquanto o paciente contrai o quadríceps ativamente. Positivo: dor retropatelar. Baixa especificidade – usar em contexto clínico.",video:""},
      {name:"Dial Test",desc:"Lesão do canto posterolateral (CPL).",how:"Decúbito ventral. RI comparativa a 30° e 90° de flexão. Diferença > 10° a 30° isolado = CPL; diferença > 10° a 30° e 90° = LCP + CPL.",video:""},
    ],
    redFlags:["Hemartrose aguda pós-trauma (suspeitar LCA/fratura)","Bloqueio mecânico do joelho (corpo livre/menisco deslocado)","Fratura de plateau tibial / fêmur distal","Luxação patelar irredutível","Suspeita de neoplasia óssea","Síndrome compartimental","Joelho séptico (dor + febre + derrame)"],
    goldStandard:"Menisco degenerativo: exercício = cirurgia (ESCAPE trial, NEJM 2018 – Evidência A). LCA: protocolo MOON neuromuscular, não operar sem reabilitação prévia. Patelofemoral: glúteo médio + VMO + controle de alinhamento (Evidência A). OA joelho: exercício aeróbio + fortalecimento (OARSI 2023). Evitar injeções repetidas de corticoide em OA (degeneração cartilagem).",
    yellowFlags:["Medo de re-lesão (ACL-RSI < 56)","Baixa autoeficácia de movimento","Sedentarismo prévio","Sobrepeso/obesidade (IMC > 30)"],
    escalas:EVIDENCE.gonalgia.escalas,
  },
  ombralgia:{
    label:"Ombro",
    tests:[
      {name:"Neer",desc:"Impacto subacromial. Sens. ~72%, Esp. ~66%.",how:"Estabilizar escápula com mão proximal, elevar passivamente em flexão com RI máxima ('encher lata'). Positivo: dor subacromial antes de 180°.",video:"https://www.youtube.com/watch?v=xFRpE6gS2V0"},
      {name:"Hawkins-Kennedy",desc:"Impacto subacromial – mais sensível. Sens. ~79%, Esp. ~59%.",how:"Flexão 90°, cotovelo 90°. Rotação interna passiva forçada. Positivo: dor subacromial. Mais sensível que Neer.",video:"https://www.youtube.com/watch?v=8jqvf9dP5f8"},
      {name:"Empty Can / Jobe",desc:"Supraespinal. Sens. ~69%, Esp. ~66%.",how:"Abdução 90° no plano da escápula (espinha da escápula), RI máxima (polegar para baixo = 'lata vazia'). Resistência manual inferior. Positivo: fraqueza ou dor.",video:""},
      {name:"Full Can",desc:"Supraespinal (menos doloroso que Empty Can). Esp. superior.",how:"Mesmo que Empty Can mas com RE (polegar para cima = 'lata cheia'). Melhor tolerado e mais específico para rotura.",video:""},
      {name:"O'Brien (SLAP)",desc:"Labrum superior (SLAP). Sens. ~47%, Esp. ~55%.",how:"Flexão 90°, adução 15°, RI máxima (cotovelo estendido). Resistência axial. Repetir em supinação. Positivo: dor profunda ou clique que MELHORA na supinação.",video:""},
      {name:"Apreensão Anterior + Relocação",desc:"Instabilidade glenoumeral anterior.",how:"Abdução 90° + RE progressiva. Positivo: apreensão (não necessariamente dor). Relocação (pressão posterior na cabeça umeral) = alívio da apreensão. Esp. ~99% para instabilidade.",video:""},
      {name:"Gerber Lift-off",desc:"Subescapular.",how:"Mão nas costas (RI ombro). Levantar a mão das costas contra resistência. Positivo: incapacidade ou fraqueza.",video:""},
    ],
    redFlags:["Fratura de úmero / clavícula / escápula","Luxação glenoumeral irredutível","Ruptura completa do manguito em atleta jovem < 40 anos","Tumor de Pancoast (dor ombro + Síndrome de Horner)","Infecção glenoumeral","Paresia do nervo axilar / espinal"],
    goldStandard:"Impacto subacromial sem ruptura: fortalecimento manguito + escapular SUPERIOR à cirurgia (CSAW trial Lancet 2018 – Evidência A). Ruptura parcial: conservador inicialmente 3–6 meses. Ruptura completa sintomática em < 65 anos: discussão com ortopedia. Ombro congelado: mobilização passiva progressiva + corticoide intra-articular de curto prazo (CPG JOSPT 2022).",
    yellowFlags:["Trabalho com MS elevado (overhead)","Esportista de arremesso / overhead","Dor noturna persistente (sugere ruptura)","Imobilização prolongada prévia"],
    escalas:EVIDENCE.ombralgia.escalas,
  },
  tornozelo:{
    label:"Tornozelo / Pé",
    tests:[
      {name:"Anterior Drawer",desc:"LTFA (ligamento talofibular anterior) – mais lesado. Sens. ~71%, Esp. ~33%.",how:"Segurar o calcanhar, tornozelo em 10–20° de plantarflexão. Transladar o pé anteriormente com mão plana. Comparar bilateralmente. Translação > 5 mm ou > 3 mm assimétrica = positivo.",video:""},
      {name:"Talar Tilt",desc:"Ligamento calcaneofibular (LCF). Sens. ~50%, Esp. ~88%.",how:"Inversão forçada passiva do pé com tornozelo em posição neutra. Comparar lado a lado. Assimetria > 5–10° = positivo. Alta especificidade.",video:""},
      {name:"Ottawa Ankle Rules",desc:"Indicação de radiografia. Sens. ~96–100%.",how:"RX indicado se: (1) dor na zona da ponta do maléolo lateral OU medial, OU (2) incapacidade de apoiar peso e dar 4 passos. Regras do pé: dor em base do 5º metatarso ou navicular.",video:"https://www.youtube.com/watch?v=rBL1r0C4a9g"},
      {name:"Windlass Test",desc:"Fasciíte plantar. Sens. ~32%, Esp. ~100%.",how:"Dorsiflexão passiva dos dedos (especialmente hálux) com paciente em pé e apoio. Positivo: reprodução de dor na inserção da fáscia plantar no calcâneo. Alta especificidade.",video:""},
      {name:"Thompson (Simmonds)",desc:"Ruptura do tendão de Aquiles. Sens. ~96%, Esp. ~93%.",how:"Paciente em DV com pé fora da maca ou ajoelhado. Apertar a panturrilha no terço médio. Normal: plantarflexão passiva do pé. Positivo: ausência de movimento (gap palpável).",video:""},
      {name:"CAIT – Cumberland Ankle Instability Tool",desc:"Instabilidade crônica do tornozelo (ICT). Pontuação ≤ 27 = ICT.",how:"Questionário de 9 itens que avalia sensação de instabilidade, torções e confiança em atividades. Preencher com o paciente. Score máximo = 30.",video:""},
    ],
    redFlags:["Fratura (Ottawa Rules positivo → RX imediato)","Ruptura do tendão de Aquiles (Thompson positivo)","Síndrome compartimental (dor desproporcional + parestesia)","Luxação talar ou peritalar","Fratura de stress do navicular / base 5º MT","Neoplasia óssea / osteomielite"],
    goldStandard:"Entorse lateral Grau I-II: protocolo PEACE & LOVE (2019) – carga precoce com suporte conforme tolerância, SEM imobilização rígida. Fortalecimento fibular + treino proprioceptivo reduz recorrência em 46% (CPG JOSPT 2021 – Evidência A). Fasciíte plantar: alongamento específico da fáscia (Windlass stretching) + taloneiras + excêntrico do gastrocnêmio (Evidência A, Cochrane 2022). Evitar repouso prolongado.",
    yellowFlags:["Entorses de repetição (> 2 episódios)","Hipermobilidade generalizada (Beighton ≥ 4)","Instabilidade crônica percebida","Calçado inadequado para a atividade"],
    escalas:EVIDENCE.tornozelo.escalas,
  },
  cotovelo:{
    label:"Cotovelo",
    tests:[
      {name:"Teste de Mills",desc:"Tendinopatia lateral dos extensores (epicondilite). Sens. ~53%.",how:"Cotovelo estendido, pronação do antebraço + flexão passiva máxima de punho. Positivo: dor no epicôndilo lateral.",video:"https://www.youtube.com/watch?v=kJmQKO7YDLA"},
      {name:"Teste de Cozen",desc:"Tendinopatia lateral – alta sensibilidade. Sens. ~84%.",how:"Palpação no epicôndilo lateral + extensão ativa de punho contra resistência manual com cotovelo fixo. Positivo: dor aguda no epicôndilo lateral.",video:"https://www.youtube.com/watch?v=kJmQKO7YDLA"},
      {name:"Teste de Golfer (Medial)",desc:"Tendinopatia medial dos flexores.",how:"Cotovelo estendido, supinação de antebraço + extensão passiva de punho. Positivo: dor no epicôndilo medial.",video:""},
      {name:"Valgus Stress Test",desc:"Ligamento colateral ulnar (LCU). Sens. ~65%, Esp. ~60%.",how:"Cotovelo em 20–30° de flexão. Aplicar força em valgo. Positivo: dor medial ou sensação de abertura/frouxidão.",video:""},
      {name:"Moving Valgus Stress",desc:"LCU – atletas arremessadores. Sens. ~100%, Esp. ~75%.",how:"Ombro abduzido 90°, cotovelo em flexão máxima. Valgo constante enquanto estende o cotovelo rapidamente. Positivo: dor medial entre 70–120° ('shear angle').",video:""},
      {name:"Milking Maneuver",desc:"Instabilidade posteromedial / LCU.",how:"Paciente traciona o próprio polegar com cotovelo flexionado > 90° e ombro abduzido (simula arremesso). Positivo: instabilidade ou dor medial.",video:""},
      {name:"Lateral Pivot Shift (Cotovelo)",desc:"Instabilidade rotatória lateral (IRL).",how:"Paciente em DD, MS elevado. Supinação + valgo + compressão axial enquanto flexiona o cotovelo. Positivo: subluxação/ressalto da cabeça do rádio.",video:""},
      {name:"Elbow Flexion Test (Nervo Ulnar)",desc:"Síndrome do canal cubital. Sens. ~75%, Esp. ~99%.",how:"Flexão máxima do cotovelo + extensão do punho mantidos por 1–3 minutos. Positivo: parestesia nos dedos 4º e 5º e/ou face ulnar da mão.",video:""},
    ],
    redFlags:["Fratura de olécrano / cabeça do rádio (Ottawa Elbow Rules)","Luxação de cotovelo","Lesão vascular / síndrome compartimental do antebraço","Paralisia nervosa completa (radial / ulnar / mediano)","Tumor ósseo / exostose","Artrite séptica"],
    goldStandard:"Tendinopatia lateral: exercício isométrico (analgesia imediata) → excêntrico → carga progressiva. Isométrico SUPERIOR a AINE e placebo a curto prazo (BJSM 2021 – Evidência A). Evitar corticoide a longo prazo: recidiva > 72% em 52 semanas (MINT trial, Lancet 2013). Ondas de choque radiais como adjuvante quando exercício falha (Cochrane 2019). Instabilidade LCU: cirurgia em atletas de alta performance; conservador em sedentários com fortalecimento de flexores de punho.",
    yellowFlags:["Atividade ocupacional repetitiva (pinça, digitação, parafusar)","Esportista de raquete / arremessador","Baixa adesão ao repouso relativo","Uso excessivo de mouse/teclado"],
    escalas:EVIDENCE.cotovelo.escalas,
  },
};

const detectKB = txt => {
  const t = txt.toLowerCase();
  if (t.match(/lomb|costas/)) return "lombalgia";
  if (t.match(/cerv|pescoço/)) return "cervicalgia";
  if (t.match(/joelh|gon/)) return "gonalgia";
  if (t.match(/ombr/)) return "ombralgia";
  if (t.match(/tornoz|pé |pe |fasci|aquile/)) return "tornozelo";
  if (t.match(/cotov|epicond|tênisist|golfist/)) return "cotovelo";
  return "";
};

// ── CIF Engine ────────────────────────────────────────────────────────────────
function generateCIF({ evaMov, avds, localDor, gonio, tests, yellowFlags, tempoDor }) {
  void localDor; void gonio; void tests; void tempoDor;
  const result = [];
  if (evaMov >= 7) result.push({ code:"b280", desc:"Sensação de dor intensa", qualifier:3 });
  else if (evaMov >= 4) result.push({ code:"b280", desc:"Sensação de dor moderada", qualifier:2 });
  else if (evaMov >= 1) result.push({ code:"b280", desc:"Sensação de dor leve", qualifier:1 });
  if (avds?.includes("Andar")) result.push({ code:"d450", desc:"Andar", qualifier: evaMov >= 7 ? 3 : 2 });
  if (avds?.includes("Subir escadas")) result.push({ code:"d4551", desc:"Subir/descer escadas", qualifier:2 });
  if (avds?.includes("Trabalho manual")) result.push({ code:"d850", desc:"Trabalho remunerado", qualifier:2 });
  if (avds?.includes("Dormir")) result.push({ code:"d4702", desc:"Usar transporte privado / dormir", qualifier:1 });
  if (avds?.includes("Esporte")) result.push({ code:"d920", desc:"Recreação e lazer", qualifier:2 });
  if (yellowFlags?.length >= 2) result.push({ code:"b1265", desc:"Otimismo / fatores psicossociais", qualifier:2 });
  return result;
}

// ── Goniometria ───────────────────────────────────────────────────────────────
const REF = {
  "Flexão|Coluna Cervical":"0–45","Extensão|Coluna Cervical":"0–45","Inclinação D|Coluna Cervical":"0–45","Inclinação E|Coluna Cervical":"0–45","Rotação D|Coluna Cervical":"0–60","Rotação E|Coluna Cervical":"0–60",
  "Flexão|Coluna Lombar":"0–60","Extensão|Coluna Lombar":"0–25","Inclinação D|Coluna Lombar":"0–25","Inclinação E|Coluna Lombar":"0–25",
  "Flexão|Ombro D":"0–180","Abdução|Ombro D":"0–180","RE|Ombro D":"0–90","RI|Ombro D":"0–70","Extensão|Ombro D":"0–60",
  "Flexão|Ombro E":"0–180","Abdução|Ombro E":"0–180","RE|Ombro E":"0–90","RI|Ombro E":"0–70","Extensão|Ombro E":"0–60",
  "Flexão|Cotovelo D":"0–145","Pronação|Cotovelo D":"0–80","Supinação|Cotovelo D":"0–80",
  "Flexão|Cotovelo E":"0–145","Pronação|Cotovelo E":"0–80","Supinação|Cotovelo E":"0–80",
  "Flexão|Quadril D":"0–120","Extensão|Quadril D":"0–30","Abdução|Quadril D":"0–45","RI|Quadril D":"0–45","RE|Quadril D":"0–45",
  "Flexão|Quadril E":"0–120","Extensão|Quadril E":"0–30","Abdução|Quadril E":"0–45","RI|Quadril E":"0–45","RE|Quadril E":"0–45",
  "Flexão|Joelho D":"0–135","Flexão|Joelho E":"0–135",
  "Dorsiflexão|Tornozelo D":"0–20","Plantarflexão|Tornozelo D":"0–50","Inversão|Tornozelo D":"0–35","Eversão|Tornozelo D":"0–15",
  "Dorsiflexão|Tornozelo E":"0–20","Plantarflexão|Tornozelo E":"0–50","Inversão|Tornozelo E":"0–35","Eversão|Tornozelo E":"0–15",
};
function getRef(mv, jt) { return REF[`${mv}|${jt}`] || ""; }
function isOutOfRange(val, refStr) {
  if (!refStr||!val) return false;
  const m = refStr.match(/(\d+)[–-](\d+)/);
  if (!m) return false;
  return Number(val) > Number(m[2]);
}

// ── Logo ──────────────────────────────────────────────────────────────────────
function LogoSVG() {
  return (
    <svg viewBox="0 0 320 56" width="195" height="44" style={{ display:"block" }}>
      <g transform="translate(26,28)">
        <line x1="0" y1="-22" x2="0" y2="22" stroke={C.textDim} strokeWidth="1.5" strokeDasharray="2 5"/>
        <path d="M -17 11 C -9 3,0 0,17 -11" fill="none" stroke={C.green} strokeWidth="4" strokeLinecap="round"/>
        <path d="M -17 -4 C -4 0,4 3,17 12" fill="none" stroke={C.greenDim} strokeWidth="3" strokeLinecap="round"/>
        <path d="M -10 19 C -3 10,3 -5,13 -19" fill="none" stroke={C.greenDeep} strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="0" cy="0" r="4.8" fill={C.amber}/>
      </g>
      <text x="58" y="40" fill={C.white} fontSize="30" fontWeight="900" letterSpacing="7" fontFamily={F}>SASYRA</text>
      <text x="40" y="52" fill={C.green} fontSize="11" fontWeight="800" letterSpacing="5" fontFamily={F}>REABILITAÇÃO E EVIDÊNCIA</text>
    </svg>
  );
}



// ── PEDro card ────────────────────────────────────────────────────────────────
function PedroCard({ study }) {
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.borderLight}`, borderRadius:8, padding:"10px 14px", marginBottom:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:3 }}>{study.titulo}</div>
          <div style={{ fontSize:11, color:C.textSub, lineHeight:1.5 }}>{study.conclusao}</div>
        </div>
        <div style={{ textAlign:"center", flexShrink:0 }}>
          <div style={{ fontSize:18, fontWeight:900, color:C.green }}>{study.pontuacao}</div>
          <div style={{ fontSize:9, color:C.textMuted, fontWeight:700 }}>/10 PEDro</div>
        </div>
      </div>
      <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
        <span style={{ fontSize:10, color:C.amber, background:C.amberBg, border:`1px solid ${C.amber}30`, borderRadius:6, padding:"2px 8px" }}>{study.id}</span>
        <span style={{ fontSize:10, color:C.textMuted, background:C.card, border:`1px solid ${C.border}`, borderRadius:6, padding:"2px 8px" }}>{study.fonte}</span>
      </div>
    </div>
  );
}





// ── Section / Row / Field ─────────────────────────────────────────────────────

let _gId = 20;

// ── Login Screen ────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, theme, onToggleTheme }) {
  const [prof, setProf] = useState("");
  const [nome, setNome] = useState("");
  const [crefito, setCrefito] = useState("");

  const profOptions = [
    { value:"fisio", label:"Fisioterapeuta", icon:"🦵" },
    { value:"to", label:"Terapeuta Ocupacional", icon:"🤲" },
    { value:"educFisico", label:"Educador Físico", icon:"🏃" },
    { value:"outro", label:"Outro profissional da saúde", icon:"💚" },
  ];

  const handleEnter = () => {
    if (!prof || !nome.trim()) return;
    onLogin({ prof, nome: nome.trim(), crefito: crefito.trim() });
  };

  return (
    <div style={{ background:`radial-gradient(ellipse at 50% 0%, ${C.card} 0%, ${C.bg} 70%)`, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:F, padding:24, position:"relative" }}>
      {/* Theme toggle */}
      <button onClick={onToggleTheme} style={{ position:"absolute", top:20, right:20, background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.textMuted, padding:"7px 12px", fontSize:16, lineHeight:1, cursor:"pointer", fontFamily:F, transition:"all 0.2s" }}>
        {theme === "dark" ? "☀️" : "🌙"}
      </button>

      <div style={{ maxWidth:440, width:"100%", textAlign:"center" }}>

        {/* Logo grande */}
        <div style={{ marginBottom:8 }}>
          <svg viewBox="0 0 400 70" width="320" height="62" style={{ display:"block", margin:"0 auto" }}>
            <g transform="translate(78,36)">
              <line x1="0" y1="-28" x2="0" y2="28" stroke={C.textDim} strokeWidth="1.5" strokeDasharray="2 5"/>
              <path d="M -20 14 C -10 4,0 0,20 -14" fill="none" stroke={C.green} strokeWidth="5" strokeLinecap="round"/>
              <path d="M -20 -5 C -5 0,5 4,20 15" fill="none" stroke={C.greenDim} strokeWidth="3.5" strokeLinecap="round"/>
              <path d="M -12 24 C -4 13,4 -6,15 -24" fill="none" stroke={C.greenDeep} strokeWidth="3" strokeLinecap="round"/>
              <circle cx="0" cy="0" r="6" fill={C.amber}/>
            </g>
            <text x="200" y="50" fill={C.white} fontSize="36" fontWeight="900" letterSpacing="8" fontFamily={F} textAnchor="middle">SASYRA</text>
            <text x="200" y="66" fill={C.green} fontSize="13" fontWeight="800" letterSpacing="6" fontFamily={F} textAnchor="middle">REABILITAÇÃO E EVIDÊNCIA</text>
          </svg>
        </div>

        <p style={{ color:C.textMuted, fontSize:14, lineHeight:1.6, margin:"8px 0 28px" }}>
          Sistema de apoio à decisão clínica para avaliação, documentação e tratamento ortopédico baseado em evidências
        </p>

        {/* Profissão */}
        <div style={{ textAlign:"left", marginBottom:18 }}>
          <span style={lbl()}>Sou profissional de</span>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {profOptions.map(opt => (
              <button key={opt.value} onClick={() => setProf(opt.value)}
                style={{
                  ...iconBtn(prof === opt.value, C.green),
                  width:"100%", justifyContent:"flex-start", textAlign:"left", padding:"12px 16px",
                  border: prof === opt.value ? `1px solid ${C.green}70` : `1px solid ${C.border}`,
                  background: prof === opt.value ? C.greenBg : C.surface,
                  borderRadius:10, gap:10, fontSize:14
                }}>
                <span style={{ fontSize:18 }}>{opt.icon}</span>
                <span style={{ fontWeight: prof === opt.value ? 700 : 400, color: prof === opt.value ? C.green : C.text }}>{opt.label}</span>
                {prof === opt.value && <span style={{ marginLeft:"auto", color:C.green, fontSize:16 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Nome */}
        <div style={{ textAlign:"left", marginBottom:14 }}>
          <span style={lbl()}>Nome completo</span>
          <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome"
            style={inp({ padding:"11px 14px", fontSize:14 })} />
        </div>

        {/* CREFITO (opcional) */}
        <div style={{ textAlign:"left", marginBottom:24 }}>
          <span style={lbl()}>CREFITO / registro profissional <span style={{ color:C.textDim, fontWeight:400, textTransform:"none" }}>(opcional)</span></span>
          <input type="text" value={crefito} onChange={e => setCrefito(e.target.value)} placeholder="Ex: 12345-F"
            style={inp({ padding:"11px 14px", fontSize:14 })} />
        </div>

        {/* Entrar */}
        <button onClick={handleEnter} disabled={!prof || !nome.trim()}
          style={{
            ...primaryBtn(),
            width:"100%", justifyContent:"center", padding:"14px", fontSize:15, fontWeight:800,
            opacity: (!prof || !nome.trim()) ? 0.4 : 1,
            cursor: (!prof || !nome.trim()) ? "not-allowed" : "pointer"
          }}>
          Entrar no SASYRA →
        </button>

        <p style={{ color:C.textDim, fontSize:11, marginTop:24 }}>
          Ao entrar, você declara ser profissional de saúde habilitado
        </p>
      </div>
    </div>
  );
}

const PROF_LABELS = { fisio:"Fisioterapeuta", to:"Terapeuta Ocupacional", educFisico:"Educador Físico", outro:"Profissional da Saúde" };

// ── Patient List ──────────────────────────────────────────────────────────────
function PatientList({ patients, onSelect, onAdd, onLogout, user }) {
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });
  const isMobile = useMediaQuery("(max-width:767px)");

  const handleAdd = () => {
    if (!f.nome.trim()) return;
    onAdd({ ...f, id:Date.now(), data:new Date().toISOString().slice(0,10) });
    setF({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });
    setShowForm(false);
  };

  return (
    <div style={{ background:`radial-gradient(ellipse at 50% 0%, ${C.card} 0%, ${C.bg} 70%)`, minHeight:"100vh", fontFamily:F, color:C.text, padding:isMobile?12:24 }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
          <LogoSVG/>
          <button onClick={onLogout} style={ghostBtn({ fontSize:12 })}>Sair</button>
        </div>

        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:22, fontWeight:800, color:C.white, marginBottom:2 }}>Olá, {user.nome}</div>
          <div style={{ fontSize:13, color:C.textMuted }}>{PROF_LABELS[user.prof] || user.prof}{user.crefito ? ` · CREFITO ${user.crefito}` : ""}</div>
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <span style={{ fontSize:15, fontWeight:700, color:C.text }}>Pacientes {patients.length > 0 && <span style={{ color:C.textMuted, fontWeight:400, fontSize:13 }}>({patients.length})</span>}</span>
          <button onClick={() => setShowForm(!showForm)} style={primaryBtn({ padding:"9px 18px", fontSize:13 })}>
            {showForm ? "Cancelar" : "+ Novo Paciente"}
          </button>
        </div>

        {showForm && (
          <div style={{ ...cardStyle(), marginBottom:16, border:`1px solid ${C.green}50` }}>
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
              {[
                {k:"nome",l:"Nome completo",pl:"Nome do paciente"},
                {k:"dataNasc",l:"Nascimento",pl:"",type:"date"},
                {k:"sexo",l:"Sexo",type:"select",opts:["","Feminino","Masculino","Outro"]},
                {k:"profissao",l:"Profissão",pl:"Profissão"},
                {k:"convenio",l:"Convênio",type:"select",opts:["","Particular","Unimed","Bradesco Saúde","Amil","SulAmérica","Hapvida","NotreDame","IPSEMG","SUS / NASF","Outro"]},
                {k:"telefone",l:"Telefone",pl:"(99) 99999-9999"},
                {k:"peso",l:"Peso (kg)",pl:"kg"},
                {k:"altura",l:"Altura (cm)",pl:"cm"},
              ].map(({k,l,pl,type,opts}) => (
                <div key={k}>
                  <span style={lbl()}>{l}</span>
                  {opts ? (
                    <select value={f[k]} onChange={e => setF(p=>({...p,[k]:e.target.value}))} style={sel()}>
                      {opts.map(o => <option key={o} value={o}>{o||"Selecionar…"}</option>)}
                    </select>
                  ) : (
                    <input type={type||"text"} value={f[k]} placeholder={pl||""} onChange={e => setF(p=>({...p,[k]:e.target.value}))} style={inp()} />
                  )}
                </div>
              ))}
            </div>
            <button onClick={handleAdd} disabled={!f.nome.trim()} style={{...primaryBtn({width:"100%",justifyContent:"center",padding:"11px",fontSize:14}),opacity:f.nome.trim()?1:0.4,cursor:f.nome.trim()?"pointer":"not-allowed"}}>Cadastrar Paciente</button>
          </div>
        )}

        {patients.length === 0 && !showForm && (
          <div style={{ ...cardStyle(), textAlign:"center", padding:"48px 24px" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🩺</div>
            <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:6 }}>Nenhum paciente cadastrado</div>
            <div style={{ fontSize:13, color:C.textMuted, marginBottom:18 }}>Clique em "+ Novo Paciente" para começar</div>
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {[...patients].reverse().map(p => (
            <button key={p.id} onClick={() => onSelect(p)} style={{
              background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 18px", cursor:"pointer",
              textAlign:"left", fontFamily:F, color:C.text, display:"flex", alignItems:"center", gap:14, width:"100%",
              transition:"all 0.12s"
            }}>
              <div style={{ width:40, height:40, background:C.greenBg, border:`1px solid ${C.green}40`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, color:C.green, flexShrink:0 }}>{p.nome[0]?.toUpperCase()}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:14, color:C.text, marginBottom:2 }}>{p.nome}</div>
                <div style={{ fontSize:11, color:C.textMuted, display:"flex", gap:8, flexWrap:"wrap" }}>
                  {p.sexo && <span>{p.sexo}</span>}
                  {p.dataNasc && <span>Nasc: {p.dataNasc}</span>}
                  {p.profissao && <span>{p.profissao}</span>}
                  {p.convenio && <span>{p.convenio}</span>}
                </div>
              </div>
              <span style={{ color:C.green, fontSize:16 }}>→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function Sasyra() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("sasyra_theme") || "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("sasyra_theme", theme);
  }, [theme]);

  const [patients, setPatients] = useState(() => { try { const d = localStorage.getItem("sasyra_patients"); return d ? JSON.parse(d) : []; } catch { return []; } });
  const [patientView, setPatientView] = useState(true);
  const [tab, setTab] = useState("avaliacao");
  const [regiao, setRegiao] = useState("Centro-Oeste");
  const [assessmentHistory, setAssessmentHistory] = useState(() => { try { const d = localStorage.getItem("sasyra_assessments"); return d ? JSON.parse(d) : []; } catch { return []; } });

  // Patient
  const [pt, setPt] = useState({ nome:"", dataNasc:"", sexo:"", lateralidade:"", estadoCivil:"", profissao:"", convenio:"", sessoesAuth:"", telefone:"", peso:"", altura:"", data:new Date().toISOString().slice(0,10) });
  const up = (k,v) => setPt(p=>({...p,[k]:v}));

  const selectPatient = (p) => {
    if (queixa || hda || localDor.length > 0) saveAssessment();
    setPt({ ...pt, ...p });
    const pid = p.id || p.nome;
    const patientAssessments = assessmentHistory.filter(a => a.patientId === pid);
    if (patientAssessments.length > 0) {
      patientAssessments.sort((a, b) => (b.id || 0) - (a.id || 0));
      loadAssessment(patientAssessments[0]);
    } else {
      resetAssessment();
    }
    setPatientView(false);
  };

  const addPatient = (p) => setPatients(ps => [...ps, p]);

  const handleLogout = () => { setUser(null); setPatientView(true); setPatients([]); setAssessmentHistory([]); };

  // Anamnese
  const [queixa, setQueixa] = useState("");
  const [queixaKey, setQueixaKey] = useState("");
  const [localDor, setLocalDor] = useState([]);
  const [caraterDor, setCaraterDor] = useState([]);
  const [tempoDor, setTempoDor] = useState("");
  const [melhora, setMelhora] = useState([]);
  const [piora, setPiora] = useState([]);
  const [hda, setHda] = useState("");
  const [comorbid, setComorbid] = useState([]);
  const [antec, setAntec] = useState([]);
  const [meds, setMeds] = useState("");
  const [yellowFlagsState, setYellowFlagsState] = useState([]);

  // Funcional
  const [evaMov, setEvaMov] = useState(null);
  const [evaRep, setEvaRep] = useState(null);
  const [avds, setAvds] = useState([]);
  const [objTrat, setObjTrat] = useState([]);
  const [nivelAti, setNivelAti] = useState("");

  // Físico
  const [postura, setPostura] = useState([]);
  const [marcha, setMarcha] = useState("");
  const [edema, setEdema] = useState("");
  const [palpacao, setPalpacao] = useState("");
  const [sensib, setSensib] = useState("");
  const [reflexos, setReflexos] = useState("");
  const [forca, setForca] = useState([]);
  const addF = () => setForca(f=>[...f,{id:_gId++,muscle:"",value:""}]);
  const updF = (id,row) => setForca(f=>f.map(r=>r.id===id?row:r));
  const remF = id => setForca(f=>f.filter(r=>r.id!==id));

  // Goniometria
  const [gonio, setGonio] = useState([{id:1,joint:"",movement:"",value:""}]);
  const addG = () => setGonio(g=>[...g,{id:_gId++,joint:"",movement:"",value:""}]);
  const updG = (id,row) => setGonio(g=>g.map(r=>r.id===id?row:r));
  const remG = id => setGonio(g=>g.filter(r=>r.id!==id));

  // Testes
  const [tests, setTests] = useState({});

  // Obs / IA
  const [obs, setObs] = useState("");
  const [aiLoad, setAiLoad] = useState(false);
  const [aiRes, setAiRes] = useState("");

  // Evolução
  const [logs, setLogs] = useState(() => { try { const d = localStorage.getItem("sasyra_logs"); return d ? JSON.parse(d) : []; } catch { return []; } });
  const [df, setDf] = useState({ data:new Date().toISOString().slice(0,10), eva:5, procedimentos:[], resposta:"", evolucao:"", metas:"", escalas:"", pa:"" });
  const [expandedCats, setExpandedCats] = useState([]);

  // ── localStorage ─────────────────────────────────────────────────────────
  useEffect(() => { const t = setTimeout(() => { try { localStorage.setItem("sasyra_patients", JSON.stringify(patients)); } catch { /* storage full or unavailable */ } }, 500); return () => clearTimeout(t); }, [patients]);
  useEffect(() => { const t = setTimeout(() => { try { localStorage.setItem("sasyra_assessments", JSON.stringify(assessmentHistory)); } catch { /* storage full or unavailable */ } }, 500); return () => clearTimeout(t); }, [assessmentHistory]);
  useEffect(() => { const t = setTimeout(() => { try { localStorage.setItem("sasyra_logs", JSON.stringify(logs)); } catch { /* storage full or unavailable */ } }, 500); return () => clearTimeout(t); }, [logs]);

  const currentLogs = logs.filter(l => l.patientId === (pt.id || pt.nome));

  const kb = KB[queixaKey];
  const evidence = EVIDENCE[queixaKey];
  const cifSuggestions = evidence?.cif || [];
  const autoCIF = generateCIF({ evaMov, evaRep, avds, localDor, gonio, tests, yellowFlags:yellowFlagsState, tempoDor });
  const imc = calcIMC(pt.peso, pt.altura);

  const isEvaValid = evaMov !== null && evaMov !== undefined && evaMov !== "";
  const hasFilledTests = kb && Object.keys(tests||{}).length > 0 && Object.values(tests).some(v=>v!==""&&v!==undefined&&v!==null&&v!=="Não realizado");
  const { steps:progSteps, pct:progPct } = useProgress(pt, queixa, isEvaValid?evaMov:null, gonio, hasFilledTests?tests:{}, kb);

  // ── Assessment History ─────────────────────────────────────────────────────
  const saveAssessment = () => {
    if (!pt.id && !pt.nome) return;
    setAssessmentHistory(prev => [...prev, {
      id:Date.now(), date:new Date().toISOString().slice(0,10), patientId:pt.id||pt.nome,
      queixa, queixaKey, localDor, caraterDor, tempoDor, melhora, piora, hda,
      comorbid, antec, meds, yellowFlagsState, evaMov, evaRep, avds, objTrat, nivelAti,
      postura, marcha, edema, palpacao, sensib, reflexos, forca, gonio, tests, obs, regiao,
    }]);
  };
  const loadAssessment = (a) => {
    setQueixa(a.queixa||""); setQueixaKey(a.queixaKey||"");
    setLocalDor(a.localDor||[]); setCaraterDor(a.caraterDor||[]);
    setTempoDor(a.tempoDor||""); setMelhora(a.melhora||[]); setPiora(a.piora||[]);
    setHda(a.hda||""); setComorbid(a.comorbid||[]); setAntec(a.antec||[]);
    setMeds(a.meds||""); setYellowFlagsState(a.yellowFlagsState||[]);
    setEvaMov(a.evaMov??null); setEvaRep(a.evaRep??null);
    setAvds(a.avds||[]); setObjTrat(a.objTrat||[]); setNivelAti(a.nivelAti||"");
    setPostura(a.postura||[]); setMarcha(a.marcha||""); setEdema(a.edema||"");
    setPalpacao(a.palpacao||""); setSensib(a.sensib||""); setReflexos(a.reflexos||"");
    setForca(Array.isArray(a.forca) ? a.forca : (a.forca && typeof a.forca === "object" ? Object.entries(a.forca).filter(([,v])=>v).map(([k,v])=>({id:_gId++,muscle:k,value:v})) : []));
    setGonio(a.gonio||[{id:1,joint:"",movement:"",value:""}]);
    setTests(a.tests||{}); setObs(a.obs||""); setRegiao(a.regiao||"Centro-Oeste");
  };
  const resetAssessment = () => {
    setQueixa(""); setQueixaKey(""); setLocalDor([]); setCaraterDor([]);
    setTempoDor(""); setMelhora([]); setPiora([]); setHda("");
    setComorbid([]); setAntec([]); setMeds(""); setYellowFlagsState([]);
    setEvaMov(null); setEvaRep(null); setAvds([]); setObjTrat([]); setNivelAti("");
    setPostura([]); setMarcha(""); setEdema(""); setPalpacao(""); setSensib("");
    setReflexos("");     setForca([]);
    setGonio([{id:1,joint:"",movement:"",value:""}]);
    setTests({}); setObs(""); setRegiao("Centro-Oeste");
  };

  // ── AI call ───────────────────────────────────────────────────────────────
  const runAI = async () => {
    setAiLoad(true); setAiRes("");
    try {
      const summary = [
        `Paciente: ${pt.nome}, ${pt.sexo}, nasc. ${pt.dataNasc}, profissão: ${pt.profissao}`,
        `IMC: ${imc?.value||"—"} (${imc?.l||"—"}), Peso: ${pt.peso}kg, Altura: ${pt.altura}cm`,
        `Queixa: ${queixa}`,
        `Local: ${localDor.join(", ")} | Caráter: ${caraterDor.join(", ")} | Tempo: ${tempoDor}`,
        `Melhora: ${melhora.join(", ")} | Piora: ${piora.join(", ")}`,
        `HDA: ${hda}`,
        `EVA mov: ${evaMov}/10 | EVA rep: ${evaRep}/10`,
        `Nível atividade: ${nivelAti} | AVDs comprometidas: ${avds.join(", ")}`,
        `Postura: ${postura.join(", ")} | Marcha: ${marcha}`,
        `Edema: ${edema} | Sensibilidade: ${sensib} | Reflexos: ${reflexos}`,
        `Força: ${forca.filter(r=>r.value).map(r=>`${r.muscle}:${r.value}`).join(", ")}`,
        `Goniometria: ${gonio.filter(g=>g.value).map(g=>`${g.joint} ${g.movement}:${g.value}°`).join("; ")}`,
        `Testes: ${Object.entries(tests).filter(([,v])=>v&&v!=="Não realizado").map(([k,v])=>`${k}:${v}`).join("; ")}`,
        `Comorbidades: ${comorbid.join(", ")} | Antecedentes: ${antec.join(", ")} | Medicamentos: ${meds}`,
        `Yellow flags: ${yellowFlagsState.join(", ")}`,
        `CIF auto: ${autoCIF.map(c=>`${c.code}(${c.qualifier})`).join(", ")}`,
        `Observações: ${obs}`,
      ].join("\n");

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-6", max_tokens:1000,
          messages:[{role:"user",content:
`Você é fisioterapeuta ortopédico especialista em medicina baseada em evidências (PEDro, Cochrane, CPGs internacionais).
Com base nos dados clínicos abaixo, forneça análise estruturada e atualizada:

1. HIPÓTESE DIAGNÓSTICA FUNCIONAL (CIF — lista códigos com qualificadores)
2. OBJETIVOS TERAPÊUTICOS (curto ≤4 sem / médio 4–12 sem / longo prazo)
3. PLANO DE TRATAMENTO PADRÃO-OURO (cite ensaios RCT/meta-análise com autor, ano e nível de evidência)
4. FREQUÊNCIA, DURAÇÃO E Nº DE SESSÕES SUGERIDAS (baseado em evidência)
5. PROGRESSÃO DO TRATAMENTO (critérios de avanço de fase)
6. CRITÉRIOS DE ALTA FISIOTERAPÊUTICA
7. ESCALAS FUNCIONAIS RECOMENDADAS (para mensuração de desfecho)
8. ALERTAS, CONTRAINDICAÇÕES E QUANDO ENCAMINHAR (médico, psicólogo, nutricionista)
9. ESTIMATIVA DE PROGNÓSTICO (favorável / reservado — justifique com fatores de risco)

DADOS CLÍNICOS:
${summary}

Responda em português, tópicos claros e objetivos. Seja preciso, clínico e baseado em evidências. Quando citar estudos, informe: Autor (Ano) – Nível de evidência.`
          }]
        })
      });
      const d = await res.json();
      setAiRes(d.content?.map(c=>c.text||"").join("\n")||"Sem resposta.");
    } catch { setAiRes("Erro ao consultar IA. Verifique a conexão."); }
    setAiLoad(false);
  };

  const addLog = () => {
    setLogs(l=>[{...df, id:Date.now(), patientId:pt.id||pt.nome, sessaoNum:l.filter(x=>x.patientId===(pt.id||pt.nome)).length+1},...l]);
    setDf({ data:new Date().toISOString().slice(0,10), eva:5, procedimentos:[], resposta:"", evolucao:"", metas:"", escalas:"", pa:"" });
  };

  const isMobile = useMediaQuery("(max-width:767px)");
  const [now] = useState(() => Date.now());
  const calcIdade = useMemo(() => pt.dataNasc ? `${Math.floor((now-new Date(pt.dataNasc).getTime())/31557600000)} anos` : "—", [pt.dataNasc, now]);
  const MRC_LABELS = useMemo(() => [{id:"quadricepsD",l:"Quadríceps D"},{id:"quadricepsE",l:"Quadríceps E"},{id:"isquiotibialD",l:"Isquiotibiais D"},{id:"isquiotibialE",l:"Isquiotibiais E"},{id:"gluteoD",l:"Glúteo D"},{id:"gluteoE",l:"Glúteo E"},{id:"manguitoD",l:"Manguito Rotador D"},{id:"manguitoE",l:"Manguito Rotador E"},{id:"tibialAnterior",l:"Tibial Anterior"},{id:"gastrocnemio",l:"Gastrocnêmio"},{id:"bicepsD",l:"Bíceps Braquial D"},{id:"bicepsE",l:"Bíceps Braquial E"}], []);

  // ── Render ────────────────────────────────────────────────────────────────
  if (!user) return <LoginScreen onLogin={setUser} theme={theme} onToggleTheme={() => setTheme(t => t === "dark" ? "light" : "dark")} />;
  if (patientView) return <PatientList patients={patients} onSelect={selectPatient} onAdd={addPatient} onLogout={handleLogout} user={user} />;
  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text }}>

      {/* Header */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:isMobile?"10px 12px":"0 24px", display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", minHeight:isMobile?"auto":60, gap:isMobile?8:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <LogoSVG/>
          <button onClick={()=>{if(pt.id||pt.nome)saveAssessment();setPatientView(true);}} style={ghostBtn({ padding:"5px 10px", fontSize:11 })} title="Trocar paciente">👥 Pacientes</button>
        </div>
        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
          {[["avaliacao","📋","Avaliação"],["diario","📈","Evolução"],["relatorio","📊","Relatório"],["evidencias","🔬","Evidências"]].map(([k,ic,lb])=>(
            <button key={k} onClick={()=>setTab(k)} style={{ background:tab===k?C.greenBg:"transparent", border:`1px solid ${tab===k?C.green+"50":"transparent"}`, borderRadius:8, padding:isMobile?"5px 10px":"7px 16px", fontSize:isMobile?11:13, fontWeight:tab===k?700:400, color:tab===k?C.green:C.textMuted, cursor:"pointer", fontFamily:F }}>{ic} {lb}</button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {pt.nome && (
            <>
              <div style={{ width:30, height:30, background:C.greenBg, border:`1px solid ${C.green}40`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:C.green, flexShrink:0 }}>{pt.nome[0]?.toUpperCase()}</div>
              <span style={{ fontSize:12, color:C.textSub, maxWidth:isMobile?100:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{pt.nome}</span>
            </>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"8px 24px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, maxWidth:900, margin:"0 auto" }}>
          <div style={{ display:"flex", gap:4, flex:1 }}>
            {progSteps.map(s=>(
              <div key={s.key} style={{ flex:1 }}>
                <div style={{ height:3, background:s.done?C.green:C.border, borderRadius:99, transition:"background 0.2s" }}/>
                <div style={{ fontSize:9, color:s.done?C.green:C.textDim, marginTop:3, textAlign:"center", letterSpacing:"0.06em" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize:12, fontWeight:800, color:progPct===100?C.green:C.textMuted, minWidth:36, textAlign:"right" }}>{progPct}%</div>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:"0 auto", padding:isMobile?"12px 8px":"20px 16px" }}>

        {/* ══════════════ AVALIAÇÃO ══════════════════════════════════════════ */}
        {tab==="avaliacao" && (
          <Assessment
            pt={pt} up={up} regiao={regiao} setRegiao={setRegiao}
            queixa={queixa} setQueixa={setQueixa} setQueixaKey={setQueixaKey}
            localDor={localDor} setLocalDor={setLocalDor}
            caraterDor={caraterDor} setCaraterDor={setCaraterDor}
            tempoDor={tempoDor} setTempoDor={setTempoDor}
            melhora={melhora} setMelhora={setMelhora}
            piora={piora} setPiora={setPiora}
            hda={hda} setHda={setHda}
            comorbid={comorbid} setComorbid={setComorbid}
            antec={antec} setAntec={setAntec}
            meds={meds} setMeds={setMeds}
            yellowFlagsState={yellowFlagsState} setYellowFlagsState={setYellowFlagsState}
            evaMov={evaMov} setEvaMov={setEvaMov}
            evaRep={evaRep} setEvaRep={setEvaRep}
            avds={avds} setAvds={setAvds}
            objTrat={objTrat} setObjTrat={setObjTrat}
            nivelAti={nivelAti} setNivelAti={setNivelAti}
            postura={postura} setPostura={setPostura}
            marcha={marcha} setMarcha={setMarcha}
            edema={edema} setEdema={setEdema}
            palpacao={palpacao} setPalpacao={setPalpacao}
            sensib={sensib} setSensib={setSensib}
            reflexos={reflexos} setReflexos={setReflexos}
            forca={forca} addF={addF} updF={updF} remF={remF}
            gonio={gonio} addG={addG} updG={updG} remG={remG}
            tests={tests} setTests={setTests}
            obs={obs} setObs={setObs}
            aiLoad={aiLoad} runAI={runAI} aiRes={aiRes}
            kb={kb} evidence={evidence} cifSuggestions={cifSuggestions} autoCIF={autoCIF} imc={imc}
            progSteps={progSteps} detectKB={detectKB}
            assessmentHistory={assessmentHistory} saveAssessment={saveAssessment}
            loadAssessment={loadAssessment} resetAssessment={resetAssessment}
            patientId={pt.id || pt.nome}
          />
        )}

        {/* ══════════════ EVIDÊNCIAS ══════════════════════════════════════════ */}
        {tab==="evidencias" && (
          <>
            <div style={{ marginBottom:14, padding:"12px 16px", background:C.blueBg, border:`1px solid ${C.blue}40`, borderRadius:12, fontSize:12, color:C.textSub, lineHeight:1.7 }}>
              📚 Base de evidências do SASYRA — estudos PEDro ≥ 7, meta-análises Cochrane e CPGs internacionais (JOSPT, NICE, EuroPain). Atualizado conforme guidelines 2023–2024.
            </div>
            {Object.entries(KB).map(([key, kb2])=>(
              <Section key={key} title={kb2.label} icon="🔬" badge={`${EVIDENCE[key]?.pedro?.length||0} estudos PEDro`}>
                <SubHeading>Estudos PEDro — Ensaios Clínicos</SubHeading>
                {EVIDENCE[key]?.pedro?.map(study=>(
                  <PedroCard key={study.id} study={study}/>
                ))}
                <SubHeading>Padrão-ouro atual</SubHeading>
                <div style={{ fontSize:12, color:C.textSub, lineHeight:1.7, marginBottom:10 }}>{kb2.goldStandard}</div>
                <SubHeading>Escalas de desfecho recomendadas</SubHeading>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {kb2.escalas?.map(e=>(
                    <span key={e} style={{ fontSize:11, color:C.amber, background:C.amberBg, border:`1px solid ${C.amber}30`, borderRadius:6, padding:"3px 10px" }}>{e}</span>
                  ))}
                </div>
                <SubHeading>Yellow flags desta condição</SubHeading>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {kb2.yellowFlags?.map(f=>(
                    <span key={f} style={{ fontSize:11, color:C.amber, background:C.amberBg, border:`1px solid ${C.amber}30`, borderRadius:6, padding:"2px 8px" }}>{f}</span>
                  ))}
                </div>
                <div style={{ marginTop:8, fontSize:10, color:C.textMuted }}>Atualização: {EVIDENCE[key]?.atualizacao}</div>
              </Section>
            ))}
          </>
        )}

        {/* ══════════════ DIÁRIO ══════════════════════════════════════════════ */}
        {tab==="diario" && <>
          {pt.sessoesAuth && (
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)", gap:12, marginBottom:14 }}>
              {[
                ["Sessões realizadas", currentLogs.length, C.green],
                ["Autorizadas", pt.sessoesAuth, C.amber],
                ["Restantes", Math.max(0,Number(pt.sessoesAuth)-currentLogs.length), currentLogs.length>=Number(pt.sessoesAuth)?C.red:C.blue],
              ].map(([l2,v,c])=>(
                <div key={l2} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>{l2}</div>
                  <div style={{ fontSize:30, fontWeight:900, color:c, lineHeight:1 }}>{v}</div>
                </div>
              ))}
            </div>
          )}

          <Section title="Registrar Nova Sessão" icon="📅">
            <Row cols="1fr 120px 1fr" mobileCols="1fr">
              <Field l="Data"><input type="date" value={df.data} onChange={e=>setDf(f=>({...f,data:e.target.value}))} style={inp()}/></Field>
              <Field l="P.A. (mmHg)">
                <div style={{display:"flex", gap:4, alignItems:"center"}}>
                  <input type="number" min="0" max="300" placeholder="120" value={df.pa?.split("/")[0]||""} onChange={e=>setDf(f=>({...f,pa:(e.target.value||"")+(df.pa?.includes("/")?"/"+df.pa.split("/")[1]:"/")}))} style={{...inp({textAlign:"center",padding:"9px 4px"}), flex:1}}/>
                  <span style={{color:C.textMuted,fontWeight:700,fontSize:13}}>/</span>
                  <input type="number" min="0" max="200" placeholder="80" value={df.pa?.split("/")[1]||""} onChange={e=>setDf(f=>({...f,pa:(df.pa?.split("/")[0]||"")+"/"+(e.target.value||"")}))} style={{...inp({textAlign:"center",padding:"9px 4px"}), flex:1}}/>
                </div>
              </Field>
              <EvaSlider label="EVA da sessão" value={df.eva} onChange={v=>setDf(f=>({...f,eva:v}))}/>
            </Row>
            <Field l="Procedimentos realizados">
              {PROCEDIMENTOS_CATEGORIES.map(cat=>{
                const open = expandedCats.includes(cat.category);
                return (
                  <div key={cat.category} style={{marginBottom:6}}>
                    <div onClick={()=>setExpandedCats(p=>open?p.filter(x=>x!==cat.category):[...p,cat.category])}
                      style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",padding:"8px 10px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,userSelect:"none"}}>
                      <span style={{fontSize:10,color:C.textMuted,transition:"transform 0.15s",transform:open?"rotate(90deg)":"rotate(0deg)"}}>▶</span>
                      <span style={{fontSize:12,fontWeight:700,color:C.green,flex:1}}>{cat.category}</span>
                      <span style={{fontSize:10,color:C.textDim}}>{cat.items.length} procedimento{cat.items.length>1?"s":""}</span>
                    </div>
                    {open && (
                      <div style={{padding:"8px 4px 4px 10px"}}>
                        <TagSelect options={cat.items} value={df.procedimentos} onChange={v=>setDf(f=>({...f,procedimentos:v}))}/>
                      </div>
                    )}
                  </div>
                );
              })}
            </Field>
            <Row cols="1fr 1fr" mobileCols="1fr">
              <Field l="Resposta ao tratamento">
                <SingleSelect options={["Excelente melhora","Boa melhora","Melhora parcial","Sem melhora","Piora","Intercorrência"]}
                  value={df.resposta} onChange={v=>setDf(f=>({...f,resposta:v}))} activeColor={C.green}/>
              </Field>
              <Field l="Escala aplicada nesta sessão">
                <input value={df.escalas} onChange={e=>setDf(f=>({...f,escalas:e.target.value}))} style={inp()} placeholder="Ex: ODI=32%, KOOS=58, NDI=24%…"/>
              </Field>
            </Row>
            <Field l="Meta para próxima sessão">
              <input value={df.metas} onChange={e=>setDf(f=>({...f,metas:e.target.value}))} style={inp()} placeholder="Progressão de carga, novo exercício, critério de progressão…"/>
            </Field>
            <Field l="Evolução clínica / prontuário">
              <AudioField value={df.evolucao} onChange={v=>setDf(f=>({...f,evolucao:typeof v==="function"?v(f.evolucao):v}))} rows={3}
                placeholder="Paciente refere melhora de… Apresenta… Realizado… Tolerou bem…"/>
            </Field>
            <button onClick={addLog} style={primaryBtn()}>+ Salvar sessão</button>
          </Section>

          {currentLogs.length >= 2 && (
            <Section title="Evolução da Dor (EVA)" icon="📈">
              <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:80, padding:"0 4px" }}>
                {[...currentLogs].map((l,i)=>{
                  const h=(l.eva/10)*72;
                  const c=l.eva<=3?C.green:l.eva<=6?C.amber:C.red;
                  return (
                    <div key={l.id} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                      <span style={{ fontSize:9, color:c, fontWeight:700 }}>{l.eva}</span>
                      <div style={{ width:"100%", height:h, background:c, borderRadius:"4px 4px 0 0", opacity:0.8 }}/>
                      <span style={{ fontSize:8, color:C.textDim }}>S{i+1}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.textMuted, marginTop:16 }}>
                <span>S1 (inicial)</span><span>S{currentLogs.length} (última)</span>
              </div>
            </Section>
          )}

          {currentLogs.length > 0 && (
            <Section title={`Histórico — ${currentLogs.length} sessão(ões)`} icon="📋">
              {currentLogs.map(log=>{
                const ec=log.eva<=3?C.green:log.eva<=6?C.amber:C.red;
                return (
                  <div key={log.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px", marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:11, background:C.greenBg, color:C.green, border:`1px solid ${C.green}30`, borderRadius:6, padding:"2px 8px", fontWeight:700 }}>Sessão {log.sessaoNum}</span>
                        <span style={{ fontSize:12, color:C.textMuted }}>{log.data}</span>
                        {log.pa && <span style={{ fontSize:11, color:C.red, fontWeight:700 }}>🩺 {log.pa}</span>}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        {log.resposta && <span style={{ fontSize:11, color:C.textSub, background:C.cardAlt, borderRadius:6, padding:"2px 8px" }}>{log.resposta}</span>}
                        <span style={{ fontSize:22, fontWeight:900, color:ec, lineHeight:1 }}>{log.eva}<span style={{ fontSize:11, fontWeight:400, color:C.textMuted }}>/10</span></span>
                      </div>
                    </div>
                    {log.procedimentos.length>0 && (
                      <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:8 }}>
                        {log.procedimentos.map(p=><span key={p} style={{ fontSize:10, color:C.textMuted, background:C.card, border:`1px solid ${C.border}`, borderRadius:6, padding:"2px 7px" }}>{p}</span>)}
                      </div>
                    )}
                    {log.escalas && <div style={{ fontSize:11, color:C.blue, marginBottom:4 }}>📏 {log.escalas}</div>}
                    {log.evolucao && <p style={{ margin:"4px 0", fontSize:13, color:C.text, lineHeight:1.6 }}>{log.evolucao}</p>}
                    {log.metas && <p style={{ margin:"6px 0 0", fontSize:11, color:C.textMuted }}>→ Próxima: {log.metas}</p>}
                  </div>
                );
              })}
            </Section>
          )}
        </>}

        {/* ══════════════ RELATÓRIO ═══════════════════════════════════════════ */}
        {tab==="relatorio" && (
          <Section title="Relatório Clínico Multidisciplinar" icon="📊">
            <div style={{ background:"#fff", borderRadius:12, padding:28, color:"#1a202c", fontFamily:F, fontSize:13, lineHeight:1.6 }}>

              {/* ── Cabeçalho profissional ─────────────────────────────────── */}
              <div style={{ display:"flex", alignItems:"flex-start", gap:16, borderBottom:"3px solid #4ADE80", paddingBottom:14, marginBottom:22 }}>
                <svg viewBox="0 0 220 50" width="120" height="32" style={{ flexShrink:0 }}>
                  <g transform="translate(18,25)">
                    <path d="M -12 7 C -7 2,0 0,12 -7" fill="none" stroke="#4ADE80" strokeWidth="3.5" strokeLinecap="round"/>
                    <path d="M -12 -3 C -3 0,3 2,12 8" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round"/>
                    <circle cx="0" cy="0" r="4" fill="#FBBF24"/>
                  </g>
                  <text x="40" y="30" fill="#0E141B" fontSize="22" fontWeight="800" letterSpacing="5" fontFamily={F}>SASYRA</text>
                  <text x="42" y="44" fill="#4ADE80" fontSize="8" fontWeight="700" letterSpacing="4" fontFamily={F}>REABILITAÇÃO E EVIDÊNCIA</text>
                </svg>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, fontSize:15, color:"#0E141B" }}>RELATÓRIO DE AVALIAÇÃO FISIOTERAPÊUTICA</div>
                  <div style={{ fontSize:11, color:"#7C8FA6", marginTop:2 }}>
                    {new Date().toLocaleDateString("pt-BR")} · Para equipe multidisciplinar
                  </div>
                  <div style={{ fontSize:11, color:"#7C8FA6", marginTop:1 }}>
                    <strong style={{ color:"#374151" }}>{user.nome}</strong> — {PROF_LABELS[user.prof] || user.prof}{user.crefito ? ` · ${user.crefito}` : ""}
                  </div>
                </div>
              </div>

              {/* ── Identificação do paciente ──────────────────────────────── */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontWeight:800, color:"#0F6E56", fontSize:12, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10, borderBottom:"1px solid #E2E8F0", paddingBottom:6 }}>Identificação do Paciente</div>
                <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(180px,1fr))", gap:8 }}>
                  {[
                    ["Nome", pt.nome || "—"],
                    ["Data de nascimento", pt.dataNasc || "—"],
                    ["Sexo", pt.sexo || "—"],
                    ["Lateralidade", pt.lateralidade || "—"],
                    ["Estado civil", pt.estadoCivil || "—"],
                    ["Profissão / Ocupação", pt.profissao || "—"],
                    ["Telefone", pt.telefone || "—"],
                    ["Convênio", pt.convenio || "—"],
                    ["Data da avaliação", pt.data || "—"],
                    ["Idade", calcIdade],
                  ].map(([k,v])=>(
                    <div key={k} style={{ display:"flex", gap:4 }}>
                      <span style={{ fontWeight:700, color:"#7C8FA6", fontSize:11, whiteSpace:"nowrap" }}>{k}:</span>
                      <span style={{ color:"#1a202c", fontSize:12 }}>{v}</span>
                    </div>
                  ))}
                </div>
                {(pt.peso || pt.altura) && (
                  <div style={{ display:"flex", gap:16, marginTop:8, fontSize:12 }}>
                    {pt.peso && <span><strong style={{color:"#7C8FA6"}}>Peso:</strong> {pt.peso} kg</span>}
                    {pt.altura && <span><strong style={{color:"#7C8FA6"}}>Altura:</strong> {pt.altura} cm</span>}
                    {imc && <span><strong style={{color:"#7C8FA6"}}>IMC:</strong> {imc.value} ({imc.l})</span>}
                  </div>
                )}
              </div>

              {/* ── Queixa principal e HDA ─────────────────────────────────── */}
              {queixa && (
                <div style={{ marginBottom:18 }}>
                  <div style={{ fontWeight:800, color:"#0F6E56", fontSize:12, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8, borderBottom:"1px solid #E2E8F0", paddingBottom:6 }}>Anamnese</div>
                  <div style={{ marginBottom:10 }}>
                    <div style={{ fontWeight:700, fontSize:12, color:"#374151", marginBottom:2 }}>Queixa principal</div>
                    <p style={{ margin:0, fontSize:13, color:"#1a202c" }}>{queixa}</p>
                  </div>
                  {hda && (
                    <div>
                      <div style={{ fontWeight:700, fontSize:12, color:"#374151", marginBottom:2 }}>História da Doença Atual (HDA)</div>
                      <p style={{ margin:0, fontSize:13, color:"#374151", lineHeight:1.7 }}>{hda}</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Caracterização da dor ──────────────────────────────────── */}
              {(localDor.length>0 || caraterDor.length>0 || tempoDor || evaMov!=null || evaRep!=null) && (
                <div style={{ marginBottom:18 }}>
                  <div style={{ fontWeight:800, color:"#0F6E56", fontSize:12, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8, borderBottom:"1px solid #E2E8F0", paddingBottom:6 }}>Avaliação da Dor</div>
                  <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"1fr 1fr 1fr", gap:8, marginBottom:10 }}>
                    {localDor.length>0 && <div style={{ fontSize:12 }}><strong style={{color:"#7C8FA6"}}>Localização:</strong><br/>{localDor.join(", ")}</div>}
                    {caraterDor.length>0 && <div style={{ fontSize:12 }}><strong style={{color:"#7C8FA6"}}>Caráter:</strong><br/>{caraterDor.join(", ")}</div>}
                    {tempoDor && <div style={{ fontSize:12 }}><strong style={{color:"#7C8FA6"}}>Duração:</strong><br/>{tempoDor}</div>}
                  </div>
                  {(melhora.length>0 || piora.length>0) && (
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
                      {melhora.length>0 && <div style={{ fontSize:12 }}><strong style={{color:"#7C8FA6"}}>Fatores de melhora:</strong> {melhora.join(", ")}</div>}
                      {piora.length>0 && <div style={{ fontSize:12 }}><strong style={{color:"#7C8FA6"}}>Fatores de piora:</strong> {piora.join(", ")}</div>}
                    </div>
                  )}
                  {(evaMov!=null || evaRep!=null) && (
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:8 }}>
                      {[[evaMov,"EVA — Movimento"],[evaRep,"EVA — Repouso"]].map(([v,l2])=>{
                        if (v==null && v!==0) return null;
                        const bc=v>=7?"#FEF2F2":v>=4?"#FFFBEB":"#F0FDF4";
                        const tc=v>=7?"#E24B4A":v>=4?"#BA7517":"#3B6D11";
                        return (
                          <div key={l2} style={{ background:bc, borderRadius:8, padding:"10px 14px", textAlign:"center" }}>
                            <div style={{ fontSize:11, color:"#7C8FA6", fontWeight:700, marginBottom:2 }}>{l2}</div>
                            <span style={{ fontSize:28, fontWeight:900, color:tc }}>{v}<span style={{ fontSize:12, fontWeight:400 }}>/10</span></span>
                            <div style={{ fontSize:11, color:tc, fontWeight:600 }}>{v===0?"Sem dor":v<=3?"Leve":v<=6?"Moderada":v<=8?"Intensa":"Máxima"}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── Funcionalidade ─────────────────────────────────────────── */}
              {(nivelAti || avds.length>0 || objTrat.length>0) && (
                <div style={{ marginBottom:18 }}>
                  <div style={{ fontWeight:800, color:"#0F6E56", fontSize:12, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8, borderBottom:"1px solid #E2E8F0", paddingBottom:6 }}>Função e Atividades</div>
                  {nivelAti && <div style={{ fontSize:12, marginBottom:6 }}><strong style={{color:"#7C8FA6"}}>Nível de atividade física:</strong> {nivelAti}</div>}
                  {avds.length>0 && <div style={{ fontSize:12, marginBottom:6 }}><strong style={{color:"#7C8FA6"}}>AVDs comprometidas:</strong> {avds.join(", ")}</div>}
                  {objTrat.length>0 && <div style={{ fontSize:12 }}><strong style={{color:"#7C8FA6"}}>Objetivos do paciente:</strong> {objTrat.join(", ")}</div>}
                </div>
              )}

              {/* ── Exame Físico ───────────────────────────────────────────── */}
              {(postura.length>0 || marcha || edema || palpacao || sensib || reflexos || forca.some(r=>r.value)) && (
                <div style={{ marginBottom:18 }}>
                  <div style={{ fontWeight:800, color:"#0F6E56", fontSize:12, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8, borderBottom:"1px solid #E2E8F0", paddingBottom:6 }}>Exame Físico</div>
                  <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:8, marginBottom:8 }}>
                    {postura.length>0 && <div style={{ fontSize:12 }}><strong style={{color:"#7C8FA6"}}>Postura:</strong> {postura.join(", ")}</div>}
                    {marcha && <div style={{ fontSize:12 }}><strong style={{color:"#7C8FA6"}}>Marcha:</strong> {marcha}</div>}
                    {edema && <div style={{ fontSize:12 }}><strong style={{color:"#7C8FA6"}}>Edema/Sinais:</strong> {edema}</div>}
                    {sensib && <div style={{ fontSize:12 }}><strong style={{color:"#7C8FA6"}}>Sensibilidade:</strong> {sensib}</div>}
                    {reflexos && <div style={{ fontSize:12 }}><strong style={{color:"#7C8FA6"}}>Reflexos:</strong> {reflexos}</div>}
                  </div>
                  {palpacao && <div style={{ fontSize:12, marginBottom:8 }}><strong style={{color:"#7C8FA6"}}>Palpação:</strong> {palpacao}</div>}
                  {forca.some(r=>r.value) && (
                    <div style={{ marginTop:8 }}>
                      <div style={{ fontWeight:700, fontSize:12, color:"#374151", marginBottom:4 }}>Força Muscular (MRC 0–5)</div>
                      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                        <thead><tr style={{ background:"#F8FAFC" }}>
                          {["Músculo / Grupo","Grau"].map(h=><th key={h} style={{ padding:"5px 10px", textAlign:"left", fontWeight:700, fontSize:10, color:"#7C8FA6", textTransform:"uppercase" }}>{h}</th>)}
                        </tr></thead>
                        <tbody>
                          {forca.filter(r=>r.value).map(r=>{
                            const m = MRC_LABELS.find(x=>x.id===r.muscle);
                            return (
                              <tr key={r.id} style={{ borderBottom:"1px solid #F1F5F9" }}>
                                <td style={{ padding:"4px 10px" }}>{m?.l||r.muscle}</td>
                                <td style={{ padding:"4px 10px", fontWeight:700, color:Number(r.value)<3?"#E24B4A":Number(r.value)<5?"#BA7517":"#3B6D11" }}>{r.value}/5</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ── Goniometria ────────────────────────────────────────────── */}
              {gonio.filter(g=>g.value).length>0 && (
                <div style={{ marginBottom:18 }}>
                  <div style={{ fontWeight:800, color:"#0F6E56", fontSize:12, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8, borderBottom:"1px solid #E2E8F0", paddingBottom:6 }}>Goniometria</div>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                    <thead><tr style={{ background:"#F8FAFC" }}>
                      {["Articulação","Movimento","ADM","Ref.","Status"].map(h=><th key={h} style={{ padding:"5px 10px", textAlign:"left", fontWeight:700, fontSize:10, color:"#7C8FA6", textTransform:"uppercase" }}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {gonio.filter(g=>g.value).map(g=>{
                        const ref=getRef(g.movement,g.joint);
                        const oor=isOutOfRange(g.value,ref);
                        return (
                          <tr key={g.id} style={{ borderBottom:"1px solid #F1F5F9" }}>
                            <td style={{ padding:"4px 10px" }}>{g.joint}</td>
                            <td style={{ padding:"4px 10px" }}>{g.movement}</td>
                            <td style={{ padding:"4px 10px", fontWeight:800, color:oor?"#E24B4A":"#0F6E56" }}>{g.value}°</td>
                            <td style={{ padding:"4px 10px", color:"#7C8FA6" }}>{ref?`${ref}°`:"—"}</td>
                            <td style={{ padding:"4px 10px", fontSize:11, color:oor?"#E24B4A":"#3B6D11", fontWeight:700 }}>{oor?"↓ Limitado":"Normal"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── Testes especiais ───────────────────────────────────────── */}
              {Object.entries(tests).filter(([,v])=>v&&v!=="Não realizado").length>0 && (
                <div style={{ marginBottom:18 }}>
                  <div style={{ fontWeight:800, color:"#0F6E56", fontSize:12, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8, borderBottom:"1px solid #E2E8F0", paddingBottom:6 }}>Testes Especiais</div>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                    <thead><tr style={{ background:"#F8FAFC" }}>
                      {["Teste","Resultado"].map(h=><th key={h} style={{ padding:"5px 10px", textAlign:"left", fontWeight:700, fontSize:10, color:"#7C8FA6", textTransform:"uppercase" }}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {Object.entries(tests).filter(([,v])=>v&&v!=="Não realizado").map(([k,v])=>(
                        <tr key={k} style={{ borderBottom:"1px solid #F1F5F9" }}>
                          <td style={{ padding:"4px 10px" }}>{k}</td>
                          <td style={{ padding:"4px 10px", fontWeight:700, color:v==="Positivo"?"#E24B4A":"#3B6D11" }}>{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── Histórico e comorbidades ───────────────────────────────── */}
              {(comorbid.length>0 || antec.length>0 || meds) && (
                <div style={{ marginBottom:18 }}>
                  <div style={{ fontWeight:800, color:"#0F6E56", fontSize:12, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8, borderBottom:"1px solid #E2E8F0", paddingBottom:6 }}>Histórico Clínico</div>
                  {comorbid.length>0 && <div style={{ fontSize:12, marginBottom:4 }}><strong style={{color:"#7C8FA6"}}>Comorbidades:</strong> {comorbid.join(", ")}</div>}
                  {antec.length>0 && <div style={{ fontSize:12, marginBottom:4 }}><strong style={{color:"#7C8FA6"}}>Antecedentes / Cirurgias:</strong> {antec.join(", ")}</div>}
                  {meds && <div style={{ fontSize:12 }}><strong style={{color:"#7C8FA6"}}>Medicamentos em uso:</strong> {meds}</div>}
                </div>
              )}

              {/* ── Yellow Flags ───────────────────────────────────────────── */}
              {yellowFlagsState.length>0 && (
                <div style={{ marginBottom:18 }}>
                  <div style={{ fontWeight:800, color:"#B45309", fontSize:12, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8, borderBottom:"1px solid #FDE68A", paddingBottom:6 }}>Fatores Psicossociais — Yellow Flags</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:6 }}>
                    {yellowFlagsState.map(f=><span key={f} style={{ fontSize:11, background:"#FFFBEB", color:"#B45309", border:"1px solid #FCD34D", borderRadius:6, padding:"2px 10px" }}>{f}</span>)}
                  </div>
                  {yellowFlagsState.length>=3 && <div style={{ fontSize:11, color:"#92400E", fontStyle:"italic" }}>⚠ Presença de múltiplos yellow flags — considerar abordagem biopsicossocial (PNE, CFT) e avaliação psicológica.</div>}
                </div>
              )}

              {/* ── CIF ────────────────────────────────────────────────────── */}
              {autoCIF.length>0 && (
                <div style={{ marginBottom:18 }}>
                  <div style={{ fontWeight:800, color:"#0F6E56", fontSize:12, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8, borderBottom:"1px solid #E2E8F0", paddingBottom:6 }}>Classificação CIF — Diagnóstico Funcional</div>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                    <thead><tr style={{ background:"#F8FAFC" }}>
                      {["Código","Descrição","Qualificador"].map(h=><th key={h} style={{ padding:"5px 10px", textAlign:"left", fontWeight:700, fontSize:10, color:"#7C8FA6", textTransform:"uppercase" }}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {autoCIF.map(c=>(
                        <tr key={c.code} style={{ borderBottom:"1px solid #F1F5F9" }}>
                          <td style={{ padding:"4px 10px", fontWeight:800, color:"#6B46C1" }}>{c.code}</td>
                          <td style={{ padding:"4px 10px" }}>{c.desc}</td>
                          <td style={{ padding:"4px 10px", fontWeight:700, fontSize:11, color:c.qualifier>=3?"#E24B4A":c.qualifier>=2?"#BA7517":"#3B6D11" }}>{c.qualifier} — {["Sem dificuldade","Dificuldade leve","Dificuldade moderada","Dificuldade grave","Dificuldade completa"][c.qualifier]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── Observações ────────────────────────────────────────────── */}
              {obs && (
                <div style={{ marginBottom:18 }}>
                  <div style={{ fontWeight:800, color:"#0F6E56", fontSize:12, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8, borderBottom:"1px solid #E2E8F0", paddingBottom:6 }}>Observações Clínicas</div>
                  <p style={{ margin:0, fontSize:13, color:"#374151", lineHeight:1.7, whiteSpace:"pre-wrap" }}>{obs}</p>
                </div>
              )}

              {/* ── Plano de tratamento (AI) ───────────────────────────────── */}
              {aiRes && (
                <div style={{ marginBottom:18 }}>
                  <div style={{ fontWeight:800, color:"#0F6E56", fontSize:12, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8, borderBottom:"1px solid #E2E8F0", paddingBottom:6 }}>Plano de Tratamento — Análise Baseada em Evidências</div>
                  <div style={{ fontSize:12, whiteSpace:"pre-wrap", background:"#F8FAFC", borderRadius:8, padding:14, lineHeight:1.8, color:"#1a202c" }}>{aiRes}</div>
                </div>
              )}

              {/* ── Evolução ───────────────────────────────────────────────── */}
              {currentLogs.length>0 && (
                <div style={{ marginBottom:18 }}>
                  <div style={{ fontWeight:800, color:"#0F6E56", fontSize:12, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8, borderBottom:"1px solid #E2E8F0", paddingBottom:6 }}>Evolução — {currentLogs.length} sessão(ões) realizadas</div>
                  {[...currentLogs].reverse().slice(0,10).map(l=>(
                    <div key={l.id} style={{ borderLeft:"3px solid #4ADE80", paddingLeft:12, marginBottom:10 }}>
                      <div style={{ fontSize:11, color:"#7C8FA6", marginBottom:2 }}>
                        <strong>Sessão {l.sessaoNum}</strong> · {l.data} · EVA {l.eva}/10{l.resposta?` · ${l.resposta}`:""}
                      </div>
                      {l.procedimentos?.length>0 && <div style={{ fontSize:11, color:"#374151", marginBottom:2 }}>Procedimentos: {l.procedimentos.join(", ")}</div>}
                      {l.escalas && <div style={{ fontSize:11, color:"#6B46C1", marginBottom:2 }}>📏 {l.escalas}</div>}
                      {l.evolucao && <div style={{ fontSize:12, color:"#374151", lineHeight:1.6 }}>{l.evolucao}</div>}
                      {l.metas && <div style={{ fontSize:11, color:"#7C8FA6", marginTop:2 }}>→ Meta: {l.metas}</div>}
                    </div>
                  ))}
                  {currentLogs.length>10 && <div style={{ fontSize:11, color:"#7C8FA6", fontStyle:"italic" }}>... e mais {currentLogs.length-10} sessão(ões). Consulte o prontuário completo.</div>}
                </div>
              )}

              {/* ── Recomendações para encaminhamento ──────────────────────── */}
              <div style={{ marginBottom:18, background:"#F0FDF4", borderRadius:8, padding:"12px 16px", border:"1px solid #BBF7D0" }}>
                <div style={{ fontWeight:800, color:"#166534", fontSize:11, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>🔗 Para outros profissionais</div>
                <div style={{ fontSize:12, color:"#374151", lineHeight:1.7 }}>
                  {kb ? (
                    <>Paciente em tratamento fisioterapêutico para {kb.label}, conforme protocolo baseado em evidências. Avaliação multidimensional realizada, incluindo CIF e fatores psicossociais. Solicita-se colaboração interdisciplinar conforme necessário.</>
                  ) : (
                    <>Paciente em avaliação fisioterapêutica. Favor considerar encaminhamento para avaliação médica, psicológica ou nutricional se houver indicação clínica.</>
                  )}
                  {yellowFlagsState.length>=3 && <> Recomenda-se avaliação psicológica para manejo de fatores psicossociais.</>}
                  {imc && (Number(imc.value)>=30) && <> Recomenda-se avaliação nutricional para manejo de obesidade.</>}
                </div>
              </div>

              {/* ── Rodapé ─────────────────────────────────────────────────── */}
              <div style={{ borderTop:"1px solid #E2E8F0", marginTop:20, paddingTop:14, fontSize:10, color:"#94A3B8", textAlign:"center", lineHeight:1.8 }}>
                {user.nome} — {PROF_LABELS[user.prof] || user.prof}{user.crefito ? ` · ${user.crefito}` : ""}<br/>
                SASYRA — Reabilitação e Evidência · Documento gerado em {new Date().toLocaleString("pt-BR")} · Para equipe multidisciplinar
              </div>
            </div>
            <div style={{ marginTop:14, display:"flex", gap:10, flexWrap:"wrap" }}>
              <button onClick={()=>window.print()} style={primaryBtn()}>🖨️ Imprimir / PDF</button>
            </div>
          </Section>
        )}

      </div>
    </div>
  );
}