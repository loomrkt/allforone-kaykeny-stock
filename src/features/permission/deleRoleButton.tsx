import { deleteRole } from "@/api/role";
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
import { Role } from "@/interfaces/role&permission";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function DeleRoleButton({ role }: { role: Role }) {
  const [open, setOpen] = useState(false);
  const [submission, setSubmission] = useState({
    loading: false,
    error: false,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteRole,
    onMutate: () => setSubmission({ loading: true, error: false }),
    onSuccess: () => {
      setSubmission({ loading: false, error: false });
      toast("Succes", {
        description: "Role supprimé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setOpen(false);
    },
    onError: () => {
      setSubmission({ loading: false, error: true });
      toast("Succes", {
        description: "Erreur lors de la suppression",
      });
    },
  });
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(true)}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{`Supprimer le role ${role.name}`}</DialogTitle>
            <DialogDescription>
              Voulez-vous vraiment supprimer cette taille ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button onClick={() => setOpen(false)}>Annuler</Button>
            <Button
              className="bg-destructive cursor-default text-white"
              disabled={submission.loading}
              onClick={() => mutation.mutate(role.id)}
            >
              {submission.loading ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DeleRoleButton;
