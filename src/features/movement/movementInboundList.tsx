import { createMovementStock, MovementInboundDTO } from "@/api/movement";
import { Button } from "@/components/ui/button";
import { getEntityName } from "@/lib/utils";
import { useColorStore } from "@/stores/color/colorStore";
import { useDepotStore } from "@/stores/depot/depotStore";
import { useProductStore } from "@/stores/product/productStore";
import { useSizeStore } from "@/stores/size/sizeStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

type MovementInboundListProps = {
  movementList: MovementInboundDTO[];
  handleDelete: (index: number) => void;
  onSuccess?: () => void;
  isReturn?: boolean;
};

function MovementInboundList({
  isReturn,
  movementList,
  handleDelete,
  onSuccess,
}: MovementInboundListProps) {
  const products = useProductStore(({ products }) => products);
  const depots = useDepotStore(({ depots }) => depots);
  const colors = useColorStore(({ colors }) => colors);
  const sizes = useSizeStore(({ sizes }) => sizes);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["create-inbound-movement"],
    mutationFn: (data: MovementInboundDTO[]) => createMovementStock(data),
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
      <h2 className="text-lg font-semibold text-gray-800">
        Liste des mouvements d’entrée
      </h2>

      {/* pc */}
      <div className="overflow-auto max-sm:hidden max-h-[calc(100vh-35rem)]">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border p-2">Produit</th>
              <th className="border p-2">Quantité</th>
              <th className="border p-2">
                {isReturn ? "Dépôt source" : "Fournisseur"}
              </th>
              <th className="border p-2">Prix d’achat</th>
              <th className="border p-2">Référence</th>
              <th className="border p-2">Couleur</th>
              <th className="border p-2">Taille</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {movementList.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">
                  {products
                    ? getEntityName(products, item.productId)
                    : item.productId}
                </td>
                <td className="border p-2">{item.quantity}</td>
                <td className="border p-2">
                  {depots
                    ? item.depotId
                      ? getEntityName(depots, item.depotId)
                      : item.depotId
                    : "-"}
                </td>
                <td className="border p-2">{item.purchasePrice ?? "-"}</td>
                <td className="border p-2">{item.reference || "-"}</td>
                <td className="border p-2">
                  {item.colorId
                    ? colors
                      ? getEntityName(colors, item.colorId)
                      : item.colorId
                    : "-"}
                </td>
                <td className="border p-2">
                  {item.sizeId
                    ? sizes
                      ? getEntityName(sizes, item.sizeId)
                      : item.sizeId
                    : "-"}
                </td>
                <td className="border p-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(index)}
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
        {movementList.map((item, index) => (
          <div
            key={index}
            className="border p-3 rounded-md bg-gray-50 shadow-sm"
          >
            <div className="text-sm mb-1">
              <strong>Produit :</strong>{" "}
              {products
                ? getEntityName(products, item.productId)
                : item.productId}
            </div>
            <div className="text-sm mb-1">
              <strong>Quantité :</strong> {item.quantity}
            </div>
            {isReturn && (
              <div className="text-sm mb-1">
                <strong>Dépôt :</strong>{" "}
                {item.depotId
                  ? depots
                    ? getEntityName(depots, item.depotId)
                    : item.depotId
                  : "-"}
              </div>
            )}
            <div className="text-sm mb-1">
              <strong>Référence :</strong> {item.reference || "-"}
            </div>
            <div className="flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(index)}
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
          onClick={() => mutation.mutate(movementList)}
        >
          Sauvegarder
        </Button>
      </div>
    </div>
  );
}

export default MovementInboundList;
