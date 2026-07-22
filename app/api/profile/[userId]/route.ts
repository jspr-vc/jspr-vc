import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { portfolios } from "@/db/schema";

interface Props {
  params: Promise<{
    userId: string;
  }>;
}

export async function GET(_: Request, props: Props) {
  const params = await props.params;
  const portfolio = await db.query.portfolios.findFirst({
    where: eq(portfolios.userId, params.userId),
  });

  if (!portfolio)
    return NextResponse.json(
      { success: false, message: "Not found", status: 404 },
      { status: 404 },
    );

  return NextResponse.json(portfolio ?? "not found");
}
