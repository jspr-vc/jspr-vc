"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconDeviceFloppy,
  IconGitPullRequestDraft,
  IconLoader2,
  IconSend,
} from "@tabler/icons-react";
import { format } from "date-fns";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TypographySmall } from "@/components/ui/typography";
import type { Post } from "@/db/schema";
import { insertPostSchema } from "@/lib/validators";
import type { GetPost } from "@/queries";
import { upsertPost } from "@/server/server-actions";
import { setPostStatus } from "@/server/server-actions/post-actions";

interface Props {
  post?: GetPost;
  portfolioId: number;
}

export function PostForm({ post, portfolioId }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const postForm = useForm({
    resolver: zodResolver(insertPostSchema),
    defaultValues: {
      id: post?.id,
      authorId: portfolioId,
      title: post?.title ?? "",
      excerpt: post?.excerpt ?? "",
      body: post?.body ?? "",
      slug: post?.slug ?? "",
      thumbnail: post?.thumbnail ?? "",
      status: post?.status ?? "draft",
    },
  });

  const status = postForm.watch("status");

  const isEdit = Boolean(post);
  const saveAsDraft = postForm.handleSubmit((values) => {
    startTransition(async () => {
      const newPost = await upsertPost(values);
      postForm.reset({
        id: newPost.id,
        authorId: portfolioId,
        title: newPost.title,
        excerpt: newPost.excerpt ?? "",
        body: newPost.body,
        slug: newPost.slug,
        thumbnail: newPost.thumbnail ?? "",
        status: newPost.status,
      });

      if (!isEdit) {
        router.push(`/dashboard/posts/${newPost.id}/edit`);
      }
    });
  }, console.error);

  const updateStatus = (status: Post["status"]) =>
    postForm.handleSubmit((post) => {
      startTransition(async () => {
        const newPost = await setPostStatus(post, status);
        postForm.reset({
          id: newPost.id,
          authorId: portfolioId,
          title: newPost.title,
          excerpt: newPost.excerpt ?? "",
          body: newPost.body,
          slug: newPost.slug,
          thumbnail: newPost.thumbnail ?? "",
          status: newPost.status,
        });
      });
    });

  return (
    <Form {...postForm}>
      <div className="flex flex-col gap-4">
        <form>
          <div className="flex flex-col gap-4">
            <FormField
              control={postForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={postForm.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={postForm.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[400px]" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>Markdown supported.</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={postForm.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
        <div className="flex justify-end items-center gap-4">
          {post?.publishedAt && (
            <NextLink href={`/posts/${post.slug}`}>
              <TypographySmall className="leading-none cursor-pointer text-blue-400">
                Published at {format(post.publishedAt, "MMMM dd, yyyy")}
              </TypographySmall>
            </NextLink>
          )}
          {post?.status === "draft" && isEdit && (
            <NextLink href={`/posts/preview/${post.id}`}>
              <TypographySmall className="leading-none cursor-pointer text-blue-400">
                Preview post
              </TypographySmall>
            </NextLink>
          )}
          <Button disabled={pending} onClick={saveAsDraft} variant="secondary">
            {pending ? (
              <IconLoader2 className="animate-spin mr-2 w-5 h-5" />
            ) : (
              <IconDeviceFloppy className="mr-2 w-5 h-5" />
            )}
            {post ? "Save" : "Save as draft"}
          </Button>
          {isEdit && (
            <Button
              disabled={pending}
              onClick={updateStatus(
                status === "published" ? "draft" : "published",
              )}
            >
              {pending ? (
                <IconLoader2 className="animate-spin mr-2 w-5 h-5" />
              ) : status === "published" ? (
                <IconGitPullRequestDraft className="mr-2 w-5 h-5" />
              ) : (
                <IconSend className="mr-2 w-5 h-5" />
              )}
              {status === "published" ? "Convert to draft" : "Publish"}
            </Button>
          )}
        </div>
      </div>
    </Form>
  );
}
