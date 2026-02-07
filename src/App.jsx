import "./App.css";
import { Route, Routes } from "react-router";
import Header from "./components/Header/Header";
import Home from "./page/home";
import News from "./page/News";
import Anime from "./page/Anime";
import Categories from "./page/Categories";
import MobileBottomNav from "./components/MobileBottomNav/MobileBottomNav";
import { useEffect } from "react";
import { useAuthStore } from "./data/authStore";
import SignUp from "./page/SignUp";
import SignIn from "./page/SignIn";
import Profile from "./page/Profile";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    // Запускаємо слухача при старті сайту
    const unsubscribe = initializeAuth();
    // Прибираємо за собою, коли закриваємо сайт
    return () => unsubscribe();
  }, []);

  return (
    <div className="md:flex flex-col justify-between pb-20 gap-14 md:mr-8 items-center">
      <Header />
      <div className="mt-4 md:mt-10 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/anime/:mal_id/:title" element={<Anime />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <MobileBottomNav />
    </div>
  );
}

export default App;
