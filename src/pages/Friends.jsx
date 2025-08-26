import React, { useEffect, useState } from "react";
import { useUserAuth } from "../context/userAuthContext"; // your user auth context hook
import { db } from "../firebaseConfig"; // your firestore initialization
import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
} from "../repository/friend.requests"; // your friend API functions
import { doc, getDoc } from "firebase/firestore";
import { getUsers } from "../repository/onboarded.user";
import DashboardLayout from "../features/general/Layout";
import { UserCard } from "../features/friends/user-card";
import { Button } from "../components/ui/button";
import { Link } from "react-router";
import { ArrowRightIcon } from "lucide-react";

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
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-wider">
        Friends Dashboard
      </h1>

      <section className="flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-semibold">
            Send Friend Requests
          </h2>
          <Button>
            <ArrowRightIcon />
            <Link to={"/friends/all-users"}>Show All</Link>
          </Button>
        </div>

        {potentialFriends.length === 0 ? (
          <p>No users available</p>
        ) : (
          potentialFriends.slice(0, 3).map((user) => (
            <div className="space-y-4">
              <UserCard
                key={user.id}
                user={user}
                handleSendRequest={handleSendRequest}
              />
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
              <button onClick={() => handleAcceptRequest(request.id)}>
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
  );
}

export default FriendsDashboard;
