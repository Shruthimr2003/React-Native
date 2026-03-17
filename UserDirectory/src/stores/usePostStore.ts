import { create } from "zustand";
import { getPostsForUser, Post } from "../services/api";

type PostStore = {
  byUserId: Record<number, Post[]>;
  loadingForUser: number | null;
  error: string | null;

  fetchPosts: (userId: number) => Promise<void>;
  clearCache: () => void;
};

export const usePostStore = create<PostStore>((set, get) => ({
  byUserId: {},
  loadingForUser: null,
  error: null,

  fetchPosts: async (userId: number) => {
    const { byUserId } = get();

    // Skip API call if cached
    if (byUserId[userId]) return;

    set({ loadingForUser: userId, error: null });

    try {
      const posts = await getPostsForUser(userId);

      const limitedPosts = posts.slice(0, 3);

      set((state) => ({
        byUserId: {
          ...state.byUserId,
          [userId]: limitedPosts,
        },
      }));
    } catch {
      set({
        error: "Failed to fetch posts",
      });
    } finally {
      set({ loadingForUser: null });
    }
  },

  clearCache: () => {
    set({
      byUserId: {},
    });
  },
}));