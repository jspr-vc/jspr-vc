"use client";
import { Markdown, MarkdownNoHeadings } from "@/components/ui/md";
import {
  TypographyH1,
  TypographyH2,
  TypographyH4,
  TypographyLarge,
} from "@/components/ui/typography";
import type { GetPortfolioWithRelations } from "@/queries";
import NextLink from "next/link";
import { ExperienceList } from "./_experiences";
import { PostList } from "./_posts";
import { ProjectList } from "./_projects";
import { SocialLinks } from "./_social-links";

interface PortfolioPageProps {
  portfolio: GetPortfolioWithRelations;
}

export function PortfolioPage({ portfolio }: PortfolioPageProps) {
  return (
    <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 font-sans sm:px-12 sm:py-20 lg:px-24 lg:py-0">
      <div className="min-h-screen lg:flex lg:justify-between lg:gap-8">
        <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:py-24">
          <div className="flex-1">
            <TypographyH1 className="tracking-tight text-foreground">
              <a href={`/${portfolio.slug}`}>{portfolio.name}</a>
            </TypographyH1>
            {portfolio.headline && (
              <TypographyH4 className="mt-3 font-medium tracking-tight text-foreground">
                <MarkdownNoHeadings content={portfolio.headline} />
              </TypographyH4>
            )}
            <Markdown content={portfolio.subheading} />

            <nav className="hidden lg:flex pt-8">
              <ul>
                {portfolio.about && (
                  <li>
                    <NextLink href="#about">
                      <TypographyLarge className="hover:text-foreground transition-colors">
                        About
                      </TypographyLarge>
                    </NextLink>
                  </li>
                )}
                {portfolio.experiences.length > 0 && (
                  <li>
                    <NextLink href="#experience">
                      <TypographyLarge className="hover:text-foreground transition-colors">
                        Experience
                      </TypographyLarge>
                    </NextLink>
                  </li>
                )}
                {portfolio.projects.length > 0 && (
                  <li>
                    <NextLink href="#projects">
                      <TypographyLarge className="hover:text-foreground transition-colors">
                        Projects
                      </TypographyLarge>
                    </NextLink>
                  </li>
                )}
                {portfolio.posts.length > 0 && (
                  <li>
                    <NextLink href="#posts">
                      <TypographyLarge className="hover:text-foreground transition-colors">
                        Posts
                      </TypographyLarge>
                    </NextLink>
                  </li>
                )}
              </ul>
            </nav>
          </div>
          <SocialLinks
            {...portfolio.socialLinks}
            publicEmail={portfolio.publicEmail}
          />
        </header>
        <main
          className="pt-8 lg:pt-24 lg:w-1/2 lg:py-24 flex flex-col gap-20"
          id="about"
        >
          {portfolio.about && (
            <div className="flex flex-col gap-2 snap-mt-6 scroll-m-8">
              <TypographyH2 className="border-none flex lg:hidden pt-6">
                About
              </TypographyH2>
              <Markdown content={portfolio.about ?? ""} />
            </div>
          )}
          {portfolio.experiences.length > 0 && (
            <ExperienceList experiences={portfolio.experiences} />
          )}
          {portfolio.projects.length > 0 && (
            <ProjectList projects={portfolio.projects} />
          )}
          {portfolio.posts.length > 0 && (
            <PostList posts={portfolio.posts} authorName={portfolio.name} />
          )}
        </main>
      </div>
    </div>
  );
}
