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
    <div className="flex flex-wrap items-center gap-4 bg-stone-900 p-4 rounded-xl border border-stone-800">
      {/* 1. Блок Жанрів (твій оригінальний код) */}
      <div className="relative flex items-center gap-2">
        <motion.button
          className="w-40 py-2 text-center text-md md:text-xl rounded-md bg-stone-800 hover:bg-stone-700 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setGenresOpen(!genresOpen)}
        >
          {activeLabel}
        </motion.button>
        {activeLabel !== "Genres" && (
          <button
            onClick={() => handleSelect("")}
            className="text-sm underline text-stone-500 hover:text-stone-300"
          >
            Clear
          </button>
        )}

        {/* Випадаюче вікно жанрів */}
        <AnimatePresence initial={false}>
          {genresOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              style={{ originX: 0, originY: 0 }}
              className="absolute top-full mt-2 left-0 z-50 w-75 md:w-150"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl overflow-hidden max-h-100 overflow-y-auto">
                {genres.map((item) => (
                  <button
                    key={item.mal_id}
                    onClick={() => handleSelect(item.mal_id)}
                    className={`w-full p-2 text-sm md:text-md hover:bg-stone-800 transition-colors ${
                      item.mal_id === selectedGenre
                        ? "bg-fuchsia-600/20 text-fuchsia-400 font-bold"
                        : "text-stone-300"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {genresOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setGenresOpen(false)}
          />
        )}
      </div>

      {/* 2. Блок Років (Від і До) */}
      <div className="flex items-center gap-2">
        <input
          onChange={(e) => onYearFromSelect(e.target.value)}
          className="w-24 py-2 text-center text-md rounded-md bg-stone-800 hover:bg-stone-700 outline-none focus:ring-1 focus:ring-fuchsia-500"
          placeholder="From yr"
          type="number"
          min="1917"
          max={maxYear}
          value={yearFromValue}
        />
        <span className="text-stone-500">-</span>
        <input
          onChange={(e) => onYearToSelect(e.target.value)}
          className="w-24 py-2 text-center text-md rounded-md bg-stone-800 hover:bg-stone-700 outline-none focus:ring-1 focus:ring-fuchsia-500"
          placeholder="To yr"
          type="number"
          min="1917"
          max={maxYear}
          value={yearToValue}
        />
        {(yearFromValue || yearToValue) && (
          <button
            onClick={() => {
              onYearFromSelect("");
              onYearToSelect("");
            }}
            className="text-sm underline text-stone-500 hover:text-stone-300"
          >
            Clear
          </button>
        )}
      </div>

      {/* 3. Блок Сортування */}
      <div className="flex items-center gap-2 ml-auto">
        <select
          value={sortByValue}
          onChange={(e) => onSortSelect(e.target.value)}
          className="py-2 px-3 text-md rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 outline-none cursor-pointer focus:ring-1 focus:ring-fuchsia-500"
        >
          <option value="score-desc">Rating (High to Low)</option>
          <option value="score-asc">Rating (Low to High)</option>
          <option value="title-asc">Alphabet (A-Z)</option>
          <option value="title-desc">Alphabet (Z-A)</option>
          <option value="start_date-desc">Newest First</option>
          <option value="start_date-asc">Oldest First</option>
        </select>
      </div>
    </div>
  );
}
export default FilterBar;
