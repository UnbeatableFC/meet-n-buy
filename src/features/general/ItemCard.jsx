import { useNavigate } from "react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ItemCard({ item }) {
  const navigate = useNavigate();

  return (
    <Card className="flex gap-0 flex-row">
      <div className="w-1/2 mx-2">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="size-full object-cover rounded-md"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between py-4">
        <CardHeader className="p-0">
          <CardTitle>{item.title}</CardTitle>
          <CardDescription>{item.description}</CardDescription>
        </CardHeader>
        <CardFooter className="p-0">
          <Button
            onClick={() => navigate(item.linkUrl)}
            className="btn btn-primary"
          >
            Go to page
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
