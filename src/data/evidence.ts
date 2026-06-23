import { EvidenceEntry, KbEntry } from "@/types";

export const EVIDENCE: Record<string, EvidenceEntry> = {
  lombalgia: {
    cif: ["b28013", "d410", "d415", "d450", "d850"],
    pedro: [
      { id: "PEDro-2847", titulo: "Exercício vs repouso na lombalgia crônica", pontuacao: 9, conclusao: "Exercício ativo superior ao repouso. NNT=3.", fonte: "Cochrane 2021" },
      { id: "PEDro-4521", titulo: "PNE (Pain Neuroscience Education) na dor lombar", pontuacao: 8, conclusao: "PNE reduz catastrofização e melhora função.", fonte: "JOSPT 2022" },
      { id: "PEDro-3390", titulo: "McKenzie vs terapia manual na lombalgia", pontuacao: 8, conclusao: "Eficácia equivalente; combinação superior.", fonte: "Spine J 2020" },
    ],
    escalas: ["Oswestry Disability Index (ODI)", "Roland Morris Disability Questionnaire (RMDQ)", "Start MSK – triagem biopsicossocial", "FABQ (Fear Avoidance Beliefs)", "Tampa Scale for Kinesiophobia (TSK-17)"],
    atualizacao: "CPG Cochrane 2021 | JOSPT 2022 | EuroPain 2023",
  },
  cervicalgia: {
    cif: ["b28010", "b710", "d445", "d430"],
    pedro: [
      { id: "PEDro-3811", titulo: "Manipulação C1-C2 vs mobilização na cefaleia cervicogênica", pontuacao: 9, conclusao: "Manipulação ATL superior à mobilização. NNT=2.", fonte: "JOSPT 2023" },
      { id: "PEDro-2990", titulo: "Exercício de controle motor vs analgésico na cervicalgia crônica", pontuacao: 8, conclusao: "Exercício profundo = efeito a longo prazo superior.", fonte: "BJSM 2021" },
    ],
    escalas: ["Neck Disability Index (NDI)", "Northwick Park Neck Pain Questionnaire", "Global Rating of Change (GRC)", "Numeric Pain Rating Scale (NPRS)"],
    atualizacao: "CPG JOSPT 2023 | Cochrane Cervical 2022",
  },
  gonalgia: {
    cif: ["b28015", "b710", "b730", "d450", "d455", "d410"],
    pedro: [
      { id: "PEDro-5102", titulo: "Exercício vs artroscopia no menisco degenerativo (ESCAPE trial)", pontuacao: 10, conclusao: "Exercício = cirurgia em OA meniscal. Evitar artroscopia.", fonte: "NEJM 2018" },
      { id: "PEDro-4877", titulo: "Treino neuromuscular pós-reconstrução LCA", pontuacao: 9, conclusao: "Protocolo MOON reduz re-lesão em 50%.", fonte: "AJSM 2022" },
      { id: "PEDro-3654", titulo: "Glúteo médio + VMO na síndrome patelofemoral", pontuacao: 8, conclusao: "Fortalecimento proximal reduz dor patelofemoral efetivamente.", fonte: "BJSM 2020" },
    ],
    escalas: ["KOOS (Knee injury and Osteoarthritis Outcome Score)", "Lysholm Knee Score", "ACL-RSI (Return to Sport after Injury)", "IKDC Subjective Knee Form", "VAS / NPRS"],
    atualizacao: "ESCAPE Trial NEJM 2018 | MOON Protocol 2022 | CPG JOSPT 2023",
  },
  ombralgia: {
    cif: ["b28014", "b710", "b715", "b730", "d445", "d430"],
    pedro: [
      { id: "PEDro-4210", titulo: "Exercício vs cirurgia no impacto subacromial (CSAW trial)", pontuacao: 10, conclusao: "Exercício = cirurgia no impacto. Optar por conservador.", fonte: "Lancet 2018" },
      { id: "PEDro-3980", titulo: "Fortalecimento escapular no impacto subacromial", pontuacao: 8, conclusao: "Estabilização escapular melhora força e função.", fonte: "JOSPT 2021" },
    ],
    escalas: ["DASH (Disabilities of the Arm, Shoulder and Hand)", "WORC (Western Ontario Rotator Cuff Index)", "ASES (American Shoulder and Elbow Surgeons)", "NPRS", "Oxford Shoulder Score"],
    atualizacao: "CSAW Trial Lancet 2018 | Cochrane Shoulder 2022",
  },
  tornozelo: {
    cif: ["b28015", "b710", "b770", "d450", "d455"],
    pedro: [
      { id: "PEDro-3721", titulo: "PEACE & LOVE vs RICE na entorse lateral", pontuacao: 9, conclusao: "Carga precoce + exercício superior ao repouso/gelo.", fonte: "BJSM 2019" },
      { id: "PEDro-4450", titulo: "Treino proprioceptivo na prevenção de entorse recorrente", pontuacao: 9, conclusao: "Reduz recorrência em 46%. Evidência A.", fonte: "CPG JOSPT 2021" },
      { id: "PEDro-3280", titulo: "Alongamento plantar + excêntrico na fasciíte plantar", pontuacao: 8, conclusao: "Alongamento específico de Windlass superior ao inespecífico.", fonte: "JFAS 2020" },
    ],
    escalas: ["FAAM (Foot and Ankle Ability Measure)", "AOS (Ankle Osteoarthritis Scale)", "CAIT (Cumberland Ankle Instability Tool)", "NPRS", "Patient Global Impression of Change (PGIC)"],
    atualizacao: "PEACE & LOVE BJSM 2019 | CPG JOSPT 2021 | Cochrane Ankle 2022",
  },
  cotovelo: {
    cif: ["b28014", "b710", "b730", "d445", "d4401"],
    pedro: [
      { id: "PEDro-4130", titulo: "Isométrico vs excêntrico na epicondilite lateral", pontuacao: 8, conclusao: "Isométrico = analgesia imediata; excêntrico = ganho funcional a longo prazo.", fonte: "BJSM 2021" },
      { id: "PEDro-3560", titulo: "Corticoide vs exercício na tendinopatia lateral (MINT trial)", pontuacao: 9, conclusao: "Corticoide: rápido mas recidiva alta (>52 sem). Exercício: melhor desfecho tardio.", fonte: "Lancet 2013" },
      { id: "PEDro-4780", titulo: "Ondas de choque na epicondilite lateral refratária", pontuacao: 7, conclusao: "Adjuvante válido quando exercício falha (NNT=4).", fonte: "Cochrane 2019" },
    ],
    escalas: ["PRTEE (Patient-Rated Tennis Elbow Evaluation)", "DASH", "VAS", "NPRS", "Global Rating of Change (GRC)"],
    atualizacao: "MINT Trial Lancet 2013 | Cochrane Elbow 2019 | BJSM 2021",
  },
};

export const KB: Record<string, KbEntry> = {
  lombalgia: {
    label: "Lombalgia",
    tests: [
      { name: "Lasègue (SLR)", desc: "Radiculopatia L4-S1. Sens. ~80%, Esp. ~40%.", how: "Paciente em DD. Elevar o membro passivamente com joelho estendido. Positivo: dor irradiada abaixo do joelho com ângulo < 60°. Cruzado (crossed SLR) tem especificidade ~90%.", video: "https://www.youtube.com/watch?v=rzndCc1HiUk" },
      { name: "Slump Test", desc: "Tensão neural lombossacra. Sens. ~84%, Esp. ~83%.", how: "Sentado, flexão lombar + extensão joelho + dorsiflexão. Positivo: sintomas reproduzidos e aliviados com extensão cervical. Superior ao SLR na lombalgia com irradiação.", video: "https://www.youtube.com/watch?v=_fMy6pEpRp8" },
      { name: "Teste de Schober", desc: "Mobilidade lombar — hipomobilidade em EA.", how: "Marcar L5 e 10 cm acima em bipedestação. Pedir flexão máxima. Normal: distância aumenta ≥ 5 cm. Modificado de Schober: 5 cm acima + 10 cm abaixo de L5.", video: "https://www.youtube.com/watch?v=iEOiAGoaxQM" },
      { name: "FABER / Patrick", desc: "Disfunção sacroilíaca vs coxofemoral.", how: "Tornozelo do lado testado sobre o joelho contralateral (posição '4'). Pressionar suavemente joelho ipsilateral. Positivo: dor na virilha = coxofemoral; dor posterior = SI.", video: "https://www.youtube.com/watch?v=gRvmXN4GSyo" },
      { name: "Gaenslen", desc: "Articulação sacroilíaca. Sens. ~53%, Esp. ~71%.", how: "Paciente na beira da maca. Uma perna in flexão máxima ao peito, outra em extensão pendente. Estresse simultâneo em direções opostas. Positivo: dor SI ipsilateral.", video: "https://www.youtube.com/watch?v=eLnSdiUZCqY" },
      { name: "Teste de Waddell", desc: "Fatores não-orgânicos / psicossociais (yellow flags).", how: "5 sinais: (1) sensibilidade superficial difusa, (2) dor com simulação de compressão axial, (3) melhora com distração, (4) distribuição regional não-anatômica, (5) reação exagerada. ≥3 positivos = investigar fatores psicossociais.", video: "https://www.youtube.com/watch?v=WOhfYdcj8Jk" },
    ],
    redFlags: ["Déficit neurológico progressivo / paresia", "Síndrome da cauda equina (bexiga/reto)", "Suspeita de fratura osteoporótica ou trauma", "Neoplasia conhecida / perda de peso inexplicada", "Febre + dor noturna intensa (infecção)", "Perda de controle esfincteriano", "Dor que piora em repouso e à noite", "Imunossuprimido / uso de corticoide crônico"],
    goldStandard: "Exercício terapêutico ativo (McKenzie, CFT – Cognitive Functional Therapy, estabilização segmentar). PNE (Pain Neuroscience Education) reduz catastrofização e retorno ao trabalho. Terapia manual como adjuvante de curto prazo. Evitar repouso e medicalização excessiva. (Cochrane 2021 – Evidência A). Não indicar imagem em < 6 sem sem red flags (CPG NICE 2023).",
    yellowFlags: ["Catastrofização (Pain Catastrophizing Scale)", "Cinesiofobia (TSK-17)", "Baixa autoeficácia", "Insatisfação e conflitos no trabalho", "Depressão / ansiedade comórbida", "Expectativa de não recuperação", "Comportamento de doença / evitação"],
    escalas: EVIDENCE.lombalgia.escalas,
  },
  cervicalgia: {
    label: "Cervicalgia",
    tests: [
      { name: "Spurling (Foraminal Compression)", desc: "Radiculopatia cervical. Sens. ~50%, Esp. ~86%.", how: "Rotacionar + inclinar a cabeça para o lado sintomático + compressão axial suave. Positivo: irradiação para o MS ipsilateral. Alta especificidade, usar para confirmar.", video: "https://www.youtube.com/watch?v=GMzS3VbScfc" },
      { name: "Distração Cervical", desc: "Alívio da compressão foraminal. Sens. ~44%, Esp. ~90%.", how: "Tracionar levemente a cabeça em posição neutra (aprox. 5–7 kg). Positivo: alívio da dor ou da irradiação. Complementar ao Spurling.", video: "" },
      { name: "Flexion-Rotation Test (FRT)", desc: "Disfunção C1-C2 / cefaleia cervicogênica. Sens. ~91%, Esp. ~90%.", how: "Paciente em DD, flexão cervical máxima + rotação passiva bilateral. Normal ≥ 44°. Diferença > 10° entre lados = hipomobilidade C1-C2.", video: "https://www.youtube.com/watch?v=RxLJHJG8KbQ" },
      { name: "ULTT 1 – Mediano", desc: "Tensão neural do nervo mediano.", how: "Depressão escapular → abdução 90° → supinação → extensão cotovelo → extensão punho/dedos → inclinação cervical contralateral. Positivo: sintomas reproduzidos, aliviados com inclinação ipsilateral.", video: "" },
      { name: "ULTT 2a – Radial", desc: "Tensão neural do nervo radial.", how: "Depressão escapular → abdução 10° → RI ombro + pronação → flexão punho/dedos. Positivo: sintomas em território radial.", video: "" },
      { name: "Teste de Compressão Axial Cervical", desc: "Lesão discal ou foraminal.", how: "Aplicar pressão axial suave no vertex com a cabeça em posição neutra. Positivo: reprodução de dor cervical local ou irradiada.", video: "" },
    ],
    redFlags: ["Mielopatia (Babinski +, hiperreflexia, marcha atáxica)", "Fratura instável / trauma de alta energia", "Suspeita de dissecção de artéria vertebral (5D + 3N)", "Tumor cervical / mieloma", "Infecção (espondilodiscite)", "Síndrome de Horner associada", "Disfagia / disfonesia progressiva"],
    goldStandard: "Manipulação/mobilização C1-C2 para cefaleia cervicogênica (NNT=2, JOSPT 2023). Exercício de controle motor profundo (longo do pescoço + escalenos) para cervicalgia crônica. ULTT neurogliding para radiculopatia cervical. Combinação manual + exercício superior a cada um isolado (CPG JOSPT 2023 – Evidência A).",
    yellowFlags: ["Dor crônica > 3 meses", "Cefaleia cervicogênica associada", "Tontura cervicogênica", "Trabalho com computador prolongado", "Trauma prévio de alta energia (whiplash)"],
    escalas: EVIDENCE.cervicalgia.escalas,
  },
  gonalgia: {
    label: "Joelho",
    tests: [
      { name: "Lachman", desc: "Ruptura do LCA. Sens. 85%, Esp. 94% (melhor que gaveta anterior).", how: "Joelho 20–30° de flexão em DD. Mão proximal fixa o fêmur, mão distal translada tíbia anteriormente. Positivo: translação > 3 mm sem endpoint firme (graduação 1+/2+/3+).", video: "https://www.youtube.com/watch?v=CSP3QWhlBDo" },
      { name: "Pivot Shift", desc: "LCA – Instabilidade rotacional. Esp. ~98% (confirmatório).", how: "Valgo + RI sobre o joelho estendido enquanto flexiona. Positivo: ressalto articular entre 20–40° (redução da subluxação). Mais específico que Lachman.", video: "" },
      { name: "McMurray", desc: "Lesão meniscal medial e lateral.", how: "Flex/ext do joelho + RI (menisco lateral) e RE (menisco medial). Positivo: clunk palpável + dor na linha articular. Esp. ~98%; sens. ~53%.", video: "https://www.youtube.com/watch?v=PEdzdL3cniI" },
      { name: "Thessaly 20°", desc: "Lesão meniscal – mais sensível. Sens. ~94%, Esp. ~96%.", how: "Paciente em monopé com 20° de flexão, mãos do examinador. Rotação do corpo 3x interna/externa. Positivo: dor ou desconforto na linha articular medial ou lateral.", video: "" },
      { name: "Valgus/Varus Stress", desc: "LCM (valgo) / LCL (varo).", how: "A 0° (integridade cápsula) e a 30° de flexão (LCM/LCL isolado). Abertura articular > 3 mm comparado ao contralateral = positivo. Grau I < 5 mm; Grau II 5–10 mm; Grau III > 10 mm.", video: "" },
      { name: "Clarke / Patelofemoral", desc: "Síndrome patelofemoral.", how: "Pressionar a patela superiormente/inferiormente enquanto o prazo do paciente contrai o quadríceps ativamente. Positivo: dor retropatelar. Baixa especificidade – usar em contexto clínico.", video: "" },
      { name: "Dial Test", desc: "Lesão do canto posterolateral (CPL).", how: "Decúbito ventral. RI comparativa a 30° e 90° de flexão. Diferença > 10° a 30° isolado = CPL; diferença > 10° a 30° e 90° = LCP + CPL.", video: "" },
    ],
    redFlags: ["Hemartrose aguda pós-trauma (suspeitar LCA/fratura)", "Bloqueio mecânico do joelho (corpo livre/menisco deslocado)", "Fratura de plateau tibial / fêmur distal", "Luxação patelar irredutível", "Suspeita de neoplasia óssea", "Síndrome compartimental", "Joelho séptico (dor + febre + derrame)"],
    goldStandard: "Menisco degenerativo: exercício = cirurgia (ESCAPE trial, NEJM 2018 – Evidência A). LCA: protocolo MOON neuromuscular, não operar sem reabilitação prévia. Patelofemoral: glúteo médio + VMO + controle de alinhamento (Evidência A). OA joelho: exercício aeróbio + fortalecimento (OARSI 2023). Evitar injeções repetidas de corticoide em OA (degeneração cartilagem).",
    yellowFlags: ["Medo de re-lesão (ACL-RSI < 56)", "Baixa autoeficácia de movimento", "Sedentarismo prévio", "Sobrepeso/obesidade (IMC > 30)"],
    escalas: EVIDENCE.gonalgia.escalas,
  },
  ombralgia: {
    label: "Ombro",
    tests: [
      { name: "Neer", desc: "Impacto subacromial. Sens. ~72%, Esp. ~66%.", how: "Estabilizar escápula com mão proximal, elevar passivamente em flexão com RI máxima ('encher lata'). Positivo: dor subacromial antes de 180°.", video: "https://www.youtube.com/watch?v=xFRpE6gS2V0" },
      { name: "Hawkins-Kennedy", desc: "Impacto subacromial – mais sensível. Sens. ~79%, Esp. ~59%.", how: "Flexão 90°, cotovelo 90°. Rotação interna passiva forçada. Positivo: dor subacromial. Mais sensível que Neer.", video: "https://www.youtube.com/watch?v=8jqvf9dP5f8" },
      { name: "Empty Can / Jobe", desc: "Supraespinal. Sens. ~69%, Esp. ~66%.", how: "Abdução 90° no plano da escápula (espinha da escápula), RI máxima (polegar para baixo = 'lata vazia'). Resistência manual inferior. Positivo: fraqueza ou dor.", video: "" },
      { name: "Full Can", desc: "Supraespinal (menos doloroso que Empty Can). Esp. superior.", how: "Mesmo que Empty Can mas com RE (polegar para cima = 'lata cheia'). Melhor tolerado e mais específico para rotura.", video: "" },
      { name: "O'Brien (SLAP)", desc: "Labrum superior (SLAP). Sens. ~47%, Esp. ~55%.", how: "Flexão 90°, adução 15°, RI máxima (cotovelo estendido). Resistência axial. Repetir em supinação. Positivo: dor profunda ou clique que MELHORA na supinação.", video: "" },
      { name: "Apreensão Anterior + Relocação", desc: "Instabilidade glenoumeral anterior.", how: "Abdução 90° + RE progressiva. Positivo: apreensão (não necessariamente dor). Relocação (pressão posterior na cabeça umeral) = alívio da apreensão. Esp. ~99% para instabilidade.", video: "" },
      { name: "Gerber Lift-off", desc: "Subescapular.", how: "Mão nas costas (RI ombro). Levantar a mão das costas contra resistência. Positivo: incapacidade ou fraqueza.", video: "" },
    ],
    redFlags: ["Fratura de úmero / clavícula / escápula", "Luxação glenoumeral irredutível", "Ruptura completa do manguito em atleta jovem < 40 anos", "Tumor de Pancoast (dor ombro + Síndrome de Horner)", "Infecção glenoumeral", "Paresia do nervo axilar / espinal"],
    goldStandard: "Impacto subacromial sem ruptura: fortalecimento manguito + escapular SUPERIOR à cirurgia (CSAW trial Lancet 2018 – Evidência A). Ruptura parcial: conservador inicialmente 3–6 meses. Ruptura completa sintomática em < 65 anos: discussão com ortopedia. Ombro congelado: mobilização passiva progressiva + corticoide intra-articular de curto prazo (CPG JOSPT 2022).",
    yellowFlags: ["Trabalho com MS elevado (overhead)", "Esportista de arremesso / overhead", "Dor noturna persistente (sugere ruptura)", "Imobilização prolongada prévia"],
    escalas: EVIDENCE.ombralgia.escalas,
  },
  tornozelo: {
    label: "Tornozelo / Pé",
    tests: [
      { name: "Anterior Drawer", desc: "LTFA (ligamento talofibular anterior) – mais lesado. Sens. ~71%, Esp. ~33%.", how: "Segurar o calcanhar, tornozelo em 10–20° de plantarflexão. Transladar o pé anteriormente com mão plana. Comparar bilateralmente. Translação > 5 mm ou > 3 mm assimétrica = positivo.", video: "" },
      { name: "Talar Tilt", desc: "Ligamento calcaneofibular (LCF). Sens. ~50%, Esp. ~88%.", how: "Inversão forçada passiva do pé com tornozelo em posição neutra. Comparar lado a lado. Assimetria > 5–10° = positivo. Alta especificidade.", video: "" },
      { name: "Ottawa Ankle Rules", desc: "Indicação de radiografia. Sens. ~96–100%.", how: "RX indicado se: (1) dor na zona da ponta do maléolo lateral OU medial, OU (2) incapacidade de apoiar peso e dar 4 passos. Regras do pé: dor em base do 5º metatarso ou navicular.", video: "https://www.youtube.com/watch?v=rBL1r0C4a9g" },
      { name: "Windlass Test", desc: "Fasciíte plantar. Sens. ~32%, Esp. ~100%.", how: "Dorsiflexão passiva dos dedos (especialmente hálux) com paciente em pé e apoio. Positivo: reprodução de dor na inserção da fáscia plantar no calcâneo. Alta especificidade.", video: "" },
      { name: "Thompson (Simmonds)", desc: "Ruptura do tendão de Aquiles. Sens. ~96%, Esp. ~93%.", how: "Paciente em DV com pé fora da maca ou ajoelhado. Apertar a panturrilha no terço médio. Normal: plantarflexão passiva do pé. Positivo: ausência de movimento (gap palpável).", video: "" },
      { name: "CAIT – Cumberland Ankle Instability Tool", desc: "Instabilidade crônica do tornozelo (ICT). Pontuação ≤ 27 = ICT.", how: "Questionário de 9 itens que avalia sensação de instabilidade, torções e confiança em atividades. Preencher com o paciente. Score máximo = 30.", video: "" },
    ],
    redFlags: ["Fratura (Ottawa Rules positivo → RX imediato)", "Ruptura do tendão de Aquiles (Thompson positivo)", "Síndrome compartimental (dor desproporcional + parestesia)", "Luxação talar ou peritalar", "Fratura de stress do navicular / base 5º MT", "Neoplasia óssea / osteomielite"],
    goldStandard: "Entorse lateral Grau I-II: protocolo PEACE & LOVE (2019) – carga precoce com suporte conforme tolerância, SEM imobilização rígida. Fortalecimento fibular + treino proprioceptivo reduz recorrência em 46% (CPG JOSPT 2021 – Evidência A). Fasciíte plantar: alongamento específico da fáscia (Windlass stretching) + taloneiras + excêntrico do gastrocnêmio (Evidência A, Cochrane 2022). Evitar repouso prolongado.",
    yellowFlags: ["Entorses de repetição (> 2 episódios)", "Hipermobilidade generalizada (Beighton ≥ 4)", "Instabilidade crônica percebida", "Calçado inadequado para a atividade"],
    escalas: EVIDENCE.tornozelo.escalas,
  },
  cotovelo: {
    label: "Cotovelo",
    tests: [
      { name: "Teste de Mills", desc: "Tendinopatia lateral dos extensores (epicondilite). Sens. ~53%.", how: "Cotovelo estendido, pronação do antebraço + flexão passiva máxima de punho. Positivo: dor no epicôndilo lateral.", video: "https://www.youtube.com/watch?v=kJmQKO7YDLA" },
      { name: "Teste de Cozen", desc: "Tendinopatia lateral – alta sensibilidade. Sens. ~84%.", how: "Palpação no epicôndilo lateral + extensão ativa de punho contra resistência manual com cotovelo fixo. Positivo: dor aguda no epicôndilo lateral.", video: "https://www.youtube.com/watch?v=kJmQKO7YDLA" },
      { name: "Teste de Golfer (Medial)", desc: "Tendinopatia medial dos flexores.", how: "Cotovelo estendido, supinação de antebraço + extensão passiva de punho. Positivo: dor no epicôndilo medial.", video: "" },
      { name: "Valgus Stress Test", desc: "Ligamento colateral ulnar (LCU). Sens. ~65%, Esp. ~60%.", how: "Cotovelo em 20–30° de flexão. Aplicar força em valgo. Positivo: dor medial ou sensação de abertura/frouxidão.", video: "" },
      { name: "Moving Valgus Stress", desc: "LCU – atletas arremessadores. Sens. ~100%, Esp. ~75%.", how: "Ombro abduzido 90°, cotovelo em flexão máxima. Valgo constante enquanto estende o cotovelo rapidamente. Positivo: dor medial entre 70–120° ('shear angle').", video: "" },
      { name: "Milking Maneuver", desc: "Instabilidade posteromedial / LCU.", how: "Paciente traciona o próprio polegar com cotovelo flexionado > 90° e ombro abduzido (simula arremesso). Positivo: instabilidade ou dor medial.", video: "" },
      { name: "Lateral Pivot Shift (Cotovelo)", desc: "Instabilidade rotatória lateral (IRL).", how: "Paciente em DD, MS elevado. Supinação + valgo + compressão axial enquanto flexiona o cotovelo. Positivo: subluxação/ressalto da cabeça do rádio.", video: "" },
      { name: "Elbow Flexion Test (Nervo Ulnar)", desc: "Síndrome do canal cubital. Sens. ~75%, Esp. ~99%.", how: "Flexão máxima do cotovelo + extensão do punho mantidos por 1–3 minutos. Positivo: parestesia nos dedos 4º e 5º e/ou face ulnar da mão.", video: "" },
    ],
    redFlags: ["Fratura de olécrano / cabeça do rádio (Ottawa Elbow Rules)", "Luxação de cotovelo", "Lesão vascular / síndrome compartimental do antebraço", "Paralisia nervosa completa (radial / ulnar / mediano)", "Tumor ósseo / exostose", "Artrite séptica"],
    goldStandard: "Tendinopatia lateral: exercício isométrico (analgesia imediata) → excêntrico → carga progressiva. Isométrico SUPERIOR a AINE e placebo a curto prazo (BJSM 2021 – Evidência A). Evitar corticoide a longo prazo: recidiva > 72% em 52 semanas (MINT trial, Lancet 2013). Ondas de choque radiais como adjuvante quando exercício falha (Cochrane 2019). Instabilidade LCU: cirurgia em atletas de alta performance; conservador em sedentários com fortalecimento de flexores de punho.",
    yellowFlags: ["Atividade ocupacional repetitiva (pinça, digitação, parafusar)", "Esportista de raquete / arremessador", "Baixa adesão ao repouso relativo", "Uso excessivo de mouse/teclado"],
    escalas: EVIDENCE.cotovelo.escalas,
  },
};

export const detectKB = (txt: string): string => {
  const t = txt.toLowerCase();
  if (t.match(/lomb|costas/)) return "lombalgia";
  if (t.match(/cerv|pescoço/)) return "cervicalgia";
  if (t.match(/joelh|gon/)) return "gonalgia";
  if (t.match(/ombr/)) return "ombralgia";
  if (t.match(/tornoz|pé |pe |fasci|aquile/)) return "tornozelo";
  if (t.match(/cotov|epicond|tênisist|golfist/)) return "cotovelo";
  return "";
};
