import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "../utilities";
import { Logo } from "./Helper";
import { navlinkClass } from "../global.style";
import { AuthContext } from "../contexts/AuthContext";

export const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleNavigation = (path: string): string => {
    if (user) return path;
    else return "login";
  };

  const handleLogOut = () => {
    localStorage.removeItem("cloudProfile_user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <header className="text-gray-400 bg-gray-900 body-font">
      <div className="container mx-auto p-5">
        <div className="flex items-center justify-between">
          <Logo user={user} />
          <button
            className="md:hidden text-gray-400 hover:text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
        <div className="md:!mt-[-27px] flex flex-wrap flex-col md:flex-row items-center justify-between">
          <nav
            className={`${
              isOpen ? "flex" : "hidden"
            } w-full md:flex md:w-auto flex-col md:flex-row md:ml-auto items-end text-base justify-center`}
          >
            <NavLink
              to={handleNavigation("/")}
              className={({ isActive }) =>
                `${navlinkClass} ${isActive ? "text-white" : ""}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to={handleNavigation("/profile")}
              className={({ isActive }) =>
                `${navlinkClass} ${isActive ? "text-white" : ""}`
              }
            >
              Profile
            </NavLink>
            <NavLink
              to={handleNavigation("/feedback")}
              className={({ isActive }) =>
                `${navlinkClass} ${isActive ? "text-white" : ""}`
              }
            >
              Feedback
            </NavLink>
            {user ? (
              <button onClick={handleLogOut} className={navlinkClass}>
                Logout
              </button>
            ) : (
              <NavLink
                to={handleNavigation("/login")}
                className={({ isActive }) =>
                  `${navlinkClass} ${isActive ? "text-white" : ""}`
                }
              >
                Login
              </NavLink>
            )}

            <button
              className="mr-8 mt-2 md:mt-0 cursor-pointer"
              onClick={toggleTheme}
            >
              {theme === "light" ? <Moon /> : <Sun />}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
