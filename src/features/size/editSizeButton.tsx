"use client";

import { Button } from "@/components/ui/button";
import { Size } from "@/interfaces/size";
import { Edit } from "lucide-react";

interface EditSizeButtonProps {
  data: Size;
  onClick?: () => void;
}

function EditSizeButton({ onClick }: EditSizeButtonProps) {
  return (
    <Button
      className="text-yellow-600 hover:bg-yellow-600 hover:text-white cursor-default"
      variant={"ghost"}
      onClick={onClick}
    >
      <Edit />
    </Button>
  );
}

export default EditSizeButton;
