import { useState, useEffect } from "react";
// eslint-disable-next-line
import { AnimatePresence, motion } from "framer-motion";

// 1. Інтерфейс для одного жанру (те, що приходить з Jikan API)
interface Genre {
  mal_id: number;
  name: string;
}

// 2. Інтерфейс для пропсів компонента
interface FilterBarProps {
  selectedGenre: number | null; // Може бути числом або відсутнім
  onSelect: (genreId: number | "") => void; // Функція, яка приймає число або порожній рядок
  onYearFromSelect: (year: string) => void; // Функція, яка приймає рядок року
  yearFromValue: string;
  onYearToSelect: (year: string) => void;
  yearToValue: string;
  onSortSelect: (sort: string) => void;
  sortByValue: string;
}

function FilterBar({
  selectedGenre,
  onSelect,
  onYearFromSelect,
  yearFromValue,
  onYearToSelect,
  yearToValue,
  onSortSelect,
  sortByValue,
}: FilterBarProps) {
  const [genresOpen, setGenresOpen] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);

  const maxYear = new Date().getFullYear();

  //Fetch genres list
  useEffect(() => {
    const getAnimeGenres = async () => {
      try {
        //Request data
        const response = await fetch("https://api.jikan.moe/v4/genres/anime");
        const result = await response.json();

        //Transfer to stated
        setGenres(result.data);
      } catch (err) {
        console.log("Fetch Error anime genres list", err);
      }
    };
    getAnimeGenres();
  }, []);

  //We transfer props on top
  const handleSelect = (genreId: number | "") => {
    onSelect(genreId);
    setGenresOpen(false);
  };

  //Change the label to the active genre
  const activeLabel =
    genres?.find((g) => g.mal_id == selectedGenre)?.name || "Genres";

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 bg-stone-900 p-4 rounded-xl border border-stone-800">
      {/* 1. Блок Жанрів */}
      <div className="relative flex items-center gap-3 w-full md:w-auto">
        <motion.button
          className="flex-1 md:w-48 py-2.5 text-center text-md md:text-lg rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 cursor-pointer text-white"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setGenresOpen(!genresOpen)}
        >
          {activeLabel}
        </motion.button>

        {activeLabel !== "Genres" && (
          <button
            onClick={() => handleSelect("")}
            className="text-xs font-medium uppercase tracking-wider text-fuchsia-500 hover:text-fuchsia-400 underline-offset-4 hover:underline"
          >
            Clear
          </button>
        )}

        {/* Випадаюче вікно жанрів */}
        <AnimatePresence>
          {genresOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full mt-2 left-0 z-50 w-full md:w-[600px]"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl overflow-hidden max-h-[60vh] overflow-y-auto p-2 gap-1">
                {genres.map((item) => (
                  <button
                    key={item.mal_id}
                    onClick={() => handleSelect(item.mal_id)}
                    className={`p-2.5 text-sm rounded-lg transition-all text-left ${
                      item.mal_id === selectedGenre
                        ? "bg-fuchsia-600 text-white font-bold"
                        : "text-stone-300 hover:bg-stone-800"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Блок Років */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="flex items-center gap-2 flex-1 md:flex-none">
          <input
            onChange={(e) => onYearFromSelect(e.target.value)}
            className="w-full md:w-28 py-2 text-center rounded-lg bg-stone-800 border border-stone-700 text-white outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all"
            placeholder="From"
            type="number"
            value={yearFromValue}
          />
          <span className="text-stone-600">—</span>
          <input
            onChange={(e) => onYearToSelect(e.target.value)}
            className="w-full md:w-28 py-2 text-center rounded-lg bg-stone-800 border border-stone-700 text-white outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all"
            placeholder="To"
            type="number"
            value={yearToValue}
          />
        </div>

        {(yearFromValue || yearToValue) && (
          <button
            onClick={() => {
              onYearFromSelect("");
              onYearToSelect("");
            }}
            className="text-xs font-medium uppercase tracking-wider text-fuchsia-500 hover:text-fuchsia-400"
          >
            ✕
          </button>
        )}
      </div>

      {/* 3. Блок Сортування */}
      <div className="w-full md:w-auto md:ml-auto">
        <select
          value={sortByValue}
          onChange={(e) => onSortSelect(e.target.value)}
          className="w-full py-2.5 px-4 rounded-lg bg-stone-800 border border-stone-700 text-stone-200 outline-none cursor-pointer focus:ring-2 focus:ring-fuchsia-500 appearance-none"
        >
          <option value="score-desc">Rating: High to Low</option>
          <option value="score-asc">Rating: Low to High</option>
          <option value="title-asc">Alphabet (A-Z)</option>
          <option value="start_date-desc">Newest First</option>
        </select>
      </div>

      {genresOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={() => setGenresOpen(false)}
        />
      )}
    </div>
  );
}
export default FilterBar;
