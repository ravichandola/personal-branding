"use client";

import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { submitContactAction } from "@/features/contact/actions";

export type ContactFormFields = {
  name: string;
  email: string;
  company?: string;
  role?: string;
  message: string;
  website?: string;
};

export function ContactForm() {
  const [status, setStatus] = React.useState<string | null>(null);

  const form = useForm<ContactFormFields>({
    defaultValues: {
      name: "",
      email: "",
      company: "",
      role: "",
      message: "",
      website: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setStatus(null);

    const result = await submitContactAction({
      ...values,
      website: values.website ?? "",
    });

    if (result.ok) {
      setStatus(
        "Thanks — your message is in. I will reply to the email you provided.",
      );
      form.reset();
    } else {
      setStatus(result.error ?? "Unable to transmit right now.");
    }
  });

  return (
    <form
      className="glass-panel space-y-8 rounded-[1.9rem] p-9"
      onSubmit={onSubmit}
    >
      <input
        {...form.register("website")}
        aria-hidden
        autoComplete="off"
        className="hidden"
        tabIndex={-1}
        type="text"
      />

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...form.register("name", { required: true, minLength: 2 })}
          />
          {form.formState.errors.name ? (
            <ErrorLabel>Provide at least two characters.</ErrorLabel>
          ) : null}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...form.register("email", { required: true })}
          />
          {form.formState.errors.email ? (
            <ErrorLabel>An email anchor is required.</ErrorLabel>
          ) : null}
        </div>

        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" {...form.register("company")} />
        </div>

        <div>
          <Label htmlFor="role">Role</Label>
          <Input id="role" {...form.register("role")} />
        </div>
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={8}
          {...form.register("message", { required: true, minLength: 20 })}
        />
        {form.formState.errors.message ? (
          <ErrorLabel>Twenty characters minimum keeps signal clean.</ErrorLabel>
        ) : null}
      </div>

      <Button disabled={form.formState.isSubmitting} type="submit" variant="glow">
        {form.formState.isSubmitting ? "Sending…" : "Send message"}
      </Button>

      {status ? (
        <p className="text-sm text-emerald-700 dark:text-emerald-300">{status}</p>
      ) : null}
    </form>
  );
}

function ErrorLabel({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-xs text-rose-400">{children}</p>;
}
