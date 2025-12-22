"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/interfaces/user/user";

interface UserCardDetailsProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserCardDetails({
  user,
  isOpen,
  onClose,
}: UserCardDetailsProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {`Détails de l'utilisateur`}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-semibold">Prénom :</span>{" "}
            {user.firstName || "-"}
          </div>
          <div>
            <span className="font-semibold">Nom :</span> {user.lastName || "-"}
          </div>
          <div>
            <span className="font-semibold">Email :</span> {user.email}
          </div>

          {/* <div>
            <span className="font-semibold">Mis à jour le :</span>{" "}
            {user.updatedAt
              ? new Date(user.updatedAt).toLocaleDateString("fr-FR")
              : "-"}
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
