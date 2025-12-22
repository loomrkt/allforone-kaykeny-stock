import { z } from "zod";

const RuleSchema = z.object({
  value: z.number(),
  minQuantity: z.number(),
  maxQuantity: z.number(),
});

const WholeSaleSchema = z.object({
  productIds: z.array(z.string()),
  rules: z.array(RuleSchema),
});

export default WholeSaleSchema;
