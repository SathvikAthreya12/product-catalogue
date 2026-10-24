/** Thrown when a requested resource does not exist. Mapped to HTTP 404. */
export class NotFoundError extends Error {}

/** Thrown when an upstream dependency (product data) is unavailable. Mapped to HTTP 502. */
export class UpstreamError extends Error {}
