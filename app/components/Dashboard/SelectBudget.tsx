import { getBudget } from "@/app/lib/budgetApi";
import { setBudget } from "@/redux/features/budget-slice";
import { useAppSelector } from "@/redux/store";
import { FormEvent, useMemo, useReducer, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import SimpleReactValidator from "simple-react-validator";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { formatDateInput } from "@/app/lib/renderHelper";
import {
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { useFTBDrawer } from "../ui/ftbDrawer";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

const BASE_YEAR = 2020;
const FUTURE_YEARS = 2;
const RENDER_YEARS_COUNT =
  new Date().getFullYear() - BASE_YEAR + FUTURE_YEARS + 1; // +1 to include for the zero index

export default function SelectBudget() {
  const { setOpen: setOpenDrawer } = useFTBDrawer();
  const userId = useSession().data?.user.id;
  const validator = useRef(new SimpleReactValidator());
  const forceUpdate = useReducer((x) => x + 1, 0)[1];
  const reduxDispatch = useDispatch();
  const date = useAppSelector((state) => state.budgetReducer.value.minDate);

  const [budgetDate, setBudgetDate] = useState(date);

  const [selectedMonth, setSelectedMonth] = useState(
    new Date(budgetDate).getMonth()
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date(budgetDate).getFullYear()
  );

  const handleSetToday = () => {
    setDate(new Date());
  };

  const handleSetLastMonth = () => {
    const currentDate = new Date(selectedYear, selectedMonth, 2);
    currentDate.setMonth(currentDate.getMonth() - 1);
    setDate(currentDate);
  };

  const handleSetNextMonth = () => {
    const currentDate = new Date(selectedYear, selectedMonth, 2);
    currentDate.setMonth(currentDate.getMonth() + 1);
    setDate(currentDate);
  };

  const setDate = (date: Date) => {
    setSelectedMonth(date.getMonth());
    setSelectedYear(date.getFullYear());
    // We set the day index to 2 to avoid timezone issues that may cause date to shift back a day
    setBudgetDate(
      formatDateInput(new Date(date.getFullYear(), date.getMonth(), 2))
    );
  };

  const submitBudgetUpdates = async (form: FormEvent) => {
    form.preventDefault();

    if (!validator.current.allValid()) {
      validator.current.showMessages();
      forceUpdate();
      return;
    }

    try {
      const res = await getBudget(budgetDate);
      if (res.success) {
        sessionStorage.setItem("selectedBudgetDate", budgetDate);
        document.cookie = `selectedBudgetDate=${budgetDate}`;
        // Set store values
        reduxDispatch(setBudget(res.data));
      }
    } catch (error) {
      // TODO: display error
      console.log(error);
    }

    setOpenDrawer(false);
  };

  const yearOptions = useMemo(() => {
    return Array.from({ length: RENDER_YEARS_COUNT }, (_, i) => {
      {
        const year = BASE_YEAR + i;
        return (
          <SelectItem key={year} value={year.toString()}>
            <p>{year}</p>
          </SelectItem>
        );
      }
    });
  }, []);

  return (
    <form
      className="flex flex-col w-full overflow-scroll"
      onSubmit={submitBudgetUpdates}
    >
      <DrawerHeader>
        <DrawerTitle>Select the budget month</DrawerTitle>
      </DrawerHeader>
      <DrawerBody className="flex flex-col">
        <div className="flex items-center w-full gap-2">
          <div className="flex w-2/3 gap-2 flex-wrap">
            <Label htmlFor="month" className="w-full">
              Budget Month
            </Label>
            <Select
              name="month"
              value={selectedMonth.toString()}
              onValueChange={(value) => {
                setSelectedMonth(parseInt(value));
                // We set the day index to 2 to avoid timezone issues that may cause date to shift back a day
                setBudgetDate(
                  formatDateInput(new Date(selectedYear, parseInt(value), 2))
                );
              }}
            >
              <SelectTrigger className="w-full">
                <p>
                  {new Date(0, selectedMonth).toLocaleString("en-US", {
                    month: "long",
                  })}
                </p>
              </SelectTrigger>
              <SelectContent>
                {[...Array(12)].map((_, index) => {
                  const monthValue = index.toString();
                  return (
                    <SelectItem key={monthValue} value={monthValue}>
                      <p>
                        {new Date(0, index).toLocaleString("en-US", {
                          month: "long",
                        })}
                      </p>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-1/3 gap-2 flex-wrap">
            <Label htmlFor="year" className="w-full">
              Budget Year
            </Label>
            <Select
              name="year"
              value={selectedYear.toString()}
              onValueChange={(value) => {
                setSelectedYear(parseInt(value));
                // We set the day index to 2 to avoid timezone issues that may cause date to shift back a day
                setBudgetDate(
                  formatDateInput(new Date(parseInt(value), selectedMonth, 2))
                );
              }}
            >
              <SelectTrigger className="w-full">
                <p>{selectedYear}</p>
              </SelectTrigger>
              <SelectContent>{yearOptions}</SelectContent>
            </Select>
          </div>
        </div>
        <Button type="button" onClick={handleSetToday}>
          Today
        </Button>
        <div className="flex w-full gap-2">
          <Button
            type="button"
            onClick={handleSetLastMonth}
            className="w-full"
            variant={"outline"}
          >
            Last Month
          </Button>
          <Button
            type="button"
            onClick={handleSetNextMonth}
            className="w-full"
            variant={"outline"}
          >
            Next Month
          </Button>
        </div>
      </DrawerBody>

      <DrawerFooter className="w-full">
        <div className="flex grow items-end justify-end gap-3 w-full mt-5">
          <Button
            type="reset"
            variant="destructive"
            className="rounded-md p-1 min-w-16"
          >
            Clear
          </Button>
          <Button type="submit" className="rounded-md p-1 min-w-16">
            Confirm
          </Button>
        </div>
      </DrawerFooter>
    </form>
  );
}
