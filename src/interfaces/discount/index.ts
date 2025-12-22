export type Discount = {
  id: string;
  title: string;
  productId: string[];
  value: number;
  isPercentage: boolean;
  startDate: string;
  endDate: string;
  isValide: boolean;
  isDeleted: boolean;
  createdAt: string;
};
