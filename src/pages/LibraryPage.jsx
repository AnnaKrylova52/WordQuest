import { CollectionCard } from "../ui/CollectionCard";
import { useCollections } from "../store/useCollections";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { UserIcon, HeartIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import{MagnifyingGlassIcon} from "@heroicons/react/24/outline";

export const LibraryPage = () => {
  const { collections } = useCollections();
  const { user } = useAuth();
  const navigate = useNavigate();

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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          My Library
        </h1>
        <button
          onClick={openCreateCollection}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-3xl cursor-pointer transition"
        >
          Create new collection
        </button>
      </div>

      {subscribedCollections.length === 0 && createdCollections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300 text-2xl">
            No collections in your library. Create your first collection!
          </p>
          <p className="text-xl">Or browse collections</p>
        </div>
      ) : (
        <div>
          {createdCollections.length !== 0 && (
            <div className="mb-8">
              <div className=" flex items-center gap-2  mb-4 ">
                <div className="bg-red-600/10 p-3 rounded-full h-12 w-12 sm:h-16 sm:w-16  flex items-center justify-center ">
                  <UserIcon className="h-8 w-8 sm:h-10 sm:w-10  text-red-600" />
                </div>

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
                <div className="bg-red-600/10 p-3 rounded-full h-12 w-12 sm:h-16 sm:w-16  flex items-center justify-center ">
                  <HeartIcon className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
                </div>
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
