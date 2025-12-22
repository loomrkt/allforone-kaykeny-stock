"use client";

import { cancelStockMovement } from "@/api/movement";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteMovementButtonProps {
  movementId: string;
  reference?: string;
  onDeleted?: () => void;
}

export const DeleteMovementButton = ({
  movementId,
  reference,
  onDeleted,
}: DeleteMovementButtonProps) => {
  const [open, setOpen] = useState(false);
  // const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      console.log("Attempting to cancel movement with ID:", movementId); // Debug
      return cancelStockMovement(movementId);
    },
    onSuccess: () => {
      toast.info("Mouvement annulé.");
      queryClient.invalidateQueries({ queryKey: ["get-movements"] });
      setOpen(false);
      onDeleted?.();
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erreur lors de l’annulation");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-destructive hover:bg-destructive/10"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Annuler le mouvement</DialogTitle>
          <DialogDescription>
            Voulez-vous vraiment annuler le mouvement {reference ?? ""} ? Cette
            action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          >
            Annuler
          </Button>
          <Button
            className="text-white bg-destructive hover:bg-destructive/90"
            disabled={mutation.isPending}
            onClick={(e) => {
              e.stopPropagation();
              mutation.mutate();
            }}
          >
            {mutation.isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
