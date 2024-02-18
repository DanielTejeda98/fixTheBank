"use client"
import { useEffect, useState } from "react";
import { currencyFormat } from "@/app/lib/renderHelper";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faUser } from '@fortawesome/free-solid-svg-icons';
import { selectTransactions, setBudget } from "@/redux/features/budget-slice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store";
import Drawer from "../Drawer";
import AddIncome from "./AddIncome";
import AddExpense from "./AddExpense";
import React from "react";
import TransactionCard from "../TransactionCard";
import SelectBudget from "./SelectBudget";
import Account from "../Account";
import FullSizeCard from "../FullSizeCard";
import { setUser } from "@/redux/features/user-slice";

interface Budget {
    _id: string,
    income: any[],
    expenses: any[],
    categories: string[],
    accounts: string[],
    minDate: string,
    maxDate: string,
    isOwner: boolean,
    isShared: boolean,
    shareCode: string,
    joinRequests: any[]
}

interface User {
    _id: string,
    username: string,
    email: string
}

function useSetInitialStore({budget, user}: {budget: Budget, user: User}) {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setBudget(budget))
        dispatch(setUser(user))
    }, [budget, user, dispatch])
}

export default function DashboardView({budget, user}: {budget: Budget, user: User}) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerComponent, setDrawerComponent] = useState("addIncome");

    useSetInitialStore({ budget, user })

    const budgetMonth = useAppSelector((state) => state.budgetReducer.value.minDate)
    const balance = useAppSelector((state) => state.budgetReducer.value.balance) || 0
    const totalIncome = useAppSelector((state) => state.budgetReducer.value.totalIncome) || 0
    const totalExpenses = useAppSelector((state) => state.budgetReducer.value.totalExpenses) || 0
    const transactions = useAppSelector(selectTransactions).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0,10)

    const DrawerComponents = {
        addIncome: <AddIncome closeDrawer={() => setIsDrawerOpen(false)} budgetId={budget._id}/>,
        addExpense: <AddExpense closeDrawer={() => setIsDrawerOpen(false)} budgetId={budget._id} accounts={budget.accounts} categories={budget.categories} />,
        selectBudget: <SelectBudget closeDrawer={() => setIsDrawerOpen(false)} />,
        account: <Account />
    }

    type ComponentString = "addIncome" | "addExpense" | "selectBudget" | "account"

    const toggleDrawer = (component: ComponentString) => {
        setDrawerComponent(component);
        setIsDrawerOpen(!isDrawerOpen);
    }

    const renderTransactionsList = () => {
        return transactions.map(transaction => {
            let type;
            let account;
            if (transaction.source) {
                type = "income"
                account = ""
            } else {
                type = "expense"
                account = transaction.account
            }
            return <TransactionCard key={transaction._id} id={transaction._id} type={type} account={account} category={transaction.category} amount={transaction.amount} date={transaction.date} />
        })
    }

    return (
        <main>
            <FullSizeCard>
            <div className="flex justify-between">
                    <button className="bg-slate-500 p-2 w-10 h-10 text-center rounded-full" onClick={() => toggleDrawer("account")}><FontAwesomeIcon icon={faUser} /></button>
                    <p>Month: {new Date(budgetMonth).toLocaleDateString("en-us", {month: "long", year: "numeric"})}</p>
                    <button className="bg-slate-500 p-2 w-10 h-10 text-center rounded-full" onClick={() => toggleDrawer("selectBudget")}><FontAwesomeIcon icon={faGear} /></button>
                </div>
                <div className="flex mt-5 pt-5 items-end">
                    <div className="flex flex-wrap grow">
                        <p className="w-full text-sm text-center">Account Balance</p>
                        <p className="w-full text-xl text-center">{currencyFormat(balance)}</p>
                    </div>
                </div>
                <div className="grid grid-flow-col mt-3 gap-2 text-xs">
                    <div className="text-center p-2 bg-slate-500 grow">
                        <p>Total income</p>
                        <p>{currencyFormat(totalIncome)}</p>
                    </div>
                    <div className="text-center p-2 bg-slate-500 grow">
                        <p>Expenses</p>
                        <p>{currencyFormat(totalExpenses)}</p>
                    </div>
                    {/* <div className="text-center p-2 bg-slate-500 grow">
                        <p>Savings</p>
                        <p>$4,500.21</p>
                    </div>
                    <div className="text-center p-2 bg-slate-500 grow">
                        <p>Investment</p>
                        <p>$4,500.21</p>
                    </div> */}
                </div>
                <div className="flex justify-center gap-2 mt-5">
                    <button className="p-2 bg-slate-500 text-sm rounded-full" onClick={() => toggleDrawer("addIncome")}>(+) Add funds</button>
                    <button className="p-2 bg-slate-500 text-sm rounded-full" onClick={() => toggleDrawer("addExpense")}>(-) Add Expense</button>
                </div>
            </FullSizeCard>

            <section className="m-3 p-3">
                <div className="flex justify-between items-end">
                    <h2>Budget Summary</h2>
                    <a href="#" className="text-xs">Manage budget</a>
                </div>
                <div className="grid grid-rows-2 grid-flow-col gap-3 mt-3">
                    <div className="flex items-center p-2 bg-green-800 w-45 gap-2 rounded-md">
                        <div className="rounded-full w-10 h-10 bg-slate-300"></div>
                        <div>
                            <p className="text-xs">Total budget</p>
                            <p>$0.00</p>
                        </div>
                    </div>

                    <div className="flex items-center p-2 bg-slate-800 w-45 gap-2 rounded-md">
                        <div className="rounded-full w-10 h-10 bg-slate-300"></div>
                        <div>
                            <p className="text-xs">Remaining Budget</p>
                            <p>$0.00</p>
                        </div>
                    </div>

                    <div className="flex items-center p-2 bg-red-800 w-45 gap-2 rounded-md">
                        <div className="rounded-full w-10 h-10 bg-slate-300"></div>
                        <div>
                            <p className="text-xs">Budget Spent</p>
                            <p>$0.00</p>
                        </div>
                    </div>

                    <div className="flex items-center p-2 bg-purple-800 w-45 gap-2 rounded-md">
                        <div className="rounded-full w-10 h-10 bg-slate-300"></div>
                        <div>
                            <p className="text-xs">Savings Percentage</p>
                            <p>0%</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="m-3 p-3">
                <div className="flex justify-between items-end">
                    <h2>Transactions</h2>
                    <a href="#" className="text-xs">View all</a>
                </div>

                <div className="grid gap-3 mt-3">
                    {renderTransactionsList()}
                </div>
            </section>
            <Drawer isOpen={isDrawerOpen}
                    closeDrawer={() => setIsDrawerOpen(false)}>
                {DrawerComponents[drawerComponent as keyof typeof DrawerComponents]}
            </Drawer>
        </main>
    )
}