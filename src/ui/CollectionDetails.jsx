import { useRef, useEffect, useState } from "react";
import { useParams, useNavigate, useAsyncError } from "react-router-dom";
import {
  ArrowLeftIcon,
  TrashIcon,
  PlusCircleIcon,
  XMarkIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useCollections } from "../store/useCollections";
import { useAuth } from "../hooks/useAuth";
import { Loader } from "./Loader";
import { nanoid } from "nanoid";
import { ConfirmationModal } from "./confirmationModal";
import { DefinitionsContainer } from "./DefinitionsContainer";
import { Modal } from "./Modal";
export const CollectionDetails = () => {
  const navigate = useNavigate();
  const {
    fetchCollection,
    addTerm,
    deleteCollection,
    deleteTerm,
    currentCollection,
    loading,
    updateTerm,
    fetchDefinitions,
    updateDescription,
    updateTitle,
  } = useCollections();
  const definitionTextareaRef = useRef(null);
  const { isAdmin, user, showNotification } = useAuth();
  const [isAddTerm, setAddTerm] = useState(false);
  const [isUpdateTitle, setUpdateTitle] = useState(false);
  const [isUpdateTerm, setUpdateTerm] = useState(false);
  const [isUpdateDescription, setUpdateDescription] = useState(false);
  const [isConfirm, setConfirm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [definitions, setDefinitions] = useState([]);
  const [newTerm, setNewTerm] = useState({ term: "", definition: "", id: "" });
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchCollection(id);
    }
  }, [id, fetchCollection]);

  const handleEditTerm = (term) => {
    setUpdateTerm(true);
    setAddTerm(false);
    setNewTerm({
      term: term.term,
      definition: term.definition,
      id: term.id,
    });
  };
  const handleDefinitions = async (term) => {
    const defs = await fetchDefinitions(term);
    setDefinitions(defs);
  };
  const handleDefinitionClick = (def) => {
    setDefinitions([]);
    setNewTerm({
      ...newTerm,
      definition: def.definition,
    });
    // После установки значения, обновляем высоту текстового поля
    setTimeout(() => {
      if (definitionTextareaRef.current) {
        definitionTextareaRef.current.style.height = "auto";
        definitionTextareaRef.current.style.height =
          definitionTextareaRef.current.scrollHeight + "px";
      }
    }, 0);
  };
  const handleAddTerm = async () => {
    try {
      if (isAddTerm) {
        await addTerm(id, {
          term: newTerm.term,
          definition: newTerm.definition,
          id: nanoid(),
        });
      } else {
        await updateTerm(id, newTerm.id, {
          term: newTerm.term,
          definition: newTerm.definition,
          id: newTerm.id,
        });
      }
      setNewTerm({ term: "", definition: "", id: "" });
      setAddTerm(false);
      setUpdateTerm(false);
    } catch (error) {
      console.error("Error adding new term: ", error);
    }
  };

  const handleDeleteCollection = async () => {
    try {
      deleteCollection(id);
      navigate("/collections");
      showNotification("success", "Collection deleted");
    } catch (error) {
      console.error("Error deleting collection: ", error);
    }
  };
  const handleClose = () => {
    setNewTerm({ term: "", definition: "", id: "" });
    setAddTerm(false);
    setUpdateTerm(false);
  };
  const handleChangeTitle = async () => {
    try {
      await updateTitle(id, newTitle);
      await fetchCollection(id);
      setNewTitle("");
      setUpdateTitle(false);
      showNotification(
        "success",
        "Collection's title has been changed successfully!"
      );
    } catch (error) {
      console.error("Error changing title: ", error);
    }
  };

  const handleChangeDesciption = async () => {
    try {
      await updateDescription(id, newDescription);
      await fetchCollection(id);
      setNewDescription("");
      setUpdateDescription(false);
      showNotification(
        "success",
        "Collection's description has been changed successfully!"
      );
    } catch (error) {
      console.error("Error changing title: ", error);
    }
  };
  if (loading) return <Loader />;

  return (
    <div className=" py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-red-600 dark:text-red-600 hover:text-red-800 dark:hover:text-red-500 transition-colors cursor-pointer"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to collections</span>
        </button>

        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-900 dark:text-white gap-4 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold ">
                {currentCollection?.title}
              </h1>
              <PencilSquareIcon
                onClick={() => setUpdateTitle(true)}
                className="w-6 h-6"
              />
            </div>
            {(user.uid === currentCollection?.ownerId || isAdmin) && (
              <button
                onClick={() => setConfirm(true)}
                className="text-white bg-red-600 hover:bg-red-700  py-2 px-4 rounded-3xl cursor-pointer transition "
              >
                Delete
              </button>
            )}
          </div>

          <p className="text-lg text-gray-900 dark:text-white mb-4">
            Created by {currentCollection?.collectionOwner}
          </p>

          {currentCollection?.description && (
            <div className="flex items-center text-gray-900 dark:text-white gap-4 mb-4">
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl break-words">
                {currentCollection.description}
              </p>
              <PencilSquareIcon
                onClick={() => setUpdateDescription(true)}
                className="h-6 w-6"
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-2">
            <span className="px-3 py-1 bg-red-100 dark:bg-red-800/40 text-red-800 dark:text-red-200 rounded-full text-sm">
              {currentCollection?.words.length} terms
            </span>
            {(user.uid === currentCollection?.ownerId || isAdmin) && (
              <PlusCircleIcon
                onClick={() => setAddTerm(true)}
                className="text-neutral-700 dark:text-white w-8 h-8 hover:text-neutral-900 dark:hover:text-neutral-300 transition cursor-pointer"
              />
            )}
          </div>
          <div className="space-x-4 flex justify-center">
            <button className="text-white bg-red-900 border-b-2 border-transparent hover:border-b-2 hover:border-white py-2 px-6 rounded-lg cursor-pointer transition ">
              Memory game
            </button>
            <button className="text-white bg-red-900 border-transparent  hover:border-white hover:border-b-2   py-2 px-6 rounded-lg cursor-pointer transition ">
              Time game
            </button>
            <button className="text-white bg-red-900 border-transparent hover:border-b-2 hover:border-white box-border py-2 px-6 rounded-lg cursor-pointer transition ">
              Learning
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 dark:text-white">
          {currentCollection?.words.map((word) => (
            <div
              key={word.id}
              className="grid grid-cols-12 shadow-lg dark:shadow-none divide-x-2 gap-4 mb-4 rounded-lg p-4  items-center bg-white dark:bg-black"
            >
              <h3 className="py-4 pr-4 col-span-4 break-words">{word.term}</h3>
              <div className="flex justify-between items-center col-span-8 min-w-0">
                <p className="py-4 pr-4 break-words min-w-0 flex-1">
                  {word.definition}
                </p>
                {(user.uid === currentCollection?.ownerId || isAdmin) && (
                  <div className=" flex gap-2 flex-shrink-0">
                    <TrashIcon
                      onClick={() => deleteTerm(id, word.id)}
                      className={`w-6 h-6 ${
                        currentCollection.words.length > 3
                          ? "cursor-pointer hover:text-gray-200"
                          : "text-gray-500"
                      }`}
                    />
                    <PencilSquareIcon
                      onClick={() => handleEditTerm(word)}
                      className="w-6 h-6 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {(isAddTerm || isUpdateTerm) && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-20 flex items-center justify-center z-50 p-4 ">
          <div className="bg-white dark:bg-black rounded-xl shadow-xl w-full max-w-md p-6 border-2 border-red-600">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isUpdateTerm ? "Change Term" : "Add New Term"}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 dark:text-white dark:hover:text-gray-200"
              >
                <XMarkIcon className="w-6 h-6 cursor-pointer" />
              </button>
            </div>

            <form className="space-y-4">
              <div className="relative">
                <label
                  htmlFor="term"
                  className="mx-2 flex justify-between text-sm font-medium mb-1"
                >
                  <p className="text-neutral-700 dark:text-neutral-300">Term</p>
                  <p className="text-neutral-500 dark:text-neutral-400">
                    {newTerm.term.length}/50
                  </p>
                </label>
                <textarea
                  maxLength="50"
                  type="text"
                  id="term"
                  value={newTerm.term}
                  onChange={(e) => {
                    setNewTerm({ ...newTerm, term: e.target.value }),
                      (e.target.style.height = "auto");
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  placeholder={`Enter term `}
                  className="w-full px-4 py-2 border border-red-600  rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none overflow-hidden"
                  rows="1"
                />
                <button
                  type="button"
                  onClick={() => handleDefinitions(newTerm.term)}
                  className="absolute right-2 bottom-4 p-1 rounded-full bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                >
                  <MagnifyingGlassIcon
                    className={`w-4 h-4 text-red-600 dark:text-red-400`}
                  />
                </button>
              </div>

              <div>
                <label
                  htmlFor="definition"
                  className="flex justify-between mx-2 text-sm font-medium  mb-1 "
                >
                  <p className="text-neutral-700 dark:text-neutral-300">
                    Definition
                  </p>
                  <p className="text-neutral-500 dark:text-neutral-400">
                    {newTerm.definition.length}/300
                  </p>
                </label>
                <textarea
                  maxLength="300"
                  id="definition"
                  ref={definitionTextareaRef}
                  value={newTerm.definition}
                  onChange={(e) => {
                    setNewTerm({ ...newTerm, definition: e.target.value });
                    // Автоматически изменяем высоту при ручном вводе
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  placeholder="Enter definition"
                  rows="3"
                  className="w-full px-4 py-2 border border-red-600  rounded-lg  text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none overflow-hidden"
                />
                {definitions.length !== 0 && (
                  <DefinitionsContainer
                    definitions={definitions}
                    onClick={(def) => {
                      handleDefinitionClick(def);
                    }}
                    setDefinitions={() => setDefinitions([])}
                  />
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddTerm}
                  className="px-4 py-2 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition-colors cursor-pointer"
                >
                  {isUpdateTerm ? "Change" : "Add Term"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isConfirm && (
        <ConfirmationModal
          title="Are you sure you want to delete collection?"
          setClose={() => setConfirm(false)}
          setConfirm={handleDeleteCollection}
        />
      )}
      {isUpdateTitle && (
        <Modal
          setClose={() => {
            setUpdateTitle(false), setNewTitle("");
          }}
        >
          <div className="mt-2">
            <h3 className="text-xl text-center mb-2">Set new title</h3>

            <label
              htmlFor="title"
              className="mx-2 flex justify-between text-sm font-medium mb-1"
            >
              <p className="text-neutral-700 dark:text-neutral-300">
                New title
              </p>
              <p className="text-neutral-500 dark:text-neutral-400">
                {newTitle.length}/50
              </p>
            </label>
            <textarea
              maxLength="50"
              type="text"
              id="title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={`Enter term `}
              className="w-full px-4 py-2 border border-red-600  rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none overflow-hidden"
              rows="1"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleChangeTitle}
                className="px-4 py-2 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition-colors cursor-pointer"
              >
                Change title
              </button>
            </div>
          </div>
        </Modal>
      )}

      {isUpdateDescription && (
        <Modal
          setClose={() => {
            setUpdateDescription(false), setNewDescription("");
          }}
        >
          <div className="mt-2">
            <h3 className="text-xl text-center mb-2">Set new description</h3>

            <label
              htmlFor="title"
              className="mx-2 flex justify-between text-sm font-medium mb-1"
            >
              <p className="text-neutral-700 dark:text-neutral-300">
                New description
              </p>
              <p className="text-neutral-500 dark:text-neutral-400">
                {newDescription.length}/300
              </p>
            </label>
            <textarea
              maxLength="300"
              type="text"
              id="title"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder={`Enter term `}
              className="w-full px-4 py-2 border border-red-600  rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none overflow-hidden"
              rows="1"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleChangeDesciption}
                className="px-4 py-2 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition-colors cursor-pointer"
              >
                Change description
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
