import { z } from "zod";

const optionalString = () => z.string().optional();

const serverSchema = z.object({
  NODE_ENV: optionalString(),

  DATABASE_URL: optionalString(),
  DATABASE_URL_FALLBACK: optionalString(),

  AUTH_SECRET: optionalString(),
  AUTH_URL: optionalString(),

  NEXT_PUBLIC_SITE_URL: optionalString(),

  GOOGLE_CLIENT_ID: optionalString(),
  GOOGLE_CLIENT_SECRET: optionalString(),

  ALLOWED_ADMIN_EMAILS: optionalString(),

  RESEND_API_KEY: optionalString(),
  CONTACT_NOTIFY_EMAIL: optionalString(),

  CLOUDINARY_CLOUD_NAME: optionalString(),
  CLOUDINARY_API_KEY: optionalString(),
  CLOUDINARY_API_SECRET: optionalString(),

  OPENAI_API_KEY: optionalString(),
});

const parsed = serverSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.warn("Environment validation warnings:", parsed.error.flatten());
}

const values = parsed.success
  ? parsed.data
  : (process.env as z.infer<typeof serverSchema>);

export type ServerEnv = z.infer<typeof serverSchema>;

export function env(): ServerEnv {
  return values;
}
