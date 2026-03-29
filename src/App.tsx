import "./App.css";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Anime from "./page/Anime";
import Manga from "./page/Manga";
import AnimeInfo from "./page/AnimeInfo";
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
    const unsubscribe = initializeAuth();

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [initializeAuth]);
  return (
    <div className="md:flex flex-col m-auto justify-between pb-20 gap-14 md:mr-8 items-center">
      <Header />
      <div className="mt-4 md:mt-10 w-full">
        <Routes>
          <Route path="/" element={<Anime />} />
          <Route path="/manga" element={<Manga />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/anime/:mal_id/:title" element={<AnimeInfo />} />
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
