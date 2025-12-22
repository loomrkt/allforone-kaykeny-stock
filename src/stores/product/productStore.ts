import { Product } from "@/interfaces/product";
import { create } from "zustand";

interface ProductState {
  products?: Product[];
  setProducts: (products: Product[]) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  setProducts: (data: Product[]) => {
    set({ products: data });
  },
}));
