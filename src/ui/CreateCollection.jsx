import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { nanoid } from "nanoid";
import { useCollections } from "../store/useColletions";
import { useNavigate } from "react-router-dom";
export const CreateCollection = ({ title, button }) => {
  const navigate = useNavigate();
  const { createCollection } = useCollections();
  const [collection, setCollection] = useState({
    title: "",
    description: "",
    words: [
      { id: nanoid(), term: "", definition: "" },
      { id: nanoid(), term: "", definition: "" },
      { id: nanoid(), term: "", definition: "" },
    ],
    firebaseId: "",
  });

  const handleCreate = async () => {
    try {
      const id = await createCollection(collection);
      navigate(`/collections/${id}`);
    } catch (error) {
      console.error("Error occured while creating collection: ", error);
    }
  };
  const addWord = () => {
    setCollection({
      ...collection,
      words: [...collection.words, { id: nanoid(), term: "", definition: "" }],
    });
  };

  const updateWord = (id, filed, value) => {
    setCollection({
      ...collection,
      words: collection.words.map((card) =>
        card.id === id ? { ...card, [filed]: value } : card
      ),
    });
  };

  const deleteWord = (id) => {
    if (collection.words.length > 3) {
      setCollection({
        ...collection,
        words: collection.words.filter((card) => card.id !== id),
      });
    }
  };

  return (
    <div>
      <div className="dark:text-white flex justify-center">
        <div className="w-5xl mx-4">
          <div className="flex justify-between items-center  my-6">
            <h1 className="text-3xl font-bold dark:text-white ">{title}</h1>

            <button
              onClick={handleCreate}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-3xl cursor-pointer transition "
            >
              {button}
            </button>
          </div>
          <form action="" className="space-y-4">
            <div>
              <input
                maxLength="50"
                type="text"
                id="title"
                placeholder="Title"
                className="border border-red-600 rounded-xl p-4 w-full bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-red-500"
                value={collection.title}
                onChange={(e) =>
                  setCollection({ ...collection, title: e.target.value })
                }
              />
            </div>
            <div>
              <textarea
                maxLength="200"
                id="description"
                placeholder="Description"
                rows="3"
                className="border border-red-600 rounded-xl w-full p-4 bg-white dark:bg-black resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                value={collection.description}
                onChange={(e) =>
                  setCollection({ ...collection, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-4">
              {collection.words.map((card, index) => (
                <div
                  key={card.id}
                  className="bg-white dark:bg-black rounded-xl"
                >
                  <div className="border-b p-4 flex justify-between">
                    <span>{index + 1}</span>
                    <TrashIcon
                      onClick={() => deleteWord(card.id)}
                      className={`w-5 h-5  ${
                        collection.words.length > 3
                          ? "cursor-pointer hover:text-gray-200"
                          : "text-gray-500"
                      }`}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 p-6">
                    <div className="space-y-2">
                      <label
                        htmlFor={`term-${card.id}`}
                        className="flex justify-between text-sm font-medium mx-2"
                      >
                        <p className="text-neutral-700 dark:text-neutral-300">
                          Term
                        </p>
                        <p className="text-neutral-500 dark:text-neutral-400">
                          {card.term.length}/50
                        </p>
                      </label>
                      <textarea
                        id={`term-${card.id}`}
                        maxLength="50"
                        placeholder="Enter term"
                        className="border border-red-600 rounded-lg mt-0.5 p-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500 break-words resize-none overflow-hidden"
                        value={card.term}
                        rows="1"
                        onChange={(e) =>
                          updateWord(card.id, "term", e.target.value)
                        }
                        onInput={(e) => {
                          e.target.style.height = "auto";
                          e.target.style.height = e.target.scrollHeight + "px";
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor={`definition-${card.id}`}
                        className="flex justify-between text-sm font-medium  mx-2"
                      >
                        <p className="text-neutral-700 dark:text-neutral-300">
                          {" "}
                          Definition
                        </p>
                        <p className="text-neutral-500 dark:text-neutral-400">
                          {card.definition.length}/200
                        </p>
                      </label>
                      <textarea
                        maxLength="200"
                        id={`definition-${card.id}`}
                        placeholder="Enter definition"
                        rows="1"
                        className="border border-red-600 rounded-lg mt-0.5 p-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500 break-words resize-none overflow-hidden"
                        value={card.definition}
                        onChange={(e) =>
                          updateWord(card.id, "definition", e.target.value)
                        }
                        onInput={(e) => {
                          e.target.style.height = "auto";
                          e.target.style.height = e.target.scrollHeight + "px";
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="text-center">
                <button
                  onClick={addWord}
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white  py-4 px-6 rounded-4xl cursor-pointer transition "
                >
                  Add New Term
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
