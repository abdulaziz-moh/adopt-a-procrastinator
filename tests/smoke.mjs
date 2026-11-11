import { chromium } from "@playwright/test";
import { readdirSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
const cache = path.join(process.env.LOCALAPPDATA || "", "ms-playwright");
const available = existsSync(cache)
  ? readdirSync(cache)
      .filter((name) => /^chromium-\d+$/.test(name))
      .sort()
      .reverse()
  : [];
const executable = available
  .map((name) => path.join(cache, name, "chrome-win64", "chrome.exe"))
  .find(existsSync);
const browser = await chromium.launch(
  executable ? { executablePath: executable } : {},
);
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await page.goto("http://127.0.0.1:5173/");
await page.getByRole("button", { name: "Adopt Your Pet" }).click();
await page.getByLabel("What should we call your pet?").fill("Mochi");
await page.getByRole("button", { name: "Adopt Now" }).click();
await page.getByRole("button", { name: "Add mission", exact: true }).click();
await page.locator("#task-title").fill("Finish the hackathon");
await page
  .getByRole("dialog")
  .getByRole("button", { name: "Add mission" })
  .click();
await page
  .getByRole("button", { name: "Complete: Finish the hackathon", exact: true })
  .click();
let saved = await page.evaluate(() =>
  JSON.parse(localStorage.getItem("adopt-a-procrastinator:v1")),
);
if (saved.pet.totalXP !== 20) throw new Error("XP completion failed");
await page.reload();
await page.getByRole("heading", { name: "Mochi", exact: true }).waitFor();
saved = await page.evaluate(() =>
  JSON.parse(localStorage.getItem("adopt-a-procrastinator:v1")),
);
if (saved.pet.totalXP !== 20) throw new Error("Persistence failed");
mkdirSync("artifacts", { recursive: true });
await page.screenshot({ path: "artifacts/dashboard.png", fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: "artifacts/mobile.png", fullPage: true });
const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth > innerWidth,
);
if (overflow) throw new Error("Mobile overflow");
await browser.close();
if (errors.length) throw new Error(errors.join("\n"));
console.log(
  "PASS: adoption, mission, completion XP, refresh persistence, mobile layout, no page errors",
);
