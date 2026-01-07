import RootLayoutContent from "@/components/global/root-layout-content";
import Header from "@/components/header/header";
import QueryProvider from "@/components/query-provider";
import { interFont } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import "@/styles/globals.css";
import { ToastProvider } from "@heroui/toast";
import clsx from "clsx";
import { Metadata } from "next";
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
          interFont.variable
        )}
      >
        <ToastProvider />
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          {/* <NextTopLoader
            color="#006fee"
            height={3}
            showSpinner={false}
            zIndex={100000}
          /> */}
          <QueryProvider>
            <div className="relative z-10 flex flex-col h-screen overflow-hidden">
              <Header />
              <RootLayoutContent>{children}</RootLayoutContent>

              {/* <div className="flex flex-row flex-1 bg-[#060606] overflow-hidden">
                <Sidebar />
                <main
                  className={
                    "w-full overflow-y-auto bg-black rounded-t-xl border border-b-0"
                  }
                >
                  {children}
                </main>
              </div> */}
            </div>
          </QueryProvider>
        </Providers>
      </body>
    </html>
  );
}
