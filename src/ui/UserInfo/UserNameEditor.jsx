import { useState } from "react";
import { Modal } from "../Modal";
export const UserNameEditor = ({
  updateUserName,
  userName,
  showNotification,
}) => {
  const [name, setName] = useState(userName);
  const [isChangimngName, setChangingName] = useState(false);
  const handleNameChange = async () => {
    if (!name.trim()) {
      return;
    }
    if (name === userName) {
      return;
    }
    try {
      await updateUserName(name);
      setChangingName(false);
    } catch (error) {
      console.error("Error changing name", error);
      showNotification("error", "Error changing name");
    }
  };
  return (
    <>
      <div className="border-t border-red-600 flex justify-between mb-3  items-center  pt-3 dark:text-white">
        <div>
          <p className="font-medium text-lg">Username</p>
          <p>{userName ? userName : "No name"}</p>
        </div>

        <button
          onClick={() => setChangingName(!isChangimngName)}
          className="font-medium border hover:bg-neutral-300/60 dark:hover:bg-neutral-800/60 border-red-600 p-2 px-6 rounded-3xl duration-300 transition cursor-pointer"
        >
          Edit
        </button>
      </div>
      {isChangimngName && (
        <Modal setClose={() => setChangingName(false)}>
          <div className="mt-6  flex flex-col">
            <h3 className="mb-1 dark:text-white">New name</h3>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className=" border border-gray-400 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500  dark:border-red-600 dark:placeholder-gray-400 dark:text-white p-3 mb-3"
            />
            <div className="text-center">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition-colors cursor-pointer"
                onClick={handleNameChange}
              >
                Save new name
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
