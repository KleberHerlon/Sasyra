import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(__dirname, "amostra-analise-ia.html");
const pdfPath = join(__dirname, "amostra-analise-ia.pdf");

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0", timeout: 30000 });
await page.waitForSelector("#report", { timeout: 10000 });

await page.pdf({
  path: pdfPath,
  format: "A4",
  margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: "<div></div>",
  footerTemplate: `
    <div style="width:100%;font-size:8px;color:#94a3b8;text-align:center;padding:4px 15mm;font-family:Inter,sans-serif;">
      SASYRA — Análise Clínica IA | Página <span class="pageNumber"></span> de <span class="totalPages"></span>
    </div>
  `,
});

await browser.close();
console.log("PDF gerado:", pdfPath);
