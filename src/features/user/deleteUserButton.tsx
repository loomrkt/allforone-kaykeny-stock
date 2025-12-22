"use client";

import { deleteUser } from "@/api/user";
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
import { User } from "@/interfaces/user/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useState } from "react";

function DeleteUserButton({ user }: { user: User }) {
  const [submission, setSubmission] = useState({
    loading: false,
    error: false,
  });

  const toastUtils = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteUser,
    onMutate: () => setSubmission({ loading: true, error: false }),
    onSuccess: () => {
      setSubmission({ loading: false, error: false });
      toastUtils.toast({
        title: "Utilisateur supprimé.",
        description: new Date().toLocaleDateString(),
        action: <ToastAction altText="Fermer">Fermer</ToastAction>,
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      setSubmission({ loading: false, error: true });
      toastUtils.toast({
        title: "Échec de la suppression d'utilisateur.",
        description: new Date().toLocaleDateString(),
        action: <ToastAction altText="Fermer">Fermer</ToastAction>,
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={(e) => e.stopPropagation()}
          variant="ghost"
          className="text-destructive hover:bg-destructive cursor-default hover:text-white"
        >
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{`Supprimer le dépôt ${user.lastName}`}</DialogTitle>
          <DialogDescription>
            {`Voulez-vous vraiment supprimer cette utilisateur ? Cette action est irréversible.`}
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
            onClick={(e) => {
              e.stopPropagation();
              mutation.mutate(user.id);
            }}
          >
            {submission.loading ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteUserButton;
