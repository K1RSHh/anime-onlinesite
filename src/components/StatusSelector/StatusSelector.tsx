import { useState, useEffect } from "react";
import { db } from "../../firebaseAppObject";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { ChevronDown, Check, Eye, Clock, Archive, XCircle } from "lucide-react";

interface StatusSelector {
  mal_id: number;
  title: string;
  score: number;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

interface StatusSelectorProps {
  anime: StatusSelector;
  userId: string;
}

const StatusSelector = ({ anime, userId }: StatusSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null); // 'watching', 'completed', etc.
  const [loading, setLoading] = useState(true);

  // Опції для меню
  const statuses = [
    {
      value: "watching",
      label: "Watching",
      icon: <Eye size={16} />,
      color: "bg-blue-600",
    },
    {
      value: "completed",
      label: "Completed",
      icon: <Check size={16} />,
      color: "bg-green-600",
    },
    {
      value: "planned",
      label: "Plan to Watch",
      icon: <Clock size={16} />,
      color: "bg-stone-600",
    },
    {
      value: "dropped",
      label: "Dropped",
      icon: <Archive size={16} />,
      color: "bg-red-600",
    },
  ];

  // 1. Перевіряємо при завантаженні, чи це аніме вже в списку
  useEffect(() => {
    if (!userId || !anime) return;

    const checkStatus = async () => {
      const docRef = doc(
        db,
        "users",
        `${userId}`,
        "animeList",
        `${anime.mal_id}`,
      );
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCurrentStatus(docSnap.data().status);
      }
      setLoading(false);
    };

    checkStatus();
  }, [userId, anime]);

  // 2. Логіка зміни статусу
  const handleSelect = async (statusValue: string) => {
    if (!userId) return alert("Please login first!"); // Або редірект на логін
    setLoading(true);
    setIsOpen(false);

    const docRef = doc(
      db,
      "users",
      `${userId}`,
      "animeList",
      `${anime.mal_id}`,
    );

    try {
      // Якщо натиснули "Remove from List"
      if (statusValue === "remove") {
        await deleteDoc(docRef);
        setCurrentStatus(null);
      } else {
        // Додаємо або оновлюємо
        await setDoc(
          docRef,
          {
            animeId: anime.mal_id,
            title: anime.title,
            image: anime.images.jpg.image_url,
            score: anime.score,
            status: statusValue,
            updatedAt: new Date(),
          },
          { merge: true },
        ); // merge важливий, щоб не стерти інші дані, якщо вони там будуть

        setCurrentStatus(statusValue);
      }
    } catch (error) {
      console.error("Error updating list:", error);
    } finally {
      setLoading(false);
    }
  };

  // Знаходимо колір активної кнопки
  const activeOption = statuses.find((s) => s.value === currentStatus);
  const buttonColor = activeOption
    ? activeOption.color
    : "bg-stone-800 hover:bg-stone-700";

  return (
    <div className="relative">
      {/* --- ГОЛОВНА КНОПКА --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all w-full md:w-auto justify-between ${buttonColor}`}
      >
        <span className="flex items-center gap-2">
          {loading ? (
            "Loading..."
          ) : (
            <>{activeOption ? activeOption.label : "Add to List"}</>
          )}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* --- ВИПАДАЮЧЕ МЕНЮ --- */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-full md:w-56 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl z-50 overflow-hidden">
          {statuses.map((item) => (
            <button
              key={item.value}
              onClick={() => handleSelect(item.value)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-stone-800 transition-colors ${
                currentStatus === item.value
                  ? "text-fuchsia-400 font-bold bg-stone-800/50"
                  : "text-stone-300"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          {/* Кнопка видалення (показуємо тільки якщо аніме в списку) */}
          {currentStatus && (
            <button
              onClick={() => handleSelect("remove")}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 border-t border-stone-800"
            >
              <XCircle size={16} />
              Remove from List
            </button>
          )}
        </div>
      )}

      {/* Закрити меню, якщо клікнули поза ним (простий backdrop) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default StatusSelector;
