import { Card } from "@/components/ui/card";
import { Stock } from "@/interfaces/stock";

interface Props {
  data: Stock[];
  search: string;
  loading: boolean;
  onClick: (stock: Stock) => void;
}

function StockGridCard({
  stock,
  onClick,
}: {
  stock: Stock;
  onClick: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      className="p-4 shadow-md rounded-lg bg-white hover:bg-gray-50 transition cursor-pointer"
    >
      <div className="flex flex-col space-y-1 text-sm">
        <div className="font-semibold text-lg">{stock.productName}</div>
        <div className="mt-2 text-sm">
          <strong>Dépôt:</strong> {stock.depotName}
        </div>
        <div className="mt-2 text-sm">
          <strong>Quantité:</strong> {stock.quantity}
        </div>
        {/* <div className="text-sm">
          <strong>Prix:</strong> {stock.price.toFixed(2)} Ar
        </div> */}
        <div className="text-sm">
          <strong>Couleur:</strong> {stock.colorName}
        </div>
        <div className="text-sm">
          <strong>Taille:</strong> {stock.sizeName}
        </div>
      </div>
    </Card>
  );
}

function StockGridCardSkeleton() {
  return (
    <Card className="p-4 shadow-md rounded-lg bg-white animate-pulse">
      <div className="flex flex-col space-y-2">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mt-2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </Card>
  );
}

export function StockGrid({ data, loading, onClick }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <StockGridCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (!loading && data.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">Aucun stock trouvé.</div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {data.map((stock) => (
        <StockGridCard
          key={stock.id}
          stock={stock}
          onClick={() => onClick(stock)}
        />
      ))}
    </div>
  );
}
