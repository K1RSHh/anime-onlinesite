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

    if (nextPage === 1) {
      set({ topAnime: [], hasMore: true });
    }

    try {
      const params = {
        page: nextPage,
        limit: 25,
        orderBy: "score",
        sort: "desc",
        sfw: true,
      };

      /// filters
      if (filters.genreId) params.genres = filters.genreId;
      if (filters.year) params.start_date = `${filters.year}-01-01`;

      if (filters.genreId) {
        params.genres = filters.genreId;
      }

      const response = await api.get("/anime", { params });

      const { data, pagination } = response.data;

      set((state) => {
        let combinedList = data;

        if (nextPage === 1) {
          combinedList = data;
        } else {
          combinedList = [...state.topAnime, ...data];
        }

        const uniqueList = [
          ...new Map(combinedList.map((item) => [item.mal_id, item])).values(),
        ];

        return {
          topAnime: uniqueList,
          page: nextPage,
          hasMore: pagination.has_next_page,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error(error.message);
      set({ isLoading: false, error: error.message });
    }
  },
}));
