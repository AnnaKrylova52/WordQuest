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
    <div className="z-10">
      <form onSubmit={handleSubmit} noValidate>
        <h1 className="text-3xl mb-2 dark:text-white text-center font-bold">
          Reset Password
        </h1>
        <p className="text-center mb-8 dark:text-white font-medium">
          Enter your email to reset your password
        </p>
        <div className="relative">
          <EnvelopeIcon className="absolute left-3 bottom-1/4  h-6 w-6 text-red-600" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
            autoComplete="email"
            className=" border border-red-600 text-gray-900 text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-4  dark:text-white mb-2 pl-10"
          />
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-sm text-red-600  hover:underline"
          >
            Back to Login
          </button>
          <button
            type="submit"
            className=" text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:outline-none focus:ring-red-600 font-medium rounded-md text-sm py-2 px-3 text-center   cursor-pointer transition"
          >
            {isEmailSent ? "Send another link" : "Send a link"}
          </button>
        </div>
      </form>
    </div>
  );
};
