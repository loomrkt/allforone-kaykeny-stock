"use client";

import { getPieceCounter, MovementInboundDTO } from "@/api/movement";
import SelectColor from "@/components/common/selectColor";
import SelectDepot from "@/components/common/selectDepot";
import SelectProduct from "@/components/common/selectProduct";
import SelectSize from "@/components/common/selectSize";
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
import { MovementInboundSchema } from "@/interfaces/movement/schema";
import { useDepotStore } from "@/stores/depot/depotStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import MovementInboundList from "./movementInboundList";

export function MovementInboundForm({
  isReturn,
  setIsFreeze,
}: {
  isReturn?: boolean;
  setIsFreeze?: (value: boolean) => void;
}) {
  const supplierDepots = useDepotStore(({ supplierDepots }) => supplierDepots);
  const { data: piece, refetch } = useQuery({
    queryKey: ["get-piece-counter"],
    queryFn: getPieceCounter,
  });

  const [movementList, setMovementList] = useState<MovementInboundDTO[]>([]);

  const form = useForm<MovementInboundDTO>({
    resolver: zodResolver(MovementInboundSchema),
    mode: "onChange",
    defaultValues: {
      type: "INBOUND",
      productId: "",
      quantity: undefined,
      depotId: "",
      colorId: "",
      sizeId: "",
      reference: "",
      purchasePrice: undefined,
      isReturn: isReturn ? true : false,
    },
  });

  const onSubmit = (data: MovementInboundDTO) => {
    setMovementList((prev) => [...prev, data]);
    form.setValue("productId", "");
    form.setValue("colorId", "");
    form.setValue("sizeId", "");
  };

  const handleDelete = (index: number) => {
    setMovementList((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (movementList.length && setIsFreeze) setIsFreeze(true);
    if (!movementList.length && setIsFreeze) setIsFreeze(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movementList]);

  useEffect(() => {
    let reference = isReturn ? "RET-2025-0" : "ENT-2025-0";
    if (piece?.data) {
      const targetPrefix = isReturn ? "RET" : "ENT";

      const pieceItem = piece.data.find((item) => item.prefix === targetPrefix);

      const prefix = pieceItem?.prefix ?? targetPrefix;
      const year = pieceItem?.year ?? "2025";
      const lastNumber = pieceItem?.lastNumber ?? 0;
      reference = `${prefix}-${year}-${lastNumber + 1}`;
    }

    form.setValue("reference", reference);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [piece, isReturn]);

  return (
    <div className="space-y-10 max-sm:h-[calc(100vh-20rem)] overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex max-sm:flex-col items-center gap-6 w-full">
            <FormField
              control={form.control}
              name="reference"
              rules={{ required: "Référence obligatoire" }}
              render={({ field }) => (
                <FormItem className="space-y-1 w-full">
                  <FormLabel>
                    Référence <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Référence"
                      {...field}
                      disabled={!!movementList.length}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {supplierDepots ? (
              <SelectDepot
                label={isReturn ? "Source" : "Fournisseur"}
                form={form}
                disabled={!!movementList.length}
                depots={supplierDepots}
              />
            ) : (
              <></>
            )}

            <SelectProduct form={form} />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="space-y-1 w-full">
                  <FormLabel>
                    Quantité <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      value={field.value ?? ""}
                      placeholder="10"
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Champs optionnels : colorId, sizeId, reference */}
            <SelectColor form={form} />
            <SelectSize form={form} />

            <FormField
              control={form.control}
              name="purchasePrice"
              render={({ field }) => (
                <FormItem className="space-y-1 w-full">
                  <FormLabel>Prix d’achat (Ar)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      placeholder="10000"
                      step="0.01"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full flex justify-end">
            <Button
              variant={"outline"}
              type="submit"
              disabled={!form.formState.isValid}
            >
              Valider l’entrée
            </Button>
          </div>
        </form>
      </Form>
      {movementList.length > 0 && (
        <MovementInboundList
          {...{
            isReturn: isReturn ? true : false,
            movementList,
            handleDelete,
            onSuccess: () => {
              setMovementList([]);
              refetch();
              form.reset();
            },
          }}
        />
      )}
    </div>
  );
}
