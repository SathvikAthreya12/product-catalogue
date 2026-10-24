import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  FAKESTORE_BASE_URL: z.string().url().default("https://fakestoreapi.com"),
  SALES_INBOX: z.string().email().default("sales@example.com"),
  EMAIL_FROM: z.string().email().default("catalogue@example.com"),
  EMAIL_PROVIDER: z.enum(["console", "smtp"]).default("console"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
});

export type Config = z.infer<typeof schema>;

/** Validates environment once at startup so misconfiguration fails fast. */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const parsed = schema.safeParse(env);
  if (!parsed.success) {
    throw new Error(`Invalid configuration: ${parsed.error.message}`);
  }
  if (parsed.data.EMAIL_PROVIDER === "smtp" && !parsed.data.SMTP_HOST) {
    throw new Error("SMTP_HOST is required when EMAIL_PROVIDER=smtp");
  }
  return parsed.data;
}
