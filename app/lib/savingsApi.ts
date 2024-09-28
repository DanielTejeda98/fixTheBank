import { setSavings } from "@/redux/features/savings-slice";
import { store } from "@/redux/store";
import { SavingsCacheProvider } from "./savingsCache";
import { Savings } from "@/types/savings";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_FTB_HOST}/api/savings`;

export const getSavings = async (useCache?: boolean): Promise<Savings> => {

    if (useCache) {
        try {
            const cachedSavings = SavingsCacheProvider.getCachedSavings();
            if (cachedSavings) 
            {
                store.dispatch(setSavings(cachedSavings));
                return cachedSavings;
            }
        } catch {
            // do nothing if it fails
        }
    }

    const res = await fetch(`${API_BASE_URL}`)

    const parsedData = await res.json()

    if (!parsedData?.data) {
        throw "Could not retrieve savings data";
    }

    SavingsCacheProvider.cacheSavingsResponse(parsedData.data);
    store.dispatch(setSavings(parsedData.data));
    return parsedData.data;
}