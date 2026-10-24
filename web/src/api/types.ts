export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

export interface CategorySummary {
  name: string;
  slug: string;
}

export interface CategoryPage {
  category: string;
  topRated: Product[];
  products: Product[];
}

export interface EnquiryInput {
  productId: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
}
