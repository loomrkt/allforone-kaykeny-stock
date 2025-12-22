import { createMovementStock, MovementOutBoundDTO } from "@/api/movement";
import { getProductNameByStockId } from "@/api/stock";
import { Button } from "@/components/ui/button";
import { getEntityName } from "@/lib/utils";
import { useDepotStore } from "@/stores/depot/depotStore";
import { useStockStore } from "@/stores/stock/stockStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

function MovementOutBoundList({
  movements,
  handleRemoveMovement,
  onSuccess,
  isTransfert,
}: {
  movements: MovementOutBoundDTO[];
  handleRemoveMovement: (index: number) => void;
  onSuccess?: () => void;
  isTransfert?: boolean;
}) {
  const depots = useDepotStore(({ depots }) => depots);
  const stocks = useStockStore(({ stocks }) => stocks);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["create-inbound-movement"],
    mutationFn: (data: MovementOutBoundDTO[]) => createMovementStock(data),
    onSuccess: () => {
      toast("Succes", {
        description: "Mouvements créé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["get-movements"] });

      if (onSuccess) onSuccess();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast("Erreur", {
        description: error.message,
      });
    },
  });

  return (
    <div className="border rounded-md p-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Liste des sorties</h2>

      {/* pc */}
      <div className="overflow-auto max-sm:hidden h-[calc(100vh-35rem)]">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border p-2">Produit</th>
              <th className="border p-2">Quantité</th>
              {isTransfert ? (
                <th className="border p-2">Dépôt (Destination)</th>
              ) : (
                <></>
              )}
              <th className="border p-2">Référence</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">
                  {stocks
                    ? getProductNameByStockId(stocks, movement.stockId)
                    : movement.stockId}
                </td>
                <td className="border p-2">{movement.quantity}</td>
                {isTransfert ? (
                  <td className="border p-2">
                    {movement.depotId
                      ? depots
                        ? getEntityName(depots, movement.depotId)
                        : movement.depotId
                      : "-"}
                  </td>
                ) : (
                  <></>
                )}
                <td className="border p-2">{movement.reference || "-"}</td>
                <td>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveMovement(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* mobile */}
      <div className="block md:hidden space-y-4">
        {movements.map((movement, index) => (
          <div
            key={index}
            className="border p-3 rounded-md bg-gray-50 shadow-sm"
          >
            <div className="text-sm mb-1">
              <strong>Produit :</strong>{" "}
              {stocks
                ? getProductNameByStockId(stocks, movement.stockId)
                : movement.stockId}
            </div>
            <div className="text-sm mb-1">
              <strong>Quantité :</strong> {movement.quantity}
            </div>
            {isTransfert && (
              <div className="text-sm mb-1">
                <strong>Dépôt :</strong>{" "}
                {movement.depotId
                  ? depots
                    ? getEntityName(depots, movement.depotId)
                    : movement.depotId
                  : "-"}
              </div>
            )}
            <div className="text-sm mb-1">
              <strong>Référence :</strong> {movement.reference || "-"}
            </div>
            <div className="flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveMovement(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-end">
        <Button
          disabled={mutation.isPending}
          onClick={() => mutation.mutate(movements)}
        >
          Sauvegarder
        </Button>
      </div>
    </div>
  );
}

export default MovementOutBoundList;
