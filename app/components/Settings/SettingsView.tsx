import { useReducer } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import { SETTINGS_STORAGE_KEY } from "@/app/hooks/useLoadSettings"
import { useAppSelector } from "@/redux/store"
import { useDispatch } from "react-redux"
import { SettingsState, setSettings } from "@/redux/features/settings-slice"

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
        <main className="w-full bg-background text-primary m-3">
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
                    <div className="flex items-center mt-3">
                        <div>
                            <p className="text-sm font-medium">Enable Savings Beta</p>
                            <p className="text-sm text-muted-foreground">Enable savings feature beta. This feature is still being developed and can require further changes. USE AT YOUR OWN RISK.</p>
                        </div>
                        <Switch checked={settingsData.enableSavingsBeta} onCheckedChange={() => settingsDataDispatch({...settingsData, enableSavingsBeta: !settingsData.enableSavingsBeta})} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => saveSettings()}>Save Settings</Button>
                </CardFooter>
            </Card>
            <p className="text-sm text-muted-foreground mt-1">Version: Alpha-Release-4</p>
        </main>
    )
}