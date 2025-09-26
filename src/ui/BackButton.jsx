import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
export const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-red-600 hover:text-red-700 rounded-3xl transition-colors ease-in duration-75   cursor-pointer "
    >
      <div className="flex items-center gap-1 text-lg">
        <ArrowLeftIcon className="w-5 h-5" />
        Back
      </div>
    </button>
  );
};
