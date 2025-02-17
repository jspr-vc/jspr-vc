import { db } from "@/db/client";
import { uploads } from "@/db/schema/upload";
import { authOptions } from "@/server/auth-options";
import { getServerSession } from "next-auth";
import { type FileRouter, createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.insert(uploads).values({
        name: file.name,
        size: file.size,
        key: file.key,
        url: file.url,
        ownerId: metadata.userId,
      });
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
