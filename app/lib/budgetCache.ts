import { BudgetView } from "@/types/budget";

interface GetBudgetOptions {
    lastFetched?: number
}

class BudgetCacheProvider {
        /**
         * Use this method to get the cached budget and determine if the age of the cache is better than the NextJS cached version
         * @param options - The options object
         * @param options.lastFetched - Last fetched time that can be compared against to determine if to use the last fetched
         * @returns 
         */
        static getBudget ({...options}: GetBudgetOptions) {
            // Handle the fact that NextJS caches our data from inital load
        let useCachedData = false;
        // Check that local storage exists, in case we run in the server
        const cachedBudget = typeof localStorage != "undefined" ? localStorage.getItem("budgetData") : null;
        const parsedCachedBudget = cachedBudget ? JSON.parse(cachedBudget) as BudgetView : null;
            if (options.lastFetched) {
                if (parsedCachedBudget && (options.lastFetched < parsedCachedBudget.lastFetched)) {
                    useCachedData = true;
                }
            }

        return { budget: parsedCachedBudget, useCachedData }
    }
}

export default BudgetCacheProvider