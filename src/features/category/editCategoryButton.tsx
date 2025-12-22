"use client";

import { Button } from "@/components/ui/button";
import { Category } from "@/interfaces/category";
import { Edit } from "lucide-react";

interface EditSizeButtonProps {
  data: Category;
  onClick?: () => void;
}

function EditSizeButton({ onClick }: EditSizeButtonProps) {
  return (
    <Button
      variant={"ghost"}
      className="text-yellow-600 hover:bg-yellow-600 cursor-default hover:text-white"
      onClick={onClick}
    >
      <Edit />
    </Button>
  );
}

export default EditSizeButton;
