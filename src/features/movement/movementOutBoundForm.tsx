"use client";

import { getPieceCounter } from "@/api/movement";
import { getQuantityStock } from "@/api/stock";
import SelectDepot from "@/components/common/selectDepot";
import SelectStock from "@/components/common/selectStock";
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
import { MovementOutBoundSchema } from "@/interfaces/movement/schema";
import { useDepotStore } from "@/stores/depot/depotStore";
import { useStockStore } from "@/stores/stock/stockStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MovementOutBoundList from "./movementOutBoundList";

type MovementOutBoundDTO = z.infer<typeof MovementOutBoundSchema>;

export function MovementOutBoundForm({
  isTransfert,
  setIsFreeze,
}: {
  isTransfert?: boolean;
  setIsFreeze?: (value: boolean) => void;
}) {
  const { data: piece, refetch } = useQuery({
    queryKey: ["get-piece-counter"],
    queryFn: getPieceCounter,
  });
  const localDepots = useDepotStore(({ localDepots }) => localDepots);
  const stocks = useStockStore(({ stocks }) => stocks);

  const [movements, setMovements] = useState<MovementOutBoundDTO[]>([]);

  const form = useForm<MovementOutBoundDTO>({
    resolver: zodResolver(MovementOutBoundSchema),
    mode: "onChange",
    defaultValues: {
      type: "OUTBOUND",
      stockId: "",
      quantity: undefined,
      depotId: "",
      reference: "",
      applyWholesalePrice: false,
    },
  });

  const onSubmit = (data: MovementOutBoundDTO) => {
    setMovements((prev) => [...prev, data]);
    form.setValue("stockId", "");
    form.setValue("depotId", "");
    form.setValue("applyWholesalePrice", false);
  };

  const handleRemoveMovement = (index: number) => {
    setMovements((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (movements.length && setIsFreeze) setIsFreeze(true);
    if (!movements.length && setIsFreeze) setIsFreeze(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movements]);

  useEffect(() => {
    let reference = isTransfert ? "TRF-2025-0" : "VNT-2025-0";
    const targetPrefix = isTransfert ? "TRF" : "VNT";

    if (piece?.data?.length) {
      const pieceItem = piece.data.find((item) => item.prefix === targetPrefix);
      const prefix = pieceItem?.prefix ?? targetPrefix;
      const year = pieceItem?.year ?? "2025";
      const lastNumber = pieceItem?.lastNumber ?? 0;

      reference = `${prefix}-${year}-${lastNumber + 1}`;
    }
    form.setValue("reference", reference);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [piece, isTransfert]);

  return (
    <div className="space-y-10 max-sm:h-[calc(100vh-20rem)] overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex max-sm:flex-col items-center gap-6 w-full">
            <SelectStock form={form} />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="space-y-1 w-full">
                  <FormLabel>
                    Quantité <span className="text-destructive">*</span>{" "}
                    {form.getValues("stockId") ? (
                      <span>
                        (Stock disponible :{" "}
                        {getQuantityStock(stocks ?? [], form.watch("stockId"))}{" "}
                        pièces)
                      </span>
                    ) : (
                      <></>
                    )}
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

            {localDepots && isTransfert ? (
              <SelectDepot
                form={form}
                isRequired={isTransfert}
                label={isTransfert ? "Dépôt destination" : ""}
                depots={localDepots}
              />
            ) : (
              <></>
            )}

            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem className="space-y-1 w-full">
                  <FormLabel>
                    Référence <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Référence"
                      {...field}
                      // disabled={!!movements.length}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isTransfert ? (
              <FormField
                control={form.control}
                name="applyWholesalePrice"
                render={({ field }) => (
                  <FormItem className="flex items-end gap-2 w-full  h-10">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 border-gray-300 rounded"
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Appliquer le prix de gros
                    </FormLabel>
                  </FormItem>
                )}
              />
            ) : (
              <></>
            )}
          </div>

          <div className="w-full flex justify-end">
            <Button
              variant={"outline"}
              type="submit"
              disabled={
                !form.formState.isValid ||
                (form.watch("quantity") ?? 0) >
                  getQuantityStock(stocks ?? [], form.watch("stockId"))
              }
            >
              Valider la sortie
            </Button>
          </div>
        </form>
      </Form>
      {movements.length > 0 && (
        <MovementOutBoundList
          {...{
            movements,
            isTransfert: isTransfert ? true : false,
            handleRemoveMovement,
            onSuccess: () => {
              setMovements([]);
              refetch();
              form.reset();
            },
          }}
        />
      )}
    </div>
  );
}
