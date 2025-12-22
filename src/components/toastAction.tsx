"use client";

import * as React from "react";
import { Button } from "./ui/button";

interface ToastActionProps {
  altText: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const ToastAction = ({
  altText,
  children,
  onClick,
}: ToastActionProps) => {
  return (
    <Button
      onClick={onClick}
      className="ml-auto text-sm font-medium text-primary hover:underline"
      aria-label={altText}
    >
      {children}
    </Button>
  );
};
