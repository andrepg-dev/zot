export default function Background() {
  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        background: `
       radial-gradient(ellipse 140% 50% at 15% 60%, rgba(59, 130, 246, 0.05), transparent 48%),
       radial-gradient(ellipse 90% 80% at 85% 25%, rgba(245, 101, 101, 0.04), transparent 58%),
       radial-gradient(ellipse 120% 65% at 40% 90%, rgba(34, 197, 94, 0.06), transparent 52%),
       radial-gradient(ellipse 100% 45% at 70% 5%, rgba(251, 191, 36, 0.03), transparent 42%),
       radial-gradient(ellipse 80% 75% at 90% 80%, rgba(168, 85, 247, 0.05), transparent 55%),
       #000000
     `,
      }}
    />
  );
}
