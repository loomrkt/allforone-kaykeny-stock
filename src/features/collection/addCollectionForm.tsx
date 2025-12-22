"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { createCollection, updateCollection } from "@/api/collection";
import { InputFileWithPreviewImage } from "@/components/common/inputFileWithPreviewImage";
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
import Collection from "@/interfaces/collection";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const collectionSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  code: z.string().min(1, "Le code est requis"),
  description: z.string().optional(),
  image: z.instanceof(File).optional().nullable(),
});

type CollectionFormData = z.infer<typeof collectionSchema>;

interface CreateUpdateCollectionFormProps {
  collection?: Collection;
  onCancel?: () => void;
  onClose?: () => void;
}

export default function CreateUpdateCollectionForm({
  collection,
  onCancel,
  onClose,
}: CreateUpdateCollectionFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const toastUtils = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const form = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      image: null,
    },
  });

  useEffect(() => {
    if (collection) {
      form.reset({
        name: collection.name,
        code: collection.code,
        description: collection.description || "",
        image: null,
      });
    } else {
      form.reset({
        name: "",
        code: "",
        description: "",
        image: null,
      });
    }
  }, [collection, form]);

  const mutation = useMutation({
    mutationFn: async (newData: CollectionFormData) => {
      if (collection?.id) {
        return updateCollection(collection.id, {
          name: newData.name,
          code: newData.code,
          description: newData.description || "",
          image: newData.image instanceof File ? newData.image : undefined,
          imageName: collection.imageName,
          imageUrl: collection.imageUrl,
        });
      } else {
        return createCollection({
          name: newData.name,
          code: newData.code,
          description: newData.description || "",
          image: newData.image instanceof File ? newData.image : undefined,
          imageName: "",
          imageUrl: "",
        });
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toastUtils.showToast({
        title: collection
          ? "Modèle mis à jour avec succès"
          : "Modèle créé avec succès",
      });
      form.reset();
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (onCancel) onCancel();
      if (onClose) onClose();
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  useEffect(() => {
    console.log("collection :>> ", collection);
  }, [collection]);

  return (
    <div
      className="w-full p-2 max-h-[60vh] overflow-y-auto"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du modèle</FormLabel>
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description du modèle</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputFileWithPreviewImage
                    name="image"
                    form={form}
                    label="Image représentative"
                    defaultFiles={
                      collection?.imageUrl
                        ? {
                            url: collection.imageUrl,
                            name: collection.imageName || "image",
                            isCover: false,
                          }
                        : undefined
                    }
                    isUpdate={!!collection}
                    updateName="image"
                    isReset={mutation.isSuccess}
                    onChange={(file) => field.onChange(file)}
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
            >
              {mutation.isPending
                ? "Envoi en cours..."
                : collection
                ? "Mettre à jour"
                : "Créer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
