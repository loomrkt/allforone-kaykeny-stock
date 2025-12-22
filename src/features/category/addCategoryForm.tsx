"use client";

import { CategoryDTO, createCategory, updateCategory } from "@/api/category";
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
import { Category } from "@/interfaces/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  code: z.string().min(1, "Le code est requis"),
  description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CreateUpdateCategoryFormProps {
  category?: Category;
  onCancel?: () => void;
  onClose?: () => void;
}

export default function CreateUpdateCategoryForm({
  category,
  onCancel,
  onClose,
}: CreateUpdateCategoryFormProps) {
  const toastUtils = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      code: category?.code || "",
      description: category?.description || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (newCategory: CategoryDTO) => {
      return category?.id
        ? updateCategory(category.id, newCategory)
        : createCategory(newCategory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toastUtils.showToast({
        title: category
          ? "Catégorie mise à jour avec succès"
          : "Catégorie créée avec succès",
        description: "La catégorie a été enregistrée avec succès.",
        variant: "default",
      });
      // Réinitialise le formulaire à un état vide après succès (création ou mise à jour)
      form.reset({
        name: "",
        code: "",
        description: "",
      });
      if (onCancel) onCancel();
      if (onClose) onClose();
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
    if (category) {
      form.reset({
        name: category.name,
        code: category.code,
        description: category.description || "",
      });
    } else {
      form.reset({ name: "", code: "", description: "" });
    }
  }, [category, form]);

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data as CategoryDTO);
  });

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de la catégorie</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Déscription</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code de référence</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="mr-2 rounded-lg py-2 px-6 text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                Annuler
              </Button>
            )}
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-primary hover:bg-primary/80 w-full text-white rounded-lg py-2 px-6"
            >
              {mutation.isPending
                ? "Envoi en cours..."
                : category
                ? "Mettre à jour"
                : "Créer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
