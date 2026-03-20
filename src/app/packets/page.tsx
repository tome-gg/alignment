import { listDecisionPacketsForUser } from "@tome/backend/decision-packets";

import { Button, Card } from "@/components/ui";
import { requireSessionUser } from "@/lib/session";

import Link from "next/link";

export default async function PacketsPage() {
  const user = await requireSessionUser();
  const packets = await listDecisionPacketsForUser(user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-neutral-500">Signed in as {user.email}</p>
          <h1 className="mt-2 text-3xl font-semibold text-neutral-950">
            Decision packets
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600">
            Keep only the essentials: log the situation, action, evidence, insight,
            and later evaluation.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/packets/new/software">
            <Button className="w-full sm:w-auto">New software packet</Button>
          </Link>
          <Link href="/packets/new/manufacturing">
            <Button variant="secondary" className="w-full sm:w-auto">
              New manufacturing packet
            </Button>
          </Link>
        </div>
      </div>

      {packets.length === 0 ? (
        <Card>
          <h2 className="text-lg font-semibold text-neutral-950">
            No packets yet
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Start with the input form that matches the work you are logging.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {packets.map((packet) => (
            <Link key={packet.id} href={`/packets/${packet.id}`}>
              <Card className="transition hover:border-neutral-400">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2 text-xs text-neutral-500">
                      <span className="rounded-full bg-neutral-100 px-2 py-1">
                        {packet.mode === "software_engineering"
                          ? "Software"
                          : "Manufacturing"}
                      </span>
                      <span className="rounded-full bg-neutral-100 px-2 py-1">
                        {packet.status}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-neutral-950">
                      {packet.situationSummary}
                    </h2>
                    <p className="text-sm text-neutral-600">{packet.actionSummary}</p>
                  </div>

                  <div className="text-sm text-neutral-500">
                    <div>Confidence {packet.confidence}/5</div>
                    <div>{new Date(packet.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
