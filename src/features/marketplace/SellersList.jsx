import { useCallback, useEffect, useState } from "react";
import { useUserAuth } from "../../context/userAuthContext";
import {
  removeFriend,
  sendFriendRequest,
} from "../../repository/friend.requests";
import { listenSellersByItem } from "../../repository/marketpalce";
import { Link } from "react-router";
import { Button } from "../../components/ui/button";
import { ArrowLeftCircle } from "lucide-react";
import { SellerCard } from "./SellerCard";
import { auth, db } from "../../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";

const SellersList = ({ item }) => {
  const [sellers, setSellers] = useState([]);
  const [isFriendMap, setIsFriendMap] = useState({}); // map sellerId => boolean
  const [requestPendingMap, setRequestPendingMap] = useState({});

  const { user } = useUserAuth(); // current logged-in user

  const fetchSellers = useCallback(async () => {
    if (!item || !user) return;
    const unsubscribe = listenSellersByItem(
      item,
      user.uid,
      setSellers
    );

    // cleanup on unmount
    return () => unsubscribe();
  }, [item, user]);

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

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

        sellers.forEach((seller) => {
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
  }, [sellers]);

  const handleSendRequest = async (sellerId) => {
    if (!user) return;
    sendFriendRequest(user?.uid, sellerId);
    fetchSellers();
  };
  const handleRemoveFriend = async (sellerId) => {
    if (!user) return;
    removeFriend(user?.uid, sellerId);
    fetchSellers();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl uppercase font-bold mb-4">
          Sellers with{" "}
          <span className="text-amber-600 italic">{item}</span>
        </h2>

        <Link to={"/marketplace"}>
          <Button>
            <ArrowLeftCircle />
            Back to Market
          </Button>
        </Link>
      </div>

      {sellers.length === 0 ? (
        <p className="text-gray-500">No sellers found with {item}.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellers.map((seller) => (
            <SellerCard
              key={seller?.uid}
              seller={seller}
              id={seller?.uid}
              isFriend={isFriendMap[seller.uid] ?? false}
              requestPending={requestPendingMap[seller.uid] ?? false}
              onSendRequest={() => handleSendRequest(seller?.uid)}
              handleRemoveFriend={() =>
                handleRemoveFriend(seller?.uid)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SellersList;
