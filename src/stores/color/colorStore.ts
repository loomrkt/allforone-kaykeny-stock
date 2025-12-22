import { Color } from "@/interfaces/color";
import { create } from "zustand";

interface ColorState {
  colors?: Color[];
  setColors: (colors: Color[]) => void;
}

export const useColorStore = create<ColorState>((set) => ({
  colors: [],
  setColors: (data: Color[]) => {
    set({ colors: data });
  },
}));
