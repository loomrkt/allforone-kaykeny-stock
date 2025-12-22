"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import Movement from "@/interfaces/movement";
import { getEntityName } from "@/lib/utils";
import { useDepotStore } from "@/stores/depot/depotStore";
import { DialogTitle } from "@radix-ui/react-dialog";
import { FolderInput, FolderOutput } from "lucide-react";

interface StockMovementDetailsDialogProps {
  stockMovement: Movement | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StockMovementDetailsDialog({
  stockMovement,
  isOpen,
  onClose,
}: StockMovementDetailsDialogProps) {
  const depots = useDepotStore(({ depots }) => depots);
  const priceName = () => {
    if (stockMovement?.type === "INBOUND") return "Prix d'achat";
    if (
      stockMovement?.type === "OUTBOUND" &&
      (stockMovement.isSale || !stockMovement?.destinationId)
    )
      return "Prix de vente";
    if (
      stockMovement?.type === "OUTBOUND" &&
      (!stockMovement.isSale || stockMovement?.destinationId)
    )
      return "Prix de transfert";
  };

  if (!stockMovement) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle />
      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto p-10">
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-10">
            <div className="flex max-sm:hidden items-center justify-center w-full h-full bg-primary/20 rounded-md">
              {stockMovement.type === "INBOUND" ? (
                <FolderInput size={60} className="text-primary/60" />
              ) : (
                <FolderOutput size={60} className="text-primary/60" />
              )}
            </div>
            <div className="grid gap-3">
              <h1 className="font-bold text-xl text-primary/80">
                {stockMovement.reference}
              </h1>
              <Detail
                label="Type"
                value={stockMovement?.type === "INBOUND" ? "Entrée" : "Sortie"}
              />
              <Detail label="Ref" value={stockMovement?.reference} />
              <Detail label="Produit" value={stockMovement?.productName} />
              <Detail
                label="Date"
                value={new Date(
                  stockMovement.createdAt ?? ""
                ).toLocaleDateString()}
              />
              <Detail label="Quantité" value={stockMovement.quantity} />
              {stockMovement?.sourceId ? (
                <Detail
                  label="Source"
                  value={
                    depots ? getEntityName(depots, stockMovement.sourceId) : ""
                  }
                />
              ) : (
                <></>
              )}
              {stockMovement.destinationId ? (
                <Detail
                  label="Destination"
                  value={
                    depots
                      ? getEntityName(depots, stockMovement.destinationId)
                      : ""
                  }
                />
              ) : (
                <></>
              )}
              <Detail
                label={priceName() ?? "Prix"}
                value={`${stockMovement.purchasePrice} Ar`}
              />
              <Detail label="Utilisateur" value={stockMovement.email} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) {
  return (
    <p className="flex items-end gap-2">
      <span className="font-semibold text-primary">{label} :</span>
      <span className="font-light text-primary/80">{value ?? "—"}</span>
    </p>
  );
}
