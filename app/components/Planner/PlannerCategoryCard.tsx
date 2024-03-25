type PlannerCategoriesCard = {
    category: string,
    onClick?: Function
}
export default function PlannerCategoriesCard ({category, onClick}: PlannerCategoriesCard) {
    return (
        <li className="flex flex-wrap items-center mb-2 p-2 bg-slate-800 gap-2 rounded-md"
            onClick={() => { onClick && onClick(category) } }>
            <div className="w-full">
                {category}
            </div>
            <div className="flex justify-between w-full">
                <div className="text-sm">
                    <p>$0</p>
                </div>
                <div className="text-sm">
                    <p>$100</p>
                </div>
            </div>
            <div className="rounded-full w-full mb-5 h-1 bg-gray-200">
                <div className="h-1 bg-purple-500" style={{width: "75%"}}></div>
            </div>
        </li>
    )
}