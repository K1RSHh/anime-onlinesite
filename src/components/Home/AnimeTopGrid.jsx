import { useEffect } from "react";
import { useTopAnimeStore } from "../../data/animeTopStore";
import * as HoverCard from "@radix-ui/react-hover-card";
import AnimeCard from "../AnimeCard/AnimeCard";

function AnimeTopGrid() {
  //add data and function
  const { topAnime, isLoading, fetchTopAnime } = useTopAnimeStore();

  //loading
  useEffect(() => {
    fetchTopAnime();
  }, []);

  if (isLoading) return <h1>Data loading... ⌛</h1>;
  return (
    <>
      <div className="mr-5">
        <p className="text-4xl ml-5 mb-4 text-white">Anime top</p>
        <div className="relative grid grid-cols-5 gap-4 ">
          {topAnime.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      </div>
    </>
  );
}

export default AnimeTopGrid;
