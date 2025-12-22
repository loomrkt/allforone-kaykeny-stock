import { useSizeStore } from "@/stores/size/sizeStore";
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

function SelectSize({
  name = "sizeId",
  form,
}: {
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}) {
  const sizes = useSizeStore(({ sizes }) => sizes);

  return (
    <>
      {sizes ? (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-sm font-medium text-gray-700">
                Taille <span className="text-destructive">*</span>
              </FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl className="w-full min-w-44">
                  <SelectTrigger className="border-gray-200 focus:border-gray-300">
                    <SelectValue placeholder="Choisissez la taille" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sizes.map((size) => (
                    <SelectItem key={size.id} value={size.id}>
                      {size.name}
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

export default SelectSize;
