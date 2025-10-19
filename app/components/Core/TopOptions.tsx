import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../ui/button";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import SelectBudget from "../Dashboard/SelectBudget";
import Account from "./Account";
import { useFTBDrawer } from "../ui/ftbDrawer";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

export default function TopOptions ({children} : {children: React.ReactNode}) {
    const { setOpen, setDrawerComponent } = useFTBDrawer();
    
    const DrawerComponents = {
        selectBudget: <SelectBudget />,
        account: <Account />
    }

    const toggleDrawer = (component: keyof typeof DrawerComponents) => {
        setDrawerComponent(DrawerComponents[component])
        setOpen(true);
    }

    return (
        <div className="flex justify-between w-full">
            <Button className="p-2 w-10 h-10 text-center rounded-full" onClick={() => toggleDrawer("account")}><FontAwesomeIcon icon={faUser} /></Button>
            {children}
            <Button className="p-2 w-10 h-10 text-center rounded-full" onClick={() => toggleDrawer("selectBudget")}><FontAwesomeIcon icon={faCalendar} /></Button>
        </div>
    )
}