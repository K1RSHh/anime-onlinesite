import "./App.css";
import { Route, Routes } from "react-router";
import Header from "./components/Header/Header";
import Home from "./page/home";
import News from "./page/News";
import Categories from "./page/Categories";
import MobileBottomNav from "./components/MobileBottomNav/MobileBottomNav";

function App() {
  return (
    <div className="md:flex flex-col justify-between pb-20 gap-14 md:mr-8 items-center">
      <Header />
      <div className="mt-4 md:mt-24 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </div>
      <MobileBottomNav />
    </div>
  );
}

export default App;
