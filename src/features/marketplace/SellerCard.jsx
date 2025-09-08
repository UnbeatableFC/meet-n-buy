import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Link } from "react-router";

export const SellerCard = ({
  seller,
  id,
  isFriend,
  requestPending,
  onSendRequest,
  handleRemoveFriend,
}) => {
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
          {seller.role === "seller" && (
            <>Items Selling: {seller.itemsSelected?.join(", ")}</>
          )}
        </p>
      </CardContent>

      <CardFooter className="p-0 flex flex-row items-center gap-4">
        {isFriend ? (
          <>
            <Button asChild>
              <Link to={`/friends/chats/${id}`}>Message</Link>
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleRemoveFriend()}
            >
              Remove Friend
            </Button>
          </>
        ) : requestPending ? (
          <Button disabled>Request Pending</Button>
        ) : (
          <Button onClick={() => onSendRequest()}>
            Send Request
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
