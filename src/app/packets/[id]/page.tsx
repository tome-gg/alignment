import { getDecisionPacketForUser } from "@tome/backend/decision-packets";

import { Card } from "@/components/ui";
import { requireSessionUser } from "@/lib/session";

import Link from "next/link";
import { notFound } from "next/navigation";

function metadataRows(packet: Awaited<ReturnType<typeof getDecisionPacketForUser>>) {
  if (!packet) {
    return [];
  }

  if (packet.mode === "software_engineering") {
    return [
      ["Repository", packet.metadata.repository],
      ["Issue type", packet.metadata.issueType],
      ["Action type", packet.metadata.actionType],
      ["Tags", packet.metadata.tags.join(", ") || "None"],
    ];
  }

  return [
    ["Product", packet.metadata.product],
    ["Issue", packet.metadata.issueKind],
    ["Environment", packet.metadata.environment],
    ["Problem type", packet.metadata.problemType],
    ["Action type", packet.metadata.actionType],
    ["Checks", packet.metadata.checks.join(", ") || "None"],
  ];
}

export default async function DecisionPacketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireSessionUser();
  const { id } = await params;
  const packet = await getDecisionPacketForUser(id, user.id);

  if (!packet) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/packets" className="text-sm text-neutral-500 underline">
            Back to packets
          </Link>
          <h1 className="mt-2 text-3xl font-semibold text-neutral-950">
            Decision packet detail
          </h1>
        </div>
        <div className="text-sm text-neutral-500">
          {new Date(packet.createdAt).toLocaleString()}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Situation
          </p>
          <p className="mt-3 text-base text-neutral-900">{packet.situationSummary}</p>
        </Card>

        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Action
          </p>
          <p className="mt-3 text-base text-neutral-900">{packet.actionSummary}</p>
        </Card>
      </div>

      <Card>
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Insight
        </p>
        <p className="mt-3 text-base text-neutral-900">{packet.insightText}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm text-neutral-500">
          <span className="rounded-full bg-neutral-100 px-3 py-1">
            Confidence {packet.confidence}/5
          </span>
          <span className="rounded-full bg-neutral-100 px-3 py-1">
            {packet.status}
          </span>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Evidence
          </p>
          <div className="mt-4 space-y-3">
            {packet.evidence.map((item: (typeof packet.evidence)[number]) => (
              <div
                key={item.id}
                className="rounded-xl border border-neutral-200 px-4 py-3"
              >
                <div className="text-sm font-medium text-neutral-900">{item.label}</div>
                <div className="mt-1 break-all text-sm text-neutral-500">{item.value}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Context
          </p>
          <dl className="mt-4 space-y-3">
            {metadataRows(packet).map(([label, value]) => (
              <div key={label} className="border-b border-neutral-100 pb-3 last:border-b-0">
                <dt className="text-xs uppercase tracking-wide text-neutral-500">
                  {label}
                </dt>
                <dd className="mt-1 text-sm text-neutral-900">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </div>
  );
}
