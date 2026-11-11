/*
 * Cache tags shared by the cached queries and the server actions that
 * invalidate them. Every tag is built here so the two sides cannot drift.
 */
export const CacheTag = {
  Portfolios: "portfolios",
  Portfolio: (portfolioId: number) => `portfolio:${portfolioId}`,
  Experience: (id: number) => `experience:${id}`,
  Project: (id: number) => `project:${id}`,
  Posts: "posts",
  Post: (idOrSlug: number | string) => `post:${idOrSlug}`,
  Technologies: "technologies",
} as const;
