import { chromium } from "playwright";
import { spawn, execSync } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "screenshots");
const PROXY_PORT = 3001;
const BASE = `http://localhost:${PROXY_PORT}`;

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const SCREENS = [];

async function shot(page, name, opts = {}) {
  const path = join(OUT, `${name}.png`);
  await page.screenshot({ path, fullPage: opts.fullPage ?? false, timeout: 30000 });
  SCREENS.push({ name, path, label: opts.label || name, desc: opts.desc || "" });
  console.log(`  ✓ ${name}.png`);
}

function waitFor(url, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const poll = () => {
      fetch(url).then(r => r.ok ? resolve() : setTimeout(poll, 500)).catch(() => {
        if (Date.now() - start > timeout) reject(new Error(`Timeout waiting for ${url}`));
        else setTimeout(poll, 500);
      });
    };
    poll();
  });
}

async function expandAllSections(page) {
  await page.evaluate(() => {
    const expanded = new Set();
    let changed = true;
    while (changed) {
      changed = false;
      const h3s = document.querySelectorAll("h3");
      for (const h3 of h3s) {
        if (expanded.has(h3)) continue;
        const parent = h3.parentElement;
        if (!parent) continue;
        // Check if this is a collapsible section header (has ▶ span + uppercase/green text)
        const hasArrow = parent.querySelector("span")?.textContent.includes("▶");
        if (!hasArrow) continue;
        // Check if NOT already expanded (children hidden)
        const nextEl = parent.nextElementSibling;
        if (nextEl && nextEl.children.length > 0) continue; // already expanded
        parent.click();
        expanded.add(h3);
        changed = true;
      }
    }
  });
  await page.waitForTimeout(500);
}

async function login(page) {
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.click('button:has-text("Fisioterapeuta")');
  await page.fill('input[placeholder="Seu nome"]', "Dra. Carla Mendes");
  await page.fill('input[placeholder="Ex: 12345-F"]', "123456-F");
  await page.click('button:has-text("Entrar")');
  await page.waitForTimeout(800);
}

async function clickPatient(page, name) {
  await page.evaluate((n) => {
    const btns = document.querySelectorAll("button");
    for (const btn of btns) {
      if (btn.textContent.includes(n)) { btn.click(); return; }
    }
  }, name);
  await page.waitForTimeout(1000);
}

async function main() {
  console.log("=== SASYRA Guide Generator ===");
  console.log("1. Building app...");
  execSync("npm run build", { cwd: ROOT, stdio: "pipe" });
  console.log("   ✓ Build complete");

  console.log("2. Starting proxy server...");
  // Set env vars so proxy.js picks them up
  process.env.PORT = String(PROXY_PORT);
  process.env.ALLOWED_ORIGIN = BASE;
  process.env.NODE_ENV = "production";
  await import(new URL("../server/proxy.js", import.meta.url));
  await new Promise(r => setTimeout(r, 500));
  console.log("   ✓ Server ready");

  console.log("3. Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  page.setDefaultTimeout(10000);
  page.on("pageerror", err => console.log(`[browser error] ${err.message}`));

  try {
    console.log("4. Capturing screens...");

    // ── 01 LOGIN ───────────────────────────────────────────────────────
    await login(page);
    await shot(page, "01-login", {
      label: "Tela de Login",
      desc: "Tela inicial com seleção de profissão (Fisioterapeuta, TO, Educador Físico) e entrada de nome e CREFITO. Design com gradiente radial e logotipo SASYRA.",
    });

    // ── 02 PATIENT LIST (EMPTY) ────────────────────────────────────────
    await shot(page, "02-patient-list-empty", {
      label: "Lista de Pacientes",
      desc: "Dashboard com lista de pacientes, botão para adicionar novo paciente e atalhos para Agenda e Financeiro.",
    });

    // ── ADD PATIENT ────────────────────────────────────────────────────
    const npBtn = page.locator("button").filter({ hasText: /Novo|Paciente/ }).first();
    if (await npBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await npBtn.click();
    } else {
      // Fallback: click any button that looks like "add"
      const anyBtn = page.locator("button").first();
      if (await anyBtn.isVisible().catch(() => false)) {
        console.log("   [WARN] Novo button not found, clicking first button");
        await anyBtn.click();
      } else {
        throw new Error("No buttons visible on page");
      }
    }
    await page.waitForTimeout(400);
    await page.fill('input[placeholder="Nome do paciente"]', "João Carlos Silva");
    await page.fill('input[placeholder="kg"]', "82");
    await page.fill('input[placeholder="cm"]', "175");
    await page.fill('input[placeholder="(99) 99999-9999"]', "(11) 98765-4321");
    await page.fill('input[placeholder="Profissão"]', "Analista de Sistemas");
    await page.evaluate(() => {
      const inputs = document.querySelectorAll("input");
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
      setter.call(inputs[1], "1985-03-15");
      inputs[1].dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.locator("select").nth(0).selectOption("Masculino");
    await page.locator("select").nth(1).selectOption("Unimed");
    await page.waitForTimeout(200);
    await page.click('button:has-text("Cadastrar Paciente")');
    await page.waitForTimeout(600);

    // ── 03 PATIENT LIST (WITH PATIENT) ─────────────────────────────────
    await shot(page, "03-patient-list-full", {
      label: "Paciente Cadastrado",
      desc: "Paciente João Carlos Silva na lista com indicadores da última avaliação e red flags.",
    });

    // ── ENTER ASSESSMENT ───────────────────────────────────────────────
    await clickPatient(page, "João Carlos");
    await page.waitForTimeout(500);

    // Fill queixa (main complaint) textarea
    const ta = page.locator("textarea").first();
    if (await ta.isVisible({ timeout: 3000 }).catch(() => false)) {
      await ta.fill("Dor no ombro direito há 3 meses, iniciada após movimentação repetitiva no trabalho. Piora ao elevar o braço acima de 90°.");
    }
    await page.waitForTimeout(200);

    // Select pain location tag "Ombro D"
    await page.evaluate(() => {
      for (const btn of document.querySelectorAll("button")) {
        const t = btn.textContent.trim();
        if (t === "Ombro D" || t === "Ombro") { btn.click(); break; }
      }
    });
    await page.waitForTimeout(200);

    // Click pain characteristic tags
    await page.evaluate(() => {
      const targets = ["em repouso", "3 meses", "movimento", "< 3"];
      for (const btn of document.querySelectorAll("button")) {
        if (targets.includes(btn.textContent.trim())) btn.click();
      }
    });
    await page.waitForTimeout(200);

    // ── EXPAND ALL COLLAPSIBLE SECTIONS ────────────────────────────────
    await expandAllSections(page);
    // Verify expansion
    const expandedCount = await page.evaluate(() => {
      let count = 0;
      const h3s = document.querySelectorAll("h3");
      for (const h3 of h3s) {
        const parent = h3.parentElement;
        if (!parent) continue;
        const next = parent.nextElementSibling;
        if (next && next.children.length > 0) count++;
      }
      return count;
    });
    console.log(`   Expanded sections: ${expandedCount}`);

    // ── 04 ASSESSMENT — FULL PAGE ──────────────────────────────────────
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await shot(page, "04-assessment-full", { fullPage: true,
      label: "Avaliação Completa (todas as seções)",
      desc: "Todas as 7 seções da avaliação expandidas: Identificação do Paciente, Anamnese, Dor e Funcionalidade, Exame Físico, Goniometria, Testes Especiais e Observações Clínicas.",
    });

    // ── 05 BODY MAP ─────────────────────────────────────────────────────
    await page.evaluate(() => {
      for (const svg of document.querySelectorAll("svg")) {
        const r = svg.getBoundingClientRect();
        if (r.width > 200 && r.height > 400) {
          svg.dispatchEvent(new MouseEvent("click", {
            clientX: r.left + r.width * 0.55, clientY: r.top + r.height * 0.22, bubbles: true,
          }));
          break;
        }
      }
    });
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      for (const h3 of document.querySelectorAll("h3")) {
        if (h3.textContent.trim() === "Caracterização da dor" && h3.parentElement) {
          h3.parentElement.scrollIntoView({ block: "start" });
          break;
        }
      }
    });
    await page.waitForTimeout(300);
    await shot(page, "05-bodymap", {
      label: "BodyMap Interativo",
      desc: "Mapa corporal em SVG com 30+ regiões clicáveis. O fisioterapeuta marca a localização exata da dor. Exibe detalhes anatômicos (articulações e músculos) de cada região selecionada.",
    });

    // ── 06 EXAME FÍSICO ────────────────────────────────────────────────
    await page.evaluate(() => {
      for (const h3 of document.querySelectorAll("h3")) {
        if (h3.textContent.trim() === "Exame Físico" && h3.parentElement) {
          h3.parentElement.scrollIntoView({ block: "start" });
          break;
        }
      }
    });
    await page.waitForTimeout(300);
    await shot(page, "06-exame-fisico", {
      label: "Avaliação — Exame Físico",
      desc: "Exame físico completo expandido: postura, marcha, edema, palpação, sensibilidade, reflexos, força muscular (MRC 0-5) e goniometria articular com valores de referência.",
    });

    // ── 07 TESTES ORTOPÉDICOS ──────────────────────────────────────────
    await page.evaluate(() => {
      for (const h3 of document.querySelectorAll("h3")) {
        if (h3.textContent.trim() === "Testes Especiais" && h3.parentElement) {
          h3.parentElement.scrollIntoView({ block: "start" });
          break;
        }
      }
    });
    await page.waitForTimeout(300);
    await page.evaluate(() => {
      for (const btn of document.querySelectorAll("button")) {
        const t = btn.textContent.trim();
        if (t === "▼" || t === "▶ Vídeo") { btn.click(); break; }
      }
    });
    await page.waitForTimeout(300);
    await shot(page, "07-testes-ortopedicos", {
      label: "Testes Ortopédicos Especiais",
      desc: "38+ testes ortopédicos especiais com descrição detalhada, classificação (positivo/negativo), vídeos incorporados do YouTube e nível de evidência científica.",
    });

    // ── 08 EXPRESS MODE ────────────────────────────────────────────────
    // Back to top of assessment and toggle Express Mode
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    const expressToggle = page.locator('button:has-text("Express")').first();
    if (await expressToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expressToggle.click();
      await page.waitForTimeout(800);
    }
    // Fill express complaint
    const expressTextarea = page.locator("textarea").first();
    if (await expressTextarea.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expressTextarea.fill("Lombalgia aguda com irradiação para perna direita após levantamento de peso no trabalho.");
    }
    await page.waitForTimeout(300);
    // Fill some vitals to trigger alert
    await page.evaluate(() => {
      const inputs = document.querySelectorAll("input[type=number]");
      if (inputs.length > 0) {
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
        for (const inp of inputs) {
          const lbl = inp.closest("div")?.previousElementSibling?.textContent || "";
          if (lbl.includes("SpO")) { setter.call(inp, "89"); inp.dispatchEvent(new Event("input", { bubbles: true })); }
          if (lbl.includes("Glice")) { setter.call(inp, "180"); inp.dispatchEvent(new Event("input", { bubbles: true })); }
          if (lbl.includes("cardíaca")) { setter.call(inp, "88"); inp.dispatchEvent(new Event("input", { bubbles: true })); }
          if (lbl.includes("Sistólica")) { setter.call(inp, "130"); inp.dispatchEvent(new Event("input", { bubbles: true })); }
          if (lbl.includes("Diastólica")) { setter.call(inp, "85"); inp.dispatchEvent(new Event("input", { bubbles: true })); }
        }
      }
    });
    await page.waitForTimeout(500);
    await shot(page, "08-express-mode", {
      label: "Modo Express — Atendimento Rápido",
      desc: "Modo Express ativado: formulário colapsado em única tela com queixa principal (Speech-to-Text), painel de sinais vitais (SpO₂, glicemia, FC, PA), BodyMap simplificado, Card de Segurança Crítica com alerta de SpO₂ < 92%, e campo de conduta imediata.",
    });
    // Turn off Express
    await expressToggle.click();
    await page.waitForTimeout(400);

    // ── 10 DIÁRIO / EVOLUÇÃO ──────────────────────────────────────────
    await page.click('button:has-text("Evolução")');
    await page.waitForTimeout(600);
    // Expand procedure categories
    await page.evaluate(() => {
      const targets = [
        "Eletroterapia",
        "Terapia Manual",
        "Cinesioterapia e Exercícios",
        "Alongamento",
      ];
      for (const btn of document.querySelectorAll("button")) {
        for (const t of targets) {
          if (btn.textContent.includes(t) && btn.textContent.includes("▶")) {
            btn.click();
            break;
          }
        }
      }
    });
    await page.waitForTimeout(300);
    await shot(page, "09-diario", {
      label: "Diário / Evolução por Sessão",
      desc: "Registro de evolução por sessão com procedimentos categorizados, EVA, resposta ao tratamento, metas, escalas aplicadas, ADMs e MRC. Categorias expansíveis: Eletroterapia, Terapia Manual, Cinesioterapia, etc.",
    });

    // ── 10 RELATÓRIO ──────────────────────────────────────────────────
    await page.click('button:has-text("Relatório")');
    await page.waitForTimeout(600);
    await shot(page, "10-relatorio", {
      label: "Relatório Clínico",
      desc: "Relatório clínico completo formatado para impressão: dados do paciente, avaliação, classificação CIF, objetivos terapêuticos (curto, médio e longo prazo), plano de tratamento e evolução.",
    });

    // ── 11 EVIDÊNCIAS ──────────────────────────────────────────────────
    await page.click('button:has-text("Evidências")');
    await page.waitForTimeout(600);
    await shot(page, "11-evidencias", {
      label: "Base de Evidências Científicas",
      desc: "Mais de 30 patologias ortopédicas com diretrizes PEDro, Cochrane e CPGs internacionais. Para cada condição: gold standard, red flags, yellow flags e alertas de encaminhamento médico.",
    });

    // ── 12 AGENDA ──────────────────────────────────────────────────────
    await page.click('button[title="Agenda"]');
    await page.waitForTimeout(1000);
    await shot(page, "12-agenda", {
      label: "Agenda",
      desc: "Agenda mensal com visualização semanal, gerenciamento de horários, registro de faltas e navegação por paciente.",
    });

    // ── 13 FINANCEIRO ──────────────────────────────────────────────────
    const btnBack = page.locator('button:has-text("Pacientes")').first();
    if (await btnBack.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btnBack.click();
      await page.waitForTimeout(600);
    }
    await page.click('button[title="Financeiro"]');
    await page.waitForTimeout(800);
    await shot(page, "13-financeiro", {
      label: "Financeiro",
      desc: "Módulo financeiro com tabelas de honorários CREFITO por região, gestão de recebimentos, despesas e fluxo de caixa.",
    });

    // ── 14 ASSINATURA ──────────────────────────────────────────────────
    // Back to patient list → enter patient → click plan badge
    const fp = page.locator('button:has-text("Pacientes")').first();
    if (await fp.isVisible({ timeout: 3000 }).catch(() => false)) {
      await fp.click();
      await page.waitForTimeout(500);
    }
    await clickPatient(page, "João Carlos");

    const planBadge = page.locator('button:has-text("Start")').first();
    if (await planBadge.isVisible({ timeout: 3000 }).catch(() => false)) {
      await planBadge.click();
      await page.waitForTimeout(600);
    }
    await shot(page, "14-assinatura", {
      label: "Gerenciamento de Assinatura",
      desc: "Painel de assinatura com plano atual (Start), histórico de faturas, gerenciamento de usuários extras e opção de upgrade para planos superiores.",
    });

    // ── 15 PLANOS ──────────────────────────────────────────────────────
    const plansBtn = page.locator('button:has-text("Planos"), button:has-text("planos")').first();
    if (await plansBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await plansBtn.click();
      await page.waitForTimeout(600);
    }
    await shot(page, "15-planos", {
      label: "Planos de Assinatura",
      desc: "Quatro planos: Start (R$9,90/mês — 50 pacientes, voz limitada), Consultório Evidência (R$14,90/mês — 200 pacientes, financeiro), Clínicas & Equipes (R$49,90/mês — ilimitado, multiusuário) e IA Premium (R$79,90/mês — 300 análises IA/mês + CIF automatizada). Plano IA Premium destacado com badge 'MAIS COMPLETO'.",
    });

    // ── 16 ESCALAS ─────────────────────────────────────────────────────
    // Back to assessment → scales screenshot
    const volBtn = page.locator('button:has-text("Voltar"), button:has-text("Pacientes")').first();
    if (await volBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await volBtn.click();
      await page.waitForTimeout(500);
    }
    await clickPatient(page, "João Carlos");
    await expandAllSections(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    await shot(page, "16-escalas", {
      label: "36 Escalas Validadas",
      desc: "ODI (Oswestry), KOOS, DASH, SF-36, WOMAC, Escala de Tampa para Cinesiofobia, NRS, HAD e mais 30 escalas funcionais validadas em português com cálculo automático de pontuação, MCID e MDC.",
    });

    // ── 17 IA ──────────────────────────────────────────────────────────
    await expandAllSections(page);
    const iaBtn = page.locator('button:has-text("IA"), button:has-text("Análise IA"), button:has-text("Analisar")').first();
    if (await iaBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await iaBtn.click();
      await page.waitForTimeout(1500);
    }
    await shot(page, "17-ia-analysis", {
      label: "Análise por Inteligência Artificial",
      desc: "Análise clínica gerada por IA (Claude Sonnet) baseada nos dados da avaliação: hipótese diagnóstica funcional CIF, objetivos terapêuticos, plano de tratamento com evidências (PEDro/Cochrane), contraindicações e prognóstico.",
    });

    // ── GENERATE PDF ──────────────────────────────────────────────────
    console.log("\n5. Generating PDF guide...");

    const screensHTML = SCREENS.map(s => `
      <div class="screen-section">
        <div class="screen-header">
          <span class="screen-num">${SCREENS.indexOf(s) + 1}</span>
          <h2>${s.label}</h2>
        </div>
        <p class="screen-desc">${s.desc}</p>
        <div class="img-wrap">
          <img src="${s.path}" alt="${s.label}" loading="lazy" />
        </div>
      </div>
    `).join("\n");

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SASYRA — Guia do Sistema</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',-apple-system,sans-serif; background:#0a0e1a; color:#e8edf5; line-height:1.6; }

  .cover { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; background:radial-gradient(ellipse at 50% 30%, #141b33 0%, #0a0e1a 70%); padding:40px 24px; position:relative; overflow:hidden; }
  .cover::before { content:''; position:absolute; top:-50%; left:-50%; width:200%; height:200%; background:radial-gradient(circle at 30% 40%, rgba(34,197,94,0.04) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(245,158,11,0.03) 0%, transparent 50%); }
  .cover-content { position:relative; z-index:1; max-width:720px; }
  .cover h1 { font-size:72px; font-weight:900; letter-spacing:16px; color:#e8edf5; margin-bottom:4px; }
  .cover .sub { font-size:18px; font-weight:800; letter-spacing:8px; color:#22c55e; margin-bottom:24px; }
  .cover .tagline { font-size:16px; font-weight:300; color:#8896b0; max-width:520px; margin:0 auto 48px; line-height:1.7; }
  .cover .version { font-size:13px; color:#4a5568; letter-spacing:2px; }

  .deco { display:flex; align-items:center; gap:8px; margin:0 auto 32px; justify-content:center; }
  .deco .line { width:40px; height:1.5px; background:#22c55e; opacity:0.4; }
  .deco .dot { width:6px; height:6px; border-radius:50%; background:#f59e0b; }

  .toc { max-width:600px; margin:0 auto; padding:40px 24px; }
  .toc h2 { font-size:14px; font-weight:700; color:#22c55e; letter-spacing:4px; margin-bottom:20px; }
  .toc ol { list-style:none; counter-reset:toc; }
  .toc ol li { counter-increment:toc; padding:10px 0; border-bottom:1px solid #1a2040; font-size:14px; color:#8896b0; display:flex; gap:12px; align-items:center; }
  .toc ol li::before { content:counter(toc); width:26px; height:26px; border-radius:50%; background:rgba(34,197,94,0.1); border:1px solid rgba(34,197,94,0.2); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#22c55e; flex-shrink:0; }

  .screens { max-width:1000px; margin:0 auto; padding:0 24px 80px; }
  .screen-section { margin-bottom:60px; page-break-inside:avoid; }
  .screen-header { display:flex; align-items:center; gap:16px; margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #1a2040; }
  .screen-num { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,#22c55e,#16a34a); display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:800; color:#fff; flex-shrink:0; }
  .screen-header h2 { font-size:20px; font-weight:700; color:#e8edf5; }
  .screen-desc { font-size:14px; color:#8896b0; margin-bottom:16px; max-width:720px; line-height:1.7; }
  .img-wrap { border-radius:12px; overflow:hidden; border:1px solid #1a2040; background:#060a14; box-shadow:0 8px 32px rgba(0,0,0,0.4); }
  .img-wrap img { width:100%; height:auto; display:block; }
  .footer { text-align:center; padding:40px 24px; border-top:1px solid #1a2040; color:#4a5568; font-size:12px; letter-spacing:1px; }

  @media print { .cover { min-height:100vh; break-after:page; } .screen-section { break-inside:avoid; } }
</style>
</head>
<body>
<div class="cover">
  <div class="cover-content">
    <div class="deco"><span class="line"></span><span class="dot"></span><span class="line"></span></div>
    <h1>SASYRA</h1>
    <div class="sub">REABILITAÇÃO E EVIDÊNCIA</div>
    <p class="tagline">Sistema de apoio à decisão clínica para avaliação, documentação e tratamento ortopédico baseado em evidências</p>
    <div class="version">GUIA DO SISTEMA · v1.0.0 · ${new Date().toLocaleDateString("pt-BR")}</div>
  </div>
</div>

<div class="toc">
  <h2>CONTEÚDO</h2>
  <ol>${SCREENS.map(s => `<li>${s.label}</li>`).join("")}</ol>
</div>

<div class="screens">${screensHTML}</div>

<div class="footer">SASYRA — Sistema de Apoio à Decisão Clínica em Reabilitação © ${new Date().getFullYear()}</div>
</body>
</html>`;

    const htmlPath = join(OUT, "guide.html");
    writeFileSync(htmlPath, html);
    console.log(`   ✓ HTML guide saved: ${htmlPath}`);

    await page.goto("file://" + htmlPath, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    const pdfPath = join(ROOT, "SASYRA_Guia_do_Sistema.pdf");
    await page.pdf({ path: pdfPath, format: "A4", printBackground: true, margin: { top: "0", right: "0", bottom: "0", left: "0" } });
    console.log(`   ✓ PDF generated: ${pdfPath}`);

  } finally {
    await browser.close();
    process.exit(0);
  }

  console.log("\n=== Done! ===");
}

main().catch(err => { console.error("Fatal:", err); process.exit(1); });
