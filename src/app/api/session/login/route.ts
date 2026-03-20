import { loginUser } from "@tome/backend/users";

import { setSessionUser } from "@/lib/session";

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await loginUser(body);

    await setSessionUser(user.id);

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not log in.",
      },
      { status: 400 },
    );
  }
}
