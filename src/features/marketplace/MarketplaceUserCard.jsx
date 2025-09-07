import { useEffect, useState } from "react";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
// adjust path
import { doc, onSnapshot } from "firebase/firestore";
import { useUserAuth } from "../../context/userAuthContext";
import { db } from "../../firebaseConfig";
import {
  removeFriend,
  sendFriendRequest,
} from "../../repository/friend.requests";
import { listenSellersByItem } from "../../repository/marketpalce";
import { Link } from "react-router";
import { Button } from "../../components/ui/button";
import { ArrowLeftCircle } from "lucide-react";
// assuming you have auth context

const SellersList = ({ item }) => {
  const [sellers, setSellers] = useState([]);
 
  const { user } = useUserAuth(); // current logged-in user

  useEffect(() => {
    const fetchSellers = async () => {
      if (!item || !user) return;
      const unsubscribe = listenSellersByItem(
        item,
        user.uid,
        setSellers
      );

      // cleanup on unmount
      return () => unsubscribe();
    };
    fetchSellers();
  }, [item, user]);

  const handleSendRequest = async (seller) => {
    if (!user) return;
    sendFriendRequest(user?.uid, seller?.uid);
    alert("clicked");
  };
  const handleRemoveFriend = async (seller) => {
    if (!user) return;
    removeFriend(user?.uid, seller?.uid);
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
              key={seller.id}
              seller={seller}
              currentUserId={user?.uid}
              onSendRequest={handleSendRequest}
              handleRemoveFriend={handleRemoveFriend}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SellerCard = ({
  seller,
  currentUserId,
  onSendRequest,
  handleRemoveFriend,
}) => {
  const [isFriend, setIsFriend] = useState(false);
   const [requestPending, setRequestPending] = useState(false);

useEffect(() => {
  if (!currentUserId) return;

  const userRef = doc(db, "users", currentUserId);

  const unsubscribe = onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      setIsFriend(data.friends?.includes(seller.uid));
      setRequestPending(data.sentRequests?.includes(seller.uid));
    }
  });

  return () => unsubscribe();
}, [currentUserId, seller.uid]);

  return (
    <Card className="flex flex-col items-center p-4">
      <CardHeader className="flex flex-col items-center">
        <Avatar className="w-20 h-20 mb-3">
          <AvatarImage
            src={seller.photoURL || ""}
            alt={seller.displayName}
          />
          <AvatarFallback>
            {seller.displayName?.charAt(0).toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-bold">{seller.displayName}</h3>
        <p className="text-base text-muted-foreground capitalize">
          {seller.role}
        </p>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-center text-gray-600">
          Items Selling: {seller.itemsSelected?.join(", ")}
        </p>
      </CardContent>

      <CardFooter className="p-0 flex flex-row items-center gap-4">
        {isFriend ? (
          <>
            <Button asChild>
              <Link to={`/friends/chats/${seller.uid}`}>Message</Link>
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleRemoveFriend(seller)}
            >
              Remove Friend
            </Button>
          </>
        ) : requestPending ? (
          <Button disabled>Request Pending</Button>
        ) : (
          <Button onClick={() => onSendRequest(seller)}>
            Send Request
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SellersList;
