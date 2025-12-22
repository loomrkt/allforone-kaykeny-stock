/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Modal } from "@/components/modal";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import CreateUpdateDiscountForm from "./addDiscountForm";

interface AddDiscountButtonProps {
  onClick?: () => void;
  className?: string;
}
export function AddDiscountButton({
  onClick,
  className,
}: AddDiscountButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <div className="py-0 flex items-center justify-center">
      <button
        onClick={handleOpen}
        className="bg-accent text-white flex justify-center group/modal-btn relative px-6 py-2 rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:bg-primary focus:outline-none focus:ring-2 focus:ring-[#4F63F9] focus:ring-opacity-50"
      >
        <span className="max-sm:hidden group-hover/modal-btn:translate-x-40 text-center transition duration-500">
          Ajouter une promotion
        </span>
        <PlusCircle className="hidden max-sm:block" />
        <div className="-translate-x-40 max-sm:hidden group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
          <PlusCircle className="h-6 w-6" />
        </div>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        maxWidth="max-w-md"
        title={`Ajouter une  
        <span class="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-sm">Promotion</span>`}
      >
        <CreateUpdateDiscountForm onCancel={handleClose} />
      </Modal>
    </div>
  );
}
