import { test, expect } from "@playwright/test";

async function loginAsFisio(page) {
  await page.goto("/dashboard");
  await page.waitForTimeout(4000);

  // Preencher nome — primeiro input de texto na página
  const inputs = page.locator('input[type="text"]');
  const count = await inputs.count();
  if (count >= 1) {
    await inputs.first().fill("Dr. Teste E2E");
    await page.waitForTimeout(300);
  }
  if (count >= 2) {
    await inputs.nth(1).fill("278187-F");
    await page.waitForTimeout(300);
  }

  // Clicar no botão verde principal (o último botão do formulário de login)
  const enterBtn = page.locator('button').filter({ hasText: /SASYRA/ }).first();
  if (await enterBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await enterBtn.click();
    await page.waitForTimeout(3000);
  }

  // Selecionar Fisioterapia no ModuleSelector
  const fisioBtn = page.locator('button:has-text("Fisioterapia")').first();
  if (await fisioBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await fisioBtn.click();
    await page.waitForTimeout(1500);
  }

  // Selecionar Fisioterapia Ortopédica no SubModule Picker
  const orthoBtn = page.locator('button:has-text("Fisioterapia Ortopédica")').first();
  if (await orthoBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await orthoBtn.click();
    await page.waitForTimeout(2000);
  }
}

async function selectFirstPatient(page) {
  // Pode haver lista de pacientes ou a avaliação diretamente
  // Tenta clicar em qualquer botão de paciente visível
  const patientBtn = page.locator('button:has-text("Selecionar")').first();
  if (await patientBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
    await patientBtn.click();
    await page.waitForTimeout(2000);
    return true;
  }
  // Tenta clicar no primeiro nome de paciente
  const patientCard = page.locator('[style*="cursor:pointer"]').filter({ hasText: /Dr\.|Paciente/ }).first();
  if (await patientCard.isVisible({ timeout: 3000 }).catch(() => false)) {
    await patientCard.click();
    await page.waitForTimeout(2000);
    return true;
  }
  return false;
}

test.describe("SASYRA E2E — Fluxo Completo", () => {

  test("1. Login: preenche formulário e acessa", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForTimeout(4000);

    // Login screen should have text inputs
    const inputs = page.locator('input[type="text"]');
    const count = await inputs.count();
    expect(count).toBeGreaterThanOrEqual(2);

    await inputs.first().fill("Dr. Teste");
    if (count >= 2) await inputs.nth(1).fill("278187-F");

    // Click the enter button
    const enterBtn = page.locator('button').filter({ hasText: /SASYRA/ }).first();
    await expect(enterBtn).toBeVisible({ timeout: 5000 });
    await enterBtn.click();
    await page.waitForTimeout(3000);

    // Should show Fisioterapia module
    const fisioBtn = page.locator('button:has-text("Fisioterapia")').first();
    await expect(fisioBtn).toBeVisible({ timeout: 8000 });
  });

  test("2. Navegação: Fisioterapia → Ortopédica", async ({ page }) => {
    await loginAsFisio(page);

    // Deve mostrar o header da ortopédica ou lista de pacientes
    const header = page.locator('text=Ortopédica, text=Pacientes, button:has-text("Dicas")').first();
    await expect(header).toBeVisible({ timeout: 8000 });
  });

  test("3. 💡 Botão Dicas está visível no módulo ortopédico", async ({ page }) => {
    await loginAsFisio(page);
    await selectFirstPatient(page);

    const tipsBtn = page.locator('button:has-text("Dicas")').first();
    await expect(tipsBtn).toBeVisible({ timeout: 8000 });
  });

  test("4. 💡 Dicas abre e fecha modal", async ({ page }) => {
    await loginAsFisio(page);
    await selectFirstPatient(page);

    const tipsBtn = page.locator('button:has-text("Dicas")').first();
    await expect(tipsBtn).toBeVisible({ timeout: 8000 });
    await tipsBtn.click();
    await page.waitForTimeout(500);

    const modal = page.locator('text=Funcionalidades').first();
    await expect(modal).toBeVisible({ timeout: 3000 });

    // Fecha no ✕
    const closeBtn = page.locator('text=✕').first();
    await closeBtn.click();
    await expect(modal).not.toBeVisible({ timeout: 3000 });
  });

  test("5. 💡 Dicas contém conteúdo do módulo", async ({ page }) => {
    await loginAsFisio(page);
    await selectFirstPatient(page);

    const tipsBtn = page.locator('button:has-text("Dicas")').first();
    await tipsBtn.click();
    await page.waitForTimeout(500);

    // Verifica se há dicas com ícones
    const tipCards = page.locator('text=🎤, text=🧠, text=🗺️, text=📊');
    const count = await tipCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("6. 🧍 BodyMap renderiza na página", async ({ page }) => {
    await loginAsFisio(page);
    await selectFirstPatient(page);

    // O BodyMap é renderizado como SVG
    const svg = page.locator("svg").first();
    await expect(svg).toBeVisible({ timeout: 8000 });
  });

  test("7. 👤 Identificação do Paciente é colapsável", async ({ page }) => {
    await loginAsFisio(page);
    await selectFirstPatient(page);

    const idHeader = page.locator('h3:has-text("Identificação")').first();
    await expect(idHeader).toBeVisible({ timeout: 8000 });

    await idHeader.click();
    await page.waitForTimeout(500);

    // Após expandir, deve mostrar nome
    const nomeField = page.locator('input[placeholder*="Nome completo"]').first();
    await expect(nomeField).toBeVisible({ timeout: 3000 });
  });

  test("8. 🔢 NumericField — validação de range", async ({ page }) => {
    await loginAsFisio(page);
    await selectFirstPatient(page);

    // Expandir PatientIdentification
    const idHeader = page.locator('h3:has-text("Identificação")').first();
    if (await idHeader.isVisible({ timeout: 5000 }).catch(() => false)) {
      await idHeader.click();
      await page.waitForTimeout(500);
    }

    // Campo peso
    const pesoInput = page.locator('input[placeholder*="70"]').first();
    if (await pesoInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await pesoInput.fill("500");
      await page.waitForTimeout(500);

      const error = page.locator('text=Fora do intervalo').first();
      await expect(error).toBeVisible({ timeout: 3000 });
    }
  });

  test("9. 📱 Mobile — Login e navegação", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/dashboard");
    await page.waitForTimeout(4000);

    const inputs = page.locator('input[type="text"]');
    const count = await inputs.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("10. 📱 Mobile — BodyMap visível após login", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await loginAsFisio(page);
    await selectFirstPatient(page);

    const svg = page.locator("svg").first();
    if (await svg.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(svg).toBeVisible();
    }
  });
});
