import { useEffect } from "react";
import { useTopAnimeStore } from "../animeTopStore";

const getRatingColor = (score) => {
  if (score >= 9) return "text-emerald-400";
  if (score >= 7.5) return "text-green-400";
  if (score >= 6) return "text-yellow-400";
  return "text-red-400 border-red-400";
};

function Home() {
  //add data and function
  const { topAnime, isLoading, fetchTopAnime } = useTopAnimeStore();

  //loading
  useEffect(() => {
    fetchTopAnime();
  }, []);

  if (isLoading) return <h1>Data loading... ⌛</h1>;
  return (
    <>
      <div>
        <p className="text-4xl text-center mb-4 text-white">Anime top</p>
        <div className="grid grid-cols-4 gap-7">
          {topAnime.map((anime) => (
            <div key={anime.mal_id} className="flex flex-col text-center">
              <img
                className="max-h-80 max-w-60 rounded-md m-auto"
                src={anime.images.jpg.image_url}
                alt={anime.title}
              />
              <div className="mt-2">
                <h3>{anime.title}</h3>
                <p className={`${getRatingColor(anime.score)}`}>
                  Score: {anime.score}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
