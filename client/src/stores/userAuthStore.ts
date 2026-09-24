import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  pushToken: string | null;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
};
type State = {
  token: string | null;
  _hasHydrated: boolean;
  accessToken?: string | null;
  refreshToken?: string | null;
  user?: User | null;
};

type Action = {
  setHasHydrated: (state: boolean) => void;
  setToken: (token: string | null) => void;
  setAuth: (auth: {
    user: User;
    token: { accessToken: string; refreshToken: string };
  }) => void;
  clearAuth: () => void;
};

const initialState: State = {
  token: null,
  user: null,
  _hasHydrated: false,
  accessToken: null,
  refreshToken: null,
};

export const useAuthStore = create<State & Action>()(
  persist(
    (set) => ({
      ...initialState,
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
      setToken: (token: string | null) => set({ token }),
      setAuth: ({ user, token }) =>
        set({
          token: token.accessToken,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          user,
        }),
      clearAuth: () =>
        set({
          token: null,
          accessToken: null,
          refreshToken: null,
          user: null,
        }),
    }),

    {
      name: "auth",
      storage: createJSONStorage(() => ({
        getItem: getItemAsync,
        setItem: setItemAsync,
        removeItem: deleteItemAsync,
      })),
      partialize: (state) => ({
        token: state.token,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
