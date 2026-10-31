import type { Role } from '@/shared/roles';

/**
 * The sidebar, exactly as defined in Docs/DESIGN.md section 9 (14 items, 17 modules).
 * Nothing is added, renamed or reordered without updating DESIGN.md and the PRD mapping.
 */
export type NavIcon =
  | 'home'
  | 'users'
  | 'funnel'
  | 'plane'
  | 'doc'
  | 'cal'
  | 'bldg'
  | 'msg'
  | 'wallet'
  | 'pct'
  | 'tasks'
  | 'bolt'
  | 'bars'
  | 'gear';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: NavIcon;
  /** PRD modules this item covers. */
  modules: readonly string[];
  /** Roles that can see the item. Roles that cannot use it do not get it at all (no locked items). */
  roles: readonly Role[];
}

export const HOME_ITEM_ID = 'home';

const ALL: readonly Role[] = ['executive', 'sales_manager', 'broker', 'finance'];

const NAV_ITEMS: readonly NavItem[] = [
  { id: HOME_ITEM_ID, label: '', href: '/dashboard', icon: 'home', modules: ['01'], roles: ALL },
  {
    id: 'customers',
    label: 'Customers',
    href: '/customers',
    icon: 'users',
    modules: ['02'],
    roles: ['executive', 'sales_manager', 'broker'],
  },
  {
    id: 'leads',
    label: 'Leads & Opportunities',
    href: '/sales/leads',
    icon: 'funnel',
    modules: ['03'],
    roles: ['executive', 'sales_manager', 'broker'],
  },
  {
    id: 'trips',
    label: 'Charter Trips',
    href: '/trips',
    icon: 'plane',
    modules: ['04', '05'],
    roles: ['executive', 'sales_manager', 'broker'],
  },
  {
    id: 'rfqs',
    label: 'RFQs & Quotes',
    href: '/rfqs',
    icon: 'doc',
    modules: ['06', '07'],
    roles: ['executive', 'sales_manager', 'broker'],
  },
  {
    id: 'bookings',
    label: 'Bookings',
    href: '/bookings',
    icon: 'cal',
    modules: ['08'],
    roles: ALL,
  },
  {
    id: 'operators',
    label: 'Operators',
    href: '/operators',
    icon: 'bldg',
    modules: ['09'],
    roles: ['executive', 'sales_manager'],
  },
  {
    id: 'communications',
    label: 'Communications',
    href: '/communications',
    icon: 'msg',
    modules: ['10'],
    roles: ['executive', 'sales_manager', 'broker'],
  },
  {
    id: 'finance',
    label: 'Finance & Payments',
    href: '/finance',
    icon: 'wallet',
    modules: ['11', '12'],
    roles: ['executive', 'finance'],
  },
  {
    id: 'commissions',
    label: 'Broker Commissions',
    href: '/commissions',
    icon: 'pct',
    modules: ['13'],
    roles: ['executive', 'finance', 'broker'],
  },
  {
    id: 'tasks',
    label: 'Tasks & Follow-ups',
    href: '/tasks',
    icon: 'tasks',
    modules: ['14'],
    roles: ALL,
  },
  {
    id: 'automation',
    label: 'Automation',
    href: '/automation',
    icon: 'bolt',
    modules: ['15'],
    roles: ['executive', 'sales_manager'],
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    href: '/reports',
    icon: 'bars',
    modules: ['16'],
    roles: ['executive', 'sales_manager', 'finance'],
  },
  {
    id: 'admin',
    label: 'Administration',
    href: '/admin',
    icon: 'gear',
    modules: ['17'],
    roles: ['executive'],
  },
];

/** Label of the first menu item, which is named per role (DESIGN.md section 9). */
export const HOME_LABEL: Record<Role, string> = {
  executive: 'Executive Dashboard',
  sales_manager: 'Team Dashboard',
  broker: 'My Workspace',
  finance: 'Finance Dashboard',
};

export interface NavEntry extends NavItem {
  /** True for the single item that is followed by the divider. */
  dividerBefore: boolean;
}

/** The menu a role is allowed to see, in order. */
export function navigationFor(role: Role): NavEntry[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(role)).map((item) => ({
    ...item,
    label: item.id === HOME_ITEM_ID ? HOME_LABEL[role] : item.label,
    dividerBefore: item.id === 'admin',
  }));
}

/** True when the role may open the route. Used by the route guard for module pages. */
export function canOpen(role: Role, pathname: string): boolean {
  if (pathname === '/dashboard') return true;
  return NAV_ITEMS.some((item) => item.roles.includes(role) && pathname.startsWith(item.href));
}

/** All module routes (every role), used to generate the "later phase" pages. */
export const MODULE_ROUTES: readonly { href: string; label: string; modules: readonly string[] }[] =
  NAV_ITEMS.filter((item) => item.id !== HOME_ITEM_ID);
