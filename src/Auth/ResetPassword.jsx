import { useState } from "react";
import { EnvelopeIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../hooks/useAuth";
export const ResetPassword = ({ onBackToLogin }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSet] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setIsEmailSet(true);
    } catch (error) {
      console.error("Error seinding email:", error);
    }
  };
  return (
    <div className="z-10 bg-gray-800/90 backdrop-blur-xl p-8 max-w-md w-full rounded-lg shadow-2xl border border-amber-900/50">
      <div className="mx-auto bg-amber-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
        <BookOpenIcon className="w-12 h-12 text-amber-500" />
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <h1 className="text-3xl mb-2 text-white text-center font-bold">
          Reset Password
        </h1>
        <p className="text-center mb-8 text-white">
          Enter your email to reset your password
        </p>
        <div className="relative">
          <EnvelopeIcon className="absolute left-3 bottom-1/4  h-6 w-6 text-amber-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
            autoComplete="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-amber-600 focus:border-amber-600 block w-full p-4 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white mb-2 pl-10"
          />
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-sm text-yellow-600 dark:text-yellow-500 hover:underline"
          >
            Back to Login
          </button>
          <button
            type="submit"
            className=" text-white bg-amber-600 hover:bg-yellow-700 focus:ring-2 focus:outline-none focus:ring-amber-500 font-medium rounded-md text-sm py-2 px-3 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-500 cursor-pointer transition"
          >
            {isEmailSent ? "Send another link" : "Send a link"}
          </button>
        </div>
      </form>
    </div>
  );
};
