import { CategoryView } from "@/types/budget"
import PlannerCategoriesCard from "./PlannerCategoryCard"
import { Button } from "../ui/button"
import { useFTBDrawer } from "../ui/ftbDrawer"
import PlannerCategoriesEditor from "./PlannerCategoriesEditor"

type PlannerCategoriesList = {
    categories: CategoryView[]
}

export default function PlannerCategoriesList ({categories}: PlannerCategoriesList) {
    const { setOpen, setDrawerComponent } = useFTBDrawer();

    function editCategoriesClick () {
        setDrawerComponent(<PlannerCategoriesEditor categories={categories} />);
        setOpen(true);
    }

    const mapCategoriesToComponents = (categories: CategoryView[]) => {
        if (!categories.length) {
            return (
                <li>
                    No categories exist yet, create one?
                </li>
            )
        }

        return categories.map((category: CategoryView, index: number) => {
            return (
                <PlannerCategoriesCard key={index} category={category} />
            )
        })
    }

    return (
        <section className="m-3 border rounded-md p-3">
            <div className="flex w-full justify-between items-center">
                <h2 className="mb-2">Planned Categorized Expenses</h2>
                <Button onClick={() => editCategoriesClick()} className="text-xs">Edit Categories</Button>
            </div>
            <ul className="mt-2">
                {mapCategoriesToComponents(categories)}
            </ul>
        </section>
    )
}