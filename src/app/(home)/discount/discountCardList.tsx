import DeleteDiscountButton from "@/features/discount/deleteDiscountButton";
import EditDiscountButton from "@/features/discount/editDiscountButton";
import { Discount } from "@/interfaces/discount";
import { getEntityName } from "@/lib/utils";

interface DiscountCardProps {
  discount: Discount;
  onClick: (discount: Discount) => void;
  productsData: { id: string; name: string }[];
}

export const DiscountCard = ({
  discount,
  onClick,
  productsData,
}: DiscountCardProps) => {
  return (
    <div
      onClick={() => onClick(discount)}
      className="p-6 border rounded-xl shadow-lg cursor-pointer hover:shadow-xl bg-white transition-shadow duration-300"
    >
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold text-green-800 mb-4">
          {discount.title}
        </h3>

        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Valeur :</span> {discount.value}
            {discount.isPercentage ? " %" : " Ar"}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Période :</span>{" "}
            {new Date(discount.startDate).toLocaleDateString()} -{" "}
            {new Date(discount.endDate).toLocaleDateString()}
          </p>
        </div>

        {discount.productId?.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-800">
              Produits concernés :
            </p>
            <ul className="text-sm text-gray-600 list-disc list-inside pl-2">
              {discount.productId.map((id) => (
                <li key={id}>{getEntityName(productsData, id)}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto flex justify-end gap-2">
          <div className="p-1 border-1 rounded-lg">
            <EditDiscountButton data={discount} />
          </div>
          <div className="p-1 border-1 rounded-lg">
            <DeleteDiscountButton discount={discount} />
          </div>
        </div>
      </div>
    </div>
  );
};
