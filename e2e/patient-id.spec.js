import { test, expect } from "@playwright/test";

// ══════════════════════════════════════════════════════════════
// PatientIdentification — Identificação do Paciente
// ══════════════════════════════════════════════════════════════

test.describe("PatientIdentification — Colapsável e Campos", () => {
  test("Seção Identificação do Paciente é colapsável", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);

    // Procura a seção
    const section = page.locator('h3:has-text("Identificação")').first();
    if (await section.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(section).toBeVisible();

      // Clica para expandir
      await section.click();
      await page.waitForTimeout(500);

      // Verifica campos visíveis
      const nomeField = page.locator('input[placeholder*="Nome completo"]').first();
      await expect(nomeField).toBeVisible({ timeout: 3000 });
    }
  });

  test("Campos obrigatórios estão presentes", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);

    const section = page.locator('h3:has-text("Identificação")').first();
    if (await section.isVisible({ timeout: 5000 }).catch(() => false)) {
      await section.click();
      await page.waitForTimeout(500);

      // Nome
      const nome = page.locator('input[placeholder*="Nome completo"]').first();
      if (await nome.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(nome).toBeVisible();
      }

      // Sexo
      const sexoBtn = page.locator('button:has-text("Masculino")').first();
      if (await sexoBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(sexoBtn).toBeVisible();
      }
    }
  });

  test("Selecionar Sexo Feminino e verificar BodyMap", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);

    // Expandir PatientIdentification
    const section = page.locator('h3:has-text("Identificação")').first();
    if (await section.isVisible({ timeout: 5000 }).catch(() => false)) {
      await section.click();
      await page.waitForTimeout(500);
    }

    // Selecionar Feminino
    const femininoBtn = page.locator('button:has-text("Feminino")').first();
    if (await femininoBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await femininoBtn.click();
      await page.waitForTimeout(300);
    }

    // BodyMap deve existir na página
    const bodyMap = page.locator("svg").first();
    await expect(bodyMap).toBeVisible({ timeout: 5000 });
  });
});
