"use client";

import { getProducts } from "@/api/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Discount } from "@/interfaces/discount";
import type { Product } from "@/interfaces/product";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface DiscountCardDetailsProps {
  discount: Discount | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DiscountCardDetails({
  discount,
  isOpen,
  onClose,
}: DiscountCardDetailsProps) {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => (await getProducts({}))?.data || [],
  });

  if (!discount) return null;

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="animate-spin" size={16} />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const discountedProducts = products?.filter(
    (product) => discount?.productId && discount.productId.includes(product.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">
            Détails de la remise
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-semibold">Titre :</span> {discount.title}
          </div>
          <div>
            <span className="font-semibold">Valeur :</span> {discount.value}
            {discount.isPercentage ? " %" : " Ar"}
          </div>
          <div>
            <span className="font-semibold">Période :</span>{" "}
            {new Date(discount.startDate).toLocaleDateString()} -{" "}
            {new Date(discount.endDate).toLocaleDateString()}
          </div>

          <div>
            <span className="font-semibold">Produits concernés :</span>
            <ul className="list-disc ml-5">
              {discountedProducts?.map((product) => (
                <li key={product.id}>{product.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
