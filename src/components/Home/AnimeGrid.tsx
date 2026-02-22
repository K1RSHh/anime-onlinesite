import { useEffect, useState } from "react";
import { useTopAnimeStore } from "../../data/animeTopStore";
// eslint-disable-next-line
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import AnimeCard, { AnimeCardData } from "../AnimeCard/AnimeCard";
import { useAnimeStatuses } from "../../hooks/useAnimeStatuses";
import FilterBar from "../FilterBar/FilterBar";
import { useSearchParams } from "react-router-dom";

function AnimeTopGrid() {
  const userStatuses = useAnimeStatuses();
  const [searchParams, setSearchParams] = useSearchParams();
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [sortBy, setSortBy] = useState("score-desc");

  const selectedGenre = searchParams.get("genre")
    ? Number(searchParams.get("genre"))
    : null;

  //add data and function
  const { topAnime, isLoading, fetchTopAnime, page, hasMore } =
    useTopAnimeStore();

  const handleGenreSelect = (id: number | "") => {
    if (id) {
      setSearchParams({ genre: id.toString() }); // Додасть /?genre=id
    } else {
      searchParams.delete("genre"); // Очистить URL
      setSearchParams(searchParams);
    }
  };

  //auto load page
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  //loading
  useEffect(() => {
    //If this is the first launch, then the genre is null, everything is OK.
    const timer = setTimeout(() => {
      const [orderBy, sort] = sortBy.split("-");
      if (yearFrom && yearFrom.toString().length < 4) {
        return;
      }
      if (yearTo && yearTo.toString().length < 4) {
        return;
      }

      //Call the function from: page 1, filter: current genre
      fetchTopAnime(1, {
        genreId: selectedGenre,
        yearFrom: yearFrom,
        yearTo: yearTo,
        orderBy: orderBy,
        sort: sort,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedGenre, yearFrom, yearTo, sortBy, fetchTopAnime]); //Triggers only when selectedGenre updates

  //Scroll effect
  useEffect(() => {
    //Check whether we are at the bottom of the page
    if (inView && !isLoading && hasMore && topAnime.length > 0) {
      // 1. Обов'язково дістаємо поточне сортування
      const [orderBy, sort] = sortBy.split("-");

      // 2. Передаємо ВСІ поточні фільтри на наступну сторінку
      fetchTopAnime(page + 1, {
        genreId: selectedGenre,
        yearFrom: yearFrom,
        yearTo: yearTo,
        orderBy: orderBy,
        sort: sort,
      });
    }
  }, [
    inView,
    isLoading,
    hasMore,
    topAnime.length,
    page,
    selectedGenre,
    yearFrom,
    yearTo,
    sortBy,
  ]);

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
          onSelect={handleGenreSelect}
          onYearFromSelect={(year) => setYearFrom(year)}
          yearFromValue={yearFrom}
          onYearToSelect={(year) => setYearTo(year)}
          yearToValue={yearTo}
          onSortSelect={(sort) => setSortBy(sort)}
          sortByValue={sortBy}
        />
        <div className="grid mt-5 grid-cols-[repeat(auto-fill,minmax(171px,2fr))] px-3 md:px-0 gap-4">
          {topAnime.map((anime: AnimeCardData) => (
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
