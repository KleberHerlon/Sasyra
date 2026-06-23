const puppeteer = require("puppeteer-core");
const path = require("path");

const EDGE_PATH = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const HTML_PATH = path.join(__dirname, "analise-financeira.html");
const PDF_PATH = path.join(__dirname, "analise-financeira-sasyra.pdf");

(async () => {
  console.log("Launching Edge (headless)...");
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  console.log("Loading HTML...");
  await page.goto("file://" + HTML_PATH, { waitUntil: "networkidle0" });

  console.log("Generating PDF (landscape)...");
  await page.pdf({
    path: PDF_PATH,
    format: "A4",
    landscape: true,
    margin: { top: "1.5cm", bottom: "1.5cm", left: "1.5cm", right: "1.5cm" },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: "<div></div>",
    footerTemplate: `
      <div style="width:100%; font-size:7pt; color:#888; text-align:center; padding:2px 20px;">
        SASYRA — Análise Financeira | Página <span class="pageNumber"></span> de <span class="totalPages"></span>
      </div>
    `,
  });

  await browser.close();
  console.log("PDF generated:", PDF_PATH);
})().catch(e => {
  console.error("Error:", e);
  process.exit(1);
});
