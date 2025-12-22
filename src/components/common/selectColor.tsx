import { useColorStore } from "@/stores/color/colorStore";
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

function SelectColor({
  name = "colorId",
  form,
}: {
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}) {
  const colors = useColorStore(({ colors }) => colors);

  return (
    <>
      {colors ? (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-sm font-medium text-gray-700">
                Couleur <span className="text-destructive">*</span>
              </FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl className="w-full min-w-44">
                  <SelectTrigger className="border-gray-200 focus:border-gray-300">
                    <SelectValue placeholder="Choisissez la couleur" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {colors.map((color) => (
                    <SelectItem key={color.id} value={color.id}>
                      {color.name}
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

export default SelectColor;
