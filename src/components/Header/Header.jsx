// eslint-disable-next-line
import { motion } from "framer-motion";
import { NavLink, Link } from "react-router";
import { Search } from "lucide-react";
import { useAuthStore } from "../../data/authStore";
import { User, LogOut } from "lucide-react";
import logo from "../../../public/Header/Logo.svg";
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
  const { user, logOut } = useAuthStore();

  return (
    <header className="max-w-4/4 mt-4 md:mt-10 md:mr-5 px-4">
      <div>
        <div className="flex text-center items-center">
          <div className="md:mr-32 flex m-auto">
            <Link to="/">
              <motion.span
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                className="flex gap-2"
              >
                <img src={logo} alt="Logo" />
                <p className="Header-text text-2xl md:text-5xl">
                  Anime Online.
                </p>
              </motion.span>
            </Link>
          </div>
          <div className="hidden md:flex">
            <div className="flex justify-between">
              <div className="flex justify-between gap-14 mr-8 items-center">
                <CustomLink to="/" end>
                  Home
                </CustomLink>
                <button
                  disabled={true}
                  className="text-2xl block font-bold cursor-pointer  disabled:text-gray-400/50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Next time
                </button>
                <button
                  disabled={true}
                  className="text-2xl block font-bold cursor-pointer  disabled:text-gray-400/50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Next time
                </button>
              </div>
              <div className="relative md:max-w-md mr-6">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  className="block w-full p-3 pl-10 text-sm text-white bg-stone-800 rounded-lg border-2
                  border-transparent  focus:border-2 focus:border-white  placeholder-white outline-none"
                />
              </div>
              {user ? (
                //user login
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="hidden md:flex items-center gap-4"
                  >
                    <span className="text-white text-sm font-medium">
                      {user.displayName || user.email.split("@")[0]}
                    </span>

                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full border-2 border-stone-800 object-cover"
                      />
                    ) : (
                      //if there is no avatar, we put the letter
                      <div className="w-10 h-10 rounded-full bg-fuchsia-600 flex items-center justify-center text-white font-bold text-xl border-2 border-stone-800">
                        {user.displayName
                          ? user.displayName[0].toUpperCase()
                          : user.email[0].toUpperCase()}
                      </div>
                    )}
                  </Link>
                  {/* exit button */}
                  <button
                    onClick={logOut}
                    className="p-2 text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Log Out"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                // ВАРІАНТ 2: Юзер ГІСТЬ (показуємо старі кнопки)
                <div className="flex gap-6 items-center">
                  <Link to="/signup">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-32 h-11 bg-fuchsia-600 rounded-md cursor-pointer"
                    >
                      Sign up
                    </motion.button>
                  </Link>

                  <Link to="/signin">
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: "#bd00ff" }}
                      whileTap={{ scale: 0.9, backgroundColor: "#C026D3" }}
                      initial={{ backgroundColor: "transparent" }}
                      className="w-32 h-11 bg-transparent border-2 border-fuchsia-600 rounded-md cursor-pointer"
                    >
                      Sign in
                    </motion.button>
                  </Link>
                </div>
              )}{" "}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
