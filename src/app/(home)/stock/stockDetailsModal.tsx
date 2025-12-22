/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductQRCode from "@/features/stock/qrCode";
import { Color } from "@/interfaces/color";
import { Stock } from "@/interfaces/stock";

interface StockCardDetailsProps {
  stock: Stock | null;
  isOpen: boolean;
  onClose: () => void;
  colors: Color[];
}

const getContrastTextColor = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "black" : "white";
};

export function StockCardDetails({
  stock,
  isOpen,
  onClose,
  colors,
}: StockCardDetailsProps) {
  if (!stock) return null;

  const color = colors.find((c) => c.id === stock.colorId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            <Badge variant={"outline"}>{stock.productName}</Badge>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Détails du stock
          </DialogDescription>
        </DialogHeader>

        <ProductQRCode stock={stock} />
        <div className="mt-6 space-y-4">
          {/* <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-2 items-center">
              <span className="font-semibold text-muted-foreground">
                Produit :
              </span>
              <span>{stock.productName}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <span className="font-semibold text-muted-foreground">
                Taille :
              </span>
              <span>{stock.sizeName}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <span className="font-semibold text-muted-foreground">
                Couleur :
              </span>
              <div className="flex items-center gap-2">
                {color ? (
                  <div
                    className="px-2 py-1 rounded text-xs font-semibold shadow"
                    style={{
                      backgroundColor: color.hexaCode,
                      color: getContrastTextColor(color.hexaCode),
                    }}
                  >
                    {stock.colorName}
                  </div>
                ) : (
                  <span>{stock.colorName}</span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <span className="font-semibold text-muted-foreground">
                Quantité :
              </span>
              <span>{stock.quantity}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <span className="font-semibold text-muted-foreground">
                Prix de vente :
              </span>
              <span className="text-primary font-medium">{stock.price} Ar</span>
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <span className="font-semibold text-muted-foreground">
                {`  Prix de transfert :`}
              </span>
              <span>{stock.transferPrice} Ar</span>
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <span className="font-semibold text-muted-foreground">
                Sexe :
              </span>
              <span>{stock.ageGroup === "ADULTE" ? "Adulte" : "Enfant"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <span className="font-semibold text-muted-foreground">
                Dépôt :
              </span>
              <span>{stock.depotName}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <span className="font-semibold text-muted-foreground">
                Ajouté le :
              </span>
              <span>{new Date(stock.createdAt).toLocaleDateString()}</span>
            </div>
          </div> */}

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
