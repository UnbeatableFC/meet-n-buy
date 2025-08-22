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
import { doc, getDoc } from "firebase/firestore";

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
  const [onboarded, setOnboarded] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("The logged in user state is: ", user.email);

        setUser(user);

        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);

        setOnboarded(snap.exists());
      } else {
        setUser(null);
        setOnboarded(null);
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
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
      {children}
    </userAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(userAuthContext);
};
