import { type InferModel, relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { portfolios } from "./portfolio";

export const postStatus = pgEnum("post_status", [
  "draft",
  "published",
  "archived",
]);
export const posts = pgTable("posts", {
  id: serial("id").primaryKey().notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),
  excerpt: varchar("excerpt", { length: 350 }),
  thumbnail: varchar("thumbnail", { length: 2048 }),
  status: postStatus("status").notNull().default("draft"),
  authorId: integer("author_id")
    .notNull()
    .references(() => portfolios.id, { onDelete: "cascade" }),
  publishedAt: timestamp("published_at", { mode: "date" }),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(portfolios, {
    fields: [posts.authorId],
    references: [portfolios.id],
  }),
}));

export type Post = InferModel<typeof posts>;
export type NewPost = InferModel<typeof posts, "insert">;
