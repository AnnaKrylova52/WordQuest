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
  onSnapshot,
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

  // Подписка на все коллекции
  fetchCollections: (userId) => {
    set({ loading: true, error: null });

    // Отписываемся от предыдущих слушателей
    if (get().unsubscribeFunctions.collections) {
      get().unsubscribeFunctions.collections();
    }

    const colRef = collection(db, "collections");
    const q = query(colRef);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
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
      },
      (error) => {
        set({ error: error.message, loading: false });
      }
    );

    // Сохраняем функцию отписки
    set((state) => ({
      unsubscribeFunctions: {
        ...state.unsubscribeFunctions,
        collections: unsubscribe,
      },
    }));
  },

  // Подписка на конкретную коллекцию
  fetchCollection: (id, userId) => {
    set({ loading: true, error: null });

    // Отписываемся от предыдущего слушателя этой коллекции
    if (get().unsubscribeFunctions[id]) {
      get().unsubscribeFunctions[id]();
    }

    const docRef = doc(db, "collections", id);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
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
        } else {
          set({
            loading: false,
            error: "Collection not found",
            currentCollection: null,
          });
        }
      },
      (error) => {
        set({ error: error.message, loading: false });
      }
    );

    // Сохраняем функцию отписки
    set((state) => ({
      unsubscribeFunctions: {
        ...state.unsubscribeFunctions,
        [id]: unsubscribe,
      },
    }));
  },

  clearSubscriptions: () => {
    const { unsubscribeFunctions } = get();
    Object.values(unsubscribeFunctions).forEach((unsubscribe) => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    });
    set({ unsubscribeFunctions: {} });
  },

  // Добавляем метод для обновления подписок при смене пользователя
  refreshSubscriptions: (userId) => {
    const state = get();

    // Обновляем все коллекции с новым userId
    const updatedCollections = state.collections.map((col) => ({
      ...col,
      isSubscribed: (col.subscribedUsers || []).includes(userId),
    }));

    // Обновляем текущую коллекцию, если она есть
    const updatedCurrentCollection = state.currentCollection
      ? {
          ...state.currentCollection,
          isSubscribed: (
            state.currentCollection.subscribedUsers || []
          ).includes(userId),
        }
      : null;

    set({
      collections: updatedCollections,
      currentCollection: updatedCurrentCollection,
    });
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
      console.error("Error:", error);
    }
  },
  updatePrivacy: async (isPrivate, collectionId) => {
    try {
      const docRef = doc(db, "collections", collectionId);
      await updateDoc(docRef, {
        isPrivate: isPrivate,
      });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
}));
