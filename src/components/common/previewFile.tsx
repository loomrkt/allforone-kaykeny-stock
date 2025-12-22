import { cn, isImage, truncateText } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

function PreviewFile({
  src,
  alt,
  type,
  action,
  className,
}: {
  src: string;
  alt?: string;
  type?: string;
  action: () => void;
  className?: string;
}) {
  return (
    <div className="relative w-fit rounded-md">
      <Button
        type="button"
        className="absolute bg-white opacity-80 hover:opacity-100 top-1 right-1 w-5 h-5 text-destructive border-destructive rounded-full transition-all"
        variant={"ghost"}
        size={"icon"}
        onClick={action}
      >
        <X />
      </Button>
      {type && isImage(type) ? (
        <Image
          src={src}
          alt={alt ?? ""}
          width={1000}
          height={1000}
          className={cn(
            " rounded-md bg-secondary text-white text-[12px] p-1 border",
            className ? className : "w-32 h-auto"
          )}
        />
      ) : (
        <span className="mr-4 rounded-md bg-secondary text-white text-[12px] p-1 border">
          {alt && truncateText(alt, 15)}
        </span>
      )}
    </div>
  );
}
export default PreviewFile;
