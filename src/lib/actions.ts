"use server";

import { clearSessionUser } from "@/lib/session";

import { redirect } from "next/navigation";

export async function logoutAction() {
  await clearSessionUser();
  redirect("/login");
}
