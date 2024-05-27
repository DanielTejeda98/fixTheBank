import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleTrigger } from "../ui/collapsible";
import { useState } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PlannerSavingsList ({openSavingsPlanner}: {openSavingsPlanner: () => void}) {
    const [isOpened, setIsOpened] = useState(true)
    return (
        <Collapsible asChild open={isOpened} onOpenChange={setIsOpened}>
            <section className="m-3 p-3 border rounded-md">
                <CollapsibleTrigger asChild>
                    <div className="flex justify-between items-center w-full mb-2">
                        <h2>Plan Savings</h2>
                        <FontAwesomeIcon icon={isOpened ? faChevronUp : faChevronDown} />
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="flex flex-wrap w-full">
                        <ul className="w-full">
                            <li className="flex flex-col items-center mb-2 p-2 gap-2 border rounded-md text-sm">Some savings!</li>
                        </ul>
                        <Button onClick={() => openSavingsPlanner()} className="ml-auto text-xs">Add new planned savings</Button>
                    </div>
                </CollapsibleContent>
            </section>
        </Collapsible>
    )
}