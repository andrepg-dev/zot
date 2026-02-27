import type { Metadata } from "next";
import { Figtree, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const figTree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zot.so"),
  title: {
    default: "Zot | Launch and validate products with waitlist analytics",
    template: "%s | Zot",
  },
  description:
    "Zot helps developers launch and validate new products with high converting waitlists, real time analytics, and code first email templates.",
  keywords: [
    "Zot",
    "waitlist analytics",
    "product launch",
    "startup validation",
    "developer tools",
    "launch page",
    "email templates",
  ],
  openGraph: {
    title: "Zot | Launch and validate products with waitlist analytics",
    description:
      "Zot helps developers launch and validate new products with high converting waitlists, real time analytics, and code first email templates.",
    url: "https://zot.so",
    siteName: "Zot",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zot dashboard showing waitlist analytics and product launch metrics",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zot | Launch and validate products with waitlist analytics",
    description:
      "Zot helps developers launch and validate new products with high converting waitlists, real time analytics, and code first email templates.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/zot-icon.svg",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistMono.variable} ${figTree.variable} antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
