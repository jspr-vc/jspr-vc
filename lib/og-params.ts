type OgParams<T extends Record<string, string>> = (
  params: T,
) => URLSearchParams;

const ogParams = <T extends Record<string, string>>(params: T) => {
  return new URLSearchParams(params);
};

type PortfolioParams = {
  name: string;
  url: string;
  headline: string;
  github: string;
  linkedin: string;
  twitter: string;
  website: string;
};

type PostParams = {
  title: string;
  slug: string;
  author: string;
  excerpt: string;
};

export const portfolioOgParams: OgParams<PortfolioParams> = ogParams;
export const linkedinBannerOgParams: OgParams<PortfolioParams> = ogParams;
export const postOgParams: OgParams<PostParams> = ogParams;
