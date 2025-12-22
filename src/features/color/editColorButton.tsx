"use client";

import { Button } from "@/components/ui/button";
import { Color } from "@/interfaces/color";
import { Edit } from "lucide-react";

interface EditColorButtonProps {
  data: Color;
  onClick: (color: Color) => void;
}

function EditColorButton({ data, onClick }: EditColorButtonProps) {
  return (
    <Button
      className="text-primary hover:bg-primary/10"
      variant="ghost"
      onClick={() => onClick(data)}
    >
      <Edit className="h-5 w-5" />
    </Button>
  );
}

export default EditColorButton;
