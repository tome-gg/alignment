import Image from "next/image";
import Link from "next/link";

import { logoutAction } from "@/lib/actions";
import { getSessionUser } from "@/lib/session";

import { Button } from "./ui";

export default async function Header() {
  const user = await getSessionUser();

  return (
    <header className="border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href={user ? "/packets" : "/login"} className="flex items-center gap-3">
          <Image
            src="/tome_gg_logo.avif"
            alt="Tome.gg"
            width={36}
            height={36}
            priority
            className="rounded-lg"
          />
          <div>
            <div className="text-sm font-semibold text-neutral-950">Tome.gg</div>
            <div className="text-xs text-neutral-500">
              {user ? user.name : "Decision packets"}
            </div>
          </div>
        </Link>

        {user ? (
          <form action={logoutAction}>
            <Button type="submit" variant="secondary">
              Log out
            </Button>
          </form>
        ) : null}
      </div>
    </header>
  );
}
