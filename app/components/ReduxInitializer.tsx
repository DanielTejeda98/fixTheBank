"use client";

import { useSetInitialStore } from "@/redux/features/budget-slice";
import { useLoadSettings } from "../hooks/useLoadSettings";
import { InitialData } from "@/types/budget";
import BudgetCacheProvider from "../lib/budgetCache";
import { SavingsCacheProvider } from "../lib/savingsCache";

export default function ReduxInitializer({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: InitialData;
}) {
  const { savings, mappedBudget } = initialData;
  const { budget, useCachedData } = BudgetCacheProvider.getBudget({
    lastFetched: mappedBudget?.lastFetched,
  });

  const cachedSavings = SavingsCacheProvider.getCachedSavings();

  const freshBudget = useCachedData ? budget : mappedBudget;

  useSetInitialStore({
    budget: freshBudget,
    savings: cachedSavings || savings,
  });
  useLoadSettings();
  return <>{children}</>;
}
