"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createProduct, ProductDTO } from "@/api/product";
import { toast } from "@/hooks/use-toast";
import {
  createProductSchema,
  productDefaultValues,
} from "@/interfaces/product/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ProductForm } from "./form";

type CreateProductFormData = z.infer<typeof createProductSchema>;

interface Props {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateProductForm({ onSuccess }: Props) {
  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: productDefaultValues,
  });

  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: ["create-product"],
    mutationFn: (newProduct: ProductDTO) => createProduct(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-products"] });
      toast({
        title: "Produit créé avec succès",
      });

      // todo: create path file
      router.push(`/product`);

      form.reset();
      if (onSuccess) onSuccess();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
      });
    },
  });

  return <ProductForm form={form} mutation={mutation} />;
}
