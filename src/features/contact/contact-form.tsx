"use client";

import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { submitContactAction } from "@/features/contact/actions";
import { cn } from "@/lib/utils";

export type ContactFormFields = {
  name: string;
  email: string;
  company?: string;
  role?: string;
  message: string;
  website?: string;
};

const fieldSurface =
  "border-zinc-300/90 bg-white text-zinc-900 shadow-sm placeholder:text-zinc-400 backdrop-blur-none transition-[border-color,box-shadow] focus-visible:border-orange-400/50 focus-visible:ring-orange-500/35 dark:border-zinc-700 dark:bg-zinc-950/85 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus-visible:border-orange-500/45 dark:focus-visible:ring-orange-400/30";

const labelClass =
  "mb-2 block text-[13px] font-semibold tracking-tight text-zinc-700 dark:text-zinc-300";

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
      className="relative z-[1] space-y-8 sm:space-y-10"
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

      <div className="flex flex-col gap-0 overflow-hidden rounded-2xl border border-zinc-200/90 bg-white/80 shadow-inner shadow-zinc-900/[0.03] dark:border-zinc-800 dark:bg-zinc-950/40 dark:shadow-none sm:flex-row">
        <div
          className="h-1 shrink-0 bg-gradient-to-r from-orange-500 via-orange-400/80 to-orange-600/60 sm:h-auto sm:w-1 sm:bg-gradient-to-b dark:from-orange-400 dark:via-orange-500/65 dark:to-orange-600/50"
          aria-hidden
        />
        <div className="min-w-0 flex-1 space-y-8 p-6 sm:p-8 md:p-9">
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            <div>
              <Label htmlFor="name" className={labelClass}>
                Name
              </Label>
              <Input
                id="name"
                className={cn("rounded-xl", fieldSurface)}
                {...form.register("name", { required: true, minLength: 2 })}
              />
              {form.formState.errors.name ? (
                <ErrorLabel>Provide at least two characters.</ErrorLabel>
              ) : null}
            </div>

            <div>
              <Label htmlFor="email" className={labelClass}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className={cn("rounded-xl", fieldSurface)}
                {...form.register("email", { required: true })}
              />
              {form.formState.errors.email ? (
                <ErrorLabel>An email anchor is required.</ErrorLabel>
              ) : null}
            </div>

            <div>
              <Label htmlFor="company" className={labelClass}>
                Company{" "}
                <span className="font-normal text-zinc-500 dark:text-zinc-500">
                  (optional)
                </span>
              </Label>
              <Input
                id="company"
                className={cn("rounded-xl", fieldSurface)}
                {...form.register("company")}
              />
            </div>

            <div>
              <Label htmlFor="role" className={labelClass}>
                Role{" "}
                <span className="font-normal text-zinc-500 dark:text-zinc-500">
                  (optional)
                </span>
              </Label>
              <Input
                id="role"
                className={cn("rounded-xl", fieldSurface)}
                {...form.register("role")}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="message" className={labelClass}>
              Message
            </Label>
            <Textarea
              id="message"
              rows={7}
              className={cn("min-h-[168px] rounded-xl", fieldSurface)}
              {...form.register("message", { required: true, minLength: 20 })}
            />
            {form.formState.errors.message ? (
              <ErrorLabel>
                Twenty characters minimum keeps signal clean.
              </ErrorLabel>
            ) : null}
          </div>

          <div className="flex flex-col gap-4 border-t border-zinc-200/90 pt-6 dark:border-zinc-800/90 sm:flex-row sm:items-center sm:justify-between">
            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              variant="glow"
              className="w-full shrink-0 sm:w-auto"
            >
              {form.formState.isSubmitting ? "Sending…" : "Send message"}
            </Button>
            {status ? (
              <p
                className={cn(
                  "text-sm font-medium leading-relaxed sm:text-right sm:max-w-md",
                  status.startsWith("Thanks")
                    ? "text-orange-800 dark:text-orange-200"
                    : "text-rose-700 dark:text-rose-300",
                )}
              >
                {status}
              </p>
            ) : (
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-500">
                Typical reply window: a few business days.
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

function ErrorLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-400">
      {children}
    </p>
  );
}
