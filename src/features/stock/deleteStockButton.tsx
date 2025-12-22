"use client";

import { deleteStock } from "@/api/stock";
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
import { Stock } from "@/interfaces/stock";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useState } from "react";

function StockProductButton({ stock }: { stock: Stock }) {
  const [submission, setSubmission] = useState({
    loading: false,
    error: false,
  });

  const toastUtils = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteStock,
    onMutate: () => setSubmission({ loading: true, error: false }),
    onSuccess: () => {
      setSubmission({ loading: false, error: false });
      toastUtils.toast({
        title: "Stock supprimé.",
        description: new Date().toLocaleDateString(),
        action: <ToastAction altText="Fermer">Fermer</ToastAction>,
      });
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
    },
    onError: () => {
      setSubmission({ loading: false, error: true });
      toastUtils.toast({
        title: "Échec de la suppression du stock.",
        description: new Date().toLocaleDateString(),
        action: <ToastAction altText="Fermer">Fermer</ToastAction>,
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-destructive text-white hover:bg-destructive/80">
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{`Supprimer le produit ${stock.productName}`}</DialogTitle>
          <DialogDescription>
            {`Voulez-vous vraiment supprimer ce produit du stock ? Cette action est irréversible.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 justify-end">
          <Button type="button">Annuler</Button>
          <Button
            className="text-white bg-destructive hover:bg-destructive/80"
            disabled={submission.loading}
            onClick={() => mutation.mutate(stock.id)}
          >
            {submission.loading ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default StockProductButton;
