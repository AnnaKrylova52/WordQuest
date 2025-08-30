import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRef, useEffect } from "react";
export const Modal = ({ children, setClose }) => {
  const modalRef = useRef();
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!modalRef?.current?.contains(e.target)) {
        e.stopPropagation();
        setClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") setClose();
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [setClose]);

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-20 flex items-center justify-center z-50 p-4 ">
      <div
        ref={modalRef}
        className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-xl dark:shadow-none relative max-w-md w-full dark:text-white"
      >
        <XMarkIcon
          className="w-6 h-6 absolute top-4 right-4 cursor-pointer"
          onClick={setClose}
        />
        {children}
      </div>
    </div>
  );
};
