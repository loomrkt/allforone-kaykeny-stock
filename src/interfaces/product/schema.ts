import { ProductDTO } from "@/api/product";
import { MAX_TOTAL_SIZE } from "@/constant/constant";
import * as z from "zod";

export const baseProductSchema = z.object({
  gender: z.enum(["M", "F", "U"]),
  price: z.number().nonnegative("Le prix doit être positif"),
  transferPrice: z
    .number()
    .nonnegative("Le prix de transfert doit être positif"),
  coupe: z.string().optional(),
  categoryId: z.string().min(1, "La catégorie est requise"),
  collectionId: z.string().optional(),
});

export const createProductSchema = baseProductSchema.extend({
  images: z
    .array(z.instanceof(File))
    .optional()
    .refine(
      (files) => {
        const totalSize = files?.reduce((acc, file) => acc + file.size, 0) ?? 0;
        return totalSize <= MAX_TOTAL_SIZE;
      },
      { message: "La taille totale des fichiers ne doit pas dépasser 25MB." }
    ),
});

export const updateProductSchema = baseProductSchema.extend({
  images: z
    .array(
      z.object({
        url: z.string().optional(),
        name: z.string().optional(),
      })
    )
    .optional(),
  newImages: z
    .array(z.instanceof(File))
    .optional()
    .refine(
      (files) => {
        const totalSize = files?.reduce((acc, file) => acc + file.size, 0) ?? 0;
        return totalSize <= MAX_TOTAL_SIZE;
      },
      { message: "La taille totale des fichiers ne doit pas dépasser 25MB." }
    ),
});

export const productDefaultValues: Partial<ProductDTO> = {
  gender: "U",
  coupe: "",
  categoryId: "",
  collectionId: "",
  images: [],
};
