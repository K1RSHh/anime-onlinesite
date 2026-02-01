// eslint-disable-next-line
import { motion } from "framer-motion";
import { NavLink, Link } from "react-router";
import { Search } from "lucide-react";
import "./Header.css";

const CustomLink = ({ to, children, ...props }) => {
  return (
    <NavLink to={to} {...props}>
      {({ isActive }) => (
        <motion.span
          className="text-2xl block font-bold cursor-pointer"
          initial={{ color: "#ffffff" }}
          animate={{
            color: isActive ? "#C026D3" : "#ffffff",
            scale: isActive ? 1.1 : 1,
          }}
          whileHover={{ scale: 1.2, color: "#C026D3" }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {children}
        </motion.span>
      )}
    </NavLink>
  );
};

function Header() {
  return (
    <header className="max-w-4/4 mt-10 mr-5">
      <div>
        <div className="flex text-center items-center">
          <div className="mr-32">
            <Link to="/">
              <motion.span
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                className="flex gap-2"
              >
                <img src="/public/Header/Logo.svg" alt="Logo" />
                <p className="Header-text text-5xl">Anime Online.</p>
              </motion.span>
            </Link>
          </div>
          <div>
            <div className="flex justify-between">
              <div className="flex justify-between gap-14 mr-8 items-center">
                <CustomLink to="/" end>
                  Home
                </CustomLink>
                <CustomLink to="/news">News</CustomLink>
                <CustomLink to="/categories">Categories</CustomLink>
              </div>
              <div className="relative w-full max-w-md mr-6">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  className="block w-full p-3.5 pl-10 text-sm text-white bg-stone-800 rounded-lg border-2
                  border-transparent  focus:border-2 focus:border-white  placeholder-white outline-none"
                />
              </div>
              <div className="flex gap-6 items-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-32 h-11 bg-fuchsia-600 rounded-md cursor-pointer"
                >
                  Sign up
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "#bd00ff" }}
                  whileTap={{ scale: 0.9, backgroundColor: "#C026D3" }}
                  initial={{ backgroundColor: "transparent" }}
                  className="w-32 h-11 bg-transparent border-2 border-fuchsia-600 rounded-md cursor-pointer"
                >
                  Sign in
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
