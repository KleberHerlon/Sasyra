import { useState } from "react";
import MoneyCell from "@/components/MoneyCell";
import { COLORS } from "@/styles/theme";

// Import regional data dynamically or directly
export const CREFITO_REGIOES: Record<string, { consulta: number; sessao: number; avaliacao: number; relatorio: number }> = {
  "Sul (RS/SC/PR)": { consulta: 180, sessao: 160, avaliacao: 250, relatorio: 120 },
  "Sudeste SP": { consulta: 220, sessao: 200, avaliacao: 320, relatorio: 150 },
  "Sudeste RJ/ES/MG": { consulta: 190, sessao: 170, avaliacao: 280, relatorio: 130 },
  "Centro-Oeste": { consulta: 170, sessao: 150, avaliacao: 240, relatorio: 110 },
  "Nordeste": { consulta: 150, sessao: 140, avaliacao: 220, relatorio: 100 },
  "Norte": { consulta: 140, sessao: 130, avaliacao: 210, relatorio: 95 },
};

// Fixed typo in Nordeste rel00 to relatorio just in case, but let's keep exact keys to avoid changing behavior:
// Actually, let's keep exact keys but make it correct if there was a typo. Let's see: Nordeste key rel00 or relatorio?
// In the original file it was: `"Nordeste": { consulta: 150, sessao: 140, avaliacao: 220, relatorio: 100 },`
// Oh! My replacement had `rel00`. Let me be very careful. It should be `relatorio: 100`. Let's correct it:
// "Nordeste": { consulta: 150, sessao: 140, avaliacao: 220, relatorio: 100 },

interface HonorariosCardProps {
  convenio: string;
  regiao: string;
  sessoesAuth: string | undefined;
}

export default function HonorariosCard({ convenio, regiao, sessoesAuth }: HonorariosCardProps) {
  const [custom, setCustom] = useState<{
    avaliacao: string | null;
    sessao: string | null;
    consulta: string | null;
    relatorio: string | null;
  }>({
    avaliacao: null,
    sessao: null,
    consulta: null,
    relatorio: null,
  });

  if (convenio !== "Particular") return null;

  const tabela = CREFITO_REGIOES[regiao] || CREFITO_REGIOES["Centro-Oeste"];
  const sessoes = parseInt(sessoesAuth || "") || 10;

  const eff = {
    avaliacao: custom.avaliacao != null ? Number(custom.avaliacao) : tabela.avaliacao,
    sessao: custom.sessao != null ? Number(custom.sessao) : tabela.sessao,
    consulta: custom.consulta != null ? Number(custom.consulta) : tabela.consulta,
    relatorio: custom.relatorio != null ? Number(custom.relatorio) : tabela.relatorio,
  };

  const totalSessoes = eff.sessao * sessoes;
  const totalEstimado = eff.avaliacao + totalSessoes + eff.relatorio + eff.consulta;

  return (
    <div
      style={{
        background: COLORS.purpleBg,
        border: `1px solid ${COLORS.purple}40`,
        borderRadius: 12,
        padding: "16px 18px",
        marginTop: 12,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: COLORS.purple,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        💰 HONORÁRIOS CREFITO — REFERÊNCIA PARA ATENDIMENTO PARTICULAR
      </div>
      <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 10 }}>
        Baseado na Tabela de Honorários do COFFITO (Res. 424/2013) e reajustes regionais. Valores em
        R$ (referência 2024).
      </div>

      <div
        style={{
          background: COLORS.card,
          borderRadius: 8,
          padding: "10px 14px",
          border: `1px solid ${COLORS.purple}30`,
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 700, textTransform: "uppercase" }}>
            Valor por sessão
          </span>
          <span style={{ fontSize: 18, fontWeight: 900, color: COLORS.purple }}>
            R$ {eff.sessao.toFixed(2)}
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 10 }}>
        <MoneyCell
          label="Avaliação / Triagem"
          suggested={tabela.avaliacao}
          value={custom.avaliacao}
          onChange={(v) => setCustom((c) => ({ ...c, avaliacao: v }))}
        />
        <MoneyCell
          label="Sessão de Fisioterapia"
          suggested={tabela.sessao}
          value={custom.sessao}
          onChange={(v) => setCustom((c) => ({ ...c, sessao: v }))}
        />
        <MoneyCell
          label="Consulta de Retorno"
          suggested={tabela.consulta}
          value={custom.consulta}
          onChange={(v) => setCustom((c) => ({ ...c, consulta: v }))}
        />
        <MoneyCell
          label="Relatório / Laudo"
          suggested={tabela.relatorio}
          value={custom.relatorio}
          onChange={(v) => setCustom((c) => ({ ...c, relatorio: v }))}
        />
      </div>

      <div style={{ background: COLORS.card, borderRadius: 8, padding: "10px 14px", border: `1px solid ${COLORS.purple}30` }}>
        <div style={{ fontSize: 10, color: COLORS.textMuted, lineHeight: 1.6, marginBottom: 8 }}>
          <div>Avaliação / Triagem: R$ {eff.avaliacao.toFixed(2)}</div>
          <div>
            {sessoes} sessões × R$ {eff.sessao.toFixed(2)}: R$ {totalSessoes.toFixed(2)}
          </div>
          <div>Consulta de Retorno: R$ {eff.consulta.toFixed(2)}</div>
          <div>Relatório / Laudo: R$ {eff.relatorio.toFixed(2)}</div>
        </div>
        <div style={{ height: 1, background: `${COLORS.purple}20`, marginBottom: 8 }} />
        <div
          style={{
            fontSize: 10,
            color: COLORS.textMuted,
            fontWeight: 700,
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          Valor total
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, color: COLORS.purple }}>
          R$ {totalEstimado.toFixed(2)}
        </div>
      </div>

      <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 8, lineHeight: 1.5 }}>
        ⚠️ Estes valores são <strong>referências mínimas</strong> sugeridas pelo CREFITO. O
        profissional pode definir seus honorários acima destes valores com base em especialização,
        experiência e localidade. Consulte sempre a tabela vigente do seu CREFITO regional.
      </div>
    </div>
  );
}
