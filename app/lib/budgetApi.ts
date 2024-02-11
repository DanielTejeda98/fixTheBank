const API_BASE_URL = `${process.env.NEXT_PUBLIC_FTB_HOST}/api`

const createExpense = async (headers: any, expense: any) => {
    const res = await fetch(`http://${API_BASE_URL}/expense`, {
        headers,
        method: "POST",
        body: JSON.stringify(expense)
    })
    return await res.json();
}

const createIncome = async (headers: any, income: any) => {
    const res = await fetch(`http://${API_BASE_URL}/income`, {
        headers,
        method: "POST",
        body: JSON.stringify(income)
    })
    return await res.json();
}

const getBudget = async (headers: any, budgetDate?: Date) => {
    const res = await fetch(`http://${API_BASE_URL}/budget${budgetDate ? "?budgetDate=" + budgetDate.toString() : ""}`, {
        headers
    })
    return await res.json()
}

const createBudget = async (headers: any) => {
    const res = await fetch(`http://${API_BASE_URL}/budget`, {
        headers,
        method: "POST"
    })
    return await res.json()
}

const deleteExpense = async (headers: any, expenseId: string) => {
    const res = await fetch(`http://${API_BASE_URL}/expense`, {
        headers,
        method: "DELETE",
        body: JSON.stringify({
            expenseId
        })
    })
    return await res.json();
}

const deleteIncome = async (headers: any, incomeId: string) => {
    const res = await fetch(`http://${API_BASE_URL}/income`, {
        headers,
        method: "DELETE",
        body: JSON.stringify({
            incomeId
        })
    })
    return await res.json();
}

export {
    createExpense,
    createIncome,
    getBudget,
    createBudget,
    deleteExpense,
    deleteIncome 
}