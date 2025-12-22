"use client";

import { Button } from "@/components/ui/button";
import Collection from "@/interfaces/collection";
import { Edit } from "lucide-react";

interface EditCollectionButtonProps {
  data: Collection;
  onClick?: () => void;
}

function EditCollectionButton({ onClick }: EditCollectionButtonProps) {
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

export default EditCollectionButton;
