import { AuthProvider } from "../providers/AuthProvider";
import ReduxProvider from "@/redux/provider";
import { ERRORS, getInitialData } from "../lib/getInitialData";
import Navigation from "../components/Core/Navigation";
import ReduxInitializer from "../components/ReduxInitializer";
import { FTBDrawer, FTBDrawerProvider } from "../components/ui/ftbDrawer";
import { InitialData } from "@/types/budget";
import JoinOrCreateBudget from "../components/Dashboard/JoinOrCreateBudget";

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
          <ReduxProvider>
            <AuthProvider>
              <FTBDrawerProvider>
                <JoinOrCreateBudget />
                <FTBDrawer />
              </FTBDrawerProvider>
            </AuthProvider>
          </ReduxProvider>
        );
      }
      default: {
        return (
          <p>
            An error has occured when pulling initial data. Please try again or
            file a bug report.
          </p>
        );
      }
    }
  }

  return (
    <ReduxProvider>
      <ReduxInitializer initialData={initialData}>
        <AuthProvider>
          <FTBDrawerProvider>
            {children}
            <Navigation />
            <FTBDrawer />
          </FTBDrawerProvider>
        </AuthProvider>
      </ReduxInitializer>
    </ReduxProvider>
  );
}
