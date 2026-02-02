import { useEffect } from "react";
import { useTopAnimeStore } from "../../data/animeTopStore";
// eslint-disable-next-line
import { motion } from "framer-motion";
import * as HoverCard from "@radix-ui/react-hover-card";
import AnimeCard from "../AnimeCard/AnimeCard";

function AnimeTopGrid() {
  // add data and function
  const { topAnime, isLoading, fetchTopAnime, page, hasMore } =
    useTopAnimeStore();

  // loading
  useEffect(() => {
    // load the firs page on start
    if (topAnime.length === 0) fetchTopAnime(1);
  }, []);

  // if there is no data yet we show
  if (isLoading && topAnime.length === 0) {
    return (
      <h1 className="text-white text-center mt-20 text-2xl">
        Initial loading... ⌛
      </h1>
    );
  }

  // Add count for pagination
  const loadMore = () => {
    fetchTopAnime(page + 1);
  };

  return (
    <>
      <div className="mr-5">
        <p className="text-4xl ml-5 mb-4 text-white">Anime top</p>
        <div className="relative grid grid-cols-5 gap-4 ">
          {topAnime.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
        {hasMore && (
          <div className="flex justify-center mt-10 mb-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadMore}
              disabled={isLoading}
              className="px-8 py-3 bg-fuchsia-600 text-white rounded-lg font-bold disabled:bg-gray-600 transition-colors"
            >
              {isLoading ? "Loading..." : "Load More Anime"}
            </motion.button>
          </div>
        )}
      </div>
    </>
  );
}

export default AnimeTopGrid;
