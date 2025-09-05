import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Notification } from "../ui/Notification";
import { useCollections } from "../store/useCollections";
import {
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  deleteUser,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  deleteDoc,
  getDoc,
  collection,
  where,
  query,
  getDocs,
} from "firebase/firestore";
import { useUserData } from "../store/useUserData";
import { auth, db, signInWithGoogle } from "../config/firebase";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { fetchCollections } = useCollections();
  const { fetchUser, userData, setUserData } = useUserData();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\x21-\x7E]{8,15}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const isAdmin = userData?.role === "admin";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.role || "user";
            const fullUserData = await fetchUser(firebaseUser.uid);
            setUserData({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || userData.name,
              photoURL: firebaseUser.photoURL,
              profilePhoto: userData.profilePhoto,
              provider: firebaseUser.providerData[0]?.providerId || "email",
              role: role,
              timeGameRecords: fullUserData?.timeGameRecords,
              memoryGameRecords: fullUserData?.memoryGameRecords,
            });

            fetchCollections(firebaseUser.uid);
          }
        } catch (error) {
          console.error("Firestore error:", error);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const makeAdmin = async (targetUserId) => {
    if (!isAdmin()) {
      showNotification("error", "Only admins can perform this action");
      throw new Error("Permission denied");
    }
    try {
      await updateDoc(doc(db, "users", targetUserId), {
        role: "admin",
      });
      showNotification("success", "User promoted to admin");
    } catch (error) {
      console.error("Error making admin:", error);
      showNotification("error", "Failed to promote user");
      throw error;
    }
  };

  const getAllUsers = async () => {
    if (!isAdmin()) {
      showNotification("error", "Only admins can view all users");
      return [];
    }

    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      return usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      showNotification("error", "Failed to load users");
      return [];
    }
  };
  const regWithGoogle = async () => {
    try {
      const result = await signInWithGoogle();
      const userRef = doc(db, "users", result.user.uid); // Ссылка на документ пользователя
      // Проверяем, новый ли пользователь
      if (
        result.user.metadata.creationTime ===
        result.user.metadata.lastSignInTime
      ) {
        // Создаем документ только для новых пользователей
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          role: "user",
          provider: "google.com",
        });
      } else {
        await updateDoc(userRef, { lastLogin: serverTimestamp() }); //если пользователь уже зарегистрирован, то обновляем время последнего входа
      }
      const userData = {
        id: result.user.uid,
        email: result.user.email,
        name: result.user.displayName,
        provider: "google.com",
        role: "user",
      };
      setUserData(userData);
      showNotification("success", "Successful login via Google");
      navigate("/home");
    } catch (error) {
      showNotification(
        "error",
        "Email/password authentication is disabled. Contact support."
      );
      console.error("Google sign-in error:", error);
      throw new Error("Google sign-in failed");
    }
  };

  const updateUserName = async (newName) => {
    try {
      const currentUser = auth.currentUser;
      await updateProfile(currentUser, {
        displayName: newName,
      });
      await updateDoc(doc(db, "users", currentUser.uid), {
        displayName: newName,
      });
      const updatePromises = [];
      const q = query(
        collection(db, "collections"),
        where("ownerId", "==", currentUser.uid)
      );
      const colSnap = await getDocs(q);
      colSnap.forEach(doc=> {
        updatePromises.push(
          updateDoc(doc.ref, {collectionOwner: newName})
        )
      })

      await Promise.all(updatePromises)
      await fetchCollections(currentUser.uid)

      setUserData({
        ...userData,
        name: newName,
      });

      showNotification("success", "Username successfuly changed");
    } catch (error) {
      console.error("Error updating name", error);
      showNotification("error", error);
    }
  };
  const deleteAccount = async (password) => {
    try {
      const currentUser = auth.currentUser;

      const credential = EmailAuthProvider.credential(
        currentUser.email,
        password
      );

      await reauthenticateWithCredential(currentUser, credential);

      await deleteDoc(doc(db, "users", currentUser.uid));

      await deleteUser(currentUser);

      setUserData(null);
      showNotification("success", "Account deleted");
    } catch (error) {
      console.error("Error deliting user", error);
      let errorMessage = "Failed to delete account";
      switch (error.code) {
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many requests. Try again later";
          break;
        case "auth/requires-recent-login":
          errorMessage = "Requires recent login. Please re-login and try again";
          break;
        case "auth/invalid-credential":
          showNotification("error", "Invalid password!");
          errorMessage = "Invalid password";
          break;
        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your internet connection.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      showNotification("error", errorMessage);
      throw new Error(errorMessage);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    const currentUser = auth.currentUser;

    if (newPassword === currentPassword) {
      showNotification(
        "warning",
        "New passsword should not be same as your old one"
      );
      throw new Error("Passwords are the same");
    }
    if (!newPassword || !passwordRegex.test(newPassword)) {
      showNotification(
        "warning",
        "Password should contain at least one number, one upper case letter and one symbol and be at least 8 chars long!"
      );
      throw new Error("Invalid password");
    }
    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );

      // Повторная аутентификация
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      showNotification("success", "Password changed successfully");
    } catch (error) {
      console.error("Password change error:", error);
      let errorMessage = "Failed to change password";
      switch (error.code) {
        case "auth/wrong-password":
          errorMessage = "Current password is incorrect";
          break;
        case "auth/requires-recent-login":
          errorMessage = "Requires recent login. Please re-login and try again";
          break;
        case "auth/invalid-credential":
          showNotification(
            "error",
            "No account with this email address or invalid password!"
          );
          errorMessage =
            "No account with this email address or invalid password";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      showNotification("error", errorMessage);
      throw new Error(errorMessage);
    }
  };
  const register = async (userData) => {
    if (!emailRegex.test(userData.email) && userData.email) {
      showNotification("warning", "Please enter a valid email address!");
      throw new Error("Please enter a valid email address");
    }
    if (!userData.email) {
      showNotification("warning", "Email cannot be empty!");
      throw new Error("Please enter an email address");
    }
    if (!userData.name) {
      showNotification("warning", "Name field cannot be empty!");
      throw new Error("Please enter your name address");
    }
    if (!userData.password || !passwordRegex.test(userData.password)) {
      showNotification(
        "warning",
        "Password should contain at least one number, one upper case letter and one symbol!"
      );
      throw new Error("Invalid password");
    }
    try {
      if (userData.email && userData.password) {
        const result = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );
        await updateProfile(result.user, {
          displayName: userData.name,
        });

        // Создаем документ пользователя в Firestore
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: userData.name,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          role: "user",
        });
        showNotification("success", "Registration completed");
        const newUser = {
          id: result.user.uid,
          email: result.user.email,
          name: userData.name,
          provider: "email",
          role: "user",
        };

        setUserData(newUser);
        navigate("/home");
        return;
      }
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Registration failed";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email already in use";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 8 characters!";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/operation-not-allowed":
          showNotification(
            "error",
            "Email/password authentication is disabled. Contact support."
          );
          errorMessage =
            "Email/password authentication is disabled. Contact support.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      showNotification("error", errorMessage);
      throw new Error(errorMessage);
    }
  };
  const login = async (userData) => {
    if (!userData.email) {
      showNotification("warning", "Email cannot be empty!");
      throw new Error("Please enter a valid email address!");
    }
    if (!emailRegex.test(userData.email) && userData.email) {
      showNotification("warning", "Please enter a valid email address!");
      throw new Error("Please enter a valid email address!");
    }

    if (!userData.password) {
      showNotification(
        "warning",
        "Password filed cannot be empty! Enter your password."
      );
      throw new Error("Please enter your password");
    }
    try {
      if (userData.email && userData.password) {
        const result = await signInWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );
        // Обновляем время последнего входа
        await updateDoc(doc(db, "users", result.user.uid), {
          lastLogin: serverTimestamp(),
        });
        navigate("/home");
        return;
      }
    } catch (error) {
      console.error(error);
      let errorMessage = "Login failed";
      switch (error.code) {
        case "auth/wrong-password":
          errorMessage = "No account with this email address";
          break;
        case "auth/user-not-found":
          errorMessage = "No account with this email address";
          break;
        case "auth/invalid-credential":
          errorMessage =
            "No account with this email address or invalid password";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/operation-not-allowed":
          errorMessage =
            "Email/password authentication is disabled. Contact support.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      showNotification("error", errorMessage);
      throw new Error(errorMessage);
    }
  };
  const resetPassword = async (email) => {
    try {
      if (!email || email.trim() === "") {
        showNotification("warning", "Email cannot be empty");
      }
      await sendPasswordResetEmail(auth, email);
      showNotification(
        "success",
        "Password reset email sent!Check your inbox."
      );
    } catch (error) {
      console.error("Error sending reset email:", error);
      let errorMessage = "Error sending reset email";
      if (error.code === "auth/user-not-found") {
        errorMessage = "User with this email not found";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      }
      showNotification("error", errorMessage);
    }
  };
  const onLogout = async () => {
    // Если пользователь вошел через Google, выходим из Firebase
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setUserData(null);
      localStorage?.removeItem("authData");
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: userData,
        loading,
        register,
        onLogout,
        login,
        regWithGoogle,
        deleteAccount,
        updateUserName,
        resetPassword,
        changePassword,
        showNotification,
        isAdmin,
        getAllUsers,
        makeAdmin,
      }}
    >
      {children}

      {notification && (
        <Notification type={notification.type}>
          {notification.message}
        </Notification>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
