"use client";

import { createDepot, DepotDTO, updateDepot } from "@/api/depot";
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
import Depot from "@/interfaces/depot";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const depotSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  adress: z.string().min(1, "L'adresse est requise"),
  contact: z.string().min(1, "Le contact est requis"),
  details: z.string().optional(),
  isSupplier: z.boolean(),
});

type DepotFormData = z.infer<typeof depotSchema>;

interface CreateUpdateDepotFormProps {
  onCancel?: () => void;
  defaultValues?: Depot;
}

export default function CreateUpdateDepotForm({
  onCancel,
  defaultValues,
}: CreateUpdateDepotFormProps) {
  const toastUtils = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<DepotFormData>({
    resolver: zodResolver(depotSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      adress: defaultValues?.adress || "",
      contact: defaultValues?.contact || "",
      details: defaultValues?.details || "",
      isSupplier: defaultValues?.isSupplier ?? false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (newDepot: DepotDTO) => {
      return defaultValues?.id
        ? updateDepot(defaultValues.id, newDepot)
        : createDepot(newDepot);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["depots"] });
      toastUtils.showToast({
        title: defaultValues
          ? "Dépôt mis à jour avec succès"
          : "Dépôt créé avec succès",
      });
      setTimeout(() => {
        router.push(`/depot`);
      }, 100);
      if (onCancel) onCancel();
    },
    onError: () => {
      toastUtils.showToast({
        title: "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data as DepotDTO);
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
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-white" placeholder="Nom" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="adress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-white"
                    placeholder="Adresse"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-white"
                    placeholder="Contact"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Détails</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-white"
                    placeholder="Détails"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-primary hover:bg-primary/80 w-full text-white rounded-lg py-2 px-6"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {mutation.isPending
                ? "Envoi en cours..."
                : defaultValues
                ? "Mettre à jour"
                : "Créer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
