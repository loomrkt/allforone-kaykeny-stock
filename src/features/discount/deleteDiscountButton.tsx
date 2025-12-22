"use client";
import { deleteDiscount } from "@/api/discount";
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
import { Discount } from "@/interfaces/discount";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";

function DeleteDiscountButton({ discount }: { discount: Discount }) {
  const [open, setOpen] = useState<boolean>(false);
  const [submission, setSubmission] = useState({
    loading: false,
    error: false,
  });

  const toastUtils = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteDiscount,
    onMutate: () => setSubmission({ loading: true, error: false }),
    onSuccess: () => {
      setSubmission({ loading: false, error: false });
      toastUtils.toast({
        title: "Promotion supprimée.",
        description: new Date().toLocaleDateString(),
        action: <ToastAction altText="Fermer">Fermer</ToastAction>,
      });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["get-discounts"] });
    },
    onError: () => {
      setSubmission({ loading: false, error: true });
      toastUtils.toast({
        title: "Échec de la suppression de la promotion.",
        description: new Date().toLocaleDateString(),
        action: <ToastAction altText="Fermer">Fermer</ToastAction>,
      });
    },
  });

  const handleTriggerClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setOpen(true);
  };

  return (
    <Dialog {...{ open, onOpenChange: setOpen }}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="hover:bg-destructive/80 text-destructive"
          onClick={handleTriggerClick}
        >
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{`Supprimer la promotion ${discount.title}`}</DialogTitle>
          <DialogDescription>
            {`Voulez-vous vraiment supprimer cette promotion ? Cette action est irréversible.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 justify-end">
          <Button type="button" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button
            className="text-white bg-destructive hover:bg-destructive/80"
            disabled={submission.loading}
            onClick={() => mutation.mutate(discount.id)}
          >
            {submission.loading ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteDiscountButton;
