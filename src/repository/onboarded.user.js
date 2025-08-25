import {
  collection,
  query,
  orderBy,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {db} from "../firebaseConfig"

const COLLECTION_NAME = "users"; // replace with your collection name

// Read all users ordered by createdAt desc
export const getUsers = async () => {
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Read a single user by id
export const getUserById = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("No such document!");
  }
};

// Create a new user
export const createUser = async (userData) => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), userData);
  return { id: docRef.id, ...userData };
};

// Update a user by id
export const updateUser = async (id, updatedData) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, updatedData);
  return { id, ...updatedData };
};

// Delete a user by id
export const deleteUser = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
  return { message: "User deleted successfully", id };
};
