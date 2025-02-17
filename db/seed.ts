import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { db } from "./client";
import { type NewTechnologies, technologies } from "./schema";
dotenv.config({ path: ".env" });

/**
 * Seed the database with initial data
 */
async function seed() {
  // just technologies on top of my head
  // It'll have it's own admin panel
  const insertData: Omit<NewTechnologies, "updatedBy" | "createdBy">[] = [
    // Databases
    {
      name: "PostgreSQL",
      slug: "postgresql",
    },

    {
      name: "MySQL",
      slug: "mysql",
    },
    {
      name: "MongoDB",
      slug: "mongodb",
    },
    {
      name: "Firestore",
      slug: "firestore",
    },
    {
      name: "Firebase Realtime Database",
      slug: "firebase-rtdb",
    },
    {
      name: "Supabase",
      slug: "supabase",
    },
    {
      name: "Planetscale",
      slug: "planetscale",
    },
    {
      name: "SQLite",
      slug: "sqlite",
    },
    {
      name: "Vercel Postgres",
      slug: "vercel-postgres",
    },
    {
      name: "Cockroach DB",
      slug: "cockroachdb",
    },

    // ORMs
    {
      name: "Prisma",
      slug: "prisma",
    },
    {
      name: "TypeORM",
      slug: "typeorm",
    },
    {
      name: "drizzle-orm",
      slug: "drizzle-orm",
    },
    {
      name: "sequelize",
      slug: "sequelize",
    },

    // Languages
    {
      name: "TypeScript",
      slug: "typescript",
    },
    {
      name: "JavaScript",
      slug: "javascript",
    },
    {
      name: "Python",
      slug: "python",
    },
    {
      name: "Go Lang",
      slug: "go-lang",
    },
    {
      name: "Rust",
      slug: "rust",
    },
    {
      name: "Java",
      slug: "java",
    },
    {
      name: "C",
      slug: "c",
    },
    {
      name: "C#",
      slug: "c-sharp",
    },
    {
      name: "C++",
      slug: "c-plus-plus",
    },
    {
      name: "PHP",
      slug: "php",
    },
    {
      name: "Zig",
      slug: "zig",
    },
    {
      name: "Ruby",
      slug: "ruby",
    },
    {
      name: "Kotlin",
      slug: "kotlin",
    },
    {
      name: "Swift",
      slug: "swift",
    },
    {
      name: "Dart",
      slug: "dart",
    },

    // Infrastructure
    {
      name: "Vercel",
      slug: "vercel",
    },
    {
      name: "Netlify",
      slug: "netlify",
    },
    {
      name: "AWS Lambda",
      slug: "aws-lambda",
    },
    {
      name: "AWS EC2",
      slug: "aws-ec2",
    },
    {
      name: "AWS S3",
      slug: "aws-s3",
    },
    {
      name: "AWS RDS",
      slug: "aws-rds",
    },
    {
      name: "AWS DynamoDB",
      slug: "aws-dynamodb",
    },
    {
      name: "AWS Cloudformation",
      slug: "aws-cloudformation",
    },
    {
      name: "Terraform",
      slug: "terraform",
    },
    {
      name: "Digital Ocean",
      slug: "digital-ocean",
    },
    {
      name: "Google Cloud Platform",
      slug: "gcp",
    },
    {
      name: "Docker",
      slug: "docker",
    },
    {
      name: "Kubernetes",
      slug: "kubernetes",
    },

    // Frameworks
    // Frontend
    {
      name: "React",
      slug: "react",
    },
    {
      name: "NextJS",
      slug: "nextjs",
    },
    {
      name: "Gatsby",
      slug: "gatsby",
    },
    {
      name: "Vue",
      slug: "vue",
    },
    {
      name: "NuxtJS",
      slug: "nuxtjs",
    },
    {
      name: "Svelte",
      slug: "svelte",
    },
    {
      name: "Angular",
      slug: "angular",
    },
    {
      name: "SolidJS",
      slug: "solidjs",
    },
    {
      name: "Astro",
      slug: "astro",
    },

    // Backend
    {
      name: "Express",
      slug: "express",
    },
    {
      name: "Fastify",
      slug: "fastify",
    },
    {
      name: "NestJS",
      slug: "nestjs",
    },

    // Tools and utilities
    {
      name: "tRPC",
      slug: "trpc",
    },
    {
      name: "SWR",
      slug: "swr",
    },
    {
      name: "Tanstack Query",
      slug: "tanstack-query",
    },
    {
      name: "Vite",
      slug: "vite",
    },
    {
      name: "Snowpack",
      slug: "snowpack",
    },
    {
      name: "ESBuild",
      slug: "esbuild",
    },
    {
      name: "Webpack",
      slug: "webpack",
    },

    // UI
    {
      name: "TailwindCSS",
      slug: "tailwindcss",
    },
    {
      name: "Chakra UI",
      slug: "chakra-ui",
    },
    {
      name: "Material UI",
      slug: "mui",
    },
    {
      name: "Ant Design",
      slug: "ant-design",
    },
    {
      name: "Mantine",
      slug: "mantine",
    },
    {
      name: "Radix Primitives",
      slug: "radix-ui",
    },
    {
      name: "shadcn/ui",
      slug: "shadcn-ui",
    },
  ];

  try {
    const data: NewTechnologies[] = insertData.map((data) => {
      return Object.assign(data, {
        status: "approved",
        updatedBy: "-1",
        createdBy: "-1",
      });
    });

    await db.transaction(async (tx) => {
      try {
        await tx
          .insert(technologies)
          .values(data)
          .onConflictDoNothing({
            target: [technologies.slug],
          });
      } catch (e) {
        console.log(e);
        tx.rollback();
      }
    });
  } catch (e) {
    return {
      message: (e as { message: string })?.message,
      success: false,
    };
  }

  return { success: true };
}

seed()
  .then((res) => {
    console.log(res);
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
