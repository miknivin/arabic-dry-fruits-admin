export interface Product {
  _id?: string;
  name: string;
  sku: string;
  price: number;
  discountPrice: number;
  actualPrice?: number;
  description: string;
  stock?: number;
  shortDescription: string;
  features: string[];
  variants: Array<{
    size: "100gm" | "200gm" | "250gm" | "500gm" | "1kg" | "2kg";
    price: number;
    discountPrice: number | null;
    imageUrl?: string[];
  }>;
  stockQuantity: number;
 
  category: "Nuts" | "Dates" | "Seeds" | "Dry Fruits" | "Spices" | "";
  mainImage?: string;
  color?: {
    primaryColor?: string;
  };
  images: Array<{
    _id?: any;
    url: string;
    alt?: string;
  }>;
  averageRating: number;
  reviews?: Array<{
    user: string; // ObjectId (User reference)
    ratings: number;
    comment: string;
  }>;
  user?: string; // ObjectId (User reference)
  createdAt: Date;
  updatedAt: Date;
}
