import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { FakeStoreProductSource } from "./adapters/fakeStoreProductSource.js";
import { ConsoleEmailSender, SmtpEmailSender } from "./adapters/emailSenders.js";
import { CatalogueService } from "./services/catalogueService.js";
import { EnquiryService } from "./services/enquiryService.js";
import type { EmailSender } from "./domain/ports.js";

// Composition root: the only place that chooses concrete implementations.
const config = loadConfig();

const email: EmailSender =
  config.EMAIL_PROVIDER === "smtp"
    ? new SmtpEmailSender({
        host: config.SMTP_HOST as string,
        port: config.SMTP_PORT,
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      })
    : new ConsoleEmailSender();

const catalogue = new CatalogueService(new FakeStoreProductSource(config.FAKESTORE_BASE_URL));
const enquiries = new EnquiryService(catalogue, email, {
  salesInbox: config.SALES_INBOX,
  from: config.EMAIL_FROM,
});

const app = createApp({ catalogue, enquiries });
app.listen(config.PORT, () => {
  console.log(`Catalogue API listening on http://localhost:${config.PORT}`);
});
