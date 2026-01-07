export default function Background() {
  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        background: `
       radial-gradient(ellipse 120% 65% at 40% 90%, rgba(34, 197, 94, 0.06), transparent 52%),
       radial-gradient(ellipse 80% 75% at 90% 80%, rgba(168, 85, 247, 0.05), transparent 55%),
       #000000
     `
      }}
    />
  );
}
