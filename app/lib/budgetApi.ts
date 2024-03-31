const API_BASE_URL = `${process.env.NEXT_PUBLIC_FTB_HOST}/api`

const createExpense = async (headers: any, expense: any) => {
    const res = await fetch(`${API_BASE_URL}/expense`, {
        headers,
        method: "POST",
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
    return await res.json()
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
    return await res.json();
}

const deleteIncome = async (headers: any, incomeId: string) => {
    const res = await fetch(`${API_BASE_URL}/income`, {
        headers,
        method: "DELETE",
        body: JSON.stringify({
            incomeId
        })
    })
    return await res.json();
}

const toggleBudgetShareSettings = async (headers: any) => {
    const res = await fetch(`${API_BASE_URL}/budget/share`, {
        headers,
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

const createPlannedIncome = async (headers: any, pIncome: any) => {
    const res = await fetch(`${API_BASE_URL}/budget/planned-income`, {
        headers,
        method: "POST",
        body: pIncome
    })
    return await res.json();
}

const deletePlannedIncome = async (headers: any, pIncomeToDelete: any) => {
    const res = await fetch(`${API_BASE_URL}/budget/planned-income`, {
        headers,
        method: "DELETE",
        body: pIncomeToDelete
    })
    return await res.json();
}

export {
    createExpense,
    createIncome,
    getBudget,
    createBudget,
    deleteExpense,
    deleteIncome,
    requestToJoinBudget,
    toggleBudgetShareSettings,
    approveJoinRequest,
    getRequestersList
}