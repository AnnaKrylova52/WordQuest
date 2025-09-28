import { useCollections } from "../store/useCollections";
import { useNavigate } from "react-router-dom";
import { CollectionCard } from "../ui/CollectionCard";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
export const CollectionsPage = () => {
  const { collections } = useCollections();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const openCreateCollection = () => {
    navigate("/create-collection");
  };
  const filteredCollections = useMemo(() => {
    if (!searchTerm) return collections.filter((col) => !col.isPrivate);
    return collections.filter(
      (col) =>
        !col.isPrivate &&
        (col.title
          .toLowerCase()
          .startsWith(searchTerm.toLocaleLowerCase()) ||
          col.description
            .toLowerCase()
            .startsWith(searchTerm.toLowerCase()) || col.collectionOwner.toLocaleLowerCase().startsWith(searchTerm.toLocaleLowerCase()))
    );
  }, [collections, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Collections
        </h1>
        <div className="relative dark:text-white">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="search"
            className="border-2 rounded-3xl py-2 px-8 dark:border-white placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-white dark:placeholder-neutral-300  "
          />
          <MagnifyingGlassIcon className="w-5 h-5 absolute top-3 left-3" />
        </div>
        <button
          onClick={openCreateCollection}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-3xl cursor-pointer transition"
        >
          Create new collection
        </button>
      </div>
      {filteredCollections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300">
            {searchTerm
              ? `No collections matching "${searchTerm}"`
              : "No collections found. Create your first collection!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections
            .filter((col) => !col.isPrivate)
            .map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
        </div>
      )}
    </div>
  );
};
