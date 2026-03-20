import { getDecisionPacketForUser } from "@tome/backend/decision-packets";

import { getSessionUser } from "@/lib/session";

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const packet = await getDecisionPacketForUser(id, user.id);

  if (!packet) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ packet });
}
