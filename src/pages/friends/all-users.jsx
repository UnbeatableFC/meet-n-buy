import React, { useEffect, useState } from "react"; 
import { doc, getDoc } from "firebase/firestore";

import { Link } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import { useUserAuth } from "../../context/userAuthContext";
import { db } from "../../firebaseConfig";
import { sendFriendRequest } from "../../repository/friend.requests";
import { getUsers } from "../../repository/onboarded.user";
import { UserCard } from "../../features/friends/user-card";
import { Button } from "../../components/ui/button";

function AllUsers() {
  const { user } = useUserAuth();
  const [potentialFriends, setPotentialFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
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
            <ArrowLeftIcon />
            <Link to={"/friends"}>Go Back</Link>
          </Button>
        </div>

        {potentialFriends.length === 0 ? (
          <p>No users available</p>
        ) : (
          potentialFriends.map((user) => (
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
    </div>
  );
}

export default AllUsers;
