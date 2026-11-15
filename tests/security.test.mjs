import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { sanitizeContentHtml } from "../lib/sanitize-html.ts";
const clean = (html) =>
  new JSDOM(`<article>${sanitizeContentHtml(html)}</article>`).window.document;
test("legacy content rejects executable elements, form submission and event attributes", () => {
  const doc = clean(
    '<script>alert(1)</script><svg onload="alert(1)"></svg><math><mi>x</mi></math><iframe srcdoc="x"></iframe><object data="x"></object><base href="https://evil.example"><form action="https://evil.example"><input name="password"></form><p onclick="alert(1)" style="color:red">Szöveg</p>',
  );
  assert.equal(
    doc.querySelector(
      "article script,svg,math,iframe,object,base,form,input,[onclick],[style]",
    ),
    null,
  );
  assert.match(doc.querySelector("article").textContent, /Szöveg/);
});
test("encoded, control-character and protocol-relative URLs cannot bypass filtering", () => {
  for (const href of [
    "javascript:alert(1)",
    "jav&#x61;script:alert(1)",
    "java&#10;script:alert(1)",
    "data:text/html,x",
    "vbscript:msgbox(1)",
    "//evil.example",
    "https://user:pass@evil.example",
    "https:\\evil.example",
  ]) {
    assert.equal(
      clean(`<a href="${href}">link</a>`)
        .querySelector("a")
        .hasAttribute("href"),
      false,
      href,
    );
  }
  for (const src of [
    "data:image/svg+xml,x",
    "https://evil.example/x.jpg",
    "//www.eszi.hu/x.jpg",
    "http://www.eszi.hu/x.jpg",
  ])
    assert.equal(
      clean(`<img src="${src}">`).querySelector("img").hasAttribute("src"),
      false,
      src,
    );
});
test("required document links, images, anchors, accordions and scrollable tables survive", () => {
  const doc = clean(
    '<a href="/kapcsolat#iroda">Elérhetőség</a><a href="mailto:info@eszi.hu">Email</a><a href="https://www.eszi.hu/static/info.pdf" target="_blank" rel="opener">PDF</a><img src="https://www.eszi.hu/kepek/a.jpg" alt="Iskola" loading="lazy"><details open><summary>Év</summary><div class="table-scroll" role="region" tabindex="0" aria-label="Táblázat"><table><tr><td colspan="2">Adat</td></tr></table></div></details>',
  );
  assert.equal(doc.querySelector("a").getAttribute("href"), "/kapcsolat#iroda");
  assert.equal(
    doc.querySelectorAll("a")[1].getAttribute("href"),
    "mailto:info@eszi.hu",
  );
  assert.equal(
    doc.querySelector("[target]").getAttribute("rel"),
    "noopener noreferrer",
  );
  assert.equal(
    doc.querySelector("img").getAttribute("src"),
    "https://www.eszi.hu/kepek/a.jpg",
  );
  assert.ok(
    doc.querySelector(
      'details[open] .table-scroll[tabindex="0"] td[colspan="2"]',
    ),
  );
});
test("malformed namespace payloads remain inert after browser-style parsing", () => {
  for (const payload of [
    "<svg><g/onload=alert(1)//<p>",
    '<math><mtext><table><mglyph><style><!--</style><img title="--><img src=x onerror=alert(1)>">',
    '<a id="__proto__" name="constructor" href="javascript:alert(1)">x</a>',
  ]) {
    const doc = clean(payload);
    assert.equal(
      doc.querySelector(
        "article script,svg,math,[onload],[onerror],[name],#\u005f\u005fproto__",
      ),
      null,
    );
  }
});

test("canonical origin is normalized and rejects malformed deployment configuration", async () => {
  const { getSiteUrl } = await import("../lib/site-url.ts");
  assert.equal(getSiteUrl("https://www.eszi.hu/"), "https://www.eszi.hu");
  for (const value of [
    "javascript:alert(1)",
    "https://user:pass@www.eszi.hu",
    "https://www.eszi.hu/subpath",
    "https://www.eszi.hu/?q=x",
  ])
    assert.throws(() => getSiteUrl(value));
});
