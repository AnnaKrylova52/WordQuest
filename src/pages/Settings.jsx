import { useUserData } from "../store/useUserData";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { AccountActions } from "../ui/UserInfo/AccountActions";
import { UserProfilePhoto } from "../ui/UserInfo/UserProfilePhoto";
import { PasswordManager } from "../ui/UserInfo/PasswordManager";
import { UserNameEditor } from "../ui/UserInfo/UserNameEditor";
import { Timestamp } from "firebase/firestore";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../store/useTheme";

export const Settings = () => {
  const { updateUserPhoto, deleteUserPhoto } = useUserData();
  const {
    user,
    deleteAccount,
    updateUserName,
    onLogout,
    resetPassword,
    changePassword,
    showNotification,
  } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const themeDropDownRef = useRef();
  const themeRef = useRef();
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        themeRef.current &&
        !themeRef.current.contains(e.target) &&
        themeDropDownRef.current &&
        !themeDropDownRef.current.contains(e.target)
      ) {
        setIsThemeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const formatFirebaseTimestamp = (timestamp) => {
    if (!timestamp) return "No date";

    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (
      timestamp.seconds !== undefined &&
      timestamp.nanoseconds !== undefined
    ) {
      try {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (error) {
        return "Invalid date";
      }
    }

    // Если это уже строка или другой формат
    return timestamp.toString();
  };

  const handleThemeSelect = (theme) => {
    if ((theme === "dark" && !isDark) || (theme === "light" && isDark)) {
      toggleTheme();
    }
    setIsThemeDropdownOpen(false);
  };
  return (
    <div className="flex justify-center mt-8">
      <div className="w-6xl space-y-8 dark:text-white mx-4">
        <div className="space-y-1">
          <h3 className="font-medium">Personal information</h3>
          <div className="border border-red-600 rounded-xl p-4">
            <UserProfilePhoto
              showNotification={showNotification}
              updateUserPhoto={(img) => updateUserPhoto(img, user.uid)}
              deleteUserPhoto={() => deleteUserPhoto(user.uid)}
              profilePhoto={user?.profilePhoto}
            />
            <div>
              <UserNameEditor
                updateUserName={updateUserName}
                showNotification={showNotification}
                userName={user.name}
              />
              <div className="mb-2">
                <p className="font-medium dark:text-white">Email</p>
                <p className="dark:text-neutral-300 text-neutral-700">
                  {user.email}
                </p>
              </div>
              <div className="flex items-center justify-between relative">
                <span className="font-medium dark:text-white">Theme</span>
                <div
                  className="font-medium border hover:bg-neutral-300/60 dark:hover:bg-neutral-800/60 border-red-600 p-2 px-3 rounded-3xl duration-300 transition cursor-pointer"
                  ref={themeRef}
                  onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                >
                  {isDark ? (
                    <div className="flex items-center gap-1">
                      <MoonIcon className="w-5 h-5" /> Dark
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <SunIcon className="w-5 h-5" /> Ligth
                    </div>
                  )}
                </div>
                {isThemeDropdownOpen && (
                  <div
                    ref={themeDropDownRef}
                    className="absolute top-full right-0 mt-1 w-48 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-10"
                  >
                    <button
                      onClick={() => handleThemeSelect("light")}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <SunIcon className="w-5 h-5" />
                      <span>Light</span>
                    </button>
                    <button
                      onClick={() => handleThemeSelect("dark")}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <MoonIcon className="w-5 h-5" />
                      <span>Dark</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-medium">Progress</h3>
          <div className="dark:text-white border border-red-600 rounded-xl p-4">
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Memory Game Records
              </h3>
              {user.memoryGameRecords && user.memoryGameRecords.fieldSize ? (
                Object.entries(user.memoryGameRecords.fieldSize).map(
                  ([size, data]) => (
                    <div key={size} className="p-2 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700 dark:text-neutral-200">
                          Field Size:
                        </span>
                        <span className="text-neutral-600 dark:text-neutral-300">
                          {size}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700 dark:text-neutral-200">
                          Moves:
                        </span>
                        <span className=" text-neutral-600 dark:text-neutral-300">
                          {data.moves}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700 dark:text-neutral-200">
                          Date:
                        </span>
                        <span className=" text-neutral-600 dark:text-neutral-300">
                          {formatFirebaseTimestamp(data.date)}
                        </span>
                      </div>
                    </div>
                  )
                )
              ) : (
                <p className="text-neutral-500 dark:text-neutral-300 p-2">
                  No records available
                </p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold  text-gray-800 dark:text-white">
                Time Game Records
              </h3>
              {user.timeGameRecords ? (
                <div className="p-2 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 dark:text-neutral-200">
                      Date:
                    </span>
                    <span className="text-neutral-600 dark:text-neutral-300">
                      {formatFirebaseTimestamp(user.timeGameRecords.date)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 dark:text-neutral-200">
                      Guessed words:
                    </span>
                    <span className="text-neutral-600 dark:text-neutral-300">
                      {user.timeGameRecords.words}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-neutral-500 dark:text-neutral-300 p-2">
                  No records available
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="font-medium">Account actions</h3>
          <div className="border border-red-600 rounded-xl p-4 space-y-3">
            {(user.provider === "email" || user.provider === "password") && (
              <>
                {" "}
                <PasswordManager
                  showNotification={showNotification}
                  changePassword={changePassword}
                  resetPassword={resetPassword}
                />{" "}
                <div className="border-t border-red-600"></div>{" "}
              </>
            )}

            <AccountActions
              deleteAccount={deleteAccount}
              showNotification={showNotification}
              onLogout={onLogout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
