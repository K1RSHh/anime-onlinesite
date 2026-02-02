import { create } from "zustand";

export const useTopAnimeStore = create((set) => ({
  //state
  topAnime: [],
  page: 1,
  isLoading: false,
  error: null,
  hasMore: true,

  //Action
  fetchTopAnime: async (nextPage = 1) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/top/anime?page=${nextPage}`,
      );
      const data = await response.json();

      set((state) => ({
        topAnime:
          nextPage === 1 ? data.data : [...state.topAnime, ...data.data],
        page: nextPage,
        // returns info on if the next page is there
        hasMore: data.pagination.has_next_page,
        isLoading: false,
      }));
    } catch (err) {
      set({ error: err.massage, isLoading: false });
    }
  },
}));
