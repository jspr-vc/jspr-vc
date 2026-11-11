import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import {
  experiences,
  portfolios,
  posts,
  projects,
  technologies,
} from "@/db/schema";

const emptyString = z.literal("");
// An uploaded file URL, or a file served from this site's own /public folder.
const imageUrl = z.url().or(z.string().startsWith("/"));
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const prependedUrl = (url: string) =>
  z
    .string()
    .url()
    .startsWith(`https://${url}`)
    .or(z.string().url().startsWith(`https://www.${url}`));

const socialLinksSchema = z.object({
  github: prependedUrl("github.com").or(emptyString).optional(),
  linkedin: prependedUrl("linkedin.com").or(emptyString).optional(),
  twitter: prependedUrl("twitter.com").or(emptyString).optional(),
  website: z.string().url().optional().or(emptyString).optional(),
  publicResume: z.string().url().optional().or(emptyString),
});

export const updatePortfolioSchema = createInsertSchema(portfolios, {
  userId: (userId) => userId.optional(),
  publicEmail: (publicEmail) => publicEmail.email().or(emptyString),
  slug: (slug) => slug.regex(slugRegex),
  headline: (headline) => headline.max(255),
  subheading: (subheading) => subheading.max(255),
  name: (name) => name.max(255),
  socialLinks: socialLinksSchema,
});

export const insertExperienceSchema = createInsertSchema(experiences, {
  companyName: (companyName) => companyName.min(3).max(255),
  jobTitle: (jobTitle) => jobTitle.min(3).max(255),
  jobDescription: (jobDescription) => jobDescription.max(2048),
  companyWebsite: (companyWebsite) => companyWebsite.url().or(emptyString),
  companyLogo: () => imageUrl.or(emptyString).nullish(),
})
  .extend({
    stack: z.array(z.number().positive()),
  })
  .refine((exp) => !exp.endedAt || exp.startedAt < exp.endedAt, {
    path: ["endedAt"],
    message: "End date must be after the start date",
  });

export const insertTechnologiesSchema = createInsertSchema(technologies, {
  slug: (slug) => slug.min(1).regex(slugRegex),
  name: (name) => name.min(1).max(255),
  description: (description) => description.max(2048),
  icon: (icon) => icon.url().or(z.literal("")),
  createdAt: (createdAt) => createdAt.optional(),
  updatedAt: (updatedAt) => updatedAt.optional(),
  createdBy: (createdBy) => createdBy.optional(),
  updatedBy: (updatedBy) => updatedBy.optional(),
});

export const insertProjectSchema = createInsertSchema(projects, {
  slug: (slug) => slug.min(1).regex(slugRegex),
  name: (name) => name.min(1).max(255),
  thumbnail: () => imageUrl.or(emptyString).nullish(),
  link: () => z.url().or(emptyString).nullish(),
  body: (body) => body.max(10000),
}).extend({
  stack: z.array(z.number().positive()),
});

export const insertPostSchema = createInsertSchema(posts, {
  slug: (slug) => slug.min(1).regex(slugRegex),
  title: (title) => title.min(1).max(255),
  thumbnail: (thumbnail) => thumbnail.url().or(emptyString),
  body: (body) => body.max(10000),
});

export type UpdatePortfolioSchema = z.infer<typeof updatePortfolioSchema>;
export type InsertTechnologiesSchema = z.infer<typeof insertTechnologiesSchema>;
export type InsertExperienceSchema = z.infer<typeof insertExperienceSchema>;
export type InsertProjectSchema = z.infer<typeof insertProjectSchema>;
export type InsertPostSchema = z.infer<typeof insertPostSchema>;
