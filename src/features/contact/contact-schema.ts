import { z } from "zod";

/** Shared validation for `/contact` (client resolver + server action). */
export const contactPayloadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Please enter at least two characters." })
    .max(120),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required." })
    .email({ message: "Enter a valid email address." })
    .max(254),
  company: z
    .string()
    .trim()
    .max(120)
    .optional(),
  role: z
    .string()
    .trim()
    .max(120)
    .optional(),
  message: z
    .string()
    .trim()
    .min(20, {
      message: "Write at least 20 characters so I can reply with context.",
    })
    .max(4000),
  website: z.preprocess(
    (val) => (typeof val === "string" ? val : ""),
    z.string().max(0),
  ),
});

export type ContactPayloadIn = z.input<typeof contactPayloadSchema>;
export type ContactPayload = z.infer<typeof contactPayloadSchema>;
