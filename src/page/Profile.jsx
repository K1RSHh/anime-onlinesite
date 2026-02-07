import { useAuthStore } from "../data/authStore";
import { LogOut, User, Mail, Calendar } from "lucide-react";

const Profile = () => {
  const { user, logOut } = useAuthStore();

  // Форматування дати створення акаунту (з timestamp Firebase)
  const joinDate = new Date(
    parseInt(user?.metadata?.createdAt),
  ).toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen px-4 py-10 pt-24 text-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ЛІВА КОЛОНКА: Інфо про юзера */}
        <div className="md:col-span-1">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl sticky top-24">
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
              className="w-full flex items-center justify-center gap-2 py-2 bg-stone-800 hover:bg-red-500/10 hover:text-red-500 border border-stone-700 hover:border-red-500/50 rounded-lg transition-all"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* ПРАВА КОЛОНКА: Контент (в майбутньому тут будуть "Улюблені") */}
        <div className="md:col-span-2">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 min-h-[400px]">
            <h3 className="text-xl font-bold mb-6 border-b border-stone-800 pb-4">
              My Watchlist{" "}
              <span className="text-stone-500 text-sm font-normal ml-2">
                (Coming Soon)
              </span>
            </h3>

            {/* Заглушка (Empty State) */}
            <div className="flex flex-col items-center justify-center h-64 text-stone-500">
              <div className="bg-stone-800 p-4 rounded-full mb-4">
                <User size={32} className="opacity-50" />
              </div>
              <p>You haven't added any anime yet.</p>
              <button className="mt-4 px-6 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-500 transition-colors">
                Explore Anime
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
