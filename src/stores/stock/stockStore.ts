import { Stock } from "@/interfaces/stock";
import { create } from "zustand";

interface StockState {
  stocks?: Stock[];
  setStocks: (stocks: Stock[]) => void;
}

export const useStockStore = create<StockState>((set) => ({
  stocks: [],
  setStocks: (data: Stock[]) => {
    set({ stocks: data });
  },
}));
