import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import Movement from "@/interfaces/movement";
import { getEntityName } from "@/lib/utils";
import { useColorStore } from "@/stores/color/colorStore";
import { useSizeStore } from "@/stores/size/sizeStore";
import { DialogTitle } from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { useState } from "react";

interface MovementCardProps {
  movement: Movement;
}

export const MovementCard = ({ movement }: MovementCardProps) => {
  const [open, setOpen] = useState(false);

  const {
    type,
    reference,
    quantity,
    createdAt,
    sourceName,
    destinationName,
    colorId,
    sizeId,
    purchasePrice,
    email,
    productName,
  } = movement;
  const colors = useColorStore(({ colors }) => colors);
  const sizes = useSizeStore(({ sizes }) => sizes);
  const priceName = () => {
    if (movement?.type === "INBOUND") return "Prix d'achat";
    if (
      movement?.type === "OUTBOUND" &&
      (movement.isSale || !movement?.destinationId)
    )
      return "Prix de vente";
    if (
      movement?.type === "OUTBOUND" &&
      (!movement.isSale || movement?.destinationId)
    )
      return "Prix de transfert";
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card
          className="p-4 rounded-md shadow-sm border hover:bg-gray-50 transition cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="text-xs text-muted-foreground">
            {type === "INBOUND" ? "Entrée" : "Sortie"} | Ref :{" "}
            <span className="font-medium text-primary">{reference || "-"}</span>
          </div>
          <div className="text-sm font-medium">
            Produit : {productName || "-"}
          </div>
          <div className="text-sm">
            Qté : {quantity || 0} |{" "}
            {createdAt
              ? format(new Date(createdAt), "dd MMM yyyy")
              : "Date inconnue"}
          </div>
        </Card>
      </DialogTrigger>
      <DialogTitle />
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <h3 className="text-lg font-semibold">
            Détails du mouvement : {reference}
          </h3>
        </DialogHeader>
        <div className="text-sm space-y-2 pt-2">
          <div>
            <strong>Type :</strong> {type === "INBOUND" ? "Entrée" : "Sortie"}
          </div>
          <div>
            <strong>Référence :</strong> {reference || "-"}
          </div>
          <div>
            <strong>Produit :</strong> {productName || "-"}
          </div>
          <div>
            <strong>Quantité :</strong> {quantity || 0}
          </div>
          {colors ? (
            <div>
              <strong>Couleur :</strong> {getEntityName(colors, colorId)}
            </div>
          ) : (
            <></>
          )}
          {sizes ? (
            <div>
              <strong>Taille :</strong> {getEntityName(sizes, sizeId)}
            </div>
          ) : (
            <></>
          )}
          {type === "INBOUND" && (
            <div>
              <strong>Source :</strong> {sourceName || "-"}
            </div>
          )}
          {type === "OUTBOUND" && (
            <div>
              <strong>Destination :</strong> {destinationName || "-"}
            </div>
          )}
          {purchasePrice !== undefined && (
            <div>
              <strong>{priceName() ?? "Prix"} :</strong> {purchasePrice} Ar
            </div>
          )}
          <div>
            <strong>Date :</strong>{" "}
            {createdAt
              ? format(new Date(createdAt), "dd MMMM yyyy - HH:mm")
              : "-"}
          </div>
          <div>
            <strong>Utilisateur :</strong> {email || "-"}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
