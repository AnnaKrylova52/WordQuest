import { createPortal } from "react-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
export const Drawer = ({ isOpen, onClose, children, title, size }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  return createPortal(
    <>
      {/* Оверлей с анимацией */}
      <div
        className={`fixed inset-0 z-20 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/*  Drawer */}
      <div
        className={` fixed h-svh top-0 right-0 z-30 w-full  bg-neutral-100 dark:bg-neutral-950 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } ${size}`}
      >
        <div className="h-16" />
        <header className="flex justify-between items-center p-1 sm:p-2 border-b border-neutral-400 dark:border-neutral-600">
          <h2 className="text-2xl font-bold dark:text-white">{title}</h2>
          <button
            className="p-2 rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-900 transition-colors hover:cursor-pointer"
            onClick={onClose}
          >
            <XMarkIcon className="w-6 h-6 dark:text-white" />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </>,
    document.body
  );
};
