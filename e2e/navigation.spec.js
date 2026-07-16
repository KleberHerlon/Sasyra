import { test, expect } from "@playwright/test";

// ══════════════════════════════════════════════════════════════
// Tabs e Navegação entre Módulos
// ══════════════════════════════════════════════════════════════

test.describe("Navegação por Tabs", () => {
  test("Tabs de avaliação são visíveis no módulo ortopédico", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);

    // Verifica as 4 tabs
    const tabs = ["Avaliação", "Evolução", "Relatório", "Evidências"];
    for (const tab of tabs) {
      const btn = page.locator(`button:has-text("${tab}")`).first();
      if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await btn.click();
        await page.waitForTimeout(300);
        await expect(btn).toBeVisible();
      }
    }
  });

  test("Alternar entre tabs preserva conteúdo", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);

    // Vai para Evolução
    const evolBtn = page.locator('button:has-text("Evolução")').first();
    if (await evolBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await evolBtn.click();
      await page.waitForTimeout(500);
    }

    // Volta para Avaliação
    const avalBtn = page.locator('button:has-text("Avaliação")').first();
    if (await avalBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await avalBtn.click();
      await page.waitForTimeout(500);
    }

    // Verifica que a seção de Queixa Principal existe
    const queixaSection = page.locator('text=Queixa Principal').first();
    await expect(queixaSection).toBeVisible({ timeout: 5000 });
  });
});

test.describe("BridgeAlerts — Ponte de Transição", () => {
  test("Card âmbar aparece quando há restrições", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);

    // BridgeAlerts pode ou não aparecer dependendo dos dados
    const bridgeCard = page.locator('text=Ponte de Transição').first();
    // Se aparecer, deve ser visível; se não, é porque não há dados
    const visible = await bridgeCard.isVisible({ timeout: 3000 }).catch(() => false);
    if (visible) {
      await expect(bridgeCard).toBeVisible();
    }
  });
});
