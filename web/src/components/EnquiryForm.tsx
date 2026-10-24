import { useState, type FormEvent } from "react";
import { api, ApiError } from "../api/client";
import type { EnquiryInput } from "../api/types";

type Status = "idle" | "submitting" | "done";

export function EnquiryForm({ productId }: { productId: number }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const input: EnquiryInput = {
      productId,
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim() || undefined,
      message: String(data.get("message") ?? "").trim(),
    };

    setStatus("submitting");
    setError(null);
    try {
      await api.enquire(input);
      setStatus("done");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send your enquiry. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <p role="status" className="thanks">
        Thank you! Your enquiry has been sent and we will be in touch shortly.
      </p>
    );
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)}>
        Enquire
      </button>
    );
  }

  return (
    <form className="enquiry" onSubmit={onSubmit}>
      <label>
        Name
        <input name="name" required maxLength={100} />
      </label>
      <label>
        Email
        <input name="email" type="email" required maxLength={254} />
      </label>
      <label>
        Phone (optional)
        <input name="phone" type="tel" maxLength={30} />
      </label>
      <label>
        Message
        <textarea name="message" required maxLength={2000} rows={4} />
      </label>
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
