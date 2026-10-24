import nodemailer, { type Transporter } from "nodemailer";
import type { EmailMessage, EmailSender } from "../domain/ports.js";

/** Development default: prints the email to the terminal. No account required. */
export class ConsoleEmailSender implements EmailSender {
  async send(message: EmailMessage): Promise<void> {
    console.log(
      [
        "",
        "--- email (console provider) ---",
        `From: ${message.from}`,
        `To: ${message.to}`,
        `Reply-To: ${message.replyTo ?? "-"}`,
        `Subject: ${message.subject}`,
        "",
        message.text,
        "---",
      ].join("\n"),
    );
  }
}

export interface SmtpOptions {
  host: string;
  port: number;
  user?: string;
  pass?: string;
}

/** Sends through any SMTP server. Works with Mailtrap, SES SMTP, Gmail app passwords, etc. */
export class SmtpEmailSender implements EmailSender {
  private readonly transporter: Transporter;

  constructor(options: SmtpOptions) {
    this.transporter = nodemailer.createTransport({
      host: options.host,
      port: options.port,
      secure: options.port === 465,
      auth: options.user ? { user: options.user, pass: options.pass ?? "" } : undefined,
    });
  }

  async send(message: EmailMessage): Promise<void> {
    await this.transporter.sendMail({
      from: message.from,
      to: message.to,
      replyTo: message.replyTo,
      subject: message.subject,
      text: message.text,
    });
  }
}
