"use client";

import { deleteCollection } from "@/api/collection";
import { ToastAction } from "@/components/toastAction";
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
import { useToast } from "@/hooks/use-toast";
import Collection from "@/interfaces/collection";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useState } from "react";

function DeleteCollectionButton({ collection }: { collection: Collection }) {
  const [open, setOpen] = useState(false);
  const [submission, setSubmission] = useState({
    loading: false,
    error: false,
  });
  const toastUtils = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteCollection,
    onMutate: () => setSubmission({ loading: true, error: false }),
    onSuccess: () => {
      setSubmission({ loading: false, error: false });
      toastUtils.toast({
        title: "Modèle supprimé.",
        description: new Date().toLocaleDateString(),
        action: <ToastAction altText="Fermer">Fermer</ToastAction>,
      });
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      setOpen(false);
    },
    onError: () => {
      setSubmission({ loading: false, error: true });
      toastUtils.toast({
        title: "Échec de la suppression du modèle.",
        description: new Date().toLocaleDateString(),
        action: <ToastAction altText="Fermer">Fermer</ToastAction>,
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-destructive hover:bg-destructive cursor-default hover:text-white"
        >
          <Trash size={50} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{`Supprimer le modèle ${collection.name}`}</DialogTitle>
          <DialogDescription>
            Voulez-vous vraiment supprimer ce modèle ? Cette action est
            irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 justify-end">
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button
            className="bg-destructive cursor-default text-white"
            disabled={submission.loading}
            onClick={() => mutation.mutate(collection.id)}
          >
            {submission.loading ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteCollectionButton;
