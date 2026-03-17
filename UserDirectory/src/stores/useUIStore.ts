import { create } from "zustand";

type UIStore = {
    searchQuery: string;
    expandedUserId: number | null;

    setSearchQuery: (query: string) => void;
    setExpandedUserId: (userId: number | null) => void;
};

export const useUIStore = create<UIStore>((set) => ({
    searchQuery: "",
    expandedUserId: null,

    setSearchQuery: (query) => {
        set({
            searchQuery: query
        })
    },

    setExpandedUserId: (userId) => {
        set({
            expandedUserId: userId
        })
    }
}))
