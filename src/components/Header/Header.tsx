// eslint-disable-next-line
import { AnimatePresence, motion } from "framer-motion";
import { NavLink, Link, NavLinkProps } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuthStore } from "../../data/authStore";
import { User, LogOut } from "lucide-react";
import { useState, useEffect, ReactNode } from "react";

import "./Header.css";

// "extends NavLinkProps" означає: "Візьми всі правила звичайного NavLink і додай мої"
interface CustomLinkData extends NavLinkProps {
  to: string;
  children: ReactNode;
}

interface AnimeData {
  mal_id: string;
  title: string;
  images: {
    jpg: {
      small_image_url: string;
    };
  };
  year: string;
  type: string;
}

const CustomLink = ({ to, children, ...props }: CustomLinkData) => {
  return (
    <NavLink to={to} {...props}>
      {({ isActive }) => (
        <motion.span
          className="text-2xl block font-bold cursor-pointer"
          initial={{ color: "#ffffff" }}
          animate={{
            color: isActive ? "#C026D3" : "#ffffff",
            scale: isActive ? 1.1 : 1,
          }}
          whileHover={{ scale: 1.2, color: "#C026D3" }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {children}
        </motion.span>
      )}
    </NavLink>
  );
};

function Header() {
  const { user, logOut } = useAuthStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // LIVE SEARCH LOGIC
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    // 2.Timer (Debounce)
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setShowResults(true); // Display the window (even if there is only a spinner there yet)

      try {
        // Query: search by query, limit 5 items, sort by popularity
        const response = await fetch(
          `https://api.jikan.moe/v4/anime?q=${query}&limit=5&order_by=popularity&sort=asc&sfw=true`,
        );
        const data = await response.json();

        setResults(data.data || []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    // Clearing the timer each time a key is pressed
    return () => clearTimeout(timer);
  }, [query]);

  // Close function when clicking on the result
  const handleLinkClick = () => {
    setShowResults(false);
    setQuery(""); // clear field
  };

  return (
    <header className="w-full mt-4 md:mt-10 md:mr-5 px-4">
      <div>
        <div className="max-w-7xl mx-auto flex justify-center md:items-center md:justify-between">
          <Link to="/">
            <motion.span
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              className="flex gap-2"
            >
              <img src="Header/Logo.svg" alt="Logo" />
              <p className="Header-text text-2xl md:text-5xl">Anime Online.</p>
            </motion.span>
          </Link>

          <div className="hidden md:flex">
            <div className="flex justify-between">
              <div className="relative mx-auto mr-4">
                {/* INPUT */}
                <div className="relative flex items-center">
                  <Search className="absolute left-3 text-stone-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search anime..."
                    className="w-full bg-stone-800 text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all placeholder-stone-500"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query && setShowResults(true)}
                  />

                  {/* clare button */}
                  {query && (
                    <button
                      onClick={() => {
                        setQuery("");
                        setResults([]);
                      }}
                      className="absolute right-3 text-stone-500 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {showResults && (
                    <>
                      <div
                        className="fixed inset-0 z-40 bg-transparent"
                        onClick={() => setShowResults(false)}
                      />

                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl z-50 overflow-hidden"
                      >
                        {isLoading ? (
                          <div className="p-4 text-center text-stone-400">
                            Searching...
                          </div>
                        ) : results.length > 0 ? (
                          <ul>
                            {results.map((anime: AnimeData) => (
                              <li
                                key={anime.mal_id}
                                className="border-b border-stone-800 last:border-none"
                              >
                                <Link
                                  to={`/anime/${anime.mal_id}/${anime.title}`}
                                  onClick={handleLinkClick}
                                  className="flex items-center gap-3 p-3 hover:bg-stone-800 transition-colors cursor-pointer group"
                                >
                                  {/* image */}
                                  <img
                                    src={anime.images.jpg.small_image_url}
                                    alt={anime.title}
                                    className="w-10 h-14 object-cover rounded-md group-hover:scale-105 transition-transform"
                                  />

                                  {/* text */}
                                  <div className="flex flex-col">
                                    <span className="text-sm text-left font-semibold text-white group-hover:text-fuchsia-400 transition-colors line-clamp-1">
                                      {anime.title}
                                    </span>
                                    <span className="text-xs text-left text-stone-500">
                                      {anime.year || "Unknown"} • {anime.type}
                                    </span>
                                  </div>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="p-4 text-center text-stone-500 text-sm">
                            No results found for "{query}"
                          </div>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              {user ? (
                //user login
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="hidden md:flex items-center gap-4"
                  >
                    <span className="text-white text-sm font-medium">
                      {user.displayName || user.email?.split("@")[0] || "user"}
                    </span>

                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full border-2 border-stone-800 object-cover"
                      />
                    ) : (
                      //if there is no avatar, we put the letter
                      <div className="w-10 h-10 rounded-full bg-fuchsia-600 flex items-center justify-center text-white font-bold text-xl border-2 border-stone-800">
                        {user.displayName
                          ? user.displayName[0].toUpperCase()
                          : user.email?.[0].toUpperCase() || "U"}
                      </div>
                    )}
                  </Link>
                  {/* exit button */}
                  <button
                    onClick={logOut}
                    className="p-2 text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Log Out"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                // user not login
                <div className="flex gap-6 items-center">
                  <Link to="/signup">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-32 h-11 bg-fuchsia-600 rounded-md cursor-pointer"
                    >
                      Sign up
                    </motion.button>
                  </Link>

                  <Link to="/signin">
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: "#bd00ff" }}
                      whileTap={{ scale: 0.9, backgroundColor: "#C026D3" }}
                      initial={{ backgroundColor: "transparent" }}
                      className="w-32 h-11 bg-transparent border-2 border-fuchsia-600 rounded-md cursor-pointer"
                    >
                      Sign in
                    </motion.button>
                  </Link>
                </div>
              )}{" "}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
