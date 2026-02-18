import { useState, useEffect } from "react";
// eslint-disable-next-line
import { AnimatePresence, motion } from "framer-motion";

function FilterBar({ selectedGenre, onSelect, onYearSelect, yearValue }) {
  const [genresOpen, setGenresOpen] = useState(false);
  const [genres, setGenres] = useState([]);

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
  const handleSelect = (genreId) => {
    onSelect(genreId);
    setGenresOpen(false);
  };

  //Change the label to the active genre
  const activeLabel =
    genres?.find((g) => g.mal_id == selectedGenre)?.name || "Genres";

  return (
    <div>
      <div className="relative flex items-center gap-4">
        <div className="items-center flex gap-4">
          <motion.button
            className="w-40 py-2 text-center text-xl rounded-md items-center bg-stone-800 hover:bg-stone-700 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setGenresOpen(!genresOpen)}
          >
            {activeLabel}
          </motion.button>
          {activeLabel != "Genres" && (
            <motion.button
              className="text-left px-2 py-2.5 text-md underline rounded-md text-stone-500 hover:bg-stone-800 hover:text-stone-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSelect("")}
            >
              Clear genre
            </motion.button>
          )}
        </div>
        <div className="items-center flex gap-4">
          <motion.input
            //When a user writes we pass it on to the top
            onChange={(e) => onYearSelect(e.target.value)}
            whileFocus={{ scale: 1.05 }}
            whileHover={{ scale: 1.05 }}
            className="w-40 py-2 pl-4 text-xl rounded-md bg-stone-800 hover:bg-stone-700 cursor-pointer"
            placeholder="Year"
            type="number"
            min="1917"
            max={maxYear}
            value={yearValue}
          />
          {yearValue > 0 && (
            <motion.button
              className="text-left px-2 py-2.5 text-md underline rounded-md text-stone-500 hover:bg-stone-800 hover:text-stone-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onYearSelect(null)}
            >
              Clear year
            </motion.button>
          )}
        </div>
        <AnimatePresence initial={false}>
          {genresOpen ? (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              style={{ originX: 0, originY: 0 }}
              className="absolute top-full mt-1 left-0 z-50 w-full md:w-auto"
              key="box"
            >
              <div className="grid grid-cols-5 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl overflow-hidden">
                {genres.map((item) => (
                  <button
                    key={item.mal_id}
                    onClick={() => handleSelect(item.mal_id)}
                    className={`w-full flex items-center text-center justify-center  gap-3 px-4 py-3 text-lg hover:bg-stone-800 transition-colors cursor-pointer 
                ${
                  item.mal_id === selectedGenre
                    ? "bg-fuchsia-600/20 text-fuchsia-400 font-bold"
                    : "text-stone-300 hover:bg-stone-800 hover:text-white"
                }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        {genresOpen && (
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={() => setGenresOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
export default FilterBar;
