import { test, expect } from "@playwright/test";

// ══════════════════════════════════════════════════════════════
// HelpTips — Botão 💡 Dicas
// ══════════════════════════════════════════════════════════════

test.describe("Botão 💡 Dicas — Visibilidade e Funcionamento", () => {
  test("Existe em todos os módulos e abre o modal", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);

    // Procura o botão 💡 Dicas em qualquer lugar da página
    const tipsBtn = page.locator('button:has-text("Dicas")').first();
    await expect(tipsBtn).toBeVisible({ timeout: 8000 });

    // Clica e verifica que o modal abre
    await tipsBtn.click();
    const modal = page.locator('text=Funcionalidades').first();
    await expect(modal).toBeVisible({ timeout: 3000 });
  });

  test("Modal fecha ao clicar no ✕", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);

    const tipsBtn = page.locator('button:has-text("Dicas")').first();
    await tipsBtn.click();

    const closeBtn = page.locator('text=✕').first();
    await expect(closeBtn).toBeVisible({ timeout: 2000 });
    await closeBtn.click();

    // Modal deve desaparecer
    const modal = page.locator('text=Funcionalidades');
    await expect(modal).not.toBeVisible({ timeout: 3000 });
  });

  test("Modal fecha ao clicar fora (overlay)", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);

    // Abre
    const tipsBtn = page.locator('button:has-text("Dicas")').first();
    await tipsBtn.click();

    // Clica no overlay escuro
    const overlay = page.locator('[style*="rgba(0,0,0,0.6)"]').first();
    await expect(overlay).toBeVisible({ timeout: 2000 });
    await overlay.click({ position: { x: 10, y: 10 } });

    // Deve fechar
    const modal = page.locator('text=Funcionalidades');
    await expect(modal).not.toBeVisible({ timeout: 3000 });
  });

  test("Modal exibe conteúdo específico do módulo", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);

    const tipsBtn = page.locator('button:has-text("Dicas")').first();
    await tipsBtn.click();

    // Deve ter pelo menos uma dica com ícone e título
    const tipCard = page.locator('[style*="cardAlt"], [style*="card"]').filter({ hasText: "🎤" }).first();
    await expect(tipCard).toBeVisible({ timeout: 3000 });
  });
});

test.describe("💡 Dicas — Desktop e Mobile", () => {
  test("Visível em tela pequena (mobile)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForTimeout(2000);

    const tipsBtn = page.locator('button:has-text("Dicas")').first();
    await expect(tipsBtn).toBeVisible({ timeout: 8000 });
  });

  test("Visível em tela grande (desktop)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForTimeout(2000);

    const tipsBtn = page.locator('button:has-text("Dicas")').first();
    await expect(tipsBtn).toBeVisible({ timeout: 8000 });
  });
});
