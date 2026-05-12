/** True for medium.com and *.medium.com hosts */
export function isMediumArticleUrl(raw: string): boolean {
  const s = raw.trim();
  if (!s) return false;
  try {
    const u = new URL(s);
    const h = u.hostname.replace(/^www\./, "").toLowerCase();
    return h === "medium.com" || h.endsWith(".medium.com");
  } catch {
    return false;
  }
}

const LEGACY_MEDIUM_EXCERPT_SEP = "\n\n---\n\n";

/**
 * Stored MDX used to repeat the excerpt before a rule; the Medium layout already
 * shows `excerpt` in the hero. Strip that legacy prefix when it matches.
 */
export function mediumMdxBodyWithoutDuplicateExcerpt(
  content: string,
  excerpt: string,
): string {
  const ex = excerpt.trim();
  const normalized = content.replace(/\r\n/g, "\n").trim();
  if (!ex) return normalized;

  const sepIdx = normalized.indexOf(LEGACY_MEDIUM_EXCERPT_SEP);
  if (sepIdx !== -1) {
    const head = normalized.slice(0, sepIdx).trim();
    if (head === ex) {
      return normalized.slice(sepIdx + LEGACY_MEDIUM_EXCERPT_SEP.length).trim();
    }
  }

  return normalized;
}

/** GitHub user/repo or org/repo from a github.com URL, for display labels */
export function githubPathLabel(url: string): string {
  try {
    const u = new URL(url.trim());
    if (!u.hostname.replace(/^www\./, "").toLowerCase().includes("github.com")) {
      return "GitHub";
    }
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
    if (parts.length === 1) return parts[0]!;
    return "GitHub";
  } catch {
    return "GitHub";
  }
}
