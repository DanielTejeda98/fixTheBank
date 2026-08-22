import { createPlannedIncome } from "@/app/lib/budgetApi";
import { useAppSelector } from "@/redux/store";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "../ui/button";
import { useFTBDrawer } from "../ui/ftbDrawer";
import {
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { formatCurrencyInput } from "@/app/lib/renderHelper";
import { useForm } from "@tanstack/react-form";
import {
  plannerIncomeEditorSchema,
  type plannerIncomeEditorDTO,
} from "./PlannerIncomeEditorSchema";
import { Card, CardContent } from "../ui/card";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

export default function PlannerIncomeEditor() {
  const [serverError, setServerError] = useState("");
  const { setOpen: setDrawerOpen } = useFTBDrawer();
  const currentMonth = useAppSelector(
    (state) => state.budgetReducer.value.minDate,
  );

  const form = useForm({
    validators: {
      onSubmit: plannerIncomeEditorSchema,
    },
    onSubmit: async ({ value }: { value: plannerIncomeEditorDTO }) => {
      try {
        await createPlannedIncome(currentMonth, {
          ...value,
          amount: value.amount,
        });
        setDrawerOpen(false);
      } catch (error) {
        console.error("Error creating planned income:", error);
        setServerError(
          `Failed to create planned income. ${
            (error as Error).message
          }. Please try again or try later.`,
        );
      }
    },
  });

  return (
    <form
      className="flex flex-col min-h-60"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      onReset={() => form.reset()}
    >
      <DrawerHeader>
        <DrawerTitle>Add Planned Income</DrawerTitle>
      </DrawerHeader>
      <DrawerBody className="flex flex-col w-full">
        {serverError ? (
          <Card className="w-full mb-2 bg-red-100 border-red-300 text-red-900">
            <CardContent>
              <p className="text-sm">{serverError}</p>
            </CardContent>
          </Card>
        ) : null}
        <FieldGroup>
          <form.Field
            name="source"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="planner-editor-source">
                    Source
                  </FieldLabel>
                  <Input
                    id="planner-editor-source"
                    type="text"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                </Field>
              );
            }}
          />

          <form.Field
            name="amount"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="planner-editor-amount">
                    Amount
                  </FieldLabel>
                  <Input
                    id="planner-editor-amount"
                    type="number"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(formatCurrencyInput(e.target.value))
                    }
                    aria-invalid={isInvalid}
                  />
                </Field>
              );
            }}
          />
        </FieldGroup>
      </DrawerBody>
      <DrawerFooter className="w-full">
        <div className="flex w-full grow justify-end gap-2">
          <Button
            variant="destructive"
            className="rounded-md p-1 self-end min-w-16"
            type="reset"
          >
            Reset
          </Button>
          <Button className="rounded-md p-1 self-end min-w-16" type="submit">
            Save
          </Button>
        </div>
      </DrawerFooter>
    </form>
  );
}
