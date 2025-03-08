import { Button } from "../ui/button";
import { DrawerBody, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { useAppSelector } from "@/redux/store";
import { setFilters } from "@/redux/features/filters-slice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export default function Filter() {
  const {accounts, categories} = useAppSelector((state) => (
    {
      accounts: state.budgetReducer.value.accounts, 
      categories: state.budgetReducer.value.categories
    }));
  const filteredByCategories = useAppSelector((state) => state.filtersReducer.value.categoryFilters);
  const filteredByAccounts = useAppSelector((state) => state.filtersReducer.value.accountFilters);
  const reduxDispatch = useDispatch();

  const toggleCategory = (categoryId: string) => {
    if (filteredByCategories.includes(categoryId)) {
      reduxDispatch(setFilters({ 
        categoryFilters: filteredByCategories.filter((cat) => cat != categoryId), 
        accountFilters: filteredByAccounts
      }));
    } else {
      reduxDispatch(setFilters({ categoryFilters: [...filteredByCategories, categoryId], accountFilters: filteredByAccounts}));
    }
  };

  const toggleAccount = (accountId: string) => {
    if (filteredByAccounts.includes(accountId)) {
      reduxDispatch(setFilters({ 
        accountFilters: filteredByAccounts.filter((acc) => acc != accountId), 
        categoryFilters: filteredByCategories
      }));
    } else {
      reduxDispatch(setFilters({ accountFilters: [...filteredByAccounts, accountId], categoryFilters: filteredByCategories}));
    }
  };

  const renderFiltersList = ({
    title,
    setFilters,
    toggleFilter,
    filters
  }: {
    title: string,
    setFilters: string[]
    toggleFilter: (id: string) => void
    filters: { _id: string, name: string}[]
  }) => {
    const [accordionOpen, setAccordionOpen] = useState(false);
    
    return (
    <>
    <Collapsible asChild open={accordionOpen} onOpenChange={setAccordionOpen}>
      <div className="w-full mb-2">
        <CollapsibleTrigger asChild>
          <div className="my-2 w-full flex justify-between items-center">
            <h4 className="text-md font-bold">{title} {setFilters.length > 0 ? `+${setFilters.length}` : ""}</h4>
            <FontAwesomeIcon icon={accordionOpen ? faChevronUp : faChevronDown} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>    
          {filters.map((filter) => {
            return (
              <div
                key={filter._id}
                className="flex justify-between rounded-md p-2 mb-2 last:mb-0 border-b"
              >
                <label>{filter.name}</label>
                <input
                  type="checkbox"
                  checked={setFilters.includes(filter._id)}
                  onChange={() => toggleFilter(filter._id)}
                />
              </div>
            );
          })}
        </CollapsibleContent>
      </div>
    </Collapsible>
    </>);
  };

  const setFiltersCount = filteredByCategories.length + filteredByAccounts.length;

  return (
    <div className="overflow-scroll">
      <DrawerHeader className="flex flex-row w-full justify-between items-center">
        <DrawerTitle className="mb-2">Filter</DrawerTitle>
        <Button variant="outline" className="text-xs" disabled={setFiltersCount === 0} onClick={() => reduxDispatch(setFilters({ categoryFilters: [], accountFilters: []}))}>Deselect All</Button>
      </DrawerHeader>
      <DrawerBody className="flex flex-col w-full">
        {renderFiltersList({title: "Categories", setFilters: filteredByCategories, toggleFilter: toggleCategory, filters: categories})}
        {renderFiltersList({title: "Accounts", setFilters: filteredByAccounts, toggleFilter: toggleAccount, filters: accounts})}
      </DrawerBody>
    </div>
  );
}
