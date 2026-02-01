import "./App.css";
import { Route, Routes } from "react-router";
import Home from "./page/home";
import Header from "./components/Header/Header";

function App() {
  return (
    <div className="w-full m-5">
      <Header />
      <div className="mt-24 max-w-6xl m-auto">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
