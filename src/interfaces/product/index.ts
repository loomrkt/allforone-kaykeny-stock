import { Media } from "../common";

export type Product = {
  id: string;
  name: string;
  reference: string;
  gender: "M" | "F" | "U";
  images: Media[];
  price: number;
  coupe?: string;
  collectionId?: string;
  categoryId: string;
  transferPrice: number;
};
