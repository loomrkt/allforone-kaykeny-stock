import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Product } from "@/interfaces/product";
import { Edit } from "lucide-react";
import { useState } from "react";
import { UpdateProductForm } from "./updateProductForm";

interface EditProductButtonProps {
  data: Product;
}

function EditProductButton({ data }: EditProductButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <div>
      <Button
        variant={"ghost"}
        className="text-yellow-600 hover:bg-yellow-600 cursor-default"
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
        maxWidth="max-w-full sm:max-w-[1000px]"
        title={`Modifier le
        <span class="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-sm">Produit</span>`}
      >
        <UpdateProductForm
          product={data}
          onCancel={handleClose}
          onSuccess={handleClose}
        />
      </Modal>
    </div>
  );
}

export default EditProductButton;
