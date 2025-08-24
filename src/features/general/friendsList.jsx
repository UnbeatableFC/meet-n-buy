// Dashboard.jsx
import { useEffect, useState } from "react";
// adjust path
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { getUsers } from "../../repository/onboard.user";

export const FriendList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p className="p-4">Loading users...</p>;

  return (
    <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
      {users.length === 0 ? (
        <p>No onboarded users yet.</p>
      ) : (
        users.map((user) => (
          <Card key={user.id} className="shadow-md rounded-2xl">
            <CardContent className="flex items-center gap-4 p-4">
              <Avatar>
                <AvatarImage
                  src={user.photoURL}
                  alt={user.displayName}
                />
                <AvatarFallback>
                  {user.displayName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">
                  {user.displayName || "Unnamed"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {user.role}
                </p>
                <p className="text-xs text-gray-500">
                  {user.location}
                </p>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
