import { XMarkIcon } from "@heroicons/react/24/outline";
export const DefinitionsContainer = ({
  definitions,
  onClick,
  setDefinitions,
}) => {
  return (
    <div className="border border-gray-200 dark:border-neutral-700 rounded-lg p-3">
      <div className="flex justify-between">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Suggested definitions:
        </p>
        <XMarkIcon
          onClick={setDefinitions}
          className="w-5 h-5 dark:text-white cursor-pointer"
        />
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {definitions.map((def, index) => (
          <div
            key={index}
            onClick={() => onClick(def)}
            className="p-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-black rounded border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/20 transition-colors"
          >
            {def.definition}
          </div>
        ))}
      </div>
    </div>
  );
};
