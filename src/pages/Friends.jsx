import React, { useEffect, useState, useCallback } from "react";
import { useUserAuth } from "../context/userAuthContext";
import { db } from "../firebaseConfig";
import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
} from "../repository/friend.requests";
import { doc, getDoc } from "firebase/firestore";
import { getUsers } from "../repository/onboarded.user";
import { UserCard } from "../features/friends/user-card";
import { FriendRequestCard } from "../features/friends/friend-request-card";
import { Button } from "../components/ui/button";
import { Link } from "react-router"; // ✅ corrected import
import { ArrowRightIcon } from "lucide-react";
import { toIdArray } from "../hooks/idToArray";
import { FriendsCard } from "../features/friends/friends-card";

function FriendsDashboard() {
  const { user } = useUserAuth();
  // eslint-disable-next-line no-unused-vars
  const [currentUserData, setCurrentUserData] = useState(null);
  const [potentialFriends, setPotentialFriends] = useState([]);
  const [requestUsers, setRequestUsers] = useState([]);
  const [friendsData, setFriendsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 main fetch function (reusable)
  const fetchData = useCallback(async () => {
    if (!user?.uid) {
      setCurrentUserData(null);
      setPotentialFriends([]);
      setRequestUsers([]);
      setFriendsData([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Fetch current user
    const currentUserDocRef = doc(db, "users", user.uid);
    const currentUserSnap = await getDoc(currentUserDocRef);
    const currentUser = currentUserSnap.exists()
      ? currentUserSnap.data()
      : null;
    setCurrentUserData(currentUser);

    // Fetch all onboarded users
    const allUsersSnap = await getUsers();
    const users = Array.isArray(allUsersSnap)
      ? allUsersSnap
      : allUsersSnap.docs?.map((d) => ({ id: d.id, ...d.data() })) ??
        [];

    // Exclude self + friends + requests
    const excludeIds = new Set([
      user.uid,
      ...toIdArray(currentUser?.friends),
      ...toIdArray(currentUser?.sentRequests),
      ...toIdArray(currentUser?.friendRequests),
    ]);

    const filteredPotentialFriends = users.filter(
      (u) => !excludeIds.has(u.id)
    );
    setPotentialFriends(filteredPotentialFriends);

    // Fetch received requests
    const requestIds = toIdArray(currentUser?.receivedRequests);
    const requestUsersData = await Promise.all(
      requestIds.map(async (id) => {
        const snap = await getDoc(doc(db, "users", id));
        return snap.exists() ? { id, ...snap.data() } : null;
      })
    );
    setRequestUsers(requestUsersData.filter(Boolean));

    // Fetch friends
    const friendIds = toIdArray(currentUser?.friends);
    const friendsDataArr = await Promise.all(
      friendIds.map(async (id) => {
        const snap = await getDoc(doc(db, "users", id));
        return snap.exists() ? { id, ...snap.data() } : null;
      })
    );
    setFriendsData(friendsDataArr.filter(Boolean));

    setLoading(false);
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 🔹 Action handlers now refresh automatically
  const handleSendRequest = async (targetId) => {
    try {
      await sendFriendRequest(user.uid, targetId);
      await fetchData();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleAcceptRequest = async (requesterId) => {
    try {
      await acceptFriendRequest(user.uid, requesterId);
      await fetchData();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleDeclineRequest = async (requesterId) => {
    try {
      await declineFriendRequest(user.uid, requesterId);
      await fetchData();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await removeFriend(user.uid, friendId);
      await fetchData();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user?.uid) return <div>Please log in</div>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-wider mb-3">
        Friends Dashboard
      </h1>
      <div className="flex flex-col gap-5">
        {/* Friends */}
        <section>
          <h2 className="text-2xl font-semibold">Your Friends</h2>
          {friendsData.length > 0 ? (
            friendsData.map((u) => (
              <div key={u.id} className="flex flex-col gap-3">
                <FriendsCard
                  key={u.id}
                  user={u}
                  handleRemoveFriend={handleRemoveFriend}
                />
              </div>
            ))
          ) : (
            <p className="text-md font-serif italic ">
              You have no friends yet
            </p>
          )}
        </section>

        {/* Requests */}
        <section>
          <h2 className="text-2xl font-semibold">
            Incoming Friend Requests
          </h2>
          {requestUsers.length > 0 ? (
            requestUsers.map((u) => (
              <FriendRequestCard
                key={u.id}
                user={u}
                handleAcceptRequest={handleAcceptRequest}
                handleDeclineRequest={handleDeclineRequest}
              />
            ))
          ) : (
            <p className="text-md font-serif italic ">
              No new friend requests
            </p>
          )}
        </section>

        {/* Potential friends */}
        <section className="flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-semibold">
              Send Friend Requests
            </h2>
            <Button variant={"outline"} asChild>
              <Link
                to="/friends/all-users"
                className="flex items-center gap-2"
              >
                <ArrowRightIcon className="w-4 h-4" />
                Show All
              </Link>
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {potentialFriends.length === 0 ? (
              <p className="text-md font-serif italic ">
                No users available
              </p>
            ) : (
              potentialFriends.slice(0, 3).map((u) => (
                <div key={u.id} className="space-y-4 ">
                  <UserCard
                    user={u}
                    handleSendRequest={handleSendRequest}
                  />
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default FriendsDashboard;
