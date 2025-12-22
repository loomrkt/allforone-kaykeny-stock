"use client";

import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import Depot from "@/interfaces/depot";
import { Edit } from "lucide-react";
import { useState } from "react";
import CreateUpdateDepotForm from "./addDepotForm";

interface EditDepotButtonProps {
  data: Depot;
}

function EditDepotButton({ data }: EditDepotButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Button
        className="text-yellow-600 hover:bg-yellow-600 hover:text-white cursor-default"
        variant={"ghost"}
        onClick={(e) => {
          e.stopPropagation();
          handleOpen();
        }}
      >
        <Edit />
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        maxWidth="max-w-lg"
        title={`Modifier le  
        <span class="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-sm">Depot</span>`}
      >
        <CreateUpdateDepotForm onCancel={handleClose} defaultValues={data} />
      </Modal>
    </>
  );
}

export default EditDepotButton;
