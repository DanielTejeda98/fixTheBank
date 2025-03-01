import { CategoryView } from "@/types/budget";
import { Button } from "../ui/button";
import { DrawerBody, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { useAppSelector } from "@/redux/store";
import { setFilters } from "@/redux/features/filters-slice";
import { useDispatch } from "react-redux";

type Props = {
  categories: CategoryView[];
};
export default function Filter({
  categories,
}: Props) {
  const filteredBy = useAppSelector((state) => state.filtersReducer.value.categoryFilters);
  const reduxDispatch = useDispatch();

  const toggleCategory = (categoryId: string) => {
    if (filteredBy.includes(categoryId)) {
      reduxDispatch(setFilters({ categoryFilters: filteredBy.filter((cat) => cat != categoryId)}));
    } else {
      reduxDispatch(setFilters({ categoryFilters: [...filteredBy, categoryId]}));
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
    <div className="overflow-scroll">
      <DrawerHeader className="flex flex-row w-full justify-between items-center">
        <DrawerTitle className="mb-2">Filter</DrawerTitle>
        <Button variant="outline" className="text-xs" disabled={filteredBy.length === 0} onClick={() => reduxDispatch(setFilters({ categoryFilters: []}))}>Deselect All</Button>
      </DrawerHeader>
      <DrawerBody className="flex flex-col w-full">
        {renderCategoriesList()}
      </DrawerBody>
    </div>
  );
}
