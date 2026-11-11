import { Mark } from "@/components/brand/logo";
import { Markdown } from "@/components/markdown";
import { SiteFooter } from "@/components/site-footer";
import { HeaderNav, HeaderNavLink, SiteHeader } from "@/components/site-header";
import { formatMonth, socialHandle } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { GetPortfolioWithRelations } from "@/queries";
import { ExperienceList } from "./_experiences";
import { PostList } from "./_posts";
import { ProjectTiles } from "./_projects";
import { Tile, TileHeading } from "./_tile";

interface PortfolioPageProps {
  portfolio: GetPortfolioWithRelations;
}

export function PortfolioPage({ portfolio }: PortfolioPageProps) {
  const { socialLinks } = portfolio;
  const contacts = [
    socialLinks.github,
    socialLinks.linkedin,
    socialLinks.twitter,
    socialLinks.website,
  ]
    .filter((url): url is string => Boolean(url))
    .map((url) => ({ href: url, label: socialHandle(url) }));
  if (portfolio.publicEmail) {
    contacts.push({
      href: `mailto:${portfolio.publicEmail}`,
      label: portfolio.publicEmail,
    });
  }

  const current = portfolio.experiences.find((exp) => !exp.endedAt);

  const sections = [
    { id: "about", show: Boolean(portfolio.about) },
    { id: "experience", show: portfolio.experiences.length > 0 },
    { id: "projects", show: portfolio.projects.length > 0 },
    { id: "posts", show: portfolio.posts.length > 0 },
  ].filter((section) => section.show);

  return (
    <div className="min-h-dvh bg-ground">
      <SiteHeader>
        <HeaderNav>
          {sections.map((section) => (
            <HeaderNavLink key={section.id} href={`#${section.id}`}>
              {section.id}
            </HeaderNavLink>
          ))}
        </HeaderNav>
      </SiteHeader>

      <main className="mx-auto grid max-w-[76rem] gap-3 px-3 sm:gap-4 sm:px-6 lg:grid-cols-6">
        <Tile
          aria-label={portfolio.name}
          className="flex min-h-[34rem] flex-col justify-between gap-14 lg:col-span-6 lg:min-h-[40rem]"
        >
          <div className="flex items-center justify-between">
            <Mark className="size-14 sm:size-[4.5rem]" />
            <p className="font-mono text-muted-foreground sm:text-lg">
              jspr.vc/{portfolio.slug}
            </p>
          </div>
          <div>
            <h1 className="text-balance font-semibold text-[clamp(3.25rem,10.5vw,9rem)] leading-[0.94] tracking-[-0.055em]">
              {portfolio.name}
              <span
                aria-hidden="true"
                className="pebble ml-[0.06em] h-[0.18em] w-[0.2em] animate-dot-in"
              />
            </h1>
            {portfolio.headline && (
              <Markdown
                content={portfolio.headline}
                headings={false}
                className="mt-8 max-w-[58ch] font-mono text-lg sm:text-2xl sm:leading-snug"
              />
            )}
            {portfolio.subheading && (
              <Markdown
                content={portfolio.subheading}
                headings={false}
                className="mt-4 max-w-[62ch] text-lg text-muted-foreground"
              />
            )}
          </div>
          {contacts.length > 0 && (
            <ul className="flex flex-wrap gap-x-8 gap-y-2 font-mono sm:text-lg">
              {contacts.map((contact) => (
                <li key={contact.href}>
                  <a
                    href={contact.href}
                    rel="me noreferrer"
                    className="text-muted-foreground underline decoration-transparent underline-offset-4 transition-colors hover:text-foreground hover:decoration-dot"
                  >
                    {contact.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Tile>

        {portfolio.about && (
          <Tile
            id="about"
            aria-labelledby="about-heading"
            className={cn("lg:col-span-6", current && "lg:col-span-4")}
          >
            <TileHeading id="about-heading">about</TileHeading>
            <Markdown
              content={portfolio.about}
              className="mt-8 max-w-[64ch] text-lg"
            />
          </Tile>
        )}

        {current && (
          <Tile
            aria-label="Current role"
            className={cn(
              "flex min-h-72 flex-col justify-between gap-10 bg-signal text-ink lg:col-span-6",
              portfolio.about && "lg:col-span-2",
            )}
          >
            <p className="font-mono font-semibold text-2xl tracking-mono-display sm:text-[2rem]">
              now
            </p>
            <div>
              <p className="text-balance font-semibold text-4xl leading-[1.02] tracking-[-0.045em] sm:text-5xl">
                {current.jobTitle}
              </p>
              <p className="mt-3 font-mono text-lg">
                {current.companyName}, since {formatMonth(current.startedAt)}
              </p>
            </div>
          </Tile>
        )}

        {portfolio.experiences.length > 0 && (
          <Tile
            id="experience"
            aria-labelledby="experience-heading"
            className="lg:col-span-6"
          >
            <TileHeading id="experience-heading">experience</TileHeading>
            <ExperienceList experiences={portfolio.experiences} />
          </Tile>
        )}

        {portfolio.projects.length > 0 && (
          <>
            <h2
              id="projects"
              className="px-3 pt-10 pb-2 font-mono font-semibold text-2xl tracking-mono-display sm:px-6 sm:text-[2rem] lg:col-span-6"
            >
              projects
            </h2>
            <ProjectTiles projects={portfolio.projects} />
          </>
        )}

        {portfolio.posts.length > 0 && (
          <Tile
            id="posts"
            aria-labelledby="posts-heading"
            className="lg:col-span-6"
          >
            <TileHeading id="posts-heading">posts</TileHeading>
            <PostList posts={portfolio.posts} />
          </Tile>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
