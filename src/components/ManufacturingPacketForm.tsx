"use client";

import {
  type ManufacturingDecisionPacketInput,
  ManufacturingDecisionPacketInputSchema,
  safeDecode,
} from "@tome/domain";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Card, FieldError, FieldLabel, Select, TextArea, TextInput } from "./ui";

const issueKinds = ["defect", "repair", "new_job"];
const environments = ["abrasion", "heat", "wet", "chemical", "unknown"];
const problemTypes = [
  "uneven_wear",
  "surface_defect",
  "adhesion_failure",
  "dimension_issue",
  "unknown",
];
const actionTypes = [
  "recoat",
  "re_machine",
  "inspect_alignment",
  "adjust_formulation",
  "reject",
  "escalate",
];
const checkOptions = ["hardness", "dimensions", "adhesion", "surface", "balance"];

export function ManufacturingPacketForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string>();

  const form = useForm({
    defaultValues: {
      mode: "manufacturing",
      situationSummary: "",
      actionSummary: "",
      insightText: "",
      confidence: 3,
      surprising: false,
      product: "",
      issueKind: "defect",
      environment: "abrasion",
      problemType: "uneven_wear",
      actionType: "recoat",
      checks: ["hardness"] as string[],
      evidence: [{ kind: "photo", label: "", value: "" }],
    } as ManufacturingDecisionPacketInput,
    onSubmit: async ({ value }) => {
      setSubmitError(undefined);

      const parsed = safeDecode(ManufacturingDecisionPacketInputSchema, value);

      if (!parsed.success) {
        setSubmitError(parsed.error);
        return;
      }

      const response = await fetch("/api/packets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        setSubmitError(payload.error ?? "Could not save packet.");
        return;
      }

      const payload = (await response.json()) as { packet: { id: string } };
      router.push(`/packets/${payload.packet.id}`);
      router.refresh();
    },
  });

  return (
    <Card className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-950">
          Manufacturing packet
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Structured, tap-first, and quick. Capture the job, proof, and learning.
        </p>
      </div>

      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="product">
            {(field) => (
              <div>
                <FieldLabel label="Product" />
                <TextInput
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Roller assembly"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="issueKind">
            {(field) => (
              <div>
                <FieldLabel label="Issue" />
                <Select
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                >
                  {issueKinds.map((value) => (
                    <option key={value} value={value}>
                      {value.replaceAll("_", " ")}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </form.Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="environment">
            {(field) => (
              <div>
                <FieldLabel label="Environment" />
                <Select
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                >
                  {environments.map((value) => (
                    <option key={value} value={value}>
                      {value.replaceAll("_", " ")}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </form.Field>

          <form.Field name="problemType">
            {(field) => (
              <div>
                <FieldLabel label="Problem type" />
                <Select
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                >
                  {problemTypes.map((value) => (
                    <option key={value} value={value}>
                      {value.replaceAll("_", " ")}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </form.Field>
        </div>

        <form.Field
          name="situationSummary"
          validators={{
            onChange: ({ value }) =>
              value.trim() ? undefined : "Situation is required.",
          }}
        >
          {(field) => (
            <div>
              <FieldLabel
                label="Situation"
                hint="Describe the job or defect in plain language."
              />
              <TextArea
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Uneven wear found during inspection on the primary roller."
              />
              <FieldError message={field.state.meta.errors[0]} />
            </div>
          )}
        </form.Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="actionType">
            {(field) => (
              <div>
                <FieldLabel label="Action" />
                <Select
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                >
                  {actionTypes.map((value) => (
                    <option key={value} value={value}>
                      {value.replaceAll("_", " ")}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </form.Field>

          <form.Field name="checks">
            {(field) => (
              <div>
                <FieldLabel label="Checks" hint="Choose what was verified." />
                <div className="flex flex-wrap gap-2">
                  {checkOptions.map((value) => {
                    const selected = field.state.value.includes(value);
                    return (
                      <Button
                        key={value}
                        type="button"
                        variant={selected ? "primary" : "secondary"}
                        onClick={() =>
                          field.handleChange(
                            selected
                              ? field.state.value.filter((item: string) => item !== value)
                              : [...field.state.value, value],
                          )
                        }
                      >
                        {value}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </form.Field>
        </div>

        <form.Field
          name="actionSummary"
          validators={{
            onChange: ({ value }) =>
              value.trim() ? undefined : "Action is required.",
          }}
        >
          {(field) => (
            <div>
              <FieldLabel label="Action summary" />
              <TextArea
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Inspected alignment, then recoated the surface to restore spec."
              />
              <FieldError message={field.state.meta.errors[0]} />
            </div>
          )}
        </form.Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="evidence[0].label">
            {(field) => (
              <div>
                <FieldLabel label="Evidence label" />
                <TextInput
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="QA photo"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="evidence[0].value">
            {(field) => (
              <div>
                <FieldLabel label="Evidence value" hint="URL or file reference." />
                <TextInput
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="photo://roller-17-before-after"
                />
              </div>
            )}
          </form.Field>
        </div>

        <form.Field
          name="insightText"
          validators={{
            onChange: ({ value }) =>
              value.trim() ? undefined : "Insight is required.",
          }}
        >
          {(field) => (
            <div>
              <FieldLabel
                label="Insight"
                hint="Keep it short and grounded in what you learned."
              />
              <TextArea
                name={field.name}
                className="min-h-24"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="The wear pattern pointed to alignment, not just surface hardness."
              />
              <FieldError message={field.state.meta.errors[0]} />
            </div>
          )}
        </form.Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="confidence">
            {(field) => (
              <div>
                <FieldLabel label="Confidence" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant={field.state.value === value ? "primary" : "secondary"}
                      className="min-w-12"
                      onClick={() =>
                        field.handleChange(value as 1 | 2 | 3 | 4 | 5)
                      }
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </form.Field>

          <form.Field name="surprising">
            {(field) => (
              <div>
                <FieldLabel label="Was this surprising?" />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={field.state.value ? "secondary" : "primary"}
                    onClick={() => field.handleChange(false)}
                  >
                    No
                  </Button>
                  <Button
                    type="button"
                    variant={field.state.value ? "primary" : "secondary"}
                    onClick={() => field.handleChange(true)}
                  >
                    Yes
                  </Button>
                </div>
              </div>
            )}
          </form.Field>
        </div>

        <FieldError message={submitError} />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "Saving..." : "Save packet"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </Card>
  );
}
