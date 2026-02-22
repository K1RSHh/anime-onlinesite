import { useEffect, useState } from "react";
import { db } from "../firebaseAppObject";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuthStore } from "../data/authStore";

export const useAnimeStatuses = (): Record<number, string> => {
  const { user } = useAuthStore();
  const [statuses, setStatuses] = useState<Record<number, string>>({});

  // 1. Зберігаємо ID в змінну для стабільності
  const userId = user?.uid;

  useEffect(() => {
    // 2. Якщо ID немає — просто нічого не робимо.
    // Ми НЕ викликаємо тут setStatuses({}), щоб не було конфлікту!
    if (!userId) return;

    const listRef = collection(db, "users", userId, "animeList");

    const unsubscribe = onSnapshot(
      listRef,
      (snapshot) => {
        const statusMap: Record<number, string> = {};

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          statusMap[data.animeId as number] = data.status as string;
        });

        setStatuses(statusMap);
      },
      (error) => {
        console.error("Помилка:", error);
      },
    );

    return () => unsubscribe();
  }, [userId]); // 👈 Залежність тільки від ID

  // 👇 МАГІЯ ТУТ:
  // Замість того щоб чистити стейт, ми просто перевіряємо:
  // "Якщо юзера немає — віддай пустий об'єкт, і байдуже що там в стейті".
  if (!userId) return {};

  return statuses;
};
