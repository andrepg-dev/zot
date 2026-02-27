import RootLayoutContent from "@/components/global/root-layout-content";
import Header from "@/components/header/header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 flex flex-col h-screen">
      <Header />
      <RootLayoutContent>{children}</RootLayoutContent>
    </div>
  );
}
