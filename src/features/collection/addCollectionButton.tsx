"use client";

import { Modal } from "@/components/modal";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import CreateUpdateCollectionForm from "./addCollectionForm";

interface AddCollectionButtonProps {
  onClick?: () => void;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AddCollectionButton({ onClick }: AddCollectionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <div className="py-0 flex items-center justify-center">
      <button
        onClick={handleOpen}
        className="bg-accent text-white flex justify-center group/modal-btn relative px-6 py-2 rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:bg-[#3b4fd9] focus:outline-none focus:ring-2 focus:ring-[#4F63F9] focus:ring-opacity-50"
      >
        <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
          Ajouter un modèle
        </span>
        <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
          <PlusCircle className="h-6 w-6" />
        </div>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={`Ajouter un 
        <span class="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-sm">modèle</span>`}
      >
        <CreateUpdateCollectionForm onCancel={handleClose} />
      </Modal>
    </div>
  );
}
