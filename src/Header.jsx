import { NavLink } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  UserCircleIcon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { Drawer } from "./ui/Drawer";
import { useTheme } from "./store/useTheme";
import { useUserData } from "./store/useUserData";
export const Header = () => {
  const { user, onLogout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isBurgerOpen, setBurgerOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef();
  const { userData } = useUserData();
  const userIconRef = useRef();
  const hoverTimeoutRef = useRef();
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target) &&
        userIconRef.current &&
        !userIconRef.current.contains(e.target)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleMouseEnter = () => {
    // Очищаем предыдущий таймер, если он есть
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setUserMenuOpen(true);
  };
  const handleMouseLeave = () => {
    // Устанавливаем таймер для скрытия меню через короткое время
    hoverTimeoutRef.current = setTimeout(() => {
      setUserMenuOpen(false);
    }, 300); // 300ms задержка перед скрытием
  };
  const handleMenuMouseEnter = () => {
    // При наведении на меню отменяем таймер скрытия
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  return (
    <header>
      <div className="bg-black flex justify-between items-center py-3 px-4 text-white">
        <div>
          <img src="..\src\assets\logo.svg" alt="logo" width="100px" />
        </div>
        <div className="flex items-center gap-4">
          <div className="sm:flex gap-6 items-center hidden">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `${
                  isActive ? " text-red-600" : "hover:text-red-500 transition"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/collections"
              className={({ isActive }) =>
                `${
                  isActive ? " text-red-600" : "hover:text-red-500 transition"
                }`
              }
            >
              Card collections
            </NavLink>
            <NavLink
              to="/user/collections"
              className={({ isActive }) =>
                `${
                  isActive ? " text-red-600" : "hover:text-red-500 transition"
                }`
              }
            >
              Your library
            </NavLink>
          </div>
          <div
            ref={userIconRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <NavLink onClick={() => setUserMenuOpen(!isUserMenuOpen)}>
              {user.profilePhoto ? (
                <img
                  src={userData?.profilePhoto}
                  alt="Profile Photo"
                  className="w-12 h-12 rounded-full border-2 border-red-600 object-cover"
                />
              ) : (
                <div className="bg-gradient-to-br from-neutral-200 to-red-400 dark:from-neutral-700 dark:to-red-600 rounded-full w-12 h-12  flex items-center justify-center border-2 border-red-600">
                  <UserCircleIcon className="w-12 h-12 text-red-600" />
                </div>
              )}
            </NavLink>
            {isUserMenuOpen && (
              <div
                ref={userMenuRef}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMenuMouseEnter}
                className="absolute top-full right-0 mt-2 w-80 text-black dark:text-white bg-white dark:bg-neutral-950 rounded-lg overflow-hidden shadow-lg z-50"
              >
                <div className="flex items-center gap-2 border-b px-4 py-2">
                  {user.profilePhoto ? (
                    <img
                      src={userData?.profilePhoto}
                      alt="Profile Photo"
                      className="w-15 h-15 rounded-full border-2 border-red-600 object-cover"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-neutral-200 to-red-400 dark:from-neutral-700 dark:to-red-600 rounded-full w-15 h-15  flex items-center justify-center border-2 border-red-600">
                      <UserCircleIcon className="w-15 h-15 text-red-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-neutral-800 dark:text-neutral-300">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 p-4">
                  <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                      `flex items-center gap-3 cursor-pointer ${
                        isActive
                          ? " text-red-600"
                          : "hover:text-red-600 transition dark:text-white"
                      }`
                    }
                  >
                    <Cog6ToothIcon className="w-7 h-7" />
                    Settings
                  </NavLink>
                  <button
                    onClick={toggleTheme}
                    className=" cursor-pointer hover:text-red-600 transition"
                  >
                    {isDark ? (
                      <div className="flex items-center gap-3">
                        <MoonIcon className="w-7 h-7" /> Dark
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <SunIcon className="w-7 h-7" /> Light
                      </div>
                    )}
                  </button>
                  <button
                    className="flex items-center gap-3 cursor-pointer hover:text-red-600 transition"
                    onClick={onLogout}
                  >
                    <ArrowRightStartOnRectangleIcon className="w-7 h-7 cursor-pointer " />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
          <Bars3Icon
            onClick={() => setBurgerOpen(true)}
            className="w-6 h-6 sm:hidden"
          />
        </div>
      </div>
      {isBurgerOpen && (
        <Drawer
          isOpen={isBurgerOpen}
          onClose={() => setBurgerOpen(false)}
          size="max-w-1/2"
        >
          <div className="dark:text-white flex flex-col gap-6">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `${
                  isActive ? " text-red-600" : "hover:text-red-500 transition"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/collections"
              className={({ isActive }) =>
                `${
                  isActive ? " text-red-600" : "hover:text-red-500 transition"
                }`
              }
            >
              Card collections
            </NavLink>
            <NavLink
              to="/user/collections"
              className={({ isActive }) =>
                `${
                  isActive ? " text-red-600" : "hover:text-red-500 transition"
                }`
              }
            >
              Your library
            </NavLink>
            <button className="flex items-center gap-2" onClick={onLogout}>
              Log Out
              <ArrowRightStartOnRectangleIcon className="w-6 h-6 cursor-pointer" />
            </button>
          </div>
        </Drawer>
      )}
    </header>
  );
};
