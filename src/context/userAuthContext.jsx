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

const logIn = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

const signUp = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

const logOut = () => signOut(auth);

const googleSignIn = () => {
  const googleAuthProvider = new GoogleAuthProvider();
  return signInWithPopup(auth, googleAuthProvider);
};

export const userAuthContext = createContext(null);

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const profileData = userSnap.data();
          console.log(
            "This logged in user is:",
            profileData.email
          );
          setUser({
            uid: user.uid,
            email: user.email,
            displayName:
              profileData.displayName || user.displayName || "",
            photoURL:
              profileData.photoURL || user.photoURL || randomAvatar(),
            ...profileData,
          });
          setOnboarded(!!profileData.onboarded);
        } else {
          // New user - minimal profile with onboarded false
          const newProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "",
            photoURL: user.photoURL || randomAvatar(),
            onboarded: false,
            createdAt: new Date(),
          };
          await setDoc(userRef, newProfile);
          setUser(newProfile);
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
    setOnboarded, // 🔹 call this after onboarding is done
  };

  return (
    <userAuthContext.Provider value={value}>
      {!loading && children}
    </userAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(userAuthContext);
