import { LoginForm } from "@/components/LoginForm";
import { getSessionUser } from "@/lib/session";

import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getSessionUser();

  if (user) {
    redirect("/packets");
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <LoginForm />
    </div>
  );
}
