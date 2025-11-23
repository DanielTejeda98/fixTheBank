import { ReactElement } from "react";
import ExpenseTransactionCard from "./ExpenseTransactionCard";
import IncomeTransactionCard from "./IcomeTransactionCard";
import { useAppSelector } from "@/redux/store";
import { selectAccounts, selectCategories, selectExpense, selectIncome } from "@/redux/features/budget-slice";

export function useGetMergedTransactionsList() {
  const expenseTransactions = useAppSelector(selectExpense);
  const incomeTransactions = useAppSelector(selectIncome);
  const accounts = useAppSelector(selectAccounts);
  const categories = useAppSelector(selectCategories);
  const transactions = [] as {
    date: Date;
    categoryId: string;
    accountId: string;
    transactionCard: ReactElement;
  }[];

  expenseTransactions.forEach(expense => {
    transactions.push({
      date: expense.transactionDate || expense.date,
      categoryId: expense.category,
      accountId: expense.account,
      transactionCard:
        <ExpenseTransactionCard
          id={expense._id}
          name={expense.description}
          amount={expense.amount}
          accountName={accounts.find(account => account._id === expense.account)?.name || ""}
          categoryName={categories.find(category => category._id === expense.category)?.name || ""}
          date={expense.transactionDate || expense.date}
          isBorrowFromNextMonth={expense.borrowFromNextMonth}
          isGiftTransaction={expense.giftTransaction}
          isSplitTransaction={!!expense.splitPaymentMasterId}
          createdById={expense.createdBy._id}
          revealDate={expense.revealGiftDate}
        />
    })
  })

  incomeTransactions.forEach(income => {
    transactions.push({
      date: income.date,
      categoryId: '',
      accountId: '',
      transactionCard:
        <IncomeTransactionCard
          id={income._id}
          name={income.source}
          amount={income.amount}
          date={income.date}
        />
    })
  })

  return transactions;
}