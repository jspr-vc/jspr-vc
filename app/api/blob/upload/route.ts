import { type HandleUploadBody, handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { db } from "@/db/client";
import { uploads } from "@/db/schema/upload";
import { IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/upload-rules";
import { authOptions } from "@/server/auth-options";

const payloadSchema = z.object({
  userId: z.string(),
  name: z.string(),
  size: z.number(),
});
const clientSchema = payloadSchema.omit({ userId: true });

/*
 * Issues short-lived tokens so the browser can upload straight to Vercel
 * Blob, and records each finished upload. Blob calls back here when an
 * upload completes; that callback cannot reach a localhost server.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
          throw new Error("Unauthorized");
        }
        const file = clientSchema.parse(JSON.parse(clientPayload ?? "{}"));

        return {
          allowedContentTypes: IMAGE_TYPES,
          maximumSizeInBytes: MAX_IMAGE_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ ...file, userId: session.user.id }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const file = payloadSchema.parse(JSON.parse(tokenPayload ?? "{}"));
        await db
          .insert(uploads)
          .values({
            name: file.name,
            size: file.size,
            key: blob.pathname,
            url: blob.url,
            ownerId: file.userId,
          })
          .onConflictDoNothing({ target: uploads.key });
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    );
  }
}
