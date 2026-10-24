import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { EnquiryForm } from "./EnquiryForm";

describe("EnquiryForm", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("submits the enquiry to the API and shows a thank-you message", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ message: "Thank you" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<EnquiryForm productId={7} />);
    fireEvent.click(screen.getByRole("button", { name: "Enquire" }));
    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: "ada@example.com" } });
    fireEvent.change(screen.getByLabelText(/Message/), { target: { value: "Hi there" } });
    fireEvent.click(screen.getByRole("button", { name: "Send enquiry" }));

    expect(await screen.findByRole("status")).toBeTruthy();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/enquiries");
    expect(JSON.parse(init.body)).toMatchObject({
      productId: 7,
      name: "Ada",
      email: "ada@example.com",
      message: "Hi there",
    });
  });
});
