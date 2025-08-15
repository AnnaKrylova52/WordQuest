import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { Loader } from "../ui/Loader";
import {
  LockClosedIcon,
  EnvelopeIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { ResetPassword } from "./ResetPassword";

export const SignIn = () => {
  // Состояние формы
  const [form, setForm] = useState({
    email: "",
    password: "",
    isRemember: false,
  });
  const { login, regWithGoogle, loading } = useAuth();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  // Обработчик изменения полей формы
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleGoogleLogin = async () => {
    try {
      await regWithGoogle();
    } catch (error) {
      setError(error.message || "Google registration failed");
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await login({ email: form.email, password: form.password });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-x-hidden">
      {/* Левая часть с изображением */}
      <div className="lg:w-2/3 hidden lg:block relative">
        <img
          src="src\assets\cartoon-book-shelve-background.svg"
          alt="Book Shelve"
          className="absolute inset-0 w-full h-full object-cover bg-red-500  dark:bg-red-800"
        />
      </div>
      <div className="lg:w-1/3 flex items-center justify-center min-h-screen p-4 bg-white dark:bg-transparent dark:bg-gradient-to-br dark:from-black/70 dark:via-30% dark:to-red-950">
        <div className="max-w-lg w-full">
          {loading ? (
            <Loader width={10} heigth={10} />
          ) : (
            <>
              {isForgotPassword ? (
                <ResetPassword
                  onBackToLogin={() => setIsForgotPassword(false)}
                />
              ) : (
                <div className="z-10">
                  <div className="mb-10">
                      <img  src="src\assets\logo.svg" alt="logo"  />
                  </div>
                  <h1 className=" text-4xl mb-2  dark:text-white text-center font-bold">
                    Weclome back
                  </h1>

                  <p className="text-center mb-8 dark:text-white font-medium">
                    Sign in to continue
                  </p>

                  <form
                    className="space-y-4"
                    action="#"
                    onSubmit={handleSubmit}
                    noValidate
                  >
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-3 bottom-1/4  h-6 w-6 text-red-600" />
                      <input
                        type="email"
                        name="email"
                        id="email"
                        onChange={handleChange}
                        value={form?.email}
                        className=" border border-red-600 text-gray-900 text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-4 dark:placeholder-gray-400 dark:text-white pl-10"
                        placeholder="name@company.com"
                        required
                        autoComplete="email"
                      />
                    </div>
                    <div className="relative">
                      <LockClosedIcon className="absolute left-3 bottom-1/4  h-6 w-6 text-red-600" />
                      <input
                        type="password"
                        name="password"
                        id="password"
                        onChange={handleChange}
                        value={form?.password}
                        placeholder="••••••••"
                        className=" border border-red-600 text-gray-900 text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-4   dark:placeholder-gray-400 dark:text-white pl-10"
                        required
                        autoComplete="off"
                      />
                    </div>
                    <div className="flex justify-between">
                      <button
                        className="text-sm text-red-600 dark:text-red-600 hover:underline"
                        onClick={() => setIsForgotPassword(true)}
                      >
                        Lost Password?
                      </button>
                    </div>
                    <button className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:outline-none focus:ring-red-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer transition">
                      Log in to your account
                    </button>

                    <div className="text-sm font-medium dark:text-white">
                      Not registered?
                      <Link
                        className="text-red-600 ml-2 hover:underline"
                        to="/register"
                      >
                        Create account
                      </Link>
                    </div>
                  </form>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-red-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-red-600 text-white">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-gray-700 hover:bg-gray-200 mt-4 transition cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                    </svg>
                    Sign in with Google
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
