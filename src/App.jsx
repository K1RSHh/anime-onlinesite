import "./App.css";
import { Route, Routes } from "react-router";
import Header from "./components/Header/Header";
import Home from "./page/home";
import News from "./page/News";
import Categories from "./page/Categories";

function App() {
  return (
    <div className="w-full h-full m-5">
      <Header />
      <div className="mt-24 max-w-6xl m-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
