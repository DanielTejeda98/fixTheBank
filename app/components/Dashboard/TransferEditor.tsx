"use client";

import {
  DrawerBody,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { ReactNode, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { useForm } from "@tanstack/react-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "../ui/field";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Input } from "../ui/input";
import { formatCurrencyInput, formatDateInput } from "@/app/lib/renderHelper";
import { Button } from "../ui/button";
import { useAppSelector } from "@/redux/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createTransfer, updateTransfer } from "@/app/lib/budgetApi";
import { TransferTransaction } from "@/types/budget";
import { TransferDTO, transferSchema } from "./TransferEditorSchema";
import { useFTBDrawer } from "../ui/ftbDrawer";

export default function TransferEditor({
  transaction,
}: {
  transaction?: TransferTransaction;
}) {
  const { setOpen } = useFTBDrawer();
  const [serverError, setServerError] = useState("");
  const dateButtonOnLeft = useAppSelector(
    (state) => state.settingsReducer.value.dateTodayButtonOnLeft
  );
  const savingsAccounts = useAppSelector(
    (state) => state.savingsReducer.value.savingsAccounts
  );

  const renderAccountOptions = (): ReactNode => {
    return savingsAccounts.map((account) => (
      <SelectItem value={account._id} key={account._id}>
        {account.name}
      </SelectItem>
    ));
  };

  const renderBucketOptions = (account: string): ReactNode => {
    return savingsAccounts
      .find((sa) => sa._id === account)
      ?.buckets.map((bkt) => (
        <SelectItem value={bkt._id} key={bkt._id}>
          {bkt.name}
        </SelectItem>
      ));
  };

  const form = useForm({
    defaultValues: {
      type: transaction?.transactionType || "deposit",
      amount: transaction?.amount.toString() || "",
      savingsAccount: transaction?.account || "",
      savingsBucket: transaction?.bucket || "",
      name: transaction?.name || "",
      date: formatDateInput(
        transaction?.date
          ? new Date(
              transaction.date.toString().split("T")[0].replaceAll("-", "/")
            )
          : new Date()
      ),
    },
    validators: {
      onSubmit: transferSchema,
    },
    onSubmit: async ({ value }: { value: TransferDTO }) => {
      try {
        if (transaction) {
          await updateTransfer(transaction._id, value);
          setOpen(false);
          return;
        }
        await createTransfer(value);

        setOpen(false);
      } catch (error) {
        console.log(error);
        setServerError(
          `Failed to create transfer. ${
            (error as Error).message
          }. Please try again or try later.`
        );
      }
    },
  });

  return (
    <form
      id="transfer-editor"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="overflow-scroll"
    >
      <DrawerHeader>
        <DrawerTitle>Transfer</DrawerTitle>
        <DrawerDescription>
          {transaction ? "Edit" : "Create"} a transfer
        </DrawerDescription>
      </DrawerHeader>
      <DrawerBody className="flex flex-col">
        {serverError ? (
          <Card className="w-full mb-2 bg-red-100 border-red-300 text-red-900">
            <CardContent>
              <p className="text-sm">{serverError}</p>
            </CardContent>
          </Card>
        ) : null}

        <FieldGroup>
          <form.Field
            name="type"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <FieldSet>
                  <FieldLegend>Transfer Type</FieldLegend>
                  <FieldDescription>
                    Are you withdrawing or depositing to the account?
                  </FieldDescription>
                  <RadioGroup
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(val) =>
                      field.handleChange(val as "deposit" | "withdraw")
                    }
                    className="flex"
                  >
                    <FieldLabel
                      htmlFor="transfer-editor-form-withdraw"
                      className="w-1/2"
                    >
                      <Field
                        orientation={"horizontal"}
                        data-invalid={isInvalid}
                      >
                        <FieldContent>
                          <FieldTitle>Withdraw</FieldTitle>
                        </FieldContent>
                        <RadioGroupItem
                          value="withdraw"
                          id="transfer-editor-form-withdraw"
                          aria-invalid={isInvalid}
                        />
                      </Field>
                    </FieldLabel>

                    <FieldLabel
                      htmlFor="transfer-editor-form-deposit"
                      className="w-1/2"
                    >
                      <Field
                        orientation={"horizontal"}
                        data-invalid={isInvalid}
                      >
                        <FieldContent>
                          <FieldTitle>Deposit</FieldTitle>
                        </FieldContent>
                        <RadioGroupItem
                          value="deposit"
                          id="transfer-editor-form-deposit"
                          aria-invalid={isInvalid}
                        />
                      </Field>
                    </FieldLabel>
                  </RadioGroup>
                </FieldSet>
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
                  <FieldLabel htmlFor="transfer-editor-amount">
                    Amount
                  </FieldLabel>
                  <Input
                    id="transfer-editor-amount"
                    type="number"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(formatCurrencyInput(e.target.value))
                    }
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="name"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="transfer-editor-name">Name</FieldLabel>
                  <Input
                    id="transfer-editor-name"
                    name={field.name}
                    defaultValue={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="date"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="transfer-editor-date">Date</FieldLabel>
                  <div className="flex w-full gap-2">
                    {dateButtonOnLeft ? (
                      <Button
                        type="button"
                        onClick={(e) =>
                          field.handleChange(formatDateInput(new Date()))
                        }
                      >
                        Today
                      </Button>
                    ) : null}
                    <Input
                      id="transfer-editor-date"
                      name={field.name}
                      type="date"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {!dateButtonOnLeft ? (
                      <Button
                        type="button"
                        onClick={(e) =>
                          field.handleChange(formatDateInput(new Date()))
                        }
                      >
                        Today
                      </Button>
                    ) : null}
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="savingsAccount"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="transfer-editor-savingsAccount">
                    Savings Account
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    disabled={!!transaction}
                  >
                    <SelectTrigger
                      id="transfer-editor-savingsAccount"
                      aria-invalid={isInvalid}
                    >
                      <SelectValue placeholder="Account" />
                    </SelectTrigger>
                    <SelectContent>{renderAccountOptions()}</SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          <form.Field
            name="savingsBucket"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="transfer-editor-savingsBucket">
                    Savings Bucket
                  </FieldLabel>
                  <form.Subscribe
                    selector={(state) => state.values.savingsAccount}
                    children={(account) => (
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        <SelectTrigger
                          id="transfer-editor-savingsBucket"
                          aria-invalid={isInvalid}
                          disabled={!account}
                          aria-disabled={!account}
                        >
                          <SelectValue placeholder="Bucket" />
                        </SelectTrigger>
                        <SelectContent>
                          {renderBucketOptions(account)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>
      </DrawerBody>
      <DrawerFooter className="w-full">
        <div className="flex w-full grow mt-5">
          <div className="flex w-full grow justify-end gap-3">
            <Button
              onClick={() => form.reset()}
              className="rounded-md p-1 self-end min-w-16"
              variant="destructive"
              type="reset"
            >
              Reset
            </Button>
            <Button
              className="rounded-md p-1 self-end min-w-16"
              type="submit"
              form="transfer-editor"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DrawerFooter>
    </form>
  );
}
