"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-md",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        // className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} overflow-y-auto m-4`}
        className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} overflow-visible max-h-screen m-4`}
      >
        {title && (
          <DialogHeader className="p-6 border-b border-gray-200 flex items-center justify-between">
            <DialogTitle
              className="text-xl font-bold text-gray-800"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <DialogClose
              onClick={(e) => {
                e.stopPropagation();
              }}
              aria-label="Fermer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              ✕
            </DialogClose>
          </DialogHeader>
        )}

        <div className="p-6">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
