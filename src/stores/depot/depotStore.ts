import Depot from "@/interfaces/depot";
import { create } from "zustand";

interface DepotState {
  depots: Depot[];
  supplierDepots: Depot[];
  localDepots: Depot[];
  setDepots: (depots: Depot[]) => void;
  setSupplierDepots: (depots: Depot[]) => void;
  setLocalDepots: (depots: Depot[]) => void;
}

export const useDepotStore = create<DepotState>((set) => ({
  depots: [],
  supplierDepots: [],
  localDepots: [],
  setDepots: (depots: Depot[]) => set({ depots }),
  setSupplierDepots: (supplierDepots: Depot[]) => set({ supplierDepots }),
  setLocalDepots: (localDepots: Depot[]) => set({ localDepots }),
}));
