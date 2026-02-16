import { useEffect } from "react";
import { useTopAnimeStore } from "../../data/animeTopStore";
// eslint-disable-next-line
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import AnimeCard from "../AnimeCard/AnimeCard";
import { useAnimeStatuses } from "../../hooks/useAnimeStatuses";
import FilterBar from "../FilterBar/FilterBar";
import { useState } from "react";

function AnimeTopGrid() {
  const userStatuses = useAnimeStatuses();
  const [selectedGenre, setSelectedGenre] = useState(null);

  //add data and function
  const { topAnime, isLoading, fetchTopAnime, page, hasMore } =
    useTopAnimeStore();

  //auto load page
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  //loading
  useEffect(() => {
    //If this is the first launch, then the genre is null, everything is OK.
    const timer = setTimeout(() => {
      //Call the function from: page 1, filter: current genre
      fetchTopAnime(1, { genreId: selectedGenre });
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedGenre]); //Triggers only when selectedGenre updates

  //Scroll effect
  useEffect(() => {
    //Check whether we are at the bottom of the page
    if (inView && !isLoading && hasMore && topAnime.length > 0) {
      //Request the next page, passing on the current genre
      fetchTopAnime(page + 1, { genreId: selectedGenre });
    }
  }, [inView, isLoading, hasMore, topAnime.length, page, selectedGenre]);

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
        <FilterBar
          selectedGenre={selectedGenre}
          onSelect={(id) => setSelectedGenre(id)}
        />
        <div className="grid mt-5 grid-cols-[repeat(auto-fill,minmax(171px,2fr))] px-3 md:px-0 gap-4">
          {topAnime.map((anime) => (
            <AnimeCard
              key={anime.mal_id}
              anime={anime}
              userStatus={userStatuses[anime.mal_id]}
            />
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
