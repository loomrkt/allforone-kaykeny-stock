"use client";

import { deleteDepot } from "@/api/depot";
import { ToastAction } from "@/components/toastAction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Depot from "@/interfaces/depot";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useState } from "react";

function DeleteSupplierButton({ depot }: { depot: Depot }) {
  const [submission, setSubmission] = useState({
    loading: false,
    error: false,
  });

  const toastUtils = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteDepot,
    onMutate: () => setSubmission({ loading: true, error: false }),
    onSuccess: () => {
      setSubmission({ loading: false, error: false });
      toastUtils.toast({
        title: "Fournisseur supprimé.",
        description: new Date().toLocaleDateString(),
        action: <ToastAction altText="Fermer">Fermer</ToastAction>,
      });
      queryClient.invalidateQueries({ queryKey: ["depots"] });
    },
    onError: () => {
      setSubmission({ loading: false, error: true });
      toastUtils.toast({
        title: "Échec de la suppression du Fournisseur.",
        description: new Date().toLocaleDateString(),
        action: <ToastAction altText="Fermer">Fermer</ToastAction>,
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-destructive hover:bg-destructive cursor-default hover:text-white"
        >
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{`Supprimer le Fournisseur ${depot.name}`}</DialogTitle>
          <DialogDescription>
            {`Voulez-vous vraiment supprimer ce dépôt ? Cette action est irréversible.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Annuler
            </Button>
          </DialogClose>
          <Button
            className="text-white bg-destructive hover:bg-destructive/80"
            disabled={submission.loading}
            onClick={() => mutation.mutate(depot.id)}
          >
            {submission.loading ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteSupplierButton;
