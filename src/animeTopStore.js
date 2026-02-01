import { create } from "zustand";

export const useTopAnimeStore = create((set) => ({
  //state
  topAnime: [],
  isLoading: false,
  error: null,

  //Action
  fetchTopAnime: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch("https://api.jikan.moe/v4/top/anime");
      const data = await response.json();

      set({ topAnime: data.data, isLoading: false });
    } catch (err) {
      set({ error: err.massage, isLoading: false });
    }
  },
}));
