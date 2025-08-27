import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
export const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 mb-6 text-red-600 dark:text-red-600 hover:text-red-800 dark:hover:text-red-500 transition-colors cursor-pointer"
    >
      <ArrowLeftIcon className="w-5 h-5" />
      <span>Back to collections</span>
    </button>
  );
};
