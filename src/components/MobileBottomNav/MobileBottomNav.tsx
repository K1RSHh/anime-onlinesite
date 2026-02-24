import { NavLink } from "react-router-dom";
import { Home, Newspaper, Search, User } from "lucide-react"; // Імпортуємо іконки
import { ReactNode } from "react";

interface NavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
}

const MobileBottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full h-16 backdrop-blur-3xl bg-stone-900/85 border-t border-stone-800 flex justify-around items-center z-50 md:hidden pb-safe">
      {/* Home */}
      <NavItem to="/" icon={<Home size={24} />} label="Home" />

      {/* News */}
      <NavItem to="" icon={<Newspaper size={24} />} label="News" />

      {/* Categories */}
      <NavItem to="" icon={<Search size={24} />} label="Search" />

      {/* Profile / Login */}
      <NavItem to="/profile" icon={<User size={24} />} label="Profile" />
    </div>
  );
};

// Help component for button
const NavItem = ({ to, icon, label }: NavItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center justify-center w-full h-full transition-colors ${
        isActive ? "text-fuchsia-500" : "text-stone-500 hover:text-stone-300"
      }`
    }
  >
    {icon}
    <span className="text-[10px] mt-1 font-medium">{label}</span>
  </NavLink>
);

export default MobileBottomNav;
