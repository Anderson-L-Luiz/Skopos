import { test, expect } from "@playwright/test";

const EMAIL = "demo@skopos.dev";
const PASSWORD = "password123";

async function login(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill(EMAIL);
  await page.locator('input[type="password"]').fill(PASSWORD);
  await Promise.all([
    page.waitForURL(/\/dashboard/, { timeout: 30_000 }),
    page.locator('button[type="submit"]').click(),
  ]);
}

test("evaluation flow: A-F grade + 6 blocks", async ({ page }) => {
  await login(page);

  await page.goto("/evaluations");
  await expect(page.getByRole("heading", { name: /job evaluation/i })).toBeVisible();

  // Job dropdown should be populated by /api/jobs
  const select = page.getByTestId("job-select");
  await expect(select).toBeVisible();
  // Wait until at least one option exists
  await expect.poll(async () => (await select.locator("option").count())).toBeGreaterThan(0);

  await page.getByTestId("run-eval").click();

  await expect(page.getByTestId("eval-report")).toBeVisible({ timeout: 20_000 });
  const grade = await page.getByTestId("grade").innerText();
  expect(["A", "B", "C", "D", "F"]).toContain(grade.trim());

  const score = parseInt(await page.getByTestId("overall-score").innerText(), 10);
  expect(score).toBeGreaterThanOrEqual(0);
  expect(score).toBeLessThanOrEqual(100);

  // 6 blocks present
  for (const heading of [
    "Role Summary", "CV Match", "Level Strategy",
    "Compensation Research", "Personalization", "Interview Prep",
  ]) {
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }
});

test.describe.configure({ mode: "serial" });
test("score-all enhancement also produces evaluations", async ({ page, request }) => {
  test.setTimeout(300_000);
  await login(page);
  // Reuse the page's authenticated session via request context
  const cookies = await page.context().cookies();
  const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join("; ");

  const res = await request.post("http://localhost:3000/api/matches/score-all?withEvaluations=true&limit=2", {
    headers: { cookie: cookieHeader },
    timeout: 240_000,
  });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.scored).toBeGreaterThan(0);
  expect(body.evaluationsUpserted).toBeGreaterThan(0);

  // Confirm at least one evaluation can be fetched
  const jobsRes = await request.get("http://localhost:3000/api/jobs", { headers: { cookie: cookieHeader } });
  const jobsBody = await jobsRes.json();
  const jobId: string = (jobsBody.jobs || jobsBody)[0].id;
  const evalRes = await request.get(`http://localhost:3000/api/evaluations/${jobId}`, { headers: { cookie: cookieHeader } });
  expect(evalRes.ok()).toBeTruthy();
  const evalBody = await evalRes.json();
  expect(["A", "B", "C", "D", "F"]).toContain(evalBody.grade);
});

test("cv export tailors to job (keyword injection)", async ({ page, request }) => {
  await login(page);
  const cookies = await page.context().cookies();
  const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join("; ");

  const jobsRes = await request.get("http://localhost:3000/api/jobs", { headers: { cookie: cookieHeader } });
  const jobsBody = await jobsRes.json();
  const job = (jobsBody.jobs || jobsBody)[0];

  // Generic export — no per-JD section
  const generic = await request.get("http://localhost:3000/api/cv/export", { headers: { cookie: cookieHeader } });
  const genericHtml = await generic.text();
  expect(genericHtml).toContain("TECHNICAL SKILLS");
  expect(genericHtml).not.toContain("KEY SKILLS FOR THIS ROLE");

  // Tailored export — adds job context
  const tailored = await request.get(`http://localhost:3000/api/cv/export?jobId=${job.id}`, { headers: { cookie: cookieHeader } });
  const tailoredHtml = await tailored.text();
  expect(tailoredHtml).toContain("KEY SKILLS FOR THIS ROLE");
  expect(tailoredHtml).toContain("JOB DESCRIPTION KEYWORDS");
  expect(tailoredHtml).toContain(job.title);
});

test("story bank: create + list STAR story", async ({ page }) => {
  await login(page);
  await page.goto("/stories");
  await expect(page.getByRole("heading", { name: /interview story bank/i })).toBeVisible();

  const unique = `Led migration ${Date.now()}`;
  await page.getByTestId("story-title").fill(unique);
  await page.getByTestId("story-situation").fill("Legacy monolith was failing under peak load.");
  await page.getByTestId("story-task").fill("Lead a zero-downtime migration to a service-oriented architecture.");
  await page.getByTestId("story-action").fill("Designed a strangler-fig rollout, wrote the migration plan, and led 4 engineers across 6 weeks.");
  await page.getByTestId("story-result").fill("Reduced p95 latency by 62% and eliminated peak-hour outages.");
  await page.getByTestId("story-reflection").fill("Earlier dual-write would have caught a hidden race condition.");

  await page.getByTestId("story-save").click();

  const list = page.getByTestId("story-list");
  await expect(list).toContainText(unique, { timeout: 15_000 });
});
