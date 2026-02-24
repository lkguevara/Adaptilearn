import {  useState } from "react";
import { Bot, House, LogIn, LogOut, Map, Menu, TrendingUp, UserPlus, X } from "lucide-react";
import { Link, NavLink } from "react-router";
import logo from "../../assets/logo.png";

const navItems = [
  { label: "Inicio", to: "/", icon: House },
  { label: "Roadmaps", to: "/roadmaps", icon: Map },
  { label: "Mi progreso", to: "/progress", icon: TrendingUp },
  { label: "Tutor AI", to: "/ai", icon: Bot },
  { label: "Login", to: "/login", icon: LogIn },
  { label: "Sign Up", to: "/signup", icon: UserPlus },
  { label: "Salir", to: "/logout", icon: LogOut },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header>
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="logo adaptilearn"
            className=""
          />

          <div className="flex flex-col">
            <h2 className="font-primary text-xl font-bold text-secondary transition-colors group-hover:text-primary">
              Adaptilearn
            </h2>
            <span className="text-xs font-light text-primary-500">Aprende con un plan</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-4 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-2 text-base font-semibold transition-colors ${
                  isActive ? "bg-[#E0E7FF] text-secondary" : "text-primary-500 hover:bg-[#E0E7FF] hover:text-secondary"
                }`
              }
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 ease-out lg:hidden ${
            isMenuOpen
              ? "border-secondary bg-secondary text-white shadow-[0_8px_20px_rgba(79,57,246,0.35)]"
              : "border-primary-500/30 bg-white/80 text-primary"
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={20} strokeWidth={2.4} /> : <Menu size={20} strokeWidth={2.4} />}
        </button>
      </div>

      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out lg:hidden ${
          isMenuOpen ? "max-h-96 opacity-100 pointer-events-auto" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <nav
          className={`mx-4 mb-4 rounded-2xl border border-primary-500/20 bg-white/95 p-3 shadow-lg backdrop-blur-sm transition-transform duration-300 ease-out ${
            isMenuOpen ? "translate-y-0" : "-translate-y-2"
          }`}
        >
          {navItems.map((item, index) => (
            <NavLink
              key={`mobile-${item.label}`}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 text-sm font-medium border-b border-secondary/20 last:border-0 rounded-md transition-[opacity,transform,background-color,color] duration-300 ${
                  isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
                } ${
                  isActive ? "bg-[#E0E7FF] text-secondary" : "text-primary hover:bg-secondary hover:text-white"
                }`
              }
              style={{ transitionDelay: `${index * 35}ms` }}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center gap-3">
                <item.icon size={17} />
                {item.label}
              </span>
              <span className="text-lg leading-none">›</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
