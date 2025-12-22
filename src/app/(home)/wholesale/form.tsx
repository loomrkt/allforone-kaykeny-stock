"use client";

import { createUpdateWholesale } from "@/api/wholesale";
import SelectMultipleProduct from "@/components/common/selectMultipleProduct";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import WholeSale from "@/interfaces/wholesale";
import WholeSaleSchema from "@/interfaces/wholesale/schema";
import { useProductStore } from "@/stores/product/productStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type FormValues = z.infer<typeof WholeSaleSchema>;

export default function WholesaleForm({ data }: { data?: WholeSale }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["create-update-wholesale"],
    mutationFn: createUpdateWholesale,
    onSuccess: () => {
      toast("Succes", {
        description: "Mouvements créé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["get-wholesale"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast("Erreur", {
        description: error.message,
      });
    },
  });
  const form = useForm<FormValues>({
    resolver: zodResolver(WholeSaleSchema),
    defaultValues: data
      ? { ...data }
      : {
          productIds: [],
          rules: [{ value: 0, minQuantity: 1, maxQuantity: 5 }],
        },
  });

  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    data?.productIds ? data.productIds : []
  );

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rules",
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  const products = useProductStore(({ products }) => products);

  useEffect(() => {
    form.setValue("productIds", selectedProducts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProducts]);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-2xl mx-auto"
      >
        <SelectMultipleProduct
          selected={selectedProducts}
          onChange={setSelectedProducts}
        />
        {/* Produits */}
        <FormField
          control={control}
          name="productIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Produits</FormLabel>
              <FormControl>
                <ScrollArea className="max-h-48 border rounded-md p-2">
                  <div className="flex flex-wrap gap-2">
                    {products?.map((product) => {
                      const selected = field.value.includes(product.id);
                      return (
                        <Fragment key={product.id}>
                          {selected ? (
                            <Button
                              type="button"
                              variant={selected ? "default" : "outline"}
                              onClick={() => {
                                field.onChange(
                                  selected
                                    ? field.value.filter(
                                        (id) => id !== product.id
                                      )
                                    : [...field.value, product.id]
                                );
                              }}
                            >
                              {product.name}
                            </Button>
                          ) : (
                            <></>
                          )}
                        </Fragment>
                      );
                    })}
                  </div>
                </ScrollArea>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Rules */}
        <div className="space-y-4 max-h-[40vh] overflow-y-auto">
          <FormLabel>Règles de remise</FormLabel>
          {fields.map((fieldRule, index) => (
            <div
              key={fieldRule.id}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
            >
              {/* minQuantity */}
              <FormField
                control={control}
                name={`rules.${index}.minQuantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantité minimale achetée</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(+e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* maxQuantity */}
              <FormField
                control={control}
                name={`rules.${index}.maxQuantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantité maximale achetée</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(+e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* value */}
              <FormField
                control={control}
                name={`rules.${index}.value`}
                render={({ field }) => (
                  <FormItem className="w-fit">
                    <FormLabel>Montant de la remise (en Ariary)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(+e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Delete button */}
              <Button
                type="button"
                variant="ghost"
                className="text-destructive w-fit"
                onClick={() => remove(index)}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const last = form.watch("rules")[fields.length - 1];
              const nextMin = last ? Number(last.maxQuantity) + 1 : 1;
              const nextValue = last ? Number(last.value) : 0;
              append({
                minQuantity: nextMin,
                maxQuantity: nextMin + 1,
                value: nextValue,
              });
            }}
          >
            Ajouter une règle
          </Button>
        </div>

        <Button type="submit" disabled={isSubmitting || mutation.isPending}>
          Enregistrer
        </Button>
      </form>
    </Form>
  );
}
