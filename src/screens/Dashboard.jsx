import { useState, useRef, useEffect, useCallback } from "react";
import Agenda from "./Agenda";

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:          "#0E141B",
  surface:     "#111822",
  card:        "#19243A",
  cardAlt:     "#162030",
  border:      "#1F2E45",
  borderLight: "#2A3F5C",
  green:       "#4ADE80",
  greenDim:    "#22C55E",
  greenDeep:   "#0D9E5C",
  greenBg:     "rgba(74,222,128,0.09)",
  greenBgHov:  "rgba(74,222,128,0.16)",
  amber:       "#FBBF24",
  amberBg:     "rgba(251,191,36,0.10)",
  red:         "#F87171",
  redBg:       "rgba(248,113,113,0.09)",
  blue:        "#60A5FA",
  blueBg:      "rgba(96,165,250,0.09)",
  purple:      "#A78BFA",
  purpleBg:    "rgba(167,139,250,0.09)",
  text:        "#DDE6F0",
  textSub:     "#A8BECC",
  textMuted:   "#5E7A96",
  textDim:     "#364D62",
  white:       "#FFFFFF",
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
function calcIMC(peso, altura) {
  const p = parseFloat(peso), h = parseFloat(altura)/100;
  if (!p || !h || h <= 0) return null;
  const v = p / (h*h);
  const cat = v < 18.5 ? {l:"Baixo peso", c:C.blue} : v < 25 ? {l:"Peso normal", c:C.green} : v < 30 ? {l:"Sobrepeso", c:C.amber} : {l:"Obeso", c:C.red};
  return { value: v.toFixed(1), ...cat };
}

// ── CREFITO Honorários (Resolução COFFITO 424/2013 + tabela 2024) ─────────────
const CREFITO_REGIOES = {
  "Sul (RS/SC/PR)":         { consulta: 180, sessao: 160, avaliacao: 250, relatorio: 120 },
  "Sudeste SP":             { consulta: 220, sessao: 200, avaliacao: 320, relatorio: 150 },
  "Sudeste RJ/ES/MG":       { consulta: 190, sessao: 170, avaliacao: 280, relatorio: 130 },
  "Centro-Oeste":           { consulta: 170, sessao: 150, avaliacao: 240, relatorio: 110 },
  "Nordeste":               { consulta: 150, sessao: 140, avaliacao: 220, relatorio: 100 },
  "Norte":                  { consulta: 140, sessao: 130, avaliacao: 210, relatorio: 95  },
};

// ── CIF dictionary (expandido) ────────────────────────────────────────────────
const CIF = {
  b280:"Sensação de dor", b28010:"Dor em cabeça e pescoço", b28013:"Dor nas costas",
  b28014:"Dor em membro superior", b28015:"Dor em membro inferior",
  b7300:"Força de grupos musculares isolados", b7350:"Tônus de grupos musculares isolados",
  b7400:"Resistência de grupos musculares isolados", b710:"Mobilidade das articulações",
  b715:"Estabilidade das articulações", b730:"Força muscular",
  b770:"Padrão de marcha", b780:"Sensações relacionadas aos músculos e funções do movimento",
  d410:"Mudar posição corporal básica", d415:"Manter posição corporal",
  d430:"Levantar e transportar objetos", d445:"Uso da mão e do braço",
  d450:"Andar", d455:"Deslocar-se", d4551:"Subir/descer escadas",
  d640:"Realizar tarefas domésticas", d850:"Trabalho remunerado",
  d4401:"Uso fino da mão (preensão de precisão)", d920:"Recreação e lazer",
  e1101:"Medicamentos", e355:"Profissionais de saúde",
};

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
      {name:"Distração Cervical",desc:"Alívio da compressão foraminal. Sens. ~44%, Esp. ~90%.",how:"Tracionar levemente a cabeça em posição neutra (aprox. 5–7 kg). Positivo: alívio da dor ou da irradiação. Complementar ao Spurling.",video:"https://www.youtube.com/watch?v=uLdzgd5snmw"},
      {name:"Flexion-Rotation Test (FRT)",desc:"Disfunção C1-C2 / cefaleia cervicogênica. Sens. ~91%, Esp. ~90%.",how:"Paciente em DD, flexão cervical máxima + rotação passiva bilateral. Normal ≥ 44°. Diferença > 10° entre lados = hipomobilidade C1-C2.",video:"https://www.youtube.com/watch?v=RxLJHJG8KbQ"},
      {name:"ULTT 1 – Mediano",desc:"Tensão neural do nervo mediano.",how:"Depressão escapular → abdução 90° → supinação → extensão cotovelo → extensão punho/dedos → inclinação cervical contralateral. Positivo: sintomas reproduzidos, aliviados com inclinação ipsilateral.",video:"https://www.youtube.com/watch?v=rir6x6Iiqc4"},
      {name:"ULTT 2a – Radial",desc:"Tensão neural do nervo radial.",how:"Depressão escapular → abdução 10° → RI ombro + pronação → flexão punho/dedos. Positivo: sintomas em território radial.",video:"https://www.youtube.com/watch?v=rir6x6Iiqc4"},
      {name:"Teste de Compressão Axial Cervical",desc:"Lesão discal ou foraminal.",how:"Aplicar pressão axial suave no vertex com a cabeça em posição neutra. Positivo: reprodução de dor cervical local ou irradiada.",video:"https://www.youtube.com/watch?v=3ZSNdv0o0yk"},
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
      {name:"Pivot Shift",desc:"LCA – Instabilidade rotacional. Esp. ~98% (confirmatório).",how:"Valgo + RI sobre o joelho estendido enquanto flexiona. Positivo: ressalto articular entre 20–40° (redução da subluxação). Mais específico que Lachman.",video:"https://www.youtube.com/watch?v=45uxqoSWC-s"},
      {name:"McMurray",desc:"Lesão meniscal medial e lateral.",how:"Flex/ext do joelho + RI (menisco lateral) e RE (menisco medial). Positivo: clunk palpável + dor na linha articular. Esp. ~98%; sens. ~53%.",video:"https://www.youtube.com/watch?v=PEdzdL3cniI"},
      {name:"Thessaly 20°",desc:"Lesão meniscal – mais sensível. Sens. ~94%, Esp. ~96%.",how:"Paciente em monopé com 20° de flexão, mãos do examinador. Rotação do corpo 3x interna/externa. Positivo: dor ou desconforto na linha articular medial ou lateral.",video:"https://www.youtube.com/watch?v=ceBtpDXWErU"},
      {name:"Valgus/Varus Stress",desc:"LCM (valgo) / LCL (varo).",how:"A 0° (integridade cápsula) e a 30° de flexão (LCM/LCL isolado). Abertura articular > 3 mm comparado ao contralateral = positivo. Grau I < 5 mm; Grau II 5–10 mm; Grau III > 10 mm.",video:"https://www.youtube.com/watch?v=GSFbttpxCuQ"},
      {name:"Clarke / Patelofemoral",desc:"Síndrome patelofemoral.",how:"Pressionar a patela superiormente/inferiormente enquanto o paciente contrai o quadríceps ativamente. Positivo: dor retropatelar. Baixa especificidade – usar em contexto clínico.",video:"https://www.youtube.com/watch?v=zu2Vyvnp43c"},
      {name:"Dial Test",desc:"Lesão do canto posterolateral (CPL).",how:"Decúbito ventral. RI comparativa a 30° e 90° de flexão. Diferença > 10° a 30° isolado = CPL; diferença > 10° a 30° e 90° = LCP + CPL.",video:"https://www.youtube.com/watch?v=Zyzg-5xUSNY"},
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
      {name:"Empty Can / Jobe",desc:"Supraespinal. Sens. ~69%, Esp. ~66%.",how:"Abdução 90° no plano da escápula (espinha da escápula), RI máxima (polegar para baixo = 'lata vazia'). Resistência manual inferior. Positivo: fraqueza ou dor.",video:"https://www.youtube.com/watch?v=5BjDQ-jcBek"},
      {name:"Full Can",desc:"Supraespinal (menos doloroso que Empty Can). Esp. superior.",how:"Mesmo que Empty Can mas com RE (polegar para cima = 'lata cheia'). Melhor tolerado e mais específico para rotura.",video:"https://www.youtube.com/watch?v=SGEIKmiP09s"},
      {name:"O'Brien (SLAP)",desc:"Labrum superior (SLAP). Sens. ~47%, Esp. ~55%.",how:"Flexão 90°, adução 15°, RI máxima (cotovelo estendido). Resistência axial. Repetir em supinação. Positivo: dor profunda ou clique que MELHORA na supinação.",video:"https://www.youtube.com/watch?v=v_EL9XqTJQQ"},
      {name:"Apreensão Anterior + Relocação",desc:"Instabilidade glenoumeral anterior.",how:"Abdução 90° + RE progressiva. Positivo: apreensão (não necessariamente dor). Relocação (pressão posterior na cabeça umeral) = alívio da apreensão. Esp. ~99% para instabilidade.",video:"https://www.youtube.com/watch?v=qKqJRrms4u8"},
      {name:"Gerber Lift-off",desc:"Subescapular.",how:"Mão nas costas (RI ombro). Levantar a mão das costas contra resistência. Positivo: incapacidade ou fraqueza.",video:"https://www.youtube.com/watch?v=t9dSDVRbjn0"},
    ],
    redFlags:["Fratura de úmero / clavícula / escápula","Luxação glenoumeral irredutível","Ruptura completa do manguito em atleta jovem < 40 anos","Tumor de Pancoast (dor ombro + Síndrome de Horner)","Infecção glenoumeral","Paresia do nervo axilar / espinal"],
    goldStandard:"Impacto subacromial sem ruptura: fortalecimento manguito + escapular SUPERIOR à cirurgia (CSAW trial Lancet 2018 – Evidência A). Ruptura parcial: conservador inicialmente 3–6 meses. Ruptura completa sintomática em < 65 anos: discussão com ortopedia. Ombro congelado: mobilização passiva progressiva + corticoide intra-articular de curto prazo (CPG JOSPT 2022).",
    yellowFlags:["Trabalho com MS elevado (overhead)","Esportista de arremesso / overhead","Dor noturna persistente (sugere ruptura)","Imobilização prolongada prévia"],
    escalas:EVIDENCE.ombralgia.escalas,
  },
  tornozelo:{
    label:"Tornozelo / Pé",
    tests:[
      {name:"Anterior Drawer",desc:"LTFA (ligamento talofibular anterior) – mais lesado. Sens. ~71%, Esp. ~33%.",how:"Segurar o calcanhar, tornozelo em 10–20° de plantarflexão. Transladar o pé anteriormente com mão plana. Comparar bilateralmente. Translação > 5 mm ou > 3 mm assimétrica = positivo.",video:"https://www.youtube.com/watch?v=vAcBEYZKcto"},
      {name:"Talar Tilt",desc:"Ligamento calcaneofibular (LCF). Sens. ~50%, Esp. ~88%.",how:"Inversão forçada passiva do pé com tornozelo em posição neutra. Comparar lado a lado. Assimetria > 5–10° = positivo. Alta especificidade.",video:"https://www.youtube.com/watch?v=UHNbm6Z3XK4"},
      {name:"Ottawa Ankle Rules",desc:"Indicação de radiografia. Sens. ~96–100%.",how:"RX indicado se: (1) dor na zona da ponta do maléolo lateral OU medial, OU (2) incapacidade de apoiar peso e dar 4 passos. Regras do pé: dor em base do 5º metatarso ou navicular.",video:"https://www.youtube.com/watch?v=rBL1r0C4a9g"},
      {name:"Windlass Test",desc:"Fasciíte plantar. Sens. ~32%, Esp. ~100%.",how:"Dorsiflexão passiva dos dedos (especialmente hálux) com paciente em pé e apoio. Positivo: reprodução de dor na inserção da fáscia plantar no calcâneo. Alta especificidade.",video:"https://www.youtube.com/watch?v=fg0PtnoAzSs"},
      {name:"Thompson (Simmonds)",desc:"Ruptura do tendão de Aquiles. Sens. ~96%, Esp. ~93%.",how:"Paciente em DV com pé fora da maca ou ajoelhado. Apertar a panturrilha no terço médio. Normal: plantarflexão passiva do pé. Positivo: ausência de movimento (gap palpável).",video:"https://www.youtube.com/watch?v=z-7cJ7LpCqY"},
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
      {name:"Teste de Golfer (Medial)",desc:"Tendinopatia medial dos flexores.",how:"Cotovelo estendido, supinação de antebraço + extensão passiva de punho. Positivo: dor no epicôndilo medial.",video:"https://www.youtube.com/watch?v=uGabYJyKsBw"},
      {name:"Valgus Stress Test",desc:"Ligamento colateral ulnar (LCU). Sens. ~65%, Esp. ~60%.",how:"Cotovelo em 20–30° de flexão. Aplicar força em valgo. Positivo: dor medial ou sensação de abertura/frouxidão.",video:"https://www.youtube.com/watch?v=3xF9_5fbJ8A"},
      {name:"Moving Valgus Stress",desc:"LCU – atletas arremessadores. Sens. ~100%, Esp. ~75%.",how:"Ombro abduzido 90°, cotovelo em flexão máxima. Valgo constante enquanto estende o cotovelo rapidamente. Positivo: dor medial entre 70–120° ('shear angle').",video:"https://www.youtube.com/watch?v=JIU_kv5VoQk"},
      {name:"Milking Maneuver",desc:"Instabilidade posteromedial / LCU.",how:"Paciente traciona o próprio polegar com cotovelo flexionado > 90° e ombro abduzido (simula arremesso). Positivo: instabilidade ou dor medial.",video:"https://www.youtube.com/watch?v=SwigwaZxBXE"},
      {name:"Lateral Pivot Shift (Cotovelo)",desc:"Instabilidade rotatória lateral (IRL).",how:"Paciente em DD, MS elevado. Supinação + valgo + compressão axial enquanto flexiona o cotovelo. Positivo: subluxação/ressalto da cabeça do rádio.",video:""},
      {name:"Elbow Flexion Test (Nervo Ulnar)",desc:"Síndrome do canal cubital. Sens. ~75%, Esp. ~99%.",how:"Flexão máxima do cotovelo + extensão do punho mantidos por 1–3 minutos. Positivo: parestesia nos dedos 4º e 5º e/ou face ulnar da mão.",video:"https://www.youtube.com/watch?v=mF3bUpeQfzs"},
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
const JOINTS = ["Coluna Cervical","Coluna Torácica","Coluna Lombar","Ombro D","Ombro E","Cotovelo D","Cotovelo E","Punho D","Punho E","Quadril D","Quadril E","Joelho D","Joelho E","Tornozelo D","Tornozelo E","ATM D","ATM E"];
const MVMT = {
  "Coluna Cervical":["Flexão","Extensão","Inclinação D","Inclinação E","Rotação D","Rotação E"],
  "Coluna Torácica":["Flexão","Extensão","Rotação D","Rotação E"],
  "Coluna Lombar":["Flexão","Extensão","Inclinação D","Inclinação E","Rotação D","Rotação E"],
  "Ombro D":["Flexão","Extensão","Abdução","Adução","RI","RE","Abdução Horiz."],
  "Ombro E":["Flexão","Extensão","Abdução","Adução","RI","RE","Abdução Horiz."],
  "Cotovelo D":["Flexão","Extensão","Pronação","Supinação"],
  "Cotovelo E":["Flexão","Extensão","Pronação","Supinação"],
  "Punho D":["Flexão","Extensão","Desvio Radial","Desvio Ulnar"],
  "Punho E":["Flexão","Extensão","Desvio Radial","Desvio Ulnar"],
  "Quadril D":["Flexão","Extensão","Abdução","Adução","RI","RE"],
  "Quadril E":["Flexão","Extensão","Abdução","Adução","RI","RE"],
  "Joelho D":["Flexão","Extensão"],"Joelho E":["Flexão","Extensão"],
  "Tornozelo D":["Dorsiflexão","Plantarflexão","Inversão","Eversão"],
  "Tornozelo E":["Dorsiflexão","Plantarflexão","Inversão","Eversão"],
  "ATM D":["Abertura","Protrusão","Desvio"],"ATM E":["Abertura","Protrusão","Desvio"],
};
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

// ── NumericDrum ───────────────────────────────────────────────────────────────
function NumericDrum({ value, onChange, min, max, step=1, unit, label: lbl2 }) {
  const inc = () => onChange(Math.min(max, (parseFloat(value)||min)+step));
  const dec = () => onChange(Math.max(min, (parseFloat(value)||min)-step));
  return (
    <div>
      <span style={lbl()}>{lbl2}</span>
      <div style={{ display:"flex", alignItems:"center", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden" }}>
        <button onClick={dec} style={{ background:"none", border:"none", color:C.textMuted, fontSize:18, padding:"0 14px", cursor:"pointer", height:44, display:"flex", alignItems:"center", borderRight:`1px solid ${C.border}` }}>−</button>
        <div style={{ flex:1, textAlign:"center" }}>
          <input type="number" value={value} min={min} max={max} step={step} onChange={e=>onChange(e.target.value)}
            style={{ ...inp(), border:"none", background:"transparent", textAlign:"center", fontSize:18, fontWeight:800, color:C.text, padding:"10px 4px" }}/>
        </div>
        <span style={{ fontSize:12, color:C.textMuted, paddingRight:10, paddingLeft:4 }}>{unit}</span>
        <button onClick={inc} style={{ background:"none", border:"none", color:C.green, fontSize:18, padding:"0 14px", cursor:"pointer", height:44, display:"flex", alignItems:"center", borderLeft:`1px solid ${C.border}` }}>+</button>
      </div>
    </div>
  );
}

// ── EvaSlider ─────────────────────────────────────────────────────────────────
function EvaSlider({ label: lbl2, value, onChange }) {
  const isDefined = value !== null && value !== "";
  const currentVal = isDefined ? value : 0;
  const pct = (currentVal / 10) * 100;
  const color = !isDefined ? C.textDim : currentVal <= 3 ? C.green : currentVal <= 6 ? C.amber : C.red;
  const faces = ["😌","😐","😟","😣","😭"];
  const face = isDefined ? faces[Math.min(4, Math.floor(currentVal / 2.5))] : "⚪";
  const desc = !isDefined ? "Não avaliado" : currentVal === 0 ? "Sem dor" : currentVal <= 3 ? "Leve" : currentVal <= 6 ? "Moderada" : currentVal <= 8 ? "Intensa" : "Máxima";
  return (
    <div style={{ opacity: isDefined ? 1 : 0.6, transition:"opacity 0.2s" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
        <span style={lbl()}>{lbl2}</span>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:20 }}>{face}</span>
          <span style={{ fontSize:24, fontWeight:900, color, lineHeight:1 }}>{isDefined ? currentVal : "—"}</span>
          <span style={{ fontSize:10, color:C.textMuted }}>{isDefined ? `/10 · ${desc}` : desc}</span>
        </div>
      </div>
      <div style={{ position:"relative", height:8, background:C.surface, borderRadius:99, border:`1px solid ${C.border}`, marginBottom:4 }}>
        {isDefined && <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${pct}%`, background:`linear-gradient(90deg, ${C.green}, ${color})`, borderRadius:99, transition:"width 0.1s" }}/>}
      </div>
      <input type="range" min="0" max="10" step="1" value={currentVal} onChange={e=>onChange(Number(e.target.value))}
        style={{ width:"100%", accentColor: isDefined ? color : C.border, cursor:"pointer", marginBottom:2 }}/>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.textDim }}>
        <span>0</span><span>5</span><span>10</span>
      </div>
    </div>
  );
}

// ── TagSelect / SingleSelect ──────────────────────────────────────────────────
function TagSelect({ options, value, onChange, activeColor=C.green }) {
  const toggle = v => onChange(value.includes(v) ? value.filter(x=>x!==v) : [...value,v]);
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
      {options.map(o => {
        const v=o.value??o, l=o.label??o, active=value.includes(v);
        return <button key={v} onClick={()=>toggle(v)} style={iconBtn(active,activeColor)}>{active && <span style={{fontSize:10}}>✓ </span>}{l}</button>;
      })}
    </div>
  );
}
function SingleSelect({ options, value, onChange, activeColor=C.green }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
      {options.map(o => {
        const v=o.value??o, l=o.label??o, active=value===v;
        return <button key={v} onClick={()=>onChange(active?"":v)} style={iconBtn(active,activeColor)}>{l}</button>;
      })}
    </div>
  );
}

// ── SessionCounter ────────────────────────────────────────────────────────────
function SessionCounter({ value, onChange }) {
  return (
    <div>
      <span style={lbl()}>Sessões autorizadas</span>
      <input type="number" min="1" max="120" value={value} onChange={e=>onChange(e.target.value)}
        style={{...inp({width:"100%",textAlign:"center",fontSize:16,fontWeight:700,padding:"12px 14px"})}} placeholder="Nº de sessões"/>
    </div>
  );
}

// ── AudioField ────────────────────────────────────────────────────────────────
function AudioField({ value, onChange, placeholder, rows=3 }) {
  const [rec, setRec] = useState(false);
  const [supported] = useState(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
  const rRef = useRef(null);
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR(); r.lang="pt-BR"; r.continuous=true; r.interimResults=false;
    r.onresult = e => { const t=Array.from(e.results).map(x=>x[0].transcript).join(" "); onChange(p=>(p?p+" "+t:t)); };
    r.onend = () => setRec(false);
    rRef.current = r;
  }, [onChange]);
  const toggle = () => { if (!rRef.current) return; if(rec){rRef.current.stop();setRec(false);}else{rRef.current.start();setRec(true);} };
  return (
    <div style={{ position:"relative" }}>
      <textarea rows={rows} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{...inp({resize:"vertical",lineHeight:1.6}), paddingRight:supported?48:12}}/>
      {supported && (
        <button onClick={toggle} title={rec?"Parar":"Ditar por voz"}
          style={{ position:"absolute", right:8, top:8, background:rec?C.redBg:C.greenBg, border:`1px solid ${rec?C.red:C.green}50`, borderRadius:8, padding:"6px 8px", cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontSize:12, color:rec?C.red:C.green, fontFamily:F, fontWeight:700 }}>
          {rec ? "⏹ Stop" : "🎙"}
        </button>
      )}
    </div>
  );
}

// ── MRCSelect ─────────────────────────────────────────────────────────────────
function MRCSelect({ value, onChange }) {
  const grades = ["0 – Sem contração","1 – Frêmito","2 – Sem gravidade","3 – Contra gravidade","4 – Resistência parcial","5 – Normal"];
  return (
    <select value={value} onChange={e=>onChange(e.target.value)} style={sel()}>
      <option value="">MRC…</option>
      {grades.map((g,i)=><option key={i} value={String(i)}>{g}</option>)}
    </select>
  );
}

// ── GonioRow ──────────────────────────────────────────────────────────────────
function GonioRow({ row, onUpdate, onRemove }) {
  const mvts = MVMT[row.joint]||[];
  const ref = getRef(row.movement, row.joint);
  const oor = isOutOfRange(row.value, ref);
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1.8fr 1.8fr 76px 72px 28px", gap:8, alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${C.border}` }}>
      <select value={row.joint} onChange={e=>onUpdate({...row,joint:e.target.value,movement:""})} style={sel()}>
        <option value="">Articulação…</option>
        {JOINTS.map(j=><option key={j} value={j}>{j}</option>)}
      </select>
      <select value={row.movement} onChange={e=>onUpdate({...row,movement:e.target.value})} style={sel()} disabled={!row.joint}>
        <option value="">Movimento…</option>
        {mvts.map(m=><option key={m} value={m}>{m}</option>)}
      </select>
      <input type="number" min="0" max="360" value={row.value} onChange={e=>onUpdate({...row,value:e.target.value})}
        style={{...inp({textAlign:"center",border:`1.5px solid ${oor?C.red:C.border}`,fontWeight:700})}} placeholder="°"/>
      <div style={{ fontSize:11, color:oor?C.red:C.textMuted, textAlign:"center", fontWeight:oor?700:400 }}>{ref?`${ref}°`:"—"}{oor?" ⚠":""}</div>
      <button onClick={onRemove} style={{ background:"none", border:"none", color:C.textDim, fontSize:18, cursor:"pointer", padding:0 }}>×</button>
    </div>
  );
}

// ── TestCard ──────────────────────────────────────────────────────────────────
function TestCard({ test, result, onResult }) {
  const [open, setOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const borderColor = result==="Positivo"?`${C.red}60`:result==="Negativo"?`${C.green}50`:C.border;
  const videoId = test.video ? test.video.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1] : null;
  return (
    <div style={{ background:C.surface, border:`1px solid ${borderColor}`, borderRadius:10, padding:"12px 14px", marginBottom:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.text }}>{test.name}</div>
          <div style={{ fontSize:12, color:C.textMuted, marginTop:2 }}>{test.desc}</div>
        </div>
        <div style={{ display:"flex", gap:6, flexShrink:0 }}>
          {videoId && <button onClick={()=>setShowVideo(s=>!s)}
            style={{ background:C.greenBg, border:`1px solid ${C.green}40`, borderRadius:6, padding:"4px 10px", fontSize:11, color:C.green, cursor:"pointer", fontWeight:700 }}>{showVideo?"▽ Fechar":"▶ Vídeo"}</button>}
          <button onClick={()=>setOpen(o=>!o)} style={{ background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:16, padding:"0 4px" }}>{open?"▲":"▼"}</button>
        </div>
      </div>
      {showVideo && videoId && (
        <div style={{ marginTop:10 }}>
          <iframe src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`} title={test.name} allow="autoplay; encrypted-media" allowFullScreen style={{ width:"100%", maxWidth:320, aspectRatio:"16/9", border:"none", borderRadius:8 }} />
        </div>
      )}
      {open && (
        <div style={{ marginTop:10, background:C.card, borderRadius:8, padding:"10px 12px", fontSize:12, color:C.text, lineHeight:1.7 }}>
          <span style={{ color:C.green, fontWeight:700 }}>Como executar: </span>{test.how}
        </div>
      )}
      <div style={{ display:"flex", gap:6, marginTop:10 }}>
        {["Positivo","Negativo","Não realizado"].map(r=>{
          const ac = r==="Positivo"?C.red:r==="Negativo"?C.green:C.amber;
          return (
            <button key={r} onClick={()=>onResult(r)}
              style={{ flex:1, background:result===r?`${ac}15`:C.card, border:`1px solid ${result===r?ac:C.border}`, borderRadius:8, padding:"6px 4px", fontSize:11, fontWeight:result===r?700:400, color:result===r?ac:C.textMuted, cursor:"pointer", fontFamily:F }}>
              {r}
            </button>
          );
        })}
      </div>
    </div>
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

const btnStyle = {
  background:"transparent",
  border:`1px solid ${C.purple}44`,
  borderRadius:6,
  padding:"6px 0",
  flex:"0 0 auto",
  width:36,
  fontSize:13,
  fontWeight:700,
  color:C.purple,
  cursor:"pointer",
  fontFamily:F,
};

const MoneyCell = ({ label, suggested, value, onChange }) => {
  const current = value != null ? Number(value) : suggested;
  const adjust = (delta) => {
    const next = Math.round((current + delta) * 10) / 10;
    if (next < 0) return;
    onChange(String(next));
  };

  return (
    <div style={{ background:C.card, borderRadius:8, padding:"8px 10px", border:`1px solid ${C.border}` }}>
      <div style={{ fontSize:9, color:C.textMuted, fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>{label}</div>
      <div style={{ display:"flex", alignItems:"center", gap:4 }}>
        <button style={btnStyle} onClick={() => adjust(-50)} title="-50">−50</button>
        <button style={btnStyle} onClick={() => adjust(-10)} title="-10">−10</button>
        <input
          type="text"
          inputMode="numeric"
          value={value == null ? "" : value}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "" || /^0$|^[1-9]\d*$|^[1-9]\d*\.\d*$|^0\.\d*$/.test(v)) {
              onChange(v === "" ? null : v);
            }
          }}
          onFocus={(e) => e.target.select()}
          style={{ flex:1, minWidth:0, boxSizing:"border-box", background:"transparent", border:`1px solid ${C.purple}55`, borderRadius:8, padding:"8px 6px", color:C.purple, fontWeight:900, fontSize:14, outline:"none", textAlign:"center" }}
          placeholder={`R$ ${suggested.toFixed(2)}`}
        />
        <button style={btnStyle} onClick={() => adjust(10)} title="+10">+10</button>
        <button style={btnStyle} onClick={() => adjust(50)} title="+50">+50</button>
      </div>
      {value == null && (
        <div style={{ fontSize:10, marginTop:4, color:C.textMuted }}>
          Sugerido: <strong>R$ {suggested.toFixed(2)}</strong>
        </div>
      )}
    </div>
  );
};

// ── HonoráriosCard ────────────────────────────────────────────────────────────
function HonorariosCard({ convenio, regiao, sessoesAuth }) {
  const [custom, setCustom] = useState({
    avaliacao: null,
    sessao: null,
    consulta: null,
    relatorio: null,
  });

  if (convenio !== "Particular") return null;
  const tabela = CREFITO_REGIOES[regiao] || CREFITO_REGIOES["Centro-Oeste"];
  const sessoes = parseInt(sessoesAuth) || 10;

  const eff = {
    avaliacao: custom.avaliacao != null ? Number(custom.avaliacao) : tabela.avaliacao,
    sessao: custom.sessao != null ? Number(custom.sessao) : tabela.sessao,
    consulta: custom.consulta != null ? Number(custom.consulta) : tabela.consulta,
    relatorio: custom.relatorio != null ? Number(custom.relatorio) : tabela.relatorio,
  };

  const totalSessoes = eff.sessao * sessoes;
  const totalEstimado = eff.avaliacao + totalSessoes + eff.relatorio + eff.consulta;



  return (
    <div style={{ background:C.purpleBg, border:`1px solid ${C.purple}40`, borderRadius:12, padding:"16px 18px", marginTop:12 }}>
      <div style={{ fontSize:10, fontWeight:800, color:C.purple, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>
        💰 HONORÁRIOS CREFITO — REFERÊNCIA PARA ATENDIMENTO PARTICULAR
      </div>
      <div style={{ fontSize:10, color:C.textMuted, marginBottom:10 }}>
        Baseado na Tabela de Honorários do COFFITO (Res. 424/2013) e reajustes regionais. Valores em R$ (referência 2024).
      </div>

      <div style={{ background:C.card, borderRadius:8, padding:"10px 14px", border:`1px solid ${C.purple}30`, marginBottom:10 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase" }}>Valor por sessão</span>
          <span style={{ fontSize:18, fontWeight:900, color:C.purple }}>R$ {eff.sessao.toFixed(2)}</span>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:8, marginBottom:10 }}>
        <MoneyCell label="Avaliação / Triagem" suggested={tabela.avaliacao} value={custom.avaliacao} onChange={(v)=>setCustom(c=>({...c, avaliacao:v}))}/>
        <MoneyCell label="Sessão de Fisioterapia" suggested={tabela.sessao} value={custom.sessao} onChange={(v)=>setCustom(c=>({...c, sessao:v}))}/>
        <MoneyCell label="Consulta de Retorno" suggested={tabela.consulta} value={custom.consulta} onChange={(v)=>setCustom(c=>({...c, consulta:v}))}/>
        <MoneyCell label="Relatório / Laudo" suggested={tabela.relatorio} value={custom.relatorio} onChange={(v)=>setCustom(c=>({...c, relatorio:v}))}/>
      </div>

      <div style={{ background:C.card, borderRadius:8, padding:"10px 14px", border:`1px solid ${C.purple}30` }}>
        <div style={{ fontSize:10, color:C.textMuted, lineHeight:1.6, marginBottom:8 }}>
          <div>Avaliação / Triagem: R$ {eff.avaliacao.toFixed(2)}</div>
          <div>{sessoes} sessões × R$ {eff.sessao.toFixed(2)}: R$ {totalSessoes.toFixed(2)}</div>
          <div>Consulta de Retorno: R$ {eff.consulta.toFixed(2)}</div>
          <div>Relatório / Laudo: R$ {eff.relatorio.toFixed(2)}</div>
        </div>
        <div style={{ height:1, background:`${C.purple}20`, marginBottom:8 }} />
        <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>Valor total</div>
        <div style={{ fontSize:22, fontWeight:900, color:C.purple }}>R$ {totalEstimado.toFixed(2)}</div>
      </div>

      <div style={{ fontSize:10, color:C.textMuted, marginTop:8, lineHeight:1.5 }}>
        ⚠️ Estes valores são <strong>referências mínimas</strong> sugeridas pelo CREFITO. O profissional pode definir seus honorários acima destes valores com base em especialização, experiência e localidade. Consulte sempre a tabela vigente do seu CREFITO regional.
      </div>
    </div>
  );
}

// ── Progress ──────────────────────────────────────────────────────────────────
function useProgress(patient, queixa, evaMov, gonio, testResults, kb) {
  const isMeaningfulGonioRow = (g) => {
    // Ignore defaults: only count rows that truly have measurement
    // - joint and movement must be selected
    // - value must be a real number (>0)
    const v = g?.value;
    const num = v === "" || v === null || v === undefined ? NaN : Number(v);
    return Boolean(g?.joint && g?.movement) && Number.isFinite(num) && num > 0;
  };

  const steps = [
    { key:"ident",  label:"Identificação", done: !!(patient.nome && patient.dataNasc && patient.sexo) },
    { key:"queixa", label:"Queixa",        done: queixa.length > 5 },
    { key:"dor",    label:"EVA",           done: evaMov !== null && evaMov !== "" },
    { key:"fisico", label:"Exame físico",  done: !!(patient.peso && patient.altura) },
    // Count meaningful goniometry measurements only (ignore “Articulação” alone)
    { key:"gonio",  label:"Goniometria",   done: gonio?.some(isMeaningfulGonioRow) },
    { key:"testes", label:"Testes",        done: kb ? Object.values(testResults||{}).some(v=>v && v!=="Não realizado") : false },
  ];
  const pct = Math.round((steps.filter(s=>s.done).length / steps.length)*100);
  return { steps, pct };
}

// ── Section / Row / Field ─────────────────────────────────────────────────────
function Section({ title, icon, badge, children, accent }) {
  return (
    <div style={cardStyle({ borderLeft: accent ? `3px solid ${accent}` : undefined })}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18, paddingBottom:12, borderBottom:`1px solid ${C.border}` }}>
        <span style={{ fontSize:16 }}>{icon}</span>
        <h3 style={{ margin:0, fontSize:11, fontWeight:800, letterSpacing:"0.11em", textTransform:"uppercase", color:C.green, flex:1 }}>{title}</h3>
        {badge && <span style={{ fontSize:11, background:C.amberBg, color:C.amber, border:`1px solid ${C.amber}40`, borderRadius:20, padding:"2px 10px" }}>{badge}</span>}
      </div>
      {children}
    </div>
  );
}
function Row({ children, cols="1fr 1fr", gap=14 }) {
  return <div style={{ display:"grid", gridTemplateColumns:cols, gap, marginBottom:14 }}>{children}</div>;
}
function Field({ l, children, span }) {
  return <div style={span?{gridColumn:`span ${span}`}:{}}><span style={lbl()}>{l}</span>{children}</div>;
}
function SubHeading({ children }) {
  return (
    <div style={{ fontSize:11, fontWeight:800, color:C.textMuted, letterSpacing:"0.1em", textTransform:"uppercase", borderBottom:`1px solid ${C.border}`, paddingBottom:6, marginBottom:12, marginTop:18 }}>
      {children}
    </div>
  );
}

let _gId = 20;

// ── Login Screen ────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
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
    <div style={{ background:`radial-gradient(ellipse at 50% 0%, ${C.card} 0%, ${C.bg} 70%)`, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:F, padding:24 }}>
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
function PatientList({ patients, onSelect, onAdd, onLogout, onAgenda, user }) {
  const [showForm, setShowForm] = useState(false);
  const [f, setF] = useState({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });

  const handleAdd = () => {
    if (!f.nome.trim()) return;
    onAdd({ ...f, id:Date.now(), data:new Date().toISOString().slice(0,10) });
    setF({ nome:"", dataNasc:"", sexo:"", profissao:"", convenio:"", telefone:"", peso:"", altura:"" });
    setShowForm(false);
  };

  return (
    <div style={{ background:`radial-gradient(ellipse at 50% 0%, ${C.card} 0%, ${C.bg} 70%)`, minHeight:"100vh", fontFamily:F, color:C.text, padding:24 }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
          <LogoSVG/>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={onAgenda} style={ghostBtn({ fontSize:12 })}>📅 Agenda</button>
            <button onClick={onLogout} style={ghostBtn({ fontSize:12 })}>Sair</button>
          </div>
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
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px", marginBottom:14 }}>
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
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [patients, setPatients] = useState([]);
  const [patientView, setPatientView] = useState(true);
  const [tab, setTab] = useState("avaliacao");
  const [regiao, setRegiao] = useState("Centro-Oeste");
  const [appView, setAppView] = useState("patients"); // "patients" | "agenda"

  // Patient
  const [pt, setPt] = useState({ nome:"", dataNasc:"", sexo:"", lateralidade:"", estadoCivil:"", profissao:"", convenio:"", sessoesAuth:"", telefone:"", peso:"", altura:"", data:new Date().toISOString().slice(0,10) });
  const up = (k,v) => setPt(p=>({...p,[k]:v}));

  const selectPatient = (p) => {
    setPt({ ...pt, ...p });
    setPatientView(false);
  };

  const addPatient = (p) => setPatients(ps => [...ps, p]);

  const handleLogout = () => { setUser(null); setPatientView(true); setPatients([]); };

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
  const [forca, setForca] = useState({ quadricepsD:"",quadricepsE:"",isquiotibialD:"",isquiotibialE:"",gluteoD:"",gluteoE:"",manguitoD:"",manguitoE:"",tibialAnterior:"",gastrocnemio:"",bicepsD:"",bicepsE:"" });

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

  // Diário
  const [logs, setLogs] = useState([]);
  const [df, setDf] = useState({ data:new Date().toISOString().slice(0,10), eva:5, procedimentos:[], resposta:"", evolucao:"", metas:"", escalas:"" });

  const kb = KB[queixaKey];
  const evidence = EVIDENCE[queixaKey];
  const cifSuggestions = evidence?.cif || [];
  const autoCIF = generateCIF({ evaMov, evaRep, avds, localDor, gonio, tests, yellowFlags:yellowFlagsState, tempoDor });
  const imc = calcIMC(pt.peso, pt.altura);

  const isEvaValid = evaMov !== null && evaMov !== undefined && evaMov !== "";
  const hasFilledTests = kb && Object.keys(tests||{}).length > 0 && Object.values(tests).some(v=>v!==""&&v!==undefined&&v!==null&&v!=="Não realizado");
  const { steps:progSteps, pct:progPct } = useProgress(pt, queixa, isEvaValid?evaMov:null, gonio, hasFilledTests?tests:{}, kb);

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
        `Força: ${Object.entries(forca).filter(([,v])=>v).map(([k,v])=>`${k}:${v}`).join(", ")}`,
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
    setLogs(l=>[{...df, id:Date.now(), sessaoNum:l.length+1},...l]);
    setDf({ data:new Date().toISOString().slice(0,10), eva:5, procedimentos:[], resposta:"", evolucao:"", metas:"", escalas:"" });
  };

  const navigateToPatientFromAgenda = useCallback((patient, targetTab) => {
    setPt(prev => ({ ...prev, ...patient }));
    setPatientView(false);
    setTab(targetTab || "avaliacao");
    setAppView("patients");
  }, []);

  const handleLogoutAgenda = () => {
    setUser(null);
    setPatientView(true);
    setPatients([]);
    setAppView("patients");
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (!user) return <LoginScreen onLogin={setUser} />;
  if (appView === "agenda") return (
    <Agenda patients={patients} onNavigateToPatient={navigateToPatientFromAgenda} />
  );
  if (patientView) return (
    <PatientList patients={patients} onSelect={selectPatient} onAdd={addPatient} onLogout={handleLogoutAgenda} onAgenda={() => setAppView("agenda")} user={user} />
  );
  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:F, color:C.text }}>

      {/* Header */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height:60 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <LogoSVG/>
          <button onClick={()=>setPatientView(true)} style={ghostBtn({ padding:"5px 10px", fontSize:11 })} title="Trocar paciente">👥 Pacientes</button>
          <button onClick={()=>setAppView("agenda")} style={ghostBtn({ padding:"5px 10px", fontSize:11 })} title="Agenda">📅 Agenda</button>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {[["avaliacao","📋","Avaliação"],["diario","📅","Diário"],["relatorio","📊","Relatório"],["evidencias","🔬","Evidências"]].map(([k,ic,lb])=>(
            <button key={k} onClick={()=>setTab(k)} style={{ background:tab===k?C.greenBg:"transparent", border:`1px solid ${tab===k?C.green+"50":"transparent"}`, borderRadius:8, padding:"7px 16px", fontSize:13, fontWeight:tab===k?700:400, color:tab===k?C.green:C.textMuted, cursor:"pointer", fontFamily:F }}>{ic} {lb}</button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {pt.nome && (
            <>
              <div style={{ width:30, height:30, background:C.greenBg, border:`1px solid ${C.green}40`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:C.green }}>{pt.nome[0]?.toUpperCase()}</div>
              <span style={{ fontSize:12, color:C.textSub, maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{pt.nome}</span>
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

      <div style={{ maxWidth:900, margin:"0 auto", padding:"20px 16px" }}>

        {/* ══════════════ AVALIAÇÃO ══════════════════════════════════════════ */}
        {tab==="avaliacao" && <>

          {/* Identificação */}
          <Section title="Identificação do Paciente" icon="👤">
            <Row cols="1fr 1fr 1fr">
              <Field l="Nome completo" span={2}><input value={pt.nome} onChange={e=>up("nome",e.target.value)} style={inp()} placeholder="Nome completo do paciente"/></Field>
              <Field l="Data da avaliação"><input type="date" value={pt.data} onChange={e=>up("data",e.target.value)} style={inp()}/></Field>
            </Row>
            <Row cols="1fr 1fr 1fr">
              <Field l="Data de nascimento"><input type="date" value={pt.dataNasc} onChange={e=>up("dataNasc",e.target.value)} style={inp()}/></Field>
              <Field l="Sexo"><SingleSelect options={["Masculino","Feminino","Outro"]} value={pt.sexo} onChange={v=>up("sexo",v)}/></Field>
              <Field l="Lateralidade"><SingleSelect options={["Destro","Canhoto","Ambidestro"]} value={pt.lateralidade} onChange={v=>up("lateralidade",v)}/></Field>
            </Row>
            <Row cols="1fr 1fr 1fr">
              <Field l="Estado civil">
                <select value={pt.estadoCivil} onChange={e=>up("estadoCivil",e.target.value)} style={sel()}>
                  <option value="">Selecionar…</option>
                  {["Solteiro(a)","Casado(a)","Divorciado(a)","Viúvo(a)","União estável"].map(v=><option key={v}>{v}</option>)}
                </select>
              </Field>
              <Field l="Profissão"><input value={pt.profissao} onChange={e=>up("profissao",e.target.value)} style={inp()} placeholder="Ocupação atual"/></Field>
              <Field l="Telefone"><input value={pt.telefone} onChange={e=>up("telefone",e.target.value)} style={inp()} placeholder="(00) 00000-0000"/></Field>
            </Row>

            <SubHeading>Dados administrativos e financeiros</SubHeading>
            <Row cols="1fr 1fr 1fr">
              <Field l="Convênio / Particular">
                <select value={pt.convenio} onChange={e=>up("convenio",e.target.value)} style={sel()}>
                  <option value="">Selecionar…</option>
                  {["Particular","Unimed","Bradesco Saúde","Amil","SulAmérica","Hapvida","NotreDame","IPSEMG","SUS / NASF","Outro"].map(v=><option key={v}>{v}</option>)}
                </select>
              </Field>
              <div>
                <SessionCounter value={pt.sessoesAuth} onChange={v=>up("sessoesAuth",v)}/>
              </div>
              {pt.convenio==="Particular" && (
                <Field l="Região CREFITO">
                  <select value={regiao} onChange={e=>setRegiao(e.target.value)} style={sel()}>
                    {Object.keys(CREFITO_REGIOES).map(r=><option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>
              )}
            </Row>
            <HonorariosCard convenio={pt.convenio} regiao={regiao} sessoesAuth={pt.sessoesAuth}/>

            <SubHeading>Antropometria</SubHeading>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
              <NumericDrum label="Peso" value={pt.peso} onChange={v=>up("peso",String(v))} min={30} max={250} step={0.5} unit="kg"/>
              <NumericDrum label="Altura" value={pt.altura} onChange={v=>up("altura",String(v))} min={100} max={220} step={1} unit="cm"/>
              <div>
                <span style={lbl()}>IMC calculado</span>
                <div style={{ background:C.surface, border:`1px solid ${imc?imc.c+"50":C.border}`, borderRadius:10, height:44, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  {imc ? <><span style={{ fontSize:22, fontWeight:900, color:imc.c }}>{imc.value}</span><span style={{ fontSize:11, color:imc.c, fontWeight:700 }}>{imc.l}</span></> : <span style={{ fontSize:12, color:C.textDim }}>Preencha peso e altura</span>}
                </div>
              </div>
            </div>
          </Section>

          {/* Queixa e Anamnese */}
          <Section title="Queixa Principal e Anamnese" icon="📝">
            <Field l="Queixa principal — digite ou use o microfone">
              <AudioField value={queixa} onChange={v=>{ const t=typeof v==="function"?v(queixa):v; setQueixa(t); setQueixaKey(detectKB(t)); }} placeholder="Ex: Lombalgia com irradiação para MMII há 3 semanas após queda…" rows={2}/>
            </Field>

            {kb && (
              <div style={{ background:C.greenBg, border:`1px solid ${C.green}40`, borderRadius:10, padding:"12px 14px", margin:"12px 0" }}>
                <div style={{ fontSize:12, fontWeight:700, color:C.green, marginBottom:10 }}>
                  ✓ Condição identificada: <strong>{kb.label}</strong> — protocolos carregados automaticamente
                </div>

                {cifSuggestions.length > 0 && (
                  <div style={{ background:C.card, borderRadius:8, padding:"10px 12px", marginBottom:10 }}>
                    <div style={{ fontSize:10, fontWeight:800, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>CIF sugeridos pela condição</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {cifSuggestions.map(code=>(
                        <span key={code} style={{ fontSize:11, color:C.blue, background:C.blueBg, border:`1px solid ${C.blue}30`, borderRadius:6, padding:"3px 10px" }}>
                          <strong>{code}</strong> — {CIF[code]}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {autoCIF.length > 0 && (
                  <div style={{ background:C.surface, borderRadius:8, padding:"10px 12px", marginBottom:10 }}>
                    <div style={{ fontSize:10, fontWeight:800, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>CIF identificados automaticamente (baseados nos dados preenchidos)</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {autoCIF.map(item=>(
                        <span key={`${item.code}-${item.qualifier}`} style={{ fontSize:11, color:C.purple, background:C.purpleBg, border:`1px solid ${C.purple}30`, borderRadius:6, padding:"3px 10px" }}>
                          <strong>{item.code}</strong> — {item.desc} | Q:{item.qualifier}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ background:C.redBg, border:`1px solid ${C.red}40`, borderRadius:8, padding:"8px 12px", marginBottom:10 }}>
                  <div style={{ fontSize:10, fontWeight:800, color:C.red, letterSpacing:"0.1em", marginBottom:6 }}>🚩 RED FLAGS — INVESTIGAR ANTES DE PROSSEGUIR</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {kb.redFlags.map(f=>(
                      <span key={f} style={{ fontSize:11, color:C.red, background:C.redBg, border:`1px solid ${C.red}30`, borderRadius:6, padding:"2px 10px" }}>{f}</span>
                    ))}
                  </div>
                </div>

                <div style={{ fontSize:11, color:C.textSub, lineHeight:1.7 }}>
                  <strong style={{ color:C.greenDim }}>Padrão-ouro: </strong>{kb.goldStandard}
                </div>

                {kb.escalas?.length > 0 && (
                  <div style={{ marginTop:10, background:C.card, borderRadius:8, padding:"8px 12px" }}>
                    <div style={{ fontSize:10, fontWeight:800, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>📏 Escalas recomendadas para esta condição</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                      {kb.escalas.map(e=>(
                        <span key={e} style={{ fontSize:11, color:C.amber, background:C.amberBg, border:`1px solid ${C.amber}30`, borderRadius:6, padding:"2px 8px" }}>{e}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <SubHeading>Caracterização da dor</SubHeading>
            <Row cols="1fr 1fr">
              <Field l="Localização da dor">
                <TagSelect options={["Cervical","Torácica","Lombar","Sacroilíaca","Ombro D","Ombro E","Cotovelo D","Cotovelo E","Punho/Mão D","Punho/Mão E","Quadril D","Quadril E","Joelho D","Joelho E","Tornozelo D","Tornozelo E","Pé D","Pé E","Irradiação MMSS","Irradiação MMII"]}
                  value={localDor} onChange={setLocalDor}/>
              </Field>
              <Field l="Caráter da dor">
                <TagSelect options={["Latejante","Queimação","Pontada","Pressão","Facada","Formigamento","Peso","Cãibra","Choques","Mecânica","Inflamatória","Neuropática"]}
                  value={caraterDor} onChange={setCaraterDor}/>
              </Field>
            </Row>
            <Row cols="1fr 1fr 1fr">
              <Field l="Duração / tempo de dor">
                <select value={tempoDor} onChange={e=>setTempoDor(e.target.value)} style={sel()}>
                  <option value="">Selecionar…</option>
                  {["< 2 semanas (aguda)","2–6 semanas (subaguda)","6 sem – 3 meses (subcrônica)","3–6 meses (crônica)","6–12 meses","1–2 anos","> 2 anos (crônica complexa)"].map(v=><option key={v}>{v}</option>)}
                </select>
              </Field>
              <Field l="Fatores de melhora">
                <TagSelect options={["Repouso","Calor","Frio","Movimento/aquecimento","Analgésico","Posição específica","Fisioterapia","Sono"]} value={melhora} onChange={setMelhora}/>
              </Field>
              <Field l="Fatores de piora">
                <TagSelect options={["Movimento","Carga","Postura estática","Frio","Stress emocional","Noite/repouso","Trabalho","Após atividade"]} value={piora} onChange={setPiora}/>
              </Field>
            </Row>

            <Field l="HDA — História da Doença Atual">
              <AudioField value={hda} onChange={v=>setHda(typeof v==="function"?v(hda):v)} placeholder="Início, mecanismo de lesão, evolução, tratamentos anteriores, exames realizados…" rows={3}/>
            </Field>

            <SubHeading>Histórico e comorbidades</SubHeading>
            <Row cols="1fr 1fr">
              <Field l="Comorbidades">
                <TagSelect options={["HAS","DM2","Obesidade","Osteoporose","Artrite/AR","Fibromialgia","Depressão","Ansiedade","Doença cardíaca","DPOC","Neoplasia","Imunossupressão","Nenhuma"]}
                  value={comorbid} onChange={setComorbid}/>
              </Field>
              <Field l="Antecedentes / cirurgias">
                <TagSelect options={["Cirurgia prévia (área)","Trauma anterior","Fratura óssea","Imobilização prolongada","Fisioterapia anterior","Infiltração corticoide","Nenhum relevante"]}
                  value={antec} onChange={setAntec}/>
              </Field>
            </Row>
            <Field l="Medicamentos em uso">
              <input value={meds} onChange={e=>setMeds(e.target.value)} style={inp()} placeholder="Anti-inflamatório, analgésico, relaxante muscular, antidepressivo…"/>
            </Field>

            <SubHeading>Yellow Flags — Fatores Psicossociais</SubHeading>
            <TagSelect options={["Catastrofização","Cinesiofobia","Baixa autoeficácia","Insatisfação no trabalho","Depressão/ansiedade","Baixa expectativa de recuperação","Comportamento de doença","Conflitos familiares","Litígio / afastamento laboral","Trabalho sedentário"]}
              value={yellowFlagsState} onChange={setYellowFlagsState} activeColor={C.amber}/>
            {yellowFlagsState.length >= 3 && (
              <div style={{ marginTop:8, padding:"8px 12px", background:C.amberBg, border:`1px solid ${C.amber}40`, borderRadius:8, fontSize:11, color:C.amber }}>
                ⚠️ <strong>{yellowFlagsState.length} yellow flags identificados.</strong> Considerar abordagem biopsicossocial (CFT, PNE) e avaliação psicológica.
              </div>
            )}
          </Section>

          {/* Dor e Funcionalidade */}
          <Section title="Dor e Funcionalidade" icon="⚡">
            <Row cols="1fr 1fr">
              <div>
                <EvaSlider label="EVA — Movimento" value={evaMov} onChange={setEvaMov}/>
                <div style={{ marginTop:18 }}>
                  <EvaSlider label="EVA — Repouso" value={evaRep} onChange={setEvaRep}/>
                </div>
              </div>
              <div>
                <Field l="Nível de atividade física">
                  <SingleSelect options={["Sedentário","Levemente ativo","Moderadamente ativo","Muito ativo","Atleta"]} value={nivelAti} onChange={setNivelAti}/>
                </Field>
                <div style={{ marginTop:14 }}>
                  <Field l="Limitações nas AVDs">
                    <TagSelect options={["Andar","Subir escadas","Agachar","Sentar/levantar","Vestir-se","Higiene pessoal","Dormir","Dirigir","Trabalho manual","Esporte","Carregar peso","Vida sexual","Sem limitações"]}
                      value={avds} onChange={setAvds}/>
                  </Field>
                </div>
                <div style={{ marginTop:14 }}>
                  <Field l="Objetivo principal (expectativa do paciente)">
                    <TagSelect options={["Eliminar a dor","Retornar ao trabalho","Retornar ao esporte","Independência nas AVDs","Melhorar postura","Fortalecer","Prevenir recidiva","Melhorar qualidade de vida"]}
                      value={objTrat} onChange={setObjTrat}/>
                  </Field>
                </div>
              </div>
            </Row>
          </Section>

          {/* Exame Físico */}
          <Section title="Exame Físico" icon="🔬">
            <SubHeading>Inspeção e marcha</SubHeading>
            <Row cols="1fr 1fr">
              <Field l="Alterações posturais">
                <TagSelect options={["Anteriorização de cabeça","Protração de ombros","Hipercifose torácica","Hiperlordose lombar","Retificação lombar","Escoliose funcional","Escoliose estrutural","Pelve anteriorizada","Pelve posteriorizada","Joelho varo","Joelho valgo","Recurvatum","Pé plano","Pé cavo","Sem alterações"]}
                  value={postura} onChange={setPostura}/>
              </Field>
              <div>
                <Field l="Padrão de marcha">
                  <select value={marcha} onChange={e=>setMarcha(e.target.value)} style={sel()}>
                    <option value="">Selecionar…</option>
                    {["Normal","Antálgica","Trendelenburg","Equina","Hemiplégica","Atáxica","Claudicação intermitente","Não avaliado"].map(v=><option key={v}>{v}</option>)}
                  </select>
                </Field>
                <div style={{ marginTop:12 }}>
                  <Field l="Edema / Sinais flogísticos">
                    <select value={edema} onChange={e=>setEdema(e.target.value)} style={sel()}>
                      <option value="">Selecionar…</option>
                      {["Ausente","Edema leve (1+)","Edema moderado (2+)","Edema importante (3+)","Calor local","Rubor","Derrame articular","Crepitação"].map(v=><option key={v}>{v}</option>)}
                    </select>
                  </Field>
                </div>
                <div style={{ marginTop:12 }}>
                  <Field l="Sensibilidade">
                    <select value={sensib} onChange={e=>setSensib(e.target.value)} style={sel()}>
                      <option value="">Selecionar…</option>
                      {["Normal","Hipoestesia","Hiperestesia","Parestesia","Anestesia","Alodínia"].map(v=><option key={v}>{v}</option>)}
                    </select>
                  </Field>
                </div>
                <div style={{ marginTop:12 }}>
                  <Field l="Reflexos osteotendinosos">
                    <select value={reflexos} onChange={e=>setReflexos(e.target.value)} style={sel()}>
                      <option value="">Selecionar…</option>
                      {["Normais (2+)","Hiporreflexia (1+)","Arreflexia (0)","Hiperreflexia (3+/4+)","Assimétricos"].map(v=><option key={v}>{v}</option>)}
                    </select>
                  </Field>
                </div>
              </div>
            </Row>

            <SubHeading>Palpação</SubHeading>
            <AudioField value={palpacao} onChange={v=>setPalpacao(typeof v==="function"?v(palpacao):v)}
              placeholder="Pontos gatilho, espasmo muscular, dor à palpação de processos espinhosos, hipersensibilidade local…" rows={2}/>

            <SubHeading>Força Muscular — Escala MRC (0–5)</SubHeading>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
              {[["quadricepsD","Quadríceps D"],["quadricepsE","Quadríceps E"],["isquiotibialD","Isquiotib. D"],["isquiotibialE","Isquiotib. E"],["gluteoD","Glúteo D"],["gluteoE","Glúteo E"],["manguitoD","Manguito D"],["manguitoE","Manguito E"],["tibialAnterior","Tibial Ant."],["gastrocnemio","Gastrocnêmio"],["bicepsD","Bíceps D"],["bicepsE","Bíceps E"]].map(([k,l2])=>(
                <div key={k}>
                  <span style={{...lbl(), fontSize:9}}>{l2}</span>
                  <MRCSelect value={forca[k]} onChange={v=>setForca(f=>({...f,[k]:v}))}/>
                </div>
              ))}
            </div>
          </Section>

          {/* Goniometria */}
          <Section title="Goniometria" icon="📐" badge={`${gonio.filter(g=>g.value).length} med.`}>
            <div style={{ display:"grid", gridTemplateColumns:"1.8fr 1.8fr 76px 72px 28px", gap:8, paddingBottom:8, borderBottom:`1px solid ${C.border}`, marginBottom:4 }}>
              {["Articulação","Movimento","Grau","Ref.",""].map((h,i)=>(
                <span key={i} style={{ fontSize:9, fontWeight:700, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase", textAlign:i>=2?"center":"left" }}>{h}</span>
              ))}
            </div>
            {gonio.map(row=>(
              <GonioRow key={row.id} row={row} onUpdate={u=>updG(row.id,u)} onRemove={()=>remG(row.id)}/>
            ))}
            <button onClick={addG} style={{...ghostBtn(), marginTop:12, fontSize:12}}>+ Adicionar medida</button>
          </Section>

          {/* Testes especiais */}
          {kb && (
            <Section title={`Testes Especiais — ${kb.label}`} icon="🧪">
              <p style={{ fontSize:12, color:C.textMuted, margin:"0 0 14px" }}>
                Selecione o resultado de cada teste. Clique em ▼ para ver a execução detalhada ou ▶ Vídeo para demonstração.
              </p>
              {kb.tests.map(t=>(
                <TestCard key={t.name} test={t} result={tests[t.name]||""} onResult={v=>setTests(tr=>({...tr,[t.name]:v}))}/>
              ))}
            </Section>
          )}

          {/* Observações */}
          <Section title="Observações Clínicas" icon="💬">
            <AudioField value={obs} onChange={v=>setObs(typeof v==="function"?v(obs):v)}
              placeholder="Comportamento do paciente, achados adicionais, exames de imagem relevantes, considerações clínicas…" rows={4}/>
          </Section>

          {/* IA */}
          <Section title="Análise por Inteligência Artificial — Baseada em Evidências" icon="🤖" accent={C.green}>
            <p style={{ fontSize:12, color:C.textMuted, margin:"0 0 14px", lineHeight:1.7 }}>
              Preencha os campos da avaliação e clique em analisar. A IA cruzará os dados com evidências científicas atualizadas (PEDro, Cochrane, CPGs) e gerará um plano de tratamento personalizado e baseado em evidências.
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
              <button onClick={runAI} disabled={aiLoad||!queixa} style={{...primaryBtn(), opacity:aiLoad||!queixa?0.45:1}}>
                {aiLoad ? "⏳ Analisando…" : "🔍 Gerar análise clínica"}
              </button>
              <div style={{ display:"flex", gap:6 }}>
                {progSteps.filter(s=>!s.done).map(s=>(
                  <span key={s.key} style={{ fontSize:10, color:C.amber, background:C.amberBg, border:`1px solid ${C.amber}30`, borderRadius:6, padding:"2px 8px" }}>Pendente: {s.label}</span>
                ))}
              </div>
            </div>
            {aiRes && (
              <div style={{ marginTop:16, background:C.surface, border:`1px solid ${C.green}30`, borderRadius:10, padding:18 }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.green, letterSpacing:"0.1em", marginBottom:12 }}>ANÁLISE CLÍNICA — SASYRA IA</div>
                <pre style={{ fontSize:13, color:C.text, whiteSpace:"pre-wrap", margin:0, lineHeight:1.85, fontFamily:F }}>{aiRes}</pre>
              </div>
            )}
          </Section>
        </>}

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
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:14 }}>
              {[
                ["Sessões realizadas", logs.length, C.green],
                ["Autorizadas", pt.sessoesAuth, C.amber],
                ["Restantes", Math.max(0,Number(pt.sessoesAuth)-logs.length), logs.length>=Number(pt.sessoesAuth)?C.red:C.blue],
              ].map(([l2,v,c])=>(
                <div key={l2} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:C.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>{l2}</div>
                  <div style={{ fontSize:30, fontWeight:900, color:c, lineHeight:1 }}>{v}</div>
                </div>
              ))}
            </div>
          )}

          <Section title="Registrar Nova Sessão" icon="📅">
            <Row cols="1fr 1fr">
              <Field l="Data"><input type="date" value={df.data} onChange={e=>setDf(f=>({...f,data:e.target.value}))} style={inp()}/></Field>
              <EvaSlider label="EVA da sessão" value={df.eva} onChange={v=>setDf(f=>({...f,eva:v}))}/>
            </Row>
            <Field l="Procedimentos realizados">
              <TagSelect options={["TENS","FES","Ultrassom terapêutico","Laser de baixa potência","Magnetoterapia","Crioterapia","Termoterapia","Massagem terapêutica","Mobilização articular","Manipulação","Tração","Dry needling","Ventosaterapia","Bandagem funcional","Kinesio taping","RPG","Pilates clínico","Cinesioterapia","Treino de força","Treino proprioceptivo","Treino funcional","Exercício neuromotor","Liberação miofascial","Hidroterapia","Alongamento global","PNE – Educação em Dor","Graded Exposure","CFT – Terapia Funcional Cognitiva"]}
                value={df.procedimentos} onChange={v=>setDf(f=>({...f,procedimentos:v}))}/>
            </Field>
            <Row cols="1fr 1fr">
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

          {logs.length >= 2 && (
            <Section title="Evolução da Dor (EVA)" icon="📈">
              <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:80, padding:"0 4px" }}>
                {[...logs].reverse().map((l,i)=>{
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
                <span>S1 (inicial)</span><span>S{logs.length} (última)</span>
              </div>
            </Section>
          )}

          {logs.length > 0 && (
            <Section title={`Histórico — ${logs.length} sessão(ões)`} icon="📋">
              {logs.map(log=>{
                const ec=log.eva<=3?C.green:log.eva<=6?C.amber:C.red;
                return (
                  <div key={log.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px", marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:11, background:C.greenBg, color:C.green, border:`1px solid ${C.green}30`, borderRadius:6, padding:"2px 8px", fontWeight:700 }}>Sessão {log.sessaoNum}</span>
                        <span style={{ fontSize:12, color:C.textMuted }}>{log.data}</span>
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
          <Section title="Relatório Multidisciplinar" icon="📊">
            <div style={{ background:"#fff", borderRadius:12, padding:28, color:"#1a202c", fontFamily:F }}>
              <div style={{ display:"flex", alignItems:"center", gap:14, borderBottom:"3px solid #4ADE80", paddingBottom:14, marginBottom:22 }}>
                <svg viewBox="0 0 220 50" width="140" height="36">
                  <g transform="translate(18,25)">
                    <path d="M -12 7 C -7 2,0 0,12 -7" fill="none" stroke="#4ADE80" strokeWidth="3.5" strokeLinecap="round"/>
                    <path d="M -12 -3 C -3 0,3 2,12 8" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round"/>
                    <circle cx="0" cy="0" r="4" fill="#FBBF24"/>
                  </g>
                  <text x="40" y="30" fill="#0E141B" fontSize="22" fontWeight="800" letterSpacing="5" fontFamily={F}>SASYRA</text>
                  <text x="42" y="44" fill="#4ADE80" fontSize="8" fontWeight="700" letterSpacing="4" fontFamily={F}>REABILITAÇÃO E EVIDÊNCIA</text>
                </svg>
                <div style={{ borderLeft:"1px solid #E2E8F0", paddingLeft:14 }}>
                  <div style={{ fontWeight:800, fontSize:15, color:"#0E141B" }}>RELATÓRIO DE FISIOTERAPIA ORTOPÉDICA</div>
                  <div style={{ fontSize:11, color:"#7C8FA6" }}>Gerado em {new Date().toLocaleDateString("pt-BR")} · Para equipe multidisciplinar</div>
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:22 }}>
                {[["Paciente",pt.nome||"—"],["Nascimento",pt.dataNasc||"—"],["Sexo",pt.sexo||"—"],["Profissão",pt.profissao||"—"],["Convênio",pt.convenio||"—"],["Sessões auth.",pt.sessoesAuth||"—"],["Peso/Altura",pt.peso&&pt.altura?`${pt.peso}kg / ${pt.altura}cm`:"—"],["IMC",imc?`${imc.value} (${imc.l})`:"—"]].map(([k,v])=>(
                  <div key={k} style={{ background:"#F8FAFC", borderRadius:8, padding:"8px 12px" }}>
                    <div style={{ fontSize:9, color:"#7C8FA6", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>{k}</div>
                    <div style={{ fontWeight:700, fontSize:13, color:"#0E141B", marginTop:2 }}>{v}</div>
                  </div>
                ))}
              </div>

              {queixa && <>
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontWeight:700, color:"#0F6E56", fontSize:11, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5 }}>Queixa principal</div>
                  <p style={{ margin:0, fontSize:14, color:"#1a202c" }}>{queixa}</p>
                </div>
                {hda && <div style={{ marginBottom:14 }}>
                  <div style={{ fontWeight:700, color:"#0F6E56", fontSize:11, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5 }}>HDA</div>
                  <p style={{ margin:0, fontSize:13, color:"#374151", lineHeight:1.7 }}>{hda}</p>
                </div>}
              </>}

              {yellowFlagsState.length > 0 && (
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontWeight:700, color:"#B45309", fontSize:11, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5 }}>Yellow Flags identificados</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {yellowFlagsState.map(f=><span key={f} style={{ fontSize:11, background:"#FFFBEB", color:"#B45309", border:"1px solid #FCD34D", borderRadius:6, padding:"2px 8px" }}>{f}</span>)}
                  </div>
                </div>
              )}

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:18 }}>
                {[[evaMov,"EVA Movimento"],[evaRep,"EVA Repouso"]].map(([v,l2])=>{
                  const bc=v>=7?"#FEF2F2":v>=4?"#FFFBEB":"#F0FDF4";
                  const tc=v>=7?"#E24B4A":v>=4?"#BA7517":"#3B6D11";
                  return (
                    <div key={l2} style={{ background:bc, borderRadius:8, padding:"12px 16px", textAlign:"center" }}>
                      <div style={{ fontSize:9, color:"#7C8FA6", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>{l2}</div>
                      <div style={{ fontSize:36, fontWeight:900, color:tc, lineHeight:1.1 }}>{v!=null?v:"—"}<span style={{ fontSize:14, fontWeight:400 }}>/10</span></div>
                      <div style={{ fontSize:11, color:tc }}>{v===0?"Sem dor":v<=3?"Leve":v<=6?"Moderada":v<=8?"Intensa":v!=null?"Máxima":"Não avaliado"}</div>
                    </div>
                  );
                })}
              </div>

              {autoCIF.length > 0 && (
                <div style={{ marginBottom:18 }}>
                  <div style={{ fontWeight:700, color:"#0F6E56", fontSize:11, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>Classificação CIF — Diagnóstico Funcional</div>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                    <thead><tr style={{ background:"#F8FAFC" }}>
                      {["Código","Descrição","Qualificador"].map(h=><th key={h} style={{ padding:"6px 10px", textAlign:"left", fontWeight:700, fontSize:10, color:"#7C8FA6", textTransform:"uppercase" }}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {autoCIF.map(c=>(
                        <tr key={c.code} style={{ borderBottom:"1px solid #F1F5F9" }}>
                          <td style={{ padding:"6px 10px", fontWeight:800, color:"#6B46C1" }}>{c.code}</td>
                          <td style={{ padding:"6px 10px" }}>{c.desc}</td>
                          <td style={{ padding:"6px 10px", fontWeight:700, color:c.qualifier>=3?"#E24B4A":c.qualifier>=2?"#BA7517":"#3B6D11" }}>{c.qualifier} — {c.qualifier===0?"Sem dificuldade":c.qualifier===1?"Dificuldade leve":c.qualifier===2?"Dificuldade moderada":c.qualifier===3?"Dificuldade grave":"Dificuldade completa"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {gonio.filter(g=>g.value).length>0 && (
                <div style={{ marginBottom:18 }}>
                  <div style={{ fontWeight:700, color:"#0F6E56", fontSize:11, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>Goniometria</div>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                    <thead><tr style={{ background:"#F8FAFC" }}>
                      {["Articulação","Movimento","Medida","Referência","Status"].map(h=><th key={h} style={{ padding:"7px 10px", textAlign:"left", fontWeight:700, fontSize:10, color:"#7C8FA6", textTransform:"uppercase" }}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {gonio.filter(g=>g.value).map(g=>{
                        const ref=getRef(g.movement,g.joint);
                        const oor=isOutOfRange(g.value,ref);
                        return (
                          <tr key={g.id} style={{ borderBottom:"1px solid #F1F5F9" }}>
                            <td style={{ padding:"6px 10px" }}>{g.joint}</td>
                            <td style={{ padding:"6px 10px" }}>{g.movement}</td>
                            <td style={{ padding:"6px 10px", fontWeight:800, color:oor?"#E24B4A":"#0F6E56" }}>{g.value}°</td>
                            <td style={{ padding:"6px 10px", color:"#7C8FA6" }}>{ref?`${ref}°`:"—"}</td>
                            <td style={{ padding:"6px 10px" }}>{oor?<span style={{ fontSize:11, color:"#E24B4A", fontWeight:700 }}>⚠ Acima do ref.</span>:<span style={{ fontSize:11, color:"#3B6D11" }}>✓</span>}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {Object.entries(tests).filter(([,v])=>v&&v!=="Não realizado").length>0 && (
                <div style={{ marginBottom:18 }}>
                  <div style={{ fontWeight:700, color:"#0F6E56", fontSize:11, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>Testes especiais</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                    {Object.entries(tests).filter(([,v])=>v&&v!=="Não realizado").map(([k,v])=>(
                      <div key={k} style={{ display:"flex", justifyContent:"space-between", background:"#F8FAFC", borderRadius:8, padding:"6px 12px", fontSize:13 }}>
                        <span style={{ color:"#374151" }}>{k}</span>
                        <span style={{ fontWeight:700, color:v==="Positivo"?"#E24B4A":"#3B6D11" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pt.convenio==="Particular" && (
                <div style={{ marginBottom:18, background:"#F5F3FF", borderRadius:8, padding:"12px 16px", border:"1px solid #DDD6FE" }}>
                  <div style={{ fontWeight:700, color:"#5B21B6", fontSize:11, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>Honorários CREFITO — Referência para atendimento particular</div>
                  <div style={{ fontSize:12, color:"#374151" }}>Região: {regiao} | Sessão: R$ {(CREFITO_REGIOES[regiao]||CREFITO_REGIOES["Centro-Oeste"]).sessao.toFixed(2)} | Avaliação: R$ {(CREFITO_REGIOES[regiao]||CREFITO_REGIOES["Centro-Oeste"]).avaliacao.toFixed(2)} | Relatório: R$ {(CREFITO_REGIOES[regiao]||CREFITO_REGIOES["Centro-Oeste"]).relatorio.toFixed(2)}{pt.sessoesAuth?` | Total ({${pt.sessoesAuth}} sessões): R$ ${(((CREFITO_REGIOES[regiao]||CREFITO_REGIOES["Centro-Oeste"]).avaliacao)+((CREFITO_REGIOES[regiao]||CREFITO_REGIOES["Centro-Oeste"]).sessao*parseInt(pt.sessoesAuth))+((CREFITO_REGIOES[regiao]||CREFITO_REGIOES["Centro-Oeste"]).relatorio)).toFixed(2)}`:""}</div>
                </div>
              )}

              {aiRes && (
                <div style={{ marginBottom:18 }}>
                  <div style={{ fontWeight:700, color:"#0F6E56", fontSize:11, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>Plano de tratamento — análise IA baseada em evidências</div>
                  <pre style={{ fontSize:12, whiteSpace:"pre-wrap", background:"#F8FAFC", borderRadius:8, padding:14, margin:0, fontFamily:F, lineHeight:1.8, color:"#1a202c" }}>{aiRes}</pre>
                </div>
              )}

              {logs.length>0 && (
                <div style={{ marginBottom:18 }}>
                  <div style={{ fontWeight:700, color:"#0F6E56", fontSize:11, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>Evolução — {logs.length} sessão(ões)</div>
                  {[...logs].reverse().map(l=>(
                    <div key={l.id} style={{ borderLeft:"3px solid #4ADE80", paddingLeft:12, marginBottom:10 }}>
                      <div style={{ fontSize:11, color:"#7C8FA6", marginBottom:2 }}>
                        Sessão {l.sessaoNum} · {l.data} · EVA {l.eva}/10{l.resposta?` · ${l.resposta}`:""}
                      </div>
                      {l.escalas && <div style={{ fontSize:11, color:"#6B46C1", marginBottom:2 }}>📏 {l.escalas}</div>}
                      {l.evolucao && <div style={{ fontSize:13, color:"#374151", lineHeight:1.6 }}>{l.evolucao}</div>}
                      {l.metas && <div style={{ fontSize:11, color:"#7C8FA6", marginTop:2 }}>→ {l.metas}</div>}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ borderTop:"1px solid #E2E8F0", marginTop:20, paddingTop:12, fontSize:10, color:"#7C8FA6", textAlign:"center" }}>
                SASYRA · Reabilitação e Evidência · Documento gerado para equipe multidisciplinar
              </div>
            </div>
            <div style={{ marginTop:14, display:"flex", gap:10 }}>
              <button onClick={()=>window.print()} style={primaryBtn()}>🖨️ Imprimir / Salvar PDF</button>
            </div>
          </Section>
        )}

      </div>
    </div>
  );
}