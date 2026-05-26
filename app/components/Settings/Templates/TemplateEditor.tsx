"use client";

import { useForm } from "@tanstack/react-form";
import {
  DrawerBody,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../../ui/drawer";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import {
  LucideArrowLeftRight,
  LucideBanknote,
  LucideDollarSign,
  TriangleAlert,
} from "lucide-react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "../../ui/field";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { formatCurrencyInput, formatDateInput } from "@/app/lib/renderHelper";
import { useAppSelector } from "@/redux/store";
import {
  selectAccounts,
  selectCategories,
} from "@/redux/features/budget-slice";
import { CategoryView } from "@/types/budget";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "../../ui/radio-group";
import { Separator } from "../../ui/separator";
import { templateFormSchema, TemplateSchema } from "./TemplateSchema";
import { createTemplate, updateTemplate } from "@/app/lib/budgetApi";
import { Button } from "../../ui/button";
import { useFTBDrawer } from "../../ui/ftbDrawer";
import z from "zod";

export default function TemplateEditor({
  templateId,
}: {
  templateId?: string;
}) {
  const { setOpen } = useFTBDrawer();
  const accounts = useAppSelector(selectAccounts);
  const categories = useAppSelector(selectCategories);
  const savingsAccounts = useAppSelector(
    (state) => state.savingsReducer.value.savingsAccounts,
  );
  const templateData = useAppSelector((state) =>
    state.budgetReducer.value.templates.find((t) => t._id === templateId),
  );

  const template = templateData
    ? ({
        ...templateData,
        ...(templateData.type === "transfer"
          ? { transferSchema: templateData.data }
          : {}),
        ...(templateData.type === "expense"
          ? { expenseSchema: templateData.data }
          : {}),
        ...(templateData.type === "income"
          ? { incomeSchema: templateData.data }
          : {}),
      } as TemplateSchema)
    : undefined;

  const [formRootError, setFormRootError] = useState<string | null>(null);
  const [showRecurringSettings, setShowRecurringSettings] = useState(false);
  const form = useForm({
    validators: {
      onSubmit: (values) => {
        const result = templateFormSchema.safeParse(values.value);
        if (!result.success) {
          return z.treeifyError(result.error);
        }
        return;
      },
    },
    defaultValues: {
      name: template?.name || "",
      description: template?.description || undefined,
      type: template?.type || "",
      transferSchema: template?.transferSchema || undefined,
      expenseSchema: template?.expenseSchema || undefined,
      incomeSchema: template?.incomeSchema || undefined,
      recurringSettings: template?.recurringSettings || undefined,
    },
    onSubmit: async (values) => {
      setFormRootError(null);
      try {
        templateId
          ? await updateTemplate(templateId, values.value)
          : await createTemplate(values.value);
        setOpen(false);
      } catch (error) {
        setFormRootError(
          (error as Error).message ||
            "An error occurred while saving the template. Please try again.",
        );
      }
    },
  });

  const isEdit = !!template;
  const actionPrefix = isEdit ? "Edit" : "Add";

  const renderAccountOptions = () => {
    return accounts.map((account) => (
      <SelectItem key={account._id} value={account._id}>
        {account.name}
      </SelectItem>
    ));
  };

  const renderCategoryOptions = () => {
    return categories.map((category: CategoryView) => (
      <SelectItem key={category._id} value={category._id}>
        {category.name}
      </SelectItem>
    ));
  };

  const renderSavingsAccountOptions = () => {
    return savingsAccounts.map((account) => (
      <SelectItem value={account._id} key={account._id}>
        {account.name}
      </SelectItem>
    ));
  };

  const renderBucketOptions = (account: string) => {
    return savingsAccounts
      .find((sa) => sa._id === account)
      ?.buckets.map((bkt) => (
        <SelectItem value={bkt._id} key={bkt._id}>
          {bkt.name}
        </SelectItem>
      ));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      onReset={() => form.reset()}
      className="flex flex-wrap overflow-scroll"
    >
      <DrawerHeader>
        <DrawerTitle>{actionPrefix} Template</DrawerTitle>
        <DrawerDescription>
          Use this form to {actionPrefix.toLocaleLowerCase()} a template
        </DrawerDescription>
      </DrawerHeader>
      <DrawerBody className="flex-col w-full">
        <ErrorAlert message={formRootError || ""} />
        <div className="flex flex-col gap-2">
          <form.Field
            name="name"
            children={(field) => (
              <Field>
                <FieldLabel>Template Name</FieldLabel>
                <Input
                  placeholder="E.g. Monthly Rent"
                  onChange={(e) => field.handleChange(e.target.value)}
                  value={field.state.value}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name="description"
            children={(field) => (
              <Field>
                <FieldLabel>Template Description</FieldLabel>
                <Textarea
                  placeholder="E.g. Monthly Rent"
                  onChange={(e) => field.handleChange(e.target.value)}
                  value={field.state.value}
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name="type"
            children={(field) => (
              <Field>
                <FieldLabel>Template Type</FieldLabel>
                <Select
                  onValueChange={(value) => field.handleChange(value)}
                  value={field.state.value as string}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">
                      <LucideDollarSign /> Expense
                    </SelectItem>
                    <SelectItem value="income">
                      <LucideBanknote /> Income
                    </SelectItem>
                    <SelectItem value="transfer">
                      <LucideArrowLeftRight /> Transfer
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          />

          <form.Subscribe
            selector={(state) => state.values.type}
            children={(type) => (
              <>
                {type === "expense" && (
                  <>
                    <form.Field
                      name="expenseSchema.amount"
                      children={(field) => (
                        <Field>
                          <FieldLabel>Expense Amount</FieldLabel>
                          <Input
                            type="number"
                            name="amount"
                            value={field.state.value || ""}
                            onChange={(e) =>
                              field.handleChange(
                                formatCurrencyInput(e.target.value),
                              )
                            }
                          />
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      )}
                    />

                    <form.Field
                      name="expenseSchema.account"
                      children={(field) => (
                        <Field>
                          <FieldLabel>From Account</FieldLabel>
                          <Select
                            value={field.state.value as string}
                            onValueChange={(e: string) => field.handleChange(e)}
                            name="account"
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select an account"></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {renderAccountOptions()}
                            </SelectContent>
                          </Select>
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      )}
                    />

                    <form.Field
                      name="expenseSchema.category"
                      children={(field) => (
                        <Field>
                          <FieldLabel>Category</FieldLabel>
                          <Select
                            value={field.state.value as string}
                            onValueChange={(e: string) => field.handleChange(e)}
                            name="category"
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category"></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {renderCategoryOptions()}
                            </SelectContent>
                          </Select>
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      )}
                    />

                    <form.Field
                      name="expenseSchema.description"
                      children={(field) => (
                        <Field>
                          <FieldLabel>Description</FieldLabel>
                          <Input
                            type="text"
                            name="description"
                            value={field.state.value || ""}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      )}
                    />
                  </>
                )}
                {type === "income" && (
                  <>
                    <form.Field
                      name="incomeSchema.amount"
                      children={(field) => (
                        <Field>
                          <FieldLabel>Income Amount</FieldLabel>
                          <Input
                            type="number"
                            name="amount"
                            value={field.state.value || ""}
                            onChange={(e) =>
                              field.handleChange(
                                formatCurrencyInput(e.target.value),
                              )
                            }
                          />
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      )}
                    />

                    <form.Field
                      name="incomeSchema.source"
                      children={(field) => (
                        <Field>
                          <FieldLabel>Source</FieldLabel>
                          <Input
                            type="text"
                            name="source"
                            value={field.state.value || ""}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      )}
                    />
                  </>
                )}
                {type === "transfer" && (
                  <>
                    <form.Field
                      name="transferSchema.type"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;

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
                                field.handleChange(
                                  val as "deposit" | "withdraw",
                                )
                              }
                              className="flex"
                            >
                              <FieldLabel
                                htmlFor="template-editor-form-withdraw"
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
                                    id="template-editor-form-withdraw"
                                    aria-invalid={isInvalid}
                                  />
                                </Field>
                              </FieldLabel>

                              <FieldLabel
                                htmlFor="template-editor-form-deposit"
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
                                    id="template-editor-form-deposit"
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
                      name="transferSchema.amount"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;

                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor="template-editor-amount">
                              Amount
                            </FieldLabel>
                            <Input
                              id="template-editor-amount"
                              type="number"
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(
                                  formatCurrencyInput(e.target.value),
                                )
                              }
                              aria-invalid={isInvalid}
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    />

                    <form.Field
                      name="transferSchema.name"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;

                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor="template-editor-name">
                              Name
                            </FieldLabel>
                            <Input
                              id="template-editor-name"
                              name={field.name}
                              defaultValue={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    />

                    <form.Field
                      name="transferSchema.savingsAccount"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;

                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor="template-editor-savingsAccount">
                              Savings Account
                            </FieldLabel>
                            <Select
                              name={field.name}
                              value={field.state.value}
                              onValueChange={field.handleChange}
                            >
                              <SelectTrigger
                                id="template-editor-savingsAccount"
                                aria-invalid={isInvalid}
                              >
                                <SelectValue placeholder="Account" />
                              </SelectTrigger>
                              <SelectContent>
                                {renderSavingsAccountOptions()}
                              </SelectContent>
                            </Select>
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    />

                    <form.Field
                      name="transferSchema.savingsBucket"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;

                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor="template-editor-savingsBucket">
                              Savings Bucket
                            </FieldLabel>
                            <form.Subscribe
                              selector={(state) =>
                                state.values.transferSchema?.savingsAccount
                              }
                              children={(account) => (
                                <Select
                                  name={field.name}
                                  value={field.state.value}
                                  onValueChange={field.handleChange}
                                >
                                  <SelectTrigger
                                    id="template-editor-savingsBucket"
                                    aria-invalid={isInvalid}
                                    disabled={!account}
                                    aria-disabled={!account}
                                  >
                                    <SelectValue placeholder="Bucket" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {account && renderBucketOptions(account)}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    />
                  </>
                )}
              </>
            )}
          />

          <Separator />
          <h2 className="font-semibold">Recurring Settings</h2>
          <p className="text-muted-foreground text-sm">
            Is this a recurring transaction?
          </p>
          <RadioGroup
            name={"showRecurringSettings"}
            value={showRecurringSettings ? "true" : "false"}
            onValueChange={(val) => setShowRecurringSettings(val === "true")}
            className="flex gap-1"
          >
            <FieldLabel
              htmlFor="template-editor-showRecurringSettings-yes"
              className="w-1/2"
            >
              <Field orientation={"horizontal"}>
                <FieldContent>
                  <FieldTitle>Yes</FieldTitle>
                </FieldContent>
                <RadioGroupItem
                  value="true"
                  id="template-editor-showRecurringSettings-yes"
                />
              </Field>
            </FieldLabel>

            <FieldLabel
              htmlFor="template-editor-showRecurringSettings-no"
              className="w-1/2"
            >
              <Field orientation={"horizontal"}>
                <FieldContent>
                  <FieldTitle>No</FieldTitle>
                </FieldContent>
                <RadioGroupItem
                  value="false"
                  id="template-editor-showRecurringSettings-no"
                />
              </Field>
            </FieldLabel>
          </RadioGroup>
          {showRecurringSettings && (
            <>
              <form.Field
                name="recurringSettings.frequency"
                children={(field) => (
                  <Field>
                    <FieldLabel>Frequency</FieldLabel>
                    <Select
                      onValueChange={(value) =>
                        field.handleChange(
                          value as
                            | "daily"
                            | "weekly"
                            | "biweekly"
                            | "monthly"
                            | "yearly",
                        )
                      }
                      value={field.state.value as string}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Biweekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              <form.Field
                name="recurringSettings.endCondition"
                children={(field) => (
                  <Field>
                    <FieldLabel>End Condition</FieldLabel>
                    <Select
                      onValueChange={(value) =>
                        field.handleChange(
                          value as "never" | "afterOccurrences" | "onDate",
                        )
                      }
                      value={field.state.value as string}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an end condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="afterOccurrences">
                          After a number of occurrences
                        </SelectItem>
                        <SelectItem value="onDate">
                          On a specific date
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              <form.Subscribe
                selector={(state) =>
                  state.values.recurringSettings?.endCondition
                }
                children={(endCondition) => {
                  switch (endCondition) {
                    case "afterOccurrences":
                      return (
                        <form.Field
                          name="recurringSettings.occurrences"
                          children={(field) => (
                            <Field>
                              <FieldLabel>Number of Occurrences</FieldLabel>
                              <Input
                                type="number"
                                min="1"
                                onChange={(e) =>
                                  field.handleChange(Number(e.target.value))
                                }
                                value={field.state.value}
                              />
                            </Field>
                          )}
                        />
                      );
                    case "onDate":
                      return (
                        <form.Field
                          name="recurringSettings.endDate"
                          children={(field) => (
                            <Field>
                              <FieldLabel>End Date</FieldLabel>
                              <Input
                                type="date"
                                onChange={(e) =>
                                  field.handleChange(new Date(e.target.value))
                                }
                                value={formatDateInput(
                                  field.state.value as Date,
                                )}
                              />
                            </Field>
                          )}
                        />
                      );
                  }
                }}
              />
            </>
          )}
        </div>
      </DrawerBody>
      <DrawerFooter className="w-full">
        <form.Subscribe
          selector={(state) => [state.isSubmitting]}
          children={([isSubmitting]) => (
            <div className="flex justify-end gap-3 w-full mt-5">
              <Button
                type="reset"
                variant="destructive"
                className="rounded-md p-1 min-w-16"
                disabled={isSubmitting}
              >
                Clear
              </Button>
              <Button
                type="submit"
                className="rounded-md p-1 min-w-16"
                disabled={isSubmitting}
              >
                {actionPrefix} Template
              </Button>
            </div>
          )}
        />
      </DrawerFooter>
    </form>
  );
}

function ErrorAlert({ message }: { message: string }) {
  if (!message) return null;
  return (
    <Alert variant={"destructive"} className="mb-2">
      <TriangleAlert />
      <AlertTitle>An error occurred</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
