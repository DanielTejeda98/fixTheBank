import { Metadata } from "next";
import { Inter } from "next/font/google";
import { config } from '@fortawesome/fontawesome-svg-core'
import "./globals.css";
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Fix The Bank | Budgeting App",
    description: "A budget app to help keep track of a household budget.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} flex flex-wrap min-h-dvh bg-background dark`}>
                {children}
            </body>
        </html>
    )
}