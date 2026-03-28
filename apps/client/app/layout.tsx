import QueryProvider from "@/components/query-provider";
import { geistMonoFont, interFont } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import "@/styles/globals.css";
import { ToastProvider } from "@heroui/toast";
import clsx from "clsx";
import { Metadata } from "next";
import React from "react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`
  },
  description: siteConfig.description,
  icons: {
    icon: "/zot-icon.svg"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <html suppressHydrationWarning lang="en">
        <body
          className={clsx(
            "min-h-screen text-foreground antialiased relative",
            interFont.variable,
            geistMonoFont.variable
          )}
        >
          <ToastProvider toastProps={{ radius: "sm" }} />
          <Providers themeProps={{ attribute: "class", forcedTheme: "dark" }}>
            {/* <NextTopLoader
            color="#006fee"
            height={3}
            showSpinner={false}
            zIndex={100000}
          /> */}
            <QueryProvider>
              {children}
            </QueryProvider>
          </Providers>
        </body>
      </html>
    </>
  )
}
