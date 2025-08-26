import { ItemCard } from "../general/ItemCard";
import { items } from "../../lib/constants";

export default function AllCategories() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
