import { useState, useRef } from "react";
import {
  TrashIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { nanoid } from "nanoid";
import { useCollections } from "../store/useCollections";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { DefinitionsContainer } from "../ui/DefinitionsContainer";
import { BackButton } from "../ui/BackButton";
import { useEffect } from "react";

export const CreateCollection = () => {
  const navigate = useNavigate();
  const [textareaRefs, setTextareaRefs] = useState({});
  const { createCollection, fetchDefinitions } = useCollections();
  const [isPrivate, setPrivate] = useState(false);
  const { user, showNotification } = useAuth();
  const [definitions, setDefinitions] = useState([]);
  const [activeTermId, setActiveTermId] = useState(null);
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
  const handleDefinitionClick = (cardId, def) => {
    updateWord(cardId, "definition", def.definition);
    setDefinitions([]);
    setActiveTermId(null);

    // После установки значения, обновляем высоту текстового поля
    setTimeout(() => {
      if (textareaRefs[cardId]) {
        textareaRefs[cardId].style.height = "auto";
        textareaRefs[cardId].style.height =
          textareaRefs[cardId].scrollHeight + "px";
      }
    }, 0);
  };

  const handleDefinitions = async (cardId, term) => {
    setActiveTermId(cardId);
    const defs = await fetchDefinitions(term);
    setDefinitions(defs);
  };

  const handleCreate = async () => {
    if (collection.title === "") {
      showNotification("warning", "Please fill the title field!");
      return;
    }

    const errors = collection.words.reduce((error, word) => {
      if (!word.term.trim() || !word.definition.trim()) {
        return error + 1;
      }
    }, 0);

    if (errors > 0) {
      showNotification(
        "warning",
        "Please fill all term and definition fields!"
      );
      return;
    }
    try {
      const id = await createCollection(collection, user, isPrivate);
      navigate(`/collections/${id}`);
      showNotification(
        "success",
        "The new collection has been created successfully!"
      );
    } catch (error) {
      showNotification("error", "Error occured while creating collection.");
      console.error("Error occured while creating collection: ", error);
    }
  };
  const addWord = () => {
    const newId = nanoid();
    setCollection({
      ...collection,
      words: [...collection.words, { id: nanoid(), term: "", definition: "" }],
    });
    setTextareaRefs((prev) => ({ ...prev, [newId]: null }));
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
  useEffect(() => {
    document.title = "Create Collection | WordQuest";
  }, []);

  return (
    <div className="dark:text-white flex justify-center">
      <div className="w-5xl mx-4 my-6">
        <BackButton />
        <div className="flex justify-between items-center my-6">
          <h1 className="text-3xl font-bold dark:text-white ">
            Create new collection
          </h1>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setPrivate(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-700 dark:peer-focus:ring-red-700 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-red-600 dark:peer-checked:bg-red-600"></div>
              <span className="ml-1 text-sm font-medium text-gray-900 dark:text-gray-300">
                Private
              </span>
            </label>
            <button
              onClick={handleCreate}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-3xl focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer transition "
            >
              Create
            </button>
          </div>
        </div>
        <form className="space-y-4">
          <div>
            <input
              required
              maxLength="50"
              type="text"
              id="title"
              placeholder="Title"
              className="border border-red-600 rounded-xl p-4 w-full bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={collection.title}
              onChange={(e) =>
                setCollection({ ...collection, title: e.target.value })
              }
            />
          </div>
          <div>
            <textarea
              maxLength="300"
              id="description"
              placeholder="Description"
              rows="3"
              className="border border-red-600 rounded-xl w-full p-4 bg-white dark:bg-neutral-950 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
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
                className="bg-white dark:bg-neutral-950 rounded-xl"
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
                    <div className="relative">
                      <textarea
                        required
                        id={`term-${card.id}`}
                        maxLength="50"
                        placeholder="Enter term"
                        className="border border-red-600 rounded-lg mt-0.5 p-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500 break-words resize-none overflow-hidden pr-10"
                        value={card.term}
                        rows="1"
                        onChange={(e) => {
                          updateWord(card.id, "term", e.target.value),
                            (e.target.style.height = "auto");
                          e.target.style.height = e.target.scrollHeight + "px";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleDefinitions(card.id, card.term)}
                        className="absolute right-2 bottom-1/3 p-1 rounded-full bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                      >
                        <MagnifyingGlassIcon
                          className={`w-4 h-4 text-red-600 dark:text-red-400 cursor-pointer`}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor={`definition-${card.id}`}
                      className="flex justify-between text-sm font-medium  mx-2"
                    >
                      <p className="text-neutral-700 dark:text-neutral-300">
                        Definition
                      </p>
                      <p className="text-neutral-500 dark:text-neutral-400">
                        {card.definition.length}/300
                      </p>
                    </label>
                    <textarea
                      required
                      maxLength="300"
                      ref={(el) => (textareaRefs[card.id] = el)}
                      id={`definition-${card.id}`}
                      placeholder="Enter definition"
                      rows="1"
                      className=" border border-red-600 rounded-lg mt-0.5 p-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500 break-words resize-none overflow-hidden"
                      value={card.definition}
                      onChange={(e) => {
                        updateWord(card.id, "definition", e.target.value),
                          (e.target.style.height = "auto");
                        e.target.style.height = e.target.scrollHeight + "px";
                      }}
                    />
                    {activeTermId === card.id && definitions.length > 0 && (
                      <DefinitionsContainer
                        definitions={definitions}
                        onClick={(def) => {
                          handleDefinitionClick(card.id, def);
                        }}
                        setDefinitions={() => setDefinitions([])}
                      />
                    )}
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
  );
};
