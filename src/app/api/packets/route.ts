import {
  createDecisionPacket,
  listDecisionPacketsForUser,
} from "@tome/backend/decision-packets";

import { getSessionUser } from "@/lib/session";

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const packets = await listDecisionPacketsForUser(user.id);
  return NextResponse.json({ packets });
}

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const packet = await createDecisionPacket(user.id, body);

    return NextResponse.json({ packet }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not create packet.",
      },
      { status: 400 },
    );
  }
}
