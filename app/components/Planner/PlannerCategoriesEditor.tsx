import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function PlannerCategoriesEditor ({categories}: {categories: any[]}) {
    const [addingNewCategory, setAddingNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const handleAddCategoryClick = () => {
        setAddingNewCategory(true);
        // Allows for React to finish rendering the field
        setTimeout(() => {
            const element = document.querySelector('[name="newCategory"]') as HTMLElement;
            console.log(element)
            element?.focus();
        },0)
    }

    const handleAddingCategoryBlur = () => {
        const categoryName = newCategoryName.trim();
        if (categoryName) {
            categories.push({name: categoryName});
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
                <div className="flex justify-between items-center w-full bg-slate-700 rounded-md p-2 mb-2 last:mb-0" key={index}>
                    <p>{category.name}</p>
                    <FontAwesomeIcon icon={faBars} />
                </div>
            )
        })
    }

    return (
        <div className="flex flex-wrap">
            <h2 className="w-full">Planner Categories Editor</h2>
            <button className="ml-auto bg-slate-500 rounded-md p-1" onClick={handleAddCategoryClick}>Add Category</button>
            <div className="border rounded-md w-full my-2 p-2">
                {addingNewCategory ? (
                    <div className="flex justify-between items-center w-full bg-slate-700 rounded-md p-2 mb-2 last:mb-0" data-name="newCategory">
                        <input className="bg-slate-700 w-full" name="newCategory" onBlur={handleAddingCategoryBlur} onChange={(e) => setNewCategoryName(e.target.value)} value={newCategoryName}></input>
                    </div>
                ) : null}
                {renderCategories()}
            </div>
            <button className="ml-auto bg-slate-500 rounded-md p-1">Save Changes</button>
        </div>
    )
}