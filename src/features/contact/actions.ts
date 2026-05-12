"use server";

import crypto from "node:crypto";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const payload = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email(),
  company: z.string().trim().max(120).optional(),
  role: z.string().trim().max(120).optional(),
  message: z.string().trim().min(20).max(4000),
  website: z.string().max(0).default(""),
});

export type ContactPayload = z.infer<typeof payload>;

export async function submitContactAction(
  input: unknown,
): Promise<
  { ok: true } | { ok: false; error: string }
> {
  try {
    const parsed = payload.safeParse(input);

    if (!parsed.success) {
      return { ok: false, error: "Please double-check the highlighted fields." };
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

    const key = process.env.RESEND_API_KEY;
    const notify =
      process.env.CONTACT_NOTIFY_EMAIL ?? process.env.CONTACT_ALERT_EMAIL;
    const from =
      process.env.RESEND_FROM_EMAIL ??
      "Portfolio <notifications@example.com>";

    if (key && notify) {
      const resend = new Resend(key);
      await resend.emails.send({
        from,
        to: notify,
        subject: `Inbound note from ${data.name}`,
        text: `${data.message}\n\n— ${data.name} <${data.email}>\nCompany: ${data.company ?? "n/a"}\nRole: ${data.role ?? "n/a"}`,
      });
    }

    return { ok: true };
  } catch (error) {
    console.error("[contact]", error);
    return {
      ok: false,
      error: "Something went wrong while persisting your message.",
    };
  }
}
