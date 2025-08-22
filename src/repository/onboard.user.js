import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const COLLECTION_NAME = "onboarded-users";

export const onboardUser = ({ userInfo }) => {
  return addDoc(collection(db, COLLECTION_NAME, userInfo));
};

export const getUsers = () => {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy("date", "desc")
  );
  return getDocs(q);
};
