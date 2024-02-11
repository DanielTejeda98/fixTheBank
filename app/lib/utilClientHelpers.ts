"use client"
export const getUserFromCookie = () => {
    return JSON.parse(getBrowserCookie("session"))
}

export const getBrowserCookie = (name: string): string => {
    let decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    const cookieMap = new Map();
    cookies.forEach(cookie => {
        let [key, value] = cookie.split("=");
        if(key.charAt(0) === " ") {
            key = key.substring(1);
        }
        cookieMap.set(key, value);
    })

    return cookieMap.get(name)
}