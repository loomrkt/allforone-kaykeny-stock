"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import WholeSale from "@/interfaces/wholesale";
import { getEntityName } from "@/lib/utils";
import { useProductStore } from "@/stores/product/productStore";

interface DiscountDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: WholeSale | null;
}

export default function WholesaleDetailModal({
  open,
  onClose,
  data,
}: DiscountDetailModalProps) {
  const products = useProductStore(({ products }) => products);
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de la configuration de remise</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Produits */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              Produits concernés :
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.productIds.map((id) => (
                <Badge key={id} variant="secondary">
                  {products ? getEntityName(products, id) : "-"}
                </Badge>
              ))}
            </div>
          </div>

          {/* Règles */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              Règles de remise :
            </h4>
            <ScrollArea className="h-40 pr-2">
              <ul className="space-y-2">
                {data.rules.map((rule, idx) => (
                  <li key={idx} className="border p-2 rounded-md shadow-sm">
                    <div className="text-sm text-muted-foreground">
                      Quantité :{" "}
                      <span className="font-medium">
                        {rule.minQuantity} - {rule.maxQuantity}
                      </span>
                    </div>
                    <div className="text-sm">
                      Remise :{" "}
                      <span className="text-green-600 font-semibold">
                        {rule.value}%
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
