import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { ChangeEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

function SearchInput({
  placeholder,
  value,
  onChange,
  onClear,
  className,
}: {
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Input
        value={value}
        placeholder={placeholder ?? `Recherche ...`}
        className="pl-10 w-full rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
        onChange={onChange}
      />
      <Button
        variant="ghost"
        size={"icon"}
        className="absolute top-0 left-1"
        disabled
      >
        <Search />
      </Button>
      <Button
        variant="ghost"
        size={"icon"}
        className={cn(
          "absolute top-0 rounded-full right-2",
          value ? "visible" : "hidden"
        )}
        onClick={onClear}
      >
        <X />
      </Button>
    </div>
  );
}

export default SearchInput;
