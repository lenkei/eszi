/** One canonical origin for metadata, robots and sitemap URLs. */
export function getSiteUrl(
  value = process.env.NEXT_PUBLIC_SITE_URL || "https://www.eszi.hu",
) {
  const url = new URL(value);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  ) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin without credentials, a path, query or fragment.",
    );
  }
  return url.origin;
}
