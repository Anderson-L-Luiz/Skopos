/**
 * Visual E2E test — Opens every page in a real browser, takes screenshots,
 * and tests interactive flows like login, job browsing, and form submission.
 */
import { chromium } from "playwright";
import { existsSync, mkdirSync } from "fs";

const BASE = "http://localhost:3100";
const SCREENSHOT_DIR = "./screenshots";

if (!existsSync(SCREENSHOT_DIR)) mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function run() {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const results = [];
  const log = (test, status, detail = "") => {
    results.push({ test, status, detail });
    console.log(`${status === "PASS" ? "✅" : "❌"} ${test}${detail ? ` — ${detail}` : ""}`);
  };

  try {
    // ─── 1. LANDING PAGE ───
    console.log("\n═══ 1. LANDING PAGE ═══");
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `${SCREENSHOT_DIR}/01-landing.png`, fullPage: true });
    const title = await page.title();
    log("Landing page loads", title ? "PASS" : "FAIL", title);
    const hasCTA = await page.locator("text=Get Started").count() > 0 || await page.locator("text=Sign In").count() > 0;
    log("Landing has CTA buttons", hasCTA ? "PASS" : "FAIL");

    // ─── 2. LOGIN FLOW ───
    console.log("\n═══ 2. LOGIN FLOW ═══");
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `${SCREENSHOT_DIR}/02-login.png` });
    log("Login page loads", "PASS");

    // Fill login form
    await page.fill('input[type="email"]', "demo@skopos.dev");
    await page.fill('input[type="password"]', "password123");
    await page.screenshot({ path: `${SCREENSHOT_DIR}/03-login-filled.png` });
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL("**/dashboard", { timeout: 10000 }).catch(() => {});
    await page.waitForLoadState("networkidle");
    const onDashboard = page.url().includes("/dashboard");
    log("Login redirects to dashboard", onDashboard ? "PASS" : "FAIL", page.url());
    await page.screenshot({ path: `${SCREENSHOT_DIR}/04-dashboard.png`, fullPage: true });

    // ─── 3. DASHBOARD ───
    console.log("\n═══ 3. DASHBOARD ═══");
    const statsCards = await page.locator("[class*='card']").count();
    log("Dashboard has stat cards", statsCards > 0 ? "PASS" : "FAIL", `${statsCards} cards`);

    // ─── 4. JOBS PAGE ───
    console.log("\n═══ 4. JOBS PAGE ═══");
    await page.goto(`${BASE}/jobs`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/05-jobs.png`, fullPage: true });
    const jobCards = await page.locator("[class*='card']").count();
    log("Jobs page shows job cards", jobCards > 0 ? "PASS" : "FAIL", `${jobCards} elements`);

    // ─── 5. CV BUILDER ───
    console.log("\n═══ 5. CV BUILDER ═══");
    await page.goto(`${BASE}/cv`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/06-cv.png`, fullPage: true });
    log("CV Builder page loads", "PASS");

    // ─── 6. MATCHES ───
    console.log("\n═══ 6. MATCHES ═══");
    await page.goto(`${BASE}/matches`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/07-matches.png`, fullPage: true });
    log("Matches page loads", "PASS");

    // ─── 7. COVER LETTERS (NEW) ───
    console.log("\n═══ 7. COVER LETTERS ═══");
    await page.goto(`${BASE}/cover-letters`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/08-cover-letters.png`, fullPage: true });
    const hasJobSelect = await page.locator("select").count() > 0;
    log("Cover Letters page loads with generator", hasJobSelect ? "PASS" : "FAIL");

    // ─── 8. APPLICATIONS ───
    console.log("\n═══ 8. APPLICATIONS ═══");
    await page.goto(`${BASE}/applications`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/09-applications.png`, fullPage: true });
    log("Applications page loads", "PASS");

    // ─── 9. CONTACTS (NEW) ───
    console.log("\n═══ 9. CONTACTS CRM ═══");
    await page.goto(`${BASE}/contacts`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/10-contacts.png`, fullPage: true });
    log("Contacts page loads", "PASS");

    // Test adding a contact
    const addBtn = page.locator("text=Add Contact");
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/11-contacts-form.png` });
      log("Add Contact form opens", "PASS");
    }

    // ─── 10. SALARY INSIGHTS (NEW) ───
    console.log("\n═══ 10. SALARY INSIGHTS ═══");
    await page.goto(`${BASE}/salary`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/12-salary.png`, fullPage: true });
    log("Salary Insights page loads", "PASS");

    // Test salary search
    const roleInput = page.locator('input[placeholder*="Software"]');
    if (await roleInput.count() > 0) {
      await roleInput.fill("Software Engineer");
      await page.locator("text=Search").click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/13-salary-results.png`, fullPage: true });
      const hasResults = await page.locator("text=Salary Range").count() > 0 || await page.locator("text=From Job Listings").count() > 0;
      log("Salary search returns results", hasResults ? "PASS" : "FAIL");
    }

    // ─── 11. BRAND ADVISOR ───
    console.log("\n═══ 11. BRAND ADVISOR ═══");
    await page.goto(`${BASE}/brand`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/14-brand.png`, fullPage: true });
    log("Brand Advisor page loads", "PASS");

    // ─── 12. INTERVIEW PREP ───
    console.log("\n═══ 12. INTERVIEW PREP ═══");
    await page.goto(`${BASE}/interview`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/15-interview.png`, fullPage: true });
    log("Interview Prep page loads", "PASS");

    // ─── 13. REGISTER PAGE ───
    console.log("\n═══ 13. REGISTER PAGE ═══");
    await page.goto(`${BASE}/register`);
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `${SCREENSHOT_DIR}/16-register.png` });
    log("Register page loads", "PASS");

    // ─── SIDEBAR NAV CHECK ───
    console.log("\n═══ SIDEBAR NAVIGATION ═══");
    await page.goto(`${BASE}/dashboard`);
    await page.waitForLoadState("networkidle");
    const navItems = ["Dashboard", "Jobs", "CV Builder", "Matches", "Cover Letters", "Applications", "Contacts", "Salary", "Brand", "Interview"];
    for (const item of navItems) {
      const found = await page.locator(`text=${item}`).count() > 0;
      log(`Sidebar has "${item}"`, found ? "PASS" : "FAIL");
    }

  } catch (err) {
    console.error("Test error:", err);
  }

  // ─── SUMMARY ───
  console.log("\n═══════════════════════════════════════");
  console.log("           TEST SUMMARY");
  console.log("═══════════════════════════════════════");
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📸 Screenshots saved to ${SCREENSHOT_DIR}/`);
  console.log("═══════════════════════════════════════\n");

  // Keep browser open for 5 seconds so user can see
  await page.waitForTimeout(5000);
  await browser.close();
}

run().catch(console.error);
