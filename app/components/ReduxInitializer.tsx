"use client"

import { useLoadSettings } from "../hooks/useLoadSettings";

export default function ReduxInitializer({ children }: { children: React.ReactNode, initialData: any }) {
    useLoadSettings();
    return (<>{children}</>)
}