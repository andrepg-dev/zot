import Header from "@/components/header/header";
import QueryProvider from "@/components/query-provider";
import Sidebar from "@/components/sidebar/sidebar";
import { fontSans } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import "@/styles/globals.css";
import { ToastProvider } from "@heroui/toast";
import clsx from "clsx";
import { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/icons/waitlean.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={clsx(
          "min-h-screen text-foreground font-sans antialiased bg-black relative dark",
          fontSans.variable,
        )}
      >
        <ToastProvider />
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <NextTopLoader
            color="#006fee"
            height={3}
            showSpinner={false}
            zIndex={100000}
          />
          <QueryProvider>
            <div className="relative z-10 flex flex-col h-screen overflow-hidden">
              <Header />

              <div className="flex flex-row flex-1  bg-[#060606] overflow-hidden">
                <Sidebar />
                {/* Content */}
                <main className="w-full overflow-y-auto bg-black m-2 mb-0 rounded-t-xl ml-0 border border-b-0">
                  {children}
                </main>
              </div>
            </div>
          </QueryProvider>
        </Providers>
      </body>
    </html>
  );
}
