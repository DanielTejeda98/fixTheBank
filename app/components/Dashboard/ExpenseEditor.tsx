import { FormEvent, useEffect, useReducer, useState } from "react";
import { createExpense, createReceiptImage, createSplitExpense, getBudget, updateExpense } from "@/app/lib/budgetApi";
import { setBudget } from "@/redux/features/budget-slice";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { AccountView, CategoryView } from "@/types/budget";
import useReactValidator from "@/app/hooks/useReactValidator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { formatDateInput } from "@/app/lib/renderHelper";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useAppSelector } from "@/redux/store";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { Card, CardContent } from "../ui/card";
import { Switch } from "../ui/switch";
import { useFTBDrawer } from "../ui/ftbDrawer";
import { DrawerBody, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";
import Link from "next/link";

interface FormData {
    amount?: number
    account?: string
    category?: string
    date?: string
    description?: string
    borrowFromNextMonth?: boolean
    giftTransaction?: boolean
    revealGiftDate?: string
    splitPayments?: boolean
    numberOfPayments?: number
    receiptImage?: string
    receiptImageSrc?: string
}

const getIntitalFormData = (accounts: AccountView[], categories: CategoryView[], transaction?: any): FormData => {
    if (transaction) {
        return {
            amount: transaction.amount,
            account: accounts.find(acc => acc._id === transaction.account)?._id || accounts[0]?._id || "",
            category: categories.find(cat => cat._id === transaction.category)?._id || categories[0]?._id || "",
            date: formatDateInput(new Date(transaction.transactionDate.split("T")[0].replaceAll("-", "/") || transaction.date.split("T")[0].replaceAll("-", "/"))),
            description: transaction.description,
            borrowFromNextMonth: !transaction.transactionDate ? false : new Date(transaction.transactionDate) < new Date(transaction.date),
            giftTransaction: transaction.giftTransaction || false,
            revealGiftDate: transaction.revealGiftDate ? formatDateInput(new Date(transaction.revealGiftDate.split("T")[0].replaceAll("-", "/"))) : "",
            splitPayments: !!transaction.splitPaymentMasterId || false,
            numberOfPayments: transaction.splitPaymentsMonths || 0,
            receiptImage: transaction.receiptImage,
            receiptImageSrc: ""
        }
    }

    return {
        amount: undefined,
        account: accounts?.length > 0 ? accounts[0]._id : "",
        category: categories?.length > 0 ? categories[0]._id : "",
        date: "",
        description: "",
        borrowFromNextMonth: false,
        giftTransaction: false,
        revealGiftDate: "",
        splitPayments: false,
        numberOfPayments: 0,
        receiptImage: "",
        receiptImageSrc: ""
    }
}

export default function ExpenseEditor({ budgetId, accounts, categories, transaction }: { budgetId: string, accounts: AccountView[], categories: CategoryView[], transaction?: any }) {
    const { setOpen: setOpenDrawer } = useFTBDrawer();
    const userId = useSession().data?.user?.id;
    const validator = useReactValidator();
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const reduxDispatch = useDispatch();
    const dateButtonOnLeft = useAppSelector((state) => state.settingsReducer.value.dateTodayButtonOnLeft);
    const [formRootError, setFormRootError] = useState<string | null>(null); // For errors not tied to a specific field
    const [furtherOptionsOpen, setFurtherOptionsOpen] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [formData, dispatch] = useReducer((state: FormData, action: FormData): FormData => {
        return { ...state, ...action }
    }, {...getIntitalFormData(accounts, categories, transaction)})

    // Handles the drawer opening and closing between edit and non edit states
    useEffect(() => {
        dispatch({...getIntitalFormData(accounts, categories, transaction)});
    }, [transaction, accounts, categories])
    
    const clearForm = () => {
        dispatch({
            amount: undefined,
            account: accounts?.length > 0 ? accounts[0]._id : "",
            category: categories?.length > 0 ? categories[0]._id : "",
            date: "",
            description: "",
            borrowFromNextMonth: false,
            receiptImage: "",
            receiptImageSrc: ""
        })
        validator.current.hideMessages();
    }

    const handleReceiptImageUpload = async (image?: File | null) => {
        if (!image) {
            return;
        }
        try {
            setIsImageUploading(true);
            const res = await createReceiptImage({}, image, budgetId)
            dispatch({ receiptImage: res.message });
        } catch (error: unknown) {
            console.error("Error uploading image:", error);
            setFormRootError(`Failed to upload image. ${(error as Error).message}. Please try again or try later.`);
        } finally {
            setIsImageUploading(false);
        }
    }

    const formSubmit = async (form: FormEvent) => {
        form.preventDefault();

        if (!validator.current.allValid()) {
            validator.current.showMessages();
            forceUpdate();
            return;
        }

        try {
            if (!isEdit) {
                if (formData.splitPayments) {
                    await createSplitExpense({ userId }, {...formData, budgetId });
                } else {
                    await createExpense({ userId }, { ...formData, budgetId });
                }
            } else {
                await updateExpense({ userId }, { ...formData, id: transaction._id});
            }
        } catch (error) {
            setFormRootError(`Failed to create expense. ${(error as Error).message}. Please try again or try later.`);
            return;
        }

        try {
            const budgetDate = sessionStorage.getItem("selectedBudgetDate") || '';
            const res = await getBudget({ userId }, budgetDate)
            // Set store values
            reduxDispatch(setBudget(res.data));
            setOpenDrawer(false);
            clearForm();
        } catch (error) {
            setFormRootError(`Failed to refresh budget data. ${(error as Error).message}. Please refresh the page manually.`);
        }
    }

    const renderAccountOptions = () => {
        return accounts.map(account => <SelectItem key={account._id} value={account._id}>{account.name}</SelectItem>)
    }

    const renderCategoryOptions = () => {
        return categories.map((category: CategoryView) => <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>)
    }

    const isEdit = !!transaction;
    const actionPrefix = isEdit ? "Edit" : "Add"
    const receiptLabel = isEdit && formData.receiptImage ? "Update Receipt Image" : "Add Receipt Image"

    return (
        <form onSubmit={formSubmit} onReset={clearForm} className="flex flex-wrap overflow-scroll">
            <DrawerHeader>
                <DrawerTitle>{actionPrefix} Expense</DrawerTitle>
                <DrawerDescription>{actionPrefix} an expense</DrawerDescription>
            </DrawerHeader>
            <DrawerBody className="flex-col w-full">
                {formRootError ? 
                    <Card className="w-full mb-2 bg-red-100 border-red-300 text-red-900">
                        <CardContent>
                            <p className="text-sm">{formRootError}</p>
                        </CardContent>
                    </Card> : null}
                <div className="mt-2 w-full">
                    <Label htmlFor="receipt">{ receiptLabel }</Label>
                    {isEdit && transaction.receiptImage && <Link href={`/api/images/${budgetId}/${transaction.receiptImage}`} target="_blank"><Button type="button" variant={"outline"}>View receipt image</Button></Link>}
                    <Input className={"mt-1"} type="file" accept=".jpeg,.jpg,.png" name="receipt" onChange={e => handleReceiptImageUpload(e.target.files?.item(0))} disabled={isImageUploading} />
                </div>

                <div className="mt-2 w-full">
                    <Label htmlFor="amount">Amount</Label>
                    <Input type="number" name="amount" value={formData.amount || ""} onChange={e => dispatch({ amount: Number(e.target.value) })} />
                    {validator.current.message("amount", formData.amount, "numeric|required")}
                </div>

                <div className="mt-2 w-full">
                    <Label htmlFor="account">Account</Label>
                    <Select value={formData.account} onValueChange={(e: string) => dispatch({ account: e})} name="account">
                        <SelectTrigger>
                            <SelectValue placeholder="Select an account"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {renderAccountOptions()}
                        </SelectContent>
                    </Select>
                    {validator.current.message("account", formData.account, "required")}
                </div>

                <div className="mt-2 w-full">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(e: string) => dispatch({ category: e})} name="category">
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {renderCategoryOptions()}
                        </SelectContent>
                    </Select>
                    {validator.current.message("category", formData.category, "required")}
                </div>

                <div className="mt-2 w-full">
                    <Label htmlFor="date">Date</Label>
                    <div className="flex w-full gap-2 mt-1">
                        { dateButtonOnLeft ? <Button type="button" onClick={e => dispatch({date: formatDateInput(new Date())})}>Today</Button> : null }
                        <Input type="date" name="date" value={formData.date} onChange={e => dispatch({date: e.target.value})}/>
                        { !dateButtonOnLeft ? <Button type="button" onClick={e => dispatch({date: formatDateInput(new Date())})}>Today</Button> : null }
                    </div>
                    {validator.current.message("date", formData.date, "required")}
                </div>

                <div className="mt-2 w-full">
                    <Label htmlFor="description">Description</Label>
                    <Input type="text" name="description" value={formData.description} onChange={e => dispatch({ description: e.target.value })} />
                    {validator.current.message("description", formData.description, "required")}
                </div>

                {formData.giftTransaction ?
                    <div className="mt-2 w-full">
                        <Label htmlFor="revealGiftDate">Hide transaction until</Label>
                        <Input type="date" name="revealGiftDate" value={formData.revealGiftDate} onChange={e => dispatch({revealGiftDate: e.target.value})}/>
                        {validator.current.message("revealGiftDate", formData.revealGiftDate, "required")}
                    </div>
                : null}

                {formData.splitPayments ?
                    <div className="mt-2 w-full">
                        <Label htmlFor="numberOfPayments">Split for how many months?</Label>
                        <Input type="number" name="numberOfPayments" value={formData.numberOfPayments || ""} onChange={e => dispatch({ numberOfPayments: Number(e.target.value) })} />
                        {validator.current.message("numberOfPayments", formData.numberOfPayments, "numeric|required")}
                    </div>
                : null}
                
                <Collapsible asChild open={furtherOptionsOpen} onOpenChange={setFurtherOptionsOpen}>
                    <div className="w-full mb-2">
                        <CollapsibleTrigger asChild>
                            <div className="my-2 w-full flex justify-between items-center">
                                <h4 className="text-md font-bold">Further options</h4>
                                <FontAwesomeIcon icon={furtherOptionsOpen ? faChevronUp : faChevronDown} />
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <Card>
                                <CardContent>
                                <div className="flex items-center mt-2">
                                    <div>
                                        <p className="text-sm font-medium">Borrow from next month</p>
                                        <p className="text-sm text-muted-foreground">Use this option to count this expense towards next months budget.</p>
                                    </div>
                                    <Switch checked={formData.borrowFromNextMonth} onCheckedChange={() => dispatch({ borrowFromNextMonth: !formData.borrowFromNextMonth })} />
                                </div>

                                <div className="flex items-center mt-2">
                                    <div>
                                        <p className="text-sm font-medium">Gift Transaction?</p>
                                        <p className="text-sm text-muted-foreground">Use this option to make this a gift transaction.</p>
                                    </div>
                                    <Switch checked={formData.giftTransaction} onCheckedChange={() => dispatch({ giftTransaction: !formData.giftTransaction })} />
                                </div>

                                <div className="flex items-center mt-2">
                                    <div>
                                        <p className="text-sm font-medium">Split Payments</p>
                                        <p className="text-sm text-muted-foreground">Use this option to automatically split payments to upcoming months.</p>
                                    </div>
                                    <Switch checked={formData.splitPayments} onCheckedChange={() => dispatch({ splitPayments: !formData.splitPayments })} />
                                </div>
                                </CardContent>
                            </Card>
                        </CollapsibleContent>
                    </div>
                </Collapsible>
            </DrawerBody>
            
            <DrawerFooter className="w-full">
                <div className="flex justify-end gap-3 w-full mt-5">
                    <Button type="reset" variant="destructive" className="rounded-md p-1 min-w-16" disabled={isImageUploading}>Clear</Button>
                    <Button type="submit" className="rounded-md p-1 min-w-16" disabled={isImageUploading}>{actionPrefix} Expense</Button>
                </div>
            </DrawerFooter>
        </form>
    )
}