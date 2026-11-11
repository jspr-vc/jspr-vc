import rehypeShiki from "@shikijs/rehype";
import { cacheLife } from "next/cache";
import type { ComponentProps } from "react";
import ReactMarkdown, { type Components, MarkdownAsync } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

const components: Components = {
  img: ({ node, ...props }) => (
    // biome-ignore lint/performance/noImgElement: markdown renders arbitrary external image URLs; next/image is unsuitable here
    <img {...props} alt={props.alt ?? ""} loading="lazy" />
  ),
};

const headingsAsText: Components = {
  h1: "p",
  h2: "p",
  h3: "p",
  h4: "p",
  h5: "p",
  h6: "p",
};

interface MarkdownProps extends ComponentProps<"div"> {
  content: string;
  headings?: boolean;
}

/*
 * Markdown rendered on the server. Nothing here ships to the browser.
 */
export function Markdown({
  content,
  headings = true,
  className,
  ...props
}: MarkdownProps) {
  return (
    <div className={cn("prose", className)} {...props}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={
          headings ? components : { ...components, ...headingsAsText }
        }
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/*
 * Same as Markdown, with fenced code highlighted by shiki. Highlighting loads
 * grammars asynchronously, so the output is cached per content.
 */
export async function MarkdownWithCode({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  "use cache";
  cacheLife("max");

  return (
    <div className={cn("prose", className)}>
      <MarkdownAsync
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          [
            rehypeShiki,
            {
              themes: { light: "github-light", dark: "vesper" },
              fallbackLanguage: "text",
            },
          ],
        ]}
        components={components}
      >
        {content}
      </MarkdownAsync>
    </div>
  );
}
