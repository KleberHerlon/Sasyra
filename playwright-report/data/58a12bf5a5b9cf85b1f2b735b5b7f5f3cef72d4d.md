# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sasyra.spec.js >> SASYRA E2E — Fluxo Completo >> 9. 📱 Mobile — Login e navegação
- Location: e2e\sasyra.spec.js:179:3

# Error details

```
Error: expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 1
Received:    0
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - text: The server is configured with a public base URL of /Sasyra/ - did you mean to visit
  - link "/Sasyra/dashboard" [ref=e2] [cursor=pointer]:
    - /url: /Sasyra/dashboard
  - text: instead?
```

# Test source

```ts
  86  |     await loginAsFisio(page);
  87  | 
  88  |     // Deve mostrar o header da ortopédica ou lista de pacientes
  89  |     const header = page.locator('text=Ortopédica, text=Pacientes, button:has-text("Dicas")').first();
  90  |     await expect(header).toBeVisible({ timeout: 8000 });
  91  |   });
  92  | 
  93  |   test("3. 💡 Botão Dicas está visível no módulo ortopédico", async ({ page }) => {
  94  |     await loginAsFisio(page);
  95  |     await selectFirstPatient(page);
  96  | 
  97  |     const tipsBtn = page.locator('button:has-text("Dicas")').first();
  98  |     await expect(tipsBtn).toBeVisible({ timeout: 8000 });
  99  |   });
  100 | 
  101 |   test("4. 💡 Dicas abre e fecha modal", async ({ page }) => {
  102 |     await loginAsFisio(page);
  103 |     await selectFirstPatient(page);
  104 | 
  105 |     const tipsBtn = page.locator('button:has-text("Dicas")').first();
  106 |     await expect(tipsBtn).toBeVisible({ timeout: 8000 });
  107 |     await tipsBtn.click();
  108 |     await page.waitForTimeout(500);
  109 | 
  110 |     const modal = page.locator('text=Funcionalidades').first();
  111 |     await expect(modal).toBeVisible({ timeout: 3000 });
  112 | 
  113 |     // Fecha no ✕
  114 |     const closeBtn = page.locator('text=✕').first();
  115 |     await closeBtn.click();
  116 |     await expect(modal).not.toBeVisible({ timeout: 3000 });
  117 |   });
  118 | 
  119 |   test("5. 💡 Dicas contém conteúdo do módulo", async ({ page }) => {
  120 |     await loginAsFisio(page);
  121 |     await selectFirstPatient(page);
  122 | 
  123 |     const tipsBtn = page.locator('button:has-text("Dicas")').first();
  124 |     await tipsBtn.click();
  125 |     await page.waitForTimeout(500);
  126 | 
  127 |     // Verifica se há dicas com ícones
  128 |     const tipCards = page.locator('text=🎤, text=🧠, text=🗺️, text=📊');
  129 |     const count = await tipCards.count();
  130 |     expect(count).toBeGreaterThan(0);
  131 |   });
  132 | 
  133 |   test("6. 🧍 BodyMap renderiza na página", async ({ page }) => {
  134 |     await loginAsFisio(page);
  135 |     await selectFirstPatient(page);
  136 | 
  137 |     // O BodyMap é renderizado como SVG
  138 |     const svg = page.locator("svg").first();
  139 |     await expect(svg).toBeVisible({ timeout: 8000 });
  140 |   });
  141 | 
  142 |   test("7. 👤 Identificação do Paciente é colapsável", async ({ page }) => {
  143 |     await loginAsFisio(page);
  144 |     await selectFirstPatient(page);
  145 | 
  146 |     const idHeader = page.locator('h3:has-text("Identificação")').first();
  147 |     await expect(idHeader).toBeVisible({ timeout: 8000 });
  148 | 
  149 |     await idHeader.click();
  150 |     await page.waitForTimeout(500);
  151 | 
  152 |     // Após expandir, deve mostrar nome
  153 |     const nomeField = page.locator('input[placeholder*="Nome completo"]').first();
  154 |     await expect(nomeField).toBeVisible({ timeout: 3000 });
  155 |   });
  156 | 
  157 |   test("8. 🔢 NumericField — validação de range", async ({ page }) => {
  158 |     await loginAsFisio(page);
  159 |     await selectFirstPatient(page);
  160 | 
  161 |     // Expandir PatientIdentification
  162 |     const idHeader = page.locator('h3:has-text("Identificação")').first();
  163 |     if (await idHeader.isVisible({ timeout: 5000 }).catch(() => false)) {
  164 |       await idHeader.click();
  165 |       await page.waitForTimeout(500);
  166 |     }
  167 | 
  168 |     // Campo peso
  169 |     const pesoInput = page.locator('input[placeholder*="70"]').first();
  170 |     if (await pesoInput.isVisible({ timeout: 3000 }).catch(() => false)) {
  171 |       await pesoInput.fill("500");
  172 |       await page.waitForTimeout(500);
  173 | 
  174 |       const error = page.locator('text=Fora do intervalo').first();
  175 |       await expect(error).toBeVisible({ timeout: 3000 });
  176 |     }
  177 |   });
  178 | 
  179 |   test("9. 📱 Mobile — Login e navegação", async ({ page }) => {
  180 |     await page.setViewportSize({ width: 375, height: 812 });
  181 |     await page.goto("/dashboard");
  182 |     await page.waitForTimeout(4000);
  183 | 
  184 |     const inputs = page.locator('input[type="text"]');
  185 |     const count = await inputs.count();
> 186 |     expect(count).toBeGreaterThanOrEqual(1);
      |                   ^ Error: expect(received).toBeGreaterThanOrEqual(expected)
  187 |   });
  188 | 
  189 |   test("10. 📱 Mobile — BodyMap visível após login", async ({ page }) => {
  190 |     await page.setViewportSize({ width: 375, height: 812 });
  191 |     await loginAsFisio(page);
  192 |     await selectFirstPatient(page);
  193 | 
  194 |     const svg = page.locator("svg").first();
  195 |     if (await svg.isVisible({ timeout: 5000 }).catch(() => false)) {
  196 |       await expect(svg).toBeVisible();
  197 |     }
  198 |   });
  199 | });
  200 | 
```