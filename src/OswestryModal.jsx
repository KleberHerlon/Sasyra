import { useState } from "react";

const F = "'Inter',-apple-system,BlinkMacSystemFont,sans-serif";

const QUESTIONS = [
  { id:"pain", label:"Intensidade da dor", options:[
    "Suporto a dor sem precisar de analgésicos",
    "A dor é forte, mas consigo lidar sem analgésicos",
    "Analgésicos eliminam completamente a dor",
    "Analgésicos aliviam moderadamente a dor",
    "Analgésicos aliviam muito pouco a dor",
    "Analgésicos não têm efeito e não os uso",
  ]},
  { id:"personal", label:"Cuidados pessoais (lavar, vestir, etc.)", options:[
    "Consigo cuidar de mim normalmente sem dor extra",
    "Consigo cuidar de mim normalmente mas é muito doloroso",
    "Cuidar de mim é doloroso, sou lento e cuidadoso",
    "Preciso de alguma ajuda mas consigo a maior parte",
    "Preciso de ajuda diária na maioria dos cuidados",
    "Não me visto, lavo-me com dificuldade e fico na cama",
  ]},
  { id:"lifting", label:"Levantar peso", options:[
    "Consigo levantar pesos sem dor extra",
    "Consigo levantar pesos mas causa dor extra",
    "A dor impede levantar pesos do chão, mas consigo se colocados em local conveniente",
    "A dor impede levantar pesos, mas consigo pesos leves se bem posicionados",
    "Consigo levantar apenas pesos muito leves",
    "Não consigo levantar ou carregar nada",
  ]},
  { id:"walking", label:"Caminhar", options:[
    "A dor não me impede de caminhar qualquer distância",
    "A dor impede de caminhar mais de 1 km",
    "A dor impede de caminhar mais de 400 m",
    "A dor impede de caminhar mais de 100 m",
    "Só consigo andar com bengala ou muletas",
    "Fico na cama a maior parte do tempo e arrasto-me ao banheiro",
  ]},
  { id:"sitting", label:"Sentar", options:[
    "Consigo sentar em qualquer cadeira o tempo que quiser",
    "Consigo sentar apenas na minha cadeira favorita o tempo que quiser",
    "A dor impede de sentar mais de 1 hora",
    "A dor impede de sentar mais de 30 minutos",
    "A dor impede de sentar mais de 10 minutos",
    "A dor impede de sentar completamente",
  ]},
  { id:"standing", label:"Ficar em pé", options:[
    "Consigo ficar em pé o tempo que quiser sem dor extra",
    "Consigo ficar em pé o tempo que quiser mas causa dor extra",
    "A dor impede de ficar em pé mais de 1 hora",
    "A dor impede de ficar em pé mais de 30 minutos",
    "A dor impede de ficar em pé mais de 10 minutos",
    "Evito ficar em pé e a dor impede completamente",
  ]},
  { id:"sleeping", label:"Dormir", options:[
    "A dor não atrapalha meu sono",
    "Só durmo bem usando analgésicos",
    "Mesmo com analgésicos, durmo menos de 6 horas",
    "Mesmo com analgésicos, durmo menos de 4 horas",
    "Mesmo com analgésicos, durmo menos de 2 horas",
    "A dor impede de dormir completamente",
  ]},
  { id:"social", label:"Vida social", options:[
    "Minha vida social é normal e sem dor extra",
    "Minha vida social é normal mas a dor aumenta",
    "A dor não afeta significativamente exceto em atividades mais energéticas (ex: esportes)",
    "A dor restringiu minha vida social e saio menos",
    "A dor restringiu minha vida social ao meu lar",
    "Não tenho vida social por causa da dor",
  ]},
  { id:"traveling", label:"Viajar", options:[
    "Consigo viajar para qualquer lugar sem dor extra",
    "Consigo viajar para qualquer lugar mas causa dor extra",
    "A dor é forte mas consigo viagens de mais de 2 horas",
    "A dor me restringe a viagens de menos de 1 hora",
    "A dor me restringe a pequenas viagens necessárias de menos de 30 min",
    "A dor me impede de viajar exceto para tratamento",
  ]},
];

function interpretODI(score) {
  if (score <= 20) return { level:"Incapacidade mínima", desc:"Consegue lidar com a maioria das atividades. Geralmente não precisa de tratamento além de orientação postural e exercícios.", color:"#16A34A" };
  if (score <= 40) return { level:"Incapacidade moderada", desc:"Sente mais dor e dificuldade ao sentar, levantar e ficar em pé. Atividades de trabalho e sociais podem ser afetadas. Tratamento conservador indicado.", color:"#D97706" };
  if (score <= 60) return { level:"Incapacidade severa", desc:"Dor é o principal problema. Atividades diárias e de trabalho são significativamente afetadas. Avaliação especializada e reabilitação intensiva são necessárias.", color:"#DC2626" };
  if (score <= 80) return { level:"Incapacidade grave", desc:"Dor limita severamente todas as atividades. Cuidados pessoais e mobilidade são muito comprometidos. Necessita de intervenção multidisciplinar.", color:"#7C3AED" };
  return { level:"Incapacidade total / Restrito ao leito", desc:"Paciente acamado ou com todas as funções severamente comprometidas pela dor.", color:"#BE185D" };
}

export default function OswestryModal({ open, onClose, onSave, initial }) {
  const [answers, setAnswers] = useState(initial || {});
  const [saved, setSaved] = useState(false);

  if (!open) return null;

  const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined);

  const handleAnswer = (qId, val) => {
    setAnswers(p => ({ ...p, [qId]: val }));
    setSaved(false);
  };

  const total = QUESTIONS.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
  const pct = Math.round((total / (QUESTIONS.length * 5)) * 100);
  const interpretation = interpretODI(pct);

  const handleSave = () => {
    onSave({ total, pct, answers, date: new Date().toISOString().slice(0,10) });
    setSaved(true);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", padding:16, fontFamily:F }}>
      <div style={{ background:"var(--bg)", border:"1px solid var(--border)", borderRadius:16, maxWidth:700, width:"100%", maxHeight:"90vh", overflow:"auto", padding:"24px 28px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:800, color:"var(--green)", letterSpacing:"0.05em" }}>ESCALA FUNCIONAL</div>
            <div style={{ fontSize:20, fontWeight:800, color:"var(--text)", marginTop:2 }}>Oswestry Disability Index (ODI)</div>
            {saved && <div style={{ fontSize:12, color:"var(--green)", marginTop:4 }}>✓ Resultado salvo</div>}
          </div>
          <button onClick={onClose} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:8, color:"var(--textMuted)", width:32, height:32, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        </div>

        <div style={{ background:"var(--card)", borderRadius:10, padding:"12px 16px", marginBottom:18 }}>
          <div style={{ fontSize:11, color:"var(--textMuted)", marginBottom:8 }}>Cada seção vale 0–5 pontos. Total: {total}/50 ({pct}%)</div>
          <div style={{ height:8, background:"var(--border)", borderRadius:4, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:"var(--green)", borderRadius:4, transition:"width 0.3s" }} />
          </div>
          {allAnswered && (
            <div style={{ marginTop:8, fontSize:12, color:interpretation.color, fontWeight:700 }}>
              {interpretation.level} — {interpretation.desc}
            </div>
          )}
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {QUESTIONS.map((q, qi) => (
            <div key={q.id} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:10, padding:"10px 14px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:"var(--text)", marginBottom:8 }}>
                {qi + 1}. {q.label}
                {answers[q.id] !== undefined && <span style={{ color:"var(--green)", marginLeft:6, fontSize:10 }}>({answers[q.id]}/5)</span>}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                {q.options.map((opt, oi) => (
                  <label key={oi} style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 0", cursor:"pointer", fontSize:11, color:"var(--textSub)", lineHeight:1.4 }}>
                    <input type="radio" name={q.id} checked={answers[q.id] === oi} onChange={() => handleAnswer(q.id, oi)}
                      style={{ accentColor:"var(--green)", flexShrink:0 }} />
                    <span>{oi}. {opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:10, marginTop:18, justifyContent:"flex-end", borderTop:"1px solid var(--border)", paddingTop:16 }}>
          <button onClick={onClose} style={{ background:"transparent", border:"1px solid var(--border)", borderRadius:8, padding:"8px 18px", fontSize:12, color:"var(--textMuted)", cursor:"pointer" }}>Fechar</button>
          <button onClick={handleSave} disabled={!allAnswered}
            style={{ background:allAnswered?"var(--green)":"var(--border)", border:"none", borderRadius:8, padding:"8px 18px", fontSize:12, fontWeight:700, color:allAnswered?"#0E141B":"var(--textMuted)", cursor:allAnswered?"pointer":"not-allowed" }}>
            {saved ? "Salvo ✓" : "Salvar resultado"}
          </button>
        </div>
      </div>
    </div>
  );
}
