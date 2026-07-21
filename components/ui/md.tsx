import type { ComponentProps } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
} from "./typography";

export const commonMdComponents: Components = {
  p: ({ node, ...props }) => <p className="mt-4" {...props} />,
  a: ({ node, ...props }) => <a className="text-blue-400" {...props} />,
  li: ({ node, ...props }) => <li className="mb-2" {...props} />,
  pre: ({ node, ...props }) => (
    <pre {...props} className="bg-card/30! border border-muted shadow-sm" />
  ),
  img: ({ node, ...props }) => (
    // biome-ignore lint/performance/noImgElement: markdown renders arbitrary external image URLs; next/image is unsuitable here
    <img
      {...props}
      style={{ maxHeight: 512, ...props.style }}
      alt={props.alt}
    />
  ),
};

export interface MarkdownProps
  extends Omit<ComponentProps<typeof ReactMarkdown>, "children"> {
  content: string;
}

export function Markdown({ content, ...props }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, ...(props.remarkPlugins ?? [])]}
      components={{
        h1: ({ node, ...props }) => <TypographyH1 {...props} />,
        h2: ({ node, ...props }) => <TypographyH2 {...props} />,
        h3: ({ node, ...props }) => <TypographyH3 {...props} />,
        h4: ({ node, ...props }) => <TypographyH4 {...props} />,
        ...commonMdComponents,
        ...props.components,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export function MarkdownNoHeadings({ content, ...props }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, ...(props.remarkPlugins ?? [])]}
      components={{
        h1: "p",
        h2: "p",
        h3: "p",
        h4: "p",
        h5: "p",
        h6: "p",
        ...commonMdComponents,
        ...props.components,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
