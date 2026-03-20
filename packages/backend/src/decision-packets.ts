import {
  type CreateDecisionPacketInput,
  type DecisionPacket,
  type DecisionPacketSummary,
  CreateDecisionPacketInputSchema,
  DecisionPacketSchema,
  DecisionPacketSummarySchema,
  safeDecode,
} from "@tome/domain";

import { prisma } from "./db";

function parseJson<T>(value: string | null): T {
  if (!value) {
    return {} as T;
  }

  return JSON.parse(value) as T;
}

function toPacketStatus(status: string | null) {
  return status ?? "pending";
}

export async function listDecisionPacketsForUser(
  userId: string,
): Promise<DecisionPacketSummary[]> {
  const packets = await prisma.decisionPacket.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return packets.map((packet) => {
    const parsedSummary = safeDecode(DecisionPacketSummarySchema, {
      id: packet.id,
      mode: packet.mode,
      situationSummary: packet.situationSummary,
      actionSummary: packet.actionSummary,
      confidence: packet.confidence as 1 | 2 | 3 | 4 | 5,
      status: toPacketStatus(packet.evaluationStatus) as
        | "pending"
        | "correct"
        | "incorrect"
        | "partially_correct"
        | "unresolved",
      createdAt: packet.createdAt.toISOString(),
    });

    if (!parsedSummary.success) {
      throw new Error(parsedSummary.error);
    }

    return parsedSummary.data;
  });
}

export async function getDecisionPacketForUser(
  packetId: string,
  userId: string,
): Promise<DecisionPacket | null> {
  const packet = await prisma.decisionPacket.findFirst({
    where: {
      id: packetId,
      userId,
    },
    include: {
      evidence: true,
      user: true,
    },
  });

  if (!packet) {
    return null;
  }

  const parsedPacket = safeDecode(DecisionPacketSchema, {
    id: packet.id,
    mode: packet.mode,
    situationSummary: packet.situationSummary,
    actionSummary: packet.actionSummary,
    insightText: packet.insightText,
    confidence: packet.confidence as 1 | 2 | 3 | 4 | 5,
    surprising: packet.surprising,
    status: toPacketStatus(packet.evaluationStatus) as
      | "pending"
      | "correct"
      | "incorrect"
      | "partially_correct"
      | "unresolved",
    createdAt: packet.createdAt.toISOString(),
    updatedAt: packet.updatedAt.toISOString(),
    evidence: packet.evidence.map((item: (typeof packet.evidence)[number]) => ({
      id: item.id,
      kind: item.kind,
      label: item.label,
      value: item.value,
    })),
    metadata: parseJson(packet.metadataJson),
    user: {
      id: packet.user.id,
      name: packet.user.name,
      email: packet.user.email,
      mode: packet.user.mode,
    },
  });

  if (!parsedPacket.success) {
    throw new Error(parsedPacket.error);
  }

  return parsedPacket.data;
}

export async function createDecisionPacket(
  userId: string,
  input: unknown,
): Promise<DecisionPacket> {
  const parsed = safeDecode(CreateDecisionPacketInputSchema, input);

  if (!parsed.success) {
    throw new Error(parsed.error);
  }

  return createDecisionPacketFromInput(userId, parsed.data);
}

async function createDecisionPacketFromInput(
  userId: string,
  input: CreateDecisionPacketInput,
) {
  const packet = await prisma.decisionPacket.create({
    data: {
      userId,
      mode: input.mode,
      situationSummary: input.situationSummary,
      actionSummary: input.actionSummary,
      insightText: input.insightText,
      confidence: input.confidence,
      surprising: input.surprising,
      metadataJson:
        input.mode === "software_engineering"
          ? JSON.stringify({
              repository: input.repository,
              issueType: input.issueType,
              actionType: input.actionType,
              tags: input.tags,
            })
          : JSON.stringify({
              product: input.product,
              issueKind: input.issueKind,
              environment: input.environment,
              problemType: input.problemType,
              actionType: input.actionType,
              checks: input.checks,
            }),
      evidence: {
        create: input.evidence.map((item: CreateDecisionPacketInput["evidence"][number]) => ({
          kind: item.kind,
          label: item.label,
          value: item.value,
        })),
      },
    },
    include: {
      evidence: true,
      user: true,
    },
  });

  const parsedPacket = safeDecode(DecisionPacketSchema, {
    id: packet.id,
    mode: packet.mode,
    situationSummary: packet.situationSummary,
    actionSummary: packet.actionSummary,
    insightText: packet.insightText,
    confidence: packet.confidence as 1 | 2 | 3 | 4 | 5,
    surprising: packet.surprising,
    status: "pending",
    createdAt: packet.createdAt.toISOString(),
    updatedAt: packet.updatedAt.toISOString(),
    evidence: packet.evidence.map((item: (typeof packet.evidence)[number]) => ({
      id: item.id,
      kind: item.kind,
      label: item.label,
      value: item.value,
    })),
    metadata: parseJson(packet.metadataJson),
    user: {
      id: packet.user.id,
      name: packet.user.name,
      email: packet.user.email,
      mode: packet.user.mode,
    },
  });

  if (!parsedPacket.success) {
    throw new Error(parsedPacket.error);
  }

  return parsedPacket.data;
}
