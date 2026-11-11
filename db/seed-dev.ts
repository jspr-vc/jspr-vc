/*
 * Demo content for local development: one signed-in user with a filled
 * portfolio. Wipes existing rows first, and refuses to run against anything
 * but a local database.
 */
import { sql } from "drizzle-orm";
import { db } from "./client";
import {
  experiences,
  experienceTech,
  portfolios,
  posts,
  projects,
  sessions,
  technologies,
  users,
} from "./schema";
import { projectTech } from "./schema/project-technologies";

const USER_ID = "dev-user";
const DEV_SESSION_TOKEN = "dev-session";

const TECH: [name: string, description: string | null][] = [
  ["TypeScript", "Typed superset of JavaScript"],
  ["Next.js", "React framework for the web"],
  ["React", "Library for building user interfaces"],
  ["TanStack Start", "Full-stack React framework on Vite"],
  ["Tailwind CSS", "Utility-first CSS framework"],
  ["Node.js", "JavaScript runtime"],
  ["Bun", "JavaScript runtime and package manager"],
  ["PostgreSQL", "Relational database"],
  ["Drizzle", "TypeScript ORM"],
  ["Redis", "In-memory data store"],
  ["RabbitMQ", "Message broker"],
  ["Docker", null],
  ["OpenTofu", "Open source infrastructure as code"],
  ["AWS", null],
  ["Vercel", null],
  ["GitHub Actions", "CI/CD on GitHub"],
  ["Rust", null],
  ["Python", null],
  ["Go", null],
  ["GraphQL", null],
  ["Firebase", null],
  ["Vue", null],
  ["PHP", null],
  ["Laravel", "PHP web framework"],
];

const EXPERIENCES = [
  {
    companyName: "ConceptZero",
    companyLogo: "/seed/conceptzero.png",
    companyWebsite: "https://example.com",
    jobTitle: "Tech Lead",
    jobDescription:
      "Leading a team of six across web and infrastructure.\n\n- Moved the monolith to services behind a message queue\n- Cut deploy time from 40 to 6 minutes\n- Set up preview environments for every pull request",
    startedAt: "2024-02-01",
    endedAt: null,
    stack: [
      "TypeScript",
      "Next.js",
      "PostgreSQL",
      "OpenTofu",
      "RabbitMQ",
      "AWS",
    ],
  },
  {
    companyName: "AcadArena",
    companyLogo: "/seed/acadarena.png",
    companyWebsite: "https://example.com",
    jobTitle: "Senior Software Engineer",
    jobDescription:
      "Built the tournament platform used by campus esports leagues.\n\n- Designed bracket generation and live match reporting\n- Brought page load on the tournament hub under a second",
    startedAt: "2021-06-01",
    endedAt: "2024-01-31",
    stack: ["TypeScript", "React", "Node.js", "Redis", "GraphQL", "Firebase"],
  },
  {
    companyName: "Freelance",
    companyLogo: "/seed/freelance.png",
    companyWebsite: null,
    jobTitle: "Full-stack Developer",
    jobDescription:
      "Shipped storefronts, booking systems and internal tools for small businesses. Handled everything from the first call to hosting.",
    startedAt: "2019-09-01",
    endedAt: "2021-05-31",
    stack: ["Vue", "Laravel", "PHP", "PostgreSQL", "Docker"],
  },
  {
    companyName: "Northwind Labs",
    companyLogo: "/seed/northwind.png",
    companyWebsite: "https://example.com",
    jobTitle: "Software Engineer",
    jobDescription:
      "Worked on the reporting pipeline for a logistics dashboard. Wrote the first automated tests the team had.",
    startedAt: "2017-07-01",
    endedAt: "2019-08-31",
    stack: ["Python", "PostgreSQL", "React", "Docker"],
  },
  {
    companyName: "Northwind Labs",
    companyLogo: "/seed/northwind.png",
    companyWebsite: "https://example.com",
    jobTitle: "Software Engineering Intern",
    jobDescription:
      "Fixed bugs, wrote documentation, learned to read other people's code.",
    startedAt: "2016-11-01",
    endedAt: "2017-04-30",
    stack: ["PHP", "Vue"],
  },
];

const PROJECTS = [
  {
    name: "jspr.vc",
    slug: "jspr-vc",
    thumbnail: "/seed/project-jspr-vc.png",
    shortDescription:
      "This site. A full-stack portfolio with a dashboard, fully static with tagged caching.",
    date: "2023-07-01",
    stack: ["Next.js", "Drizzle", "PostgreSQL", "Tailwind CSS", "Vercel"],
  },
  {
    name: "rockfmt",
    slug: "rockfmt",
    thumbnail: "/seed/project-rockfmt.png",
    shortDescription: "A small code formatter written to learn Rust.",
    date: "2025-03-01",
    stack: ["Rust"],
  },
  {
    name: "flmnt",
    slug: "flmnt",
    thumbnail: "/seed/project-flmnt.png",
    shortDescription:
      "A filament database for 3D printing, with ironing calibration prints.",
    date: "2025-09-01",
    stack: ["Python", "PostgreSQL"],
  },
  {
    name: "bracketd",
    slug: "bracketd",
    thumbnail: "/seed/project-bracketd.png",
    shortDescription:
      "Tournament brackets as a service. Single and double elimination, round robin, **Swiss**.",
    date: "2022-04-01",
    stack: ["Go", "Redis", "GraphQL"],
  },
  {
    name: "tofu-modules",
    slug: "tofu-modules",
    thumbnail: "/seed/project-tofu-modules.png",
    shortDescription: "The OpenTofu modules I reuse across projects.",
    date: "2024-08-01",
    stack: ["OpenTofu", "AWS", "GitHub Actions"],
  },
];

const POSTS = [
  {
    slug: "cache-components",
    title: "Caching a portfolio with Cache Components",
    excerpt:
      "What changed when I moved this site to Next 16.4, and what broke on the way.",
    body: 'Every query on this site is a cached function with a tag.\n\n## A cached query\n\n```ts\nexport async function getPost(id: number) {\n  "use cache";\n  cacheTag(CacheTag.Post(id));\n  return db.query.posts.findFirst({ where: eq(posts.id, id) });\n}\n```\n\n> Saving in the dashboard expires the tag, so the page is fresh on the next request.\n\n## Numbers\n\n| Page | Before | After |\n| --- | --- | --- |\n| Home | 343 KB | 180 KB |\n\n1. Read from the cache\n2. Expire on write\n\nThat is the whole model. The hard part was finding everything that still rendered per request.',
    status: "published" as const,
    publishedAt: "2026-10-01",
  },
  {
    slug: "queues-before-services",
    title: "Put a queue in before you split the monolith",
    excerpt:
      "The order we did it in, and why I would do it the same way again.",
    body: "We added RabbitMQ six months before the first service left the monolith.\n\n## Why first\n\nA queue forces you to name the events. Once the events have names, the service boundaries are mostly drawn.\n\n```bash\ndocker compose up -d rabbitmq\n```\n\n- Events got names\n- Retries became someone's job\n- The first extraction took a week instead of a quarter",
    status: "published" as const,
    publishedAt: "2026-06-12",
  },
  {
    slug: "six-minute-deploys",
    title: "From 40 minute deploys to 6",
    excerpt:
      "Mostly caching, one embarrassing sleep, and deleting a test suite nobody trusted.",
    body: "Most of the time went to work that did not need to happen on every push.\n\n## What mattered\n\n1. Cache dependency installs\n2. Build once, promote the artifact\n3. Run slow tests on a schedule\n\n```yaml\n- uses: actions/cache@v4\n  with:\n    path: ~/.bun/install/cache\n    key: bun-lock\n```",
    status: "published" as const,
    publishedAt: "2025-11-03",
  },
  {
    slug: "rust-on-the-side",
    title: "Six months of Rust on the side",
    excerpt: "Notes from someone who writes TypeScript all day.",
    body: 'The borrow checker is a code reviewer who is always right and never tired.\n\n```rust\nfn main() {\n    let rock = String::from("thinking");\n    println!("{rock}");\n}\n```',
    status: "published" as const,
    publishedAt: "2025-04-20",
  },
  {
    slug: "arch-btw",
    title: "I use Arch, a status report",
    excerpt:
      "Four years in. What broke, what did not, and what I stopped tinkering with.",
    body: "Less broke than people told me it would.",
    status: "published" as const,
    publishedAt: "2024-12-01",
  },
  {
    slug: "draft-on-postgres-18",
    title: "Notes on Postgres 18",
    excerpt: "A draft. Visible only in the dashboard and its preview.",
    body: "`uuidv7()` is built in now.",
    status: "draft" as const,
    publishedAt: null,
  },
];

async function seedDev() {
  const host = process.env.POSTGRES_HOST ?? "";
  if (!["localhost", "127.0.0.1"].includes(host)) {
    throw new Error(`Refusing to seed demo data into "${host}"`);
  }

  await db.transaction(async (tx) => {
    await tx.execute(
      sql`truncate table ${users}, ${technologies} restart identity cascade`,
    );

    await tx.insert(users).values({
      id: USER_ID,
      name: "Jasper Vigo Concepcion",
      email: "dev@example.com",
      role: "admin",
    });

    const [portfolio] = await tx
      .insert(portfolios)
      .values({
        userId: USER_ID,
        name: "Jasper Vigo Concepcion",
        slug: "jasper",
        headline:
          "I write instructions to a rock that is tricked into thinking.",
        subheading:
          "Tech Lead / Software Engineer @ **ConceptZero**. Based in the Philippines.",
        about:
          "I write code, play video games and love tech.\n\nWhen I first used a computer I wanted to know how things are made from scratch, whether hardware or the pixels on a screen. That curiosity turned into a hobby, and the hobby turned into a job.\n\nThese days I focus on **DevOps, systems and infrastructure**, and I'm learning **Rust** on the side. This site is full stack, you can try it at [/dashboard](/dashboard).\n\nWhen I'm not programming I play competitive games, 3D print things I do not need, and use Arch and Neovim, btw.",
        publicEmail: "dev@example.com",
        socialLinks: {
          github: "https://github.com/jspr-vc",
          linkedin: "https://www.linkedin.com/in/jasper-concepcion/",
          twitter: "https://twitter.com/_manoki",
          website: "https://jspr.vc",
        },
      })
      .returning();

    await tx.insert(sessions).values({
      sessionToken: DEV_SESSION_TOKEN,
      userId: USER_ID,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    const tech = await tx
      .insert(technologies)
      .values(
        TECH.map(([name, description]) => ({
          name,
          slug: name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-"),
          description,
          status: "approved" as const,
          createdBy: USER_ID,
          updatedBy: USER_ID,
        })),
      )
      .returning();
    const techId = (name: string) => {
      const found = tech.find((item) => item.name === name);
      if (!found) throw new Error(`Unknown technology "${name}"`);
      return found.id;
    };

    for (const { stack, startedAt, endedAt, ...experience } of EXPERIENCES) {
      const [row] = await tx
        .insert(experiences)
        .values({
          ...experience,
          portfolioId: portfolio.id,
          startedAt: new Date(startedAt),
          endedAt: endedAt ? new Date(endedAt) : null,
        })
        .returning();
      await tx
        .insert(experienceTech)
        .values(
          stack.map((name) => ({ experienceId: row.id, techId: techId(name) })),
        );
    }

    for (const { stack, date, ...project } of PROJECTS) {
      const [row] = await tx
        .insert(projects)
        .values({
          ...project,
          body: "",
          portfolioId: portfolio.id,
          date: new Date(date),
        })
        .returning();
      await tx
        .insert(projectTech)
        .values(
          stack.map((name) => ({ projectId: row.id, techId: techId(name) })),
        );
    }

    await tx.insert(posts).values(
      POSTS.map(({ publishedAt, ...post }) => ({
        ...post,
        authorId: portfolio.id,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      })),
    );
  });
}

seedDev()
  .then(() => {
    console.log("Dev seed complete");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
