import { useNavigate } from "react-router-dom";
import { StarIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { useAuth } from "../hooks/useAuth";
import { useCollections } from "../store/useCollections";
export const CollectionCard = ({ collection }) => {
  const { subscribeToCollection, unsubscribeFromCollection } = useCollections();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const openDetails = (collection) => {
    navigate(`/collections/${collection.id}`, { state: { collection } });
  };

  const handleSubscribe = async (e, collectionId) => {
    e.stopPropagation();
    try {
      if (collection.isSubscribed) {
        await unsubscribeFromCollection(collectionId, user.uid);
      } else {
        await subscribeToCollection(collectionId, user.uid);
      }
    } catch (error) {
      console.error("Subscription error:", error);
    }
  };
  if (authLoading) {
    return (
      <div className="border rounded-xl overflow-hidden shadow-md bg-white dark:bg-black animate-pulse h-64"></div>
    );
  }

  return (
    <div
      onClick={() => openDetails(collection)}
      className={`
                border rounded-xl overflow-hidden shadow-md
                bg-white dark:bg-black
                text-gray-800 dark:text-gray-100
                border-red-500 dark:border-red-800
                hover:shadow-lg hover:border-red-800 dark:hover:border-red-500
                transition-all duration-300 cursor-pointer
              `}
    >
      <div className="flex justify-end mt-2 mr-2">
        {user && user.uid !== collection.ownerId ? (
          <button
            onClick={(e) => handleSubscribe(e, collection.id)}
            className="cursor-pointer"
          >
            {collection.isSubscribed ? (
              <StarIconSolid className="h-6 w-6 text-red-600" />
            ) : (
              <StarIcon className="h-6 w-6" />
            )}
          </button>
        ) : (
          <UserCircleIcon className="h-6 w-6" />
        )}
      </div>

      <div className="p-5 pt-3">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-bold text-xl mb-2 text-red-600">
              {collection.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 max-w-40 truncate">
              {collection.description || "No description"}
            </p>
            <p>by {collection.collectionOwner}</p>
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
  );
};
