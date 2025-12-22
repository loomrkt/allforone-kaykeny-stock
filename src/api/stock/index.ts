import { Stock } from "@/interfaces/stock";
import {
  genericCreate,
  genericDelete,
  genericGetList,
  genericGetOne,
  genericUpdate,
} from "../common";

const url = "/Stock";

export type StockDTO = Omit<
  Stock,
  "id" | "createdAt" | "updatedAt" | "isDeleted" | "image"
> & {
  productName?: string;
  depotName?: string;
  sizeName?: string;
  colorName?: string;
  productColorIds?: string[];
  productSizeIds?: string[];
  collectionId?: string;
  categoryId: string;
  depotId: string[];
  sizeId: string;
  colorId: string;
};
export const getStocks = async (params: {
  search?: string;
  limit?: number;
  page?: number;
  orderByPrice?: boolean;
  orderByQuantity?: boolean;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  collectionId?: string;
  genderFilter?: string;
  ageGroupFilter?: string;
  sizeId?: string;
  colorId?: string;
  depoId?: string[];
}) => {
  return genericGetList<Stock>(url, { ...params });
};

export const getStock = (id: string) => genericGetOne<Stock>(url, id);

export const createStock = (data: StockDTO) => {
  return genericCreate<StockDTO, Stock>(url, data, {});
};

export const updateStock = (id: string, data: StockDTO) => {
  return genericUpdate<StockDTO, Stock>(url, id, data, {});
};

export const deleteStock = (id: string | number) => genericDelete(url, id);

export const getProductNameByStockId = (stocks: Stock[], id: string) => {
  return stocks.filter((stock) => stock.id === id)[0].productName;
};

export const getQuantityStock = (stocks: Stock[], stockId: string) =>
  stocks.find(({ id }) => id === stockId)?.quantity ?? 0;

export type LowStock = {
  stockId: string;
  stockName: string;
  quantity: number;
  imageName?: string;
  imageUrl?: string;
};
export const getLowStock = () => genericGetList<LowStock>(`${url}/lowstock`);
