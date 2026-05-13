"use server";

import crypto from "node:crypto";

import { headers } from "next/headers";
import { Resend } from "resend";

import { contactPayloadSchema } from "@/features/contact/contact-schema";
import { prisma } from "@/lib/prisma";

export type ContactSubmitResult =
  | {
      ok: true;
      /** True when Resend accepted the notification email */
      emailSent: boolean;
      /** Hint for admins when email was skipped or failed */
      emailHint?: string;
    }
  | { ok: false; error: string };

export async function submitContactAction(
  input: unknown,
): Promise<ContactSubmitResult> {
  try {
    const parsed = contactPayloadSchema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        error: "Please double-check the highlighted fields.",
      };
    }

    const { website: _trap, ...data } = parsed.data;
    void _trap;

    const headerList = await headers();

    const ip =
      headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      headerList.get("cf-connecting-ip") ??
      "anon";

    const hash = crypto.createHash("sha256").update(ip).digest("hex");

    const recent = await prisma.contact.count({
      where: {
        email: data.email,
        createdAt: { gt: new Date(Date.now() - 86_400_000) },
      },
    });

    if (recent >= 5) {
      return {
        ok: false,
        error:
          "You have reached the daily limit for this address. Email directly if it is urgent.",
      };
    }

    await prisma.contact.create({
      data: {
        ...data,
        consent: true,
        sourceIpHash: hash.slice(0, 48),
      },
    });

    let notify = "";
    try {
      const settings = await prisma.settings.findUnique({
        where: { id: "default" },
        select: { contactNotifyEmail: true },
      });
      notify = settings?.contactNotifyEmail?.trim() ?? "";
    } catch {
      /* optional DB */
    }
    if (!notify) {
      notify =
        process.env.CONTACT_NOTIFY_EMAIL?.trim() ??
        process.env.CONTACT_ALERT_EMAIL?.trim() ??
        "";
    }

    const key = process.env.RESEND_API_KEY?.trim() ?? "";

    const from =
      process.env.RESEND_FROM_EMAIL?.trim() ??
      "Portfolio <onboarding@resend.dev>";

    if (!key) {
      console.warn(
        "[contact] RESEND_API_KEY is missing — DB save succeeded, mail skipped.",
      );
      return {
        ok: true,
        emailSent: false,
        emailHint:
          "Automated inbox copy is paused on this deployment. Your message is still recorded and I will reply using the address you entered.",
      };
    }

    if (!notify) {
      console.warn(
        "[contact] No CONTACT_NOTIFY_EMAIL / Admin notify address — DB save succeeded, mail skipped.",
      );
      return {
        ok: true,
        emailSent: false,
        emailHint:
          "Automated inbox copy is not routed yet. Your message is still recorded and I will follow up directly.",
      };
    }

    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from,
      to: notify,
      replyTo: data.email,
      subject: `Inbound note from ${data.name}`,
      text: `${data.message}\n\n— ${data.name} <${data.email}>\nCompany: ${data.company ?? "n/a"}\nRole: ${data.role ?? "n/a"}`,
    });

    if (error) {
      console.error("[contact] Resend API error:", error.name, error.message);
      const isDev = process.env.NODE_ENV === "development";
      return {
        ok: true,
        emailSent: false,
        emailHint: isDev
          ? `Delivery test failed (${error.name}: ${error.message}). Your submission is still saved—check Resend domain / from-address in dev.`
          : "Your message was saved, but the confirmation email could not be delivered. I will still reach you at the address you provided.",
      };
    }

    return { ok: true, emailSent: true };
  } catch (error) {
    console.error("[contact]", error);
    return {
      ok: false,
      error: "Something went wrong while persisting your message.",
    };
  }
}
