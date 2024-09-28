import { Savings } from "@/types/savings";

interface cachedSavings {
    lastFeched: number;
    savings: Savings;
}

export class SavingsCacheProvider {
    static LOCAL_STORAGE_KEY = "savingsData";
    static CACHE_TIMEOUT = 60 * 5 * 1000;

    static cacheSavingsResponse (parsedData: Savings) {
        localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify({lastFetched: new Date().getTime(), savings: parsedData}));
    }

    static getCachedSavings () {
        const cachedSavings = typeof localStorage != "undefined" ? localStorage.getItem(this.LOCAL_STORAGE_KEY) : null;
        if (!cachedSavings) {
            return;
        } 
        try {
            const parsedSavings = JSON.parse(cachedSavings) as cachedSavings;
            if (parsedSavings.lastFeched + this.CACHE_TIMEOUT < new Date().getTime()) {
                return;
            }
            
            return parsedSavings.savings;
        } catch (e) {
            return;
        }
    }

    static clearCachedSavings () {
        localStorage.removeItem(this.LOCAL_STORAGE_KEY);
    }
}