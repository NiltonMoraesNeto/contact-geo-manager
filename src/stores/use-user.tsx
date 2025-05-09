import { create } from "zustand";

type State = {
  emailUser: string;
};

type Action = {
  updateEmailUser: (emailUser: State["emailUser"]) => void;
};

export const useUserStore = create<State & Action>((set) => ({
  emailUser: "",
  updateEmailUser: (emailUser) => set(() => ({ emailUser })),
}));
