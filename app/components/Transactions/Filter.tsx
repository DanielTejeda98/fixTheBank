import { CategoryView } from "@/types/budget";

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
          className="flex justify-between bg-slate-700 rounded-md p-2 mb-2 last:mb-0"
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
      <h2 className="mb-2">Filter</h2>
      {renderCategoriesList()}
    </div>
  );
}
