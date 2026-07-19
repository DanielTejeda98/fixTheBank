import {
  DrawerBody,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/app/components/ui/drawer";
import { useRef, useState } from "react";
import { providers } from "./providers";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  bulkReconcileTransactions,
  deleteExpense,
  deleteIncome,
  markMatchedTransactionsAsReconciled,
} from "@/app/lib/budgetApi";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useAppSelector } from "@/redux/store";
import { BankTransaction } from "@/types/budget";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Badge } from "@/app/components/ui/badge";
import {
  TransactionCard,
  TransactionCardLeftBody,
  TransactionCardProvider,
  TransactionCardRightBody,
  TransactionDescription,
} from "@/app/components/TransactionCard";
import {
  LucideCheck,
  LucideDatabase,
  LucideEdit,
  LucideLandmark,
  LucidePlus,
  LucideTrash,
} from "lucide-react";
import { currencyFormat, formatDateInput } from "@/app/lib/renderHelper";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/app/components/ui/card";
import ExpenseEditor from "@/app/components/Dashboard/ExpenseEditor";
import AddIncome from "@/app/components/Dashboard/AddIncome";
import TransferEditor from "@/app/components/Dashboard/TransferEditor";
import { Switch } from "@/app/components/ui/switch";
import { useFTBDrawer } from "@/app/components/ui/ftbDrawer";

function SelectProvider({
  onSelect,
}: {
  onSelect: (provider: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      {providers.map((provider) => (
        <Button
          key={provider.id}
          variant="outline"
          className="h-full"
          onClick={() => onSelect(provider.id)}
        >
          <img
            src={provider.logoUrl}
            alt={provider.name}
            className={"w-full px-4 min-h-[100px] object-contain"}
          ></img>
        </Button>
      ))}
    </div>
  );
}

function AccountFileUploader({
  accounts,
  selectedAccountId,
  pullIncome,
  setSelectedAccountId,
  setPullIncome,
  uploadedFile,
}: {
  accounts: { _id: string; name: string }[];
  selectedAccountId: string | null;
  pullIncome: boolean;
  setSelectedAccountId: (accountId: string) => void;
  setPullIncome: (state: boolean) => void;
  uploadedFile: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="w-full">
      <div className="mb-4">
        <Label htmlFor="fileUpload">Upload CSV</Label>
        <Input
          id="fileUpload"
          type="file"
          accept=".csv"
          ref={uploadedFile}
          placeholder="Choose a CSV file"
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="accountSelect">Select Account</Label>
        <Select
          onValueChange={(value) => setSelectedAccountId(value)}
          value={selectedAccountId || ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an account" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {accounts.map((account) => (
                <SelectItem key={account._id} value={account._id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4 flex justify-between w-full items-center border rounded-lg p-4">
        <div>
          <p>Compare income transactions?</p>
          <p className="text-sm">
            Use this option to pull income transactions to reconcile with this
            account.
          </p>
        </div>
        <Switch checked={pullIncome} onCheckedChange={setPullIncome}></Switch>
      </div>
    </div>
  );
}

function TransactionReconciler({
  matchedTransactions,
  unmatchedTransactions,
  handleCreateTransaction,
  handleDeleteTransaction,
  handleManualMapTransaction,
}: {
  matchedTransactions: {
    dbTransaction: BankTransaction;
    bankTransaction: BankTransaction;
  }[];
  unmatchedTransactions: (BankTransaction & { isBankTransaction: boolean })[];
  handleCreateTransaction: (transaction: BankTransaction) => void;
  handleDeleteTransaction: (transaction: BankTransaction) => void;
  handleManualMapTransaction: (transaction: BankTransaction) => void;
}) {
  const tabsDefaultValue =
    unmatchedTransactions.length > 0 ? "unmatched" : "matched";

  const unmatchedTransactionsTable = useReactTable({
    data: unmatchedTransactions,
    columns: [
      {
        accessorKey: "isBankTransaction",
      },
      {
        accessorKey: "description",
      },
      {
        accessorKey: "date",
      },
      {
        accessorKey: "amount",
      },
      {
        accessorKey: "type",
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  const matchedTransactionsTable = useReactTable({
    data: matchedTransactions,
    columns: [
      {
        accessorKey: "dbTransaction.description",
      },
      {
        accessorKey: "dbTransaction.date",
      },
      {
        accessorKey: "dbTransaction.amount",
      },
      {
        accessorKey: "bankTransaction.description",
      },
      {
        accessorKey: "bankTransaction.date",
      },
      {
        accessorKey: "bankTransaction.amount",
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="w-full">
      <Tabs defaultValue={tabsDefaultValue} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="unmatched" className="w-full">
            Unmatched{" "}
            <Badge className="ml-2">{unmatchedTransactions.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="matched" className="w-full">
            Matched <Badge className="ml-2">{matchedTransactions.length}</Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="unmatched" className="w-full">
          {unmatchedTransactions.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-[50dvh]">
              {unmatchedTransactionsTable.getRowModel().rows.map((row) => {
                const transaction = row.original;
                const isBankTransaction = transaction.isBankTransaction;
                return (
                  <Card>
                    <CardContent>
                      <TransactionCardProvider>
                        <div className="w-full">
                          <TransactionCard className="w-full border-0 p-0">
                            <TransactionCardLeftBody>
                              <div className="mb-3">
                                <Badge
                                  variant={
                                    isBankTransaction ? "secondary" : "default"
                                  }
                                >
                                  {isBankTransaction ? (
                                    <>
                                      <LucideLandmark className="h-4 w-4" />{" "}
                                      Bank
                                    </>
                                  ) : (
                                    <>
                                      <LucideDatabase className="h-4 w-4" />{" "}
                                      System
                                    </>
                                  )}
                                </Badge>
                              </div>
                              <TransactionDescription>
                                <p className="font-semibold">
                                  {transaction.description}
                                </p>
                              </TransactionDescription>
                              <p className="text-xs">
                                {new Date(transaction.date).toLocaleString(
                                  "en-us",
                                  {
                                    dateStyle: "full",
                                    timeZone: "UTC",
                                  },
                                )}
                              </p>
                            </TransactionCardLeftBody>
                            <TransactionCardRightBody>
                              <p className="text-right text-lg text-red-500">
                                {currencyFormat(transaction.amount || 0)}
                              </p>
                            </TransactionCardRightBody>
                          </TransactionCard>
                        </div>
                      </TransactionCardProvider>
                    </CardContent>
                    <CardFooter>
                      {transaction.isBankTransaction ? (
                        <div className="flex items-center justify-between w-full">
                          <Button type="button">
                            <LucidePlus
                              onClick={() =>
                                handleCreateTransaction(transaction)
                              }
                            />{" "}
                            Create Transaction
                          </Button>
                          <Button variant={"secondary"} type="button">
                            <LucideEdit /> Manual Match
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          {transaction.id && (
                            <Button variant="destructive" type="button">
                              <LucideTrash
                                onClick={() =>
                                  handleDeleteTransaction(transaction)
                                }
                              />{" "}
                              Delete
                            </Button>
                          )}
                          <Button type="button">
                            <LucideEdit /> Manual Match
                          </Button>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p>No unmatched transactions found.</p>
          )}
        </TabsContent>
        <TabsContent value="matched" className="w-full">
          {matchedTransactions.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-[50dvh]">
              {matchedTransactionsTable.getRowModel().rows.map((row) => {
                const { dbTransaction, bankTransaction } = row.original;

                return (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800"
                        >
                          <LucideCheck className="h-4 w-4" />
                          Matched
                        </Badge>
                        <p className="text-sm text-gray-500">
                          {currencyFormat(dbTransaction.amount || 0)} on{" "}
                          {new Date(dbTransaction.date).toLocaleString(
                            "en-us",
                            {
                              dateStyle: "full",
                              timeZone: "UTC",
                            },
                          )}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="border p-2 rounded-sm flex justify-between bg-gray-300">
                          <p>System: {dbTransaction.description}</p>
                        </div>
                        <div className="border p-2 rounded-sm flex justify-between bg-gray-300">
                          <p>Bank: {bankTransaction.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p>No matched transactions found.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function TransactionsUploaderDrawer() {
  const { setOpen } = useFTBDrawer();
  const [formStep, setFormStep] = useState<
    | "selectProvider"
    | "uploadFile"
    | "transactionReconciler"
    | "addChoice"
    | "deleteConfirm"
    | "addExpense"
    | "addIncome"
    | "addTransfer"
    | "manualMap"
  >("selectProvider");
  const [apiBusy, setApiBusy] = useState<boolean>(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null,
  );
  const [pullIncome, setPullIncome] = useState<boolean>(false);
  const [deltaResponse, setDeltaResponse] = useState<{
    matchedTransactions: {
      dbTransaction: BankTransaction;
      bankTransaction: BankTransaction;
    }[];
    unmatchedTransactions: (BankTransaction & { isBankTransaction: boolean })[];
  } | null>(null);
  const uploadedFile = useRef<HTMLInputElement | null>(null);
  const accounts = useAppSelector(
    (state) => state.budgetReducer.value.accounts,
  );
  const budgetId = useAppSelector((state) => state.budgetReducer.value._id);
  const selectedBankTransactionData = useRef<BankTransaction>(null);

  const handleProviderSelect = (provider: string) => {
    // Handle provider selection logic here
    setSelectedProvider(provider);
    setFormStep("uploadFile");
  };

  const handleFileUpload = async () => {
    if (apiBusy) return;
    const file = uploadedFile.current?.files?.[0];
    if (file && selectedProvider && selectedAccountId) {
      const provider = providers.find((p) => p.id === selectedProvider);
      if (provider) {
        try {
          setApiBusy(true);
          const brankTransactions = await provider.csvTransformer(file);
          const res = await bulkReconcileTransactions(
            brankTransactions,
            selectedAccountId,
            pullIncome,
          );
          setDeltaResponse(res);
          setFormStep("transactionReconciler");
        } catch (error) {
          console.log((error as Error).message);
          setFormStep("transactionReconciler");
        } finally {
          setApiBusy(false);
        }
      }
    }
  };

  const handleReconcileMatched = async () => {
    if (!deltaResponse?.matchedTransactions?.length || apiBusy) return;
    setApiBusy(true);
    try {
      await markMatchedTransactionsAsReconciled(
        deltaResponse.matchedTransactions.map((mt) => mt.dbTransaction),
      );
      setOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setApiBusy(false);
    }
  };

  const descriptionText = {
    selectProvider: "Select a provider to upload transactions from",
    uploadFile: "Upload your transactions CSV file",
    transactionReconciler: "Review the reconciled transactions",
    addChoice: "",
    deleteConfirm: "This action cannot be undone.",
  };

  const drawerTitleText = {
    selectProvider: "Select Provider",
    uploadFile: "Upload Transactions CSV",
    transactionReconciler: "Reconcile Transactions",
    addChoice: "Select transaction type",
    deleteConfirm: "Delete transaction?",
  };

  const handleCreateTransaction = (bankTransaction: BankTransaction) => {
    selectedBankTransactionData.current = bankTransaction;
    setFormStep("addChoice");
  };

  const handleDeleteTransactionRequest = async (
    bankTransaction: BankTransaction,
  ) => {
    selectedBankTransactionData.current = bankTransaction;
    setFormStep("deleteConfirm");
  };

  const handleTransactionDelete = async () => {
    if (
      !selectedBankTransactionData.current ||
      !selectedBankTransactionData.current.id
    )
      return;

    try {
      setApiBusy(true);
      if (selectedBankTransactionData.current.type === "expense") {
        await deleteExpense(selectedBankTransactionData.current.id);
      } else if (selectedBankTransactionData.current.type === "income") {
        await deleteIncome(selectedBankTransactionData.current.id);
      }

      if (deltaResponse?.unmatchedTransactions) {
        const indexToClear = deltaResponse.unmatchedTransactions.findIndex(
          (ut) =>
            JSON.stringify(ut) ===
            JSON.stringify(selectedBankTransactionData.current),
        );
        deltaResponse?.unmatchedTransactions.splice(indexToClear, 1);
      }
    } catch (error) {
      throw error;
    } finally {
      setApiBusy(false);
      setFormStep("transactionReconciler");
    }
  };

  const handleTransactionReturn = (
    createdTransaction?: any,
    type?: "expense" | "income",
  ) => {
    if (createdTransaction && deltaResponse?.unmatchedTransactions && type) {
      // Find the unmatched transaction by performing a deep compare
      const indexToClear = deltaResponse.unmatchedTransactions.findIndex(
        (ut) =>
          JSON.stringify(ut) ===
          JSON.stringify(selectedBankTransactionData.current),
      );
      deltaResponse?.unmatchedTransactions.splice(indexToClear, 1);

      deltaResponse.matchedTransactions.push({
        dbTransaction: {
          amount: createdTransaction.amount,
          description: createdTransaction.description,
          date: createdTransaction.transactionDate || createdTransaction.date,
          type,
        },
        bankTransaction: selectedBankTransactionData.current!,
      });
    }
    setFormStep("transactionReconciler");
  };

  switch (formStep) {
    case "addExpense":
      return (
        <ExpenseEditor
          budgetId={budgetId}
          onReturn={handleTransactionReturn}
          transaction={
            selectedBankTransactionData.current
              ? {
                  amount: Math.abs(selectedBankTransactionData.current.amount),
                  description: selectedBankTransactionData.current.description,
                  account: selectedAccountId,
                  transactionDate: new Date(
                    selectedBankTransactionData.current.date,
                  ).toISOString(),
                }
              : null
          }
        />
      );
    case "addIncome":
      return (
        <AddIncome
          budgetId={budgetId}
          onReturn={handleTransactionReturn}
          templateData={
            selectedBankTransactionData.current
              ? {
                  source: selectedBankTransactionData.current.description,
                  amount: selectedBankTransactionData.current.amount,
                  date: formatDateInput(
                    new Date(
                      selectedBankTransactionData.current.date
                        .split("T")[0]
                        .replaceAll("-", "/"),
                    ),
                  ),
                }
              : {}
          }
        />
      );
    case "addTransfer":
      return <TransferEditor />;
    default:
      return (
        <>
          <DrawerHeader>
            <DrawerTitle>
              {drawerTitleText[formStep as keyof typeof drawerTitleText]}
            </DrawerTitle>
            <DrawerDescription>
              {descriptionText[formStep as keyof typeof descriptionText]}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            {formStep === "selectProvider" && (
              <SelectProvider onSelect={handleProviderSelect} />
            )}
            {formStep === "uploadFile" && (
              <AccountFileUploader
                accounts={accounts}
                selectedAccountId={selectedAccountId}
                pullIncome={pullIncome}
                setPullIncome={setPullIncome}
                setSelectedAccountId={setSelectedAccountId}
                uploadedFile={uploadedFile}
              />
            )}
            {formStep === "transactionReconciler" && deltaResponse ? (
              <TransactionReconciler
                handleCreateTransaction={handleCreateTransaction}
                handleDeleteTransaction={handleDeleteTransactionRequest}
                handleManualMapTransaction={() => {}}
                matchedTransactions={deltaResponse.matchedTransactions}
                unmatchedTransactions={deltaResponse.unmatchedTransactions}
              />
            ) : formStep === "transactionReconciler" ? (
              <p>Failed to reconcile transactions.</p>
            ) : null}
            {formStep === "addChoice" && (
              <div className="grid grid-cols-2 w-full gap-2">
                <Button
                  variant={"outline"}
                  type="button"
                  onClick={() => setFormStep("addExpense")}
                  className="text-lg"
                >
                  Expense
                </Button>

                <Button
                  variant={"outline"}
                  type="button"
                  onClick={() => setFormStep("addIncome")}
                  className="text-lg"
                >
                  Income
                </Button>
              </div>
            )}
            {formStep === "deleteConfirm" &&
            selectedBankTransactionData.current ? (
              <TransactionCard className="w-full border-0 p-0">
                <TransactionCardLeftBody>
                  <div className="mb-3">
                    <Badge variant={"default"}>
                      <>
                        <LucideDatabase className="h-4 w-4" /> System
                      </>
                    </Badge>
                  </div>
                  <TransactionDescription>
                    <p className="font-semibold">
                      {selectedBankTransactionData.current.description}
                    </p>
                  </TransactionDescription>
                  <p className="text-xs">
                    {new Date(
                      selectedBankTransactionData.current.date,
                    ).toLocaleString("en-us", {
                      dateStyle: "full",
                      timeZone: "UTC",
                    })}
                  </p>
                </TransactionCardLeftBody>
                <TransactionCardRightBody>
                  <p className="text-right text-lg text-red-500">
                    {currencyFormat(
                      selectedBankTransactionData.current.amount || 0,
                    )}
                  </p>
                </TransactionCardRightBody>
              </TransactionCard>
            ) : null}
          </DrawerBody>
          <DrawerFooter>
            {formStep === "uploadFile" && (
              <Button
                onClick={handleFileUpload}
                disabled={
                  !uploadedFile.current?.files?.[0] ||
                  !selectedProvider ||
                  !selectedAccountId ||
                  apiBusy
                }
              >
                Upload Transactions
              </Button>
            )}
            {formStep === "transactionReconciler" && (
              <Button
                onClick={handleReconcileMatched}
                disabled={!deltaResponse?.matchedTransactions.length || apiBusy}
              >
                Reconcile Matched
              </Button>
            )}
            {formStep === "deleteConfirm" && (
              <div className="flex gap-2 w-full">
                <Button
                  variant={"destructive"}
                  type="button"
                  disabled={!selectedBankTransactionData.current || apiBusy}
                  onClick={handleTransactionDelete}
                >
                  Confirm delete
                </Button>

                <Button variant={"secondary"} type="button">
                  Cancel
                </Button>
              </div>
            )}
          </DrawerFooter>
        </>
      );
  }
}
