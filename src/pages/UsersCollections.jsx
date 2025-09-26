import { useCollections } from "../store/useCollections";
import { useParams } from "react-router-dom";
import { CollectionCard } from "../ui/CollectionCard";
import { BackButton } from "../ui/BackButton";
import { useUserData } from "../store/useUserData";
import { useEffect, useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
export const UserCollections = () => {
  const { fetchUserPhoto } = useUserData();
  const { collections } = useCollections();
  const { userId } = useParams();
  const [userPhoto, setUserPhoto] = useState(null);
  const userCollections = collections.filter((col) => col.ownerId === userId);
  const userName = userCollections[0]?.collectionOwner;
  useEffect(() => {
    const handleUserPhoto = async () => {
      try {
        const userPhoto = await fetchUserPhoto(userId);
        setUserPhoto(userPhoto);
      } catch (error) {
        console.error(error);
        setUserPhoto(null);
      }
    };
    handleUserPhoto();
  }, []);

  if (userCollections.length === 0)
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <BackButton />
        <div className="my-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-2xl">
            No collections!
          </p>
        </div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <BackButton />
      <div className="flex items-center gap-4 mb-6">
        {userPhoto ? (
          <img
            src={userPhoto}
            alt="Profile Photo"
            className="w-20 h-20 rounded-full border-2 border-red-600 object-cover"
          />
        ) : (
          <div className="bg-gradient-to-br from-neutral-200 to-red-400 dark:from-neutral-700 dark:to-red-600 rounded-full w-20 h-20  flex items-center justify-center border-2 border-red-600">
            <UserCircleIcon className="text-red-600" />
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          {userName}'s collections
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {userCollections
          .filter((col) => !col.isPrivate)
          .map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
      </div>
    </div>
  );
};
