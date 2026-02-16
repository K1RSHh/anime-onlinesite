import { useState, useEffect } from "react";

function FilterBar({ selectedGenre, onSelect }) {
  const [genresOpen, setGenresOpen] = useState(false);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const getAnimeGenres = async () => {
      try {
        const response = await fetch("https://api.jikan.moe/v4/genres/anime");
        const result = await response.json();
        setGenres(result.data);
        console.log(result);
      } catch {
        console("Mega ERROR");
      }
    };
    getAnimeGenres();
  }, []);

  const handleSelect = (genreId) => {
    onSelect(genreId);
    setGenresOpen(false);
  };

  const activeLabel =
    genres.find((g) => g.mal_id === selectedGenre)?.name || "Genres";

  return (
    <div>
      <div className="relative">
        <div className="items-center flex gap-2">
          <button
            onClick={() => setGenresOpen(!genresOpen)}
            className="w-40 py-2 text-center text-xl rounded-md items-center bg-stone-800 hover:bg-stone-700 cursor-pointer"
          >
            <span>{activeLabel}</span>
          </button>
          <button
            onClick={() => handleSelect(null)}
            className="w-40 text-left px-4 py-2 text-xl rounded-md text-stone-500 hover:bg-stone-800 hover:text-stone-300"
          >
            All Genres
          </button>
        </div>
        {genresOpen && (
          <div className="absolute top-full mt-1 left-0 w-full md:w-40 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl z-50 overflow-hidden">
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
        )}

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
