import { NavLink } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useCollections } from "./store/useCollections";
export const Header = () => {
  const { user, onLogout } = useAuth();

  return (
    <header>
      <div className="bg-black flex justify-between p-4 text-white">
        <div>
          <img src="..\src\assets\logo.svg" alt="logo" width="80px" />
        </div>

        <div className="flex gap-6 items-center">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `${isActive ? " text-red-600" : "hover:text-red-500 transition"}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/collections"
            className={({ isActive }) =>
              `${isActive ? " text-red-600" : "hover:text-red-500 transition"}`
            }
          >
            Card collections
          </NavLink>
          <NavLink
            to="/user/collections"
            className={({ isActive }) =>
              `${isActive ? " text-red-600" : "hover:text-red-500 transition"}`
            }
          >
            Your library
          </NavLink>
          <button className="relative group" onClick={onLogout}>
            <ArrowRightStartOnRectangleIcon className="w-6 h-6 cursor-pointer" />
            <span
              className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300 -left-2/12 top-6 transform -translate-x-1/2 
                  bg-neutral-400 dark:bg-neutral-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
            >
              Log Out
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
