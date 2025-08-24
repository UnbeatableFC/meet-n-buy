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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // if (user) {
      //   console.log("The logged in user state is: ", user.email);

      //   setUser(user || null);

      //   const docRef = doc(db, "users", user.uid);
      //   const snap = await getDoc(docRef);

      //   setOnboarded(snap.exists());
      // } else {
      //   setUser(null);
      //   setOnboarded(null);
      // }
      // setLoading(false);

      if (user) {
        // 🔹 Fetch profile from Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const profileData = userSnap.data();

          console.log(
            "The logged in user state is: ",
            profileData.displayName
          );
          // 🔹 Merge Firebase Auth data + Firestore profile
          setUser({
            uid: user.uid,
            email: user.email,
            displayName:
              user.displayName || userSnap.data().displayName || "",
            photoURL: user.photoURL || userSnap.data().photoURL,
            ...userSnap.data(), // add custom fields like location, role, bio
          });

          setOnboarded(true)
        } else {
          // 🔹 If no profile yet, create one
          const newProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "",
            photoURL: user.photoURL || randomAvatar(),
            location: "",
            role: "buyer",
            bio: "",
            phone: "",
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          await setDoc(userRef, newProfile);
          setUser(newProfile);
          setOnboarded(false)
        }
      } else {
        setUser(null);
        setOnboarded(false);
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
      {!loading && children}
    </userAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(userAuthContext);
};
