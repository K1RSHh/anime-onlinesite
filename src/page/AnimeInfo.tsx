import { useParams } from "react-router";
import { useEffect, useState, MouseEvent } from "react";
import { fetchAnime } from "../data/anime";
import ExpandableText from "../components/ExpandableText/ExpandableText";
// eslint-disable-next-line
import { motion } from "framer-motion";
import { useAuthStore } from "../data/authStore";
import StatusSelector from "../components/StatusSelector/StatusSelector";
import { useNavigate } from "react-router";

interface AnimeInfoData {
  mal_id: number;
  title: string;
  title_japanese: string;
  score: number;
  synopsis: string;
  type: string;
  episodes: number | null;
  status: string;
  year: number | null;
  images: {
    jpg: {
      image_url: string; // Потрібно для StatusSelector
      large_image_url: string;
    };
  };
  genres: {
    mal_id: number;
    name: string;
  }[];
  trailer?: {
    embed_url: string | null;
  };
}

function AnimeInfo() {
  const { mal_id } = useParams<{ mal_id: string }>();
  const [anime, setAnime] = useState<AnimeInfoData | null>(null);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleGenreClick = (e: MouseEvent<HTMLDivElement>, genreId: number) => {
    e.stopPropagation();
    e.preventDefault();
    navigate("/", { state: { targetGenre: genreId } });
  };

  useEffect(() => {
    // 3. Додаємо перевірку: якщо id немає, нічого не завантажуємо
    if (!mal_id) return;

    const getData = async () => {
      setAnime(null);
      try {
        // Тепер TS знає, що mal_id тут точно є
        const data = await fetchAnime(Number(mal_id));
        setAnime(data);
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    getData();
  }, [mal_id]);

  if (!anime) return <div>Loading... ⌛</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 🚀 ГОЛОВНИЙ КОНТЕЙНЕР: Розділяємо на дві колонки */}
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* ЛІВА ЧАСТИНА: Постер + Опис */}
        <div className="flex-1 flex flex-col md:flex-row gap-10">
          {/* Постер та Кнопка статусу */}
          <div className="w-full md:w-72 shrink-0">
            <img
              className="w-full rounded-xl shadow-2xl border border-stone-800"
              src={anime.images.jpg.large_image_url}
              alt={anime.title}
            />
            <div className="mt-6">
              {user ? (
                <StatusSelector anime={anime} userId={user.uid} />
              ) : (
                <button className="w-full px-6 py-3 bg-stone-800 text-stone-500 rounded-lg cursor-not-allowed border border-stone-700">
                  Log in to add to list
                </button>
              )}
            </div>
          </div>

          {/* Назва, Жанри та Синопсис */}
          <div className="flex-1 relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="font-bold text-4xl lg:text-5xl text-white mb-2 leading-tight">
                  {anime.title}
                </h1>
                <p className="text-stone-500 text-xl">{anime.title_japanese}</p>
              </div>
              <div className=" px-4 py-2 rounded-xl text-center">
                <span className="text-yellow-400 font-bold text-2xl">
                  {anime.score}★
                </span>
                <p className="text-[10px] text-stone-500 uppercase tracking-widest">
                  Score
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8 mt-4">
              {anime.genres?.map((genre) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={genre.mal_id}
                  onClick={(e) => handleGenreClick(e, genre.mal_id)}
                  className="px-3 py-1.5 cursor-pointer bg-stone-800/80 text-stone-200 text-lg rounded-lg border border-stone-700 hover:bg-fuchsia-600 hover:border-fuchsia-500 transition-all"
                >
                  {genre.name}
                </motion.div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">Synopsis</h2>
            <div className="text-stone-300 leading-relaxed">
              <ExpandableText text={anime.synopsis} maxLength={500} />
            </div>
          </div>
        </div>

        {/* ПРАВА ЧАСТИНА (Сайдбар): Інфо-блок + Трейлер */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          {/* Блок з інформацією */}
          <div className="bg-stone-900/40 backdrop-blur-md p-6 rounded-2xl border border-stone-800 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-stone-800 pb-2">
              Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-stone-500 text-xs uppercase font-bold tracking-wider">
                  Type
                </p>
                <p className="text-stone-200">{anime.type}</p>
              </div>
              <div>
                <p className="text-stone-500 text-xs uppercase font-bold tracking-wider">
                  Episodes
                </p>
                <p className="text-stone-200">{anime.episodes || "?"}</p>
              </div>
              <div>
                <p className="text-stone-500 text-xs uppercase font-bold tracking-wider">
                  Status
                </p>
                <p
                  className={`font-medium ${anime.status === "Currently Airing" ? "text-fuchsia-400" : "text-green-400"}`}
                >
                  {anime.status}
                </p>
              </div>
              <div>
                <p className="text-stone-500 text-xs uppercase font-bold tracking-wider">
                  Year
                </p>
                <p className="text-stone-200">{anime.year || "Unknown"}</p>
              </div>
            </div>
          </div>

          {/* Трейлер (тепер він чітко під інфо-блоком) */}
          {anime.trailer?.embed_url && (
            <div className="bg-stone-900/40 backdrop-blur-md p-4 rounded-2xl border border-stone-800 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-3">Trailer</h3>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-stone-800">
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
      </div>
    </div>
  );
}

export default AnimeInfo;
