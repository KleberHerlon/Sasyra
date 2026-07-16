import { useState } from "react";

const F = "'Inter','Segoe UI',system-ui,sans-serif";

const pulseKeyframes = `
@keyframes tipsPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4); }
  50% { box-shadow: 0 0 0 6px rgba(74, 222, 128, 0); }
}
@keyframes tipsGlow {
  0%, 100% { border-color: rgba(74, 222, 128, 0.3); }
  50% { border-color: rgba(74, 222, 128, 0.8); }
}
`;

if (typeof document !== "undefined" && !document.getElementById("tips-animations")) {
  const style = document.createElement("style");
  style.id = "tips-animations";
  style.textContent = pulseKeyframes;
  document.head.appendChild(style);
}

const MODULE_TIPS = {
  ortopedica: {
    title: "Fisioterapia Ortopédica",
    tips: [
      { icon: "🎤", title: "Microfone na Queixa e HDA", desc: "Clique no ícone 🎤 ao lado dos campos para ditar a queixa e a história clínica. O sistema transcreve e detecta automaticamente músculos, lateralidade e caráter da dor." },
      { icon: "🧠", title: "Scanner Clínico Inteligente", desc: "Ao digitar a queixa, o sistema detecta automaticamente condições da base de conhecimento (50+) e sugere testes ortopédicos, escalas e evidências associadas." },
      { icon: "🗺️", title: "BodyMap Interativo", desc: "Clique diretamente nas áreas do corpo para marcar a localização da dor. Use os botões Frente/Costas para alternar a vista." },
      { icon: "📊", title: "Escalas e Questionários", desc: "Na aba Evolução, use o campo 'Escala aplicada nesta sessão' para aplicar qualquer uma das 114 escalas validadas disponíveis. As sugeridas pela condição detectada aparecem em destaque." },
      { icon: "🔬", title: "Evidências Baseadas em PEDro", desc: "A aba Evidências mostra as condições detectadas com escalas recomendadas e referências. As red flags e yellow flags são destacadas automaticamente." },
      { icon: "📐", title: "Goniometria Rápida", desc: "Na seção Goniometria, selecione a articulação e use os sliders para registrar a amplitude. Valores de referência normais aparecem como guia." },
      { icon: "💾", title: "Histórico de Avaliações", desc: "Salve cada avaliação completa. Na aba Evolução, visualize a progressão da dor (EVA) e das escalas ao longo das sessões." },
      { icon: "🤖", title: "Análise por IA", desc: "Ao final da avaliação, gere uma análise clínica baseada em evidências. A IA cruza todos os dados da avaliação e sugere condutas." },
      { icon: "📄", title: "Relatório e PDF", desc: "Na aba Relatório, gere um PDF completo com todos os dados da avaliação para compartilhar com o paciente ou outros profissionais." },
    ]
  },
  neuro: {
    title: "Fisioterapia Neurológica",
    tips: [
      { icon: "🎤", title: "Microfone na Queixa", desc: "Use o microfone para ditar a queixa. O sistema detecta automaticamente músculos e condições neurológicas." },
      { icon: "🗺️", title: "DermatomeMap e ReflexMatrix", desc: "Clique diretamente nos dermátomos no mapa interativo. Use a matriz de reflexos para registrar reflexos tendinosos e patológicos." },
      { icon: "⏱️", title: "Stopwatch para TUG", desc: "Use o cronômetro integrado para medir o Timed Up and Go e outros testes cronometrados." },
      { icon: "📊", title: "Escalas Neurológicas", desc: "Glasgow (GCS), MAS (Ashworth), BBS (Berg), MIF, TIS estão disponíveis. Use o ScaleSelector para acessar Fugl-Meyer, NIHSS, SCIM, EDSS e Barthel." },
      { icon: "🔗", title: "Ponte de Transição", desc: "Alertas de contraindicações de outras avaliações aparecem automaticamente no topo da tela." },
    ]
  },
  geriatria: {
    title: "Fisioterapia Geriátrica",
    tips: [
      { icon: "🧩", title: "Escalas Inline Completas", desc: "MEEM (30 perguntas), GDS-15 (15 itens), Katz (6 AVDs), Lawton (8 AVDs), SARC-F (5 itens), Tinetti (18 sub-itens), BBS (14 tarefas) e Fragilidade Fried (5 critérios) estão disponíveis como questionários interativos." },
      { icon: "📏", title: "Medidas Objetivas", desc: "Registre dinamometria, circunferência da panturrilha e velocidade de marcha para complementar a avaliação de sarcopenia." },
      { icon: "📊", title: "Mais Escalas no ScaleSelector", desc: "Use o ScaleSelector para aplicar MNA (nutricional, 18 itens), FES-I (medo de cair, 16 itens), SPPB (desempenho físico) e CFS (fragilidade clínica)." },
    ]
  },
  uro: {
    title: "Fisioterapia Uro-Ginecológica",
    tips: [
      { icon: "📝", title: "Diário Miccional 3 Dias (ICS)", desc: "Preencha o diário completo por 72 horas. O sistema calcula automaticamente volume médio, frequência, perdas e alerta de poliúria. Padrão-ouro da International Continence Society." },
      { icon: "🗺️", title: "Mapa do Assoalho Pélvico", desc: "Use o PelvicFloorMap para marcar áreas de dor ou disfunção no assoalho pélvico." },
      { icon: "📊", title: "POP-Q Completo", desc: "Registre os 7 pontos do POP-Q para quantificar o prolapso de órgãos pélvicos." },
      { icon: "📋", title: "Questionários Validados", desc: "ICIQ-SF, PFDI-20, FSFI, PISQ-12, UDI-6 e OAB-q disponíveis inline e no ScaleSelector." },
      { icon: "🩺", title: "Oxford e PERFECT", desc: "Avalie a força do assoalho pélvico com Oxford (0-5) e PERFECT (Power, Endurance, Reps, Fast)." },
    ]
  },
  default: {
    title: "Dicas de Uso",
    tips: [
      { icon: "🎤", title: "Microfone nos campos de texto", desc: "Use o ícone 🎤 ao lado dos campos para ditar em vez de digitar." },
      { icon: "🗺️", title: "BodyMap interativo", desc: "Clique diretamente nas áreas do corpo para marcar dor." },
      { icon: "📊", title: "ScaleSelector", desc: "Os botões de escala abrem questionários completos ou sliders numéricos." },
      { icon: "📈", title: "Evolução", desc: "Acompanhe a progressão da dor e escalas ao longo das sessões." },
      { icon: "🔗", title: "Ponte de Transição", desc: "Restrições clínicas de avaliações anteriores aparecem em alertas âmbar." },
      { icon: "💾", title: "Salvamento", desc: "Salve sempre a avaliação antes de trocar de paciente." },
    ]
  }
};

export function getModuleTips(moduleId) {
  return MODULE_TIPS[moduleId] || MODULE_TIPS.default;
}

export default function HelpTips({ moduleId, colors }) {
  const [open, setOpen] = useState(false);
  const C = colors || {};
  const { title, tips } = getModuleTips(moduleId);

  return (
    <>
      <button onClick={() => setOpen(true)}
        style={{
          background: C.greenBg || "rgba(74,222,128,0.10)",
          border: `2px solid ${(C.green || "var(--green)")}50`,
          borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700,
          color: C.green || "var(--green)", cursor: "pointer", fontFamily: F,
          display: "inline-flex", alignItems: "center", gap: 6,
          animation: "tipsPulse 3s ease-in-out infinite, tipsGlow 2s ease-in-out infinite",
          transition: "all 0.2s",
        }}
        title="Guia de funcionalidades do módulo">
        💡 Dicas
      </button>

      {open && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 2000, padding: 16,
        }} onClick={() => setOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: C.card || "var(--card)", border: `1px solid ${C.border || "var(--border)"}`,
            borderRadius: 16, padding: "24px 28px", maxWidth: 600, width: "100%", maxHeight: "80vh",
            overflow: "auto", fontFamily: F, color: C.text || "var(--text)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: C.green || "var(--green)" }}>
                💡 {title} — Funcionalidades
              </h3>
              <button onClick={() => setOpen(false)}
                style={{ background: "transparent", border: "none", color: C.textMuted || "var(--textMuted)", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {tips.map((t, i) => (
                <div key={i} style={{
                  background: C.cardAlt || "var(--cardAlt)", borderRadius: 10,
                  padding: "10px 14px", border: `1px solid ${C.borderLight || "var(--borderLight)"}`,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text || "var(--text)", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 18 }}>{t.icon}</span>
                    {t.title}
                  </div>
                  <div style={{ fontSize: 11, color: C.textSub || "var(--textSub)", lineHeight: 1.5 }}>
                    {t.desc}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, padding: "10px 14px", background: C.greenBg || "var(--greenBg)", borderRadius: 8, border: "1px solid var(--green)", fontSize: 11, color: C.textSub || "var(--textSub)", lineHeight: 1.5 }}>
              <strong style={{ color: "var(--green)" }}>💡 Dica:</strong> Passe o mouse sobre qualquer botão ou campo para ver dicas rápidas. Os campos com borda vermelha indicam valores fora do intervalo esperado.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
