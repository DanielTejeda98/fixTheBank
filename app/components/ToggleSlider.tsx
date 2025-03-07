import classNames from "classnames"

type ToggleSliderProps = {
    state: boolean,
    name: string,
    id: string,
    onChange: Function,
    label?: string
}

export default function ToggleSlider({ state, name, id, onChange, label }: ToggleSliderProps) {
    const toggleClasses = classNames([
        "relative",
        "ml-2",
        "w-11",
        "h-6",
        "bg-gray",
        "peer-focus:outline-hidden",
        "peer-focus:ring-4",
        "peer-focus:ring-blue-300",
        "dark:peer-focus:ring-blue-800",
        "rounded-full",
        "peer",
        "dark:bg-gray-700",
        "peer-checked:after:translate-x-full",
        "peer-checked:rtl:after:-translate-x-full",
        "peer-checked:after:border-white",
        "after:content-['']",
        "after:absolute",
        "after:top-[2px]",
        "after:start-[2px]",
        "after:bg-white",
        "after:border-gray-300",
        "after:border",
        "after:rounded-full",
        "after:h-5",
        "after:w-5",
        "after:transition-all",
        "dark:border-gray-600",
        "peer-checked:bg-blue-600"
    ])

    const renderLabel = () => {
        if (!label) {
            return null;
        }

        return (
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</span>
        )
    }

    return (
        <label className="inline-flex items-center cursor-pointer">
            {renderLabel()}
            <input type="checkbox" 
                   className="sr-only peer"
                   name={name} 
                   id={id}
                   checked={state} 
                   onChange={() => onChange(!state)} />
            <div className={toggleClasses}></div>
        </label>
    )
}