"use client";

import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { User } from "@/interfaces/user/user";
import { useAuthStore } from "@/stores/auth";
import { Edit } from "lucide-react";
import { useState } from "react";
import CreateUpdateUserForm from "./addUserForm";

interface EditUserButtonProps {
  data: User;
}

function EditUserButton({ data }: EditUserButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Button
        className="hover:bg-yellow-500 text-yellow-500 hover:text-white"
        variant={"ghost"}
        onClick={(e) => handleOpen(e)}
      >
        <Edit onClick={(e) => e.stopPropagation()} />
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        maxWidth="max-w-lg"
        title={`Modifier l'utilisateur <span class="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-sm">${data.firstName} ${data.lastName}</span>`}
      >
        <CreateUpdateUserForm
          onCancel={handleClose}
          defaultValues={data}
          currentUserId={user?.id}
        />
      </Modal>
    </>
  );
}

export default EditUserButton;
