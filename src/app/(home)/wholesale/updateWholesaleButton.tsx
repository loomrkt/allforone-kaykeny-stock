"use client";

import { Modal } from "@/components/modal"; // adapte selon ton projet
import { Button } from "@/components/ui/button";
import WholeSale from "@/interfaces/wholesale";
import { Edit } from "lucide-react";
import { useState } from "react";
import WholesaleForm from "./form";

export function UpdateWholesaleButton({ data }: { data: WholeSale }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  };
  const handleClose = () => setIsOpen(false);

  return (
    <div className="relative py-0 flex items-center justify-center">
      <Button
        variant={"ghost"}
        className="hover:bg-yellow-600 text-yellow-600"
        onClick={handleOpen}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Edit />
      </Button>

      <Modal
        isOpen={isOpen}
        maxWidth="max-w-2xl"
        onClose={handleClose}
        title={`Modifier une  
        <span class="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-sm">Remise</span>`}
      >
        <WholesaleForm data={data} />
      </Modal>
    </div>
  );
}
