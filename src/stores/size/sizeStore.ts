import { Size } from "@/interfaces/size";
import { create } from "zustand";

interface SizeState {
  sizes?: Size[];
  setSizes: (sizes: Size[]) => void;
}

export const useSizeStore = create<SizeState>((set) => ({
  sizes: [],
  setSizes: (data: Size[]) => {
    set({ sizes: data });
  },
}));
