"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Collection from "@/interfaces/collection";
import CreateUpdateCollectionForm from "./addCollectionForm";

interface CollectionFormModalProps {
  open: boolean;
  onClose: () => void;
  collection?: Collection | null;
}

export default function CollectionFormModal({
  open,
  onClose,
  collection,
}: CollectionFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>
            {collection ? "Modifier la collection" : "Nouvelle collection"}
          </DialogTitle>
        </DialogHeader>

        <CreateUpdateCollectionForm
          collection={collection || undefined}
          onCancel={onClose}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
