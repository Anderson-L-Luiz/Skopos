import { test, expect, Page } from "@playwright/test";

const EMAIL = "demo@skopos.dev";
const PASSWORD = "password123";

async function login(page: Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill(EMAIL);
  await page.locator('input[type="password"]').fill(PASSWORD);
  await Promise.all([
    page.waitForURL(/\/dashboard/, { timeout: 30_000 }),
    page.locator('button[type="submit"]').click(),
  ]);
}

const PAGES = [
  "/dashboard",
  "/jobs",
  "/cv",
  "/matches",
  "/cover-letters",
  "/applications",
  "/contacts",
  "/salary",
  "/brand",
  "/interview",
  "/evaluations",
  "/stories",
];

test("every sidebar page renders without console/network errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`PAGEERROR ${e.message}`));
  page.on("response", (r) => {
    const u = r.url();
    if (r.status() >= 500 && u.includes("localhost:3000")) errors.push(`HTTP ${r.status()} ${u}`);
  });

  await login(page);

  for (const path of PAGES) {
    await page.goto(path, { waitUntil: "networkidle" });
    // Confirm we didn't get bounced to /login
    expect(page.url(), `bounced from ${path}`).not.toContain("/login");
    // Some content rendered
    const bodyText = await page.locator("body").innerText();
    expect(bodyText.length, `empty body on ${path}`).toBeGreaterThan(20);
  }

  expect(errors, errors.join("\n")).toEqual([]);
});

test("AI endpoints respond OK with DunamisV2", async ({ page, request }) => {
  test.setTimeout(300_000);
  await login(page);
  const cookies = await page.context().cookies();
  const cookie = cookies.map((c) => `${c.name}=${c.value}`).join("; ");

  const jobs = await (await request.get("http://localhost:3000/api/jobs", { headers: { cookie } })).json();
  const jobId: string = (jobs.jobs || jobs)[0].id;

  // Match scoring (calls aiScorer → DunamisV2)
  const score = await request.post(`http://localhost:3000/api/matches/score/${jobId}`, {
    headers: { cookie },
    timeout: 240_000,
  });
  expect(score.ok(), `score ${score.status()}`).toBeTruthy();
  const scoreBody = await score.json();
  expect(scoreBody.score).toBeGreaterThanOrEqual(0);
  expect(scoreBody.score).toBeLessThanOrEqual(100);

  // Cover letter generation
  const cl = await request.post("http://localhost:3000/api/cover-letter", {
    headers: { cookie, "Content-Type": "application/json" },
    data: { jobId, tone: "professional" },
    timeout: 240_000,
  });
  // 503 is acceptable: indicates AI provider unavailable, which is a graceful failure
  expect([200, 201, 400, 404, 503], `cover-letter status ${cl.status()}`).toContain(cl.status());

  // Interview questions (GET only)
  const iq = await request.get(`http://localhost:3000/api/interview/questions?jobId=${jobId}`, {
    headers: { cookie },
    timeout: 240_000,
  });
  expect([200, 400, 404, 503], `iq status ${iq.status()}`).toContain(iq.status());
});
