import { useState } from "react";
import { CREFITO_REGIOES, HonorariosCard } from "../components";
import { CIF } from "../data/cif";

const C = {
  bg:"#0E141B",surface:"#111822",card:"#19243A",cardAlt:"#162030",
  border:"#1F2E45",borderLight:"#2A3F5C",green:"#4ADE80",greenDim:"#22C55E",
  greenDeep:"#0D9E5C",greenBg:"rgba(74,222,128,0.09)",greenBgHov:"rgba(74,222,128,0.16)",
  amber:"#FBBF24",amberBg:"rgba(251,191,36,0.10)",red:"#F87171",redBg:"rgba(248,113,113,0.09)",
  blue:"#60A5FA",blueBg:"rgba(96,165,250,0.09)",purple:"#A78BFA",purpleBg:"rgba(167,139,250,0.09)",
  text:"#DDE6F0",textSub:"#A8BECC",textMuted:"#5E7A96",textDim:"#364D62",white:"#FFFFFF",
};
const F = "'Inter','Segoe UI',system-ui,sans-serif";
const sel = (e={}) => ({ width:"100%", boxSizing:"border-box", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:13, padding:"9px 12px", outline:"none", fontFamily:F, cursor:"pointer", ...e });
const lbl = (e={}) => ({ display:"block", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textMuted, marginBottom:5, ...e });
const card = (e={}) => ({ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 22px", marginBottom:14, ...e });

export default function CifAndHonorarios({ cifCodes, convenio, regiao, setRegiao, sessoesAuth, color }) {
  const accent = color || C.purple;
  const accentBg = `${accent}18`;

  return (
    <div style={{ marginTop:4 }}>
      {cifCodes && cifCodes.length > 0 && (
        <div style={card()}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14, paddingBottom:10, borderBottom:`1px solid ${C.border}` }}>
            <span style={{ fontSize:16 }}>📋</span>
            <h3 style={{ margin:0, fontSize:11, fontWeight:800, letterSpacing:"0.11em", textTransform:"uppercase", color:accent, flex:1 }}>Classificação CIF — Diagnóstico Funcional</h3>
          </div>
          <div style={{ fontSize:12, color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>
            Códigos da Classificação Internacional de Funcionalidade, Incapacidade e Saúde sugeridos para o quadro clínico.
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {cifCodes.map(code => (
              <div key={code} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", background:accentBg, border:`1px solid ${accent}30`, borderRadius:8 }}>
                <span style={{ fontSize:13, fontWeight:800, color:accent, fontFamily:"'Courier New',monospace", minWidth:60 }}>{code}</span>
                <span style={{ fontSize:12, color:C.textSub, lineHeight:1.4 }}>{CIF[code] || "Código não encontrado"}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize:10, color:C.textMuted, marginTop:8, lineHeight:1.5 }}>
            Qualificadores (0-4) devem ser definidos pelo profissional: 0=sem deficiência, 1=leve, 2=moderado, 3=grave, 4=completo.
          </div>
        </div>
      )}

      <div style={card()}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14, paddingBottom:10, borderBottom:`1px solid ${C.border}` }}>
          <span style={{ fontSize:16 }}>💰</span>
          <h3 style={{ margin:0, fontSize:11, fontWeight:800, letterSpacing:"0.11em", textTransform:"uppercase", color:accent, flex:1 }}>Honorários CREFITO</h3>
        </div>
        <div style={{ marginBottom:12 }}>
          <span style={lbl()}>Região CREFITO</span>
          <select value={regiao} onChange={e => setRegiao(e.target.value)} style={sel()}>
            {Object.keys(CREFITO_REGIOES).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <HonorariosCard convenio={convenio} regiao={regiao} sessoesAuth={sessoesAuth || 10} />
      </div>
    </div>
  );
}
