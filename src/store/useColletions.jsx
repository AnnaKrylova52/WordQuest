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
  getDoc,
  collection,
} from "firebase/firestore";
import { nanoid } from "nanoid";

export const useCollections = create((set, get) => ({
  collections: [],
  loading: false,
  currentCollection: null,
  error: null,

  fetchCollections: async () => {
    set({ loading: true, error: null });
    try {
      const colRef = collection(db, "collections");
      const querySnapshot = await getDocs(colRef);
      const collectionsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      set({ collections: collectionsData, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchCollection: async (id) => {
    set({ loading: true, error: null });
    try {
      const docRef = doc(db, "collections", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        set({
          currentCollection: { id: docSnap.id, ...docSnap.data() },
          loading: false,
        });
      } else {
        set({
          loading: false,
          error: "Collection not found",
          currentCollection: null,
        });
      }
    } catch (error) {
      set({
        error: error.message,
        loading: false,
        currentCollection: null,
      });
      throw error;
    }
  },
  createCollection: async (collectionData) => {
    try {
      const id = nanoid();
      await setDoc(doc(db, "collections", collectionData.title), {
        ...collectionData,
        firebaseId: id,
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
      navigate(-1);
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

      const term = collection.words.find((word) => word.id === termId);
      await updateDoc(doc(db, "collections", collectionId), {
        words: arrayRemove(term),
      });

      set((state) => ({
        collections: state.collections.map((coll) =>
          coll.id === collectionId
            ? { ...coll, words: coll.words.filter((w) => w.id !== termId) }
            : coll
        ),
        currentCollection:
          state.currentCollection?.id === collectionId
            ? {
                ...state.currentCollection,
                words: state.currentCollection.words.filter(
                  (w) => w.id !== termId
                ),
              }
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
}));
