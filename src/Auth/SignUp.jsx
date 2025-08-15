import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { Loader } from "../ui/Loader";
import {
  LockClosedIcon,
  EnvelopeIcon,
  BookOpenIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export const SignUp = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const { register, regWithGoogle, showNotification, loading } = useAuth();

  // Обработчик изменения полей формы
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleRegister = async () => {
    try {
      await regWithGoogle();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();
    if (form.password !== form.confirmPassword) {
      showNotification("warning", "Passwords do not match");
      return;
    }
    try {
      await register({
        ...form,
      });
    } catch (error) {
      console.error(error);
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
              <div className="z-10">
                <div className="mb-10">
                  <img src="src\assets\logo.svg" alt="logo"  />
                </div>
                <h1 className=" text-3xl mb-2  dark:text-white text-center font-bold">
                  Create your account
                </h1>
                <p className="text-center mb-8 dark:text-white font-medium">
                  Sign up to continue
                </p>

                <form
                  className="relative space-y-4"
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
                      value={form.email}
                      className=" border border-red-600 text-gray-900 text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-4  dark:text-white pl-10"
                      placeholder="name@company.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="relative">
                    <UserIcon className="absolute left-3 bottom-1/4  h-6 w-6 text-red-600" />
                    <input
                      type="text"
                      name="name"
                      id="name"
                      onChange={handleChange}
                      value={form.name}
                      className=" border border-red-600 text-gray-900 text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-4  dark:text-white pl-10"
                      placeholder="Your name"
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 bottom-1/4  h-6 w-6 text-red-500" />
                    <input
                      minLength={6}
                      type="password"
                      name="password"
                      id="password"
                      onChange={handleChange}
                      value={form.password}
                      placeholder="••••••••"
                      className=" border border-red-600 text-gray-900 text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-4  dark:text-white pl-10"
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      onChange={handleChange}
                      value={form.confirmPassword}
                      placeholder="Confirm your password"
                      className=" border border-red-600 text-gray-900 text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-4 dark:text-white"
                      required
                      autoComplete="off"
                    />
                  </div>
                  <button className="w-full text-white bg-red-600  focus:ring-2 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 hover:bg-red-700 cursor-pointer mt-2 transition">
                    Register
                  </button>
                  <div className="text-sm font-medium dark:text-white">
                    Registred?
                    <Link
                      className="text-red-600 ml-2 hover:underline"
                      to="/login"
                    >
                      Sign in in your account
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
                  onClick={handleGoogleRegister}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-gray-700 hover:bg-gray-200 mt-4 cursor-pointer transition"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                  </svg>
                  Sign up with Google
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
