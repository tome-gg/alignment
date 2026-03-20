"use client";

import {
  type SoftwareDecisionPacketInput,
  SoftwareDecisionPacketInputSchema,
  safeDecode,
} from "@tome/domain";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useState } from "react";

import {
  Button,
  Card,
  FieldError,
  FieldLabel,
  Select,
  TextArea,
  TextInput,
} from "./ui";

type SoftwarePacketFormValues = Omit<
  SoftwareDecisionPacketInput,
  "confidence" | "surprising"
> & {
  confidence?: SoftwareDecisionPacketInput["confidence"];
  surprising: false;
};

const issueTypes = ["bug", "feature", "performance", "refactor", "incident"];
const actionTypes = ["debug", "fix", "design", "refactor", "investigate"];

export function SoftwarePacketForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string>();
  const [tagInput, setTagInput] = useState("");

  const form = useForm({
    defaultValues: {
      mode: "software_engineering",
      situationSummary: "",
      actionSummary: "",
      insightText: "",
      confidence: undefined,
      surprising: false,
      repository: "",
      issueType: issueTypes[0],
      actionType: actionTypes[0],
      tags: [] as string[],
      evidence: [{ kind: "github_pr", label: "", value: "" }],
    } as SoftwarePacketFormValues,
    onSubmit: async ({ value }) => {
      setSubmitError(undefined);

      if (!value.confidence) {
        setSubmitError("Confidence is required.");
        return;
      }

      const parsed = safeDecode(SoftwareDecisionPacketInputSchema, {
        ...value,
        confidence: value.confidence,
        surprising: false,
        evidence: value.evidence.map((item) => ({
          ...item,
          kind: "github_pr",
        })),
      });

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

  function addTag(
    nextValue: string,
    currentTags: readonly string[],
    onChange: (value: readonly string[]) => void,
  ) {
    const normalized = nextValue.trim();

    if (!normalized) {
      return;
    }

    if (!currentTags.includes(normalized)) {
      onChange([...currentTags, normalized]);
    }

    setTagInput("");
  }

  function handleTagKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
    currentTags: readonly string[],
    onChange: (value: readonly string[]) => void,
  ) {
    if (event.key === "," || event.key === "Enter") {
      event.preventDefault();
      addTag(tagInput, currentTags, onChange);
      return;
    }

    if (event.key === "Backspace" && !tagInput && currentTags.length > 0) {
      onChange(currentTags.slice(0, -1));
    }
  }

  return (
    <Card className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-950">
          Software engineering packet
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Fast, text-first, and lightweight. Log the work, attach proof, move on.
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
                hint="What problem or context did you face?"
              />
              <TextArea
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="API latency spike under load in the billing service."
              />
              <FieldError message={field.state.meta.errors[0]} />
            </div>
          )}
        </form.Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="issueType">
            {(field) => (
              <div>
                <FieldLabel label="Issue type" />
                <Select
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                >
                  {issueTypes.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Select>
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
              <FieldLabel
                label="Action"
                hint="What did you do or decide?"
              />
              <TextArea
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Added a Redis cache layer and removed duplicated queries."
              />
              <FieldError message={field.state.meta.errors[0]} />
            </div>
          )}
        </form.Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="actionType">
            {(field) => (
              <div>
                <FieldLabel label="Action type" />
                <Select
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                >
                  {actionTypes.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </form.Field>

          <form.Field name="tags">
            {(field) => (
              <div>
                <FieldLabel label="Tags" />
                <div className="flex min-h-[52px] flex-wrap items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-[7px] focus-within:border-neutral-900">
                  {field.state.value.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="rounded-full bg-neutral-900 px-3 py-1 text-xs text-white"
                      onClick={() =>
                        field.handleChange(
                          field.state.value.filter((item) => item !== tag),
                        )
                      }
                    >
                      {tag}
                    </button>
                  ))}
                  <input
                    className="h-9 min-w-[8rem] flex-1 border-0 bg-transparent text-sm text-neutral-900 outline-none"
                    value={tagInput}
                    onBlur={field.handleBlur}
                    onChange={(event) => setTagInput(event.target.value)}
                    onKeyDown={(event) =>
                      handleTagKeyDown(event, field.state.value, field.handleChange)
                    }
                    placeholder="Type and press comma"
                  />
                </div>
              </div>
            )}
          </form.Field>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-900">GitHub PR</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="repository">
              {(field) => (
                <div>
                  <FieldLabel label="Repository" />
                  <TextInput
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="tome-gg/alignment"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="evidence[0].value">
              {(field) => (
                <div>
                  <FieldLabel label="PR link" />
                  <TextInput
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="https://github.com/org/repo/pull/123"
                  />
                </div>
              )}
            </form.Field>
          </div>
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
                hint="Keep it grounded in what you actually learned."
              />
              <TextArea
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Caching fixed the immediate issue, but invalidation ownership became the real constraint."
              />
              <FieldError message={field.state.meta.errors[0]} />
            </div>
          )}
        </form.Field>

        <form.Field name="confidence">
          {(field) => (
            <div>
              <FieldLabel label="Confidence" />
              <div className="flex gap-2">
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

        <FieldError message={submitError} />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </Card>
  );
}
