import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { handles, OgMark, og, ogFonts, plainText } from "../_shared";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.nextUrl);

  const name = searchParams.get("name") ?? "";
  const url = searchParams.get("url") ?? "";
  const headline = searchParams.get("headline") ?? "";
  const links = handles([
    searchParams.get("github") ?? "",
    searchParams.get("linkedin") ?? "",
    searchParams.get("twitter") ?? "",
    searchParams.get("website") ?? "",
  ]);

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
          {url}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 76,
            letterSpacing: "-0.045em",
            lineHeight: 1.02,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: "Geist Mono",
            fontSize: 28,
            lineHeight: 1.35,
            color: og.fog,
          }}
        >
          {plainText(headline)}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 32,
          fontFamily: "Geist Mono",
          fontSize: 20,
          color: og.ash,
        }}
      >
        {links.map((link) => (
          <span key={link}>{link}</span>
        ))}
      </div>
    </div>,
    { width: 1200, height: 630, fonts: await ogFonts() },
  );
}
