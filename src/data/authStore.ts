import { create } from "zustand";
import { User } from "firebase/auth";
import { auth } from "../firebaseAppObject";
import { onAuthStateChanged, signOut } from "firebase/auth";

interface AuthState {
  user: User | null;
  loading: boolean;
  logOut: () => Promise<void>;

  // 👇 ДОДАЙ ОСЬ ЦЕЙ РЯДОК:
  initializeAuth: () => () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null, // Тут буде об'єкт користувача
  loading: true, // Поки перевіряємо, чи юзер зайшов

  // Функція підписки на зміни (хто зайшов/вийшов)
  initializeAuth: () => {
    // Firebase сам перевіряє токени і куки
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      set({ user: currentUser, loading: false });
    });
    return unsubscribe; // Щоб можна було відписатись
  },

  // Функція виходу
  logOut: async () => {
    try {
      await signOut(auth);
      set({ user: null });
    } catch (error) {
      console.error("Помилка виходу:", error);
    }
  },
}));
