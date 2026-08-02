import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { GithubIcon } from "../portfolio/_github_icon";
import { LinkIcon } from "../portfolio/_link_icon";
import { LinkedinIcon } from "../portfolio/_linkedin_icon";
import { TwitterIcon } from "../portfolio/_twitter_icon";

export const runtime = "edge";

const interBold = fetch(
  new URL("../../../assets/Inter-Bold.ttf", import.meta.url),
).then((res) => res.arrayBuffer());

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.nextUrl);

  const name = searchParams.get("name") ?? "";
  const url = searchParams.get("url") ?? "";
  const headline = searchParams.get("headline") ?? "";
  const github = searchParams.get("github") ?? "";
  const linkedin = searchParams.get("linkedin") ?? "";
  const twitter = searchParams.get("twitter") ?? "";
  const website = searchParams.get("website") ?? "";

  const handle = (value: string) =>
    value.replace(new RegExp(/https?:\/\//), "").replace(/\/$/g, "");

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "0 5rem",
        color: "white",
        backgroundColor: "#000",
        backgroundImage:
          "radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 100% 80%, rgba(255,255,255,0.1) 0%, transparent 100%)",
        backgroundSize: "50px 50px, 100% 100%",
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
            fontSize: 22,
            fontFamily: "Inter",
            color: "rgba(255,255,255,0.5)",
            marginBottom: 4,
          }}
        >
          {url}
        </div>
        <div
          style={{
            fontWeight: 800,
            fontSize: 76,
            lineHeight: 1.1,
            fontFamily: "Inter",
            textAlign: "right",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 300,
            color: "rgba(255,255,255,0.75)",
            textAlign: "right",
            marginTop: 8,
          }}
        >
          {headline
            .replaceAll("**", "")
            .replaceAll("__", "")
            .replaceAll("~~", "")
            .replaceAll(/\[(.*)\]\(.*\)/g, "$1")}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "2rem",
            marginTop: 28,
          }}
        >
          {github && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <GithubIcon />
              <div style={{ fontSize: 20, color: "rgba(255,255,255,0.5)" }}>
                {github.replace(new RegExp(/.*\.com\//), "").replace(/\/$/, "")}
              </div>
            </div>
          )}
          {linkedin && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <LinkedinIcon />
              <div style={{ fontSize: 20, color: "rgba(255,255,255,0.5)" }}>
                {linkedin
                  .replace(new RegExp(/.*\.com\//), "")
                  .replace(/\/$/g, "")}
              </div>
            </div>
          )}
          {twitter && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <TwitterIcon />
              <div style={{ fontSize: 20, color: "rgba(255,255,255,0.5)" }}>
                {twitter
                  .replace(new RegExp(/.*\.com\//), "")
                  .replace(/\/$/g, "")}
              </div>
            </div>
          )}
          {website && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <LinkIcon />
              <div style={{ fontSize: 20, color: "rgba(255,255,255,0.5)" }}>
                {handle(website)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    {
      width: 1584,
      height: 396,
      fonts: [
        {
          name: "Inter",
          weight: 800,
          data: await interBold,
        },
      ],
    },
  );
}
