import { useEffect, useState } from "react";
import { db } from "../../firebaseAppObject";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Star, Eye, CheckCircle, Clock } from "lucide-react";

const AnimeList = ({ userId }) => {
  const [animeList, setAnimeList] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all', 'watching', 'completed', 'planned'
  const [loading, setLoading] = useState(true);

  // Категорії для вкладок
  const tabs = [
    { id: "all", label: "All", icon: null },
    { id: "watching", label: "Watching", icon: <Eye size={16} /> },
    { id: "completed", label: "Completed", icon: <CheckCircle size={16} /> },
    { id: "planned", label: "Plan to Watch", icon: <Clock size={16} /> },
  ];

  useEffect(() => {
    if (!userId) return; // 👈 ДОДАЙ ЦЕЙ РЯДОК! Без нього запит ламається.

    // 1. Посилання на підколекцію
    const listRef = collection(db, "users", userId, "animeList");

    // 2. Формуємо запит (Query)
    let q = query(listRef);

    // Якщо вибрано не "All", додаємо фільтр
    if (filter !== "all") {
      q = query(listRef, where("status", "==", filter));
    }

    // 3. Підписуємось на оновлення в реальному часі
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnimeList(data);
      setLoading(false);
    });

    // Очищення підписки при виході зі сторінки
    return () => unsubscribe();
  }, [userId, filter]);

  if (loading)
    return (
      <div className="text-center py-10 text-stone-500">Loading list...</div>
    );

  return (
    <div className="bg-transparent border border-stone-800 rounded-2xl p-6 min-h-100 mt-0">
      {/* --- ВКЛАДКИ (TABS) --- */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-stone-800 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.id
                ? "bg-fuchsia-600 text-white"
                : "bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- СПИСОК АНІМЕ --- */}
      {animeList.length === 0 ? (
        <div className="text-center py-12 text-stone-500">
          <p>List is empty in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(171px,2fr))] px-3 md:px-0 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {animeList.map((anime) => (
            <Link
              key={anime.id}
              to={`/anime/${anime.animeId}/${anime.title}`} // Посилання на сторінку деталей
              className="group bg-stone-950 rounded-xl overflow-hidden border border-stone-800 hover:border-fuchsia-500/50 transition-all"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={anime.image}
                  alt={anime.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs font-bold text-yellow-400 flex items-center gap-1">
                  <Star size={10} fill="currentColor" />
                  {anime.score}
                </div>
              </div>
              <div className="p-3">
                <h4
                  className="font-bold text-white truncate mb-1"
                  title={anime.title}
                >
                  {anime.title}
                </h4>
                {/* Бейдж статусу */}
                <span
                  className={`text-xs px-2 py-0.5 rounded capitalize ${
                    anime.status === "watching"
                      ? "bg-blue-500/20 text-blue-400"
                      : anime.status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-stone-700 text-stone-300"
                  }`}
                >
                  {anime.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimeList;
