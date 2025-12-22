import {
  CreditCardIcon,
  CursorArrowRippleIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  Square3Stack3DIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

export const defaultNavItems = [
  {
    href: "/app/dashboard",
    label: "Dashboard",
    icon: Squares2X2Icon,
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
    href: "/app/emails",
    label: "Emails",
    icon: EnvelopeIcon,
  },
  {
    href: "/app/landing-page",
    label: "Landing page",
    icon: Square3Stack3DIcon,
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
