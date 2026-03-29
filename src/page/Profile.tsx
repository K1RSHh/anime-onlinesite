// eslint-disable-next-line
import { motion } from "framer-motion";
import { useAuthStore } from "../data/authStore";
import { LogOut, User, Mail, Calendar } from "lucide-react";
import AnimeList from "../components/AnimeList/AnimeList";

const Profile = () => {
  const { user, logOut } = useAuthStore();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Loading profile...</p>
      </div>
    );
  }

  const creationTime = user?.metadata?.creationTime;

  const joinDate = creationTime
    ? new Date(creationTime).toLocaleDateString("uk-UA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <div className="min-h-screen px-4 py-10  text-white">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* ЛІВА КОЛОНКА: Інфо про юзера */}
        <div className="md:col-span-1">
          <div className="bg-transparent border border-stone-800 rounded-2xl p-6 shadow-xl sticky top-24">
            {/* Аватарка */}
            <div className="flex justify-center mb-6">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full border-4 border-stone-800 object-cover shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-fuchsia-600 flex items-center justify-center text-5xl font-bold border-4 border-stone-800">
                  {user.displayName ? user.displayName[0].toUpperCase() : "U"}
                </div>
              )}
            </div>

            {/* Текстові дані */}
            <h2 className="text-2xl font-bold text-center mb-1">
              {user.displayName || "No Name"}
            </h2>
            <p className="text-stone-500 text-center text-sm mb-6">Anime Fan</p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-stone-300">
                <Mail size={18} className="text-fuchsia-500" />
                <span className="text-sm truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-stone-300">
                <Calendar size={18} className="text-fuchsia-500" />
                <span className="text-sm">Joined: {joinDate}</span>
              </div>
            </div>

            {/* Кнопка виходу */}
            <button
              onClick={logOut}
              className="w-40 flex m-auto cursor-pointer items-center justify-center gap-2 py-2 bg-stone-800 hover:bg-red-500/10 hover:text-red-500 border border-stone-700 hover:border-red-500/50 rounded-lg transition-all"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* ПРАВА КОЛОНКА: Контент (в майбутньому тут будуть "Улюблені") */}
        <div className="md:col-span-2">
          <div className="md:col-span-2">
            {/* Передаємо userId, щоб компонент знав, чий список вантажити */}
            {user && <AnimeList userId={user.uid} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
