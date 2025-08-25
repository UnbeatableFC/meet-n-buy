import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig"; // your initialized Firestore instance

const COLLECTION_NAME = "users";

// SEND FRIEND REQUEST

export const sendFriendRequest = async (currentUserId, targetUserId) => {
  if (currentUserId === targetUserId) throw new Error("Cannot send request to yourself");

  const currentUserRef = doc(db, COLLECTION_NAME, currentUserId);
  const targetUserRef = doc(db, COLLECTION_NAME, targetUserId);

  const [currentUserSnap, targetUserSnap] = await Promise.all([
    getDoc(currentUserRef),
    getDoc(targetUserRef),
  ]);

  if (!targetUserSnap.exists()) throw new Error("Target user not found");

  const currentUserData = currentUserSnap.data() || {};
  const targetUserData = targetUserSnap.data();

  const alreadyFriends = (currentUserData.friends || []).some(f => f.id === targetUserId);
  const alreadyRequested = (currentUserData.sentRequests || []).some(r => r.id === targetUserId);
  const targetHasRequest = (targetUserData.friendRequests || []).some(r => r.id === currentUserId);

  if (alreadyFriends || alreadyRequested || targetHasRequest) {
    throw new Error("Friend request already exists or users are friends");
  }

  const now = Timestamp.now();

  // Update both users atomically
  await Promise.all([
    updateDoc(currentUserRef, {
      sentRequests: arrayUnion({ id: targetUserId, sentAt: now }),
    }),
    updateDoc(targetUserRef, {
      friendRequests: arrayUnion({ id: currentUserId, requestedAt: now }),
    }),
  ]);
};

// DECLINE FRIEND RERQUEST
export const declineFriendRequest = async (currentUserId, requesterId) => {
  const currentUserRef = doc(db, COLLECTION_NAME, currentUserId);
  const requesterRef = doc(db, COLLECTION_NAME, requesterId);

  const [currentUserSnap, requesterSnap] = await Promise.all([
    getDoc(currentUserRef),
    getDoc(requesterRef),
  ]);

  if (!currentUserSnap.exists() || !requesterSnap.exists()) throw new Error("User(s) not found");

  const currentUserData = currentUserSnap.data();
  const requesterData = requesterSnap.data();

  const updatedFriendRequests = (currentUserData.friendRequests || []).filter(
    req => req.id !== requesterId
  );

  const updatedSentRequests = (requesterData.sentRequests || []).filter(
    req => req.id !== currentUserId
  );

  await Promise.all([
    updateDoc(currentUserRef, { friendRequests: updatedFriendRequests }),
    updateDoc(requesterRef, { sentRequests: updatedSentRequests }),
  ]);
};



// ACCEPT FRIEND REQUEST
export const acceptFriendRequest = async (currentUserId, requesterId) => {
  const currentUserRef = doc(db, COLLECTION_NAME, currentUserId);
  const requesterRef = doc(db, COLLECTION_NAME, requesterId);

  const [currentUserSnap, requesterSnap] = await Promise.all([
    getDoc(currentUserRef),
    getDoc(requesterRef),
  ]);

  if (!currentUserSnap.exists() || !requesterSnap.exists()) throw new Error("User(s) not found");

  const currentUserData = currentUserSnap.data();
  const requesterData = requesterSnap.data();

  if (!currentUserData.friendRequests?.some(r => r.id === requesterId))
    throw new Error("No friend request from this user");

  const now = Timestamp.now();

  // Remove from friendRequests and sentRequests
  const updatedFriendRequests = (currentUserData.friendRequests || []).filter(r => r.id !== requesterId);
  const updatedSentRequests = (requesterData.sentRequests || []).filter(r => r.id !== currentUserId);

  // Add to friends with timestamp
  const updatedCurrentFriends = [
    ...(currentUserData.friends || []),
    { id: requesterId, since: now },
  ];
  const updatedRequesterFriends = [
    ...(requesterData.friends || []),
    { id: currentUserId, since: now },
  ];

  await Promise.all([
    updateDoc(currentUserRef, {
      friendRequests: updatedFriendRequests,
      friends: updatedCurrentFriends,
    }),
    updateDoc(requesterRef, {
      sentRequests: updatedSentRequests,
      friends: updatedRequesterFriends,
    }),
  ]);
};


// REMOVE FROM FRIENDS LIST
export const removeFriend = async (currentUserId, friendId) => {
  const currentUserRef = doc(db, COLLECTION_NAME, currentUserId);
  const friendRef = doc(db, COLLECTION_NAME, friendId);

  const [currentUserSnap, friendSnap] = await Promise.all([
    getDoc(currentUserRef),
    getDoc(friendRef),
  ]);

  if (!currentUserSnap.exists() || !friendSnap.exists()) throw new Error("User(s) not found");

  const currentUserData = currentUserSnap.data();
  const friendData = friendSnap.data();

  const updatedCurrentFriends = (currentUserData.friends || []).filter(f => f.id !== friendId);
  const updatedFriendFriends = (friendData.friends || []).filter(f => f.id !== currentUserId);

  await Promise.all([
    updateDoc(currentUserRef, {
      friends: updatedCurrentFriends,
    }),
    updateDoc(friendRef, {
      friends: updatedFriendFriends,
    }),
  ]);
};



// FETCH POTENTIAL FRIENDS (exclude self, current friends, and pending requests)
export const getPotentialFriends = async (currentUserId) => {
  const usersSnapshot = await getDocs(collection(db, COLLECTION_NAME));
  const currentUserDoc = await getDoc(doc(db, COLLECTION_NAME, currentUserId));
  const currentUserData = currentUserDoc.data();

  const excludeIds = new Set([
    currentUserId,
    ...(currentUserData.friends || []),
    ...(currentUserData.friendRequests || []),
  ]);

  const potentialFriends = usersSnapshot.docs
    .filter(doc => !excludeIds.has(doc.id))
    .map(doc => ({ id: doc.id, ...doc.data() }));

  return potentialFriends;
};
