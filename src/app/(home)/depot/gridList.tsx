import DeleteDepotButton from "@/features/depot/deleteDepotButton";
import EditDepotButton from "@/features/depot/editDepotButton";
import type Depot from "@/interfaces/depot";

interface GridListProps {
  data: Depot[];
  onDepotClick: (depot: Depot) => void;
}

export function GridList({ data, onDepotClick }: GridListProps) {
  return (
    <div className="flex flex-col max-h-[70vh] overflow-y-auto p-2 gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.map((depot) => (
          <div
            key={depot.id}
            className="border rounded-lg p-4 shadow cursor-pointer hover:shadow-lg transition"
            onClick={() => onDepotClick(depot)}
          >
            <h3 className="font-semibold text-lg mb-2">{depot.name}</h3>
            <p className="text-sm text-gray-700 mb-1">
              <strong>Adresse:</strong> {depot.adress}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              <strong>Contact:</strong> {depot.contact}
            </p>
            <div className="flex justify-end gap-2 items-center ">
              <EditDepotButton data={depot} />
              <DeleteDepotButton depot={depot} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
