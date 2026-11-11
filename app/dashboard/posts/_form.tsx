"use client";
import {
  IconGitPullRequestDraft,
  IconLoader2,
  IconSend,
} from "@tabler/icons-react";
import { useStore } from "@tanstack/react-form";
import { format } from "date-fns";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import type { z } from "zod";
import { SaveStatus, useAppForm, useSaveStatus } from "@/components/form";
import { Button } from "@/components/ui/button";
import type { Post } from "@/db/schema";
import { slugify } from "@/lib/format";
import { insertPostSchema } from "@/lib/validators";
import type { GetPost } from "@/queries";
import { upsertPost } from "@/server/server-actions";
import { setPostStatus } from "@/server/server-actions/post-actions";

type Values = z.input<typeof insertPostSchema>;
type Saved = Pick<
  Post,
  "id" | "title" | "excerpt" | "body" | "slug" | "thumbnail" | "status"
>;

interface Props {
  post?: GetPost;
  portfolioId: number;
}

function toValues(portfolioId: number, post?: Saved): Values {
  return {
    id: post?.id,
    authorId: portfolioId,
    title: post?.title ?? "",
    excerpt: post?.excerpt ?? "",
    body: post?.body ?? "",
    slug: post?.slug ?? "",
    thumbnail: post?.thumbnail ?? "",
    status: post?.status ?? "draft",
  };
}

export function PostForm({ post, portfolioId }: Props) {
  const router = useRouter();
  const isEdit = Boolean(post);
  const save = useSaveStatus();
  const form = useAppForm({
    defaultValues: toValues(portfolioId, post),
    validators: { onSubmit: insertPostSchema },
    // Submitting with a status publishes or unpublishes; without one it saves.
    onSubmitMeta: {} as { status?: Post["status"] },
    onSubmit: ({ value, formApi, meta }) =>
      save.run(formApi, value, async (values) => {
        const data = insertPostSchema.parse(values);
        const saved = meta.status
          ? await setPostStatus(data, meta.status)
          : await upsertPost(data);
        formApi.reset(toValues(portfolioId, saved));

        if (!isEdit) {
          router.push(`/dashboard/posts/${saved.id}/edit`);
        }
      }),
  });

  const status = useStore(form.store, (state) => state.values.status);
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit({});
      }}
    >
      <form.AppForm>
        <form.AppField
          name="title"
          listeners={{
            // A new post's slug follows its title until the slug is edited.
            onChange: ({ value }) => {
              if (!isEdit && !form.getFieldMeta("slug")?.isDirty) {
                form.setFieldValue("slug", slugify(value), {
                  dontUpdateMeta: true,
                });
              }
            },
          }}
        >
          {(field) => <field.TextField label="Title" />}
        </form.AppField>
        <form.AppField name="slug">
          {(field) => (
            <field.TextField
              label="Slug"
              description="The post's address: /posts/your-slug"
            />
          )}
        </form.AppField>
        <form.AppField name="body">
          {(field) => (
            <field.TextareaField
              label="Body"
              description="Markdown supported."
              inputClassName="min-h-96 font-mono"
            />
          )}
        </form.AppField>
        <form.AppField name="excerpt">
          {(field) => (
            <field.TextareaField
              label="Excerpt"
              description="One or two sentences shown under the title and in link previews."
            />
          )}
        </form.AppField>
        <form.AppField name="thumbnail">
          {(field) => (
            <field.ImageUploadField
              label="Thumbnail"
              description="Shown at the top of the post."
            />
          )}
        </form.AppField>
        <div className="flex flex-wrap items-center justify-end gap-4">
          <SaveStatus
            state={save.state}
            failure="Could not save. If you changed the slug, it may already be taken."
          />
          {post?.publishedAt && (
            <NextLink href={`/posts/${post.slug}`} className="link text-sm">
              Published {format(post.publishedAt, "MMMM d, yyyy")}
            </NextLink>
          )}
          {post?.status === "draft" && isEdit && (
            <NextLink
              href={`/posts/preview/${post.id}`}
              className="link text-sm"
            >
              Preview post
            </NextLink>
          )}
          <form.SubmitButton variant={isEdit ? "secondary" : "default"}>
            {post ? "Save changes" : "Save as draft"}
          </form.SubmitButton>
          {isEdit && (
            <Button
              type="button"
              size="lg"
              disabled={isSubmitting}
              onClick={() =>
                form.handleSubmit({
                  status: status === "published" ? "draft" : "published",
                })
              }
            >
              {isSubmitting ? (
                <IconLoader2 className="animate-spin" />
              ) : status === "published" ? (
                <IconGitPullRequestDraft />
              ) : (
                <IconSend />
              )}
              {status === "published" ? "Convert to draft" : "Publish"}
            </Button>
          )}
        </div>
      </form.AppForm>
    </form>
  );
}
