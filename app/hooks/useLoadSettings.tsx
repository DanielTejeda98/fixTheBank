import { setSettings } from "@/redux/features/settings-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
export const SETTINGS_STORAGE_KEY = 'userSettings'
export const useLoadSettings = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const storedData = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (!storedData) {
            return;
        }
        try {
            const parsedData = JSON.parse(storedData);
            dispatch(setSettings(parsedData))
        } catch (error) {
            //Do nothing
        }
    }, [dispatch])
}