import { getBudget } from "@/app/lib/budgetApi";
import { createCategory } from "@/app/lib/categoriesApi";
import { setBudget } from "@/redux/features/budget-slice";
import { useAppSelector } from "@/redux/store";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";

export default function PlannerCategoriesEditor ({categories}: {categories: any[]}) {
    const [addingNewCategory, setAddingNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const budgetId = useAppSelector((state) => state.budgetReducer.value._id);
    const reduxDispatch = useDispatch();
    const userId = useSession().data?.user?.id;
    
    const handleAddCategoryClick = () => {
        setAddingNewCategory(true);
        // Allows for React to finish rendering the field
        setTimeout(() => {
            const element = document.querySelector('[name="newCategory"]') as HTMLElement;
            console.log(element)
            element?.focus();
        },0)
    }

    const handleAddingCategoryBlur = async () => {
        const categoryName = newCategoryName.trim();
        if (categoryName) {
            try {
                await createCategory({userId}, {
                    budgetId,
                    name: newCategoryName
                })
                const budgetDate = sessionStorage.getItem("selectedBudgetDate") || '';
                const res = await getBudget({ userId }, budgetDate)
                // Set store values
                reduxDispatch(setBudget(res.data));
            } catch (error) {
                console.log(error)
            }
            setNewCategoryName("");
        }
        setAddingNewCategory(false);
    }

    const renderCategories = () => {
        if (!categories.length) {
            return (
                <p>No categories :(</p>
            )
        }
        return categories.map((category, index) => {
            return (
                <div className="flex justify-between items-center w-full rounded-md p-2 mb-2 last:mb-0" key={index}>
                    <p>{category.name}</p>
                    <FontAwesomeIcon icon={faBars} />
                </div>
            )
        })
    }

    return (
        <div className="flex flex-wrap">
            <h2 className="w-full">Planner Categories Editor</h2>
            <Button className="ml-auto rounded-md p-1" onClick={handleAddCategoryClick}>Add Category</Button>
            <div className="border rounded-md w-full my-2 p-2">
                {addingNewCategory ? (
                    <div className="flex justify-between items-center w-full rounded-md p-2 mb-2 last:mb-0" data-name="newCategory">
                        <input className="w-full" name="newCategory" onBlur={handleAddingCategoryBlur} onChange={(e) => setNewCategoryName(e.target.value)} value={newCategoryName}></input>
                    </div>
                ) : null}
                {renderCategories()}
            </div>
        </div>
    )
}