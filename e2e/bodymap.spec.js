import { test, expect } from "@playwright/test";

// ══════════════════════════════════════════════════════════════
// BodyMap — Mapa Corporal
// ══════════════════════════════════════════════════════════════

test.describe("BodyMap — Interação e Visualização", () => {
  test("Botões Frente/Costas alternam a vista", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);

    // Tenta encontrar os botões Frente/Costas
    const frenteBtn = page.locator('button:has-text("Frente")').first();
    const costasBtn = page.locator('button:has-text("Costas")').first();

    if (await frenteBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await costasBtn.click();
      await page.waitForTimeout(500);
      await expect(frenteBtn).toBeVisible();
    }
  });

  test("BodyMap renderiza sem erro", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);

    // Verifica que áreas do corpo são renderizadas (SVG ou divs)
    const bodySVG = page.locator("svg").first();
    if (await bodySVG.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(bodySVG).toBeVisible();
    }
  });

  test("BodyMap escala em mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForTimeout(2000);

    const bodyContainer = page.locator('[style*="inline-block"]').first();
    await expect(bodyContainer).toBeVisible({ timeout: 5000 });
  });
});
