import {
  Cog6ToothIcon,
  CreditCardIcon,
  GlobeAltIcon,
  InboxStackIcon,
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
    href: "/app/billing",
    label: "Billing",
    icon: CreditCardIcon
  },
  // {
  //   href: "/app/emails",
  //   label: "Emails",
  //   icon: EnvelopeIcon
  // },
  {
    label: "WaitList",
    icon: InboxStackIcon,
    subItem: [
      {
        href: "/app/waitlist/dashboard",
        label: "Dashboard"
      },
      {
        href: "/app/waitlist/emails",
        label: "Emails"
      }
    ]
  },
  {
    href: "/app/landing-page",
    label: "Landing page",
    icon: Square3Stack3DIcon
  },
  {
    href: "/app/waitlist/domains",
    label: "Domains",
    icon: GlobeAltIcon
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
}

export interface NavDivider {
  type: "divider";
}

export type NavItemOrDivider = NavItem | NavDivider;

export interface NavItemsI extends navItemsType {
  icon?: React.ForwardRefExoticComponent<any>;
}
