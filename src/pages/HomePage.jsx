import { Background } from "../ui/Background";
import { Link } from "react-router-dom";
import {
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ArrowRightIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
export const HomePage = () => {
  return (
    <>
      <Background />
      <div className="px-4 mt-20 mb-4">
        <div className="flex flex-col items-center justify-center text-center ">
          <div className="max-w-4xl p-12 rounded-2xl bg-neutral-950/20 backdrop-blur-xs border border-neutral-800 shadow-2xl">
            <h1 className="text-5xl md:text-6xl font-bold dark:text-white mb-6">
              Welcome to <span className="text-red-600">WordQuest</span>
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-10 max-w-2xl mx-auto">
              Embark on a linguistic journey and master English vocabulary
              through interactive learning and gamified challenges.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/collections"
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-3xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <ChartBarIcon className="w-6 h-6" />
                Browse collections
              </Link>
              <Link
                to="/create-collection"
                className="flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-3 px-8 rounded-3xl border border-neutral-700 transition-all"
              >
                <PlusCircleIcon className="w-6 h-6" />
                Create your collection
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-20">
          <h2 className="text-3xl font-bold dark:text-white text-center mb-4">
            Why Choose WordQuest?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="dark:bg-neutral-900/80 dark:text-white bg-neutral-100 backdrop-blur-sm p-6 rounded-xl border border-neutral-800 hover:border-red-600 dark:hover:border-red-600/30 transition-all">
              <div className="flex justify-center">
                <div className="bg-red-600/10 p-3 rounded-full w-12 h-12 mb-4">
                  <AcademicCapIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Learning</h3>
              <p className="text-neutral-400">
                Adaptive algorithms that focus on words you need to practice
                most.
              </p>
            </div>
            <div className="dark:bg-neutral-900/80 dark:text-white bg-neutral-100 backdrop-blur-sm p-6 rounded-xl border border-neutral-800 hover:border-red-600 dark:hover:border-red-600/30 transition-all">
              <div className="flex justify-center">
                <div className="bg-red-600/10 p-3 rounded-full w-12 h-12 mb-4">
                  <BookOpenIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2">Rich Content</h3>
              <p className="text-neutral-400">
                Thousands of words and phrases with examples and pronunciation.
              </p>
            </div>
            <div className="dark:bg-neutral-900/80 dark:text-white bg-neutral-100 backdrop-blur-sm p-6 rounded-xl border border-neutral-800 hover:border-red-600 dark:hover:border-red-600/30 transition-all">
              <div className="flex justify-center">
                <div className="bg-red-600/10 p-3 rounded-full w-12 h-12 mb-4">
                  <ChartBarIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-neutral-400">
                Monitor your improvement with detailed statistics and
                achievements.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center mt-15 p-8 rounded-2xl dark:bg-gradient-to-r dark:from-neutral-900 dark:to-neutral-950 border border-neutral-800 bg-gradient-to-r from-neutral-300 to-neutral-400">
          <h2 className="text-3xl font-bold dark:text-white mb-4">
            Ready to expand your vocabulary?
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 mb-6">
            Join thousands of learners who have improved their English with
            WordQuest.
          </p>
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-3xl transition-all"
          >
            Start Learning Now
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </>
  );
};
