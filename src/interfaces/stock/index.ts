export type Stock = {
  id: string;
  productId: string;
  quantity: number;
  productName: string;
  ageGroup: "ADULTE" | "ENFANT";
  depotId: string;
  depotName: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  sizeId: string;
  sizeName: string;
  colorId: string;
  colorName: string;
  price: number;
  transferPrice: number;
  promotionalPrice?: number;
  colorCode?: string;
};

export type MvtStock = {
  id: string;
  email: string;
  type: "in" | "out";
  mvtDate: string;
  quantity: number;
  sourceId: string;
  destinationId: string;
  purchasePrice: number;
  productId: string;
  price: number;
  createdDate: string;
  updatedDate: string;
};
