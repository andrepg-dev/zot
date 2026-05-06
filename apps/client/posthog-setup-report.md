<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Zot Next.js 16 App Router dashboard. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.js` to route PostHog ingestion through `/ingest`. A server-side client (`lib/posthog-server.ts`) handles event capture from API routes. Users are identified on email/password login via `posthog.identify()` using their email as the distinct ID. Error tracking is enabled via `capture_exceptions: true` in the PostHog init config.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logged in with email/password | `app/setup-waitlist/page.tsx` |
| `waitlist_created` | User created a new waitlist | `app/(root-layout)/app/waitlist/launch/page.tsx` |
| `waitlist_deleted` | User permanently deleted a waitlist (churn signal) | `app/(root-layout)/app/launch/waitlist/[id]/settings/page.tsx` |
| `waitlist_status_toggled` | User toggled waitlist active/disabled status | `app/(root-layout)/app/waitlist/dashboard/page.tsx` |
| `oauth_login_completed` | User completed OAuth login (Google/GitHub) | `app/api/auth/callback/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/371838/dashboard/1437417
- **Daily Active Logins**: https://us.posthog.com/project/371838/insights/L9miEWUb
- **Waitlist Activation Funnel** (login → waitlist created → campaign sent): https://us.posthog.com/project/371838/insights/NRhTBSAw
- **Checkout Conversion Funnel** (login → checkout initiated): https://us.posthog.com/project/371838/insights/kX7dR2gz
- **Email Campaigns Sent Over Time**: https://us.posthog.com/project/371838/insights/6qeNbu6r
- **Waitlist Churn (Deletions)**: https://us.posthog.com/project/371838/insights/v1GymJ7N

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
