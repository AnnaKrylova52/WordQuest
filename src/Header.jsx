import { Link, NavLink } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
export const Header = () => {
  const { user, onLogout } = useAuth(   );
  return (
    <header>
      <div className="bg-black flex justify-between p-4 text-white">
        <h1>Logo</h1>
        <div className="flex gap-6 items-center">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `${isActive ? " text-red-600" : "hover:text-red-500"}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/collections"
            className={({ isActive }) =>
              `${isActive ? " text-red-600" : "hover:text-red-500"}`
            }
          >
            Card collections
          </NavLink>
          <NavLink
            to="/library"
            className={({ isActive }) =>
              `${isActive ? " text-red-600" : "hover:text-red-500"}`
            }
          >
            Your library
          </NavLink>
          <button onClick={onLogout}>
            <ArrowRightStartOnRectangleIcon className="w-6 h-6 cursor-pointer" />
          </button>
        </div>
      </div>
    </header>
  );
};
