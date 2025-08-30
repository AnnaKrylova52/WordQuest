import { create } from "zustand";
import { db } from "../config/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
export const useUserData = create((set, get) => ({
  usersData: [],
  error: null,

  fetchUsers: async () => {
    try {
      const colRef = collection(db, "users");
      const querySnapshot = await getDocs(colRef);
      const collectionsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      set({ usersData: collectionsData });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  uploadMemoryGameResults: async (userId, moves, filedSize) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      const userData = docSnap.data();
      const field = `${filedSize}x${filedSize}`;
      const currentRecord =
        userData?.memoryGameRecords?.fieldSize?.[field].moves || Infinity;
      if (currentRecord > moves) {
        await updateDoc(docRef, {
          memoryGameRecords: {
            fieldSize: {
              [field]: {
                moves: moves,
                date: serverTimestamp(),
              },
            },
          },
        });
      }
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  shuffleArray: (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[i],
      ];
    }
    return shuffled;
  },

  uploadTimeGameResults: async (userId, guessedWords) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      const userData = docSnap.data();
      const currentRecord = userData?.timeGameRecords.words || 0;
      if (guessedWords > currentRecord) {
        await updateDoc(docRef, {
          timeGameRecords: {
            words: guessedWords,
            date: serverTimestamp(),
          },
        });
      }
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
}));
