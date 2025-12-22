"use client";
import { Button } from "@/components/ui/button";
import { MovementOutBoundForm } from "@/features/movement/movementOutBoundForm";
import { MovementInboundForm } from "@/features/movement/movmentInboundForm";
import { cn } from "@/lib/utils";
import { useState } from "react";

function CreateMovement() {
  const [type, setType] = useState<"IN" | "OUT" | "TRS" | "BC">("IN");
  const [isFreeze, setIsFreeze] = useState<boolean>(false);
  return (
    <div className="container mx-auto space-y-8">
      <div className="flex items-center max-sm:justify-between">
        <Button
          variant={"link"}
          disabled={isFreeze}
          onClick={() => setType("IN")}
          className="w-fit max-sm:p-0"
        >
          <span
            className={cn(
              "text-sm text-primary/50 transition-all",
              type === "IN" && "font-bold text-primary text-lg"
            )}
          >
            Entrée
          </span>
        </Button>
        <Button
          variant={"link"}
          disabled={isFreeze}
          className="w-fit max-sm:p-0"
          onClick={() => setType("OUT")}
        >
          <span
            className={cn(
              "text-sm text-primary/50 transition-all",
              type === "OUT" && "font-bold text-primary text-lg"
            )}
          >
            Vente
          </span>
        </Button>
        <Button
          variant={"link"}
          disabled={isFreeze}
          onClick={() => setType("TRS")}
          className="w-fit max-sm:p-0"
        >
          <span
            className={cn(
              "text-sm text-primary/50 transition-all",
              type === "TRS" && "font-bold text-primary text-lg"
            )}
          >
            Transfert
          </span>
        </Button>
        <Button
          variant={"link"}
          disabled={isFreeze}
          onClick={() => setType("BC")}
          className="w-fit max-sm:p-0"
        >
          <span
            className={cn(
              "text-sm text-primary/50 transition-all",
              type === "BC" && "font-bold text-primary text-lg"
            )}
          >
            Retour
          </span>
        </Button>
      </div>
      {type === "IN" ? (
        <MovementInboundForm setIsFreeze={setIsFreeze} />
      ) : (
        <></>
      )}
      {type === "OUT" ? (
        <MovementOutBoundForm setIsFreeze={setIsFreeze} />
      ) : (
        <></>
      )}
      {type === "BC" ? (
        <MovementInboundForm setIsFreeze={setIsFreeze} isReturn />
      ) : (
        <></>
      )}
      {type === "TRS" ? (
        <MovementOutBoundForm setIsFreeze={setIsFreeze} isTransfert />
      ) : (
        <></>
      )}
    </div>
  );
}

export default CreateMovement;
