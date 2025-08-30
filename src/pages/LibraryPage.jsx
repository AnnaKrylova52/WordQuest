import { CollectionCard } from "../ui/CollectionCard";
import { useCollections } from "../store/useCollections";
import { useEffect, useState } from "react"; // Добавьте импорт useState
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { UserIcon, HeartIcon } from "@heroicons/react/24/outline";

export const LibraryPage = () => {
  const { collections, fetchCollections, loading } = useCollections();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        await fetchCollections(user.uid);
        setDataLoaded(true); 
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setDataLoaded(true); 
      }
    };

    loadData();
  }, [fetchCollections, user]);

  if (authLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 dark:text-gray-300">
            Loading collections...
          </p>
        </div>
      </div>
    );
  }

  const createdCollections = collections.filter(
    (col) => col.ownerId === user.uid
  );
  const subscribedCollections = collections.filter(
    (col) => col.isSubscribed && col.ownerId !== user.uid
  );

  const openCreateCollection = () => {
    navigate("/create-collection");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          My Library
        </h1>
        <button
          onClick={openCreateCollection}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-3xl cursor-pointer transition"
        >
          Create new collection
        </button>
      </div>

      {!dataLoaded ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300">
            Loading collections...
          </p>
        </div>
      ) : subscribedCollections.length === 0 &&
        createdCollections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300">
            No collections in your library. Create your first collection!
          </p>
          <p>Or browse collections</p>
        </div>
      ) : (
        <div>
          {createdCollections.length !== 0 && (
            <div className="mb-8">
              <div className=" flex items-center gap-2  mb-4 ">
                <UserIcon className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
                <h2 className="text-2xl sm:text-3xl font-bold  text-black dark:text-white">
                  Created collections
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdCollections.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            </div>
          )}
          {subscribedCollections.length !== 0 && (
            <div>
              <div className="flex items-center gap-2  mb-4">
                <HeartIcon className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
                <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
                  Subscribed collections
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscribedCollections.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
