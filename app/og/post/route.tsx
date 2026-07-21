import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const interBold = fetch(
  new URL("../../../assets/Inter-Bold.ttf", import.meta.url),
).then((res) => res.arrayBuffer());

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.nextUrl);

  const title = searchParams.get("title") ?? "";
  const slug = searchParams.get("slug") ?? "";
  const author = searchParams.get("author") ?? "";
  const excerpt = searchParams.get("excerpt") ?? "";

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "4rem 6rem",
        color: "white",
        backgroundColor: "#000",
        backgroundImage:
          "radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 100% 80%, rgba(255,255,255,0.1) 0%, transparent 100%)",
        backgroundSize: "50px 50px, 100% 100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "1rem",
          right: "1rem",
          fontSize: 18,
          marginBottom: 5,
          color: "rgba(255,255,255,0.5)",
        }}
      >
        {`${process.env.NEXT_PUBLIC_URL}/posts/${slug}`}
      </div>
      <div
        style={{
          fontWeight: 800,
          lineHeight: 1,
          fontSize: 70,
        }}
      >
        {title}
      </div>
      {excerpt && (
        <div
          style={{
            fontSize: 30,
            fontWeight: 300,
            color: "rgba(255,255,255,0.5)",
            padding: "1rem 0",
          }}
        >
          {excerpt}
        </div>
      )}
      <div
        style={{
          fontSize: 30,
          fontWeight: 300,
        }}
      >
        {`— ${author}`}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
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
