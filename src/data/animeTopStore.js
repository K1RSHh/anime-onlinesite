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

    //Cleaning up old data
    if (nextPage === 1) {
      set({ topAnime: [], hasMore: true });
    }

    try {
      //Preparing launch parameters
      const params = {
        page: nextPage,
        limit: 25,
        sfw: true,
      };

      //Filters
      //If the user has selected a genre
      if (filters.genreId) params.genres = filters.genreId;

      // Якщо юзер ввів "Рік Від"
      if (filters.yearFrom) {
        params.start_date = `${filters.yearFrom}-01-01`;
      }

      // Якщо юзер ввів "Рік До"
      if (filters.yearTo) {
        params.end_date = `${filters.yearTo}-12-31`;
      }

      params.order_by = filters.orderBy || "score";
      params.sort = filters.sort || "desc";

      //Request to server
      const response = await api.get("/anime", { params });
      const { data, pagination } = response.data;

      //Updating the state
      set((state) => {
        let combinedList = data;

        //If we take new data from the first page
        if (nextPage === 1) {
          combinedList = data;
        } else {
          //If it is a new page, we take the previous and new data
          combinedList = [...state.topAnime, ...data];
        }

        //FILTERING DUPLICATES (The most difficult part)
        // Map automatically removes duplicates by ID.
        // This protects against API bugs or rapid clicking.
        const uniqueList = [
          ...new Map(combinedList.map((item) => [item.mal_id, item])).values(),
        ];

        //We store the list in memory
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
