import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { AuthProvider } from "../providers/AuthProvider";
import ReduxProvider from "@/redux/provider";
import { ERRORS, getInitialData } from "../lib/getInitialData";
import BudgetProvider from "../providers/BudgetProvider";
import Navigation from "../components/Core/Navigation";
import ReduxInitializer from "../components/ReduxInitializer";
import { FTBDrawer, FTBDrawerProvider } from "../components/ui/ftbDrawer";
import { InitialData } from "@/types/budget";
import JoinOrCreateBudget from "../components/Dashboard/JoinOrCreateBudget";

config.autoAddCss = false

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fix The Bank | Budgeting App",
  description: "A budget app to help keep track of a household budget.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialData = {} as InitialData;
  try {
    initialData = await getInitialData();
  } catch (e: any) {
    switch (e.message) {
      case ERRORS.NO_BUDGET_FOUND: {
        return (
          <html lang="en">
            <body className={`${inter.className} flex flex-wrap min-h-dvh bg-background dark`}>
              <ReduxProvider>
                <AuthProvider>
                  <FTBDrawerProvider>
                    <JoinOrCreateBudget />
                    <FTBDrawer />
                  </FTBDrawerProvider>
                </AuthProvider>
              </ReduxProvider>
            </body>
          </html>
        )
      }
      default: {
        return (
          <html lang="en">
            <body className={`${inter.className} flex flex-wrap min-h-dvh bg-background dark`}>
              An error has occured when pulling initial data. Please try again or file a bug report.
            </body>
          </html>
        )
      }
    }
  }

  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-wrap min-h-dvh bg-background dark`}>
        <ReduxProvider>
          <ReduxInitializer initialData={initialData}>
            <AuthProvider>
              <BudgetProvider initialData={initialData}>
                <FTBDrawerProvider>
                  {children}
                  <Navigation />
                  <FTBDrawer />
                </FTBDrawerProvider>
              </BudgetProvider>
            </AuthProvider>
          </ReduxInitializer>
        </ReduxProvider>
      </body>
    </html>
  );
}
