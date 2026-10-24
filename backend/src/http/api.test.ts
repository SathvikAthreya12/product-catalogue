import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";
import { CatalogueService } from "../services/catalogueService.js";
import { EnquiryService } from "../services/enquiryService.js";
import { InMemoryProductSource, RecordingEmailSender } from "../testing/fixtures.js";

function buildApp() {
  const email = new RecordingEmailSender();
  const catalogue = new CatalogueService(new InMemoryProductSource());
  const enquiries = new EnquiryService(catalogue, email, {
    salesInbox: "sales@test.dev",
    from: "noreply@test.dev",
  });
  return { app: createApp({ catalogue, enquiries }), email };
}

describe("HTTP API", () => {
  it("GET /api/featured returns five products", async () => {
    const { app } = buildApp();
    const res = await request(app).get("/api/featured");
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(5);
  });

  it("GET /api/categories returns name and slug", async () => {
    const { app } = buildApp();
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(200);
    expect(res.body.items[0]).toEqual({ name: "electronics", slug: "electronics" });
  });

  it("GET /api/categories/:slug returns top-rated and additional products", async () => {
    const { app } = buildApp();
    const res = await request(app).get("/api/categories/electronics");
    expect(res.status).toBe(200);
    expect(res.body.topRated).toHaveLength(2);
    expect(res.body.products).toHaveLength(1);
  });

  it("GET /api/categories/:slug returns 404 for an unknown category", async () => {
    const { app } = buildApp();
    const res = await request(app).get("/api/categories/garden");
    expect(res.status).toBe(404);
  });

  it("GET /api/search returns only matching products", async () => {
    const { app } = buildApp();
    const res = await request(app).get("/api/search").query({ q: "ring" });
    expect(res.status).toBe(200);
    expect(res.body.items.map((p: { id: number }) => p.id)).toEqual([2]);
  });

  it("GET /api/search rejects an empty term", async () => {
    const { app } = buildApp();
    const res = await request(app).get("/api/search").query({ q: "   " });
    expect(res.status).toBe(400);
  });

  it("GET /api/products/:id returns the product", async () => {
    const { app } = buildApp();
    const res = await request(app).get("/api/products/3");
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Wireless headphones");
  });

  it("GET /api/products/:id returns 404 when unknown and 400 when not numeric", async () => {
    const { app } = buildApp();
    expect((await request(app).get("/api/products/999")).status).toBe(404);
    expect((await request(app).get("/api/products/abc")).status).toBe(400);
  });

  it("POST /api/enquiries sends an email and returns 201 with a thank-you message", async () => {
    const { app, email } = buildApp();
    const res = await request(app).post("/api/enquiries").send({
      productId: 2,
      name: "Ada",
      email: "ada@example.com",
      message: "Is this available?",
    });
    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/Thank you/);
    expect(email.sent).toHaveLength(1);
  });

  it("POST /api/enquiries rejects an invalid email without sending", async () => {
    const { app, email } = buildApp();
    const res = await request(app).post("/api/enquiries").send({
      productId: 2,
      name: "Ada",
      email: "not-an-email",
      message: "Hi",
    });
    expect(res.status).toBe(400);
    expect(email.sent).toHaveLength(0);
  });

  it("POST /api/enquiries rejects a name containing a line break (header injection)", async () => {
    const { app, email } = buildApp();
    const res = await request(app).post("/api/enquiries").send({
      productId: 2,
      name: "Ada\r\nBcc: attacker@example.com",
      email: "ada@example.com",
      message: "Hi",
    });
    expect(res.status).toBe(400);
    expect(email.sent).toHaveLength(0);
  });

  it("POST /api/enquiries returns 404 for an unknown product", async () => {
    const { app } = buildApp();
    const res = await request(app).post("/api/enquiries").send({
      productId: 999,
      name: "Ada",
      email: "ada@example.com",
      message: "Hi",
    });
    expect(res.status).toBe(404);
  });
});
