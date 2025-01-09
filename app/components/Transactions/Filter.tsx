import { CategoryView } from "@/types/budget";
import { Button } from "../ui/button";

type Props = {
  categories: CategoryView[];
  filteredBy: String[];
  setFilteredBy: Function;
  closeDrawer: Function;
};
export default function Filter({
  categories,
  filteredBy,
  setFilteredBy,
  closeDrawer,
}: Props) {
  const toggleCategory = (categoryId: string) => {
    if (filteredBy.includes(categoryId)) {
      setFilteredBy(filteredBy.filter((cat) => cat != categoryId));
    } else {
      setFilteredBy([...filteredBy, categoryId]);
    }
  };

  const renderCategoriesList = () => {
    return categories.map((category) => {
      return (
        <div
          key={category._id}
          className="flex justify-between rounded-md p-2 mb-2 last:mb-0 border-b"
        >
          <label>{category.name}</label>
          <input
            type="checkbox"
            checked={filteredBy.includes(category._id)}
            onChange={() => toggleCategory(category._id)}
          />
        </div>
      );
    });
  };
  return (
    <div>
      <div className="flex w-full justify-between items-center">
        <h2 className="mb-2">Filter</h2>
        <Button variant="outline" className="text-xs" disabled={filteredBy.length === 0} onClick={() => setFilteredBy([])}>Deselect All</Button>
      </div>
      {renderCategoriesList()}
    </div>
  );
}
