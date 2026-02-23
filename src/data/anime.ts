import api from "../api/axios";

export const fetchAnime = async (id: number) => {
  try {
    const response = await api.get(`/anime/${id}/full`);
    return response.data.data;
  } catch {
    console.error("Anime not found id = ", id);
  }
};
