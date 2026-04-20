import {
  ChartBarIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  InboxStackIcon,
  KeyIcon,
  Square3Stack3DIcon,
  Squares2X2Icon
} from "@heroicons/react/24/outline";

export const defaultNavItems = [
  {
    href: "/app/dashboard",
    label: "Dashboard",
    icon: Squares2X2Icon
  },
  // {
  //   href: "/app/domains",
  //   label: "Domains",
  //   icon: GlobeAltIcon,
  // },
  {
    href: "/app/usage",
    label: "Usage",
    icon: ChartBarIcon
  },
  // {
  //   href: "/app/waitlist/emails",
  //   label: "Emails",
  //   icon: EnvelopeIcon
  // },
  {
    href: "/app/waitlist/dashboard",
    label: "WaitList",
    icon: InboxStackIcon
  },
  {
    label: "Emails",
    icon: EnvelopeIcon,
    subItem: [
      {
        href: "/app/emails/templates",
        label: "Templates"
      },
      {
        href: "/app/emails/chats",
        label: "Chats"
      }
    ]
  },
  {
    href: "/app/api-keys",
    label: "Api keys",
    icon: KeyIcon
  },
  {
    href: "/app/billing",
    label: "Billing",
    icon: CreditCardIcon
  },
  {
    href: "/app/landing-page",
    label: "Landing page",
    icon: Square3Stack3DIcon,
    inDevelopment: true
  },
  {
    href: "/app/domains",
    label: "Domains",
    icon: GlobeAltIcon,
    inDevelopment: true
  },

  { type: "divider" },
  {
    href: "/app/settings",
    label: "Settings",
    icon: Cog6ToothIcon
  }
];

type navItemsType = typeof defaultNavItems;

export interface NavItem {
  href?: string;
  label: string;
  icon?: React.ForwardRefExoticComponent<any>;
  subItem?: NavItem[];
  inDevelopment?: boolean;
}

export interface NavDivider {
  type: "divider";
}

export type NavItemOrDivider = NavItem | NavDivider;

export interface NavItemsI extends navItemsType {
  icon?: React.ForwardRefExoticComponent<any>;
}
