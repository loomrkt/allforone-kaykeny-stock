import { useCategoryStore } from "@/stores/category/categoryStore";
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

function SelectCategory({
  name = "categoryId",
  form,
  isRequired,
}: {
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  isRequired?: boolean;
}) {
  const categories = useCategoryStore(({ categories }) => categories);

  return (
    <>
      {categories ? (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Catégorie{" "}
                {isRequired ? (
                  <span className="text-destructive">*</span>
                ) : (
                  <></>
                )}
              </FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl className="w-full">
                  <SelectTrigger className="border-gray-200 focus:border-gray-300">
                    <SelectValue placeholder="Choisissez une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
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

export default SelectCategory;
