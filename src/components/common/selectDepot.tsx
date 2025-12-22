import Depot from "@/interfaces/depot";
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

function SelectDepot({
  depots,
  name = "depotId",
  label = "Dépôt",
  form,
  disabled,
  isRequired,
}: {
  depots: Depot[];
  name?: string;
  label?: string;
  disabled?: boolean;
  isRequired?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}) {
  return (
    <>
      {depots ? (
        <FormField
          control={form.control}
          name={name}
          rules={{ required: isRequired ? "Champs obligatoire" : false }}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-sm font-medium text-gray-700">
                {label}
              </FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <FormControl className="w-full min-w-44">
                  <SelectTrigger className="border-gray-200 focus:border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {depots?.map((size) => (
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

export default SelectDepot;
