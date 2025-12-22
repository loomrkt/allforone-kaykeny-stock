"use client";

import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Discount } from "@/interfaces/discount";
import { Edit } from "lucide-react";
import { useState } from "react";
import CreateUpdateDiscountForm from "./addDiscountForm";

interface EditDiscountButtonProps {
  data: Discount;
}

function EditDiscountButton({ data }: EditDiscountButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => setIsOpen(false);

  const handleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleOpen();
  };

  return (
    <>
      <Button
        variant={"ghost"}
        className="hover:bg-yellow-600 text-yellow-600"
        onClick={handleEditClick}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Edit />
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        maxWidth="max-w-lg"
        title={`Modifier la  
        <span class="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-sm">Promotion</span>`}
      >
        <CreateUpdateDiscountForm onCancel={handleClose} defaultValues={data} />
      </Modal>
    </>
  );
}

export default EditDiscountButton;
