/*
 * One-off: points every stored UploadThing URL at its copy on Vercel Blob.
 * The files were copied beforehand; key-to-blob-url.json maps each
 * UploadThing file key to its new URL.
 *
 *   bun ./db/uploadthing-migration/rewrite-urls.ts           # dry run
 *   bun ./db/uploadthing-migration/rewrite-urls.ts --apply   # write
 *
 * Runs against POSTGRES_URL. Safe to run again: rewritten rows no longer match.
 */
import { sql } from "drizzle-orm";
import { db } from "../client";
import mapping from "./key-to-blob-url.json";

const blobUrls: Record<string, string> = mapping;
const apply = process.argv.includes("--apply");

// Columns that hold an image URL, or markdown that may embed one.
const COLUMNS: [table: string, idColumn: string, column: string][] = [
  ["experiences", "id", "company_logo"],
  ["experiences", "id", "job_description"],
  ["projects", "id", "thumbnail"],
  ["projects", "id", "body"],
  ["projects", "id", "short_description"],
  ["posts", "id", "thumbnail"],
  ["posts", "id", "body"],
  ["technologies", "id", "icon"],
  ["portfolios", "id", "about"],
  ["portfolios", "id", "headline"],
  ["portfolios", "id", "subheading"],
  ["uploads", "id", "url"],
];

const UPLOADTHING_URL =
  /https?:\/\/(?:[a-z0-9-]+\.)?(?:utfs\.io|ufs\.sh|uploadthing\.com)\/f\/([A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*)/g;

async function main() {
  let rewritten = 0;
  const unmapped = new Set<string>();

  await db.transaction(async (tx) => {
    for (const [table, idColumn, column] of COLUMNS) {
      const rows = await tx.execute<{ id: number; value: string }>(
        sql`select ${sql.identifier(idColumn)} as id, ${sql.identifier(column)} as value
            from ${sql.identifier(table)}
            where ${sql.identifier(column)} ~ '(utfs\\.io|ufs\\.sh|uploadthing\\.com)/f/'`,
      );

      for (const row of rows) {
        const next = row.value.replace(UPLOADTHING_URL, (url, key: string) => {
          if (!blobUrls[key]) {
            unmapped.add(url);
            return url;
          }
          return blobUrls[key];
        });
        if (next === row.value) continue;

        rewritten++;
        console.log(`${table}.${column} #${row.id}`);
        if (apply) {
          await tx.execute(
            sql`update ${sql.identifier(table)}
                set ${sql.identifier(column)} = ${next}
                where ${sql.identifier(idColumn)} = ${row.id}`,
          );
        }
      }
    }
  });

  console.log(
    `${apply ? "Rewrote" : "Would rewrite"} ${rewritten} values. ${unmapped.size} URLs have no Blob copy.`,
  );
  for (const url of unmapped) console.log(`  no copy: ${url}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
