import { useEffect } from "react";
import { useTopAnimeStore } from "../../data/animeTopStore";
// eslint-disable-next-line
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import AnimeCard from "../AnimeCard/AnimeCard";

function AnimeTopGrid() {
  // add data and function
  const { topAnime, isLoading, fetchTopAnime, page, hasMore } =
    useTopAnimeStore();

  // auto load page
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  // loading
  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      fetchTopAnime(page + 1);
    }
  }, [inView, isLoading, hasMore, page, fetchTopAnime]);

  useEffect(() => {
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

  return (
    <>
      <div className="pb-20">
        <p className="text-4xl text-center md:text-left  mb-4 text-white">
          Anime top
        </p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(171px,2fr))] px-3 md:px-0 gap-4">
          {topAnime.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
        <div
          ref={ref}
          className="flex justify-center items-center h-20 w-full mt-8"
        >
          {isLoading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fuchsia-600"></div>
          )}
          {hasMore && !isLoading && (
            <p className="text-stone-500">That's all for today! 🎉</p>
          )}
        </div>
      </div>
    </>
  );
}

export default AnimeTopGrid;
