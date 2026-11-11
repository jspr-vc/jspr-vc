import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { J_PATH, PEBBLE_PATH } from "@/components/brand/logo";
import { socialHandle } from "@/lib/format";

export const og = {
  ink: "#0C0C0B",
  graphite: "#1C1C1A",
  ash: "#8A8A85",
  fog: "#C9C9C3",
  bone: "#EDEDE8",
  signal: "#D4FF3A",
} as const;

const font = (file: string) => readFile(join(process.cwd(), "assets", file));

export async function ogFonts() {
  const [sans, mono] = await Promise.all([
    font("Geist-SemiBold.ttf"),
    font("GeistMono-Regular.ttf"),
  ]);
  return [
    { name: "Geist", weight: 600 as const, data: sans },
    { name: "Geist Mono", weight: 400 as const, data: mono },
  ];
}

export function OgMark({ size }: { size: number }) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: rendered to a PNG by satori, which would draw the title as text
    <svg width={size} height={size} viewBox="0 0 100 100">
      <rect width="100" height="100" rx="22" fill={og.graphite} />
      <g transform="translate(13 0)">
        <path d={PEBBLE_PATH} fill={og.signal} />
        <path d={J_PATH} fill={og.bone} />
      </g>
    </svg>
  );
}

export function plainText(markdown: string) {
  return markdown
    .replaceAll("**", "")
    .replaceAll("__", "")
    .replaceAll("~~", "")
    .replaceAll(/\[(.*)\]\(.*\)/g, "$1");
}

export function handles(urls: string[]) {
  return urls.filter(Boolean).map(socialHandle);
}
