"use client"
import { useReducer } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import { SETTINGS_STORAGE_KEY } from "@/app/hooks/useLoadSettings"
import { useAppSelector } from "@/redux/store"
import { useDispatch } from "react-redux"
import { SettingsState, setSettings } from "@/redux/features/settings-slice"
import Link from "next/link"

export default function SettingsView () {
    const settings = useAppSelector((state) => state.settingsReducer.value)
    const [settingsData, settingsDataDispatch] = useReducer((state: SettingsState, action: SettingsState):SettingsState => {
        return {...state, ...action}
    }, {
        ...settings
    })
    const reduxDispatch = useDispatch();

    const saveSettings = () => {
        const stringifiedData = JSON.stringify(settingsData);
        localStorage.setItem(SETTINGS_STORAGE_KEY, stringifiedData);
        reduxDispatch(setSettings(settingsData))
    }

    return (
        <main className="w-full flex flex-col gap-2 bg-background text-primary m-3">
            <Link href={"/settings/accounts"}>
                <Button variant={"outline"} className="w-full py-6 justify-start">Manage Budget Accounts</Button>
            </Link>
            <Button variant={"outline"} className="w-full py-6 justify-start">Manage Access</Button>
            <Card>
                <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>
                        Manage all user settings.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center">
                        <div>
                            <p className="text-sm font-medium">Dark mode</p>
                            <p className="text-sm text-muted-foreground">Change the application to use a dark background with light text.</p>
                        </div>
                        <Switch checked={settingsData.useDarkMode} onCheckedChange={() => settingsDataDispatch({...settingsData, useDarkMode: !settingsData.useDarkMode})} />
                    </div>
                    <div className="flex items-center mt-3">
                        <div>
                            <p className="text-sm font-medium">Date &quot;Today&quot; button on left</p>
                            <p className="text-sm text-muted-foreground">Change the location of the &quot;Today&quot; button to the left of the field.</p>
                        </div>
                        <Switch checked={settingsData.dateTodayButtonOnLeft} onCheckedChange={() => settingsDataDispatch({...settingsData, dateTodayButtonOnLeft: !settingsData.dateTodayButtonOnLeft})} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => saveSettings()}>Save Settings</Button>
                </CardFooter>
            </Card>
            <p className="text-sm text-muted-foreground mt-1">Version: 0.0.2</p>
        </main>
    )
}