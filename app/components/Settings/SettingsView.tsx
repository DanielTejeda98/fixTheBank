"use client";
import { useReducer, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { SETTINGS_STORAGE_KEY } from "@/app/hooks/useLoadSettings";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { SettingsState, setSettings } from "@/redux/features/settings-slice";
import Link from "next/link";
import { toggleBudgetShareSettings } from "@/app/lib/budgetApi";
import { setBudgetShareSettings } from "@/redux/features/budget-slice";

function ShareCodeDisplay({ shareCode }: { shareCode: string }) {
  const copySharecodeToClipboard = () => {
    navigator.clipboard.writeText(shareCode);
  };

  return (
    <div
      className="mt-2 p-2 bg-secondary/10 border border-secondary rounded-md w-fit"
      onClick={copySharecodeToClipboard}
      tabIndex={0}
    >
      <p className="text-sm">Share Code:</p>
      <p className="font-mono break-all">{shareCode}</p>
    </div>
  );
}

export default function SettingsView() {
  const settings = useAppSelector((state) => state.settingsReducer.value);
  const isBudgetOwner = useAppSelector(
    (state) => state.budgetReducer.value.isOwner
  );
  const isShared = useAppSelector(
    (state) => state.budgetReducer.value.isShared
  );
  const shareCode = useAppSelector(
    (state) => state.budgetReducer.value.shareCode
  );
  const [isBudgetShared, setIsBudgetShared] = useState(isShared);

  const [settingsData, settingsDataDispatch] = useReducer(
    (state: SettingsState, action: SettingsState): SettingsState => {
      return { ...state, ...action };
    },
    {
      ...settings,
    }
  );
  const reduxDispatch = useDispatch();

  const saveSettings = async () => {
    const stringifiedData = JSON.stringify(settingsData);
    localStorage.setItem(SETTINGS_STORAGE_KEY, stringifiedData);
    reduxDispatch(setSettings(settingsData));

    await processBudgetShareUpdates();
  };

  const processBudgetShareUpdates = async () => {
    if (isShared === isBudgetShared) {
      return;
    }

    try {
      const res = await toggleBudgetShareSettings();
      if (!res.success) {
        console.log(res.error);
      }

      reduxDispatch(
        setBudgetShareSettings({
          isShared: !!res.data?.joinCode,
          shareCode: res.data?.joinCode || null,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="w-full flex flex-col gap-2 bg-background text-primary m-3">
      <Link href={"/settings/accounts"}>
        <Button variant={"outline"} className="w-full py-6 justify-start">
          Manage Budget Accounts
        </Button>
      </Link>
      {isBudgetOwner && (
        <>
          <Link href={"/settings/access"}>
            <Button variant={"outline"} className="w-full py-6 justify-start">
              Manage Access
            </Button>
          </Link>
          <Card>
            <CardHeader>
              <CardTitle>Budget Settings</CardTitle>
              <CardDescription>
                Manage all budget related settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div>
                  <p className="text-sm font-medium">Share Budget</p>
                  <p className="text-sm text-muted-foreground">
                    Turn on this feature to share your budget with other users.
                  </p>
                  {isBudgetShared && !!shareCode ? (
                    <ShareCodeDisplay shareCode={shareCode} />
                  ) : null}
                </div>
                <Switch
                  checked={isBudgetShared}
                  onCheckedChange={() => setIsBudgetShared(!isBudgetShared)}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage all user settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium">Dark mode</p>
              <p className="text-sm text-muted-foreground">
                Change the application to use a dark background with light text.
              </p>
            </div>
            <Switch
              checked={settingsData.useDarkMode}
              onCheckedChange={() =>
                settingsDataDispatch({
                  ...settingsData,
                  useDarkMode: !settingsData.useDarkMode,
                })
              }
            />
          </div>
          <div className="flex items-center mt-3">
            <div>
              <p className="text-sm font-medium">
                Date &quot;Today&quot; button on left
              </p>
              <p className="text-sm text-muted-foreground">
                Change the location of the &quot;Today&quot; button to the left
                of the field.
              </p>
            </div>
            <Switch
              checked={settingsData.dateTodayButtonOnLeft}
              onCheckedChange={() =>
                settingsDataDispatch({
                  ...settingsData,
                  dateTodayButtonOnLeft: !settingsData.dateTodayButtonOnLeft,
                })
              }
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => saveSettings()}
          >
            Save Settings
          </Button>
        </CardFooter>
      </Card>
      <p className="text-sm text-muted-foreground mt-1">Version: 0.5.0</p>
    </main>
  );
}
