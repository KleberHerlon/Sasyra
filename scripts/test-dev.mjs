import { chromium } from "playwright";
const BASE = "http://localhost:5173";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.on("pageerror", err => console.log("PAGE_ERROR:", err.message));
page.on("console", msg => { if (msg.type() === "error") console.log("CONSOLE_ERR:", msg.text()); });
await page.goto(BASE, { waitUntil: "networkidle", timeout: 20000 });
await page.waitForTimeout(2000);

const btns0 = await page.evaluate(() => document.querySelectorAll("button").length);
console.log("Initial button count:", btns0);

// Login
await page.click('button:has-text("Fisioterapeuta")');
await page.fill('input[placeholder="Seu nome"]', "Dra. Carla");
await page.fill('input[placeholder="Ex: 12345-F"]', "123456-F");
await page.click('button:has-text("Entrar")');
await page.waitForTimeout(2000);

const btns = await page.evaluate(() => document.querySelectorAll("button").length);
console.log("After login button count:", btns);
const btnTexts = await page.evaluate(() => [...document.querySelectorAll("button")].map(b => b.textContent.trim()));
console.log("Buttons:", JSON.stringify(btnTexts));

await page.screenshot({ path: "test-dev-mode.png" });
await browser.close();
process.exit(0);
