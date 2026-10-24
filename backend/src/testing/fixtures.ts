import type { Product } from "../domain/product.js";
import type { ProductSource } from "../domain/ports.js";
import type { EmailMessage, EmailSender } from "../domain/ports.js";

const img = "https://example.test/image.jpg";

export const sampleProducts: Product[] = [
  { id: 1, title: "Backpack for laptops", description: "Water resistant daily pack", price: 109.95, category: "men's clothing", image: img, rating: { rate: 3.9, count: 120 } },
  { id: 2, title: "Gold ring", description: "Solid gold ring with a sapphire", price: 695, category: "jewelery", image: img, rating: { rate: 4.6, count: 400 } },
  { id: 3, title: "Wireless headphones", description: "Noise cancelling over-ear", price: 64, category: "electronics", image: img, rating: { rate: 4.8, count: 300 } },
  { id: 4, title: "SSD drive", description: "1TB portable solid state", price: 109, category: "electronics", image: img, rating: { rate: 4.2, count: 90 } },
  { id: 5, title: "Winter jacket", description: "Warm waterproof jacket", price: 39, category: "women's clothing", image: img, rating: { rate: 4.1, count: 50 } },
  { id: 6, title: "Silver necklace", description: "Sterling silver chain", price: 168, category: "jewelery", image: img, rating: { rate: 4.5, count: 200 } },
  { id: 7, title: "Running shoes", description: "Lightweight mesh", price: 55, category: "men's clothing", image: img, rating: { rate: 4.4, count: 80 } },
  { id: 8, title: "Monitor stand", description: "Adjustable desk stand for laptop", price: 29, category: "electronics", image: img, rating: { rate: 4.0, count: 30 } },
  { id: 9, title: "Cotton dress", description: "Summer dress", price: 22, category: "women's clothing", image: img, rating: { rate: 3.5, count: 20 } },
];

export class InMemoryProductSource implements ProductSource {
  constructor(private readonly products: Product[] = sampleProducts) {}

  async listProducts(): Promise<Product[]> {
    return this.products;
  }

  async getProduct(id: number): Promise<Product | null> {
    return this.products.find((p) => p.id === id) ?? null;
  }
}

export class RecordingEmailSender implements EmailSender {
  readonly sent: EmailMessage[] = [];

  async send(message: EmailMessage): Promise<void> {
    this.sent.push(message);
  }
}
