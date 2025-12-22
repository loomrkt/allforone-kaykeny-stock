"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusSquare } from "lucide-react";
import { useState } from "react";
import CreateNewRoleForm from "./createNewRoleForm";

function CreateRoleButton() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black border-white/50" variant={"outline"}>
          <PlusSquare />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau rôle</DialogTitle>
        </DialogHeader>
        <CreateNewRoleForm />
      </DialogContent>
    </Dialog>
  );
}

export default CreateRoleButton;
