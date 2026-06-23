export function gerarPDFPerformance({
  student,
  assessment,
  treino,
  objetivo,
  nivel,
  divisao,
  pseSessoes,
  macrociclo,
}) {
  const w = window.open("", "_blank");
  if (!w) return;

  const now = new Date();
  const dataStr = now.toLocaleDateString("pt-BR");

  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Relatório de Performance - ${student?.nome || "Aluno"}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',sans-serif; background:#fff; color:#1a1a2e; padding:40px; font-size:12px; line-height:1.6; }
  .header { display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid #4ADE80; padding-bottom:16px; margin-bottom:24px; }
  .header h1 { font-size:20px; font-weight:800; color:#0D9E5C; }
  .header .data { font-size:11px; color:#666; }
  .info-row { display:flex; gap:40px; margin-bottom:20px; flex-wrap:wrap; }
  .info-row .block { min-width:120px; }
  .info-row .block .label { font-size:9px; font-weight:700; text-transform:uppercase; color:#999; letter-spacing:0.08em; }
  .info-row .block .value { font-size:16px; font-weight:700; color:#1a1a2e; }
  h2 { font-size:14px; font-weight:800; color:#0D9E5C; margin-top:28px; margin-bottom:12px; border-bottom:1px solid #ddd; padding-bottom:6px; text-transform:uppercase; letter-spacing:0.05em; }
  h3 { font-size:12px; font-weight:700; color:#333; margin-top:16px; margin-bottom:8px; }
  table { width:100%; border-collapse:collapse; margin-bottom:16px; }
  th { background:#4ADE80; color:#061A0C; padding:8px 10px; font-size:10px; font-weight:700; text-align:left; text-transform:uppercase; letter-spacing:0.05em; }
  td { padding:7px 10px; border-bottom:1px solid #eee; font-size:11px; }
  tr:nth-child(even) td { background:#f8faf8; }
  .card { background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:14px 16px; margin-bottom:12px; }
  .card .title { font-size:10px; font-weight:700; text-transform:uppercase; color:#0D9E5C; letter-spacing:0.05em; margin-bottom:4px; }
  .card .val { font-size:22px; font-weight:800; color:#1a1a2e; }
  .card .sub { font-size:10px; color:#666; }
  .grid-5 { display:grid; grid-template-columns:repeat(5,1fr); gap:10px; margin-bottom:16px; }
  .footer { margin-top:32px; padding-top:16px; border-top:2px solid #4ADE80; font-size:10px; color:#999; text-align:center; }
  .badge { display:inline-block; background:#4ADE80; color:#061A0C; font-size:9px; font-weight:700; padding:2px 8px; border-radius:4px; margin-right:4px; }
  .obs { font-size:10px; color:#888; font-style:italic; margin-top:4px; }
  .page-break { page-break-before:always; }
  @media print { body { padding:20px; } }
</style></head><body>`;

  // Header
  html += `<div class="header">
    <div><h1>RELATÓRIO DE PERFORMANCE</h1><div style="font-size:11px;color:#666;margin-top:2px;">SASYRA — Sistema de Apoio à Decisão Clínica</div></div>
    <div class="data">${dataStr}</div>
  </div>`;

  // Student info
  const idade = student?.dataNasc ? calcIdade(student.dataNasc) : "—";
  html += `<div class="info-row">
    <div class="block"><div class="label">Aluno</div><div class="value">${student?.nome || "—"}</div></div>
    <div class="block"><div class="label">Sexo</div><div class="value">${student?.sexo || "—"}</div></div>
    <div class="block"><div class="label">Idade</div><div class="value">${idade} anos</div></div>
    <div class="block"><div class="label">Peso / Altura</div><div class="value">${student?.peso || "—"} kg / ${student?.altura || "—"} cm</div></div>
    ${objetivo ? `<div class="block"><div class="label">Objetivo</div><div class="value">${objetivo}</div></div>` : ""}
    ${nivel ? `<div class="block"><div class="label">Nível</div><div class="value">${nivel}</div></div>` : ""}
  </div>`;

  // Assessment cards
  if (assessment) {
    html += `<h2>📊 Avaliação Física</h2><div class="grid-5">`;
    const cards = [
      { label: "% Gordura", val: assessment.percentualGordura != null ? `${assessment.percentualGordura}%` : "—" },
      { label: "VO₂ Máx", val: assessment.vo2max != null ? `${assessment.vo2max} ml/kg/min` : "—" },
      { label: "1RM Estimado", val: assessment.rm != null ? `${assessment.rm} kg` : "—" },
      { label: "IMC", val: assessment.imc != null ? assessment.imc : "—" },
      { label: "Protocolo", val: assessment.protocolo || "—" },
    ];
    cards.forEach(c => {
      html += `<div class="card"><div class="title">${c.label}</div><div class="val">${c.val}</div></div>`;
    });
    html += `</div>`;

    if (assessment.densidadeCorporal != null) {
      html += `<p style="font-size:10px;color:#666;">Densidade corporal: ${assessment.densidadeCorporal} g/cm³ · ${assessment.protocolo}</p>`;
    }
    html += `<p style="font-size:9px;color:#999;font-style:italic;">Referência: ${assessment.referencia || "Pollock ML, Jackson AS. Generalized equations for predicting body density."}</p>`;
  }

  // Exercise Prescription
  if (treino && treino.length > 0) {
    html += `<div class="page-break"></div>`;
    html += `<h2>🏋️ Prescrição de Treino</h2>`;
    html += `<div class="info-row">
      ${objetivo ? `<div class="block"><div class="label">Objetivo</div><div class="value">${objetivo}</div></div>` : ""}
      ${nivel ? `<div class="block"><div class="label">Nível</div><div class="value">${nivel}</div></div>` : ""}
      ${divisao ? `<div class="block"><div class="label">Divisão</div><div class="value">${divisao}</div></div>` : ""}
    </div>`;

    treino.forEach(grupo => {
      const exs = grupo.exercicios || [];
      if (exs.length === 0) return;
      html += `<h3>${grupo.nome} <span style="font-weight:400;font-size:10px;color:#666;">— ${grupo.foco || ""}</span></h3>`;
      html += `<table><thead><tr><th style="width:32px;">#</th><th>Exercício</th><th>Músculo</th><th>Séries</th><th>Repetições</th><th>Carga</th><th>Descanso</th></tr></thead><tbody>`;
      exs.forEach((ex, i) => {
        html += `<tr>
          <td>${i + 1}</td>
          <td><strong>${ex.nome}</strong></td>
          <td>${ex.musculoPrimario || "—"}</td>
          <td>${ex.series || "—"}</td>
          <td>${ex.repeticoes || "—"}</td>
          <td>${ex.carga || "—"} kg</td>
          <td>${ex.descanso || "—"}</td>
        </tr>`;
        if (ex.restricao) {
          html += `<tr><td colspan="7" style="color:#d97706;font-size:10px;background:#fffbeb;">⚠ ${ex.restricao}</td></tr>`;
        }
      });
      html += `</tbody></table>`;
    });

    // Volume
    const totalVol = treino.reduce((s, g) => s + (g.exercicios || []).reduce((ss, ex) => ss + (parseFloat(ex.series) || 0) * (parseFloat(ex.repeticoes) || 0) * (parseFloat(ex.carga) || 0), 0), 0);
    html += `<p style="font-size:11px;color:#333;margin-bottom:12px;"><strong>Volume Total Semanal:</strong> ${totalVol.toLocaleString()} kg·rep</p>`;
  }

  // PSE History
  if (pseSessoes && pseSessoes.length > 0) {
    html += `<h2>📈 Monitoramento PSE (${pseSessoes.length} sessões)</h2>`;
    html += `<table><thead><tr><th>Data</th><th>PSE (CR-10)</th><th>Duração</th><th>Carga Interna (UA)</th></tr></thead><tbody>`;
    const total = pseSessoes.reduce((s, se) => s + (se.cargaInternaUA || 0), 0);
    [...pseSessoes].reverse().forEach(se => {
      html += `<tr>
        <td>${se.data || "—"}</td>
        <td>${se.pse || "—"}</td>
        <td>${se.duracao || "—"} min</td>
        <td>${se.cargaInternaUA || "—"} UA</td>
      </tr>`;
    });
    html += `</tbody></table>`;
    html += `<p style="font-size:11px;color:#333;"><strong>Carga Interna Total:</strong> ${total.toLocaleString()} UA</p>`;
  }

  // Periodization
  if (macrociclo) {
    html += `<h2>📅 Periodização — ${macrociclo.params?.label || ""}</h2>`;
    html += `<p style="font-size:11px;color:#333;margin-bottom:8px;">${macrociclo.totalSemanas} semanas · Nível: ${macrociclo.nivel}</p>`;
    macrociclo.mesociclos?.forEach(meso => {
      html += `<div style="background:#f0fdf4;border-radius:6px;padding:8px 12px;margin-bottom:8px;border-left:3px solid #4ADE80;">
        <div style="font-size:11px;font-weight:700;color:#0D9E5C;">${meso.nome}</div>
        <div style="font-size:10px;color:#666;">${meso.semanas} · ${meso.objetivo}</div>
      </div>`;
    });
  }

  // Footer
  html += `<div class="footer">
    <p>Relatório gerado pelo SASYRA em ${dataStr}</p>
    <p style="margin-top:4px;">Profissional responsável: ${student?.nome || "—"} · Sistema de Apoio à Decisão Clínica Baseado em Evidências</p>
  </div>`;

  html += `</body></html>`;
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); }, 500);
}

function calcIdade(dataNasc) {
  if (!dataNasc) return null;
  const nasc = new Date(dataNasc);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const mes = hoje.getMonth() - nasc.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade;
}
