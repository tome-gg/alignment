import { Effect, Either, ParseResult, Schema } from "effect";

export const UserModeSchema = Schema.Literal(
  "software_engineering",
  "manufacturing",
);
export type UserMode = Schema.Schema.Type<typeof UserModeSchema>;

export const ConfidenceSchema = Schema.Literal(1, 2, 3, 4, 5);
export type Confidence = Schema.Schema.Type<typeof ConfidenceSchema>;

export const PacketStatusSchema = Schema.Literal(
  "pending",
  "correct",
  "incorrect",
  "partially_correct",
  "unresolved",
);
export type PacketStatus = Schema.Schema.Type<typeof PacketStatusSchema>;

export const LoginInputSchema = Schema.Struct({
  name: Schema.NonEmptyString,
  email: Schema.NonEmptyString,
  mode: UserModeSchema,
});
export type LoginInput = Schema.Schema.Type<typeof LoginInputSchema>;

export const EvidenceInputSchema = Schema.Struct({
  kind: Schema.NonEmptyString,
  label: Schema.String,
  value: Schema.NonEmptyString,
});
export type EvidenceInput = Schema.Schema.Type<typeof EvidenceInputSchema>;

export const SoftwareDecisionPacketInputSchema = Schema.Struct({
  mode: Schema.Literal("software_engineering"),
  situationSummary: Schema.NonEmptyString,
  actionSummary: Schema.NonEmptyString,
  insightText: Schema.NonEmptyString,
  confidence: ConfidenceSchema,
  surprising: Schema.Boolean,
  repository: Schema.NonEmptyString,
  issueType: Schema.NonEmptyString,
  actionType: Schema.NonEmptyString,
  tags: Schema.Array(Schema.String),
  evidence: Schema.NonEmptyArray(EvidenceInputSchema),
});
export type SoftwareDecisionPacketInput = Schema.Schema.Type<
  typeof SoftwareDecisionPacketInputSchema
>;

export const ManufacturingDecisionPacketInputSchema = Schema.Struct({
  mode: Schema.Literal("manufacturing"),
  situationSummary: Schema.NonEmptyString,
  actionSummary: Schema.NonEmptyString,
  insightText: Schema.NonEmptyString,
  confidence: ConfidenceSchema,
  surprising: Schema.Boolean,
  product: Schema.NonEmptyString,
  issueKind: Schema.NonEmptyString,
  environment: Schema.NonEmptyString,
  problemType: Schema.NonEmptyString,
  actionType: Schema.NonEmptyString,
  checks: Schema.Array(Schema.String),
  evidence: Schema.NonEmptyArray(EvidenceInputSchema),
});
export type ManufacturingDecisionPacketInput = Schema.Schema.Type<
  typeof ManufacturingDecisionPacketInputSchema
>;

export const CreateDecisionPacketInputSchema = Schema.Union(
  SoftwareDecisionPacketInputSchema,
  ManufacturingDecisionPacketInputSchema,
);
export type CreateDecisionPacketInput = Schema.Schema.Type<
  typeof CreateDecisionPacketInputSchema
>;

export const SessionUserSchema = Schema.Struct({
  id: Schema.NonEmptyString,
  name: Schema.NonEmptyString,
  email: Schema.NonEmptyString,
  mode: UserModeSchema,
});
export type SessionUser = Schema.Schema.Type<typeof SessionUserSchema>;

export const DecisionPacketSummarySchema = Schema.Struct({
  id: Schema.NonEmptyString,
  mode: UserModeSchema,
  situationSummary: Schema.NonEmptyString,
  actionSummary: Schema.NonEmptyString,
  confidence: ConfidenceSchema,
  status: PacketStatusSchema,
  createdAt: Schema.NonEmptyString,
});
export type DecisionPacketSummary = Schema.Schema.Type<
  typeof DecisionPacketSummarySchema
>;

export const DecisionPacketEvidenceSchema = Schema.Struct({
  id: Schema.NonEmptyString,
  kind: Schema.NonEmptyString,
  label: Schema.NonEmptyString,
  value: Schema.NonEmptyString,
});
export type DecisionPacketEvidence = Schema.Schema.Type<
  typeof DecisionPacketEvidenceSchema
>;

export const SoftwareMetadataSchema = Schema.Struct({
  repository: Schema.NonEmptyString,
  issueType: Schema.NonEmptyString,
  actionType: Schema.NonEmptyString,
  tags: Schema.Array(Schema.String),
});
export type SoftwareMetadata = Schema.Schema.Type<typeof SoftwareMetadataSchema>;

export const ManufacturingMetadataSchema = Schema.Struct({
  product: Schema.NonEmptyString,
  issueKind: Schema.NonEmptyString,
  environment: Schema.NonEmptyString,
  problemType: Schema.NonEmptyString,
  actionType: Schema.NonEmptyString,
  checks: Schema.Array(Schema.String),
});
export type ManufacturingMetadata = Schema.Schema.Type<
  typeof ManufacturingMetadataSchema
>;

export const SoftwareDecisionPacketSchema = Schema.Struct({
  id: Schema.NonEmptyString,
  mode: Schema.Literal("software_engineering"),
  situationSummary: Schema.NonEmptyString,
  actionSummary: Schema.NonEmptyString,
  insightText: Schema.NonEmptyString,
  confidence: ConfidenceSchema,
  surprising: Schema.Boolean,
  status: PacketStatusSchema,
  createdAt: Schema.NonEmptyString,
  updatedAt: Schema.NonEmptyString,
  evidence: Schema.Array(DecisionPacketEvidenceSchema),
  metadata: SoftwareMetadataSchema,
  user: SessionUserSchema,
});

export const ManufacturingDecisionPacketSchema = Schema.Struct({
  id: Schema.NonEmptyString,
  mode: Schema.Literal("manufacturing"),
  situationSummary: Schema.NonEmptyString,
  actionSummary: Schema.NonEmptyString,
  insightText: Schema.NonEmptyString,
  confidence: ConfidenceSchema,
  surprising: Schema.Boolean,
  status: PacketStatusSchema,
  createdAt: Schema.NonEmptyString,
  updatedAt: Schema.NonEmptyString,
  evidence: Schema.Array(DecisionPacketEvidenceSchema),
  metadata: ManufacturingMetadataSchema,
  user: SessionUserSchema,
});

export const DecisionPacketSchema = Schema.Union(
  SoftwareDecisionPacketSchema,
  ManufacturingDecisionPacketSchema,
);
export type DecisionPacket = Schema.Schema.Type<typeof DecisionPacketSchema>;

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export function safeDecode<T, Encoded>(
  schema: Schema.Schema<T, Encoded>,
  input: unknown,
): ValidationResult<T> {
  const result = Schema.decodeUnknownEither(schema)(input);

  if (Either.isRight(result)) {
    return { success: true, data: result.right };
  }

  const formatted = ParseResult.TreeFormatter.formatError(result.left);

  return {
    success: false,
    error: Effect.runSync(formatted),
  };
}
