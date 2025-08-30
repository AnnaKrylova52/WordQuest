import { useState } from "react";
import { Modal } from "../Modal";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
export const PasswordManager = ({
  showNotification,
  resetPassword,
  changePassword,
}) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [IsShowForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [isPasswordSeen, setSeePassword] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (
      form.currentPassword.trim() === "" ||
      form.newPassword.trim() === "" ||
      form.confirmPassword.trim() === ""
    ) {
      showNotification("warning", "Please fill out all fields!");
    }
    if (form.newPassword !== form.confirmPassword) {
      showNotification("warning", "Passwords do not match");
      return;
    }
    try {
      await changePassword(
        form.currentPassword,
        form.newPassword,
        form.confirmPassword
      );
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setIsChangingPassword(false);
    } catch (error) {
      console.error("Password change failed:", error);
    }
  };
  const handleForm = () => {
    if (!isChangingPassword) {
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
    setIsChangingPassword(!isChangingPassword);
  };

  const handleEmailSend = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
    } catch (error) {
      console.error("Error seinding email:", error);
    }
  };
  return (
    <>
      <div className="mb-3 dark:text-white">
        <div className="flex items-center justify-between">
          <p className="font-medium">Change password</p>
          <button
            className="font-medium border hover:bg-neutral-300/60 dark:hover:bg-neutral-800/60 border-red-600 p-2 px-3 rounded-3xl duration-300 transition cursor-pointer"
            onClick={handleForm}
          >
            Change
          </button>
        </div>
      </div>
      {isChangingPassword && (
        <Modal
          setClose={() => {
            setIsChangingPassword(false);
            setShowForgotPassword(false);
            setEmail("");
          }}
        >
          <form noValidate onSubmit={handlePasswordChange}>
            <div className="flex flex-col mb-3 mt-4 gap-0.5 relative">
              <label htmlFor="currentPassword" className="text-sm">
                Current password
              </label>
              {isPasswordSeen ? (
                <EyeSlashIcon
                  className="absolute right-3 top-2/4  h-6 w-6 text-red-600 cursor-pointer "
                  onClick={() => setSeePassword(false)}
                />
              ) : (
                <EyeIcon
                  className="absolute right-3 top-2/4  h-6 w-6 text-red-600 cursor-pointer"
                  onClick={(e) => setSeePassword(true)}
                />
              )}
              <input
                className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500  dark:border-red-600 dark:placeholder-gray-400 dark:text-white p-3"
                type={`${isPasswordSeen ? "text" : "password"}`}
                name="currentPassword"
                id="currentPassword"
                placeholder="••••••••"
                value={form.currentPassword}
                onChange={(e) =>
                  setForm({ ...form, currentPassword: e.target.value })
                }
                required
              />
            </div>
            <div className="flex flex-col mb-3 gap-0.5">
              <label htmlFor="newPassword" className="text-sm">
                New password
              </label>
              <input
                className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500  dark:border-red-600 dark:placeholder-gray-400 dark:text-white p-3"
                type={`${isPasswordSeen ? "text" : "password"}`}
                name="newPassword"
                id="newPassword"
                placeholder="••••••••"
                value={form.newPassword}
                onChange={(e) =>
                  setForm({ ...form, newPassword: e.target.value })
                }
                required
              />
            </div>
            <div className="flex flex-col mb-3 gap-0.5">
              <label htmlFor="confirmNewPassword" className="text-sm">
                Confirm new password
              </label>
              <input
                className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500  dark:border-red-600 dark:placeholder-gray-400 dark:text-white p-3"
                type={`${isPasswordSeen ? "text" : "password"}`}
                name="confirmNewPassword"
                id="confirmNewPassword"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                required
              />
            </div>

            <div className="flex flex-col">
              <button
                className="bg-red-600 hover:bg-red-700 p-2 rounded-3xl text-white transition mt-2 cursor-pointer mb-2"
                type="submit"
              >
                Save changings
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(!IsShowForgotPassword)}
                className="text-red-500 hover:underline text-sm transition cursor-pointer"
              >
                {IsShowForgotPassword ? "Cancel" : "Forgot password?"}
              </button>
            </div>
          </form>
          {IsShowForgotPassword && (
            <form onSubmit={handleEmailSend} noValidate className="mb-2">
              <p className=" text-sm text-gray-600 dark:text-gray-400 mb-2">
                Enter your email and we'll send you a link to reset your
                password
              </p>
              <div className="mb-1 flex flex-col gap-0.5">
                <label htmlFor="email" className="text-sm">
                  Your email
                </label>
                <input
                  type="email"
                  value={email}
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  autoComplete="email"
                  className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500  dark:border-red-600 dark:placeholder-gray-400 dark:text-white p-3 w-full"
                />
              </div>

              <button
                type="submit"
                className="bg-red-600 text-white hover:bg-red-700 p-2 rounded-3xl transition mt-2 cursor-pointer w-full"
              >
                Send a link
              </button>
            </form>
          )}
        </Modal>
      )}
    </>
  );
};
