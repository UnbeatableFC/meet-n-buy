import { auth } from "@/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { randomAvatar } from "../hooks/random-avatar";

const logIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

const logOut = () => {
  signOut(auth);
};

const googleSignIn = () => {
  const googleAuthProvider = new GoogleAuthProvider();
  return signInWithPopup(auth, googleAuthProvider);
};

export const userAuthContext = createContext({
  user: null,
  logIn,
  signUp,
  logOut,
  googleSignIn,
});

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // 🔹 Check Firestore profile
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const profileData = userSnap.data();

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName:
              firebaseUser.displayName ||
              profileData.displayName ||
              "",
            photoURL:
              firebaseUser.photoURL || profileData.photoURL,
            ...profileData,
          });

          setOnboarded(!!profileData.onboarded);
        } else {
          // 🔹 No profile yet → create a "shell" profile in Firestore
          const newProfile = {
            displayName: firebaseUser.displayName || "",
            photoURL: firebaseUser.photoURL || randomAvatar(),
            onboarded: false,
            createdAt: new Date(),
          };

          await setDoc(userRef, newProfile);

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            ...newProfile,
          });
          setOnboarded(false);
        }
      } else {
        setUser(null);
        setOnboarded(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    logIn,
    signUp,
    logOut,
    googleSignIn,
    loading,
    onboarded,
    setOnboarded,
  };

  return (
    <userAuthContext.Provider value={value}>
      {!loading && children}
    </userAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(userAuthContext);
};
