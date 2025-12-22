"use client";

import { useCollectionStore } from "@/stores/collection/collectionStore";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

function SelectModel({
  form,
  isRequired,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  isRequired?: boolean;
}) {
  const collections = useCollectionStore(({ collections }) => collections);

  return (
    <>
      {collections ? (
        <FormField
          control={form.control}
          name="collectionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Modèle{" "}
                {isRequired ? (
                  <span className="text-destructive">*</span>
                ) : (
                  <></>
                )}
              </FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl className="w-full">
                  <SelectTrigger className="border-gray-200 focus:border-gray-300">
                    <SelectValue placeholder="Choisissez le modèle" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {collections.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <></>
      )}
    </>
  );
}

export default SelectModel;
