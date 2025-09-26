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
  userData: null,
  error: null,

  setUserData: (data) => set({ userData: data }),

  fetchUsers: async () => {
    try {
      const colRef = collection(db, "users");
      const querySnapshot = await getDocs(colRef);
      const collectionsData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      set({ usersData: collectionsData });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  fetchUser: async (userId) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        set({ userData });
        return userData;
      }
      return null;
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
      const currentRecord = userData?.timeGameRecords?.words || 0;
      if (guessedWords > currentRecord) {
        await updateDoc(docRef, {
          timeGameRecords: {
            words: guessedWords,
            date: serverTimestamp(),
          },
        });
        const updatedDoc = await getDoc(docRef);
        return updatedDoc.data();
      }
      return userData;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  updateLearningProgress: async (words, collectionId, userId) => {
    const docRef = doc(db, "users", userId);

    const progressUpdates = {};
    words.forEach((word) => {
      progressUpdates[`collectionsProgress.${collectionId}.${word.id}`] = {
        progress: word.progress,
        lastPracticed: new Date(),
      };
    });

    try {
      await updateDoc(docRef, progressUpdates);
    } catch (error) {
      throw error;
    }
  },

  updateUserPhoto: async (img, userId) => {
    try {
      await updateDoc(doc(db, `users`, userId), {
        profilePhoto: img,
      });
      set((state) => ({
        userData: {
          ...state.userData,
          profilePhoto: img,
        },
      }));
    } catch (error) {
      console.error("Error updating profile photo:", error);
    }
  },
  deleteUserPhoto: async (userId) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        profilePhoto: null,
      });
      set((state) => ({
        userData: {
          ...state.userData,
          profilePhoto: null,
        },
      }));
    } catch (error) {
      console.error("Error updating profile photo:", error);
    }
  },
  fetchUserPhoto: async (userId) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        if (userData?.profilePhoto) {
          return userData?.profilePhoto;
        } else {
          return null;
        }
      }
      return null;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
}));
