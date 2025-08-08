import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5QHAaacajoOf2hxWI-zDeFOM_2UZhVDU",
  authDomain: "react-english-190c1.firebaseapp.com",
  projectId: "react-english-190c1",
  storageBucket: "react-english-190c1.firebasestorage.app",
  messagingSenderId: "426859213503",
  appId: "1:426859213503:web:d31dac452fccfd51c2cc0a",
  measurementId: "G-68LX2ZGYW7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};
