import { setBudget } from "@/redux/features/budget-slice";
import { store } from "@/redux/store";
import { BudgetShareResponse } from "@/types/BudgetShareResponse";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_FTB_HOST}/api`

const createExpense = async (headers: any, expense: any) => {
    try {
        const res = await fetch(`${API_BASE_URL}/expense`, {
            headers,
            method: "POST",
            body: JSON.stringify(expense)
        })

        if (!res.ok) {
            throw Error (`Error creating expense: ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        throw error;
    }
}

const createSplitExpense = async (headers: any, expense: any) => {
    try {
        const res = await fetch(`${API_BASE_URL}/expense/split`, {
            headers,
            method: "POST",
            body: JSON.stringify(expense)
        })

        if (!res.ok) {
            throw Error (`Error creating split expense: ${res.statusText}`);
        }

        return await res.json();
    }
    catch (error) {
        throw error;
    }
}

export const createReceiptImage = async (headers: any, receiptImage: File, budgetId: string) => {
    try {
        const res = await fetch(`${API_BASE_URL}/images/${budgetId}`, {
            headers: {
                ...headers,
                "Content-Type": receiptImage.type
            },
            method: 'POST',
            body: receiptImage
        })

        if (!res.ok) {
            throw new Error(`Error uploading image: ${res.statusText}`);
        }
    
        return await res.json();;
    } catch (error) {
        throw error;
    }
}

const updateExpense = async (headers: any, expense: any) => {
    const res = await fetch(`${API_BASE_URL}/expense/${expense.id}`, {
        headers,
        method: "PUT",
        body: JSON.stringify(expense)
    })
    return await res.json();
}

const createIncome = async (headers: any, income: any) => {
    const res = await fetch(`${API_BASE_URL}/income`, {
        headers,
        method: "POST",
        body: JSON.stringify(income)
    })
    return await res.json();
}

const getBudget = async (headers: any, budgetDate?: String) => {
    const res = await fetch(`${API_BASE_URL}/budget${budgetDate ? "?budgetDate=" + budgetDate : ""}`, {
        headers
    })
    const parsedData = await res.json()
    localStorage.setItem("budgetData", JSON.stringify({lastFetched: new Date().getTime(), ...parsedData.data}));
    return parsedData;
}

const createBudget = async (headers: any) => {
    const res = await fetch(`${API_BASE_URL}/budget`, {
        headers,
        method: "POST"
    })
    return await res.json()
}

const deleteExpense = async (headers: any, expenseId: string) => {
    const res = await fetch(`${API_BASE_URL}/expense`, {
        headers,
        method: "DELETE",
        body: JSON.stringify({
            expenseId
        })
    })
    const parsedRes = await res.json()
    if (!parsedRes.success) {
        throw Error(parsedRes.error);
    }
    const budgetDate = sessionStorage.getItem("selectedBudgetDate") || '';
    const budgetRes = await getBudget({ userId: headers.userId }, budgetDate)
    store.dispatch(setBudget(budgetRes.data));

    return parsedRes;
}

const deleteIncome = async (headers: any, incomeId: string) => {
    const res = await fetch(`${API_BASE_URL}/income`, {
        headers,
        method: "DELETE",
        body: JSON.stringify({
            incomeId
        })
    })
    const parsedRes = await res.json()
    if (!parsedRes.success) {
        throw Error(parsedRes.error);
    }

    const budgetDate = sessionStorage.getItem("selectedBudgetDate") || '';
    const budgetRes = await getBudget({ userId: headers.userId }, budgetDate)
    store.dispatch(setBudget(budgetRes.data));

    return parsedRes;
}

const toggleBudgetShareSettings = async (): Promise<BudgetShareResponse> => {
    const res = await fetch(`${API_BASE_URL}/budget/share`, {
        method: "POST",
    })
    return await res.json();
}

const requestToJoinBudget = async (headers: any, joinCode: string) => {
    const res = await fetch(`${API_BASE_URL}/budget/join`, {
        headers,
        method: "POST",
        body: JSON.stringify({
            joinCode
        })
    })
    return await res.json();
}

const approveJoinRequest = async (headers: any, budgetId: string, requesterId: string) => {
    const res = await fetch(`${API_BASE_URL}/budget/join/approve`, {
        headers,
        method: "POST",
        body: JSON.stringify({
            budgetId,
            requesterId
        })
    })
    return await res.json();
}

const getRequestersList = async (headers: any, budgetId: string) => {
    const res = await fetch(`${API_BASE_URL}/budget/share/${budgetId}`, {
        headers,
        method: "GET",
    })
    return await res.json();
}

const createPlannedIncome = async (headers: any, monthIndex: String, pIncome: any) => {
    const res = await fetch(`${API_BASE_URL}/budget/planned-income`, {
        headers,
        method: "POST",
        body: JSON.stringify({
            monthIndex,
            newIncomeSource: pIncome
        })
    })

    const parsedRes = await res.json()
    if (!parsedRes.success) {
        throw Error(parsedRes.error);
    }

    const budgetDate = sessionStorage.getItem("selectedBudgetDate") || '';
    const budgetRes = await getBudget({ userId: headers.userId }, budgetDate)
    store.dispatch(setBudget(budgetRes.data));

    return parsedRes;
}

const deletePlannedIncome = async (headers: any, monthIndex: String, incomeSourceId: any) => {
    const res = await fetch(`${API_BASE_URL}/budget/planned-income`, {
        headers,
        method: "DELETE",
        body: JSON.stringify({
            monthIndex,
            incomeSourceId
        })
    })

    const parsedRes = await res.json()
    if (!parsedRes.success) {
        throw Error(parsedRes.error);
    }

    const budgetDate = sessionStorage.getItem("selectedBudgetDate") || '';
    const budgetRes = await getBudget({ userId: headers.userId }, budgetDate)
    store.dispatch(setBudget(budgetRes.data));

    return parsedRes;
}

export {
    createExpense,
    createSplitExpense,
    updateExpense,
    createIncome,
    getBudget,
    createBudget,
    deleteExpense,
    deleteIncome,
    requestToJoinBudget,
    toggleBudgetShareSettings,
    approveJoinRequest,
    getRequestersList,
    createPlannedIncome,
    deletePlannedIncome
}