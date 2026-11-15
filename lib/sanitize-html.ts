import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

// Server/build only: JSDOM neither executes scripts nor fetches remote resources.
const window = new JSDOM("").window;
const purify = createDOMPurify(window);
const attributes: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel", "aria-label"]),
  img: new Set(["src", "alt", "loading", "decoding"]),
  td: new Set(["colspan", "rowspan"]),
  th: new Set(["colspan", "rowspan", "scope"]),
  details: new Set(["open"]),
  ol: new Set(["start"]),
  div: new Set(["tabindex", "role", "aria-label"]),
};
purify.addHook("uponSanitizeAttribute", (node, data) => {
  const tag = node.nodeName.toLowerCase();
  if (
    !["id", "class"].includes(data.attrName) &&
    !attributes[tag]?.has(data.attrName)
  ) {
    data.keepAttr = false;
    return;
  }
  if (data.attrName === "src" || data.attrName === "href") {
    const value = data.attrValue.trim();
    // Reject protocol-relative links, backslashes, controls and encoded JS schemes.
    if (/[\u0000-\u001f\u007f\\]/.test(value) || value.startsWith("//")) {
      data.keepAttr = false;
      return;
    }
    try {
      const url = new URL(value, "https://www.eszi.hu/");
      data.keepAttr =
        !url.username &&
        !url.password &&
        (data.attrName === "src"
          ? url.protocol === "https:" && url.hostname === "www.eszi.hu"
          : ["http:", "https:", "mailto:", "tel:", "webcal:"].includes(
              url.protocol,
            ));
    } catch {
      data.keepAttr = false;
    }
  }
});
purify.addHook("afterSanitizeAttributes", (node) => {
  if (node.nodeName === "A") {
    if (node.getAttribute("target") === "_blank")
      node.setAttribute("rel", "noopener noreferrer");
    else node.removeAttribute("target");
  }
});
export function sanitizeContentHtml(html: string): string {
  return purify.sanitize(html, {
    ALLOWED_TAGS: [
      "div",
      "p",
      "a",
      "img",
      "table",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "td",
      "th",
      "caption",
      "br",
      "h2",
      "h3",
      "h4",
      "b",
      "strong",
      "em",
      "i",
      "u",
      "s",
      "sup",
      "sub",
      "span",
      "ul",
      "ol",
      "li",
      "details",
      "summary",
      "hr",
      "blockquote",
    ],
    ALLOWED_ATTR: [
      "id",
      "class",
      ...new Set(Object.values(attributes).flatMap((values) => [...values])),
    ],
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false,
    ADD_URI_SAFE_ATTR: [],
  });
}
