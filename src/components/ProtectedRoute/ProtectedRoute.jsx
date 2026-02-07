import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../data/authStore";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore();

  // 1. Поки ми ще питаємо у Firebase "чи є юзер?", показуємо спіннер або просто нічого
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // 2. Якщо перевірка пройшла і юзера НЕМАЄ — кидаємо на вхід
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // 3. Якщо юзер Є — показуємо те, що всередині (сторінку профілю)
  return children;
};

export default ProtectedRoute;
