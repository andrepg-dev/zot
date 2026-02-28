import { Fira_Code, Geist, Geist_Mono, Inter } from "next/font/google";

export const interFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const geistSansFont = Geist();

export const fontMono = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono"
});

export const geistMonoFont = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
});
