import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export const sendMessage = async (
  messageText,
  chatId,
  user1,
  user2
) => {
  const chatRef = doc(db, "chats", chatId);
  console.log("working");

  const user1Doc = await getDoc(doc(db, "users", user1));
  const user2Doc = await getDoc(doc(db, "users", user2));

  console.log(user1Doc, user2Doc);

  const user1Data = user1Doc.data();
  const user2Data = user2Doc.data();

  const chatDoc = await getDoc(chatRef);
  if (!chatDoc.exists()) {
    await setDoc(chatRef, {
      users: [user1Data, user2Data],
      lastMessage: messageText,
      lastMessageTimeStamp: serverTimestamp(),
    });
  } else {
    await updateDoc(chatRef, {
      lastMessage: messageText,
      lastMessageTimeStamp: serverTimestamp(),
    });
  }

  const messagesRef = collection(db, "chats", chatId, "messages");
  await addDoc(messagesRef, {
    text: messageText,
    sender: auth.currentUser.email,
    timeStamp: serverTimestamp(),
  });
};

export const listenForMessages = (chatId, setMessages) => {
  const chatRef = collection(db, "chats", chatId, "messages");
  onSnapshot(chatRef, (snapshot) => {
    const messages = snapshot.docs.map((doc) => doc.data());
    setMessages(messages);
  });
};
