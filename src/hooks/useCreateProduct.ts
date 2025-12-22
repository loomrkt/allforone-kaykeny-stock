// hooks/useCreateProduct.ts
import { createProduct } from "@/api/product";
import { useMutation } from "@tanstack/react-query";

export const useCreateProduct = () =>
  useMutation({
    mutationFn: createProduct,
  });
