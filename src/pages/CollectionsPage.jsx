import { useEffect, useState } from "react";
import { useCollections } from "../store/useColletions";
import { useNavigate } from "react-router-dom";

export const CollectionsPage = () => {
  const { collections, fetchCollections } = useCollections();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const openDetails = (collection) => {
    navigate(`/collections/${collection.id}`, { state: { collection } });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">
        Collections
      </h1>

      {collections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300">
            No collections found. Create your first collection!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div
              onClick={() => openDetails(collection)}
              key={collection.id}
              className={`
                border rounded-xl overflow-hidden shadow-md
                bg-white dark:bg-black
                text-gray-800 dark:text-gray-100
                border-red-200 dark:border-red-800
                hover:shadow-lg hover:border-red-500 dark:hover:border-red-500
                transition-all duration-300 cursor-pointer
              `}
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-bold text-xl mb-2 text-red-600">
                      {collection.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {collection.description || "No description"}
                    </p>
                  </div>
                  <span className="bg-red-100 dark:bg-red-800/60 text-red-800 dark:text-red-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {collection.words?.length || 0} terms
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {collection.words?.slice(0, 3).map((word, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                    >
                      {word.term}
                    </span>
                  ))}
                  {collection.words?.length > 3 && (
                    <span className="text-xs text-neutral-400">
                      +{collection.words.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
