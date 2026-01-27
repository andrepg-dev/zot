import Tabulation from "./tab";

export default function HeaderTabulation() {
  return (
    <header className="bg-default-50 border-r flex">
      <Tabulation title="page.tsx" />
      <Tabulation title="react-component.tsx" isActive />
    </header>
  );
}
