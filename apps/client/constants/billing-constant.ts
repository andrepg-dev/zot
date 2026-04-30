export const ANNUAL_DISCOUNT = 0.16;

export const plans = [
  {
    name: "Free",
    price: { monthly: "$0", annual: "$0" },
    priceSuffix: { monthly: "/ month", annual: "/ month" },
    blurb: "A demo to try Zot before you launch.",
    ctaLabel: "Free plan",
    ctaHref: "/app/waitlist/launch",
    popular: false,
    features: [
      "500 users signup limit",
      "1 waitlist",
      "1 landing page",
      "50 users emailed per month",
      "Custom email creation",
      "Export your data",
      "Analytics for signups and sent emails"
    ]
  },
  {
    name: "Starter",
    price: { monthly: "$19", annual: "$16" },
    priceSuffix: { monthly: "/ month", annual: "/ month" },
    blurb: "For indie hackers who already validated something.",
    ctaLabel: "Upgrade plan",
    ctaHref: "/app/billing",
    popular: false,
    features: [
      "5,000 users signup limit",
      "3 waitlists maximum",
      "1,000 users emailed per month",
      "Custom email creation",
      "1 domain for branded emails",
      "Analytics for signups and sent emails",
      "Export your data"
    ]
  },
  {
    name: "Pro",
    price: { monthly: "$49", annual: "$41" },
    priceSuffix: { monthly: "/ month", annual: "/ month" },
    blurb: "For products in production that need real headroom.",
    ctaLabel: "Upgrade plan",
    ctaHref: "/app/billing",
    popular: true,
    features: [
      "50,000 users signup limit",
      "10 waitlists maximum",
      "10,000 users emailed per month",
      "Custom email creation",
      "10 domains for branded emails",
      "Extra security to block fake or disposable emails",
      "Analytics for sent emails and registered users",
      "Export your data",
      "Use more powerful AI models",
      "Priority support"
    ]
  }
];
