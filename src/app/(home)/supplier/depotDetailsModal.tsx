"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type Depot from "@/interfaces/depot";

interface DepotCardDetailsProps {
  depot: Depot | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DepotCardDetails({
  depot,
  isOpen,
  onClose,
}: DepotCardDetailsProps) {
  if (!depot) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">
            Détails du Fournisseur
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-semibold">Nom :</span> {depot.name}
          </div>
          <div>
            <span className="font-semibold">Adresse :</span> {depot.adress}
          </div>
          <div>
            <span className="font-semibold">Détails :</span> {depot.details}
          </div>
          {/* <div>
            <span className="font-semibold">Fournisseur :</span>{" "}
            {depot.isSupplier ? "Oui" : "Non"}
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
