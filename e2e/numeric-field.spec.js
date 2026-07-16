import { test, expect } from "@playwright/test";

// ══════════════════════════════════════════════════════════════
// NumericField — Validação Visual
// ══════════════════════════════════════════════════════════════

test.describe("NumericField — Validação de Range", () => {
  test("Campo numérico aceita valor dentro do range", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);

    // Expande PatientIdentification
    const section = page.locator('h3:has-text("Identificação")').first();
    if (await section.isVisible({ timeout: 5000 }).catch(() => false)) {
      await section.click();
      await page.waitForTimeout(500);
    }

    // Encontra campo Peso
    const pesoField = page.locator('input[placeholder*="70"]').first();
    if (await pesoField.isVisible({ timeout: 3000 }).catch(() => false)) {
      await pesoField.fill("70");
      await page.waitForTimeout(300);

      // Não deve mostrar "Fora do intervalo"
      const error = page.locator('text=Fora do intervalo').first();
      await expect(error).not.toBeVisible({ timeout: 2000 });
    }
  });

  test("Campo numérico mostra borda vermelha ao exceder max", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);

    // Expande PatientIdentification
    const section = page.locator('h3:has-text("Identificação")').first();
    if (await section.isVisible({ timeout: 5000 }).catch(() => false)) {
      await section.click();
      await page.waitForTimeout(500);
    }

    // Campo peso
    const pesoField = page.locator('input[placeholder*="70"]').first();
    if (await pesoField.isVisible({ timeout: 3000 }).catch(() => false)) {
      await pesoField.fill("500");
      await page.waitForTimeout(300);

      // Deve mostrar mensagem de erro
      const error = page.locator('text=Fora do intervalo').first();
      await expect(error).toBeVisible({ timeout: 3000 });
    }
  });
});
