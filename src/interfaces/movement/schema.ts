import { z } from "zod";

export const MovementInboundSchema = z.object({
  type: z.literal("INBOUND"),
  productId: z.string().min(1),
  quantity: z
    .number({ invalid_type_error: "La quantité doit être un nombre" })
    .min(1, { message: "La quantité doit être ≥ 1" })
    .optional(),

  depotId: z.string().optional(),
  colorId: z.string().min(1, { message: "champ requis" }),
  sizeId: z.string().min(1, { message: "champ requis" }),
  reference: z.string().min(1, { message: "Référence obligatoire" }),
  purchasePrice: z.number().min(1, { message: "Prix invalide" }),
  isReturn: z.boolean().optional(),
});

export const MovementOutBoundSchema = z.object({
  type: z.literal("OUTBOUND"),
  stockId: z.string().min(1),
  quantity: z
    .number({ invalid_type_error: "La quantité doit être un nombre" })
    .min(1, { message: "La quantité doit être ≥ 1" })
    .optional(),
  depotId: z.string().optional(),
  reference: z.string().optional(),
  applyWholesalePrice: z.boolean().optional(),
});

export const MovementSchema = z.discriminatedUnion("type", [
  MovementInboundSchema,
  MovementOutBoundSchema,
]);
