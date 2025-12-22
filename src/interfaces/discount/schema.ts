import { z } from "zod";

export const discountSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  productId: z
    .array(z.string())
    .min(1, "Veuillez sélectionner au moins un produit"),
  value: z.coerce
    .number()
    .min(1, "Veuillez entrer une valeur numérique valide"),
  isPercentage: z.boolean(),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

export type DiscountFormData = z.infer<typeof discountSchema>;
