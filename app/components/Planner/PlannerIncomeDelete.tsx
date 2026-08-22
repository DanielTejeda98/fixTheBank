import { useAppSelector } from "@/redux/store";
import { useState } from "react";
import { Button } from "../ui/button";
import { useFTBDrawer } from "../ui/ftbDrawer";
import {
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { Card, CardContent } from "../ui/card";
import { deletePlannedIncome } from "@/app/lib/budgetApi";

export default function PlannerIncomeDelete({
  incomeSourceId,
}: {
  incomeSourceId: string;
}) {
  const [serverError, setServerError] = useState("");
  const [requestBusy, setRequestBusy] = useState(false);
  const { setOpen: setDrawerOpen } = useFTBDrawer();
  const currentMonth = useAppSelector(
    (state) => state.budgetReducer.value.minDate,
  );

  const handleDeleteClick = async () => {
    try {
      setRequestBusy(true);
      await deletePlannedIncome(currentMonth, incomeSourceId);
      setDrawerOpen(false);
    } catch (error) {
      setServerError(
        `Failed to delete planned income. ${
          (error as Error).message
        }. Please try again or try later.`,
      );
    } finally {
      setRequestBusy(false);
    }
  };

  return (
    <div className="flex flex-col min-h-60">
      <DrawerHeader>
        <DrawerTitle>Delete Planned Income</DrawerTitle>
      </DrawerHeader>
      <DrawerBody className="flex flex-col w-full">
        {serverError ? (
          <Card className="w-full mb-2 bg-red-100 border-red-300 text-red-900">
            <CardContent>
              <p className="text-sm">{serverError}</p>
            </CardContent>
          </Card>
        ) : null}
        <p>Are you sure you want to delete this planned income?</p>
      </DrawerBody>
      <DrawerFooter className="w-full">
        <div className="flex w-full grow justify-end gap-2">
          <Button
            variant="destructive"
            className="rounded-md p-1 self-end min-w-16"
            type="button"
            disabled={requestBusy}
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
          <Button
            className="rounded-md p-1 self-end min-w-16"
            type="button"
            onClick={() => setDrawerOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </DrawerFooter>
    </div>
  );
}
