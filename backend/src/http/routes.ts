import { Router } from "express";
import { z } from "zod";
import type { CatalogueService } from "../services/catalogueService.js";
import type { EnquiryService } from "../services/enquiryService.js";
import { NotFoundError } from "../domain/errors.js";

export interface ApiDependencies {
  catalogue: CatalogueService;
  enquiries: EnquiryService;
}

const productIdSchema = z.coerce.number().int().positive();

const searchQuerySchema = z.object({
  q: z.string().trim().min(1, "Search term is required").max(100),
});

export const enquirySchema = z.object({
  productId: z.number().int().positive(),
  name: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .refine((v) => !/[\r\n]/.test(v), "Name must be a single line"),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().min(1).max(2000),
});

export function createApiRouter({ catalogue, enquiries }: ApiDependencies): Router {
  const router = Router();

  router.get("/featured", async (_req, res) => {
    res.json({ items: await catalogue.getFeatured() });
  });

  router.get("/categories", async (_req, res) => {
    res.json({ items: await catalogue.listCategories() });
  });

  router.get("/categories/:slug", async (req, res) => {
    const page = await catalogue.getCategory(req.params.slug);
    if (!page) throw new NotFoundError(`Category "${req.params.slug}" not found`);
    res.json(page);
  });

  router.get("/search", async (req, res) => {
    const { q } = searchQuerySchema.parse(req.query);
    res.json({ items: await catalogue.search(q) });
  });

  router.get("/products/:id", async (req, res) => {
    const id = productIdSchema.parse(req.params.id);
    res.json(await catalogue.getProduct(id));
  });

  router.post("/enquiries", async (req, res) => {
    const enquiry = enquirySchema.parse(req.body);
    await enquiries.submit(enquiry);
    res.status(201).json({
      message: "Thank you for your enquiry. We will be in touch shortly.",
    });
  });

  return router;
}
