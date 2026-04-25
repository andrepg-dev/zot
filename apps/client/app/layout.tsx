import QueryProvider from "@/components/query-provider";
import { geistMonoFont, interFont } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import "@/styles/globals.css";
import { ToastProvider } from "@heroui/toast";
import clsx from "clsx";
import { Metadata } from "next";
import React from "react";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`
  },
  description: siteConfig.description,
  icons: {
    icon: [
      { url: "/favicon_io/favicon.ico" },
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: "/favicon_io/apple-touch-icon.png",
    other: [
      {
        rel: "manifest",
        url: "/favicon_io/site.webmanifest"
      }
    ]
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
          <ToastProvider toastProps={{ radius: "sm" }} placement="top-right" />
          <Providers themeProps={{ attribute: "class", forcedTheme: "dark" }}>
            {/* <NextTopLoader
            color="#006fee"
            height={3}
            showSpinner={false}
            zIndex={100000}
          /> */}
            <QueryProvider>{children}</QueryProvider>
          </Providers>
          <Analytics />
        </body>
      </html>
    </>
  );
}
