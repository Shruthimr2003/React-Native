import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getUsers } from "../services/api";
import { User } from "../services/api";

type UserStore = {
    users: User[];
    favorites: number[];
    pinnedUserId: number | null;

    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    lastFetched: number | null;

    fetchUsers: () => Promise<void>;
    toggleFavorite: (userId: number) => void;
    setPinnedUser: (userId: number | null) => void;
    clearUsers: () => void;
};

// create the zustand store
// the return type is UserStore becuase, typescript will get to know the state and action types
// persist is a middleware provided by Zustand.
// middleware wraps the store and add extra behaviour
// without persist state lives only in memory, state will be lossed when the app closes
export const useUserStore = create<UserStore>()(
    persist((set, get) => ({
        users: [],
        favorites: [],
        pinnedUserId: null,

        status: "idle",
        error: null,
        lastFetched: null,

        fetchUsers: async () => {
            try {
                set({ status: "loading", error: null })

                const users = await getUsers()

                set({
                    users,
                    status: "succeeded",
                    lastFetched: Date.now()
                })
            }
            catch {
                set({
                    status: "failed",
                    error: "Failed to load users"
                })
            }
        },

        toggleFavorite: async (userId) => {
            const { favorites } = get()

            const isFavorite = favorites.includes(userId);

            set({
                favorites: isFavorite ? favorites.filter(id => id !== userId) : [...favorites, userId]
            });

            try {
                await new Promise((resolve, reject) => {

                    // simulate 20% API call
                    setTimeout(() => {
                        if (Math.random() < 0.2) {
                            reject(new Error("API failed"))
                        }
                        else {
                            resolve(true)
                        }
                    }, 800)
                })
            }
            catch {
                //roll back
                set({
                    favorites
                })

                alert("failed to update favorites. Rolling back")
            }
        },

        setPinnedUser: (userId) => {
            set({ pinnedUserId: userId })
        },

        clearUsers: () => {
            set({
                users: [],
                lastFetched: null
            })
        }
    }),
        {
            name: "user store", // This is the key used in storage.

            // This tells Zustand where to save the data.
            // AsyncStorage stores strings only, so Zustand wraps it with:createJSONStorage => it will converts (JS Object <-> JSON string).
            storage: createJSONStorage(() => AsyncStorage),

            // partialize will choose which part of the state should be stored 
            // 1. Without partialize: everything saved
            // 2. with partialize : only selected fields will be stored
            partialize: (state) => ({
                users: state.users,
                favorites: state.favorites,
                lastFetched: state.lastFetched,
            })
        }

    )
) 