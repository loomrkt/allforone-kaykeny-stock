"use client";

import { ColorDTO, createColor, updateColor } from "@/api/color";
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
import { Color } from "@/interfaces/color";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const colorSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  code: z.string().min(1, "Le code est requis"),
  hexaCode: z
    .string()
    .min(1, "Le code hexa est requis")
    .regex(/^#([0-9A-Fa-f]{6})$/, "Code hexadécimal invalide"),
});

type ColorFormData = z.infer<typeof colorSchema>;

interface CreateUpdateColorFormProps {
  color?: Color;
  onCancel?: () => void;
  onClose?: () => void;
}

export default function CreateUpdateColorForm({
  color,
  onCancel,
  onClose,
}: CreateUpdateColorFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ColorFormData>({
    resolver: zodResolver(colorSchema),
    defaultValues: {
      name: color?.name || "",
      code: color?.code || "",
      hexaCode: color?.hexaCode ? `#${color.hexaCode}` : "#000000",
    },
  });

  const mutation = useMutation({
    mutationFn: async (newColor: ColorDTO) => {
      return color?.id
        ? updateColor(color.id, newColor)
        : createColor(newColor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colors"] });
      toast({
        title: color
          ? "Couleur mise à jour avec succès"
          : "Couleur créée avec succès",
      });
      form.reset();
      if (onCancel) onCancel();
      if (onClose) onClose();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Une erreur est survenue",
        description: error?.message || "Veuillez réessayer plus tard.",
        // variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (color) {
      form.reset({
        name: color.name,
        code: color.code,
        hexaCode: color.hexaCode ? color.hexaCode : "#000000",
      });
    } else {
      form.reset({ name: "", code: "", hexaCode: "#000000" });
    }
  }, [color, form]);

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data as ColorDTO);
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
                <FormLabel>Nom de la couleur</FormLabel>
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
          <FormField
            control={form.control}
            name="hexaCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code Hexa</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="h-10 w-20 p-1"
                      aria-label="Sélectionner une couleur hexadécimale"
                    />
                    <Input
                      type="text"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="bg-white"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end pt-4 gap-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="rounded-lg py-4 px-6"
              >
                Annuler
              </Button>
            )}
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-primary hover:bg-primary/80 text-white rounded-lg py-4 px-6"
            >
              {mutation.isPending
                ? "Envoi en cours..."
                : color
                ? "Mettre à jour"
                : "Créer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
