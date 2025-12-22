"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Size } from "@/interfaces/size";

interface Props {
  size: Size | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SizeCardDetails({ size, isOpen, onClose }: Props) {
  if (!size) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Détails de la taille
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Nom</p>
            <p className="text-base font-medium">{size.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Code</p>
            <p className="text-base font-medium">{size.code}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Catégorie</p>
            {/* <p className="text-base font-medium">{size.category.label}</p>{" "} */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
