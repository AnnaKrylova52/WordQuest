import { useState } from "react";
import { ConfirmationModal } from "../confirmationModal";
import { Modal } from "../Modal";
export const AccountActions = ({
  deleteAccount,
  onLogout,
  showNotification,
}) => {
  const [isExit, setIsExit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [password, setPassword] = useState("");

  const handleConfrimPassword = async () => {
    if (!password) {
      showNotification("error", "Passoword is required");
      return;
    }
    try {
      await deleteAccount(password);
      setIsConfirmDelete(false);
      setIsDelete(false);
    } catch (error) {
      console.error("error deliting account:", error);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmDelete(false);
    setIsDelete(false);
    setPassword("");
  };
  return (
    <div className=" space-y-3 dark:text-white">
      <div className="flex items-center justify-between border-b border-red-600">
        <div className="mb-3">
          <p className="font-medium">Delete your account</p>
          <p className="dark:text-neutral-300 text-neutral-700">
            This will delete all your data and cannot be undone.
          </p>
        </div>
        <button
          className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded-3xl transition cursor-pointer text-white"
          onClick={() => setIsDelete(true)}
        >
          Delete Account
        </button>
      </div>
      <div className="flex items-center justify-between ">
        <p className="font-medium">Log out</p>
        <button
          className=" bg-neutral-500 hover:bg-neutral-600 dark:bg-neutral-700 dark:hover:bg-neutral-800 py-2 px-4 rounded-3xl transition cursor-pointer text-white"
          onClick={() => setIsExit(true)}
        >
          Log out
        </button>
      </div>

      {isDelete && !isConfirmDelete && (
        <ConfirmationModal
          title=" Are you sure you want to delete your account? This action can not be undone."
          setClose={handleCancelDelete}
          setConfirm={() => setIsConfirmDelete(true)}
        />
      )}
      {isConfirmDelete && (
        <Modal setClose={handleCancelDelete}>
          <div noValidate className="mb-2">
            <p className=" text-gray-500 dark:text-gray-200 mb-2">
              For security, please enter your password to confirm account
              deletion
            </p>
            <div>
              <label
                htmlFor="password"
                className=" text-white text-sm font-medium"
              >
                Your password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="bg-gray-50 border border-red-600 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 break-words resize-none overflow-hidden block w-full p-2.5 dark:bg-neutral-900   dark:placeholder-gray-400 dark:text-white mb-2 mt-1"
              />
            </div>
            <div className="mt-4 flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors cursor-pointer"
                onClick={handleConfrimPassword}
              >
                Confirm
              </button>
              <button
                className="px-4 py-2 bg-neutral-600 text-white rounded-xl hover:bg-neutral-700 transition-colors cursor-pointer"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
      {isExit && (
        <ConfirmationModal
          title="Are you sure you want to log out?"
          setClose={() => setIsExit(false)}
          setConfirm={onLogout}
        />
      )}
    </div>
  );
};
