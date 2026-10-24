import type { EmailSender } from "../domain/ports.js";
import type { CatalogueService } from "./catalogueService.js";

export interface Enquiry {
  productId: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface EnquiryOptions {
  salesInbox: string;
  from: string;
}

export class EnquiryService {
  constructor(
    private readonly catalogue: CatalogueService,
    private readonly email: EmailSender,
    private readonly options: EnquiryOptions,
  ) {}

  /** Throws NotFoundError before sending anything if the product does not exist. */
  async submit(enquiry: Enquiry): Promise<void> {
    const product = await this.catalogue.getProduct(enquiry.productId);

    await this.email.send({
      from: this.options.from,
      to: this.options.salesInbox,
      replyTo: enquiry.email,
      subject: `New enquiry: ${product.title} (#${product.id})`,
      text: [
        `Product: ${product.title} (#${product.id})`,
        `Name: ${enquiry.name}`,
        `Email: ${enquiry.email}`,
        `Phone: ${enquiry.phone ?? "not provided"}`,
        "",
        enquiry.message,
      ].join("\n"),
    });
  }
}
