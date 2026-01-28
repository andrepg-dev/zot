import Tabulation from "./tab";

interface Tab {
  title: string;
  isActive?: boolean;
}

interface HeaderTabulationProps {
  tabs: Tab[];
}

export default function HeaderTabulation({ tabs }: HeaderTabulationProps) {
  return (
    <header className="bg-default-50 flex">
      {tabs && tabs.map((tab, index) => (
        <Tabulation key={`${tab.title}-${index}`} title={tab.title} isActive={tab.isActive} />
      ))}
    </header>
  );
}
