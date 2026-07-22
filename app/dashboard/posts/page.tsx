import { IconCirclePlus } from "@tabler/icons-react";
import { format } from "date-fns";
import NextLink from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TypographyH3,
  TypographyLarge,
  TypographySmall,
} from "@/components/ui/typography";
import { getPostsByAuthorId } from "@/queries";
import { authOptions } from "@/server/auth-options";

export default async function PostDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/sign-in");
  }

  const posts = await getPostsByAuthorId(session.user.portfolioId);

  return (
    <div className="flex flex-col gap-4">
      <TypographyH3 className="leading-none">Posts</TypographyH3>
      <TypographySmall>
        You can also refer to this as blog posts
      </TypographySmall>
      {posts.map((post) => (
        <NextLink key={post.id} href={`/dashboard/posts/${post.id}/edit`}>
          <Card className="flex flex-col h-full cursor-pointer border border-muted hover:border-muted-foreground/30 transition">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">{post.excerpt}</CardContent>
            <CardFooter>{format(post.createdAt, "MMMM dd, yyyy")}</CardFooter>
          </Card>
        </NextLink>
      ))}

      <NextLink href="/dashboard/posts/add">
        <Card className="h-full flex items-center justify-center border border-muted hover:border-muted-foreground/30 transition">
          <div className="flex items-center gap-2 py-4">
            <IconCirclePlus className="w-4 h-4" />
            <TypographyLarge className="inline">Create Post</TypographyLarge>
          </div>
        </Card>
      </NextLink>
    </div>
  );
}
