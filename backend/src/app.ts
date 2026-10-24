import express, { type ErrorRequestHandler } from "express";
import { z } from "zod";
import { NotFoundError, UpstreamError } from "./domain/errors.js";
import { createApiRouter, type ApiDependencies } from "./http/routes.js";

/** Builds the Express app. No listening here, so tests can drive it directly. */
export function createApp(deps: ApiDependencies) {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "10kb" }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api", createApiRouter(deps));
  app.use(errorHandler);
  return app;
}

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof z.ZodError) {
    res.status(400).json({
      error: "Invalid request",
      issues: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
    return;
  }
  if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
    return;
  }
  if (err instanceof UpstreamError) {
    res.status(502).json({ error: err.message });
    return;
  }
  // Body-parser errors (malformed JSON, body too large) are safe to expose.
  if (typeof err === "object" && err !== null && (err as { expose?: boolean }).expose) {
    const httpErr = err as { status: number; message: string };
    res.status(httpErr.status).json({ error: httpErr.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};
