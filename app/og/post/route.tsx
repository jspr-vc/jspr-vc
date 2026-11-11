import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { OgMark, og, ogFonts } from "../_shared";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.nextUrl);

  const title = searchParams.get("title") ?? "";
  const slug = searchParams.get("slug") ?? "";
  const author = searchParams.get("author") ?? "";
  const excerpt = searchParams.get("excerpt") ?? "";
  const host = (process.env.NEXT_PUBLIC_URL ?? "").replace(/^https?:\/\//, "");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        color: og.bone,
        backgroundColor: og.ink,
        fontFamily: "Geist",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <OgMark size={72} />
        <div style={{ fontFamily: "Geist Mono", fontSize: 22, color: og.ash }}>
          {`${host}/posts/${slug}`}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: title.length > 60 ? 56 : 68,
            letterSpacing: "-0.045em",
            lineHeight: 1.05,
          }}
        >
          {title}
        </div>
        {excerpt && (
          <div style={{ fontSize: 28, lineHeight: 1.35, color: og.fog }}>
            {excerpt.length > 140 ? `${excerpt.slice(0, 139)}…` : excerpt}
          </div>
        )}
      </div>
      <div style={{ fontFamily: "Geist Mono", fontSize: 22, color: og.ash }}>
        {author}
      </div>
    </div>,
    { width: 1200, height: 630, fonts: await ogFonts() },
  );
}
