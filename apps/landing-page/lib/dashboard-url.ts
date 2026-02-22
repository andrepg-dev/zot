/**
 * URL del dashboard de la app frontend (client).
 * Configurable vía NEXT_PUBLIC_FRONTEND_APP_URL en .env
 */
export function getDashboardUrl(): string {
  const base = process.env.NEXT_PUBLIC_FRONTEND_APP_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/app/dashboard`;
}
