import { setSavings } from "@/redux/features/savings-slice";
import { store } from "@/redux/store";
import { SavingsCacheProvider } from "./savingsCache";
import { Savings, SavingsTransactionRequest } from "@/types/savings";

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

export const createSavingsAccount = async (data: {name: string}) => {
    const res = await fetch(`${API_BASE_URL}/account`, {
        method: 'POST',
        body: JSON.stringify(data)
    })

    if (res.ok) {
        getSavings();
    } else {
        console.error("There was an error creating the account", res);
    }

    return;
}

export const createTransaction = async (data: SavingsTransactionRequest) => {
    const res = await fetch(`${API_BASE_URL}/transaction`, {
        method: 'POST',
        body: JSON.stringify(data)
    })

    if (res.ok) {
        getSavings();
    } else {
        console.error("There was an error creating the transaction", res);
    }

    return;
}