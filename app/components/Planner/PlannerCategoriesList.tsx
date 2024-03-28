import { CategoryView } from "@/types/budget"
import PlannerCategoriesCard from "./PlannerCategoryCard"

type PlannerCategoriesList = {
    categories: CategoryView[],
    editCategoriesClick: Function,
    cardOnClick: Function
}

export default function PlannerCategoriesList ({categories, editCategoriesClick, cardOnClick}: PlannerCategoriesList) {
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
                <PlannerCategoriesCard key={index} category={category} onClick={cardOnClick}/>
            )
        })
    }

    return (
        <section className="m-3">
            <div className="flex w-full justify-between">
                <h2 className="mb-2">Planned Categorized Expenses</h2>
                <button onClick={() => editCategoriesClick()} className="text-xs">Edit Categories</button>
            </div>
            <ul>
                {mapCategoriesToComponents(categories)}
            </ul>
        </section>
    )
}