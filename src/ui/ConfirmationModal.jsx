export const ConfirmationModal = ({ title, setClose, setConfirm }) => {
  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-20 flex items-center justify-center z-50 p-4 ">
      <div className="bg-white dark:bg-black p-6 rounded-xl shadow-xl dark:shadow-none">
        <h3 className="dark:text-white text-xl mb-4">{title}</h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={setClose}
            className="px-4 py-2 bg-neutral-600 text-white rounded-xl hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            No
          </button>
          <button
            onClick={setConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors cursor-pointer"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};
