"use client";

import { createDiscount, updateDiscount } from "@/api/discount";
import SelectMultipleProduct from "@/components/common/selectMultipleProduct";
import { DateRangePicker } from "@/components/date-range-picker";
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
import { useToast } from "@/hooks/use-toast";
import { Discount } from "@/interfaces/discount";
import { DiscountFormData, discountSchema } from "@/interfaces/discount/schema";
import { useProductStore } from "@/stores/product/productStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface CreateUpdateDiscountFormProps {
  defaultValues?: Discount;
  onCancel?: () => void;
}

export default function CreateUpdateDiscountForm({
  defaultValues,
  onCancel,
}: CreateUpdateDiscountFormProps) {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();

  const products = useProductStore(({ products }) => products);

  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    defaultValues?.productId || []
  );

  const initialFormValues: DiscountFormData = defaultValues
    ? {
        title: defaultValues.title,
        productId: defaultValues.productId,
        value: defaultValues.value,
        isPercentage: defaultValues.isPercentage,
        dateRange: {
          from: new Date(defaultValues.startDate),
          to: new Date(defaultValues.endDate),
        },
      }
    : {
        title: "",
        productId: [],
        value: undefined as unknown as number,
        isPercentage: undefined as unknown as boolean,
        dateRange: undefined as unknown as { from: Date; to: Date },
      };

  const form = useForm<DiscountFormData>({
    resolver: zodResolver(discountSchema),
    defaultValues: initialFormValues,
  });

  const mutation = useMutation({
    mutationFn: async (data: DiscountFormData) => {
      const dto = {
        title: data.title,
        productId: data.productId,
        value: data.value,
        isPercentage: true,
        startDate: data.dateRange?.from?.toISOString(),
        endDate: data.dateRange?.to?.toISOString(),
        isValide: defaultValues ? defaultValues.isValide : true,
        isDeleted: defaultValues ? defaultValues.isDeleted : false,
        createdAt: defaultValues
          ? defaultValues.createdAt
          : new Date().toISOString(),
      };

      if (defaultValues?.id) {
        return updateDiscount(defaultValues.id, dto);
      } else {
        return createDiscount(dto);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-discounts"] });
      toast.showToast({
        title: defaultValues ? "Réduction mise à jour" : "Réduction créée",
      });
      router.push("/discount");
      onCancel?.();
    },
    onError: () => {
      toast.showToast({
        title: "Erreur lors de l'enregistrement",
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  useEffect(() => {
    form.setValue("productId", selectedProducts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProducts]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="PROMO ÉTÉ"
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SelectMultipleProduct
          selected={selectedProducts}
          onChange={setSelectedProducts}
        />

        <FormField
          control={form.control}
          name="productId"
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
                          ) : null}
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

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valeur en pourcentage(%)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  placeholder="Ex: 50"
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Période</FormLabel>
              <DateRangePicker date={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-primary text-white"
          >
            {mutation.isPending
              ? "Enregistrement..."
              : defaultValues
              ? "Mettre à jour"
              : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
