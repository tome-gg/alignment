"use client";

import { type LoginInput, LoginInputSchema, safeDecode } from "@tome/domain";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Card, FieldError, FieldLabel, Select, TextInput } from "./ui";

export function LoginForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string>();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      mode: "software_engineering",
    } as LoginInput,
    onSubmit: async ({ value }) => {
      setSubmitError(undefined);

      const parsed = safeDecode(LoginInputSchema, value);

      if (!parsed.success) {
        setSubmitError(parsed.error);
        return;
      }

      const response = await fetch("/api/session/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        setSubmitError(payload.error ?? "Login failed.");
        return;
      }

      router.push("/packets");
      router.refresh();
    },
  });

  return (
    <Card className="mx-auto w-full max-w-md p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-950">Log in</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Keep it simple. Pick your primary mode and start logging real work.
        </p>
      </div>

      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) =>
              value.trim() ? undefined : "Name is required.",
          }}
        >
          {(field) => (
            <div>
              <FieldLabel label="Name" />
              <TextInput
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Darren Sapalo"
              />
              <FieldError message={field.state.meta.errors[0]} />
            </div>
          )}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) =>
              value.trim() ? undefined : "Email is required.",
          }}
        >
          {(field) => (
            <div>
              <FieldLabel label="Email" />
              <TextInput
                name={field.name}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="you@tome.gg"
              />
              <FieldError message={field.state.meta.errors[0]} />
            </div>
          )}
        </form.Field>

        <form.Field name="mode">
          {(field) => (
            <div>
              <FieldLabel label="Primary mode" />
              <Select
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(
                    event.target.value as "software_engineering" | "manufacturing",
                  )
                }
              >
                <option value="software_engineering">Software engineering</option>
                <option value="manufacturing">Manufacturing</option>
              </Select>
            </div>
          )}
        </form.Field>

        <FieldError message={submitError} />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" className="w-full" disabled={!canSubmit}>
              {isSubmitting ? "Logging in..." : "Continue"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </Card>
  );
}
