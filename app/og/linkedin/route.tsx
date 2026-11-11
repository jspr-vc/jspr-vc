import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { handles, og, ogFonts, plainText } from "../_shared";

// LinkedIn covers the left of the banner with the profile photo, so the
// content is set against the right edge.
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
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "0 80px",
        color: og.bone,
        backgroundColor: og.ink,
        fontFamily: "Geist",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          maxWidth: 1000,
        }}
      >
        <div
          style={{
            fontFamily: "Geist Mono",
            fontSize: 22,
            color: og.ash,
            marginBottom: 10,
          }}
        >
          {url}
        </div>
        <div
          style={{
            fontWeight: 600,
            fontSize: 76,
            letterSpacing: "-0.045em",
            lineHeight: 1.05,
            textAlign: "right",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: "Geist Mono",
            fontSize: 26,
            color: og.fog,
            textAlign: "right",
            marginTop: 14,
          }}
        >
          {plainText(headline)}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 32,
            marginTop: 30,
            fontFamily: "Geist Mono",
            fontSize: 20,
            color: og.ash,
          }}
        >
          {links.map((link) => (
            <span key={link}>{link}</span>
          ))}
        </div>
      </div>
    </div>,
    { width: 1584, height: 396, fonts: await ogFonts() },
  );
}
