import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function UserCard({ user, handleSendRequest }) {
  return (
    <Card className="flex flex-row items-center p-4 space-x-4">
      {/* Avatar */}
      <img
        src={user.photoURL}
        alt={`${user.displayName || "User"} avatar`}
        className="size-12 rounded-full object-cover"
      />

      {/* User Info */}
      <div className="flex flex-row gap-12 w-full items-center px-6">
        <div className="">
          <CardTitle className="text-xl font-semibold text-primary">
            {user.displayName || "No Name"}
          </CardTitle>
          <CardDescription className="uppercase tracking-wider text-sm text-muted-foreground mt-1">
            {user.role}
          </CardDescription>
        </div>

        <div className="flex flex-col flex-1">
          <CardContent className="p-0 text-sm text-muted-foreground space-y-2">
            {user.role === "seller" && (
              <p className="text-gray-700 font-medium">
                Selected Items:{" "}
                <span className="font-normal text-gray-600">
                  {user.itemsSelected}
                </span>
              </p>
            )}
            <p className="text-gray-700 font-medium">
              Location:{" "}
              <span className="font-normal text-gray-600">
                {user.location}
              </span>
            </p>
          </CardContent>
        </div>
      </div>

      {/* Action button */}
      <CardFooter className="p-0">
        <Button onClick={() => handleSendRequest(user.id)}>
          Send Request
        </Button>
      </CardFooter>
    </Card>
  );
}
