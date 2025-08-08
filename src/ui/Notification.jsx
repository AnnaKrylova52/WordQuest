import { useState, useEffect } from "react";
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
export const Notification = ({ type, children = "your notification" }) => {
  const [isClosed, setIsClosed] = useState(false);

  const icons = {
    success: <CheckCircleIcon className="h-6 w-6 text-green-600" />,
    error: <ExclamationCircleIcon className="h-6 w-6 text-red-600" />,
    warning: <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />,
    info: <InformationCircleIcon className="h-6 w-6 text-blue-600" />,
  };

  useEffect(() => {
    const interval = setTimeout(() => {
      setIsClosed(true);
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (isClosed) return null;

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center">
      <div
        className={`flex justify-between items-center m-1 border-b-gray-700 shadow w-xs rounded-lg sm:w-xl p-4 bg-white `}
      >
        <div className="flex items-center w-5xl">
          <div className="mr-1">{icons[type]}</div>
          <h3>{children}</h3>
        </div>
        <button className="mr-1" onClick={() => setIsClosed(true)}>
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
