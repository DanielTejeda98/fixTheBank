import { currencyFormat } from "@/app/lib/renderHelper";
import { Button } from "../ui/button";
import { useFTBDrawer } from "../ui/ftbDrawer";
import PlannerIncomeEditor from "./PlannerIncomeEditor";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "../ui/item";
import { LucidePencil, LucideTrash } from "lucide-react";
import PlannerIncomeDelete from "./PlannerIncomeDelete";

type PlannerIncomeList = {
  incomeStreams: any[];
};
export default function PlannerIncomeList({
  incomeStreams,
}: PlannerIncomeList) {
  const { setOpen, setDrawerComponent } = useFTBDrawer();

  function addIncomeClick() {
    setDrawerComponent(<PlannerIncomeEditor />);
    setOpen(true);
  }

  function deleteIncomeClick(id: string) {
    setDrawerComponent(<PlannerIncomeDelete incomeSourceId={id} />);
    setOpen(true);
  }

  const renderIncomeStreams = () => {
    return incomeStreams.map((is) => {
      return (
        <Item key={is._id} variant={"outline"}>
          <ItemHeader>
            <ItemTitle>{is.source}</ItemTitle>
          </ItemHeader>
          <ItemContent>
            <p className="text-lg">{currencyFormat(is.amount)}</p>
          </ItemContent>
          <ItemActions>
            <Button
              type="button"
              size="sm"
              aria-label={`Delete income stream: ${is.source}`}
              variant={"destructive"}
              onClick={() => deleteIncomeClick(is._id)}
            >
              <LucideTrash />
            </Button>
            {/* <Button
              type="button"
              size="sm"
              aria-label={`Edit income stream: ${is.source}`}
              variant={"secondary"}
            >
              <LucidePencil />
            </Button> */}
          </ItemActions>
        </Item>
      );
    });
  };

  return (
    <section className="flex flex-wrap m-3 p-3 border rounded-md">
      <div className="flex w-full justify-between mb-1">
        <h2>Planned Income Streams</h2>
        <Button
          onClick={() => {
            addIncomeClick();
          }}
          className="text-xs ml-auto"
        >
          Add Planned Income
        </Button>
      </div>
      {incomeStreams.length ? (
        <ItemGroup className="flex gap-2 w-full">
          {renderIncomeStreams()}
        </ItemGroup>
      ) : (
        <p>No income streams added for this month</p>
      )}
    </section>
  );
}
