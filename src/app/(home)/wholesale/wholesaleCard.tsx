"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import WholeSale from "@/interfaces/wholesale";
import { getEntityName } from "@/lib/utils";
import { useProductStore } from "@/stores/product/productStore";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { UpdateWholesaleButton } from "./updateWholesaleButton";
import WholesaleDetailModal from "./wholesaleDetail";

interface WholesaleCardProps {
  data: WholeSale;
}

export default function WholesaleCard({ data }: WholesaleCardProps) {
  const { productIds, rules } = data;
  const firstRule = rules?.[0];

  const products = useProductStore(({ products }) => products);

  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Card className=" w-full cursor-pointer hover:shadow-md transition-all duration-300">
        <CardContent className="p-4 space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground mb-1">Produits</p>
              <UpdateWholesaleButton data={data} />
            </div>
            <div className="flex flex-wrap gap-2">
              {productIds.slice(0, 2).map((id) => (
                <Badge key={id} variant="secondary" className="text-xs">
                  {products ? getEntityName(products, id) : id}
                </Badge>
              ))}
              {productIds.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{productIds.length - 2} autres
                </Badge>
              )}
            </div>
          </div>

          {firstRule && (
            <div className="text-sm text-muted-foreground">
              Règle :{" "}
              <span className="font-medium text-black">
                {firstRule.minQuantity} - {firstRule.maxQuantity}
              </span>{" "}
              →{" "}
              <span className="text-green-600 font-semibold">
                {firstRule.value}%
              </span>
            </div>
          )}

          <div className="flex justify-end">
            <ArrowRight
              className="h-4 w-4 text-muted-foreground"
              onClick={() => setOpen(true)}
            />
          </div>
        </CardContent>
      </Card>
      <WholesaleDetailModal
        {...{ open, data, onClose: () => setOpen(false) }}
      />
    </>
  );
}
