import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig"; // adjust path

export const listenSellersByItem = (item, currentUserId, callback) => {
  const q = query(
    collection(db, "users"),
    where("role", "==", "seller"),
    where("itemsSelected", "array-contains", item)
  );

  // ✅ real-time listener
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const sellers = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((user) => user.id !== currentUserId); // exclude logged-in user

    callback(sellers);
  });

  return unsubscribe; // use this to stop listening when component unmounts
};


export const listenBuyers = ( currentUserId, callback) => {
  const q = query(
    collection(db, "users"),
    where("role", "==", "buyer"),
    
  );

  // ✅ real-time listener
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const buyers = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((user) => user.id !== currentUserId); // exclude logged-in user

    callback(buyers);
  });

  return unsubscribe; // use this to stop listening when component unmounts
};
