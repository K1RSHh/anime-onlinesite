import { create } from "zustand";
import api from "../api/axios";

//Describe what one anime looks like in our array
export interface AnimeData {
  mal_id: number;
  [key: string]: any;
}

export interface AnimeFilters {
  genreId?: number | null;
  yearFrom?: string;
  yearTo?: string;
  orderBy?: string;
  sort?: string;
}

interface TopAnimeStore {
  topAnime: AnimeData[];
  page: number;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;

  fetchTopAnime: (nextPage?: number, filters?: AnimeFilters) => Promise<void>;
}

export const useTopAnimeStore = create<TopAnimeStore>()((set) => ({
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
      //Filters
      // 1. Аналізуємо, що саме хоче юзер
      const currentOrderBy = filters.orderBy || "score";
      const currentSort = filters.sort || "desc";
      const hasFilters = filters.genreId || filters.yearFrom || filters.yearTo;

      // 2. Визначаємо, чи це "чистий" запит Топ аніме (без фільтрів, сортування за рейтингом)
      const isPureTop =
        !hasFilters && currentOrderBy === "score" && currentSort === "desc";

      // 3. Динамічно обираємо ендпоінт
      const endpoint = isPureTop ? "/top/anime" : "/anime";

      //Preparing launch parameters
      const params: Record<string, any> = {
        page: nextPage,
        limit: 25,
        sfw: true,
      };

      // 4. Додаємо фільтри ТІЛЬКИ якщо ми використовуємо пошуковий ендпоінт
      if (!isPureTop) {
        params.order_by = currentOrderBy;
        params.sort = currentSort;

        if (filters.genreId) params.genres = filters.genreId;
        if (filters.yearFrom) params.start_date = `${filters.yearFrom}-01-01`;
        if (filters.yearTo) params.end_date = `${filters.yearTo}-12-31`;
      }

      // Робимо запит за обраним URL
      const response = await api.get(endpoint, { params });
      const { data, pagination } = response.data;

      //Updating the state
      set((state) => {
        let combinedList: AnimeData[] = data;

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
          ...new Map<number, AnimeData>(
            combinedList.map((item: AnimeData) => [item.mal_id, item]),
          ).values(),
        ];

        //We store the list in memory
        return {
          topAnime: uniqueList,
          page: nextPage,
          hasMore: pagination.has_next_page,
          isLoading: false,
        };
      });
    } catch (error: any) {
      console.error(error.message);
      set({ isLoading: false, error: error.message });
    }
  },
}));
