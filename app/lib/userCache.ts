import { User } from "@/types/user";

interface cachedUser {
    lastFeched: number;
    user: User;
}

export class UserCacheProvider {
    static LOCAL_STORAGE_KEY = "userData";
    static CACHE_TIMEOUT = 60 * 5 * 1000;

    static cacheUserResponse (parsedData: User) {
        localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify({lastFetched: new Date().getTime(), user: parsedData}));
    }

    static getCachedUser () {
        const cachedUser = typeof localStorage != "undefined" ? localStorage.getItem(this.LOCAL_STORAGE_KEY) : null;
        if (!cachedUser) {
            return;
        } 
        try {
            const parsedSavings = JSON.parse(cachedUser) as cachedUser;
            if (parsedSavings.lastFeched + this.CACHE_TIMEOUT < new Date().getTime()) {
                return;
            }
            
            return parsedSavings.user;
        } catch (e) {
            return;
        }
    }

    static clearCachedUser () {
        localStorage.removeItem(this.LOCAL_STORAGE_KEY);
    }
}