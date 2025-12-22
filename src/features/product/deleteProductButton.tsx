import { deleteProduct } from "@/api/product";
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
import { Product } from "@/interfaces/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";

function DeleteProductButton({ product }: { product: Product }) {
  const [open, setOpen] = useState<boolean>(false);

  const toastUtils = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toastUtils.toast({
        title: "Produit supprimé.",
        description: new Date().toLocaleDateString(),
        action: <ToastAction altText="Fermer">Fermer</ToastAction>,
      });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["get-products"] });
    },
    onError: () => {
      toastUtils.toast({
        title: "Échec de la suppression du produit.",
        description: new Date().toLocaleDateString(),
        action: <ToastAction altText="Fermer">Fermer</ToastAction>,
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="text-destructive hover:bg-destructive cursor-default"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{`Supprimer le produit ${product.name}`}</DialogTitle>
          <DialogDescription>
            {`Voulez-vous vraiment supprimer ce produit ? Cette action est irréversible.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 justify-end">
          <Button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          >
            Annuler
          </Button>
          <Button
            className="text-white bg-destructive hover:bg-destructive/80"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate(product.id)}
          >
            {mutation.isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteProductButton;
