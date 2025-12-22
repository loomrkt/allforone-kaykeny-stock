export type Rule = {
  value: number;
  minQuantity: number;
  maxQuantity: number;
};

type WholeSale = {
  productIds: string[];
  rules: Rule[];
};

export default WholeSale;
