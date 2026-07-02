import { chromium, devices } from "playwright";
import { writeFileSync } from "fs";
const OUT = "/tmp/claude-0/-home-user-Card-game/6fe53591-d27f-58c8-a1aa-d825a9c564ae/scratchpad";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await b.newContext({ ...devices["iPhone 13"] });
const p = await ctx.newPage();
await p.goto("http://localhost:4173/");
await p.waitForTimeout(1200);
const tabs = p.locator(".tab-bar button, .tab-bar .tab");
const n = await tabs.count();
const tap = async (want) => {
  for (let i = 0; i < n; i++) {
    if ((await tabs.nth(i).innerText()).toLowerCase().includes(want)) { await tabs.nth(i).tap(); return; }
  }
};
for (const t of ["play", "crew", "ships", "hangar", "shop", "more"]) {
  await tap(t);
  await p.waitForTimeout(600);
  writeFileSync(`${OUT}/tab-${t}.png`, await p.screenshot());
}
// More sub-pages: How to Play, Records, Settings buttons live in the More panel.
for (const label of ["How", "Records", "Settings"]) {
  await tap("more");
  await p.waitForTimeout(400);
  const btn = p.locator("button", { hasText: new RegExp(label, "i") }).first();
  if (await btn.count()) { await btn.tap(); await p.waitForTimeout(600); writeFileSync(`${OUT}/sub-${label}.png`, await p.screenshot()); }
}
await b.close();
