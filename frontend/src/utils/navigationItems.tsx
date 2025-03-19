import React from "react";
import {
  FileTextIcon,
  CalendarIcon,
  MessagesSquareIcon,
  FolderIcon,
  CreditCardIcon,
  UserIcon,
  ClockIcon,
  BriefcaseIcon,
  ScaleIcon,
  FileIcon,
  BarChart3Icon,
  SearchIcon,
  PhoneIcon,
  HelpCircleIcon,
  Settings2Icon,
  NewspaperIcon,
  AlertCircleIcon,
} from "lucide-react";
export interface NavItem {
  label: string;
  path: string;
  icon: JSX.Element;
  type?: "divider" | "section";
  sectionName?: string;
}
export const clientNavItems: NavItem[] = [
  // Case Management
  {
    type: "section",
    sectionName: "Case Management",
  } as NavItem,
  {
    label: "Report New Case",
    path: "/client/report",
    icon: <AlertCircleIcon className="h-5 w-5" />,
  },
  {
    label: "Find a Lawyer",
    path: "/client/find-lawyer",
    icon: <SearchIcon className="h-5 w-5" />,
  },
  {
    label: "My Active Cases",
    path: "/client/cases",
    icon: <BriefcaseIcon className="h-5 w-5" />,
  },
  {
    type: "divider",
  } as NavItem,
  
  {
    label: "Help Center",
    path: "/client/help",
    icon: <HelpCircleIcon className="h-5 w-5" />,
  },
  {
    type: "divider",
  } as NavItem,
  // Billing
  
  {
    label: "Settings",
    path: "/client/settings",
    icon: <Settings2Icon className="h-5 w-5" />,
  },
];
export const lawyerNavItems: NavItem[] = [
  // Case Management
  {
    type: "section",
    sectionName: "Cases",
  } as NavItem,
  {
    label: "Available Cases",
    path: "/lawyer",
    icon: <SearchIcon className="h-5 w-5" />,
  },
  {
    label: "My Assigned Cases",
    path: "/lawyer/assigned-case",
    icon: <BriefcaseIcon className="h-5 w-5" />,
  },
  {
    type: "divider",
  } as NavItem,
  // Schedule

  {
    label: "Calendar",
    path: "/lawyer/calendar",
    icon: <CalendarIcon className="h-5 w-5" />,
  },
  {
    type: "divider",
  } as NavItem,
  {
    label: "Client Directory",
    path: "/lawyer/clients",
    icon: <UserIcon className="h-5 w-5" />,
  },
  
  {
    label: "Settings",
    path: "/lawyer/settings",
    icon: <Settings2Icon className="h-5 w-5" />,
  },
];
