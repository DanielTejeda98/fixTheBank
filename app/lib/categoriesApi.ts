import { store } from "@/redux/store";
import { getBudget } from "./budgetApi";
import { setBudget } from "@/redux/features/budget-slice";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_FTB_HOST}/api`;

const createCategory = async (headers: any, category: any) => {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    headers,
    method: "POST",
    body: JSON.stringify(category),
  });
  return await res.json();
};

const updateCategory = async (headers: any, categoryUpdate: any) => {
  const res = await fetch(`${API_BASE_URL}/categories/${categoryUpdate._id}`, {
    headers,
    method: "PUT",
    body: JSON.stringify({
      name: categoryUpdate.name,
      sortRank: categoryUpdate.sortRank || 0,
      date: categoryUpdate.date,
      amount: categoryUpdate.amount,
      note: categoryUpdate.note,
    }),
  });
  const parsedRes = await res.json();
  if (!parsedRes.success) {
    throw Error(parsedRes.error);
  }
  const budgetDate = sessionStorage.getItem("selectedBudgetDate") || "";
  const budgetRes = await getBudget(budgetDate);
  store.dispatch(setBudget(budgetRes.data));

  return parsedRes;
};

const deleteCategory = async (headers: any, categoryId: string) => {
  const res = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
    headers,
    method: "DELETE",
  });

  const parsedRes = await res.json();
  if (!parsedRes.success) {
    throw Error(parsedRes.error);
  }

  const budgetDate = sessionStorage.getItem("selectedBudgetDate") || "";
  const budgetRes = await getBudget(budgetDate);
  store.dispatch(setBudget(budgetRes.data));

  return parsedRes;
};

export { createCategory, updateCategory, deleteCategory };
