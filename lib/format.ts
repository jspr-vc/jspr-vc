import { format } from "date-fns";

export function formatMonth(date: Date) {
  return format(date, "MMM yyyy");
}

export function formatDay(date: Date) {
  return format(date, "MMM d, yyyy");
}

/*
 * "https://github.com/jspr-vc/" -> "github/jspr-vc", the way the brand's
 * social card writes handles. Unknown hosts fall back to host + path.
 */
export function socialHandle(url: string) {
  try {
    const { hostname, pathname } = new URL(url);
    const host = hostname.replace(/^www\./, "");
    const path = pathname.replace(/^\/|\/$/g, "");
    if (host === "github.com") return `github/${path}`;
    if (host === "linkedin.com") return path;
    if (host === "twitter.com" || host === "x.com") return `x/${path}`;
    return path ? `${host}/${path}` : host;
  } catch {
    return url;
  }
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
