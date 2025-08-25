import React, { useEffect, useState } from "react";
import { useUserAuth } from "../context/userAuthContext"; // your user auth context hook
import { db } from "../firebaseConfig"; // your firestore initialization
import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
} from "../repository/friend.requests"; // your friend API functions
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { getUsers } from "../repository/onboarded.user";
import DashboardLayout from "../features/general/Layout";

function FriendsDashboard() {
  const { user } = useUserAuth();
  const [currentUserData, setCurrentUserData] = useState(null);
  const [potentialFriends, setPotentialFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setCurrentUserData(null);
      setPotentialFriends([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);

      // Fetch user data including friends and requests
      const currentUserDocRef = doc(db, "users", user.uid);
      const currentUserSnap = await getDoc(currentUserDocRef);
      const currentUser = currentUserSnap.exists()
        ? currentUserSnap.data()
        : null;
      setCurrentUserData(currentUser);

      // Fetch all users
      //   const usersSnapshot = await getDocs(collection(db, "users"));
      //   const users = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const users = await getUsers();

      // Build set of excluded IDs: self, friends, sentRequests, friendRequests
      const excludeIds = new Set([
        user.uid,
        ...(currentUser?.friends?.map((f) => f.id) || []),
        ...(currentUser?.sentRequests?.map((r) => r.id) || []),
        ...(currentUser?.friendRequests?.map((r) => r.id) || []),
      ]);

      // Filter users for potential friends
      const filteredPotentialFriends = users.filter(
        (u) => !excludeIds.has(u.id)
      );
      setPotentialFriends(filteredPotentialFriends);

      setLoading(false);
    };

    fetchData();
  }, [user]);

  // Action handlers
  const handleSendRequest = async (targetId) => {
    try {
      await sendFriendRequest(user.uid, targetId);
      alert("Friend request sent!");
      // Optionally refresh data here
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleAcceptRequest = async (requesterId) => {
    try {
      await acceptFriendRequest(user.uid, requesterId);
      alert("Friend request accepted!");
      // Optionally refresh data here
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleDeclineRequest = async (requesterId) => {
    try {
      await declineFriendRequest(user.uid, requesterId);
      alert("Friend request declined!");
      // Optionally refresh data here
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await removeFriend(user.uid, friendId);
      alert("Friend removed");
      // Optionally refresh data here
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user?.uid) return <div>Please log in</div>;

  return (
    <DashboardLayout>
      <div>
        <h1>Friends Dashboard</h1>

        <section>
          <h2>Send Friend Requests</h2>
          {potentialFriends.length === 0 ? (
            <p>No users available</p>
          ) : (
            potentialFriends.map((user) => (
              <div key={user.id}>
                <span>{user.name || "No Name"}</span>{" "}
                <button onClick={() => handleSendRequest(user.id)}>
                  Send Request
                </button>
              </div>
            ))
          )}
        </section>

        <section>
          <h2>Incoming Friend Requests</h2>
          {(currentUserData?.friendRequests?.length || 0) > 0 ? (
            currentUserData.friendRequests.map((request) => (
              <div key={request.id}>
                <span>{request.id}</span>{" "}
                <button
                  onClick={() => handleAcceptRequest(request.id)}
                >
                  Accept
                </button>{" "}
                <button
                  onClick={() => handleDeclineRequest(request.id)}
                >
                  Decline
                </button>
              </div>
            ))
          ) : (
            <p>No new friend requests</p>
          )}
        </section>

        <section>
          <h2>Your Friends</h2>
          {(currentUserData?.friends?.length || 0) > 0 ? (
            currentUserData.friends.map((friend) => (
              <div key={friend.id}>
                <span>{friend.id}</span>{" "}
                <button onClick={() => handleRemoveFriend(friend.id)}>
                  Remove Friend
                </button>
              </div>
            ))
          ) : (
            <p>You have no friends yet</p>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

export default FriendsDashboard;
