import { create } from "zustand";
import { db } from "../config/firebase";
import {
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  serverTimestamp,
  getDoc,
  query,
} from "firebase/firestore";
import { nanoid } from "nanoid";
import axios from "axios";
export const useCollections = create((set, get) => ({
  collections: [],
  userCollections: [],
  loading: false,
  currentCollection: null,
  error: null,
  subscribedCollections: [],
  unsubscribeFunctions: {},

  fetchCollections: async (userId) => {
    set({ loading: true, error: null });

    try {
      const colRef = collection(db, "collections");
      const querySnapshot = await getDocs(colRef);

      const collectionsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      set({
        collections: collectionsData.map((col) => ({
          ...col,
          isSubscribed: (col.subscribedUsers || []).includes(userId),
        })),
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchCollection: async (id, userId) => {
    set({ loading: true, error: null });
    try {
      const colRef = doc(db, "collections", id);
      const docSnap = await getDoc(colRef);

      if (docSnap.exists()) {
        set({
          currentCollection: {
            id: docSnap.id,
            ...docSnap.data(),
            isSubscribed: (docSnap.data().subscribedUsers || []).includes(
              userId
            ),
          },
          loading: false,
        });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  subscribeToCollection: async (collectionId, userId) => {
    try {
      await updateDoc(doc(db, "collections", collectionId), {
        subscribedUsers: arrayUnion(userId),
      });
      set((state) => {
        const updatedCurrentCollection =
          state.currentCollection && state.currentCollection.id === collectionId
            ? {
                ...state.currentCollection,
                isSubscribed: true,
                subscribedUsers: [
                  ...(state.currentCollection.subscribedUsers || []),
                  userId,
                ],
              }
            : state.currentCollection;

        return {
          currentCollection: updatedCurrentCollection,
          collections: state.collections.map((col) =>
            col.id === collectionId
              ? {
                  ...col,
                  isSubscribed: true,
                  subscribedUsers: [...(col.subscribedUsers || []), userId],
                }
              : col
          ),
        };
      });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  unsubscribeFromCollection: async (collectionId, userId) => {
    try {
      await updateDoc(doc(db, "collections", collectionId), {
        subscribedUsers: arrayRemove(userId),
      });
      set((state) => {
        const updatedCurrentCollection =
          state.currentCollection && state.currentCollection.id === collectionId
            ? {
                ...state.currentCollection,
                isSubscribed: false,
                subscribedUsers: (
                  state.currentCollection.subscribedUsers || []
                ).filter((id) => id !== userId),
              }
            : state.currentCollection;

        return {
          currentCollection: updatedCurrentCollection,
          collections: state.collections.map((col) =>
            col.id === collectionId
              ? {
                  ...col,
                  isSubscribed: false,
                  subscribedUsers: (col.subscribedUsers || []).filter(
                    (id) => id !== userId
                  ),
                }
              : col
          ),
        };
      });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  createCollection: async (collectionData, user, isPrivate) => {
    try {
      const id = nanoid();

      await setDoc(doc(db, "collections", id), {
        ...collectionData,
        firebaseId: id,
        collectionOwner: user.name,
        isPrivate: isPrivate,
        createdAt: serverTimestamp(),
        totalUsers: 1,
        ownerId: user.uid,
      });
      set((state) => ({
        collections: [...state.collections, { id, ...collectionData }],
      }));
      return id;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteCollection: async (id) => {
    try {
      await deleteDoc(doc(db, "collections", id));
      set((state) => ({
        collections: state.collections.filter((coll) => coll.id !== id),
        currentCollection: null,
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteTerm: async (collectionId, termId) => {
    try {
      const state = get();
      const collection =
        state.currentCollection ||
        state.collections.find((c) => c.id === collectionId);

      if (!collection) throw new Error("Collection not found");
      if (collection.words.length <= 3) {
        throw new Error("Collection must have at least 3 terms");
      }

      const updatedWords = collection.words.filter(
        (word) => word.id !== termId
      );

      await updateDoc(doc(db, "collections", collectionId), {
        words: updatedWords,
      });

      set((state) => ({
        collections: state.collections.map((coll) =>
          coll.id === collectionId ? { ...coll, words: updatedWords } : coll
        ),
        currentCollection:
          state.currentCollection?.id === collectionId
            ? { ...state.currentCollection, words: updatedWords }
            : state.currentCollection,
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  updateTerm: async (collectionId, termId, updatedTerm) => {
    try {
      const state = get();
      const collection =
        state.currentCollection ||
        state.collections.find((c) => c.id === collectionId);

      if (!collection) return;

      // Находим индекс термина в массиве
      const termIndex = collection.words.findIndex(
        (word) => word.id === termId
      );

      // Создаем новый массив с обновленным термином на том же индексе
      const updatedWords = [...collection.words];
      updatedWords[termIndex] = {
        ...updatedWords[termIndex],
        ...updatedTerm,
      };

      // Обновляем документ в Firestore
      await updateDoc(doc(db, "collections", collectionId), {
        words: updatedWords,
      });
      // Обновляем локальное состояние
      set((state) => ({
        collections: state.collections.map((coll) =>
          coll.id === collectionId ? { ...coll, words: updatedWords } : coll
        ),
        currentCollection:
          state.currentCollection?.id === collectionId
            ? { ...state.currentCollection, words: updatedWords }
            : state.currentCollection,
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  addTerm: async (collectionId, term) => {
    try {
      const docRef = doc(db, "collections", collectionId);
      const newTerm = {
        ...term,
        id: nanoid(),
      };
      await updateDoc(docRef, {
        words: arrayUnion(newTerm),
      });

      set((state) => ({
        collections: state.collections.map((coll) =>
          coll.id === collectionId
            ? { ...coll, words: [...coll.words, newTerm] }
            : coll
        ),
        currentCollection:
          state.currentCollection?.id === collectionId
            ? {
                ...state.currentCollection,
                words: [...state.currentCollection.words, newTerm],
              }
            : currentCollection,
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  updateTitle: async (collectionId, title) => {
    try {
      const docRef = doc(db, "collections", collectionId);
      await updateDoc(docRef, {
        title: title,
      });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  updateDescription: async (collectionId, description) => {
    try {
      const docRef = doc(db, "collections", collectionId);
      await updateDoc(docRef, {
        description: description,
      });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  fetchDefinitions: async (term) => {
    try {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${term}`
      );

      const data = await response.data;

      const allDefinitions = [];
      data.forEach((word) => {
        word.meanings.forEach((meaning) => {
          meaning.definitions.forEach((def) => {
            allDefinitions.push({
              definition: def.definition,
            });
          });
        });
      });

      return allDefinitions;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Термин не найден
        console.log("Term not found");
        return []; // Возвращаем пустой массив вместо ошибки
      } else {
        console.error("Error:", error);
        throw error;
      }
    }
  },
  updatePrivacy: async (isPrivate, collectionId) => {
    try {
      const docRef = doc(db, "collections", collectionId);
      await updateDoc(docRef, {
        isPrivate: isPrivate,
      });
      set((state) => ({
        collections: state.collections.map((coll) =>
          coll.id === collectionId ? { ...coll, isPrivate: isPrivate } : coll
        ),
        currentCollection: state.currentCollection
          ? {
              ...state.currentCollection,
              isPrivate,
            }
          : isPrivate,
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
}));
