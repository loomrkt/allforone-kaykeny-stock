"use client";

import { createSize, SizeDTO, updateSize } from "@/api/size";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Size } from "@/interfaces/size";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const Category = {
  Enfant: "CHILD",
  Adulte: "ADULT",
} as const;

const sizeSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  code: z.string().min(1, { message: "Le code est requis" }),
  description: z.string().optional(),
  category: z.enum(["CHILD", "ADULT"], {
    errorMap: () => ({ message: "La catégorie est requise" }),
  }),
});

type SizeFormData = z.infer<typeof sizeSchema>;

interface CreateUpdateSizeFormProps {
  size?: Size;
  onCancel?: () => void;
  onClose?: () => void;
}

export default function CreateUpdateSizeForm({
  size,
  onCancel,
  onClose,
}: CreateUpdateSizeFormProps) {
  const queryClient = useQueryClient();
  const toastUtils = useToast();

  const form = useForm<SizeFormData>({
    resolver: zodResolver(sizeSchema),
    defaultValues: {
      name: size?.name || "",
      code: size?.code || "",
      description: size?.description || "",
      category: size?.category || "CHILD",
    },
  });

  const mutation = useMutation({
    mutationFn: async (newSize: SizeDTO) =>
      size?.id ? updateSize(size.id, newSize) : createSize(newSize),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
      toastUtils.showToast({
        title: size
          ? "Taille mise à jour avec succès"
          : "Taille créée avec succès",
        variant: "default",
      });
      form.reset({
        name: "",
        code: "",
        description: "",
        category: "CHILD",
      });
      if (onCancel) onCancel();
      if (onClose) onClose();
    },
    onSettled: () => {
      if (size && onClose) onClose();
    },
    onError: (error) => {
      toastUtils.showToast({
        title: "Une erreur est survenue",
        description:
          error instanceof Error ? error.message : "Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (size) {
      form.reset({
        name: size.name,
        code: size.code,
        description: size.description || "",
        category: size.category || "CHILD",
      });
    } else {
      form.reset({ name: "", code: "", description: "", category: "CHILD" });
    }
  }, [size, form]);

  const onSubmit = (data: SizeFormData) => {
    mutation.mutate(data as SizeDTO);
  };

  return (
    <div className="w-full p-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  Nom de la taille
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-white border-gray-300 focus:border-primary focus:ring-primary"
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  Guide de taille
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-white border-gray-300 focus:border-primary focus:ring-primary"
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  Code de référence
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-white border-gray-300 focus:border-primary focus:ring-primary"
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-700">
                  Catégorie associée
                </FormLabel>
                <FormControl>
                  <select
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value as "CHILD" | "ADULT")
                    }
                    className="w-full p-2 bg-white border-gray-300 rounded-md focus:border-primary focus:ring-primary"
                  >
                    <option value={Category.Enfant}>Enfant</option>
                    <option value={Category.Adulte}>Adulte</option>
                  </select>
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-4">
            {size && onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="rounded-lg py-2 px-6 text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                Annuler
              </Button>
            )}
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-primary hover:bg-primary/90 text-white rounded-lg py-2 px-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {mutation.isPending
                ? "Envoi en cours..."
                : size
                ? "Mettre à jour"
                : "Créer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
