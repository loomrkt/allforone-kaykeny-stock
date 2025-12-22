import type Depot from "@/interfaces/depot";

interface DepotCardProps {
  depot: Depot;
  onClick?: (depot: Depot) => void;
}

export function SupplierCard({ depot, onClick }: DepotCardProps) {
  return (
    <div
      onClick={() => onClick?.(depot)}
      className="cursor-pointer border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
    >
      <h2 className="text-lg font-semibold">{depot.name}</h2>
      <p className="text-sm text-gray-600">{depot.adress}</p>
      <p className="text-sm text-gray-600">Contact: {depot.contact}</p>
      <p className="text-xs text-gray-400 mt-1">
        Créé le : {new Date(depot.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
