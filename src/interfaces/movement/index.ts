type Movement = {
  id: string;
  type: "INBOUND" | "OUTBOUND";
  stockId?: string;
  stockName?: string;
  quantity?: number;
  sourceId?: string;
  sourceName?: string;
  destinationId?: string;
  destinationName?: string;
  colorId: string;
  sizeId: string;
  purchasePrice?: number;
  reference?: string;
  createdAt?: string;
  email?: string;
  productId?: string;
  productName?: string;
  isSale?: boolean;
  isReturn?: boolean;
  isDeleted?: boolean;
};

export default Movement;
