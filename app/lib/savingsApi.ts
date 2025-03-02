import { setSavings, updatePlannedSavings } from "@/redux/features/savings-slice";
import { store } from "@/redux/store";
import { SavingsCacheProvider } from "./savingsCache";
import { PlannedSavingRequest, PlannedSavings, Savings, SavingsBucketRequest, SavingsTransactionRequest } from "@/types/savings";

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

export const createSavingsBucket = async (accountId: string, data: SavingsBucketRequest) => {
    const res = await fetch(`${API_BASE_URL}/account/${accountId}/buckets`, {
        method: 'POST',
        body: JSON.stringify(data)
    })

    if (res.ok) {
        getSavings();
    } else {
        console.error("There was an error creating the bucket", res)
    }
}

export const getSavingsPlans = async (month?: string) => {
    try {
        const res = await fetch(`${API_BASE_URL}/planner${month ? `?month=${month}` : ""}`)

        if (!res.ok) {
            return;
        }
    
        const parsedData = await res.json() as PlannedSavings;

        // Patch the cached data so that we don't have to pull the full savings document if we don't need to
        const cachedSavings = SavingsCacheProvider.getCachedSavings();
        if (cachedSavings) {
            const psMonth = cachedSavings.plannedSavings.find(ps => ps.month === month);
            if (psMonth) {
                psMonth.savingsPlans = parsedData.savingsPlans;
            } else {
                cachedSavings.plannedSavings.push(parsedData);
            }
            SavingsCacheProvider.cacheSavingsResponse(cachedSavings);
        }
        store.dispatch(updatePlannedSavings(parsedData))
        return parsedData;
    } catch (error) {
        console.error(error);
    }
}

export const addSavingsPlan = async (request: PlannedSavingRequest, month?: string) => {
    try {
        const res = await fetch(`${API_BASE_URL}/planner${month ? `?month=${month}` : ""}`, {
            method: 'POST',
            body: JSON.stringify(request)
        })

        if (res.ok) {
            return await getSavingsPlans(month);
        }
    } catch (error) {
        console.error(error);
    }
}

export const editSavingsPlan = async (id: string, request: PlannedSavingRequest, month?: string) => {
    try {
        const res = await fetch(`${API_BASE_URL}/planner/${id}${month ? `?month=${month}` : ""}`, {
            method: 'PUT',
            body: JSON.stringify(request)
        })

        if (res.ok) {
            return await getSavingsPlans(month);
        }
    } catch (error) {
        console.error(error);
    }
}

export const deleteSavingsPlan = async (id: string, month?: string) => {
    try {
        const res = await fetch(`${API_BASE_URL}/planner/${id}${month ? `?month=${month}` : ""}`, {
            method: 'DELETE'
        })

        if (res.ok) {
            return await getSavingsPlans(month);
        }
    } catch (error) {
        console.error(error);
    }
}