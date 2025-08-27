import { useCallback, useEffect } from "react";
import { useCollections } from "../store/useCollections";
import { useNavigate } from "react-router-dom";
import { CollectionCard } from "../ui/CollectionCard";
import { useAuth } from "../hooks/useAuth";
export const CollectionsPage = () => {
  const { collections, fetchCollections, clearSubscriptions } =
    useCollections();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      fetchCollections(user.uid);
    }
    // Очищаем подписки при размонтировании компонента
    return () => {
      clearSubscriptions();
    };
  }, [user, fetchCollections, clearSubscriptions]);

  const openCreateCollection = () => {
    navigate("/create-collection");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Collections
        </h1>
        <button
          onClick={openCreateCollection}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-3xl cursor-pointer transition"
        >
          Create new collection
        </button>
      </div>
      {collections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300">
            No collections found. Create your first collection!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections
            .filter((col) => !col.isPrivate)
            .map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
        </div>
      )}
    </div>
  );
};
