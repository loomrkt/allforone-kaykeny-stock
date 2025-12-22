import Collection from "@/interfaces/collection";
import { create } from "zustand";

interface CollectionState {
  collections?: Collection[];
  setCollections: (collections: Collection[]) => void;
}

export const useCollectionStore = create<CollectionState>((set) => ({
  collections: [],
  setCollections: (data: Collection[]) => {
    set({ collections: data });
  },
}));
