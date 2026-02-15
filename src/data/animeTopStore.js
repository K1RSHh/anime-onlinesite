import { create } from "zustand";
import api from "../api/axios";

export const useTopAnimeStore = create((set) => ({
  //state
  topAnime: [],
  page: 1,
  isLoading: false,
  error: null,
  hasMore: true,

  //Action
  fetchTopAnime: async (nextPage = 1, filters = {}) => {
    set({ isLoading: true, error: null });

    try {
      const params = {
        page: nextPage,
        limit: 25,
        orderBy: "score",
        sort: "desc",
        sfw: true,
      };

      if (filters.genreId) {
        params.genres = filters.genreId;
      }

      const response = await api.get("/anime", { params });

      const { data, pagination } = response.data;

      set((state) => {
        const newAnimeList = data;

        if (nextPage === 1) {
          return {
            topAnime: newAnimeList,
            page: 1,
            hasMore: pagination.has_next_page,
            isLoading: false,
          };
        }

        const existingIds = new Set(state.topAnime.map((a) => a.mal_id));
        const uniqueNewAnime = newAnimeList.filter(
          (anime) => !existingIds.has(anime.mal_id),
        );

        return {
          topAnime: [...state.topAnime, ...uniqueNewAnime],
          page: nextPage,
          hasMore: pagination.has_next_page,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error(error.message);
      set({ isLoading: false });
    }
  },
}));
