import { test, expect } from "@playwright/test";
for (const width of [320, 390, 768, 1440]) {
  test(`homepage fits the viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "A jövődnek",
    );
    const image = page.locator(".hero-photo img");
    await expect(image).toBeVisible();
    await expect(image).toHaveJSProperty("complete", true);
    const dims = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      width: innerWidth,
    }));
    expect(dims.scroll).toBeLessThanOrEqual(dims.width);
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: true,
    });
  });
}
test("mobile menu opens, navigates, and closes after a selection", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("navigation", { name: "Mobil főmenü" });
  await expect(menu).toBeHidden();
  await page.getByRole("button", { name: "Menü", exact: true }).click();
  await expect(menu).toBeVisible();
  await menu.locator("summary").filter({ hasText: "Képzések" }).click();
  await menu
    .getByRole("link", { name: "Felvételi pontszámító", exact: true })
    .click();
  await expect(page).toHaveURL("/felvetelikalkulator");
  await expect(menu).toBeHidden();
});
test("mobile menu can be dismissed with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menü", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("navigation", { name: "Mobil főmenü" }),
  ).toBeHidden();
});
test("desktop information menu exposes the original menu groups", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Tudnivalók" }).click();
  const menu = page.locator("#desktop-submenu");
  for (const name of ["Vizsgák", "Dokumentumtár", "Szülő-diák", "Fenntartó"])
    await expect(menu.getByRole("link", { name, exact: true })).toBeVisible();
});
test("calculator calculates all seven areas and can be reset", async ({
  page,
}) => {
  await page.goto("/felvetelikalkulator");
  for (const select of await page.locator("select").all())
    await select.selectOption("5");
  await expect(page.locator("output")).toHaveCount(7);
  for (const output of await page.locator("output").all())
    await expect(output).toHaveText("80 / 80 pont");
  await page.getByRole("button", { name: "Adatok törlése" }).click();
  await expect(page.locator("output")).toHaveCount(0);
});
test("search finds Hungarian content without accents", async ({ page }) => {
  await page.goto("/kereses");
  await page.getByRole("searchbox").fill("felveteli");
  await page.getByRole("button", { name: "Keresés", exact: true }).click();
  await expect(page.locator(".search-results")).toContainText("Felvételi");
});
for (const path of [
  "/jelentkezes",
  "/alapdokumentumok",
  "/fenntarto",
  "/galeria",
  "/galeria/esemeny/265",
]) {
  test(`content remains inside a compact mobile viewport: ${path}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    const dims = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      width: innerWidth,
    }));
    expect(dims.scroll).toBeLessThanOrEqual(dims.width);
  });
}
test("unknown pages return a real 404", async ({ page }) => {
  const r = await page.goto("/ez-az-oldal-nem-letezik");
  expect(r?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "másik irányt",
  );
});

test("desktop Escape restores focus to its opener and does not hijack unrelated focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const opener = page.getByRole("button", { name: "Tudnivalók" });
  await opener.click();
  await page.locator("#desktop-submenu a").first().focus();
  await page.keyboard.press("Escape");
  await expect(page.locator("#desktop-submenu")).toHaveCount(0);
  await expect(opener).toBeFocused();
  const search = page.getByRole("link", { name: "Keresés a honlapon" });
  await search.focus();
  await page.keyboard.press("Escape");
  await expect(search).toBeFocused();
});

test("production security policy permits hydration and rejects inline event handlers", async ({
  page,
}) => {
  const violations: string[] = [];
  page.on("console", (message) => {
    if (
      /violates.*Content Security Policy|Refused to (execute|load|apply)/i.test(
        message.text(),
      )
    )
      violations.push(message.text());
  });
  const response = await page.goto("/felvetelikalkulator");
  expect(response?.headers()["content-security-policy"]).toContain(
    "script-src-attr 'none'",
  );
  expect(response?.headers()["content-security-policy"]).not.toContain(
    "unsafe-eval",
  );
  expect(response?.headers()["x-frame-options"]).toBe("DENY");
  await page.locator("select").first().selectOption("5");
  await expect(page.locator("select").first()).toHaveValue("5");
  expect(violations).toEqual([]);
  await page.evaluate(() => {
    const button = document.createElement("button");
    button.setAttribute(
      "onclick",
      "document.documentElement.dataset.injected='yes'",
    );
    document.body.append(button);
    button.click();
    button.remove();
  });
  expect(await page.locator("html").getAttribute("data-injected")).toBeNull();
});

test("search treats attack strings as text and repeated query parameters do not crash", async ({
  page,
}) => {
  const payload =
    '<img src=x onerror="document.documentElement.dataset.injected=1">';
  await page.goto(`/kereses?q=${encodeURIComponent(payload)}`);
  await expect(page.getByRole("searchbox")).toHaveValue(payload);
  await expect(page.locator(".search-count img")).toHaveCount(0);
  expect(await page.locator("html").getAttribute("data-injected")).toBeNull();
  expect((await page.goto("/kereses?q=one&q=two"))?.status()).toBe(200);
});
