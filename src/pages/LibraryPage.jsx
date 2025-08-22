import { CollectionCard } from "../ui/CollectionCard";
import { useCollections } from "../store/useCollections";
import { useCallback, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
export const LibraryPage = () => {
  const { userCollections, fetchSubscriptions } = useCollections();
  const { user } = useAuth();

  const loadSubscriptions = useCallback(async () => {
    await fetchSubscriptions(user.uid);
  }, [user.uid, fetchSubscriptions]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);
  const createdCollections = userCollections.filter(
    (col) => col.ownerId === user.uid
  );
  const subscribedCollections = userCollections.filter(
    (col) => col.ownerId !== user.uid
  );
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {userCollections.length === 0 ? (
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
              <h1 className="text-3xl font-bold text-black dark:text-white mb-4">
                Created collections
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdCollections.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            </div>
          )}
          {subscribedCollections.length !== 0 && (
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white mb-4">
                Your favorite collections
              </h1>
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
