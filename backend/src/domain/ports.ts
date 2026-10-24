import type { Product } from "./product.js";

/** Where product data comes from. Swap the implementation without touching services or routes. */
export interface ProductSource {
  listProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | null>;
}

export interface EmailMessage {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
}

/** How outbound email is delivered. Console and SMTP implementations live in adapters/. */
export interface EmailSender {
  send(message: EmailMessage): Promise<void>;
}
