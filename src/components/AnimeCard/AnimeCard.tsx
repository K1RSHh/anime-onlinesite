import * as HoverCard from "@radix-ui/react-hover-card";
// eslint-disable-next-line
import { motion, AnimatePresence, StepId } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Eye, Clock, Archive } from "lucide-react";

export interface AnimeCardData {
  mal_id: number;
  title: string;
  score: number;
  status: string;
  rank: number;
  title_japanese: string;
  episodes: number;
  year: number;
  type: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  genres: {
    mal_id: number;
    name: string;
  }[];
}

interface AnimeCardProps {
  anime: AnimeCardData;
  userStatus?: string;
}

const getRatingColor = (score: number) => {
  console.log(score);
  if (score >= 9) return "font-bold text-emerald-400";
  if (score >= 7.5) return "font-bold text-green-400";
  if (score >= 6) return "font-bold text-yellow-400";
  return "text-red-400 border-red-400";
};

const AnimeCard = ({ anime, userStatus }: AnimeCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "watching":
        return {
          color: "bg-blue-600",
          icon: <Eye size={12} />,
          text: "Watching",
        };
      case "completed":
        return {
          color: "bg-green-600",
          icon: <Check size={12} />,
          text: "Completed",
        };
      case "planned":
        return {
          color: "bg-stone-500",
          icon: <Clock size={12} />,
          text: "Planned",
        };
      case "dropped":
        return {
          color: "bg-red-600",
          icon: <Archive size={12} />,
          text: "Dropped",
        };
      default:
        return null;
    }
  };

  const badge = userStatus ? getStatusBadge(userStatus) : null;

  return (
    <HoverCard.Root openDelay={70} closeDelay={100}>
      {/* --- MAIN CARD --- */}
      <HoverCard.Trigger asChild>
        <Link to={`/anime/${anime.mal_id}/${anime.title}`}>
          <div className="relative group cursor-pointer">
            <div className="relative overflow-hidden rounded-md">
              <div className="absolute top-2 right-2 z-10 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-sm font-bold shadow-lg">
                # {anime.rank}
              </div>
              {badge && (
                <div
                  className={`absolute top-2 left-2 ${badge.color} text-white px-2 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md`}
                >
                  {badge.icon}
                  {badge.text}
                </div>
              )}
              <img
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                src={anime.images.jpg.image_url}
                alt={anime.title}
              />
            </div>
            <div className="mt-2">
              <h3 className="mb-1 text-white font-medium truncate">
                {anime.title}
              </h3>
              <span
                className={`text-sm font-bold ${getRatingColor(anime.score)}`}
              >
                ★ {anime.score}
              </span>
            </div>
          </div>
        </Link>
      </HoverCard.Trigger>

      {/* --- TP INSIDE BODY --- */}
      <HoverCard.Portal>
        <HoverCard.Content
          side="right"
          align="start"
          sideOffset={15}
          avoidCollisions={true}
          className="z-50 outline-none pointer-events-none"
        >
          {/* --- OPEN ANIMATION ---  */}
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="w-72 bg-stone-900/90 backdrop-blur-sm border border-stone-700 p-4 rounded-xl shadow-2xl text-white"
          >
            {/* --- INSIDE CARD --- */}
            <h3 className="font-bold text-lg leading-tight mb-1">
              {anime.title}
            </h3>
            <p className="text-stone-400 text-xs mb-4">
              {anime.title_japanese}
            </p>
            <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
              <div className="text-stone-400">Episodes:</div>
              <div>
                {anime.episodes || "?"} / {anime.episodes || "?"}
              </div>
              <div className="text-stone-400">Status:</div>
              <div
                className={
                  anime.status === "Currently Airing"
                    ? "text-fuchsia-400"
                    : "text-green-400"
                }
              >
                {anime.status === "Currently Airing" ? "Ongoing" : "Finished"}
              </div>
              <div className="text-stone-400">Years:</div>
              <div>{anime.year || 2024}</div>
              <div className="text-stone-400">Type:</div>
              <div>{anime.type}</div>
            </div>
            {/*--- GENRES --- */}
            <div className="flex flex-wrap gap-2">
              {anime.genres &&
                anime.genres.slice(0, 3).map((genre) => (
                  <span
                    key={genre.mal_id}
                    className="px-2 py-1 bg-stone-800 text-stone-300 text-xs rounded-md border border-stone-700"
                  >
                    {genre.name}
                  </span>
                ))}
            </div>
            <HoverCard.Arrow
              className="fill-stone-900 stroke-stone-700"
              width={12}
              height={8}
            />
          </motion.div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};

export default AnimeCard;
