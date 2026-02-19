import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { fetchAnime } from "../data/anime";
import ExpandableText from "../components/ExpandableText/ExpandableText";
// eslint-disable-next-line
import { motion } from "framer-motion";
import { useAuthStore } from "../data/authStore";
import StatusSelector from "../components/StatusSelector/StatusSelector";
import { useNavigate } from "react-router";

function Anime() {
  const { mal_id } = useParams();
  const [anime, setAnime] = useState(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleGenreClick = (e, genreId) => {
    e.stopPropagation();
    e.preventDefault();
    navigate("/", { state: { targetGenre: genreId } });
  };

  useEffect(() => {
    const getData = async () => {
      setAnime(null);
      try {
        const data = await fetchAnime(mal_id);
        console.log("fetch data", data);
        setAnime(data);
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    getData();
  }, [mal_id]);

  if (!anime) return <div>Loading... ⌛</div>;

  return (
    <div>
      <div className="flex w-full">
        <div className="max-w-72 relative">
          <img
            className="w-full rounded-md"
            src={anime.images.jpg.large_image_url}
            alt={anime.title}
          />
          <div className="mt-6">
            {user ? (
              // 👇 Вставляємо нашу розумну кнопку
              <StatusSelector anime={anime} userId={user.uid} />
            ) : (
              // 👇 Якщо не залогінений — просимо увійти
              <button className="px-6 py-3 bg-stone-800 text-stone-500 rounded-lg cursor-not-allowed">
                Log in to add to list
              </button>
            )}
          </div>
        </div>

        <div className="text-3xl relative md:max-w-xl md:flex md:flex-col gap-2 md:ml-10">
          <p className="absolute top-1 right-0 text-yellow-300 font-bold">
            {anime.score}★
          </p>
          <p className="font-bold text-3xl max-w-4/5">{anime.title}</p>
          <p className="text-neutral-500 text-xl">{anime.title_japanese}</p>
          <div className="flex gap-3">
            {anime.genres &&
              anime.genres.slice(0, 3).map((genre) => (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  key={genre.mal_id}
                  onClick={(e) => handleGenreClick(e, genre.mal_id)}
                  className="px-2 py-1 cursor-pointer bg-stone-700/70 text-white text-lg rounded-md border border-stone-700
                    hover:bg-fuchsia-600/80
                    "
                >
                  {genre.name}
                </motion.div>
              ))}
          </div>
          <p className="text-2xl">Synopsis:</p>
          <ExpandableText text={anime.synopsis} maxLength={300} />
        </div>
        <div>
          <div className="flex flex-col ml-10 h-72 md:grid-cols-4 gap-4 mt-4 bg-stone-900/50 p-4 rounded-xl">
            <div>
              <p className="text-stone-500 text-sm">Type</p>
              <p className="font-semibold">{anime.type}</p>
            </div>
            <div>
              <p className="text-stone-500 text-sm">Episodes</p>
              <p className="font-semibold">{anime.episodes || "?"}</p>
            </div>
            <div>
              <p className="text-stone-500 text-sm">Status</p>
              <p className="font-semibold">{anime.status}</p>
            </div>
            <div>
              <p className="text-stone-500 text-sm">Year</p>
              <p className="font-semibold">{anime.year || "Unknown"}</p>
            </div>
          </div>
        </div>
      </div>
      {anime.trailer?.embed_url && (
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4 border-b border-stone-700 pb-2">
            Trailer
          </h3>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-stone-800 shadow-2xl">
            <iframe
              src={anime.trailer.embed_url}
              title="Trailer"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default Anime;
