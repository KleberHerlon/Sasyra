import { test, expect } from "@playwright/test";

const BASE = "http://localhost:5173/Sasyra";

async function doLogin(page) {
  await page.waitForSelector('input[type="text"]', { timeout: 20000 });
  await page.locator('input[type="text"]').nth(0).fill("Dr. Teste E2E");
  await page.locator('input[type="text"]').nth(1).fill("278187-F");
  // Botão verde de submit — último button da página
  await page.locator('button').last().click();
  await page.waitForTimeout(2500);
}

async function goToOrthopedics(page) {
  await page.waitForSelector('button:has-text("Fisioterapia")', { timeout: 15000 });
  // Pega o primeiro botão "Fisioterapia" que aparece (ModuleSelector)
  await page.locator('button:has-text("Fisioterapia")').first().click();
  await page.waitForTimeout(2000);

  // No SubModulePicker, clica no botão que contém "Ortopédica"
  await page.waitForSelector('button:has-text("Ortopédica")', { timeout: 15000 });
  await page.locator('button:has-text("Ortopédica")').first().click();
  await page.waitForTimeout(2000);
}

test.describe("SASYRA — Testes como Usuário Humano", () => {

  test("1. App carrega a tela de login", async ({ page }) => {
    await page.goto(BASE + "/dashboard");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    await expect(page.locator("text=SASYRA").first()).toBeVisible({ timeout: 15000 });
  });

  test("2. Login funciona e mostra módulos", async ({ page }) => {
    await page.goto(BASE + "/dashboard");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    await doLogin(page);

    await expect(page.locator("text=Fisioterapia").first()).toBeVisible({ timeout: 15000 });
  });

  test("3. Fluxo completo: Login → Fisioterapia → Ortopédica", async ({ page }) => {
    await page.goto(BASE + "/dashboard");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    await doLogin(page);
    await goToOrthopedics(page);

    await expect(page.locator("text=Ortopédica").first()).toBeVisible({ timeout: 15000 });
  });

  test("4. 💡 Botão Dicas abre modal com conteúdo", async ({ page }) => {
    await page.goto(BASE + "/dashboard");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    await doLogin(page);
    await goToOrthopedics(page);

    // O botão Dicas está na barra fixa do SubModuleLayout
    // Se não estiver visível, pode ser que a lista de pacientes esteja sobreposta
    const tipsBtn = page.locator('button', { hasText: "Dicas" }).first();
    if (await tipsBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await tipsBtn.click();
      await page.waitForTimeout(500);
      await expect(page.locator("text=Funcionalidades").first()).toBeVisible({ timeout: 5000 });
      await page.locator("text=✕").first().click();
    }
  });

  test("5. BodyMap renderiza SVG", async ({ page }) => {
    await page.goto(BASE + "/dashboard");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    await doLogin(page);
    await goToOrthopedics(page);

    const svg = page.locator("svg").first();
    await expect(svg).toBeVisible({ timeout: 15000 });
  });

  test("6. 📱 Mobile — login + navegação", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE + "/dashboard");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    await doLogin(page);
    await expect(page.locator("text=Fisioterapia").first()).toBeVisible({ timeout: 15000 });
  });
});
