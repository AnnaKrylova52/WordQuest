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
  serverTimestamp,
  query,
  where,
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
  fetchSubscriptions: async (userId) => {
    set({ loading: true, error: null });
    try {
      const q = query(
        collection(db, "collections"),
        where("subscribedUsers", "array-contains", userId)
      );
      const querySnapshot = await getDocs(q);
      const subscribedIds = querySnapshot.docs.map((doc) => doc.id);
      const userCollections = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      set({
        subscribedCollections: subscribedIds,
        loading: false,
        userCollections: userCollections,
      });
    } catch (error) {
      set({
        error: error.message,
        loading: false,
        subscribedCollections: [],
        userCollections: [],
      });
      throw error;
    }
  },
  subscribeToCollection: async (collectionId, userId) => {
    try {
      const { collections } = get();
      const collectionToSubscribe = collections.find(
        (c) => c.id === collectionId
      );
      await updateDoc(doc(db, "collections", collectionId), {
        subscribedUsers: arrayUnion(userId),
      });
      set((state) => ({
        subscribedCollections: [...state.subscribedCollections, collectionId],
        userCollections: [...state.userCollections, collectionToSubscribe],
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  unsubscribeFormCollection: async (collectionId, userId) => {
    try {
      await updateDoc(doc(db, "collections", collectionId), {
        subscribedUsers: arrayRemove(userId),
      });
      set((state) => ({
        subscribedCollections: state.subscribedCollections.filter(
          (id) => id !== collectionId
        ),
        userCollections: state.userCollections.filter(
          (col) => col.id !== collectionId
        ),
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  createCollection: async (collectionData, user, isPrivate) => {
    try {
      const id = nanoid();
      const userId = user.uid;

      if (!isPrivate) {
        await setDoc(doc(db, "collections", id), {
          ...collectionData,
          firebaseId: id,
          collectionOwner: user.name,
          isPrivate: isPrivate,
          createdAt: serverTimestamp(),
          totalUsers: 1,
          ownerId: userId,
          subscribedUsers: [userId],
        });
      }

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

      // Обновляем основную коллекцию
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
}));
