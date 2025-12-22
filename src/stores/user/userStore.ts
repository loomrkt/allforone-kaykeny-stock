import { User } from "@/interfaces/user/user";
import { create } from "zustand";

interface UserState {
  users?: User[];
  setUsers: (users: User[]) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  setUsers: (data: User[]) => {
    set({ users: data });
  },
}));
