import { setBudget } from "@/redux/features/budget-slice";
import { getBudget } from "./budgetApi";
import { store } from "@/redux/store";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_FTB_HOST}/api`;

const createAccount = async (headers: any, account: { name: string }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/account`, {
      headers,
      method: "POST",
      body: JSON.stringify(account),
    });

    const budgetDate = sessionStorage.getItem("selectedBudgetDate") || "";
    const budgetRes = await getBudget(budgetDate);
    store.dispatch(setBudget(budgetRes.data));

    return await res.json();
  } catch (e) {
    // Handle error
    console.error(e);
  }
};

const updateAccount = async (
  headers: any,
  id: string,
  account: { name: string }
) => {
  try {
    const res = await fetch(`${API_BASE_URL}/account/${id}`, {
      headers,
      method: "PUT",
      body: JSON.stringify(account),
    });

    const budgetDate = sessionStorage.getItem("selectedBudgetDate") || "";
    const budgetRes = await getBudget(budgetDate);
    store.dispatch(setBudget(budgetRes.data));

    return await res.json();
  } catch (e) {
    // Handle error
    console.error(e);
  }
};

const deleteAccount = async (headers: any, id: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/account/${id}`, {
      headers,
      method: "DELETE",
    });

    const budgetDate = sessionStorage.getItem("selectedBudgetDate") || "";
    const budgetRes = await getBudget(budgetDate);
    store.dispatch(setBudget(budgetRes.data));

    return await res.json();
  } catch (e) {
    // Handle error
    console.error(e);
  }
};

export { createAccount, updateAccount, deleteAccount };
