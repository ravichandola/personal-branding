"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Clock, Mail, ShieldCheck } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { submitContactAction } from "@/features/contact/actions";
import {
  contactPayloadSchema,
  type ContactPayloadIn,
} from "@/features/contact/contact-schema";
import { cn } from "@/lib/utils";

const fieldSurface =
  "!border-border !bg-background text-foreground shadow-sm placeholder:text-muted-foreground !backdrop-blur-none transition-[border-color,box-shadow] focus-visible:!border-accent/50 focus-visible:!ring-2 focus-visible:!ring-accent/35";

const labelClass =
  "mb-2 block text-[13px] font-semibold tracking-tight text-foreground";

const requiredMark = (
  <span className="text-rose-600 dark:text-rose-400" aria-hidden>
    {" "}
    *
  </span>
);

type SubmitFeedback =
  | { kind: "success" }
  | { kind: "warn"; text: string }
  | { kind: "error"; text: string };

export function ContactForm() {
  const [feedback, setFeedback] = React.useState<SubmitFeedback | null>(null);
  React.useEffect(() => {
    if (feedback?.kind === "success" || feedback?.kind === "warn") {
      const id =
        feedback.kind === "success"
          ? "contact-form-success"
          : "contact-form-partial-success";
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [feedback]);

  const form = useForm<ContactPayloadIn>({
    resolver: zodResolver(contactPayloadSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      role: "",
      message: "",
      website: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFeedback(null);

    const result = await submitContactAction({
      ...values,
      company: values.company?.trim() || undefined,
      role: values.role?.trim() || undefined,
      website: values.website ?? "",
    });

    if (result.ok) {
      form.reset();
      if (result.emailSent) {
        setFeedback({ kind: "success" });
      } else {
        setFeedback({
          kind: "warn",
          text:
            result.emailHint ??
            "Automated confirmation could not be sent, but your note is on file.",
        });
      }
    } else {
      setFeedback({
        kind: "error",
        text: result.error ?? "Unable to transmit right now.",
      });
    }
  });

  return (
    <div className="relative z-[1] space-y-6">
      {feedback?.kind === "success" ? (
        <div
          id="contact-form-success"
          role="status"
          aria-live="polite"
          className="rounded-2xl border border-accent/40 bg-accent/10 px-6 py-8 shadow-sm sm:px-10 sm:py-10"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
              <CheckCircle2 className="h-7 w-7" aria-hidden />
            </div>
            <div className="min-w-0 space-y-3">
              <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Thank you — your message is on its way
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                I have your note and will reply to the address you used. If you
                think of something else, you can send another message below or
                wait for my email and continue the thread there.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-1 w-full sm:w-auto"
                onClick={() => setFeedback(null)}
              >
                Send another message
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {feedback?.kind === "warn" ? (
        <div
          id="contact-form-partial-success"
          role="status"
          aria-live="polite"
          className="rounded-2xl border border-amber-500/35 bg-amber-500/10 px-6 py-8 sm:px-10 sm:py-10 dark:border-amber-400/25 dark:bg-amber-500/10"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-200">
              <CheckCircle2 className="h-7 w-7" aria-hidden />
            </div>
            <div className="min-w-0 space-y-3">
              <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Thank you — I have your message
              </h3>
              <p className="text-base leading-relaxed text-amber-950/90 dark:text-amber-50/95">
                {feedback.text}
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-1 w-full border-amber-800/30 bg-transparent sm:w-auto dark:border-amber-300/30"
                onClick={() => setFeedback(null)}
              >
                Send another message
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {feedback?.kind !== "success" && feedback?.kind !== "warn" ? (
        <ContactExpectations />
      ) : null}

      <form className="space-y-8 sm:space-y-10" onSubmit={onSubmit} noValidate>
        <input
          {...form.register("website")}
          aria-hidden
          autoComplete="off"
          className="hidden"
          tabIndex={-1}
          type="text"
        />

        <div className="flex flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-card shadow-inner shadow-foreground/[0.03] sm:flex-row dark:shadow-none">
          <div
            className="h-1 shrink-0 bg-gradient-to-r from-accent via-accent/80 to-accent-hover sm:h-auto sm:w-1 sm:bg-gradient-to-b"
            aria-hidden
          />
          <div className="min-w-0 flex-1 space-y-8 p-6 sm:p-8 md:p-9">
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
              <div>
                <Label htmlFor="name" className={labelClass}>
                  Name
                  {requiredMark}
                </Label>
                <Input
                  id="name"
                  autoComplete="name"
                  className={cn(
                    "rounded-xl",
                    fieldSurface,
                    form.formState.errors.name &&
                      "border-rose-500/65 focus-visible:ring-rose-500/30",
                  )}
                  {...form.register("name")}
                  aria-invalid={!!form.formState.errors.name}
                  aria-required
                />
                {form.formState.errors.name?.message ? (
                  <ErrorLabel>{form.formState.errors.name.message}</ErrorLabel>
                ) : null}
              </div>

              <div>
                <Label htmlFor="email" className={labelClass}>
                  Email
                  {requiredMark}
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@company.com"
                  className={cn(
                    "rounded-xl",
                    fieldSurface,
                    form.formState.errors.email &&
                      "border-rose-500/65 focus-visible:ring-rose-500/30",
                  )}
                  {...form.register("email")}
                  aria-invalid={!!form.formState.errors.email}
                  aria-required
                  aria-describedby={
                    form.formState.errors.email ? "contact-email-error" : undefined
                  }
                />
                {form.formState.errors.email?.message ? (
                  <ErrorLabel id="contact-email-error">
                    {form.formState.errors.email.message}
                  </ErrorLabel>
                ) : null}
              </div>

              <div>
                <Label htmlFor="company" className={labelClass}>
                  Company{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="company"
                  autoComplete="organization"
                  className={cn("rounded-xl", fieldSurface)}
                  {...form.register("company")}
                />
              </div>

              <div>
                <Label htmlFor="role" className={labelClass}>
                  Role{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="role"
                  autoComplete="organization-title"
                  className={cn("rounded-xl", fieldSurface)}
                  {...form.register("role")}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="message" className={labelClass}>
                Message
                {requiredMark}
              </Label>
              <Textarea
                id="message"
                rows={7}
                className={cn(
                  "min-h-[168px] rounded-xl",
                  fieldSurface,
                  form.formState.errors.message &&
                    "border-rose-500/65 focus-visible:ring-rose-500/30",
                )}
                {...form.register("message")}
                aria-invalid={!!form.formState.errors.message}
                aria-required
              />
              {form.formState.errors.message?.message ? (
                <ErrorLabel>{form.formState.errors.message.message}</ErrorLabel>
              ) : null}
            </div>

            <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                variant="glow"
                className="w-full shrink-0 sm:w-auto"
              >
                {form.formState.isSubmitting ? "Sending…" : "Send message"}
              </Button>
              {feedback?.kind === "error" ? (
                <p
                  className="text-sm font-medium leading-relaxed text-rose-700 sm:text-right sm:max-w-md dark:text-rose-300"
                  role="alert"
                >
                  {feedback.text}
                </p>
              ) : feedback?.kind === "success" || feedback?.kind === "warn" ? (
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-right sm:max-w-md">
                  Send again from the form anytime, or use &ldquo;Send another
                  message&rdquo; above to reset this notice.
                </p>
              ) : (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Most threads get a first substantive reply within a few business
                  days—say if you are on a tighter clock.
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function ContactExpectations() {
  const items = [
    {
      icon: Mail,
      title: "Replies go to your inbox",
      body: "Use an address you monitor—I respond there only. No marketing lists or resale.",
    },
    {
      icon: ShieldCheck,
      title: "Respect for your details",
      body: "Required fields carry an asterisk. I flag issues when you leave a field or when you send, so you always know what to fix.",
    },
    {
      icon: Clock,
      title: "Built for real timelines",
      body: "Share urgency in the message if you are on a deadline; otherwise expect a thoughtful first reply within a few business days.",
    },
  ] as const;

  return (
    <div
      className="rounded-2xl border border-border/90 bg-gradient-to-b from-card/95 to-card/75 p-5 shadow-sm sm:p-7 dark:from-card/80 dark:to-card/55"
      aria-labelledby="contact-expectations-heading"
    >
      <div className="flex flex-col gap-2 border-b border-border/70 pb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:pb-6">
        <div className="space-y-1.5">
          <p
            id="contact-expectations-heading"
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent"
          >
            How this works
          </p>
          <p className="max-w-xl text-sm font-medium leading-snug text-foreground sm:text-[15px]">
            The same polish you expect from a product-led team—clear expectations,
            fast signal, no clutter.
          </p>
        </div>
      </div>
      <ul className="mt-5 grid gap-6 sm:mt-6 sm:grid-cols-3 sm:gap-7">
        {items.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex gap-3.5">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/[0.12] text-accent shadow-sm shadow-accent/10">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0 space-y-1.5">
              <p className="text-sm font-semibold leading-snug tracking-tight text-foreground">
                {title}
              </p>
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ErrorLabel({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-400"
    >
      {children}
    </p>
  );
}
