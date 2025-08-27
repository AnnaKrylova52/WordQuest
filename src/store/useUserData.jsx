import { create } from "zustand";
import { db } from "../config/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,

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
        userData?.memoryGameRecords?.fieldSize?.[field] || Infinity;
      if (currentRecord > moves) {
        await updateDoc(docRef, {
          memoryGameRecords: {
            fieldSize: {
              [field]: moves,
            },
          },
        });
      }
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  
}));
