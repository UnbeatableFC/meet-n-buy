import React, { useCallback, useEffect, useState } from "react";
import { listenBuyers } from "../repository/marketpalce";
import {
  removeFriend,
  sendFriendRequest,
} from "../repository/friend.requests";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useUserAuth } from "../context/userAuthContext";
import { Button } from "../components/ui/button";
import { Link } from "react-router";
import { ArrowLeftCircle } from "lucide-react";
import { SellerCard } from "../features/marketplace/SellerCard";

const BuyersList = () => {
  const [buyers, setBuyers] = useState([]);
  const [isFriendMap, setIsFriendMap] = useState({}); // map sellerId => boolean
  const [requestPendingMap, setRequestPendingMap] = useState({});

  const { user } = useUserAuth();

  const fetchBuyers = useCallback(async () => {
    if (!user) return;
    const unsubscribe = listenBuyers(user.uid, setBuyers);

    // cleanup on unmount
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    fetchBuyers();
  }, [fetchBuyers]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const currentUserId = auth.currentUser.uid;
    const userRef = doc(db, "users", currentUserId);

    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();

        // Extract all friend and request IDs for quick lookup
        const friendIds = data.friends?.map((f) => f.id) ?? [];
        const sentRequestIds =
          data.sentRequests?.map((r) => r.id) ?? [];

        // Build new maps for all sellers in the list
        const newIsFriendMap = {};
        const newRequestPendingMap = {};

        buyers.forEach((seller) => {
          const sellerId = seller.uid;
          newIsFriendMap[sellerId] = friendIds.includes(sellerId);
          newRequestPendingMap[sellerId] =
            sentRequestIds.includes(sellerId);
        });

        setIsFriendMap(newIsFriendMap);
        setRequestPendingMap(newRequestPendingMap);
      }
    });

    return () => unsubscribe();
  }, [buyers]);

  const handleSendRequest = async (sellerId) => {
    if (!user) return;
    sendFriendRequest(user?.uid, sellerId);
    fetchBuyers();
  };
  const handleRemoveFriend = async (sellerId) => {
    if (!user) return;
    removeFriend(user?.uid, sellerId);
    fetchBuyers();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl uppercase font-bold mb-4">
          Buyers List
        </h2>

        <Link to={"/dashboard"}>
          <Button>
            <ArrowLeftCircle />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {buyers.length === 0 ? (
        <p className="text-gray-500">No buyers available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buyers.map((buyer) => (
            <SellerCard
              key={buyer?.uid}
              seller={buyer}
              id={buyer?.uid}
              isFriend={isFriendMap[buyer.uid] ?? false}
              requestPending={requestPendingMap[buyer.uid] ?? false}
              onSendRequest={() => handleSendRequest(buyer?.uid)}
              handleRemoveFriend={() =>
                handleRemoveFriend(buyer?.uid)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyersList;
