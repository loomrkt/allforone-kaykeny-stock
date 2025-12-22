import { Category } from "@/interfaces/category";
import { create } from "zustand";

interface CategoryState {
  categories?: Category[];
  setCategories: (categories: Category[]) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  setCategories: (data: Category[]) => {
    set({ categories: data });
  },
}));
