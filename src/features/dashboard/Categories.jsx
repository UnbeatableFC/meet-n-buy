import { ItemCard } from "../general/ItemCard";
import { items } from "../../lib/constants";

export default function Categories() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {items.slice(0,3).map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
