import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

function Section(
  props: PropsWithChildren<{ id?: string; className?: string; style?: string }>
) {
  return (
    <section
      id={props.id}
      className={cn(
        "w-screen lg:px-0 max-sm:px-4 md:px-10 transition-all duration-300 container mx-auto py-24 max-sm:py-16",
        props.className,
        props.style
      )}
    >
      {props.children}
    </section>
  );
}

export default Section;
