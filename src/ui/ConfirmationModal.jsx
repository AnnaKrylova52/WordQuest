import { useEffect, useRef } from "react";
export const ConfirmationModal = ({ title, setClose, setConfirm }) => {
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
    // Добавляем обработчики событий
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    // Запрещаем прокрутку фонового контента
    document.body.style.overflow = "hidden";

    return () => {
      // Убираем обработчики при размонтировании
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [setClose]);

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-20 flex items-center justify-center z-50 p-4 ">
      <div
        ref={modalRef}
        className="bg-white dark:bg-neutral-900 py-6 px-8 rounded-xl shadow-xl dark:shadow-none"
      >
        <h3 className="text-neutral-700 dark:text-white text-xl mb-4">{title}</h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={setClose}
            className="px-4 py-2 bg-neutral-400 hover:bg-neutral-500 dark:bg-neutral-600 text-white rounded-xl dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            No
          </button>
          <button
            onClick={setConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-700 transition-colors cursor-pointer"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};
