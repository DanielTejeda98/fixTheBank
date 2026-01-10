import { useMemo, useState } from "react";
import { Button } from "../../ui/button";
import {
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../../ui/drawer";
import { useFTBDrawer } from "../../ui/ftbDrawer";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../../ui/select";
import Link from "next/link";

function YearSelectorDrawer({
  year,
  startYear,
  onClick,
}: {
  year: string;
  startYear: number;
  onClick: () => void;
}) {
  const [_year, selectedYear] = useState(year);
  const baseYear = startYear;
  const yearsCount = new Date().getFullYear() - baseYear;
  const options = useMemo(() => {
    return Array.from({ length: yearsCount }, (_, i) => {
      {
        const year = baseYear + i;
        return (
          <SelectItem key={year} value={year.toString()}>
            <p>{year}</p>
          </SelectItem>
        );
      }
    });
  }, [baseYear, yearsCount]);
  return (
    <>
      <DrawerHeader>
        <DrawerTitle>Select the year you&apos;d like to see</DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <div className="flex gap-2 flex-wrap w-full">
          <Label htmlFor="year" className="w-full">
            Budget Year
          </Label>
          <Select
            name="year"
            value={_year.toString()}
            onValueChange={(value) => {
              selectedYear(value);
            }}
          >
            <SelectTrigger className="w-full">
              <p>{_year}</p>
            </SelectTrigger>
            <SelectContent>{options}</SelectContent>
          </Select>
        </div>
      </DrawerBody>
      <DrawerFooter>
        <Button asChild>
          <Link href={`/year-in-review?year=${_year}`} onClick={onClick}>
            Select {_year}
          </Link>
        </Button>
      </DrawerFooter>
    </>
  );
}

export default function YearSelector({
  year,
  startYear,
}: {
  year: string;
  startYear: number;
}) {
  const { setOpen, setDrawerComponent } = useFTBDrawer();

  const toggleDrawer = () => {
    setDrawerComponent(
      <YearSelectorDrawer
        year={year}
        startYear={startYear}
        onClick={() => setOpen(false)}
      />
    );
    setOpen(true);
  };

  return (
    <Button variant={"link"} onClick={toggleDrawer}>
      <p className="text-sm">
        {new Date(`1/1/${year}`).toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        })}{" "}
        -{" "}
        {new Date(`12/31/${year}`).toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        })}
      </p>
    </Button>
  );
}
