import {
  ChartBarIcon,
  CreditCardIcon,
  CursorArrowRippleIcon,
  GlobeAltIcon,
  KeyIcon,
  NewspaperIcon
} from "@heroicons/react/24/outline";

export const defaultNavItems = [
  {
    href: "/app/dashboard",
    label: "Dashboard",
    icon: ChartBarIcon,
  },
  {
    href: "/app/domains",
    label: "Domains",
    icon: GlobeAltIcon,
  },
  {
    href: "/app/billing",
    label: "Billing",
    icon: CreditCardIcon,
  },
  {
    href: "/app/google-search",
    label: "Google Search",
    icon: KeyIcon,
  },
  {
    href: "/app/landing-page",
    label: "Landing page",
    icon: NewspaperIcon,
  },
  {
    href: "/app/waitlist",
    label: "WaitList",
    icon: CursorArrowRippleIcon,
  },
];

type navItemsType = typeof defaultNavItems;

export interface NavItemsI extends navItemsType {
  icon?: React.ForwardRefExoticComponent<any>;
}
