import { describe, it, expect } from "vitest";
import { EnquiryService } from "./enquiryService.js";
import { CatalogueService } from "./catalogueService.js";
import { InMemoryProductSource, RecordingEmailSender } from "../testing/fixtures.js";
import { NotFoundError } from "../domain/errors.js";

function setup() {
  const email = new RecordingEmailSender();
  const catalogue = new CatalogueService(new InMemoryProductSource());
  const enquiries = new EnquiryService(catalogue, email, {
    salesInbox: "sales@test.dev",
    from: "noreply@test.dev",
  });
  return { email, enquiries };
}

describe("EnquiryService", () => {
  it("emails the sales inbox, with the customer as reply-to", async () => {
    const { email, enquiries } = setup();

    await enquiries.submit({
      productId: 2,
      name: "Ada",
      email: "ada@example.com",
      message: "Is this available in size M?",
    });

    expect(email.sent).toHaveLength(1);
    const [message] = email.sent;
    expect(message.to).toBe("sales@test.dev");
    expect(message.from).toBe("noreply@test.dev");
    expect(message.replyTo).toBe("ada@example.com");
    expect(message.subject).toContain("Gold ring");
    expect(message.text).toContain("Is this available in size M?");
    expect(message.text).toContain("Phone: not provided");
  });

  it("sends nothing and throws when the product does not exist", async () => {
    const { email, enquiries } = setup();

    await expect(
      enquiries.submit({ productId: 999, name: "Ada", email: "ada@example.com", message: "Hi" }),
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(email.sent).toHaveLength(0);
  });
});
